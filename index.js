"use strict";

const punycode = require("punycode");
const readline = require("readline");
const ansi     = require("ansi-escapes");
const eaw      = require("eastasianwidth");
const argv     = require("minimist")(process.argv.slice(2), {
  alias: {
    l: "line",
    h: "help",
    r: "rainbow",
    i: "interval"
  }
});


const main = () => {
  const w = (process.stdout.columns / 2|0) - 2;
  const h = argv.line || 8;
  const sushi = "🍣";
  const pad = "  ";
  let conveyor = [];

  const rainbow = [31, 32, 33, 34, 35, 36];
  let rainbowPos = 0;

  let c256 = 0;

  const kaiten = (neta) => {
    punycode.ucs2.decode(neta).forEach((code) => {
      let c = punycode.ucs2.encode([code]);
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
        let n = 255 < c256 ? (c256 = 0) : c256++;
        conveyor.unshift("\x1b[38;5;" + n + "m" + c + "\x1b[39m");
      }
      else if(argv.rainbow){
        let n = rainbow[
          (rainbow.length <= ++rainbowPos) ? (rainbowPos = 0) : rainbowPos
        ];

        conveyor.unshift("\x1b[" + n + "m" + c + "\x1b[39m");
      }
      else{
        conveyor.unshift(c);
      }
    });

    ((Math.random() * 3|0) < 1)&& conveyor.unshift(null);

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
    kaiten(sushi);

    setTimeout(frame, argv.interval || 100);
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
