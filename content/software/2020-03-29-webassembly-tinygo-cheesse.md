---
title:      Running Golang on the browser with WebAssembly and TinyGo
date:       2020-04-01
summary:    This is the story of how I managed to expose my Golang chess backend project cheesse as a WebAssembly binary, compiled using TinyGo, so JavaScript could use it, without needing a server.
slug:       "webassembly-tinygo-cheesse"
publications:
    - icon: golang_weekly
      issue: 306
      url: http://golangweekly.com/issues/306
---

## TL;DR

This is the story of how I managed to expose my Golang chess API project [cheesse](https://github.com/marianogappa/cheesse) as a [WebAssembly](https://webassembly.org/) binary, compiled using [TinyGo](https://tinygo.org/), so JavaScript could use it without needing a server.


The blogpost is optimised for helping others going through a similar exercise, rather than for readability, so expect a little too much of "if this, do this". Sorry.

## What are all those technologies?


**WebAssembly**

Assembly language of the Web, apparently. All major browsers support it, and the Go compiler supports js/wasm as an OS/ARCH target, so one can write Go code that runs on a webpage, rather than on a server.

**TinyGo**

It's a Go compiler optimised for the WebAssembly target (and also for microcontrollers). The key advantage over the official Go compiler is that it generates *tiny* binaries. [Even the Go wiki](https://github.com/golang/go/wiki/WebAssembly#reducing-the-size-of-wasm-files) recommends using TinyGo.

**Cheesse**

Chess API that tells you, e.g.:

- given chess board: what are the possible moves?
- given a chess board and an action: what does the game look like after?
- given a chess match in some notation: how does the chess board evolve?

## What's the goal?

 - The *cheesse* API compiles to a wasm binary, exposing the API to JavaScript without needing a server.
 - It is not necessary to maintain a separate version of the code to compile to this target.
 - The generated wasm binary has a reasonable size for use on the Web.

## Exposing API to JavaScript

Consider one of *cheesse*'s basic endpoints:

```go
ParseGame(game InputGame) (OutputGame, error)
```

You give it a chess game and it spits out all relevant info about it, or an error if input is wrong.

This is how you expose a function onto the JavaScript global scope:

```go
// This should be in a "main_js.go"
func main() {
  js.Global().Set("ParseGame", js.FuncOf(ParseGame))
  select {} // Code must not finish
}
```

If you don't do that `select{}`, or something to that effect, you'll find this error in the Developer console of your browser:

```bash
Error: Go program has already exited
```

## Mapping values from JS to Go and vice-versa

This is the implementation of the `ParseGame` function defined above:

```go
func ParseGame(this js.Value, args []js.Value) interface{} {
  og, err := api.ParseGame(convertToInputGame(args[0]))
  return js.ValueOf(map[string]interface{}{
    "outputGame": convertOutputGame(og),
    "error": convertError(err),
  })
}
```

Basically just mapping the API's inputs and outputs to `js/syscall`'s interfaces.

`ParseGame` follows [js.FuncOf()](https://golang.org/pkg/syscall/js/#FuncOf)'s interface:

```go
(this js.Value, args []js.Value) interface{}
```

Where `args` are the arguments supplied to `ParseGame` from JavaScript.

Here's a simplified implementation of `convertToInputGame`:

```go
func convertToInputGame(v js.Value) api.InputGame {
  return api.InputGame{
    DefaultGame: jsBool(v.Get("defaultGame")),
    FENString: jsString(v.Get("fenString")),
  }
}

func  jsBool(j js.Value) bool {
  if j.IsUndefined() || j.IsNull() {
    return  false
  }
 return j.Bool()
}

func  jsString(j js.Value) string {
  if j.IsUndefined() || j.IsNull() {
    return  ""
  }
  return j.String()
}
```

For `convertOutputGame`, it's trickier. Here's a very simplified `OutputGame`:

```go
type OutputGame struct {
  FENString string         `json:"fenString"`
  Actions   []OutputAction `json:"actions"`
}

type OutputAction struct {
  FromSquare      string  `json:"fromSquare"`
  ToSquare        string  `json:"toSquare"`
}
```

How do we map a struct with a slice of structs to something that `js.ValueOf` can receive? For this, first review [the docs](https://golang.org/pkg/syscall/js/#ValueOf):

```
func ValueOf(x interface{}) Value

ValueOf returns x as a JavaScript value:

Go                    | JavaScript 
----------------------| -----------
js.Value              | [its value]
js.Func               | function   
nil                   | null       
bool                  | boolean    
integers and floats   | number     
string                | string     
[]interface{}         | new array  
map[string]interface{}| new object 

Panics if x is not one of the expected types.
```

Go struct => JS object, so top-layer we must send a `map[string]interface{}`.

The trick is: the map's values (i.e. the `interface{}` part) follow the same rules from those docs. That's how we achieve the nesting.

```go
func convertOutputGame(og api.OutputGame) map[string]interface{} {
  return map[string]interface{}{
    "fenString": og.FENString,
    "actions": convertOutputActions(og.Actions),
  }
}

func convertOutputActions(as []api.OutputAction) []interface{} {
  is := make([]interface{}, len(as))
  for i := range as {
    is[i] = convertOutputAction(as[i])
  }
  return is
}

func convertOutputAction(a api.OutputAction) map[string]interface{} {
  return map[string]interface{}{
    "fromSquare": a.FromPieceSquare,
    "toSquare": a.ToSquare,
  }
}
```

## Ok, compile time!

```bash
✔ $ GOOS=js GOARCH=wasm go build -o poc/main.wasm
# github.com/marianogappa/cheesse
./main_js.go:39:6: main redeclared in this block
	previous declaration at ./main.go:17:6
```

Oh, right. We have two `main()`. We can use build constraints.

Put this on the first line of `main.go`:

```
// +build !js

package main
```

And this on the first line of `main_js.go`:

```
// +build js,wasm

package main
```

Don't forget to leave a **newline** between the `//` and `package main`. That's [not optional](https://golang.org/pkg/go/build/#hdr-Build_Constraints) and fails silently.

Also, don't do `+build !js,wasm`. That doesn't work either. There's only `wasm` anyway, right?

## Ok, compile time! #2

```
✔ $ GOOS=js GOARCH=wasm go build -o poc/main.wasm
✔ $
```
 🎉

Follow [these instructions](https://github.com/golang/go/wiki/WebAssembly#getting-started) on how to load the `main.wasm` into an `index.html` file.

If you try to open the `index.html` directly on your browser you'll get this error on the browser's Developer Console:

```
Fetch API cannot load file:///.../poc/main.wasm.
URL scheme must be "http" or "https" for CORS request.
```

You need to serve the files. 

## Serving the files

Your favourite one-liner server (is it Python's `SimpleHTTPServer` for all of us?), might give you this error:

```
TypeError: Response has unsupported MIME type
```

You need a server that knows about WebAssembly's MIME type.

The easy way:

```
# install goexec: go get -u github.com/shurcooL/goexec
$ goexec 'http.ListenAndServe(`:8080`, http.FileServer(http.Dir(`.`)))'
```

If you really want to use `SimpleHTTPServer` there's a solution that I validated to work [here](https://curiousprog.com/2018/10/08/serving-webassembly-files-with-a-development-web-server/).

## Did it work?

Yes! 🎉

![Working Proof of Concept](/images/posts/webassembly-tinygo-cheesse.gif)

But there's a catch:

```bash
$ ll -h main.wasm
-rwxr-xr-x  1 marianol  staff   7.6M 28 Mar 20:45 main.wasm
```

I know the Web is bloated, but 7.6MB is not gonna fly.

## Enter TinyGo

Drop-in replacement for the Go compiler, right?

```
$ tinygo build -o poc/main.wasm -target wasm .
error: requires go version 1.11, 1.12, or 1.13, got go1.14
```

Ok, that's not that bad. Go 1.14 is gonna be supported [soon](https://github.com/tinygo-org/tinygo/pull/901), but for now we'll have to downgrade:

```
$ brew install go@1.13
...
$ echo 'export PATH="/usr/local/opt/go@1.13/bin:$PATH"' >> ~/.bash_profile
...
$ go version
go version go1.13.9 darwin/amd64
```

## TinyGo, Round 2!

Drop-in replacement for the Go compiler, right?

``` bash
$ tinygo build -o poc/main.wasm -target wasm .
# encoding/asn1
usr/local/Cellar/go@1.13/1.13.9/libexec/src/encoding/asn1/marshal.go:537:47: v.Type().NumMethod undefined (type reflect.Type has no field or method NumMethod)
usr/local/Cellar/go@1.13/1.13.9/libexec/src/encoding/asn1/marshal.go:549:14: DeepEqual not declared by package reflect
usr/local/Cellar/go@1.13/1.13.9/libexec/src/encoding/asn1/marshal.go:558:14: DeepEqual not declared by package reflect
usr/local/Cellar/go@1.13/1.13.9/libexec/src/encoding/asn1/marshal.go:479:93: t.Field(startingField).Tag.Get undefined (type string has no field or method Get)
usr/local/Cellar/go@1.13/1.13.9/libexec/src/encoding/asn1/marshal.go:483:103: t.Field(i + startingField).Tag.Get undefined (type string has no field or method Get)
...
```

Oh, God, what's all this?

Ok, the thing with TinyGo is that there are many stdlib packages that are not yet supported, so if you must use them then you can't use TinyGo, unfortunately.

[https://tinygo.org/lang-support/stdlib/](https://tinygo.org/lang-support/stdlib/)

Some key unsupported packages: `encoding/json` & `net/http` (I assume `encoding/asn1` is a dependency of `net/http`).

I was using both. Since I don't need them for the JS part, the solution is to use a TinyGo-specific build constraint instead of `// +build !js`:

```go
// +build !tinygo
```

And vice-versa for `main_js.go`.

## TinyGo, Round 3!

```
$ tinygo build -o poc/main.wasm -target wasm .
# github.com/marianogappa/cheesse
main_js.go:102:7: j.IsUndefined undefined (type js.Value has no field or method IsUndefined)
main_js.go:102:26: j.IsNull undefined (type js.Value has no field or method IsNull)
main_js.go:95:7: j.IsUndefined undefined (type js.Value has no field or method IsUndefined)
...
```

Unsupported `js/syscall` methods?

Nah, this one is not on TinyGo. We've downgraded Go to 1.13.9, so those methods don't exist anymore.

Replace all:

```go
j.IsUndefined()
```

With:

```go
j == js.Undefined()
```


## TinyGo, Round 4!

```
$ tinygo build -o poc/main.wasm -target wasm .
# github.com/marianogappa/cheesse/api
/usr/local/Cellar/tinygo/0.12.0/src/sync/pool.go:14:14 unsupported instruction during init evaluation:
  %23 = inttoptr i32 %22 to %runtime._interface (i8*, i8*)*, !dbg !1864
```

Huh?

Ok, that's confusing, but it's something to do with an instruction that runs during an `init()` that indirectly ends up in `sync/pool`, that must be unsupported or something.

I don't use `init()`, and [neither should you](https://github.com/leighmcculloch/gochecknoinits). But if you have a `var` in the global scope (i.e. a global variable) that calls something, then the Go compiler will put that in an `init()`.

You shouldn't have globals either, but we make some exceptions, and in my case it was like a million error literals like this one:

```go
var errBlackCastle = fmt.Errorf("impossible for black to castle since king has moved")
```

It turns out `fmt.Errorf` ends up calling `sync/pool`. A brilliant workaround for this one is to replace `fmt.Errorf` with `errors.New`. This only works if you have nothing to interpolate, but since it's a global, you probably don't.

If you have other globals that call things, keep the `var`, but initialise the value in your `main()`.

## TinyGo: Round 5!

```bash
$ tinygo build -o poc/main.wasm -target wasm .
inlinable function call in a function with debug info must have a !dbg location
  call void @runtime.nilPanic(i8* undef, i8* null)
inlinable function call in a function with debug info must have a !dbg location
  %352 = call fastcc i1 @"github.com/marianogappa/cheesse/api.boolMatcher$1"(i32 %351, i8* %pack.int217, i8* %341, i8* undef)
inlinable function call in a function with debug info must have a !dbg location
  %353 = call fastcc i1 @"github.com/marianogappa/cheesse/api.intMatcher$1"(i32 %351, i8* %pack.int217, i8* %341, i8* undef)
inlinable function call in a function with debug info must have a !dbg location
  %354 = call fastcc i1 @"github.com/marianogappa/cheesse/api.pieceTypeMatcher$1"(i32 %351, i8* %pack.int217, i8* %341, i8* undef)
error: optimizations caused a verification failure
```

WAT.
Ok, I don't know. But if you get this, the workaround is to add the `-no-debug` flag to the compile line.

## TinyGo, Round 6!

```bash
$ tinygo build -o poc/main.wasm -no-debug -target wasm .
$
```

OMG, YES! 🎉🎉🎉 Did it work???

Nope. If you get an error in the Developer Console on your browser, perhaps this one:

```
TypeError: import object field 'wasi_unstable' is not an Object
```

You need to take into account that every compiler you use, and every version of that compiler might have a different companion `wasm_exec.js`. For TinyGo, do this:

```bash
cp $(tinygo env TINYGOROOT)/targets/wasm_exec.js .
```

## TinyGo, Round 7!

You might do absolutely everything right, get it compiled and then go to your browser's Developer Console and see this:

```
panic: syscall/js: Value.Call: property _makeFuncWrapper is not a function, got undefined [wasm_exec.js:201:19](http://localhost:8000/wasm_exec.js)
```

That one is this issue:
[https://github.com/tinygo-org/tinygo/issues/716](https://github.com/tinygo-org/tinygo/issues/716)

It might be solved by the time you read this, but the workaround at the time of this writing is to switch to the `dev` version of TinyGo, which is pretty bleeding edge but seems to work well.

Follow the [Source Install instructions](https://tinygo.org/getting-started/macos/) and change branch before installing. 

Something like:

```bash
$ brew install llvm
$ cd /tmp
$ export GO111MODULE=on
$ go get -d -u github.com/tinygo-org/tinygo
$ cd $GOPATH/src/github.com/tinygo-org/tinygo
$ git checkout dev
$ go install
```

## TinyGo, Round 8!

```bash
$ tinygo build -o poc/main.wasm -no-debug -target wasm .
$
```

Before testing on the browser, remember that you've changed the version of TinyGo, so you must copy `wasm_exec.js` again, only this time the file is in a different place because you've built from source:

```bash
cp $GOPATH/src/github.com/tinygo-org/tinygo/targets/wasm_exec.js .
```

Did it work???

![Working Proof of Concept](/images/posts/webassembly-tinygo-cheesse.gif)

OMG, YES! 🎉🎉🎉

## One last check

```bash
$ ll -h main.wasm
-rwxr-xr-x  1 marianol  staff   392K 29 Mar 00:21 main.wasm
```

392 KB! That's an amazing improvement from 7.6MB! 🎉🎉🎉

## Conclusion

Writing Go code for the browser is a reality today. But it's no picnic. Ideally, we'd write whatever we want, run the Go compiler and get a 1kb npm package or something, right? Well, we'll get there. Still a better love story than writing JavaScript, aye.

[auto-play proof of concept](https://marianogappa.github.io/cheesse-examples/)

[cheesse open source project](https://github.com/marianogappa/cheesse)

## Acknowledgements

I didn't come up with most of the solutions to the issues outlined in this blogpost. This was only possible thanks to the kind and patient help I received from TinyGo's author [Ayke van Laethem](https://twitter.com/aykevl) and contributors [Jaden Weiss](https://twitter.com/jaddr2line) and [Johan Brandhorst](https://twitter.com/JohanBrandhorst) for hours on end at the #tinygo channel on [GopherSlack](https://invite.slack.golangbridge.org/).
Also, thanks to [Paul Jolly](https://twitter.com/_myitcv) for pointing me in the right direction while getting started with WebAssembly.

