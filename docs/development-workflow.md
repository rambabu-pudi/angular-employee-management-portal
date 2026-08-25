# Development Workflow

[← Shared Utilities](./shared-utilities.md) | [Back to Index](./README.md)

---

## Development Lifecycle

```mermaid
flowchart TD
    subgraph Setup["Project Setup"]
        CLONE[Clone repository] --> INSTALL[npm install]
    end

    subgraph Dev["Development Loop"]
        INSTALL --> SERVE[npm start<br/>ng serve :4200]
        SERVE --> CODE[Write code]
        CODE --> LINT[npm run lint<br/>oxlint]
        LINT --> FORMAT[npm run format<br/>prettier]
        FORMAT --> TEST[npm test<br/>vitest]
        TEST --> CODE
    end

    subgraph Build["Production Build"]
        TEST -->|Ready| BUILD[npm run build<br/>ng build]
        BUILD --> DIST[dist/ output]
    end

    subgraph Deploy["Containerized Deploy"]
        DIST --> DOCKER[docker build]
        DOCKER --> IMAGE[NGINX Alpine image]
        IMAGE --> RUN[docker run -p 80:80]
    end
```

---

## NPM Scripts

| Script | Command | Purpose | Link |
|--------|---------|---------|------|
| `start` | `ng serve` | Dev server with HMR at `:4200` | — |
| `build` | `ng build` | Production AOT build | [Docker Build](#docker-build) |
| `test` | `ng test --watch=false` | Single-run unit tests (Vitest) | [Testing](#testing) |
| `format` | `prettier --write "src/**/*.{ts,html,css,json}"` | Auto-format source | [Formatting](#formatting) |
| `format:check` | `prettier --check ...` | CI format verification | [CI Pipeline](#ci-pipeline) |
| `lint` | `oxlint` | Fast Rust-based linter | [Linting](#linting) |
| `lint:fix` | `oxlint --fix` | Auto-fix lint issues | — |

---

## <a id="testing"></a>Testing

```mermaid
flowchart LR
    subgraph TestRunner["Vitest"]
        SPEC1[employee.service.spec.ts]
        SPEC2[validators.spec.ts]
    end

    subgraph Coverage
        SVC[EmployeeService CRUD]
        VAL[corporateEmail validator]
    end

    SPEC1 --> SVC
    SPEC2 --> VAL
```

### Running Tests

```bash
npm test                    # Single run
npx vitest --watch          # Watch mode
npx vitest --coverage       # With coverage report
```

### Test Files

| Spec File | Tests | Source |
|-----------|-------|--------|
| `employee.service.spec.ts` | CRUD operations, signal state | [`src/app/core/employee.service.spec.ts`](../src/app/core/employee.service.spec.ts) |
| `validators.spec.ts` | corporateEmail validation | [`src/app/shared/validators.spec.ts`](../src/app/shared/validators.spec.ts) |

---

## <a id="linting"></a>Linting

Uses **oxlint** — a Rust-based linter that's orders of magnitude faster than ESLint.

```bash
npm run lint          # Check for issues
npm run lint:fix      # Auto-fix
```

Configuration: [`oxlint.json`](../oxlint.json)

---

## <a id="formatting"></a>Formatting

Uses **Prettier** for consistent code style:

```bash
npm run format        # Format all files
npm run format:check  # Check without modifying (CI)
```

Covers: `*.ts`, `*.html`, `*.css`, `*.json` in `src/`

---

## <a id="docker-build"></a>Docker Build

```mermaid
flowchart TD
    subgraph Stage1["Stage 1: Build"]
        BASE1[node:22-alpine]
        COPY_PKG[COPY package*.json]
        NPM_I[npm install]
        COPY_SRC[COPY source]
        BUILD[npm run build]
        DIST[dist/ artifacts]
    end

    subgraph Stage2["Stage 2: Serve"]
        BASE2[nginx:alpine]
        COPY_DIST[COPY dist → /usr/share/nginx/html]
        EXPOSE[EXPOSE 80]
    end

    Stage1 --> Stage2
```

### Build & Run

```bash
docker build -t emp-portal .
docker run -p 8080:80 emp-portal
# Access at http://localhost:8080
```

**Source:** [`Dockerfile`](../Dockerfile)

---

## <a id="ci-pipeline"></a>CI Pipeline (Recommended)

```mermaid
flowchart LR
    subgraph CI["CI Pipeline"]
        direction LR
        CHECKOUT[Checkout] --> DEPS[npm ci]
        DEPS --> LINT_STEP[npm run lint]
        LINT_STEP --> FMT[npm run format:check]
        FMT --> TEST_STEP[npm test]
        TEST_STEP --> BUILD_STEP[npm run build]
        BUILD_STEP --> DOCKER_STEP[docker build]
    end
```

| Step | Command | Fails if |
|------|---------|----------|
| Install | `npm ci` | Lock file mismatch |
| Lint | `npm run lint` | Any lint error |
| Format | `npm run format:check` | Unformatted files |
| Test | `npm test` | Test failures |
| Build | `npm run build` | Compilation errors |
| Docker | `docker build .` | Build failure |

---

## Mock Backend

A minimal Node.js HTTP server for development:

```bash
node mock-backend/server.js
# Listening at http://localhost:3000
```

### Endpoints

| Method | URL | Response |
|--------|-----|----------|
| `GET` | `/api/employees` | Employee array JSON |
| `OPTIONS` | `*` | CORS preflight (204) |
| Other | `*` | 404 |

**Source:** [`mock-backend/server.js`](../mock-backend/server.js)

---

## Tech Stack Summary

```mermaid
graph TD
    subgraph Runtime["Runtime"]
        NG22[Angular 22.1]
        TS6[TypeScript 6.0]
        RXJS[RxJS 7.8]
    end

    subgraph DevTools["Dev Tooling"]
        VITEST[Vitest 4.0]
        OX[oxlint 0.2]
        PRETTIER[Prettier 3.0]
    end

    subgraph Infra["Infrastructure"]
        NODE22[Node.js 22]
        NGINX_I[NGINX Alpine]
        DOCKER_I[Docker Multi-stage]
    end
```

| Category | Tool | Version |
|----------|------|---------|
| Framework | Angular | 22.1 |
| Language | TypeScript | 6.0 |
| Reactivity | RxJS | 7.8 |
| Test Runner | Vitest | 4.0 |
| Linter | oxlint | 0.2 |
| Formatter | Prettier | 3.0 |
| Container | Docker + NGINX | Alpine |

---

## File Watcher Flow (Development)

```mermaid
sequenceDiagram
    participant Dev as Developer
    participant FS as File System
    participant NG as ng serve
    participant Browser as Browser

    Dev->>FS: Save file
    FS->>NG: File change detected
    NG->>NG: Incremental rebuild
    NG->>Browser: HMR / Live reload
    Browser->>Browser: Update view
```

---

[← Shared Utilities](./shared-utilities.md) | [Back to Index](./README.md)
