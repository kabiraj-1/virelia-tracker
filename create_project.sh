#!/bin/bash

PROJECT_NAME="${1:-my-project}"

echo "Creating project: $PROJECT_NAME"

# Create main project directory
mkdir -p "$PROJECT_NAME"
cd "$PROJECT_NAME"

# Create directory structure
mkdir -p src/{components,utils,services,types}
mkdir -p tests/{unit,integration}
mkdir -p docs/{api,guides}
mkdir -p config/{development,production}
mkdir -p scripts/{deploy,setup}
mkdir -p public/{images,fonts,css,js}
mkdir -p data/{raw,processed}
mkdir -p logs
mkdir -p backups

# Create root level files
touch README.md
touch .gitignore
touch .env.example
touch package.json
touch dockerfile
touch docker-compose.yml
touch Makefile
touch requirements.txt

# Create source code files
touch src/main.py
touch src/__init__.py
touch src/components/__init__.py
touch src/utils/__init__.py
touch src/services/__init__.py
touch src/types/__init__.py

# Create configuration files
touch config/development/config.yaml
touch config/production/config.yaml
touch config/.env.development
touch config/.env.production

# Create test files
touch tests/__init__.py
touch tests/unit/test_basic.py
touch tests/integration/test_api.py

# Create documentation files
touch docs/api/endpoints.md
touch docs/guides/installation.md
touch docs/guides/deployment.md

# Create script files
touch scripts/deploy/production.sh
touch scripts/deploy/staging.sh
touch scripts/setup/init.sh
touch scripts/setup/dependencies.sh

# Create public assets
touch public/index.html
touch public/css/style.css
touch public/js/app.js
touch public/images/logo.png

# Create data directories with sample files
touch data/raw/sample.csv
touch data/processed/cleaned_data.csv

# Create additional common files
touch .dockerignore
touch .pre-commit-config.yaml
touch .eslintrc.js
touch .babelrc
touch webpack.config.js
touch jest.config.js
touch pytest.ini
touch setup.py
touch requirements-dev.txt

echo "Project structure created successfully!"
echo "Project location: $(pwd)"
