# MAS.Payments Client

Frontend application for [MAS.Payments](https://github.com/bodynar/mas.payments) — a personal finance tracking system for payments and measurements.

## Tech Stack

- **React 18** with TypeScript
- **Redux** (via Redux Toolkit) for state management
- **React Router 6** for routing
- **Vite** for build tooling
- **Bulma** CSS framework
- **ApexCharts** for statistics visualization
- **SCSS** for custom styles

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

The dev server starts with API proxy to the backend. Configure the API target in `vite.config.ts`.

### Build

```bash
npm run build
```

### Preview production build

```bash
npm run preview
```

## Project Structure

```
src/
├── components/      # Shared reusable components
├── core/            # API layer and data transformations
├── models/          # TypeScript interfaces and types
├── modules/         # Feature modules (route-based)
│   ├── app/         # Root app shell, navbar, notifications
│   ├── measurements/# Measurement records CRUD
│   ├── modalBox/    # Global modal dialog
│   ├── payments/    # Payment records CRUD
│   ├── stats/       # Statistics charts
│   └── user/        # User settings and info
├── redux/           # Redux store, slices, thunks
└── shared/          # Hooks, utilities, constants, styles
```

## Architecture

- **Feature modules** (`modules/`) are route-based, each with its own components and container
- **Core layer** (`core/`) handles all API communication and data mapping
- **Models** (`models/`) define domain types and API DTOs separately
- **Redux** (`redux/`) is organized by feature slice with action creators and thunks
- Custom **ESLint rules** (`eslint-rules/`) enforce project conventions
