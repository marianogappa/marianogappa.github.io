---
title: "Player fingerprinting in RTS games in the age of AI bots"
date: 2026-09-22
draft: false
slug: "player-fingerprinting-in-the-age-of-ai-bots"
image: /images/posts/fingerprint-hero.jpg
summary: "Competitive e-sport athletes are full-time professionals, and the ones at the top earn around what corporate executives make. This month a bot turned up on the ladder good enough to beat them, so the question is no longer only which human played a game, but whether one did. So: is it possible to fingerprint a human by the way they play?"
---

## TL;DR

Not all games are child's play. Competitive e-sport athletes are full-time professionals, and the ones at the top earn around what corporate executives make.

When that much is on the line, working out who actually played a given game stops being a statistician's obsession.

And as of this month, [some of those games are not being played by a human at all](https://tl.net/forum/brood-war/646339-bot-on-ladder).

> **Is it possible to fingerprint a human by the way they play?**

This article covers the problem space, the science in brief, and the results.

{{< youtube glSiSoAounY >}}

*Jaedong's hands. **This** is not child's play.*

## Introduction

StarCraft: Brood War has been a career in Korea for twenty-five years. At the height of the corporate-team era, [Flash](https://liquipedia.net/starcraft/Flash) was on a $250,000 salary while still in high school, and his prize money alone comes to [over $700,000](https://www.esportsearnings.com/players/1505-flash-lee-young-ho) across 113 tournaments.

The teams are gone, but the scene isn't. Progamers now make their living two ways:

- **Livestreaming their games on [SOOP](https://liquipedia.net/starcraft/SOOP)**, the Korean [Twitch](https://www.twitch.tv) (formerly AfreecaTV), where income comes mostly from viewer "star balloon" donations.
- **Placing well in tournaments.** [ASL](https://liquipedia.net/starcraft/ASL) is the big one: run by SOOP, offline, 28 players, a prize pool of [around $58,000](https://liquipedia.net/starcraft/ASL/22) a season. [KCM Race Survival](https://liquipedia.net/starcraft/KCM/Race_Survival) is the online circuit, on its 39th season at [about $8,800](https://liquipedia.net/starcraft/KCM/Race_Survival/2026/3) each. [Daily Proleague](https://liquipedia.net/starcraft/Daily_Proleague/Major_Proleague) runs online showmatches all year.

The infrastructure is unusually simple.

- **One game client.** Everybody plays the same one.
- **One server.** Korean competitive play happens on Blizzard's Battle.net.

## The rules of the namespace

- You **buy an account** that lets you play on Battle.net.
- You may create **as many "toons" as you want** on it. A toon is an in-game name, and it namespaces your results.
- Toons are **unique per region, not universally.** Two different accounts can own the same toon on two different regions. The regions are Korea, U.S. East, U.S. West, Europe and Asia.
- You may **buy as many accounts as you like.** In principle there's no reason to. In practice, there is.

Here is what that looks like for one real progamer:

![One Battle.net account holding eight toons across all five regions, versus the single name string that survives into a replay file](/images/posts/fingerprint-identity-asymmetry.svg)
*The account of the progamer Queen ([ZerO](https://liquipedia.net/starcraft/ZerO) on Liquipedia), from scfingerprint's [built-in identity map](https://github.com/marianogappa/scfingerprint/blob/main/internal/registry/registry.json). Eight toons, five regions, one human.*

💎 The trap is in the bottom right. The toon people know and track is on Korea. The account he's actually playing sits on U.S. East, under a barcode nobody wrote down.

## Everyone hides

Every player creates aliases to keep some level of anonymity.

Progamers do it so opponents can't scout their builds, and so viewers can't follow them around while they practise. Everyone else has their own reasons.

And the cheapest anonymity in the game is a barcode:

![Capital i, lowercase L and the digit 1 render as the same vertical stroke in the game font, making barcode names unreadable and unsearchable](/images/posts/fingerprint-barcodes.svg)

## How the community keeps track

By watching. Someone tunes into a stream, the ladder screen is on camera, and they read the toon off the overlay and write it down. The result is a mapping from toon to identity, maintained by hand.

It has produced real infrastructure:

- [Liquipedia's alternate ID lists](https://liquipedia.net/starcraft/Ladder/Alternate_IDs), split by era and by server.
- The [CWAL.gg Player Tracker](https://chromewebstore.google.com/detail/cwalgg-player-tracker/gncpkdbhfgbgheppdpjodececlbbfobp), a browser extension that annotates [cwal.gg](https://cwal.gg) with a shared alias list, [introduced on TL.net](https://tl.net/forum/brood-war/640634-a-cwalgg-extension-easily-keep-track-of-anyone) and actively maintained.

This mechanism is simple and it works in most cases. But it suffers from five problems:

- **It requires constant maintenance.** The list is only as fresh as the last person who watched a stream.
- **It is possible to make mistakes.** There's no verification step and no confidence attached.
- **It does not survive the uniqueness rule.** The same toon can be two different people on two different regions, and a flat string mapping cannot express that.
- **It rests on a single observation.** It's possible for people to play on each other's accounts, and one sighting doesn't establish who was at the keyboard for the next thousand games.
- **It does not scale past a hundred-odd people.** Too much manual work. Liquipedia will track the ASL field. It will never track the four guys I play on Sundays.

When money is on the line, this is not good enough.

And this month the question got harder. A bot appeared on the ladder, good enough to beat progamers, and the community spent days trying to work out which accounts were it.

{{< youtube id="1vsTqNwHquE" start="630" >}}

*A ladder bot taking a game off a pro.*

So the question is no longer only which human played a game. It is whether one did.

## So: can you fingerprint a human from their replays?

Brood War writes a **replay** after every game: a `.rep` file that records not what happened, but the stream of commands each player issued, each one timestamped. I've written about how [maddening that is to get meaning out of](/thoughts/building-an-advanced-starcraft-reporting-tool/), and built [an interactive explainer](https://marianogappa.github.io/inside-brood-war/) of why.

![A two-second excerpt of a replay as the parser sees it: a table of frame numbers, timestamps, player names and commands, annotated to show which parts a fingerprint reads and which it discards](/images/posts/fingerprint-replay-excerpt.svg)

Here it is exactly the right data. We don't need to know what happened in the game, only how the keys were pressed. And nobody chooses their keypress habits: they are muscle memory ground in over years, closer to handwriting than to a password.

If that can be measured, every problem above goes away. But the fingerprint has to be:

- **Unique enough**, so it doesn't collide across the population of people playing.
- **Stable enough**, so the same human always converges to the same fingerprint.

The next section is the high-level science. Skip to [the results](#results) if you'd rather.

## The science

If the premise is right, this is a [behavioural biometric](https://en.wikipedia.org/wiki/Biometrics), and specifically a close cousin of [keystroke dynamics](https://en.wikipedia.org/wiki/Keystroke_dynamics): the idea that *how* you type identifies you regardless of *what* you type. Most of what follows is the [speaker-recognition](https://en.wikipedia.org/wiki/Speaker_recognition) pipeline with hands in place of a voice.

### What gets measured

360 numbers per player per game. All of them describe *how*, never *what*: no map, no position, no build order, no strategy.

- **Hotkey habits.** Which control groups they bind and select, the ratio of selects to assigns, double-tap rate, and which groups they bind in their first five assignments of a game.
- **Command loops.** A 10x10 matrix of "which kind of command follows which". Some players cycle select → hotkey → right-click tightly; others interleave production checks.
- **Rhythm.** The distribution of gaps between consecutive commands: median, percentiles, the modal gap, how long their bursts run.
- **Micro-timings.** How long after binding a hotkey they first use it. The gap inside a double-tap. How big their selections are.
- **Tempo.** APM, effective APM, redundancy, and APM by phase of the game.

Two Zergs can open with the same build on the same map and be trivially separable here. One binds hatcheries on 4/5/6 and army on 1/2 with a 190ms double-tap. The other binds army on 1/2/3, checks production by clicking, and has a distinctive three-command burst. Nothing in their build orders tells them apart. Everything above does.

### How two players get compared

![The pipeline: timestamped keypresses become 360 measured habits, filtered to the 150 that separate people, de-correlated, then compared against a cohort of strangers to produce a scored verdict](/images/posts/fingerprint-pipeline.svg)

1. **[Standardise](https://en.wikipedia.org/wiki/Standard_score)** every feature against the training corpus, so that a millisecond and an APM count carry equal weight.
2. **Keep the 150 most discriminative features**, ranked by [F-ratio](https://en.wikipedia.org/wiki/F-test): between-player variance divided by within-player variance. Most of the 360 measurements distinguish *games*; only some distinguish *people*. That ratio is the same quantity at the heart of [linear discriminant analysis](https://en.wikipedia.org/wiki/Linear_discriminant_analysis).
3. **[Whiten](https://en.wikipedia.org/wiki/Whitening_transformation)** using the within-player covariance, [shrinkage-regularised](https://en.wikipedia.org/wiki/Shrinkage_(statistics)) because a 150x150 covariance estimated from limited games is otherwise unusable. Habits that move together stop being counted three times, and every remaining direction of variation carries equal information.
4. **Compare with [cosine similarity](https://en.wikipedia.org/wiki/Cosine_similarity).** A player's fingerprint is just the mean of their whitened per-game vectors, which is why it can be updated one game at a time and stored in a single database column. [Here is Jaedong's](https://github.com/marianogappa/scfingerprint/blob/main/internal/dataset/players/jaedong.json), if you want to see what one actually looks like.
5. **Grade that score against a crowd of strangers.** A raw similarity of 0.8 means one thing for a player with common habits and something else entirely for a weirdo, so instead of using it directly we ask how far above a reference crowd it sits. That is [z-norm and t-norm](https://doi.org/10.1006/dspr.1999.0360), lifted straight from speaker verification, and it is not optional garnish: raw cosine alone gives up roughly 40 points of true-positive rate at the strict threshold.
6. **[Calibrate](https://en.wikipedia.org/wiki/Calibration_(statistics)) on how much evidence there is.** An average over eight games wobbles less than a single game does, by roughly the [square root of the count](https://en.wikipedia.org/wiki/Standard_error), so a score of 5 means different things at one game and at fifty. Each evidence bucket gets its own calibration. Without it, one large aggregate out-ranks everything for entirely the wrong reason. It did, once.

### Is it unique enough?

Score two piles of replays against each other, on cases where the answer is already known.

![A calibrated scale: strangers score below 1.7, the same person above 5.4, with 3.7 points of empty space between the two bands](/images/posts/fingerprint-separation.svg)
*Measured over the committed [labelled corpus](https://github.com/marianogappa/scfingerprint/tree/main/corpus).*

Stranger pairs land below 1.7. Same-person pairs land above 5.4. The 3.7 points in between stay empty.

💎 So: **from a single game, one player is told apart from a stranger 99.8% of the time, and picked correctly out of 68 candidates 98.9% of the time.** That is unique enough, and a case landing in the empty gap gets "I don't know" instead of a guess.

Those percentages are the usual biometric measures, read off a [detection error tradeoff](https://en.wikipedia.org/wiki/Detection_error_tradeoff) curve.

### Is it stable enough?

Split each player's games in half by date, then score their earlier games against their own later ones.

![Self-consistency scores: the enrolled players cluster near 0.96, shared accounts fall to 0.68 to 0.86, and one wrongly merged pair scores 0.44](/images/posts/fingerprint-stability.svg)
*Every point traces back to a replay in the committed [labelled corpus](https://github.com/marianogappa/scfingerprint/tree/main/corpus).*

Same measurement, used two ways:

- **Above the bar:** this is one human, and their habits held.
- **Below it:** the label is describing more than one person. That is how shared accounts and curation mistakes get caught before they poison anything.

## Results

I scored [**474 ladder accounts**](https://github.com/marianogappa/scfingerprint/issues/66) against the catalogue, and checked every answer against the community list.

It reaches parity, and dodges all five problems by construction:

| Problem with the manual list | Why the fingerprint doesn't have it |
|---|---|
| Needs constant maintenance | Re-derives itself from replays |
| Can be wrong, silently | Carries a calibrated confidence |
| Breaks on the per-region rule | Never looks at a name at all |
| Rests on one sighting | Measures whoever is at the keyboard |
| Caps out around 100 people | Capped by replays, not by eyeballs |

### What fingerprinting found

**✨ A progamer filed under another progamer's name.** The community list maps three accounts to **Blade**. One of them carries no toon, only the battle tag `llllllllllll`, and it [plays like](https://github.com/marianogappa/scfingerprint/blob/main/corpus/pro_exclusions.json) **[Paralyze](https://liquipedia.net/starcraft/Paralyze)**: a different player, same race.

**✨ Accounts nobody had connected to anyone.** Five barcodes fingerprint as a catalogued pro, and the community list attaches no name to any of them:

- `wiwiwiww92` → **[Jaedong](https://liquipedia.net/starcraft/Jaedong)**
- `IlllIIlIIlIllII` → **[Sharp](https://liquipedia.net/starcraft/Sharp)**
- `lIIIlIlIIlIIIIl` → **[Ample](https://liquipedia.net/starcraft/Ample)**
- `lllilliliiilill` → **[Alen](https://liquipedia.net/starcraft/Alen)**
- `IIIlIlIIIIIIll` → **TimeIsGold**

Each matches its pro's race and rating band, and has never played them on the ladder.

## Limitations

- **It cannot put a name on a face.** It can tell you that an account filed under a pro isn't that pro. It cannot tell you who the pro actually is, because the only thing that ever attaches a real name to a fingerprint is somebody watching a stream.
- **One game is a lead, not proof**, and three or more is where it gets confident. Team games and custom maps are three to five times worse, because it was tuned on ladder 1v1.
- **The catalogue is the weakest link.** Every wrong answer I've had came from a bad catalogue entry, not from the matcher: a player enrolled from contaminated games claims accounts that aren't his.

💎 Which is why this is best viewed as a **complement** to the hand-maintained list, not a **replacement** for it, and not a better version of it.

## Try it

[**scfingerprint**](https://github.com/marianogappa/scfingerprint) is a Go library and CLI, MIT licensed, with the labelled corpus committed so every number above traces back to replays.

```bash
scfingerprint match game.rep            # who is each player?
scfingerprint same --a dirA/ --b dirB/  # are these two the same human?
scfingerprint whois Queennnnnn          # who owns this toon, and what else do they own?
```

It's wired into [**screpdb**](https://github.com/marianogappa/screpdb), my [StarCraft reporting tool](/thoughts/building-an-advanced-starcraft-reporting-tool/), so a barcode in your own replay folder resolves to the person behind it.

![screpdb showing the account ErOs_231208 identified as the progamer Light, with a tooltip reading "Confirmed account of Light, plays like Light, using fingerprinting technology", and a row listing the other toons the account plays under](/images/posts/fingerprint-screpdb-player.jpg)
*The identity map and the fingerprint agreeing on the same account, plus every other toon it plays under.*

![screpdb's player list, where barcode names resolve to the progamers behind them: Disco, Prime, HBQ, Light, Leta, Baskin, herO, nOOB and Paralyze](/images/posts/fingerprint-screpdb-players-list.jpg)
*And the same across a whole replay folder.*

screpdb compiles to WASM, so you can **▶️ [try a preview in your browser](https://marianogappa.github.io/screpdb/)** without installing it.

{{< smallprint >}}
Anyone properly embedded in this scene would push back on some of the above, and fairly. Much of these players' games are streamed or televised, so there is usually a camera on whoever is at the keyboard, and cheating carries heavy social consequences in Korean e-sports. Recovering every toon on an account is also already a solved problem for anyone technically inclined, which is how cwal.gg and similar tools work.

Both points take some wind out of the article. But fingerprinting still plugs many holes in the existing system. New account discovery, mislabelling, [account sharing](https://www.youtube.com/watch?v=_wutDci3zzg), scalability to a larger corpus, cheat-detection in online qualifiers and anywhere really (e.g. was it actually X playing against me?). The honest framing is a doping test rather than a door lock.
{{< /smallprint >}}
