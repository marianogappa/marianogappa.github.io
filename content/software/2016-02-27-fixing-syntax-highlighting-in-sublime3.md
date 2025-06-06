---
title:      Fixing syntax highlighting issues in Sublime Text 3
date:       2016-02-27
summary:    A straightforward guide to fixing syntax highlighting issues in Sublime Text 3 based on an actual issue I found.
slug:       "fixing-syntax-highlighting-in-sublime3"
---

## Introduction

My two main IDEs nowadays are [Intellij Idea](https://www.jetbrains.com/idea/) and [Sublime Text](http://www.sublimetext.com/3). I basically like to use IDEA for strongly-typed languages and Sublime for weakly-typed languages. However, not long ago I found a bug on Sublime!

In version 5.4 of PHP, they [introduced a new syntax for arrays](http://php.net/manual/en/migration54.new-features.php) that is reminiscent of the JSON notation:

```php
<?php

// Old PHP Array syntax
$primes = array(1, 2, 3, 5, 7);

// New PHP Array syntax
$primes = [1, 2, 3, 5, 7];
```

Even though support for this new syntax within the Sublime codebase seems to be limited, oddly enough the colouring seems to be working properly. But I've found a case where it's not. This case was probably not discovered because PHP people don't like type-hinting!

![Highlighting Issue - Before](/images/posts/sublime-highlighting-before.png)

## Now, here's how to fix it

### Context

- Ever wondered how Sublime does the syntax highlighting magic? The answer is: lots and lots of regexes. [This is the Language file for PHP](https://github.com/sublimehq/Packages/blob/master/PHP/PHP%20Source.sublime-syntax).

- The syntax highlighting feature uses the [Oniguruma regular expression library](https://en.wikipedia.org/wiki/Oniguruma).

- I recommend [this DuckDuckGo regex cheatsheet](https://duckduckgo.com/?q=regex%20cheat%20sheet&ia=cheatsheet&iax=1) if you need a quick reference; it's very good!

- Also, I recommend using [this online regex parser](http://rubular.com/) when you get into the regex hacking part. It's not my favourite one but it's Ruby-based.

- Before we begin, you should skim through [this syntax guide](http://www.sublimetext.com/docs/3/syntax.html) to familiarise yourself with the code we'll be editing.

- Optionally, you might want to read [this StackOverflow question](http://stackoverflow.com/questions/25184605/cloning-a-sublime-text-3-highlighting-syntax-definition), as it was very insightful to understand the process.

### Opening the language file

The first thing we need to do is to open the Language package (in this case the PHP one). For this, we need to [install the PackageResourceViewer plugin](https://packagecontrol.io/packages/PackageResourceViewer).

Within Sublime's Command Palette, type:

    PackageResouceViewer: Open Resource

Then select the `PHP` resource and then finally `PHP.tmLanguage`.

You'll find a very scary xml file. This is the annoying part. The guides recommend that you use [the AAAPackageDev package](https://packagecontrol.io/packages/AAAPackageDev) to convert this xml to yaml, thus making it an order of magnitude easier to work with it. Unfortunately, it also says that it doesn't convert perfectly, and this defeats the purpose of using it! I did something different.

### Editing the language file

This is the good news: you can edit this xml freely (please keep a copy of the original!), and the changes become instantly applied on PHP-syntax-enabled files upon save!

To make sense of the xml monster, just look up [the yaml file on the Github repository](https://github.com/sublimehq/Packages/blob/master/PHP/PHP%20Source.sublime-syntax). Make sure your Sublime and the GH code are for the same version; otherwise you're not actually looking at the same code. Having the latest version of Sublime installed should be enough.
Looking at the yaml file makes it much easier to spot the place where you need to make the regex change.


After about half an hour of tinkering with regexes, I finally found a modification that worked for all cases I could think of. The problem that held me up was that I was trying to match either 2 groups (`array` and `(`) or 1 group (`[`), so I needed a wrapping group with two cases (i.e. `(a|b)`) that wasn't actually capturing anything per se. The solution to this was `Passive (non-capturing) groups` (i.e. `(?:...)`). I mention this because you might need it; when you see how the classes are picked you'll understand why.

![Highlighting Issue - Before](/images/posts/sublime-highlighting-after.png)

## Fun fact

Before I came up with the idea of passive capturing groups I naturally thought of lookbehind assertions (i.e. `?<=`). When it didn't work I facepalmed: "of course! it's xml; I have to escape it (i.e. `&lt;`)". When it didn't work again I started googling. It seems the guys gave up on lookbehinds altogether for this reason so they just didn't implement it, even though Oniguruma supports it :) Good idea though; lookbehinds are slow and not universally supported ([Javascript](http://stackoverflow.com/questions/24093540/why-doesnt-javascript-have-lookbehinds), [Ruby < 1.9](http://stackoverflow.com/questions/7605615/regex-negative-lookbehind-in-ruby-doesnt-seem-to-work?rq=1)).

## Lastly

Once you are done and you're sure it works properly, share your contribution to the World!
[This](https://github.com/sublimehq/Packages/issues/98) was my Github issue for the PHP syntax fix.

Happy open sourcing!

