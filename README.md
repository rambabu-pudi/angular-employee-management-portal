# Angular Enterprise Sample

Complete Angular 22.1 enterprise-style sample demonstrating standalone components, Signals, RxJS-ready services, routing, guards, HTTP interceptor, CRUD, reactive forms, validation, reusable directives/pipes, role-based access, tests, Docker and a mock backend.

## Run
Prerequisite: Node.js compatible with Angular 22.

```bash
npm install
npm start
```

Open http://localhost:4200

## Demo users
- admin@example.com / admin123
- manager@example.com / manager123

## Commands
```bash
npm start
npm test
npm run build
```

## Structure
- `src/app/core` - authentication, guards, interceptor, services
- `src/app/shared` - validators, directives, pipes
- `src/app/features` - login, dashboard, employees, admin
- `mock-backend` - dependency-free REST API skeleton
- `tests` - reserved for additional integration/E2E tests

The app uses localStorage-backed mock data so it runs without an external backend.
