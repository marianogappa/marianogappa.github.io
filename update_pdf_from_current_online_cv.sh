#!/bin/bash
chrome="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"

"$chrome" --headless --disable-gpu --print-to-pdf http://marianogappa.github.io/cv/
mv output.pdf cv/cv.pdf
