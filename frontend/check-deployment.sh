#!/bin/bash

echo "í´ Deployment Diagnostic Check"
echo "=============================="

# Check if dist folder exists
if [ ! -d "dist" ]; then
    echo "âŒ dist/ folder missing - build failed"
    exit 1
fi

echo "âœ… dist/ folder exists"

# Check key files
if [ ! -f "dist/index.html" ]; then
    echo "âŒ index.html missing in dist/"
else
    echo "âœ… index.html exists"
fi

# Check if assets folder exists
if [ ! -d "dist/assets" ]; then
    echo "âŒ assets/ folder missing"
else
    echo "âœ… assets/ folder exists"
    echo "   Files in assets:"
    ls -la dist/assets/ | head -10
fi

# Check if main JS file is referenced
if grep -q "src=.*main.*js" dist/index.html; then
    echo "âœ… Main JS file referenced in HTML"
else
    echo "âŒ No main JS file found in HTML"
fi

# Check file sizes
echo ""
echo "í³Š File Sizes:"
ls -lh dist/index.html
if [ -d "dist/assets" ]; then
    ls -lh dist/assets/*.js | head -5
fi

echo ""
echo "í¾¯ Diagnostic complete"
