# Authentication Flow

[← Architecture](./architecture.md) | [Back to Index](./README.md) | [Component Workflow →](./component-workflow.md)

---

## Overview

The application uses a **signal-based authentication system** with `localStorage` persistence, HTTP interceptor for token injection, and functional route guards for access control.

---

## End-to-End Authentication Sequence

```mermaid
sequenceDiagram
    participant U as User
    participant LC as LoginComponent
    participant AS as AuthService
    participant LS as localStorage
    participant R as Router
    participant G as Guards
    participant INT as Interceptor
    participant API as Backend API

    U->>LC: Enter credentials
    LC->>AS: login(email, password)
    AS->>AS: Validate credentials
    alt Valid credentials
        AS->>LS: setItem('demo-user', JSON)
        AS->>AS: user.set(userObj)
        AS-->>LC: return true
        LC->>R: navigateByUrl('/dashboard')
        R->>G: canActivate?
        G->>AS: isLoggedIn()
        AS-->>G: true
        G-->>R: allow
        R-->>U: Show Dashboard
    else Invalid credentials
        AS-->>LC: return false
        LC-->>U: Show error message
    end

    Note over U, API: Subsequent API calls
    U->>INT: HTTP Request
    INT->>LS: getItem('demo-user')
    INT->>API: Request + Authorization: Bearer <token>
    API-->>U: Response
```

---

## Login Flow Detail

```mermaid
flowchart TD
    START([User visits /login]) --> FORM[Display login form]
    FORM --> INPUT[User enters email + password]
    INPUT --> CLICK[Click Login button]
    CLICK --> VALIDATE{Credentials match?}
    
    VALIDATE -->|admin@example.com / admin123| ADMIN[Role = ADMIN]
    VALIDATE -->|manager@example.com / manager123| MANAGER[Role = MANAGER]
    VALIDATE -->|No match| ERROR[Show 'Invalid credentials']
    ERROR --> FORM
    
    ADMIN --> PERSIST[Store user in localStorage]
    MANAGER --> PERSIST
    PERSIST --> SIGNAL[Update user signal]
    SIGNAL --> NAV[Navigate to /dashboard]
    NAV --> DONE([Dashboard renders])
```

---

## <a id="auth-service"></a>AuthService — State Machine

```mermaid
stateDiagram-v2
    [*] --> LoggedOut: App starts, no stored user
    [*] --> LoggedIn: App starts, stored user found

    LoggedOut --> LoggedIn: login() succeeds
    LoggedIn --> LoggedOut: logout()
    
    state LoggedIn {
        [*] --> ADMIN: role === 'ADMIN'
        [*] --> MANAGER: role === 'MANAGER'
    }
```

### API Surface

| Method | Signature | Description |
|--------|-----------|-------------|
| `user` | `Signal<User \| null>` | Reactive current user state |
| `isLoggedIn` | `Computed<boolean>` | Derived login status |
| `login` | `(email, password) → boolean` | Authenticate and persist |
| `logout` | `() → void` | Clear session |
| `hasRole` | `(role) → boolean` | Role check (ADMIN has all) |

**Source:** [`src/app/core/auth.service.ts`](../src/app/core/auth.service.ts)

---

## <a id="interceptor"></a>HTTP Interceptor

```mermaid
flowchart LR
    REQ[Outgoing HTTP Request] --> CHECK{Token in localStorage?}
    CHECK -->|Yes| CLONE[Clone request<br/>Add Authorization header]
    CHECK -->|No| PASS[Pass through unchanged]
    CLONE --> NEXT[next(clonedReq)]
    PASS --> NEXT2[next(originalReq)]
```

The interceptor reads the raw JSON from `localStorage` and encodes it as a Base64 Bearer token:

```
Authorization: Bearer <base64(user-json)>
```

**Source:** [`src/app/core/auth.interceptor.ts`](../src/app/core/auth.interceptor.ts)

---

## <a id="guards"></a>Route Guards

```mermaid
flowchart TD
    subgraph authGuard
        A1{isLoggedIn?} -->|Yes| A2[Allow access]
        A1 -->|No| A3[Redirect → /login]
    end

    subgraph adminGuard
        B1{hasRole 'ADMIN'?} -->|Yes| B2[Allow access]
        B1 -->|No| B3[Redirect → /dashboard]
    end
```

| Guard | Protects | Behavior |
|-------|----------|----------|
| `authGuard` | `/dashboard`, `/employees`, `/admin` | Redirects unauthenticated users to `/login` |
| `adminGuard` | `/admin` | Redirects non-admin users to `/dashboard` |

**Source:** [`src/app/core/guards.ts`](../src/app/core/guards.ts)

---

## <a id="login-component"></a>LoginComponent

| Property | Type | Purpose |
|----------|------|---------|
| `email` | `string` | Two-way bound input |
| `password` | `string` | Two-way bound input |
| `error` | `string` | Validation error display |

**Template features:**
- `FormsModule` with `[(ngModel)]` for simple form binding
- Conditional error display via `@if (error)`
- Calls `AuthService.login()` and navigates on success

**Source:** [`src/app/features/login.component.ts`](../src/app/features/login.component.ts)

---

## Session Lifecycle

```mermaid
flowchart TD
    BOOT([App Bootstrap]) --> READ[Read localStorage 'demo-user']
    READ --> FOUND{User found?}
    FOUND -->|Yes| HYDRATE[Hydrate user signal]
    FOUND -->|No| GUEST[user = null, isLoggedIn = false]
    
    HYDRATE --> ACTIVE[Active session]
    ACTIVE --> LOGOUT[User clicks Logout]
    LOGOUT --> CLEAR[Remove from localStorage]
    CLEAR --> RESET[user.set null]
    RESET --> GUEST
    
    GUEST --> LOGIN_PAGE[Redirect to /login via guard]
```

---

## Credential Reference (Demo)

| Email | Password | Role | Access |
|-------|----------|------|--------|
| `admin@example.com` | `admin123` | ADMIN | All routes |
| `manager@example.com` | `manager123` | MANAGER | Dashboard + Employees |

---

[← Architecture](./architecture.md) | [Back to Index](./README.md) | [Component Workflow →](./component-workflow.md)
