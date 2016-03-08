回転寿司🍣
===============

![demo](https://raw.githubusercontent.com/zaftzaft/kaiten-sushi/master/demo.gif)


# Install

```
# npm i -g kaiten-sushi
```


# Usage

```
$ kaiten-sushi
```

# Help

```
$ kaiten-sushi -h
```


# API

```
const KaitenSushi = require("kaiten-sushi");

const sushi = new KaitenSushi({
  width: 10,
  height: 20,
  c256: true,
  neta: "🍣🐱🐶a"
});

sushi.add("nyan!");

console.log(sushi.rotation());

```

## new KaitenSushi({ options })

### options
+ rainbow: `bool`
+ c256: `bool`
+ width: `number`
+ height: `number`
+ neta: `string`


## .add( String )
## .rotation()
## .frame()
## .get()
## .resize(width, height)
