# Component Workflow

[← Authentication Flow](./authentication-flow.md) | [Back to Index](./README.md) | [Service Layer →](./service-layer.md)

---

## <a id="app-shell"></a>AppComponent — Application Shell

```mermaid
flowchart TD
    subgraph AppComponent["AppComponent (Root Shell)"]
        HEADER[Header with Brand Link]
        NAV{isLoggedIn?}
        NAV -->|Yes| LINKS[Dashboard | Employees links]
        NAV -->|No| HIDDEN[Nav hidden]
        LINKS --> ROLE{hasRole 'ADMIN'?}
        ROLE -->|Yes| ADMIN_LINK[Admin link]
        ROLE -->|No| NO_ADMIN[Admin link hidden]
        LOGOUT_BTN[Logout Button]
        MAIN["<main><router-outlet /></main>"]
    end
```

**Responsibilities:**
- Renders navigation conditionally based on auth state
- Shows/hides Admin link based on role
- Provides `<router-outlet>` for feature components

**Source:** [`src/app/app.component.ts`](../src/app/app.component.ts)

---

## <a id="dashboard"></a>DashboardComponent

### Data Flow

```mermaid
flowchart LR
    subgraph EmployeeService
        STATE([employees signal])
    end

    subgraph DashboardComponent
        EMP[employees computed]
        COUNT[count computed]
        ACTIVE[active computed]
        PAYROLL[payroll computed]
        DEPTS[departments computed]
    end

    subgraph Template
        CARD1[Employee Count Card]
        CARD2[Active Count Card]
        CARD3[Payroll Card<br/>uses InrPipe]
        CARD4[Department Count Card]
        LIST[Employee List]
    end

    STATE --> EMP
    EMP --> COUNT
    EMP --> ACTIVE
    EMP --> PAYROLL
    EMP --> DEPTS
    COUNT --> CARD1
    ACTIVE --> CARD2
    PAYROLL --> CARD3
    DEPTS --> CARD4
    EMP --> LIST
```

### Computed Properties

| Property | Formula | Output |
|----------|---------|--------|
| `count` | `employees().length` | Total headcount |
| `active` | `filter(e.active).length` | Active employees |
| `payroll` | `reduce(sum of salary)` | Total salary (INR) |
| `departments` | `new Set(department).size` | Unique dept count |

**Source:** [`src/app/features/dashboard.component.ts`](../src/app/features/dashboard.component.ts)

---

## <a id="employees"></a>EmployeesComponent — CRUD Workflow

### Complete Interaction Flow

```mermaid
flowchart TD
    START([Component loads]) --> LIST[Display employee table]
    LIST --> SEARCH[User types in search]
    SEARCH --> FILTER[filtered computed<br/>filters by name/email/dept/role]
    FILTER --> LIST

    LIST --> ADD[Click 'Add Employee']
    ADD --> NEW_FORM[Reset form with empty values]
    NEW_FORM --> FORM_DISPLAY[Show form section]
    
    LIST --> EDIT_BTN[Click 'Edit' on row]
    EDIT_BTN --> EDIT_FORM[Populate form with employee data]
    EDIT_FORM --> FORM_DISPLAY

    FORM_DISPLAY --> FILL[User fills fields]
    FILL --> VALID{Form valid?}
    VALID -->|No| DISABLED[Save button disabled]
    VALID -->|Yes| SAVE[Click Save]
    SAVE --> SERVICE[EmployeeService.save]
    SERVICE --> PERSIST[Persist to localStorage]
    PERSIST --> LIST

    FORM_DISPLAY --> CANCEL[Click Cancel]
    CANCEL --> HIDE[Hide form]
    HIDE --> LIST

    LIST --> DELETE[Click 'Delete']
    DELETE --> CONFIRM{confirm dialog}
    CONFIRM -->|OK| REMOVE[EmployeeService.delete]
    REMOVE --> PERSIST2[Persist to localStorage]
    PERSIST2 --> LIST
    CONFIRM -->|Cancel| LIST
```

### Form Validation Rules

```mermaid
flowchart LR
    subgraph FormGroup
        NAME[name<br/>required]
        EMAIL[email<br/>required + email + corporateEmail]
        DEPT[department<br/>required]
        ROLE[role<br/>required]
        SALARY[salary<br/>required + min:1]
        ACTIVE[active<br/>checkbox]
    end

    EMAIL --> CV{corporateEmail validator}
    CV -->|Must end with @example.com| PASS[Valid]
    CV -->|Other domain| FAIL[Error: corporateEmail]
```

| Field | Validators | Link |
|-------|-----------|------|
| `name` | `Validators.required` | — |
| `email` | `required`, `email`, [`corporateEmail`](./shared-utilities.md#validators) | Custom validator |
| `department` | `Validators.required` | — |
| `role` | `Validators.required` | — |
| `salary` | `required`, `min(1)` | — |
| `active` | none | Toggle |

### Signal State

| Signal | Type | Purpose |
|--------|------|---------|
| `query` | `WritableSignal<string>` | Search filter text |
| `editing` | `WritableSignal<Employee \| null>` | Current edit target |
| `filtered` | `Computed<Employee[]>` | Derived filtered list |
| `employees` | `Computed<Employee[]>` | From service |

**Source:** [`src/app/features/employees.component.ts`](../src/app/features/employees.component.ts)

---

## <a id="admin"></a>AdminComponent

```mermaid
flowchart TD
    GUARD{adminGuard<br/>hasRole ADMIN?} -->|Yes| RENDER[Render AdminComponent]
    GUARD -->|No| REDIRECT[Redirect to /dashboard]
    RENDER --> DISPLAY[Show current role info]
```

**Simple read-only panel** that displays the current user's role. Protected by both `authGuard` and `adminGuard`.

**Source:** [`src/app/features/admin.component.ts`](../src/app/features/admin.component.ts)

---

## Component Communication Pattern

```mermaid
graph TD
    subgraph Signals["Signal-Based Communication"]
        SVC_STATE([Service Signal State])
        COMP_COMPUTED[Component Computed]
        TEMPLATE[Template Binding]
    end

    SVC_STATE -->|auto-propagates| COMP_COMPUTED
    COMP_COMPUTED -->|reactive| TEMPLATE
    TEMPLATE -->|user action| EVENT[Event Handler]
    EVENT -->|mutate| SVC_STATE
```

All components follow the same pattern:
1. **Inject** service
2. **Expose** service signals or computed derivatives
3. **Template** reads signals reactively
4. **Event handlers** call service methods to mutate state
5. **Signal propagation** automatically updates the view

---

## Component Import Matrix

| Component | ReactiveFormsModule | FormsModule | InrPipe | HighlightDirective | RouterLink |
|-----------|:---:|:---:|:---:|:---:|:---:|
| AppComponent | | | | | ✓ |
| LoginComponent | | ✓ | | | |
| DashboardComponent | | | ✓ | | |
| EmployeesComponent | ✓ | | ✓ | ✓ | |
| AdminComponent | | | | | |

---

[← Authentication Flow](./authentication-flow.md) | [Back to Index](./README.md) | [Service Layer →](./service-layer.md)
