#!/bin/bash

echo "=== PROJECT STRUCTURE ANALYSIS ==="
echo "Current directory: $(pwd)"
echo ""

# Check if it's a git repository
if [ -d ".git" ]; then
    echo "‚úÖ This is a Git repository"
    echo "Git branches:"
    git branch -a 2>/dev/null || echo "No branches info available"
else
    echo "‚ùå Not a Git repository"
fi
echo ""

# Show directory structure
echo "Ì≥Å DIRECTORY STRUCTURE:"
if command -v tree &> /dev/null; then
    tree -L 3 -I 'node_modules|__pycache__|.git' 2>/dev/null || tree -L 3
else
    echo "Installing tree command for better visualization..."
    # Uncomment based on your OS:
    # sudo apt-get install tree -y  # Ubuntu/Debian
    # brew install tree            # macOS
    # yum install tree -y          # CentOS/RHEL
    find . -type d -not -path '*/\.*' -not -path '*node_modules*' | sort | sed 's/[^/]*\//|   /g;s/| *\([^| ]\)/+--- \1/'
fi
echo ""

# Show file types and counts
echo "Ì≥ä FILE TYPE STATISTICS:"
echo "Python files: $(find . -name "*.py" -not -path '*/\.*' | wc -l)"
echo "JavaScript files: $(find . -name "*.js" -not -path '*/\.*' | wc -l)"
echo "HTML files: $(find . -name "*.html" -not -path '*/\.*' | wc -l)"
echo "CSS files: $(find . -name "*.css" -not -path '*/\.*' | wc -l)"
echo "Markdown files: $(find . -name "*.md" -not -path '*/\.*' | wc -l)"
echo "JSON files: $(find . -name "*.json" -not -path '*/\.*' | wc -l)"
echo "YAML files: $(find . -name "*.yaml" -not -path '*/\.*' | wc -l)"
echo ""

# Show important configuration files
echo "‚öôÔ∏è  CONFIGURATION FILES:"
important_files=("package.json" "requirements.txt" "docker-compose.yml" "Dockerfile" "Makefile" ".env" ".gitignore" "README.md")
for file in "${important_files[@]}"; do
    if [ -f "$file" ]; then
        echo "‚úÖ $file"
    else
        echo "‚ùå $file (missing)"
    fi
done
echo ""

# Show directory sizes
echo "Ì≤æ DIRECTORY SIZES:"
du -sh ./* 2>/dev/null | sort -hr

# Check for common project types
echo ""
echo "Ì¥ç PROJECT TYPE DETECTION:"
if [ -f "package.json" ]; then
    echo "Ì≥¶ Node.js project detected"
fi
if [ -f "requirements.txt" ] || [ -f "setup.py" ]; then
    echo "Ì∞ç Python project detected"
fi
if [ -f "go.mod" ]; then
    echo "Ì∞π Go project detected"
fi
if [ -f "Cargo.toml" ]; then
    echo "Ì∂Ä Rust project detected"
fi
if [ -f "composer.json" ]; then
    echo "Ì∞ò PHP project detected"
fi
if [ -f "pom.xml" ]; then
    echo "‚òï Java project detected"
fi
