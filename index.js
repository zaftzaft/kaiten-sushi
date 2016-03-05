#!/usr/bin/env node
"use strict";

const readline = require("readline");
const ansi     = require("ansi-escapes");
const eaw      = require("eastasianwidth");
const argv     = require("minimist")(process.argv.slice(2), {
  alias: {
    l: "line",
    h: "help",
    r: "rainbow",
    i: "interval",
    w: "width"
  },
  default: {
    interval: 100
  }
});


const main = () => {
  const w = argv.width || ((process.stdout.columns / 2|0) - 2);
  const h = argv.line || 8;
  const sushi = "🍣";
  const pad = "  ";
  let conveyor = [];

  const rainbow = [31, 32, 33, 34, 35, 36];
  let rainbowPos = 0;

  let c256 = 0;

  const kaiten = (neta) => {

    try{

      [...neta].forEach((c) => {
        let l = eaw.length(c);

        // Ascii
        if(l === 1){
          c += " ";
        }
        // Emoji
        else if(l === 2 && c.length === 2){
          c += " ";
        }

        if(argv["256"]){
          conveyor.unshift(`\x1b[38;5;${
            255 < c256 ? (c256 = 0) : ++c256
          }m${c}\x1b[39m`);
        }
        else if(argv.rainbow){
          conveyor.unshift(`\x1b[${
            rainbow[
              (rainbow.length <= ++rainbowPos) ? (rainbowPos = 0) : rainbowPos
            ]
          }m${c}\x1b[39m`);
        }
        else{
          conveyor.unshift(c);
        }

      });

    }catch(e){
      conveyor.unshift(null);
    }


    process.stdout.write(pad);
    for(let i = 0;i < w;i++){
      process.stdout.write(conveyor[i] || pad);
    }
    process.stdout.write("\n");

    let margin = new Array(2 * w + 1).join(" ");
    for(let i = 0;i < h;i++){
      let left = (conveyor[(2 * w) + (2 * h) - i - 1] || pad);
      let right = (conveyor[w + i] || pad);
      process.stdout.write(left + margin + right + "\n");
    }

    process.stdout.write(pad);
    for(let i = 0;i < w;i++){
      process.stdout.write(conveyor[(2 * w) + h - i - 1] || pad);
    }
    process.stdout.write("\n");

    if(conveyor.length >= w * 2 + h * 2){
      conveyor.pop();
    }

  }


  const frame = () => {
    process.stdout.write(ansi.cursorUp(h + 2));
    kaiten(((Math.random() * 3|0) < 1) ? null : sushi);

    let interval = +argv.interval;
    if(interval < 10){
      interval = 10;
    }

    setTimeout(frame, interval);
  };

  let text = "" + (argv._[0] || "寿司sushi🍣🐟");

  process.stdout.write(ansi.cursorHide);
  kaiten(text);
  frame();
};

if(argv.help){
  console.log(`
    Usage: $ kaiten-sushi <message>

    Options:
      -l, --line <height>:
      -w, --width <width>:
      -i, --interval <msec>:
      -r, --rainbow: rainbow
      --256:
  `);
  process.exit();
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

main();
