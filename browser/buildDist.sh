#! /bin/bash

OUT=$(pwd)/dist
OUT_FILE=$OUT/mpin.js

rm -rf $OUT
mkdir -p $OUT

mkdir -p $OUT/css
mkdir -p $OUT/images

cp css/main.css $OUT/css
cp -r images/* $OUT/images

cat js/underscore-min.js >> $OUT_FILE; echo ";" >> $OUT_FILE
cat js/mpin-all.js >> $OUT_FILE; echo ";" >> $OUT_FILE
cat js/mpin.js >> $OUT_FILE; echo ";" >> $OUT_FILE
cat js/templates.js >> $OUT_FILE; echo ";" >> $OUT_FILE


