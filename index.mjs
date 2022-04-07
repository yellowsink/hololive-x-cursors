#!/usr/bin/env zx
import { fs } from "zx";
import { cd } from "zx";
import "zx/globals";

const { readdir, emptyDir, writeFile, remove, move } = fs;

/*\
|*| data
|*| any commented lines here are where multiple cursors
|*| could work, and thats entirely personal preference.
\*/
const curSize = 32;
const animDelay = 100;
const cursors = {
  //left_ptr: ["kiara", 5, 5],
  left_ptr: ["kiara mouse", 0, 0],
  //left_ptr: ["kiara sword", 0, 0],
  size_fdiag: ["kiarabird", 15, 15],
  size_bdiag: ["kiarabird2", 15, 15],
  sb_v_double_arrow: ["kiarabird3", 15, 15],
  sb_h_double_arrow: ["kiarabird4", 15, 15],
  fleur: ["kiarabird5", 15, 15],
  hand2: ["kiara finger", 10, 3],
  //progress: ["kiara finger2", 10, 3],
  progress: ["kiara finger3", 10, 3],
  //progress: ["kiarasleep2", 0, 0],
  watch: ["kiarasleep", 16, 18],
  //watch: ["kiarasleep2", 0, 0],
  xterm: ["kiara text", 3, 8],
  "not-allowed": ["kiara x", 15, 24],
  "no-drop": ["kiara x", 15, 24],
};
// feel free to modify the Inherits line
const themeIndex = `[Icon Theme]
Name=Takanashi Kiara (art: @growowling)
Comment=A set of cursors for X featuring Takanashi Kiara
Inherits=breeze_cursors`;
const installPath = `${process.env.HOME}/.icons/takanashi-cursors`;

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
  const matchedFiles = pngList.filter((f) => f.startsWith(destName));

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