# PSX Analytical Platform

A comprehensive analytical platform for Pakistan Stock Exchange (PSX) with focus on sector analysis and company financial statements.

## 🎯 Project Scope

- **Complete Frontend Implementation**
- **Cement Sector Analysis**
- **Company Financial Statements**

## 📋 Development Rules

See [AGENTS.md](./AGENTS.md) for complete development guidelines including:
- GitHub Issues as source of truth
- 100% test coverage requirement
- E2E testing mandate
- OpenAPI compliance
- Security and quality standards

## 🛠️ Tech Stack

- **Frontend**: React/Next.js
- **Language**: TypeScript
- **Testing**: Jest, React Testing Library, Playwright/Cypress
- **API**: OpenAPI 3.0+ compliant

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

## 📁 Project Structure

```
stockgenn/
├── frontend/          # Next.js frontend application
│   ├── src/          # Source code
│   ├── e2e/          # E2E tests
│   ├── public/       # Static assets
│   └── Dockerfile    # Frontend container
├── backend/           # Backend API (future)
├── infrastructure/    # IaC configs (future)
├── docs/             # Documentation
│   └── RESEARCH.md   # Design research
├── .cursor/          # Cursor AI rules
├── docker-compose.yml # Multi-service orchestration
├── Makefile          # Development commands
├── AGENTS.md         # Development guidelines
└── README.md         # This file
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

## 🔗 Links

- [Development Rules](./AGENTS.md)
- [GitHub Issues](#) - To be added
- [API Documentation](#) - To be added

