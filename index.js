"use strict";

const eaw      = require("eastasianwidth");
const c256 = require("ansi-256-colors");

// TODO banner/message
// TODO clear/reset


class KaitenSushi {

  constructor(options) {
    this.resize(options.width, options.height);

    this.neta = options.neta || "🍣🐟🐚";
    this.rainbow = options.rainbow || false;
    this.c256 = options.c256;

    this.conveyor = [];
    this.queue = [];

    this.rainbowColor = [31, 32, 33, 34, 35, 36];
    this.rainbowPos = 0;

    this.gradient = {
      r: 3, g: 3, b:3
    };
  }


  getGradientColor() {
    const t = (n) => {
      let r = Math.random() * 2|0;

      if(n <= 1){
        n += 1;
      }
      else if(n >= 4){
        n -= 1;
      }
      else{
        n += (r ? 1 : -1);
      }
      return n;
    };

    let d = Math.random() * 3|0;

    (d === 0) && (this.gradient.r = t(this.gradient.r));
    (d === 1) && (this.gradient.g = t(this.gradient.g));
    (d === 2) && (this.gradient.b = t(this.gradient.b));

    return c256.fg.getRgb(this.gradient.r, this.gradient.g, this.gradient.b);
  }


  _add(neta) {
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

        if(this.c256){
          c = `${this.getGradientColor()}${c}${c256.reset}`;
        }
        if(this.rainbow){
          c = `\x1b[${
            this.rainbowColor[
              (this.rainbowColor.length <= ++this.rainbowPos) ? (this.rainbowPos = 0) : this.rainbowPos
            ]
          }m${c}\x1b[39m`;
        }


        this.conveyor.unshift(c);
      });

    }catch(e){
      this.conveyor.unshift(null);
    }

    return this;
  }


  add(neta) {
    [...neta].forEach(c => this.queue.push(c) );
  }


  rotation() {
    return this.kaiten();
  }


  kaiten() {
    let neta;

    if(this.queue.length){
      neta = this.queue.shift();
    }
    else{
      let netas = [...this.neta];

      neta = ((Math.random() * 3|0) < 1) ? null : netas[Math.random() * netas.length|0];
    }

    this._add(neta);

    return this.frame();
  }


  frame() {
    return this.get().join("\n");
  }


  get() {
    let line = [];
    let top = "";
    let bottom = "";
    const pad = "  ";
    const w = this.width;
    const h = this.height - 2;
    const conveyor = this.conveyor;

    top += pad;
    for(let i = 0;i < w;i++){
      top += conveyor[i] || pad;
    }
    line[0] = top;

    let margin = new Array(2 * w + 1).join(" ");
    for(let i = 0;i < h;i++){
      let left = (conveyor[(2 * w) + (2 * h) - i - 1] || pad);
      let right = (conveyor[w + i] || pad);
      line.push(left + margin + right);
    }

    bottom += pad;
    for(let i = 0;i < w;i++){
      bottom += conveyor[(2 * w) + h - i - 1] || pad;
    }
    line.push(bottom);

    return line;
  }


  resize(width, height) {
    this.width = width || ((process.stdout.columns / 2|0) - 2);
    if(this.width < 1){
      this.width = 1;
    }

    this.height = height || process.stdout.rows - 1;
    if(this.height < 2){
      this.height = 2;
    }
  }

}



module.exports = KaitenSushi;
