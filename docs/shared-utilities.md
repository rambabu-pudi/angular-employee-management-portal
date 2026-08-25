# Shared Utilities

[← Routing](./routing.md) | [Back to Index](./README.md) | [Development Workflow →](./development-workflow.md)

---

## Overview

```mermaid
graph LR
    subgraph SharedModule["src/app/shared/"]
        PIPE([InrPipe])
        DIR([HighlightDirective])
        VAL([corporateEmail validator])
    end

    subgraph Consumers
        DASH[DashboardComponent]
        EMPS[EmployeesComponent]
    end

    DASH --> PIPE
    EMPS --> PIPE
    EMPS --> DIR
    EMPS --> VAL
```

---

## <a id="inr-pipe"></a>InrPipe — Currency Formatter

### Purpose
Formats a numeric value as Indian Rupees (₹) with the Indian numbering system (lakhs/crores).

### Usage

```html
{{ employee.salary | inr }}
<!-- Output: ₹18,00,000 -->
```

### Implementation

```mermaid
flowchart LR
    INPUT[number value] --> INTL[Intl.NumberFormat<br/>locale: en-IN<br/>currency: INR<br/>maxFractionDigits: 0]
    INTL --> OUTPUT["₹XX,XX,XXX"]
```

| Parameter | Value |
|-----------|-------|
| Locale | `en-IN` |
| Style | `currency` |
| Currency | `INR` |
| Fraction digits | 0 |

**Used by:** [DashboardComponent](./component-workflow.md#dashboard), [EmployeesComponent](./component-workflow.md#employees)

**Source:** [`src/app/shared/currency-inr.pipe.ts`](../src/app/shared/currency-inr.pipe.ts)

---

## <a id="highlight-directive"></a>HighlightDirective — Row Hover Effect

### Purpose
Adds a visual outline to table rows on mouse hover for better UX.

### Usage

```html
<tr appHighlight>...</tr>
```

### Behavior

```mermaid
stateDiagram-v2
    [*] --> Idle: No outline
    Idle --> Highlighted: mouseenter
    Highlighted --> Idle: mouseleave
    
    state Highlighted {
        [*] --> Styled: outline = "2px solid currentColor"
    }
```

| Event | Action |
|-------|--------|
| `mouseenter` | Set `outline: 2px solid currentColor` |
| `mouseleave` | Remove outline |

**Used by:** [EmployeesComponent](./component-workflow.md#employees) (table rows)

**Source:** [`src/app/shared/highlight.directive.ts`](../src/app/shared/highlight.directive.ts)

---

## <a id="validators"></a>Custom Validators

### `corporateEmail`

Validates that an email address ends with `@example.com` (corporate domain restriction).

```mermaid
flowchart TD
    INPUT[Form Control Value] --> EMPTY{Value empty?}
    EMPTY -->|Yes| PASS[Return null ✓]
    EMPTY -->|No| CHECK{Ends with<br/>@example.com?}
    CHECK -->|Yes| PASS
    CHECK -->|No| FAIL["Return { corporateEmail: true } ✗"]
```

| Input | Result |
|-------|--------|
| `""` | `null` (valid — let `required` handle empty) |
| `user@example.com` | `null` (valid) |
| `user@gmail.com` | `{ corporateEmail: true }` (invalid) |

### Integration with Forms

```mermaid
flowchart LR
    FORM[EmployeesComponent Form] --> EMAIL_CTRL[email FormControl]
    EMAIL_CTRL --> V1[Validators.required]
    EMAIL_CTRL --> V2[Validators.email]
    EMAIL_CTRL --> V3[corporateEmail]
    V3 -->|Error key| ERR["'corporateEmail'"]
```

**Used by:** [EmployeesComponent](./component-workflow.md#employees) (email field)

**Source:** [`src/app/shared/validators.ts`](../src/app/shared/validators.ts)

---

## Test Coverage

The validators have dedicated spec tests:

**Source:** [`src/app/shared/validators.spec.ts`](../src/app/shared/validators.spec.ts)

---

[← Routing](./routing.md) | [Back to Index](./README.md) | [Development Workflow →](./development-workflow.md)
