---
title:      10 Gotchas for building a universal crypto candlestick iterator in Go
date:       2022-07-27
summary:    My journey building a universal crypto candlestick iterator in Go, with tips for all the challenges you'll face working with crypto exchanges' APIs.
slug:       "10-gotchas-for-building-a-universal-crypto-candlestick-iterator-in-go"
image: /images/posts/candlesticks-background.jpg
publications:
    - icon: golang_weekly
      issue: 422
      url: https://golangweekly.com/issues/422
---

## TL;DR

I've recently open sourced a universal crypto candlestick iterator library in Go called crypto-candles:

[https://github.com/marianogappa/crypto-candles](https://github.com/marianogappa/crypto-candles)

It's being used to power the **[Crypto Predictions Tracker](https://twitter.com/crypto_preds)**: the only unbiased, automated accountability watchdog for crypto predictions on the Internet.

There is no Go library alternative I've found, or I would have used it. There are some exchange SDKs, though.

In this blogpost, I share all the interesting challenges I found while building this library over the past few months.

## What is a candlestick?

[Candlesticks](https://www.investopedia.com/terms/c/candlestick.asp), also known as OHLC (i.e. Open, High, Low, Close), Klines and Bucketed Trades, are a way to display the high, low, open, and closing prices of crypto market pairs (and traditional securities) for a specific period.

![Candlestick](https://www.investopedia.com/thmb/F9Gcg7_Is-0Pj7jILEMe9IIscm0=/660x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/CandlestickDefinition3-a768ecdaadc2440db427fe8207491819.png)

[Candlestick charts](https://www.tradingview.com/chart/QVMg9Xmj/?symbol=BINANCE%3ABTCUSDT) are a common sight for crypto investors, and they are used to make buy/sell decisions, either manually or via bots or some other automated mechanisms.

Crypto exchanges like [Binance](https://www.binance.com) or [Coinbase](https://www.coinbase.com/) expose APIs with market information for all their supported market pairs (e.g. BTC/USDT) and allow you to consume them for free within fair-use limits.

![Candlestick chart](/images/posts/candlesticks.png)

## What is a crypto candlestick iterator?

A Crypto Candlestick Iterator is an [iterator](https://en.wikipedia.org/wiki/Iterator_pattern) that you construct for:
- a given provider (e.g. Binance, Coinbase)
- a given market pair (e.g. BTC/USDT)
- a given starting timestamp (e.g. "2020-07-04T01:02:03Z", here represented in ISO8601 format)
- and a given candlestick interval (e.g. minutely, hourly, daily).

Example in crypto-candles:

```go
	m := candles.NewMarket()
	iter, err := m.Iterator(
		common.MarketSource{
			Type: common.COIN,
			Provider: common.BINANCE,
			BaseAsset: "BTC",
			QuoteAsset: "USDT"
		},
		time.Now().Add(-12*time.Hour), // Start time
		1*time.Hour,                   // Candlestick interval
	)
```

Once constructed, calling `.Next()` on it returns either the next available candlestick in your specified interval, or an error:

```go
	candlestick, err := iter.Next()
```

A candlestick looks like this when marshalled to JSON:

```json
{"t":1641096000,"o":47329.47,"c":46910.3,"l":46770.23,"h":47415.73}
```

Where:
- `o`: Open price
- `c`: Close price
- `l`: Low price
- `h`: High price

...of the `BTC/USDT` market pair

...on `BINANCE` 

...at the hour spanning from the timestamp `t` and up to `t + candlestickInterval`. 

## What does "universal" candlestick iterator mean?

It means that it supports all major exchanges.

Usually, you use the API or SDK of the exchange you want to use. If you need to use more than one, it gets tricky.

## What's the use case for a universal candlestick iterator?

1. Data for plotting candlestick charts. If you need 2+ exchanges.

2. Data for backtesting trading strategies. If you need 2+ exchanges.

3. Data for being a watchdog for influencing statements [like this one](https://twitter.com/rovercrc/status/1539710164697227267).

And with crypto-candles, you get caching, retrying on errors, patching of data gaps and concurrency-safety for free.

## The meaty part: gotchas!

Building this library through the months has been a big challenge, and in this section I'll list all of the important gotchas I've found during this process.

### Gotcha 1: Not all exchanges provide historical candlesticks

They all provide current prices. Not all provide historicals. Some do in very tricky ways.

**FTX** does:

```sh
$ curl -s "https://ftx.com/api/markets/BTC/USDT/candles?resolution=60&start_time="$(date -j -f "%Y-%m-%d %H:%M:%S" "2020-04-07 00:00:00" "+%s")"&end_time="$(date -j -f "%Y-%m-%d %H:%M:%S" "2020-04-07 00:02:00" "+%s")"" | jq '.result | .[]'
{
	"startTime": "2020-04-06T23:00:00+00:00",
	"time": 1586214000000,
	"open": 7274,
	"high": 7281.5,
	"low": 7272,
	"close": 7281.5,
	"volume": 0
}
{
	"startTime": "2020-04-06T23:01:00+00:00",
	"time": 1586214060000,
	"open": 7281.5,
	"high": 7281.5,
	"low": 7277,
	"close": 7280,
	"volume": 0
}
{
	"startTime": "2020-04-06T23:02:00+00:00",
	"time": 1586214120000,
	"open": 7280,
	"high": 7280,
	"low": 7271.5,
	"close": 7274,
	"volume": 0
}
```

But on **Huobi**, [the docs](https://huobiapi.github.io/docs/spot/v1/en/#get-klines-candles) say:

>This API doesn't support customized period, refer to Websocket K line API to get the emurated period value.

Not sure what that means, but I don't think Websockets do either.

**Kraken** says they do, but they silently ignore their "since" parameter if you go over a very short threshold to the past. Details in [this Stack Overflow answer](https://stackoverflow.com/a/48618456/965724).

You can still get them, if you calculate them yourself, by getting all trades and bucketing them yourself. It's linear time. But you have no control on what *n* is, so don't.

**Phemex** has only a [websocket-based "subscribe kline" endpoint](https://github.com/phemex/phemex-api-docs/blob/master/Public-Spot-API-en.md#subscribe-kline), but only gets you up to 1000 candlesticks to the past. Then you're stuck with Kraken-style [Query Trades History endpoint](https://github.com/phemex/phemex-api-docs/blob/master/Public-Spot-API-en.md#query-trades-history).

### Gotcha 2: Rate limiting

All exchanges must have a rate-limiting strategy to prevent malicious or buggy clients from [DDoSing](https://en.wikipedia.org/wiki/Denial-of-service_attack) their APIs. Otherwise you'd kill them!

In general (not always!), they give you an [HTTP 429 status code](https://en.wikipedia.org/wiki/List_of_HTTP_status_codes#429) when they want you to enhance your calm. If you don't, **they IP-ban** you temporarily.

In general, candlestick endpoints are "public market data" and don't require an API Key. But if you get one, they might be more tolerant with rate-limiting.

On **Binance**, [the docs](https://binance-docs.github.io/apidocs/spot/en/#general-api-information) say that if you ignore the 429s, you get IP banned for 2 minutes, and up to 3 days for repeat offenders. They send a `Retry-After` header on the 429s with how many seconds you should sleep.

On **Coinbase**, [the docs here](https://docs.cloud.coinbase.com/sign-in-with-coinbase/docs/rate-limiting) and [here](https://help.coinbase.com/en/pro/other-topics/api/faq-on-api) say they allow ~3-6 requests per second.

**FTX** [docs](https://help.ftx.com/hc/en-us/articles/360052595091-2020-11-20-Ratelimit-Updates) make no sense. Don't worry, you're fine.

On **Kucoin**, the docs lie, so you don't need a link. You're gonna get 429'd no matter what you do. Just back-off.

The other ones are fine, more on that later.

Ideally, don't make them 429 you. Do this:

- Calculate the truncated current minute of your request: `time.Now().Add(-1 * time.Minute).Truncate(time.Minute)`
- Keep track of the last requested minute, and a counter
- If the current minute of your request equals the last, increment the counter (and reset it if not)
- If the counter exceeds the exchange's limits, sleep!

**Don't use concurrency** unless:
1. Every goroutine talks to a different exchange
2. You have a pool of IPs and a proxy, and every goroutine talks to a separate (exchange, IP) tuple
3. You're willing to mutex the hell out of your code

### Gotcha 3: Some exchanges don't respect their rate limit documentation

You're following the rules? The rules are wrong.

On **Kucoin**, [the docs](https://docs.kucoin.com/#request-rate-limit) say that they allow an IP to make 10 requests per second. They don't. There are [many](https://www.reddit.com/r/kucoin/comments/q5blef/api_ratelimits_problems/), [Reddit](https://www.reddit.com/r/kucoin/comments/q40ode/whats_the_request_rate_limit/), [links](https://www.reddit.com/r/kucoin/comments/lmdld9/kucoin_api_limits/) out there with people fuming about their aggressive undocumented rate limiting practices.

On **Bitfinex**, [the docs](https://docs.bitfinex.com/docs/requirements-and-limitations) say they allow 10-90 requests per minute, but I ran this script that made ~140 requests per minute for many minutes and I cannot get it to rate limit me:

```
while [ TRUE ]; do echo $(curl "https://api-pub.bitfinex.com/v2/candles/trade:1m:tBTCUSD/hist?limit=3&sort=1&start=1564774820000" | jq .); done
```

### Gotcha 4: Candlestick data may be incomplete

[Coinbase docs](https://docs.cloud.coinbase.com/exchange/reference/exchangerestapi_getproductcandles) explicitly say there are gaps in the data. And it's true. More often in the 1 minute interval.

Problems it causes:

1. You're plotting a chart. Is it ok to leave a gap in it?

2. You're sending candlesticks to something. The receiving end hardcodes the timestamp to `startTimestamp + i * interval`. Bug.

3. You're backtesting a strategy. Your bot receives a candlestick with price 0 (or a gap) and freaks out. Bug.

Possible solution: fill gaps by cloning previously known prices. Doesn't work if the gap is at the start.

### Gotcha 5: You won't get the starting candlestick time you asked for

The final boss! Trickiest gotcha.

You request candlesticks starting at `2020-07-04T01:02:03Z`. But you won't get that starting timestamp.

Exchanges snap your starting time to the data they have, and they *mostly* do the same. *Mostly*.

- For 1m interval: they will mostly start at `2020-07-04T01:03:00Z` (i.e. the next minute).
- For 1h interval: they will mostly start at `2020-07-04T02:00:00Z` (i.e. the next hour).
- For 1d interval: they will mostly start at `2020-07-05T00:00:00Z` (i.e. the next day).

You get the point. Do this: 

```go
	snapTime := startTime.Add(interval).Truncate(interval)
```

**FTX** for minutely candlesticks:

```bash
$ curl -s "https://ftx.com/api/markets/BTC/USDT/candles?resolution=60&start_time="$(TZ=UTC date -j -f "%Y-%m-%d %H:%M:%S" "2020-07-04 00:00:33" "+%s")"&end_time="$(TZ=UTC date -j -f "%Y-%m-%d %H:%M:%S" "2020-07-04 00:03:33" "+%s")"" | jq '.result | .[] | .startTime'
"2020-07-04T00:01:00+00:00"
"2020-07-04T00:02:00+00:00"
"2020-07-04T00:03:00+00:00"
```


**Bitstamp** is the only one that snaps to the past, here on minutely:

```bash
$ curl -s "https://www.bitstamp.net/api/v2/ohlc/btcusd/?limit=3&step=60&start="$(TZ=UTC date -j -f "%Y-%m-%d %H:%M:%S" "2020-07-04 00:00:33" "+%s") | jq '.data.ohlc | .[] | .timestamp | tonumber | todate'
"2020-07-04T00:00:00Z"
"2020-07-04T00:01:00Z"
"2020-07-04T00:02:00Z"
```

What about intervals that are not divisors of 24-hour, e.g. 5-hour? They don't support them!

And don't get me started on weekly. Some support weekly. It's important.

**Binance** & **Bitfinex** work with the same truncation strategy:

```go
	tm, _    := time.Parse(time.RFC3339, "2020-07-04T01:02:03Z")
	interval := 7 * 24 * time.Hour
	snap     := tm.Add(interval).Truncate(interval)
```

Which produces: `2020-07-06T00:00:00Z`. Let's see if it's true:

```bash
$ curl -s 'https://api.binance.com/api/v3/klines?symbol=BTCUSDT&interval=1w&limit=3&startTime='$(TZ=UTC date -j -f"%Y-%m-%d %H:%M:%S" "2020-07-04 01:02:03" "+%s000")| jq '.[] | .[0] | . / 1000 | todate'
"2020-07-06T00:00:00Z"
"2020-07-13T00:00:00Z"
"2020-07-20T00:00:00Z"
```

**Kucoin** snaps to Thursdays, and don't ask me why!

**FTX** is a unique case. They support 1-day, 2-day, ..., 30-day. On these, they snap your timestamp to next day (or same if it's already start of day), and then give you multiples starting on that day. Here's an example:

```bash
$ curl -s "https://ftx.com/api/markets/BTC/USDT/candles?resolution=259200&start_time="$(TZ=UTC date -j -f "%Y-%m-%d %H:%M:%S" "2020-07-04 01:02:03" "+%s")"&end_time="$(TZ=UTC date -j -f "%Y-%m-%d %H:%M:%S" "2020-07-10 00:00:00" "+%s")"" | jq '.result | .[] | .startTime'
"2020-07-05T00:00:00+00:00"
"2020-07-07T00:00:00+00:00"
"2020-07-10T00:00:00+00:00"
```

### Gotcha 6: Order of returned candlesticks varies across exchanges

Most exchanges return *ascending* order candlesticks. **Coinbase** and **Kucoin** return *descending*. **Bitfinex** returns *descending* by default, but can be changed.

Just reverse them. `O(n)` time, `O(1)` space:

```go
	for i, j := 0, len(candles)-1; i < j; i, j = i+1, j-1 {
		candles[i], candles[j] = candles[j], candles[i]
	}
```

### Gotcha 7: Exchanges silently ignoring arguments

From Gotcha #1: **Kraken** ignores the "since" parameter.

**FTX** is dangerous. In [the FTX request](https://docs.ftx.com/#get-historical-prices), you provide a `start_time` and an `end_time` for historical prices. 

- if `end_time` is not specified, `start_time` is ignored silently and recent data is returned. 
- if the range between `start_time` & `end_time` is too broad, `start_time` will be pushed forward until the range spans 1500 candlesticks.

### Gotcha 8: Invalid market pairs

You can't request candlesticks for `INVALID/USDT`. But all exchanges tell you this differently.

HTTP status codes:

- **Bitstamp**: `404`
- **Kucoin**: `200`
- **Binance**: `400`
- **FTX**: `404`
- **Coinbase**: `404`
- **Bitfinex**: `200`

HTTP Payloads:

- **Bitstamp**: no payload
- **Kucoin**: `{"code": "400100", "msg": "This pair is not provided at present."}`
- **Binance**: `{"code": -1121, "msg": "Invalid symbol."}`
- **FTX**: `{"success": false, "error": "No such market: INVALID/USDT "}`
- **Coinbase**: `{"message": "NotFound"}`
- **Bitfinex**: no payload

**Bitfinex** is the worst. It's hard to tell it's an invalid market pair. It could be that there are no new candlesticks, because your starting time is too recent.

### Gotcha 9: Requesting the most recent candlesticks

Be careful! Exchanges mostly don't care if you ask for non-historical starting times.

Here's **Binance** returning `200 OK` with the 3-minute `BTC/USDT` candlesticks for the year **2286**!

```bash
$ curl -s "https://api.binance.com/api/v3/klines?symbol=BTCUSDT&interval=3m&limit=60&startTime=9999999999000" | jq '.'
[]
```

Note that if you ask for `time.Now().Add(-1*time.Hour)`, but for daily candlesticks, your day is not over yet!

Even if it's over, how over is it? Race condition! Your exchange hasn't finalised bucketing the day yet!

If you plan to cache results, danger zone! Recent candlesticks will change.

I ran experiments to see in practical terms how much to "lag" to current candlesticks, and put that "patience configuration" in the library.

### Gotcha 10: Caching results

An iterator has a buffer of results that came from the latest request. That's all it needs.

But real-world applications will create multiple iterators. A cache is probably needed there. [The 80/20 rule](https://en.wikipedia.org/wiki/Pareto_principle) suggests 80% of created iterators will be for 20% of the options. You can imagine **Binance**'s `BTC/USDT` recent hourly candlesticks being popular.

[Caching is hard](https://martinfowler.com/bliki/TwoHardThings.html), but in this case it's a very sensible architectural choice:
- Historical candlesticks should not change (meh, except for Gotcha #9)
- Each cache hit saves up to ~100 milliseconds in HTTP requests
- Not making requests minimises rate-limiting issues

What about storing cache on filesystem?

Some exchanges even provide all of their historical data [as files](https://data.binance.vision/?prefix=data/spot/daily/klines/). Great, ~0 requests! But:
- Only a few exchanges provide it
- Cron to download new files, which will break
- Parsing different file formats for different exchanges
- Maybe 4-fallback level architecure (i.e. iterator buffer, in-memory cache, filesystem, HTTP request)
- New challenges (e.g. out-of-disk, permissions, rotating, wholes in data)

How about just an in-memory [LRU cache](https://en.wikipedia.org/wiki/Cache_replacement_policies#Least_recently_used_(LRU))?
- LRU plays well with 80/20 request distribution 
- Has fixed-size memory (configurable)
- Inefficient if you restart the process, but a non-invalidating cache scares me; let's refresh it on restarts

## Conclusion

I started tinkering with the idea of building this more than a year ago in [this commit](https://github.com/marianogappa/signal-checker/commit/ce6d9faddee7ff6e672d734b6eeb86abb63a5bd3) of a different repo, and I still feel like I don't fully get it.

Building this has been hard, but very fun too, and rewarding. It's [MIT licensed](https://en.wikipedia.org/wiki/MIT_License) so feel free to use it, profit from it, lose money with my bugs, file issues, contribute improvements, etc. [Docs are here](https://pkg.go.dev/github.com/marianogappa/crypto-candles), but go to the `candles` folder to see most of it.

I also hope that the **[Crypto Predictions Tracker](https://twitter.com/crypto_preds)** becomes popular, so that influencers get some accountability for their predictions. This is good: it will keep them honest, and improve their reputation.

[K.I.S.S.](https://en.wikipedia.org/wiki/KISS_principle)!
