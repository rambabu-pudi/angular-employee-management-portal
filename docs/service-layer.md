# Service Layer & State Management

[← Component Workflow](./component-workflow.md) | [Back to Index](./README.md) | [Routing →](./routing.md)

---

## <a id="bootstrap"></a>Bootstrap & Provider Registration

```mermaid
flowchart TD
    MAIN[main.ts] --> BOOTSTRAP[bootstrapApplication]
    BOOTSTRAP --> APP[AppComponent]
    BOOTSTRAP --> PROVIDERS[Providers]
    
    PROVIDERS --> ROUTER[provideRouter<br/>routes]
    PROVIDERS --> HTTP[provideHttpClient<br/>withInterceptors]
    HTTP --> INT([authInterceptor])
```

Providers registered at bootstrap are application-wide singletons.

**Source:** [`src/main.ts`](../src/main.ts)

---

## <a id="models"></a>Domain Models

```mermaid
classDiagram
    class Employee {
        +number id
        +string name
        +string email
        +string department
        +string role
        +number salary
        +boolean active
        +string joinedOn
    }

    class User {
        +string email
        +Role role
    }

    class Role {
        <<enumeration>>
        ADMIN
        MANAGER
        USER
    }

    User --> Role : has
```

**Source:** [`src/app/models.ts`](../src/app/models.ts)

---

## <a id="employee-service"></a>EmployeeService — CRUD State Manager

### State Flow

```mermaid
flowchart TD
    subgraph Initialization
        BOOT([Service created]) --> LOAD[load from localStorage]
        LOAD --> FOUND{Data exists?}
        FOUND -->|Yes| PARSE[Parse JSON → Employee array]
        FOUND -->|No| SEED[Use hardcoded seed data]
        PARSE --> STATE
        SEED --> STATE
    end

    subgraph State["Signal State"]
        STATE([state: WritableSignal&lt;Employee[]&gt;])
        EMPLOYEES[employees: Computed&lt;Employee[]&gt;]
        STATE --> EMPLOYEES
    end

    subgraph Operations
        LIST_OP[list] --> STATE
        GET_OP[get id] --> STATE
        SAVE_OP[save employee] --> UPDATE[state.update]
        DELETE_OP[delete id] --> FILTER[state.update filter]
    end

    UPDATE --> PERSIST[persist → localStorage]
    FILTER --> PERSIST
```

### API Surface

| Method | Signature | Behavior |
|--------|-----------|----------|
| `employees` | `Computed<Employee[]>` | Reactive read-only list |
| `list()` | `() → Employee[]` | Snapshot of current state |
| `get(id)` | `(number) → Employee \| undefined` | Find by ID |
| `save(e)` | `(Employee) → void` | Create (id=0) or update |
| `delete(id)` | `(number) → void` | Remove by ID |

### Save Logic

```mermaid
flowchart LR
    SAVE[save called] --> CHECK{employee.id?}
    CHECK -->|truthy| UPDATE[Map: replace matching]
    CHECK -->|0 / falsy| CREATE[Spread + id: Date.now]
    UPDATE --> PERSIST[persist to localStorage]
    CREATE --> PERSIST
```

**Source:** [`src/app/core/employee.service.ts`](../src/app/core/employee.service.ts)

---

## AuthService — Authentication State

> Detailed in [Authentication Flow → AuthService](./authentication-flow.md#auth-service)

```mermaid
flowchart LR
    subgraph AuthService
        USER([user: Signal&lt;User|null&gt;])
        LOGGED[isLoggedIn: Computed&lt;boolean&gt;]
        USER --> LOGGED
    end

    subgraph Methods
        LOGIN[login email, password]
        LOGOUT[logout]
        HAS_ROLE[hasRole role]
    end

    LOGIN -->|set| USER
    LOGOUT -->|null| USER
    HAS_ROLE -->|read| USER
```

**Source:** [`src/app/core/auth.service.ts`](../src/app/core/auth.service.ts)

---

## Signal Reactivity Model

```mermaid
graph TD
    subgraph WritableSignals["Writable Signals (Source of Truth)"]
        S1([AuthService.user])
        S2([EmployeeService.state])
        S3([EmployeesComponent.query])
        S4([EmployeesComponent.editing])
    end

    subgraph ComputedSignals["Computed Signals (Derived)"]
        C1[isLoggedIn]
        C2[employees]
        C3[filtered]
        C4[count / active / payroll / departments]
    end

    S1 --> C1
    S2 --> C2
    C2 --> C4
    S3 --> C3
    C2 --> C3

    subgraph Templates["Template Bindings (Consumers)"]
        T1[Nav visibility]
        T2[Dashboard cards]
        T3[Employee table rows]
        T4[Form display]
    end

    C1 --> T1
    C4 --> T2
    C3 --> T3
    S4 --> T4
```

---

## Persistence Strategy

```mermaid
flowchart LR
    subgraph Keys["localStorage Keys"]
        K1["'demo-user'<br/>User JSON or null"]
        K2["'employees'<br/>Employee[] JSON"]
    end

    subgraph Readers
        AUTH[AuthService.read]
        EMP[EmployeeService.load]
    end

    subgraph Writers
        AUTH_W[login / logout]
        EMP_W[save / delete → persist]
    end

    K1 --> AUTH
    K2 --> EMP
    AUTH_W --> K1
    EMP_W --> K2
```

| Key | Written by | Read by | Format |
|-----|-----------|---------|--------|
| `demo-user` | `AuthService.login/logout` | `AuthService.read`, `authInterceptor` | `User` JSON or absent |
| `employees` | `EmployeeService.persist` | `EmployeeService.load` | `Employee[]` JSON |

---

## Seed Data

The `EmployeeService` ships with 4 hardcoded employees used when no localStorage data exists:

| ID | Name | Department | Salary |
|----|------|-----------|--------|
| 1 | Rambabu Pudi | Engineering | ₹18,00,000 |
| 2 | Priya Reddy | Product | ₹16,00,000 |
| 3 | Vikram Singh | Engineering | ₹14,50,000 |
| 4 | Neha Patel | HR | ₹12,00,000 |

---

[← Component Workflow](./component-workflow.md) | [Back to Index](./README.md) | [Routing →](./routing.md)
