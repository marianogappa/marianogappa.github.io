#!/bin/bash

set -e

if [ -z "$1" ]
  then
    echo "Please supply commit message"
    exit
fi

jekyll build
rm -rf marianogappa.github.io/*
cp -R _site/* marianogappa.github.io/
pushd . 1>/dev/null
cd marianogappa.github.io
git add -A
git commit -m "$1"
git push
popd 1>/dev/null
