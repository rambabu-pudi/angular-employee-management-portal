# Architecture Overview

[← Back to Index](./README.md) | [Authentication Flow →](./authentication-flow.md)

---

## High-Level System Architecture

```mermaid
graph TB
    subgraph Browser["Browser Runtime"]
        UI[Angular SPA<br/>Standalone Components]
        LS[(localStorage)]
    end

    subgraph DevServer["Dev Server"]
        NG[ng serve<br/>:4200]
    end

    subgraph MockAPI["Mock Backend"]
        API[Node HTTP Server<br/>:3000]
    end

    subgraph Production["Production"]
        NGINX[NGINX Alpine<br/>:80]
    end

    UI -->|Reads/Writes| LS
    UI -->|HTTP + Bearer| API
    NG -->|Serves| UI
    NGINX -->|Serves static| UI
```

---

## Module Dependency Graph

```mermaid
graph LR
    subgraph Entry["Entry Point"]
        MAIN[main.ts]
    end

    subgraph Root["Root Module"]
        APP[AppComponent]
        ROUTES[app.routes.ts]
    end

    subgraph Core["Core Layer"]
        AUTH_SVC([AuthService])
        EMP_SVC([EmployeeService])
        INTERCEPTOR([authInterceptor])
        GUARDS{Guards}
    end

    subgraph Features["Feature Components"]
        LOGIN[LoginComponent]
        DASH[DashboardComponent]
        EMPS[EmployeesComponent]
        ADMIN[AdminComponent]
    end

    subgraph Shared["Shared Utilities"]
        INR_PIPE[InrPipe]
        HIGHLIGHT[HighlightDirective]
        VALIDATORS[corporateEmail]
    end

    MAIN --> APP
    MAIN --> ROUTES
    MAIN --> INTERCEPTOR
    APP --> AUTH_SVC
    ROUTES --> GUARDS
    ROUTES --> LOGIN
    ROUTES --> DASH
    ROUTES --> EMPS
    ROUTES --> ADMIN
    GUARDS --> AUTH_SVC
    LOGIN --> AUTH_SVC
    DASH --> EMP_SVC
    DASH --> INR_PIPE
    EMPS --> EMP_SVC
    EMPS --> INR_PIPE
    EMPS --> HIGHLIGHT
    EMPS --> VALIDATORS
    ADMIN --> AUTH_SVC
```

---

## Layered Architecture

```mermaid
graph TD
    subgraph Presentation["Presentation Layer"]
        direction LR
        L[Login] 
        D[Dashboard]
        E[Employees]
        A[Admin]
    end

    subgraph SharedLayer["Shared Layer"]
        direction LR
        P[Pipes]
        Dir[Directives]
        V[Validators]
    end

    subgraph ServiceLayer["Service / State Layer"]
        direction LR
        AS([AuthService<br/>signal-based])
        ES([EmployeeService<br/>signal-based])
    end

    subgraph Infrastructure["Infrastructure Layer"]
        direction LR
        INT([HTTP Interceptor])
        G{Route Guards}
        R[Router Config]
    end

    subgraph Persistence["Persistence"]
        LS[(localStorage)]
    end

    Presentation --> SharedLayer
    Presentation --> ServiceLayer
    ServiceLayer --> Persistence
    Infrastructure --> ServiceLayer
    Presentation -.->|protected by| Infrastructure
```

---

## Key Architectural Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Component model | Standalone components | Tree-shakeable, no NgModule boilerplate |
| State management | Angular Signals | Fine-grained reactivity, no external library |
| Lazy loading | Dynamic `import()` in routes | Smaller initial bundle |
| Persistence | `localStorage` | Zero-backend demo; swap with HTTP trivially |
| Auth transport | HTTP Interceptor + Bearer | Centralized token injection |
| Forms | Reactive Forms | Type-safe, testable |
| Styling | Plain CSS | Minimal; no framework overhead |
| Testing | Vitest | Fast, ESM-native test runner |
| Linting | oxlint | Rust-based, extremely fast |

---

## File Responsibility Map

| File | Layer | Responsibility | Links |
|------|-------|---------------|-------|
| `main.ts` | Entry | Bootstrap, register providers | [Service Layer](./service-layer.md#bootstrap) |
| `app.component.ts` | Presentation | Shell layout, nav | [Component Workflow](./component-workflow.md#app-shell) |
| `app.routes.ts` | Infrastructure | Route config | [Routing](./routing.md#route-table) |
| `models.ts` | Domain | TypeScript interfaces | [Service Layer](./service-layer.md#models) |
| `auth.service.ts` | Core | Auth state | [Authentication Flow](./authentication-flow.md#auth-service) |
| `employee.service.ts` | Core | Employee CRUD | [Service Layer](./service-layer.md#employee-service) |
| `auth.interceptor.ts` | Infrastructure | Token injection | [Authentication Flow](./authentication-flow.md#interceptor) |
| `guards.ts` | Infrastructure | Route protection | [Routing](./routing.md#guards) |
| `login.component.ts` | Feature | Login UI | [Authentication Flow](./authentication-flow.md#login-component) |
| `dashboard.component.ts` | Feature | Stats overview | [Component Workflow](./component-workflow.md#dashboard) |
| `employees.component.ts` | Feature | CRUD table + form | [Component Workflow](./component-workflow.md#employees) |
| `admin.component.ts` | Feature | Admin panel | [Component Workflow](./component-workflow.md#admin) |
| `currency-inr.pipe.ts` | Shared | INR formatting | [Shared Utilities](./shared-utilities.md#inr-pipe) |
| `highlight.directive.ts` | Shared | Row hover effect | [Shared Utilities](./shared-utilities.md#highlight-directive) |
| `validators.ts` | Shared | Custom form validators | [Shared Utilities](./shared-utilities.md#validators) |

---

[← Back to Index](./README.md) | [Authentication Flow →](./authentication-flow.md)
