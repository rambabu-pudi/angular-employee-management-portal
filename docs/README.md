# Angular Employee Management Portal — Documentation

> Complete project workflow documentation with architecture diagrams and deep-level linking.

---

## Table of Contents

| # | Document | Description |
|---|----------|-------------|
| 1 | [Architecture Overview](./architecture.md) | High-level system architecture, module layout, and dependency graph |
| 2 | [Authentication Flow](./authentication-flow.md) | Login, guards, interceptor, and session lifecycle |
| 3 | [Component Workflow](./component-workflow.md) | Feature components, data flow, and UI interactions |
| 4 | [Service Layer & State](./service-layer.md) | Services, signals-based state management, and data persistence |
| 5 | [Routing & Navigation](./routing.md) | Route configuration, lazy loading, and guard protection |
| 6 | [Shared Utilities](./shared-utilities.md) | Pipes, directives, and validators |
| 7 | [Development Workflow](./development-workflow.md) | Scripts, tooling, Docker build, and CI practices |

---

## Quick Start

```bash
npm install
npm start          # Dev server at http://localhost:4200
npm test           # Run unit tests
npm run lint       # Lint with oxlint
npm run format     # Format with prettier
```

## Project Structure

```
src/
├── main.ts                         → Bootstrap & provider registration
├── app/
│   ├── app.component.ts            → Root shell with nav & router-outlet
│   ├── app.routes.ts               → Route definitions with lazy loading
│   ├── models.ts                   → Shared interfaces (Employee, User)
│   ├── core/                       → Singleton services & infrastructure
│   │   ├── auth.service.ts         → Authentication state (signals)
│   │   ├── auth.interceptor.ts     → HTTP interceptor for Bearer token
│   │   ├── employee.service.ts     → Employee CRUD & state
│   │   └── guards.ts              → authGuard + adminGuard
│   ├── features/                   → Lazy-loaded page components
│   │   ├── login.component.ts
│   │   ├── dashboard.component.ts
│   │   ├── employees.component.ts
│   │   └── admin.component.ts
│   └── shared/                     → Reusable pipes, directives, validators
│       ├── currency-inr.pipe.ts
│       ├── highlight.directive.ts
│       └── validators.ts
mock-backend/
└── server.js                       → Minimal Node HTTP mock API
```

---

## Diagram Legend

All diagrams use [Mermaid](https://mermaid.js.org/) syntax and render natively on GitHub / VS Code.

| Shape | Meaning |
|-------|---------|
| `[Box]` | Component / Module |
| `([Rounded])` | Service / Injectable |
| `{Diamond}` | Decision / Guard |
| `[(DB)]` | Storage (localStorage) |

---

*Navigate to individual docs above for deep-dive diagrams and flow details.*
