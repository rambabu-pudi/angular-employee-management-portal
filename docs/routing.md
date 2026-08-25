# Routing & Navigation

[← Service Layer](./service-layer.md) | [Back to Index](./README.md) | [Shared Utilities →](./shared-utilities.md)

---

## <a id="route-table"></a>Route Configuration

```mermaid
flowchart TD
    ROOT["/ (root)"] -->|redirectTo| DASH_R[/dashboard]
    WILDCARD["/** (wildcard)"] -->|redirectTo| DASH_R

    subgraph Routes["Defined Routes"]
        LOGIN_R["/login<br/>LoginComponent"]
        DASH_R["/dashboard<br/>DashboardComponent"]
        EMP_R["/employees<br/>EmployeesComponent"]
        ADMIN_R["/admin<br/>AdminComponent"]
    end

    subgraph Guards["Guard Protection"]
        AG{authGuard}
        ADG{adminGuard}
    end

    DASH_R -.->|protected by| AG
    EMP_R -.->|protected by| AG
    ADMIN_R -.->|protected by| AG
    ADMIN_R -.->|protected by| ADG
```

### Route Table

| Path | Component | Guards | Loading |
|------|-----------|--------|---------|
| `/login` | `LoginComponent` | None | Lazy |
| `/dashboard` | `DashboardComponent` | `authGuard` | Lazy |
| `/employees` | `EmployeesComponent` | `authGuard` | Lazy |
| `/admin` | `AdminComponent` | `authGuard`, `adminGuard` | Lazy |
| `/` | — | — | Redirect → `/dashboard` |
| `**` | — | — | Redirect → `/dashboard` |

**Source:** [`src/app/app.routes.ts`](../src/app/app.routes.ts)

---

## Lazy Loading Strategy

```mermaid
sequenceDiagram
    participant R as Router
    participant W as Webpack/esbuild
    participant C as Component

    R->>R: Match path '/employees'
    R->>W: Dynamic import('./features/employees.component')
    W-->>R: Module chunk loaded
    R->>C: Instantiate EmployeesComponent
    C-->>R: Rendered
```

All feature components use **dynamic `import()`** for code splitting:

```typescript
loadComponent: () => import('./features/login.component').then(m => m.LoginComponent)
```

This produces separate chunks per route, reducing the initial bundle size.

---

## <a id="guards"></a>Guard Execution Flow

```mermaid
flowchart TD
    NAV([User navigates to route]) --> MATCH[Router matches path]
    MATCH --> HAS_GUARDS{canActivate guards?}
    HAS_GUARDS -->|No| LOAD[Load component]
    HAS_GUARDS -->|Yes| EXEC_GUARDS[Execute guards in order]
    
    EXEC_GUARDS --> AUTH_CHECK{authGuard:<br/>isLoggedIn?}
    AUTH_CHECK -->|No| REDIR_LOGIN[UrlTree → /login]
    AUTH_CHECK -->|Yes| NEXT{More guards?}
    
    NEXT -->|No| LOAD
    NEXT -->|adminGuard| ADMIN_CHECK{hasRole ADMIN?}
    ADMIN_CHECK -->|Yes| LOAD
    ADMIN_CHECK -->|No| REDIR_DASH[UrlTree → /dashboard]
```

### Guard Composition

| Route | Guard Chain | Failure Redirect |
|-------|------------|------------------|
| `/dashboard` | `authGuard` | → `/login` |
| `/employees` | `authGuard` | → `/login` |
| `/admin` | `authGuard` → `adminGuard` | → `/login` or → `/dashboard` |

**Source:** [`src/app/core/guards.ts`](../src/app/core/guards.ts)

---

## Navigation UI

```mermaid
flowchart LR
    subgraph Header["App Header Navigation"]
        BRAND["Brand Link<br/>→ /dashboard"]
        
        subgraph AuthNav["Shown when logged in"]
            DASH_LINK["Dashboard<br/>routerLink=/dashboard"]
            EMP_LINK["Employees<br/>routerLink=/employees"]
            ADMIN_LINK["Admin<br/>routerLink=/admin<br/>(ADMIN only)"]
            LOGOUT_BTN["Logout Button"]
        end
    end
```

The navigation renders conditionally:
- **Not logged in:** Only brand link visible
- **Logged in (USER/MANAGER):** Dashboard + Employees links + Logout
- **Logged in (ADMIN):** All links + Logout

---

## Full Navigation State Diagram

```mermaid
stateDiagram-v2
    [*] --> Login: Not authenticated

    Login --> Dashboard: Successful login
    Dashboard --> Employees: Nav click
    Dashboard --> Admin: Nav click (ADMIN only)
    Employees --> Dashboard: Nav click
    Employees --> Admin: Nav click (ADMIN only)
    Admin --> Dashboard: Nav click
    Admin --> Employees: Nav click
    
    Dashboard --> Login: Logout
    Employees --> Login: Logout
    Admin --> Login: Logout

    state "Guard Redirects" as GR {
        [*] --> Login: authGuard fails
        [*] --> Dashboard: adminGuard fails
    }
```

---

## Route-to-Component Resolution

```mermaid
graph LR
    URL[URL Change] --> ROUTER[Angular Router]
    ROUTER --> MATCH[Match Route Config]
    MATCH --> GUARDS[Run canActivate guards]
    GUARDS -->|Pass| LAZY[Dynamic import chunk]
    LAZY --> INSTANCE[Create component instance]
    INSTANCE --> OUTLET["Render in <router-outlet>"]
    GUARDS -->|Fail| REDIRECT[Redirect UrlTree]
    REDIRECT --> ROUTER
```

---

[← Service Layer](./service-layer.md) | [Back to Index](./README.md) | [Shared Utilities →](./shared-utilities.md)
