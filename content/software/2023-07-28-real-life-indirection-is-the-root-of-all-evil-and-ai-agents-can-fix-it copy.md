---
title: "Real-life indirection is the root of all evil (and AI agents can fix it)"
date: 2023-07-28
summary: "The blogpost explores how the evil downsides of indirection, a programming principle that can be conceptualised in real life, can (and invariably will?) be challenged by the latest AI developments."
slug: "real-life-indirection-is-the-root-of-all-evil-and-ai-agents-can-fix-it-copy"
image: /images/posts/ai.png
publications:
    - icon: hacker_news
      url: https://news.ycombinator.com/item?id=36906175
      position: 3
      position_link: https://hnrankings.info/36906175/
---
## TL;DR

This blogpost introduces the idea that there's a concept called "indirection in the real World", derived from a programming concept, which is good in principle, but also hides behind all evil. It then explores how the latest developments in AI might present an opportunity to challenge some of the adverse effects of it.

## What was indirection?

[Indirection](https://en.wikipedia.org/wiki/Indirection), for the uninitiated, is a computer programming principle.

Examples:
- A [pointer](https://en.wikipedia.org/wiki/Pointer_(computer_programming)#Formal_description) to a value indirectly references a value.
- An [interface](https://en.wikipedia.org/wiki/Interface_(computing)) indirects the implementation details of some function from its consumers.
- [Higher-level languages](https://en.wikipedia.org/wiki/High-level_programming_language) like Python or Swift indirect memory management, nested call stacks and other low-level details.

Indirection is not inherently bad and it's necessary to implement good [abstractions](https://en.wikipedia.org/wiki/Abstraction_principle_(computer_programming)): we don't want to go back to [Assembly](https://en.wikipedia.org/wiki/Assembly_language) 😱!

![Assembly](/images/posts/ai-assembly.png)

The popular negative connotation around indirection comes from the difficulty of reading through code when there are too many nested "jump to definition" hops (indirection hops!) to get to some relevant section, as opposed to a linear sequence of actions.

Often, one can draw a parallel between a codebase and a tricky book. But when there's too much indirection, it feels more like reading an over-engineered [Choose your own adventure](https://en.wikipedia.org/wiki/Choose_Your_Own_Adventure) gamebook, where you have to switch pages every 5 words!

![Choose your own adventure](/images/posts/ai-choose-your-own-adventure.jpeg)

## What does "Indirection in the real World" look like?

For the most part, we no longer do anything end-to-end by ourselves.

There was a time when humans didn't *indirectly* depend on other humans for:
- **Food**: we don't plant it, grow it, harvest it, package it. We don't even know _how to_.
- **Shelter**: perhaps thousands of people involved in building a house, keeping it warm, lit, having a sewage system.
- **Safety**: an emergency service a call away that deploys police, firefighters or ambulances to your location in minutes!

![Cavemen](/images/posts/ai-cavemen.png)

We live in a much better World now, thanks to this gargantuan spider web of indirection we've built. Indirection is good!

But sometimes it's bad. Have you ever heard of these? 
- "responsibility can never be delegated"
- "if you want something done right, do it yourself"

Those are common proverbs for "indirection is bad".

## Where did indirection go so wrong?

If you make a list of the top things that are wrong with the World, you can find indirection creeping in:

### War

- The American people wouldn't on their own decide to invade Irak
- The Russian people wouldn't on their own decide to invade Ukraine
- ...and the same goes for all others

War is only possible due to indirection.

The governments & powerful elites: 
- Make the decisions leveraging the indirection in **representative democracy**.
- Persuade people that it's the right decision leveraging the indirection in **the media's depictions of news & facts**.

### Extreme social inequality
Extreme inequality is actually a fragile state and it leads to [guillotines](https://en.wikipedia.org/wiki/French_Revolution#Causes).

To maintain order, diverse mechanisms of indirection are applied. 

A very simple one is **distance**: Michael Moore, despite whatever feelings you might have about him, puts it very eloquently [in this excerpt](https://youtu.be/XQ_agxK6fLs?t=327), when discussing how all schools in Finland are the same, so the rich parents have to make sure the public schools are great, and given that rich kids go to school with the rest and become friends, they have to think twice before they screw them over as wealthy adults.

Ever wondered why you can hardly ever see or speak to rich, powerful people? The "thing" separating them from you is called indirection.

### Obesity epidemic
It's great that we don't have to plant, harvest, package and transport all our food by ourselves now. But those who do that for us have different priorities: 
- They add loads of preservatives and chemicals to the products so they last longer in the shelves, regardless of possible adverse effects.
- They deliberately make unhealthy products incredibly tasty and market them to kids, then lie about the health effects, to make a profit.

![Happy Meal](/images/posts/ai-happy-meal.png)

You can clearly see how the hugely beneficial effects of delegation are unfortunately subverted by leveraging the indirection when objectives are not aligned.

Often, well-off people opt to:
- shop products that closely & explicitly showcase the food origin & process
- shop direct from local farmers
- grow food themselves

What is this, effectively? 🤔 Removing/minimising indirection!

### Political corruption
There's a legit point to representative democracy! It would be really hard to have a debate with your whole city on every little aspect of government (and the [Landsgemeinde](https://en.wikipedia.org/wiki/Landsgemeinde) doesn't count).

![Landsgemeinde](/images/posts/ai-landsgemeinde.png)

But representative democracy introduces indirection, and it gets out of hand quickly.

Your elected officials:
- Don't know you
- Largely don't benefit from helping you
- Often come from a different background or ethnicity, which comes with different values & culture 
- Their priorities are very different from yours!

An abyss of indirection separate you.

All you get is a paper vote every few years, and you can protest on the street and argue online.

**Indirection is the real reason why politics don't scale.**

## What have we done so far to mitigate these evils?

The word **"transparency"** comes up every time 🤔. Surprised?

It's not surprising:
- The problem: indirection clouding the evil, making it opaque.
- The solution: remove the indirection, revealing the evil.

Examples are everywhere:

- The *indirect* links between tobacco & foods high in added sugar and adverse health effects like [lung cancer](https://nida.nih.gov/publications/drugfacts/cigarettes-other-tobacco-products), [obesity & diabetes](https://www.nhs.uk/live-well/eat-well/food-types/how-does-sugar-in-our-diet-affect-our-health/) have been widely established and agreed upon after decades of systematic attempts to deny and hide them (I say "indirect" because the effects take years to materialise). What do governments decide to do? Put health warnings in the packaging, thus removing the indirection.

![Tobacco Warning](/images/posts/crypto-predictions-tobacco-warning.jpg)

- [The Panama Papers](https://en.wikipedia.org/wiki/Panama_Papers), [The Paradise Papers](https://en.wikipedia.org/wiki/Paradise_Papers) & [The Swiss Leaks](https://en.wikipedia.org/wiki/Swiss_Leaks) are just a few examples of the long list of whistleblowing efforts to remove the indirection mechanisms allowing the filthy rich from evading taxes and hiding their wealth.

- Vegans argue that animal farming is evil. If you agree, this is another good example. In order to increase efficiency, producers need to resort to and **hide** farms like this one 😱:

![Chicken Farm](/images/posts/ai-chicken-farm.png)


## Brainstorming: can we do better?

We can steal some ideas from great thinkers.

![The Open Source Everything Manifesto](/images/posts/ai-the-open-source-everything-manifesto.png)

[Robert David Steele](https://en.wikipedia.org/wiki/Robert_David_Steele), although later quite a controversial figure, was an American CIA officer who wrote a book called [The Open-Source Everything Manifesto](https://www.goodreads.com/en/book/show/12998524-the-open-source-everything-manifesto). In it, he advocates for the transition from top-down secret command and control to a world of bottom-up, consensual, collective decision-making as a means to solve the major crises facing our world today.

I read this book in 2014, and this idea resonated with me, because I interpreted it as "removing indirection from information-based decision-making", and letting everyone collaboratively "audit" the World.

![Yuval Harari](/images/posts/ai-yuval-harari.png)

Very recently, historian [Yuval Harari](https://en.wikipedia.org/wiki/Yuval_Noah_Harari) echoed a thought from a [2020 talk he made at Davos](https://archive.org/details/yuval-noah-harari-at-the-world-economic-forum-in-davos-2020-the-rise-of-digital-) in a short [interview with Piers Morgan](https://www.youtube.com/watch?v=JV9tzdYT5FU&pp=ygUVeXV2YWwgZGljdGF0b3JzaGlwIGFp), along the lines of: "Alongside inequality, the other major danger we face is the rise of digital dictatorships, that will monitor everyone all the time".

This idea of having a self-replicating [Agent Smith](https://en.wikipedia.org/wiki/Agent_Smith) keeping every human under control resonated with me as well: if we can use these agents for mind control, can we use them to keep them free from these evils too?

![Cypherpunk](/images/posts/ai-cypherpunk.png)

The [Cypherpunk](https://en.wikipedia.org/wiki/Cypherpunk) movement was a loosely coupled group of computer scientist activists originated in San Francisco in the mid 80s who advocated the use of cryptography and privacy-enhancing technologies to challenge state surveillance and censorship and promote social and political change. Bitcoin and cryptocurrencies came from this movement, or so [Arvind Narayanan](https://en.wikipedia.org/wiki/Arvind_Narayanan) taught me in his [Bitcoin and Cryptocurrency Technologies](https://www.coursera.org/learn/cryptocurrency) MOOC.

What a fantastic dream (for a software engineer at least), that a few nerds can team up and have a realistic shot at fixing the World 😍!

But we need bolder tools 🤔.

## How about leveraging [AI agents](https://en.wikipedia.org/wiki/Intelligent_agent)?

Every day I wake up to a brand new [Hacker News](https://news.ycombinator.com/) front page looking for these new activists, these AI-Powered Transparency Warriors.

How about having a swarm of anonymous AI agents hidden in all corners of the Internet, auditing the World, looking for wrongs to right?

Sounding much like a [Terminator](https://en.wikipedia.org/wiki/The_Terminator)-style dystopia? 

![Terminator Dystopia](/images/posts/ai-terminator-dystopia.png)

Only that these agents could be open source and community-maintained, and their collaborators could remain anonymous if necessary, much like [Satoshi Nakamoto](https://en.wikipedia.org/wiki/Satoshi_Nakamoto). 

Not quite viable today, but I'd argue it's **unavoidable in the long term anyway**, in one form or another.

Anybody can sue, publicly denounce or file a complaint against anyone else if they have a good case, so why can't computers do it? They'll be better than us at it 🤷‍♂️.

Since it's well-studied that [corruption affects a country's economic output](https://www.imf.org/EXTERNAL/PUBS/FT/ISSUES6/INDEX.HTM) and thus, long-term, everyone (unintuitively including the rich) benefits when there's less corruption, wouldn't it be in the best interest of governments to deploy these AI auditors?

## Cancel culture put to good use

The recent [Cancel Culture](https://en.wikipedia.org/wiki/Cancel_culture) phenomenon has been widely criticised and with good reasons, but it did bring something new to the table that I hadn't seen before: **the rich & powerful held accountable and brought down**.

Call it *vigilante justice*, I don't care: even if there are false positives, the idea that no army of lawyers nor unlimited bribery resources can save you if you do bad deeds is a deterrent **we all wish existed**, no?

This dream is within reach now. I dream of AI Agents keeping the [Animal Farm pigs](https://en.wikipedia.org/wiki/Animal_Farm#Pigs) honest.

How about the Supreme Court judges? The billionaire class? The people who wield tremendous power over others should be held at a higher standard, and if they don't like it, then they shouldn't hold it.

I'd argue that an AI Agent monitoring, discovering & exposing the [Enron scandal](https://en.wikipedia.org/wiki/Enron_scandal), could potentially be just as life-saving as [FSD](https://www.youtube.com/watch?v=bUhFfunT2ds), both at scale.

Of course, like all else, how do we ensure it doesn't target a specific agenda?

## Conclusion

The future I imagine in this post sounds very much like an unrealistic sci-fi musing. But is it, though?

We can at least all agree that AI will have a growing presence in our daily lives, both at the individual and the societal level.

I believe that some of our mightiest inventions have served the purpose of enhancing our ability to collaborate as a civilization:
- **Towns, city-states & kingdoms**, uniting us under a common flag.
- **Religion**, uniting us across regions, under the same beliefs.
- **Capitalism, globalisation & telecommunications**, bringing us closer together and making us so dependent on each other that wars became bad business.
- **The Internet**, making all our collective knowledge available to everyone instantly.

Throughout these stages, the "distance" to one another has steadily decreased, but we're not quite there yet. I argue that the elusive enemy we must defeat is called indirection, and AI agents can be the next stage in our human journey.

If I had to guess, I'd say the pioneering applications will more likely come from the private sector or from clandestinity. But I don't know when, or what the form will be. I'm sure it's coming, though. Soon.
