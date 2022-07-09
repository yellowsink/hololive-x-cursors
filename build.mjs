#!/usr/bin/env zx
import { argv, cd, fs } from "zx";
import "zx/globals";

const { readdir, emptyDir, writeFile, remove, move, readFile } = fs;

const setDir = argv._[1];
if (!setDir) {
  console.error("No path provided");
  process.exit(1);
}

cd(setDir);

const cursorSetData = JSON.parse(await readFile("cursor.json"));

const installPath = path.join(process.env.HOME, ".icons", cursorSetData.id);
const themeIndex = `[Icon Theme]
Name=${cursorSetData.friendlyInfo.Name}
Comment=${cursorSetData.friendlyInfo.Comment}
Inherits=${cursorSetData.friendlyInfo.Inherits}`;

// convert all gifs to pngs
await emptyDir("png");
for (const destName in cursorSetData.cursors) {
  const [srcName] = cursorSetData.cursors[destName];
  await $`ffmpeg -hide_banner -loglevel error -i gif/${srcName}.gif png/${destName}_%2d.png`;
}

// generate cursor cfgs
const pngList = await readdir("png");
for (const destName in cursorSetData.cursors) {
  const [, hotX, hotY] = cursorSetData.cursors[destName];
  const fileRegex = new RegExp(`${destName}_\\d\\d\\.png`);
  const matchedFiles = pngList.filter((f) => fileRegex.test(f));

  const cfg = matchedFiles
    .map(
      (f) =>
        `${cursorSetData.curSize} ${hotX} ${hotY} ${f} ${cursorSetData.animDelay}`
    )
    .join("\n");
  await writeFile(`png/${destName}.cursor`, cfg);
}

// generate cursors
await emptyDir("out/cursors");
await cd("png");
for (const destName in cursorSetData.cursors) {
  await $`xcursorgen ${destName}.cursor ../out/cursors/${destName}`;
}
await cd("..");

// generate actual theme
await writeFile("out/index.theme", themeIndex);

const install = await question(`Install theme to ~/.icons/${cursorSetData.id}? [y/N]`);
if (install === "y") {
  await remove(installPath);
  await move("out", installPath);
}
