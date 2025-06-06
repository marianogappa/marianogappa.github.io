---
title:      Diffing streams on the terminal
date:       2016-07-30
summary:    In this blogpost, I describe the most popular tools currently used to diff streams on the terminal, their differences and limitations. Then I introduce a new tool I've developed, sd, to address some of these limitations.
slug: "diffing-streams-on-the-terminal"
---

## TL;DR

In this blogpost, I describe the most popular tools currently used to diff streams on the terminal, their differences and limitations. Then I introduce a new tool I've developed, [sd](https://github.com/MarianoGappa/sd), to address some of these limitations.

## Introduction

Recently, I had this situation at work where I had to come up with a list of unprocessed transactions, identified by some [UUID](https://en.wikipedia.org/wiki/Universally_unique_identifier). I had the transaction queue somewhere, and the transaction results somewhere else. Just a "set diff", right? Well, my case was not so straightforward.

## Basic stream diffing

The most common way to do "set diffs" on the terminal is using [comm](https://en.wikipedia.org/wiki/Comm); and it's also the fastest tool I've found. Just remember that the streams need to be sorted.

Diffing with comm

``` shell
$ comm -23 <(seq 100 | sort) <(seq 6 100 | sort)
1
2
3
4
5
```

Another (slower but nevertheless popular) way to accomplish the same task is with `grep -Fxvf`. Note that in this case you don't need to sort the streams, but you have to invert them as you pass them (it looks weird until you realise that the second argument is kind of on the left, because it's often the piped STDIN).

Diffing with grep

``` shell
~ $ grep -Fxvf <(seq 6 100) <(seq 100)
1
2
3
4
5
```

I discourage the use of `grep -Fxvf` for two good reasons:

- It's slower; maybe not on these examples but it is on real-life examples.

- It doesn't seem to work properly on the version of grep that comes with OS X  (BSD) for even diffs in the dozen lines. I've tried the same example on an Alpine container and it just works.

Alpine (`grep 2.25-r0`):

``` shell
~ $ seq 20 > a && seq 6 20 > b && grep -Fxvf b a
1
2
3
4
5
```

OS X (`grep (BSD grep) 2.5.1-FreeBSD`):

``` shell
~ $ seq 20 > a && seq 6 20 > b && grep -Fxvf b a
1
2
3
4
5
16
17
18
19
```

## What about infinite streams?

The tools mentioned above work with streams that finish, like:

- files
- commands (provided they finish)
- sql queries
- curl requests (provided they finish or timeout)

Infinite streams are ok on the left side stream of the diff, but you can't start diffing until the right side stream finishes.

Note that you can't `| sort` an infinite stream, so if you plan to diff an infinite stream on the left side, `comm` is not an option; you have to use `grep -Fxvf`.

Moreover, if you diff with an infinite stream on the left side, your diff will work but will still never finish. This is fine, unless you want your diff to be part of a script.

## Common strategies for diffing infinite streams

The two intuitive approaches are:

1. to take the first *n* items from the infinite stream
1. to timeout the stream after some time.

Taking the first 10 lines from two "infinite" seqs

``` shell
~ $ comm -23 <(seq 10000000000 | head -n 10) \
>            <(seq 6 10000000000 | head -n 10)
1
2
3
4
5
```
(for brevity, let's assume that `seq 10000000000` takes infinite time; to be fair it does take an impractical amount of time)

Then there is [timeout](http://man7.org/linux/man-pages/man1/timeout.1.html) in the Linux coreutils package for timing out a command after a specified duration. Note that it doesn't come installed in OS X.

The following example is illustrative, because the command varies between systems

``` shell
~ $ comm -23 <(timeout 1s seq 10000000000) \
>            <(timeout 1s seq 6 10000000000)
1
2
3
4
5
```

If you want `timeout` on OS X, your best bet is to install coreutils from Homebrew, with:

``` shell
brew install coreutils
```
and then all coreutils commands are available, with a `g` prepended to their names (e.g. `gtimeout`)

## The problem with these strategies

Both approaches share a common defect: they don't react to stream output.

There's no way to express the following:

>time out after some time has passed with no received lines

As it turns out, it's quite common to use tools that poll forever, stuck in some form of receive loop.

Examples:

- A Kafka console consumer, like [kt](https://github.com/fgeller/kt) (my originating use case)
- `tail -f`
- Any poll-forever scheme, e.g.

``` shell
while [[ TRUE ]]; do
  curl https://status.github.com/api/status.json
  sleep 10
done
```

## My current solution: `sd` (stream differ)

I developed a very simple, well-tested, modern and efficient tool for diffing two newline-separated streams, timing them out if necessary. It's written in [Go](https://golang.org/).

[sd repo @ Github](https://github.com/MarianoGappa/sd)

The initial example, with `sd`

``` shell
$ seq 100 | sd 'seq 6 100'
2
1
3
5
4
```

Note that `sd` does not guarantee output order. This is because it violently parallelises work via goroutines. If input is sporadical, output should not come out out of order. If you need sorted output, just add `| sort` at the end.

If you do add `| sort` at the end, even though `sd` will diff right away, you won't see results until `sd` has finished; this is just how sorting works. Also, `sort` will give you a natural sort (alphanumerical or numerical, and optionally reverse), but you would still lose the input order.

Use `-h` or `--hard-timeout` to timeout after a number of seconds

``` shell
$ seq 100 | sd -h 1 'tail -fn 100 <(seq 6 100)'
1
2
3
4
5
```

Use `-t` or `--timeout` to timeout after a number of seconds of no new lines. Note that the two streams hold independent timeouts.

``` shell
$ cat uuids.txt | sd -t 10 './kafka-consumer.sh uuids_topic'
a5aff766-564a-11e6-beb8-9e71128cae77
a5affbd0-564a-11e6-beb8-9e71128cae77
a5afff2c-564a-11e6-beb8-9e71128cae77
a5b00328-564a-11e6-beb8-9e71128cae77
...
```

Usually, tools like `mysql` or commit log consumers take some time to startup, or to run the query. It makes sense to have a longer timeout period for the first message. Use `-p` or `--patience` for this.

``` shell
$ cat uuids.txt | sd -p 20 -t 10 './kafka-consumer.sh uuids_topic'
a5aff766-564a-11e6-beb8-9e71128cae77
a5affbd0-564a-11e6-beb8-9e71128cae77
a5afff2c-564a-11e6-beb8-9e71128cae77
a5b00328-564a-11e6-beb8-9e71128cae77
...
```

Use `-p 0` for waiting indefinitely for the initial message.

If you're sure the second stream will finish, use `-i` or `--infinite`; this way you can be confident that `sd` will wait until the second stream finishes to start diffing.

## Conclusion

`sd` is a nifty tool, and a useful addition for a dev's toolbelt. It allows for automation scripts that involve infinite streams; something not readily available currently using GNU-style CLI tools.

It's not perfect: I wouldn't choose it over `comm` for streams that finish, because even though `sd` is fast, it does have to check every line of `STDIN` against every line of the second stream where `comm` does not. On very long streams, this can get impractically slow. Also, if output order is critical and it doesn't follow a natural order criterion, `sd` can't be used.

Please, consider `sd` for your stream diffing needs. [Issues](https://github.com/MarianoGappa/sd/issues) and [PRs](https://github.com/MarianoGappa/sd/issues#fork-destination-box) are welcome and encouraged: `sd` is [MIT licensed](https://github.com/MarianoGappa/sd/blob/master/LICENSE).
