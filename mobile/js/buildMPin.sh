#! /bin/bash

JSLIB_DIR=$(pwd)/jslib

for i in $(cat deploy_deplist);
do
    cat "$JSLIB_DIR/$i"; 
    echo ";";
done

