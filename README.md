# Hololive X Cursors

A set of cursors for X featuring Hololive characters.

## Sets

- Takanashi Kiara: [Drawn by @growowling](https://twitter.com/growowling/status/1510479966491725829),
  converted [with permission](https://twitter.com/growowling/status/1510743060346728451).

- Gawr Gura: [Drawn by @growowling](https://twitter.com/growowling/status/1545715261504122880),
  converted [with permission](https://twitter.com/growowling/status/1545883160042278912).

![Preview gif](https://raw.githubusercontent.com/yellowsink/takanashi-x-cursors/master/preview.gif)

## Usage
Ensure you have an installation of `node` (and `npm`), `ffmpeg` and `xcursorgen` available.

If you know which set you want, run `npm i` and then `./build.mjs <path>`
(for example, `./build.mjs cursors/takanashi`).

The script will prompt you to install the cursors once it is done.

If you want to build all sets without installing you can run `npm i` then `./build_all.sh`

## Using my script for other cursors
- Create a directory to contain your data
- Put a `gif` subdir in with cursors in gif format (dont argue about formats just do it)
- Create a `cursor.json` file with relevant data. The numbers are the "hot" pixel coord of the cursor.
- Run `./build.mjs <path>`
- Your built theme is in out/ - you will be prompted anyway