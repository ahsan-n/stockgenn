# PSX Analytical Platform

A comprehensive analytical platform for Pakistan Stock Exchange (PSX) with focus on sector analysis and company financial statements.

## 🎯 Project Scope

- **Complete Frontend Implementation** ✅
- **Data Crawler for PSX** ✅
- **Cement Sector Analysis** (In Progress)
- **Company Financial Statements** (Planned)
- **Real-time Data Integration** (Planned)

## 📋 Development Rules

See [AGENTS.md](./AGENTS.md) for complete development guidelines including:
- GitHub Issues as source of truth
- 100% test coverage requirement
- E2E testing mandate
- OpenAPI compliance
- Security and quality standards

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 15 with React 19
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Charts**: Recharts, Nivo, Tremor
- **Testing**: Jest, React Testing Library, Playwright

### Backend
- **Crawler**: Python with asyncio
- **Web Scraping**: Playwright
- **Data Processing**: Pandas, Pydantic
- **API**: FastAPI (Planned)
- **Database**: PostgreSQL + TimescaleDB (Planned)

### Infrastructure
- **Containerization**: Docker, Docker Compose
- **Build Tool**: Make
- **API Spec**: OpenAPI 3.0+

## 🚀 Getting Started

### Quick Start

```bash
# Install frontend dependencies
make install

# Start development server
make dev

# Build for production
make build
```

### Docker Deployment

```bash
# Build and start all services
make docker-build
make docker-up

# View logs
make docker-logs

# Stop services
make docker-down
```

### Testing

```bash
# Run unit tests
make test

# Run tests with coverage
make test-coverage

# Run E2E tests
make test-e2e
```

### Code Quality

```bash
# Lint code
make lint

# Format code
make format
```

### Data Crawler

```bash
# Install crawler dependencies
make crawler-install

# Test crawler functionality
make crawler-test

# Discover API endpoints
make crawler-discover

# Crawl using APIs
make crawler-crawl

# Scrape website data
make crawler-scrape

# Run full analysis
make crawler-analyze
```

## 📁 Project Structure

```
stockgenn/
├── frontend/                    # Next.js frontend application
│   ├── src/
│   │   ├── app/                # Next.js app directory
│   │   ├── components/         # React components
│   │   ├── lib/                # Utility functions
│   │   ├── types/              # TypeScript types
│   │   └── data/               # Mock data
│   ├── e2e/                    # E2E tests (Playwright)
│   ├── public/                 # Static assets
│   └── Dockerfile              # Frontend container
├── backend/
│   └── crawler/                # PSX data crawler
│       ├── psx_crawler.py      # API-based crawler
│       ├── psx_scraper.py      # Web scraper (Playwright)
│       ├── models.py           # Data models
│       ├── config.py           # Configuration
│       ├── cli.py              # Command-line interface
│       └── README.md           # Crawler documentation
├── docs/                       # Documentation
│   ├── PSX_API_ANALYSIS.md     # API analysis
│   ├── DATA_PERSISTENCE_STRATEGY.md  # Database strategy
│   ├── IMPLEMENTATION_SUMMARY.md     # Frontend summary
│   └── TESTING_SUMMARY.md      # Test coverage report
├── .cursor/                    # Cursor AI rules
├── docker-compose.yml          # Multi-service orchestration
├── Makefile                    # Development commands
├── AGENTS.md                   # Development guidelines
└── README.md                   # This file
```

## 🧪 Testing

This project maintains 100% test coverage. All features must include:
- Unit tests
- Integration tests
- E2E tests (for user flows)

## 📝 Contributing

1. Check GitHub Issues for current tasks
2. Create a branch for your work
3. Write tests first (TDD approach)
4. Implement feature
5. Ensure all tests pass
6. Update documentation
7. Submit PR with issue reference

## 📄 License

[To be determined]

## 📚 Documentation

- **[Development Rules](./AGENTS.md)** - Complete development guidelines
- **[PSX API Analysis](./docs/PSX_API_ANALYSIS.md)** - API endpoints and data structures
- **[Data Persistence Strategy](./docs/DATA_PERSISTENCE_STRATEGY.md)** - Database design and strategy
- **[Crawler README](./backend/crawler/README.md)** - Crawler usage and configuration
- **[Implementation Summary](./docs/IMPLEMENTATION_SUMMARY.md)** - Frontend implementation details
- **[Testing Summary](./docs/TESTING_SUMMARY.md)** - Test coverage report

## 🔗 Links

- [Pakistan Stock Exchange](https://dps.psx.com.pk/)
- [GitHub Issues](#) - To be added
- [API Documentation](#) - To be added

## ⚠️ Legal Notice

This project uses data from Pakistan Stock Exchange (PSX). Please note:

> "Any dissemination, transmission, sale, and commercial use of Market Data feed... without acquiring respective rights/license from the PSX is strictly prohibited."

For official data access, contact: marketdatarequest@psx.com.pk

This project is for educational and personal use only. For commercial use, please obtain proper licensing from PSX.

