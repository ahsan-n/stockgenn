.PHONY: help install dev build test test-coverage test-e2e lint format docker-build docker-up docker-down clean crawler-install crawler-test crawler-discover crawler-crawl crawler-scrape crawler-analyze

# Default target
help:
	@echo "PSX Analytical Platform - Available Commands:"
	@echo ""
	@echo "Frontend:"
	@echo "  make install         - Install frontend dependencies"
	@echo "  make dev             - Start development server"
	@echo "  make build           - Build production bundle"
	@echo "  make test            - Run unit tests"
	@echo "  make test-coverage   - Run tests with coverage report"
	@echo "  make test-e2e        - Run E2E tests"
	@echo "  make lint            - Run ESLint"
	@echo "  make format          - Format code with Prettier"
	@echo ""
	@echo "Crawler:"
	@echo "  make crawler-install - Install crawler dependencies"
	@echo "  make crawler-test    - Test crawler functionality"
	@echo "  make crawler-discover- Discover API endpoints"
	@echo "  make crawler-crawl   - Crawl using API endpoints"
	@echo "  make crawler-scrape  - Scrape website data"
	@echo "  make crawler-analyze - Run full analysis"
	@echo ""
	@echo "Docker:"
	@echo "  make docker-build    - Build Docker images"
	@echo "  make docker-up       - Start Docker containers"
	@echo "  make docker-down     - Stop Docker containers"
	@echo "  make docker-logs     - Show Docker logs"
	@echo ""
	@echo "Utilities:"
	@echo "  make clean           - Clean build artifacts and dependencies"
	@echo ""

# Install dependencies
install:
	@echo "📦 Installing frontend dependencies..."
	cd frontend && npm install

# Development
dev:
	@echo "🚀 Starting development server..."
	cd frontend && npm run dev

# Build
build:
	@echo "🏗️  Building production bundle..."
	cd frontend && npm run build

# Testing
test:
	@echo "🧪 Running unit tests..."
	cd frontend && npm test

test-coverage:
	@echo "📊 Running tests with coverage..."
	cd frontend && npm run test:coverage

test-e2e:
	@echo "🎭 Running E2E tests..."
	cd frontend && npm run test:e2e

# Linting & Formatting
lint:
	@echo "🔍 Running ESLint..."
	cd frontend && npm run lint

format:
	@echo "✨ Formatting code..."
	cd frontend && npx prettier --write "src/**/*.{ts,tsx,js,jsx,json,css,md}"

# Docker commands
docker-build:
	@echo "🐳 Building Docker images..."
	docker-compose build

docker-up:
	@echo "🚀 Starting Docker containers..."
	docker-compose up -d
	@echo "✅ Containers started!"
	@echo "Frontend: http://localhost:3000"

docker-down:
	@echo "🛑 Stopping Docker containers..."
	docker-compose down

docker-logs:
	@echo "📋 Showing Docker logs..."
	docker-compose logs -f

# Crawler commands
crawler-install:
	@echo "🐍 Installing crawler dependencies..."
	cd backend/crawler && pip install -r requirements.txt
	@echo "🎭 Installing Playwright browsers..."
	playwright install chromium
	@echo "✅ Crawler dependencies installed!"

crawler-test:
	@echo "🧪 Testing crawler..."
	cd backend && python crawler/test_crawler.py

crawler-discover:
	@echo "🔍 Discovering API endpoints..."
	cd backend && python -m crawler.cli discover

crawler-crawl:
	@echo "📡 Crawling API endpoints..."
	cd backend && python -m crawler.cli crawl

crawler-scrape:
	@echo "🕷️  Scraping website..."
	cd backend && python -m crawler.cli scrape

crawler-analyze:
	@echo "🔬 Running full analysis..."
	cd backend && python -m crawler.cli analyze

# Clean
clean:
	@echo "🧹 Cleaning build artifacts..."
	rm -rf frontend/node_modules
	rm -rf frontend/.next
	rm -rf frontend/out
	rm -rf frontend/coverage
	rm -rf frontend/test-results
	rm -rf frontend/playwright-report
	rm -rf backend/crawler/data
	rm -rf backend/crawler/test_data
	rm -rf backend/crawler/logs
	rm -rf backend/crawler/__pycache__
	@echo "✅ Clean complete!"

# Quick start (install + dev)
start: install dev

# Production (build + docker)
production: build docker-build docker-up

