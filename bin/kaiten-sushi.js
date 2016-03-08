#!/usr/bin/env node
"use strict";

const readline       = require("readline");
const ansi           = require("ansi-escapes");
const ArgumentParser = require("argparse").ArgumentParser;
const KaitenSushi    = require("../");


const main = (options) => {
  const sushi = new KaitenSushi({
    width:   options.width,
    height:  options.line,
    rainbow: options.rainbow,
    neta:    options.neta,
    c256:    options["256"]
  });


  if(options.message){
    sushi.add(options.message);
  }

  const f = () => {
    process.stdout.write(ansi.cursorUp(sushi.height));
    console.log(sushi.kaiten());

    setTimeout(f, options.interval);
  };

  console.log(sushi.kaiten());
  f();
}

readline.emitKeypressEvents(process.stdin);
process.stdin.setRawMode(true);

const restore = () => {
  process.stdout.write(ansi.cursorShow);
}

process
.on("exit", restore)
.on("SIGTERM", () => {
  restore();
  process.exit();
});

process.stdin.on("keypress", (seq, key) => {
  if(key.ctrl && (key.name === "d" || key.name === "c")){
    process.exit();
  }
});

process.stdout.write(ansi.cursorHide);

const parser = new ArgumentParser({
  description: "kaiten-sushi 🍣"
});

parser.addArgument(["-m", "--message"], {
});

parser.addArgument(["-n", "--neta"], {
});

parser.addArgument(["-l", "--line"], {
  type: "int",
  defaultValue: 0
});

parser.addArgument(["-w", "--width"], {
  type: "int",
  defaultValue: 0
});

parser.addArgument(["-r", "--rainbow"], {
  action: "storeTrue"
});

parser.addArgument(["--256"], {
  help: "ansi 256 gradient",
  action: "storeTrue"
});

parser.addArgument(["-i", "--interval"], {
  type: "int",
  defaultValue: 100
});

main(parser.parseArgs());
