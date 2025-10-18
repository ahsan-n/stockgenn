# PSX Analytical Platform - Frontend

Modern, investor-presentation-ready frontend for Pakistan Stock Exchange analytics.

## 🚀 Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 3
- **Charts**: Recharts, Nivo (Sunburst), Tremor
- **UI Components**: Radix UI primitives
- **State Management**: Zustand
- **Data Fetching**: TanStack Query
- **Testing**: Jest, React Testing Library, Playwright
- **Animations**: Framer Motion

## 📁 Project Structure

```
frontend/
├── src/
│   ├── app/              # Next.js app router pages
│   ├── components/       # React components
│   ├── lib/              # Utility functions
│   ├── types/            # TypeScript types
│   ├── hooks/            # Custom React hooks
│   ├── store/            # Zustand stores
│   └── data/             # Mock data & generators
├── e2e/                  # Playwright E2E tests
├── public/               # Static assets
└── __tests__/            # Unit tests
```

## 🛠️ Development

### Prerequisites

- Node.js 20+
- npm or yarn

### Installation

```bash
npm install
```

### Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
npm run build
npm start
```

## 🧪 Testing

### Unit Tests

```bash
# Run tests
npm test

# Watch mode
npm run test:watch

# Coverage report
npm run test:coverage
```

### E2E Tests

```bash
# Run E2E tests
npm run test:e2e

# Run with UI
npm run test:e2e:ui
```

## 🐳 Docker

### Build Image

```bash
docker build -t psx-frontend .
```

### Run Container

```bash
docker run -p 3000:3000 psx-frontend
```

## 📊 Features

### Current

- ✅ Next.js 15 with App Router
- ✅ TypeScript configuration
- ✅ Tailwind CSS with custom theme
- ✅ Mock data for cement sector (3 companies)
- ✅ Testing infrastructure (Jest + Playwright)
- ✅ Docker support
- ✅ Type-safe utilities

### Upcoming

- 🚧 Index Overview with interactive charts
- 🚧 Sunburst sector visualization
- 🚧 Advanced companies data grid
- 🚧 Dark mode support
- 🚧 Responsive design
- 🚧 Real-time data updates

## 🎨 Design System

### Colors

- **Primary**: Blue (#3B82F6)
- **Success**: Green (#10B981)
- **Danger**: Red (#EF4444)
- **Muted**: Gray shades

### Typography

- **Font**: Inter (Google Fonts)
- **Numbers**: Tabular figures for alignment

## 📝 Code Quality

- ESLint for linting
- Prettier for formatting
- TypeScript strict mode
- 100% test coverage requirement

## 🔒 Security

- Non-root Docker user (UID 1001)
- No hardcoded secrets
- Environment variables for configuration
- Input validation

## 📚 Documentation

See [RESEARCH.md](../docs/RESEARCH.md) for design decisions and architecture.

## 🤝 Contributing

1. Check GitHub Issues for tasks
2. Create feature branch
3. Write tests first (TDD)
4. Implement feature
5. Ensure 100% coverage
6. Submit PR

## 📄 License

[To be determined]

