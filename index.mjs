#!/usr/bin/env zx
import "zx/globals";

const { readdir, emptyDir, writeFile } = fs;

/*\
|*| data
|*| any commented lines here are where multiple cursors
|*| could work, and thats entirely personal preference.
\*/
const curSize = 32;
const animDelay = 100;
const cursors = {
  //default: ["kiara", 5, 5],
  default: ["kiara mouse", 0, 0],
  //default: ["kiara sword", 0, 0],
  size_fdiag: ["kiarabird", 15, 15],
  size_bdiag: ["kiarabird2", 15, 15],
  size_ver: ["kiarabird3", 15, 15],
  size_hor: ["kiarabird4", 15, 15],
  fleur: ["kiarabird5", 15, 15],
  pointer: ["kiara finger", 10, 3],
  //progress: ["kiara finger2", 10, 3],
  progress: ["kiara finger3", 10, 3],
  //progress: ["kiarasleep2", 0, 0],
  wait: ["kiarasleep", 16, 18],
  //wait: ["kiarasleep2", 0, 0],
  text: ["kiara text", 3, 8],
  xterm: ["kiara text", 3, 8],
  "not-allowed": ["kiara x", 15, 24],
  "no-drop": ["kiara x", 15, 24],
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
  const matchedFiles = pngList.filter((f) => f.startsWith(destName));

  const cfg = matchedFiles.map(f => `${curSize} ${hotX} ${hotY} ${f} ${animDelay}`).join("\n");
  await writeFile(`png/${destName}.cursor`, cfg)
}

// generate cursors
await emptyDir("out");
await cd("png");
for (const destName in cursors) {
  await $`xcursorgen ${destName}.cursor ../out/${destName}`;
}