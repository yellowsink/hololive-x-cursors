#!/bin/sh

for f in cursors/*; do
  echo n | ./build.mjs $f
done

rm -rf cursors/*/png