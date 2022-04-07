#!/usr/bin/env zx
import { fs } from "zx";
import { cd } from "zx";
import "zx/globals";

const { readdir, emptyDir, writeFile, remove, move } = fs;

// data
const curSize = 32;
const animDelay = 100;
const installPath = `${process.env.HOME}/.icons/takanashi-cursors`;
// feel free to modify the Inherits line
const themeIndex = `[Icon Theme]
Name=Takanashi Kiara (art: @growowling)
Comment=A set of cursors for X featuring Takanashi Kiara
Inherits=breeze_cursors`;

/*
  any commented lines here are where multiple cursors
  could work, and thats entirely personal preference.
*/
const cursors = {
  default: ["kiara mouse", 0, 0],
  arrow: ["kiara mouse", 0, 0],
  left_ptr: ["kiara mouse", 0, 0],
  // ["kiara sword", 0, 0]

  cross: ["kiara", 5, 5],
  crosshair: ["kiara", 5, 5],

  left_ptr_help: ["kiaraquestion", 0, 0],
  whats_this: ["kiaraquestion", 0, 0],
  question_arrow: ["kiaraquestion", 0, 0],
  help: ["kiaraquestion", 0, 0],

  "nw-resize": ["kiarabird", 15, 15],
  "nwse-resize": ["kiarabird", 15, 15],
  "se-resize": ["kiarabird", 15, 15],
  size_fdiag: ["kiarabird", 15, 15],

  "ne-resize": ["kiarabird", 15, 15],
  "nesw-resize": ["kiarabird", 15, 15],
  "sw-resize": ["kiarabird", 15, 15],
  size_bdiag: ["kiarabird2", 15, 15],

  "n-resize": ["kiarabird3", 15, 15],
  "s-resize": ["kiarabird3", 15, 15],
  "ns-resize": ["kiarabird3", 15, 15],
  size_ver: ["kiarabird3", 15, 15],
  sb_v_double_arrow: ["kiarabird3", 15, 15],

  "e-resize": ["kiarabird3", 15, 15],
  "w-resize": ["kiarabird3", 15, 15],
  "ew-resize": ["kiarabird3", 15, 15],
  size_hor: ["kiarabird3", 15, 15],
  sb_h_double_arrow: ["kiarabird4", 15, 15],

  fleur: ["kiarabird5", 15, 15],
  size_all: ["kiarabird5", 15, 15],
  grabbing: ["kiarabird5", 15, 15],
  move: ["kiarabird5", 15, 15],
  "dnd-move": ["kiarabird5", 15, 15],
  "dnd-none": ["kiarabird5", 15, 15],
  closedhand: ["kiarabird5", 15, 15],
  openhand: ["kiarabird5", 15, 15],
  grab: ["kiarabird5", 15, 15],

  pointer: ["kiara finger", 10, 3],
  pointing_hand: ["kiara finger", 10, 3],
  hand1: ["kiara finger", 10, 3],
  hand2: ["kiara finger", 10, 3],
  // ["kiara finger2", 10, 3],

  progress: ["kiara finger3", 10, 3],
  // ["kiarasleep2", 0, 0],

  wait: ["kiarasleep", 16, 18],
  watch: ["kiarasleep", 16, 18],
  // ["kiarasleep2", 0, 0],

  xterm: ["kiara text", 3, 8],
  text: ["kiara text", 3, 8],
  ibeam: ["kiara text", 3, 8],

  "not-allowed": ["kiara x", 15, 24],
  "no-drop": ["kiara x", 15, 24],
  circle: ["kiara x", 15, 24],
  crossed_circle: ["kiara x", 15, 24],
  forbidden: ["kiara x", 15, 24],
};

// convert all gifs to pngs
await emptyDir("png");
for (const destName in cursors) {
  const [srcName] = cursors[destName];
  await $`ffmpeg -i gif/${srcName}.gif png/${destName}_%2d.png`;
}

// generate cursor cfgs
const pngList = await readdir("png");
for (const destName in cursors) {
  const [, hotX, hotY] = cursors[destName];
  const fileRegex = new RegExp(`${destName}_\\d\\d\\.png`);
  const matchedFiles = pngList.filter((f) => fileRegex.test(f));

  const cfg = matchedFiles
    .map((f) => `${curSize} ${hotX} ${hotY} ${f} ${animDelay}`)
    .join("\n");
  await writeFile(`png/${destName}.cursor`, cfg);
}

// generate cursors
await emptyDir("out/cursors");
await cd("png");
for (const destName in cursors) {
  await $`xcursorgen ${destName}.cursor ../out/cursors/${destName}`;
}
await cd("..");

// generate actual theme
await writeFile("out/index.theme", themeIndex);

const install = await question("Install theme to ~/.icons? [y/N]");
if (install === "y") {
  await remove(installPath);
  await move("out", installPath);
}
