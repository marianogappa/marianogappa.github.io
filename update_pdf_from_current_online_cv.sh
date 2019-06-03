#!/bin/bash
chrome="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"

"$chrome" --headless --disable-gpu --print-to-pdf http://marianogappa.github.io/cv/ --crash-dumps-dir=/tmp
mv output.pdf cv/cv.pdf
