#! /bin/bash

OUT=$(pwd)/dist
OUT_FILE=$OUT/mpin.js
JSLIB_DIR=$(pwd)/js/jslib

rm -rf $OUT
mkdir -p $OUT

mkdir -p $OUT/css
mkdir -p $OUT/images

cp css/main.css $OUT/css
cp -r images/* $OUT/images

cat js/underscore-min.js >> $OUT_FILE; echo ";" >> $OUT_FILE


for i in $(cat deploy_deplist);
do
    cat "$JSLIB_DIR/$i" >> $OUT_FILE; echo ";" >> $OUT_FILE;
done

if [ "x$1" == 'x' ]; then
	sed 's#%URL_BASE%#/public/mpin#' js/mpin.js  >> $OUT_FILE;
else
	sed "s#%URL_BASE%#$1#" js/mpin.js  >> $OUT_FILE;
fi

# cat js/mpin.js >> $OUT_FILE; echo ";" >> $OUT_FILE
cat js/templates.js >> $OUT_FILE; echo ";" >> $OUT_FILE


