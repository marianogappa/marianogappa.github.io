---
title: "9 months in: building an advanced StarCraft reporting tool with Go & Claude"
date: 2026-07-14
draft: false
slug: "building-an-advanced-starcraft-reporting-tool"
summary: "The story of how I built screpdb, an advanced StarCraft: Brood War replay reporting tool, using Go & Claude over 9 months, and what AI could and couldn't do along the way."
image: /images/posts/screpdb-hero.jpg
---

## How it started

When I was 15, I met my best mate at a LAN party in downtown Buenos Aires, right as the StarCraft: Brood War craze was catching fire. We fell in love with the game on the spot.

It's 2026 now, we have jobs and live on opposite ends of the world, but we still Zoom almost every weekend to play and mess around. And through that decades-long passion came an idea.

## The idea, on a weekend call

"What if we could just *ask* an AI in natural language about the game we'd just played?"

e.g.:
- Does this guy always go Carriers?
- Did all 3 of them ally against us last game?
- What's the average time I should have turrets against this particular Zerg?

The natural shape for that is an [MCP server](https://en.wikipedia.org/wiki/Model_Context_Protocol), but what do we feed to it?

Brood War writes a replay file (a `.rep`) after every game, which lets the game client play the game back to you. But MCP doesn't read StarCraft replay files.

So I went looking for parsers, and András Belicza's [screp](https://github.com/icza/screp) was the natural choice (which is already written in Go).

Thus, `screpdb` was born:
1. Parse replays using `screp`
2. Structure the output and ingest it onto a relational database (SQLite)
3. Put an MCP server in front

The [first commit](https://github.com/marianogappa/screpdb/commit/70a437bc65b24d3307683de7fe9a706fed9c014f) landed on **September 30th, 2025**.

## From chatbot to reporting tool

Then we actually used it for a couple of sessions, and something felt off. Typing questions to a chatbot was an impedance mismatch.

![The early version: Claude querying screpdb over MCP and drawing its own chart](/images/posts/screpdb-mcp-chat.jpg)
*The first version: Claude querying screpdb over MCP and drawing its own chart. Powerful, but asking a chatbot to rebuild every view, every time, got old fast.*

What we wanted wasn't a conversation. It was a *reporting tool*.

However, that's a much bigger build. Before I'd get into that, I'd want to see what options already existed.

## The tools that already existed

**[BWChart](https://bwchart.wordpress.com/bwchart-release-notes/)** is the pioneer tool we all used since 2003. Its last update was in 2017, after which SCRChart (below) superseded it. Its [Liquipedia page](https://liquipedia.net/starcraft/BWChart) has the full history.

![BWChart 1.04C, the 2003-era classic, showing per-player APM charts and a command log](/images/posts/screpdb-bwchart.jpg)

**[SCRChart](https://www.scrchart.com/)** is the 2019 heir to BWChart, though it seems to have been abandoned later that same year. Being a Java application, it's cross-platform.

![SCRChart graphing APM and effective APM through a Terran vs Zerg game](/images/posts/screpdb-scrchart.jpg)

**[RepMastered](https://repmastered.icza.net/)** is [András Belicza](https://github.com/icza)'s excellent web database and in-browser analyzer, built on his `screp` parser, which this whole project stands on ([intro thread](https://tl.net/forum/brood-war/558819-repmastered-replay-sharing-and-analyzer-site)). It holds [over 100 million replays](https://tl.net/forum/brood-war/558819-repmastered-replay-sharing-and-analyzer-site?page=13#246) and is fully featured:

- Bulk-upload and share replays, even whole folders at once.
- A huge, filterable database: search by player, map, matchup, or tag.
- In-browser analysis: APM/EAPM, hotkeys, build-order and strategy charts, and an animated map replay.

![RepMastered's in-browser game page with its animated map view](/images/posts/screpdb-repmastered.jpg)

**[vespene.gg](https://vespene.gg)** is the newest arrival (2026) and the boldest: according to its creator, dethsc, responding to my question in the [intro thread on TL.net](https://tl.net/forum/brood-war/645147-vespenegg-bw-replays-in-browser), it's a fresh reverse-engineering of SC:R's binaries, which lets you upload a replay and watch the game in-browser, with all kinds of real-time metrics, an AI coach, a replay database, tournaments, Twitch streams and more.

![vespene.gg playing a Brood War replay in the browser, with a live build-order feed and AI coach](/images/posts/screpdb-vespene.jpg)

These are great tools. But what we needed wasn't quite covered. We wanted to see **higher-level semantics** during our play sessions.

But before building the reporting tool, I had to learn how tricky it was to get semantics from a replay file.

## Why StarCraft replays are secretly, wonderfully hard

A StarCraft replay does not record what happened. It records **only the commands**: the stream of orders each player issued.

The engineering of the game engine and replays is fascinating, but it's not the focus of this article; if you're interested, I vibe-coded this didactic site that goes deeper into it while staying approachable: [*Inside Brood War*](https://marianogappa.github.io/inside-brood-war/).

[![Inside Brood War, an interactive explainer of how the Brood War engine and replays work](/images/posts/screpdb-inside-bw.jpg)](https://marianogappa.github.io/inside-brood-war/)

In short: in order to know what really happened in the game, you'd need to run the commands against the game engine, but as of SC:Remastered, there's no headless API to do this (BWAPI & OpenBW exist for pre-remastered but come with tradeoffs; dethsc's reverse-engineering of Remastered is closed source).

This means that certain things just cannot be answered from replays alone:
- How many resources does each player have over time? Is a player supply-blocked right now?
- A unit was created, but was it killed later? Was a building destroyed?
- A unit was ordered to go somewhere, but was it able to arrive there? When?

![An in-game view with the resource, supply, and APM panel highlighted: "Replays don't store this!"](/images/posts/screpdb-replays-dont-store.jpg)

And the commands themselves are noisy:
- **Spam.** Plenty of orders were recorded but rejected by the engine (not enough resources, cancelled builds, a worker killed on the way), and we often can't tell which ones actually happened.
- **Missing data.** Commands that ought to carry coordinates, or a source unit or target, frequently just don't.
- **Ambiguous units.** Units are identified by a recyclable 16-bit "unit tag", not a type, so it's often impossible to say which unit did what.

But then AI started getting so good, so fast, that I could prototype things that would have been impossible back when BWChart and SCRChart were built.

## So, how do you get semantics anyway?

Here are the main techniques screpdb uses to turn that messy command stream into meaning.

### 💎 Understanding the map with base polygons

This is a big one.

screpdb leans on a companion library I wrote, [scmapanalyzer](https://github.com/marianogappa/scmapanalyzer), which carves each map into *base polygons*, one per start location and expansion, each with:
- the polygon outlining its ground area
- its centroid, and the path to its natural (for start locations)
- its clock position ("at 5")
- flags like "mineral-only" or "natural expansion"

![Big Game Hunters carved into base polygons: each start location, natural, and the center expansion labelled](/images/posts/screpdb-bgh-overlay.jpg)
*Big Game Hunters, as screpdb sees it: every start, natural, and the center expansion as a labelled polygon.*

This allows things like narrating game events in terms of "expanded to their natural (mineral only)".

![screpdb's game-events browser, narrating a game over the map](/images/posts/screpdb-game-events.png)

And because it knows who owns which base and where buildings sit, it can flag all these semantics:

- **[Cannon rush](https://liquipedia.net/starcraft/Cannon_Rush):** a Photon Cannon built early, right in the opponent's base.
- **[Manner pylon](https://liquipedia.net/starcraft/Manner_Pylon):** a Pylon dropped inside the enemy's mineral line to block mining (the impolite inverse of a proxy).
- **[Proxy gate](https://liquipedia.net/starcraft/Proxy):** a production building planted forward in the enemy's half of the map, but not inside a base.
- **Offensive [nydus](https://liquipedia.net/starcraft/Nydus_Canal):** a Zerg Nydus Canal exit surfacing inside enemy territory as a real army insertion.
- **[Cliff drop](https://liquipedia.net/starcraft/Big_Game_Hunters/Cliffing):** the Big Game Hunters classic of dropping a Siege Tank onto the cliff behind certain start locations, then shelling the mineral line from safety.

![A Siege Tank cliffing a mineral line on Big Game Hunters (via Liquipedia)](/images/posts/screpdb-cliff-drop.jpg)

💩 It doesn't always get them right, but it's promising so far. More people poking at them is exactly how they get sharper.

### 💎 Which buildings were *actually* built

The raw replay logs every misclick, re-placement, and cancelled order, so a single re-placed Gateway can look like three. screpdb cuts through that:

- From the unit-selection stream, it works out which building produced each unit.
- Then it drops any production building (Gateway, Barracks, Factory, and friends) that never actually produced anything.

What's left is the buildings that really stood and did something, which is what makes "2 Gate" reliably mean 2 Gate.

💩 But a Gateway built just to wall a choke, one that never pumps a unit, wrongly disappears. Pick your battles 🤷

### 💎 Build-order detection

To read an opener precisely (building on the step above), screpdb runs a tiny [per-player economy simulation](https://github.com/marianogappa/screpdb/tree/main/internal/earlyfilter) over the first few minutes:

- It seeds the correct starting resources and supply, then walks the commands in order.
- It drops any command it couldn't have afforded: not enough minerals, not enough supply.
- A backtrack pass fixes over-filtering, using Brood War's own rule that it refuses orders without prerequisites.

The result is realistic worker and building counts, so a "9 Pool" reads as a 9 Pool and not as inflated spam.

💩 Build Orders are not just hard to infer (and imperfect to measure), they're also hard to name. This is a work in progress. You can help improve this feature by [filing an issue](https://github.com/marianogappa/screpdb/issues/new/choose).

![screpdb naming each player's opener: a "10 Hatch" and a "Nexus First" detected from the command stream](/images/posts/screpdb-build-orders.jpg)

### 💎 Skill proxies

Beyond APM, here are some worthy measurements available with replay data:

![screpdb skill proxies: viewport multitasking, production cadence, first-unit efficiency](/images/posts/screpdb-skill-proxies.png)

- **Viewport multitasking:** how often your screen jumps to a distant part of the map, a proxy for managing several fronts at once.
- **Unit-production cadence:** how *steadily* you pump army, rewarding an even stream over feast-and-famine bursts.
- **First-unit efficiency:** how quickly you actually use a new production building once it finishes, instead of letting it sit idle.

💩 They're proxies, not verdicts, and might need some tweaking. Happy to hear other ideas, but note that replays come with strict limitations.

## A few more favourites

Fighting replay uncertainty was only half of it. The rest was building things that are genuinely useful, or just delightful, to look at.

**✨ Alliance and team-stacking detection.** On melee games, alliances are manual, so who's *really* on whose side is a live question. screpdb reconstructs the alliance timeline and flags when teams are lopsided, like a "3v2 stacked" the lobby never advertised.

![screpdb's alliance timeline, flagging a 3v2 stack on a melee game](/images/posts/screpdb-alliance.jpg)

**✨ Stage-and-watch.** Find a game via filtering on the game list, click once, and screpdb stages that replay so you can watch it in the actual game client. Report to replay in one click.

![screpdb staging a replay to watch in the StarCraft client](/images/posts/screpdb-stage-watch.jpg)

**✨ Player fingerprints.** It flags telling habits, like a player who never bound a hotkey, or never took a single upgrade or research the whole game.

![screpdb flagging a player who skipped hotkeys and upgrades](/images/posts/screpdb-no-hotkeys.jpg)

**✨ Staying fast.** All of this is only useful if it stays responsive over thousands of replays, so ingestion throughput is benchmarked automatically on every merge.

![screpdb's ingestion-speed benchmark](/images/posts/screpdb-ingestion-speed.jpg)

## Has AI made all of this?

No, it enabled it. Throughout the 9 months I spent developing screpdb, AI kept getting better and better:

![screpdb release cadence plotted against Claude model releases, September 2025 to July 2026. Output concentrates heavily in the final months](/images/posts/screpdb-ai-timeline.svg)


And it allowed a backend engineer with no UI chops whatsoever to go from this:

![The old screpdb dashboard: a flat grid of per-player stat cards](/images/posts/screpdb-old-dashboard.jpg)
*The old dashboard: functional, but a flat wall of numbers.*

To this:

![screpdb's current per-game summary: build order, unit composition over time, skill proxies, and per-player stats](/images/posts/screpdb-game-summary.png)
*The current per-game summary: one `.rep`, fully unpacked into build orders, unit composition across early/mid/late game, spellcasts, and per-player stats.*

But even with this colossal swiss army knife, I had to fight the ways AI quietly gets things wrong. The code is correct, reads well, passes the tests, and is often quietly wasteful. It never shows up on three replays, only once you point it at thousands:

- It built the dashboard's queries with **no composite indexes**, so every panel full-scanned the commands table ([fixed](https://github.com/marianogappa/screpdb/commit/8e038734cf0878ad709aa09f01acbbffccc6f66f)).
- It kept **re-doing work it had already done**: re-computing expert timings on every page load, re-scanning the command table for a signal it had already stored ([#101](https://github.com/marianogappa/screpdb/pull/101)).
- And some things it simply *couldn't* do. No model just knows a game was a cheeky proxy 2-gate, so I watched and labelled [171 replays](https://github.com/marianogappa/screpdb/tree/main/internal/patterns/markers/testdata/replays) by hand to teach the detectors what's real.

## Can you build on top of it?

The dashboard is only the friendly face. Underneath, screpdb is a plain database with an API, so you can wire it into your own tooling:

- Ingest replays straight from the CLI (`screpdb ingest`).
- Run the server headless (`screpdb dashboard --headless`) and hit it programmatically.
- Every dashboard feature is exposed over a documented [OpenAPI](https://github.com/marianogappa/screpdb/blob/main/api/openapi/dashboard.v1.yaml) surface.

There's more in the [developer docs](https://github.com/marianogappa/screpdb#developer-features).

## I'd love it if you'd check it out!

It's fully free 🍺 and open source. No donations needed, don't buy me a coffee.

It ships with a **sample replay pack**, so you don't even need your own replays to see what it does:

![screpdb's bundled sample replay pack, ready to explore without any replays of your own](/images/posts/screpdb-example-replays.jpg)

On **Windows**, install with [Scoop](https://scoop.sh):

```powershell
scoop bucket add screpdb https://github.com/marianogappa/screpdb
scoop install screpdb
screpdb-gui
```

On **macOS**, install with [Homebrew](https://brew.sh):

```bash
brew install marianogappa/screpdb/screpdb
screpdb
```

On **Linux**, use the one-line installer:

```bash
curl -fsSL https://raw.githubusercontent.com/marianogappa/screpdb/main/install.sh | sh
screpdb
```

Full instructions are on the [project page](https://github.com/marianogappa/screpdb#installation).

Feel free to let me know if you enjoyed it, and please [file an issue](https://github.com/marianogappa/screpdb/issues/new/choose) if there's a problem.

But honestly, the tool is the least important part of this. What's worth holding onto is people you'll still be playing and laughing with decades from now. I hope screpdb helps a little. Keep playing together!

![The two of us in 2026, still playing every weekend, with screpdb open on the middle screen](/images/posts/screpdb-stillplaying.jpg)

*screpdb is open source (MIT) and lives [here](https://github.com/marianogappa/screpdb). Built on [icza/screp](https://github.com/icza/screp), without which none of this would exist.*

*screpdb isn't a competitor to RepMastered or vespene.gg, it's complementary! Each do slightly different things. András helped me build screpdb through knowledge transfer, others helped betatesting too like 2Pacalypse- from TL.net. And I hope screpdb's most useful features are rightfully stolen and improved upon 👍*
