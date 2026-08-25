# Angular Employee Management Portal - Project Architecture

## 1. Overview

The Angular Employee Management Portal is a modern, enterprise-grade application built with Angular 22+ using the latest standalone components architecture. It provides a comprehensive solution for managing employee information with role-based access control, featuring an intuitive dashboard, employee management capabilities, and admin functionalities.

**Key Characteristics:**
- Standalone components architecture
- Reactive state management using Angular Signals
- Route-based lazy loading for performance
- Role-based access control (RBAC)
- Local storage persistence
- Modular and scalable design

---

## 2. Technology Stack

### Core Framework
- **Angular**: 22.1.0 (Latest)
- **TypeScript**: 6.0.2
- **RxJS**: 7.8.2

### Build & Development Tools
- **@angular/cli**: 22.1.0
- **@angular/build**: 22.1.0
- **Prettier**: 3.0.0 (Code formatting)
- **Oxlint**: 0.2.0 (Linting)
- **Vitest**: 4.0.8 (Testing)

### UI & Styling
- CSS3 (No CSS framework - lightweight custom styling)
- Angular Forms (Reactive & Template-driven)

### State Management
- Angular Signals (Built-in reactivity)
- RxJS Observables (Event handling)

### Storage
- Browser localStorage (Demo persistence)

---

## 3. Project Structure

```
angular-employee-management-portal/
├── src/
│   ├── app/
│   │   ├── core/                 # Core services & infrastructure
│   │   │   ├── auth.service.ts   # Authentication & authorization
│   │   │   ├── auth.interceptor.ts # HTTP interceptor for auth headers
│   │   │   ├── employee.service.ts # Employee data management
│   │   │   ├── employee.service.spec.ts # Employee service tests
│   │   │   └── guards.ts         # Route guards (auth, admin)
│   │   │
│   │   ├── features/             # Feature components (lazy-loaded)
│   │   │   ├── login.component.ts     # Login page
│   │   │   ├── dashboard.component.ts # User dashboard
│   │   │   ├── employees.component.ts # Employee management
│   │   │   └── admin.component.ts     # Admin controls
│   │   │
│   │   ├── shared/               # Reusable utilities & components
│   │   │   ├── validators.ts     # Custom form validators
│   │   │   ├── validators.spec.ts
│   │   │   ├── currency-inr.pipe.ts # INR currency formatter
│   │   │   └── highlight.directive.ts # Text highlighting
│   │   │
│   │   ├── app.component.ts      # Root component
│   │   ├── app.routes.ts         # Route configuration
│   │   ├── models.ts             # Data models (interfaces)
│   │   └── app/...               # Application template
│   │
│   ├── main.ts                   # Application bootstrap
│   ├── index.html                # HTML entry point
│   └── styles.css                # Global styles
│
├── docs/                         # Documentation
│   ├── README.md
│   ├── architecture.md
│   ├── authentication-flow.md
│   ├── component-workflow.md
│   ├── routing.md
│   ├── service-layer.md
│   ├── shared-utilities.md
│   ├── development-workflow.md
│   └── PROJECT_ARCHITECTURE.md   # This file
│
├── mock-backend/
│   └── server.js                 # Development mock server
│
├── angular.json                  # Angular CLI configuration
├── tsconfig.json                 # TypeScript root config
├── tsconfig.app.json             # App-specific TS config
├── tsconfig.spec.json            # Test-specific TS config
├── package.json                  # Dependencies
├── Dockerfile                    # Container configuration
├── oxlint.json                   # Linter configuration
└── README.md
```

---

## 4. Architecture Layers

### 4.1 Presentation Layer (UI Components)

Located in `src/app/features/`, these are the user-facing components:

**Components:**
- **LoginComponent**: Authentication entry point
  - Form validation
  - Credential handling
  - Error messaging

- **DashboardComponent**: Main user interface
  - Employee summary statistics
  - Quick actions
  - Personalized greetings

- **EmployeesComponent**: CRUD management
  - List, create, read, update, delete operations
  - Filtering and sorting
  - Bulk operations

- **AdminComponent**: Administrative controls
  - System administration
  - User management
  - Configuration settings

### 4.2 Service Layer (Business Logic)

Located in `src/app/core/`, these services handle all business logic:

**Key Services:**

#### AuthService (`core/auth.service.ts`)
```typescript
Responsibilities:
- User authentication & authorization
- Token management
- Role validation
- Session persistence
- Login state broadcasting

Public API:
- login(email, password): boolean
- logout(): void
- hasRole(role): boolean
- isLoggedIn(): computed boolean
```

#### EmployeeService (`core/employee.service.ts`)
```typescript
Responsibilities:
- Employee data CRUD operations
- In-memory state management using Signals
- LocalStorage synchronization
- Data persistence

Public API:
- list(): Employee[]
- get(id): Employee | undefined
- save(employee): void
- delete(id): void
```

### 4.3 Data Layer

**Data Sources:**
- **LocalStorage**: Persistent client-side storage for employee and user data
- **Seed Data**: Default employee dataset loaded on first run
- **Interceptor**: HTTP request/response handling

**Data Models** (`models.ts`):
```typescript
Employee:
  - id: number
  - name: string
  - email: string
  - department: string
  - role: string
  - salary: number
  - active: boolean
  - joinedOn: string

User:
  - email: string
  - role: 'ADMIN' | 'MANAGER' | 'USER'
```

### 4.4 Infrastructure Layer

**HTTP Interceptor** (`auth.interceptor.ts`):
- Automatically attaches authorization headers to all HTTP requests
- Encodes user session data as Bearer token

**Route Guards** (`guards.ts`):
- `authGuard`: Redirects unauthenticated users to login
- `adminGuard`: Restricts access to admin routes

---

## 5. Authentication & Authorization

### 5.1 Authentication Flow

```
User Input (Email/Password)
    ↓
AuthService.login()
    ↓
Validate Credentials (Role assignment)
    ↓
Store in localStorage + Signal
    ↓
Broadcast isLoggedIn state
    ↓
Redirect to Dashboard
```

### 5.2 Authorization (Role-Based Access Control)

**Supported Roles:**
- `ADMIN`: Full system access
- `MANAGER`: Employee and report management
- `USER`: View-only access

**Demo Credentials:**
```
ADMIN:
  Email: admin@example.com
  Password: admin123

MANAGER:
  Email: manager@example.com
  Password: manager123
```

### 5.3 Access Control Mechanism

**Component-level:**
```typescript
@if (auth.hasRole('ADMIN')) {
  <a routerLink="/admin">Admin</a>
}
```

**Route-level:**
```typescript
{
  path: 'admin',
  canActivate: [authGuard, adminGuard],
  loadComponent: () => import('./features/admin.component')
}
```

---

## 6. Routing & Navigation

### 6.1 Route Configuration (`app.routes.ts`)

| Route | Component | Auth Required | Role Required | Type |
|-------|-----------|---------------|---------------|------|
| `/login` | LoginComponent | ✗ | - | Eager |
| `/dashboard` | DashboardComponent | ✓ | ANY | Lazy |
| `/employees` | EmployeesComponent | ✓ | MANAGER+ | Lazy |
| `/admin` | AdminComponent | ✓ | ADMIN | Lazy |
| `/` | - | ✓ | - | Redirect to `/dashboard` |
| `**` | - | - | - | Fallback to `/dashboard` |

### 6.2 Lazy Loading Strategy

All feature components are lazy-loaded to improve initial bundle size:
```typescript
loadComponent: () => import('./features/employees.component')
  .then((m) => m.EmployeesComponent)
```

**Benefits:**
- Reduced initial load time
- Improved Time to Interactive (TTI)
- On-demand resource loading

---

## 7. State Management

### 7.1 Reactive State with Signals

Angular Signals provide reactive, fine-grained state management without RxJS overhead:

**AuthService State:**
```typescript
readonly user = signal<User | null>(this.read());
readonly isLoggedIn = computed(() => this.user() !== null);
```

**EmployeeService State:**
```typescript
private state = signal<Employee[]>(this.load());
readonly employees = computed(() => this.state());
```

### 7.2 State Persistence

All state changes are persisted to localStorage:
- User session: `localStorage.getItem('demo-user')`
- Employee list: `localStorage.getItem('employees')`

### 7.3 Computed Values

Derived state using `computed()`:
```typescript
readonly isLoggedIn = computed(() => this.user() !== null);
readonly employees = computed(() => this.state());
```

Benefits:
- Automatic change detection
- Efficient re-evaluation
- Dependency tracking

---

## 8. Shared Utilities

Located in `src/app/shared/`, these reusable components are available across the application:

### 8.1 Custom Validators (`validators.ts`)
- Email format validation
- Phone number validation
- Password strength validation
- Custom async validators

### 8.2 Pipes (`currency-inr.pipe.ts`)
- **CurrencyInrPipe**: Formats numbers as Indian Rupees (₹)
- Usage: `{{ salary | currencyInr }}`

### 8.3 Directives (`highlight.directive.ts`)
- **HighlightDirective**: Highlights text on hover
- Usage: `<div appHighlight>Text</div>`

---

## 9. Component Architecture

### 9.1 Standalone Components

All components are standalone (no NgModule):
```typescript
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  template: `...`
})
export class LoginComponent { }
```

**Advantages:**
- Simplified dependency management
- Improved tree-shaking
- Clearer dependency graph
- Better code organization

### 9.2 Dependency Injection

Components use constructor injection via `inject()`:
```typescript
export class EmployeesComponent {
  readonly employees = inject(EmployeeService).employees;
  readonly router = inject(Router);
}
```

### 9.3 Template Syntax

Uses Angular's modern control flow syntax:
```typescript
@if (condition) { }
@for (item of items; track item.id) { }
@switch (value) { }
```

---

## 10. Data Models & Types

### 10.1 Employee Model

```typescript
interface Employee {
  id: number;           // Unique identifier
  name: string;         // Full name
  email: string;        // Corporate email
  department: string;   // Department assignment
  role: string;         // Job role/title
  salary: number;       // Annual salary (INR)
  active: boolean;      // Employment status
  joinedOn: string;     // ISO 8601 date format
}
```

### 10.2 User Model

```typescript
interface User {
  email: string;        // Login email
  role: 'ADMIN' | 'MANAGER' | 'USER';  // Authorization role
}
```

---

## 11. API Integration Strategy

### 11.1 Current Implementation (Mock Backend)

The application uses a mock backend for development:
- **Location**: `mock-backend/server.js`
- **Purpose**: Simulates API responses without real backend

### 11.2 HTTP Interceptor Pattern

```typescript
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('demo-user');
  return next(
    token 
      ? req.clone({ setHeaders: { Authorization: `Bearer ${btoa(token)}` } })
      : req
  );
};
```

**Features:**
- Automatic header injection
- Token-based authentication
- Request/response interception point

### 11.3 Future Backend Integration

To integrate with a real backend:
1. Create HTTP service methods in `EmployeeService`
2. Use `HttpClient` for API calls
3. Replace localStorage with HTTP calls
4. Maintain the same Signal-based interface

---

## 12. Security Considerations

### 12.1 Authentication Security

- **Token Storage**: User data stored in localStorage (demo only)
- **Session Management**: Logout clears localStorage
- **Password Handling**: Not persisted beyond authentication

### 12.2 Authorization

- **Route Guards**: Prevent unauthorized navigation
- **Component-level Checks**: Hide/show UI based on roles
- **Service-level Validation**: Enforce business rules

### 12.3 HTTP Security

- **Bearer Tokens**: Used in Authorization headers
- **Interceptor Pattern**: Centralized request handling
- **CORS**: Would be handled by backend

### 12.3 Recommendations for Production

- Implement refresh token mechanism
- Use httpOnly cookies for tokens
- Add CSRF protection
- Implement rate limiting
- Use HTTPS exclusively
- Sanitize user inputs
- Implement proper error handling
- Add audit logging

---

## 13. Development Workflow

### 13.1 Available Scripts

```bash
npm start              # Start development server (ng serve)
npm run build          # Production build
npm test               # Run unit tests
npm run format         # Format code with Prettier
npm run format:check   # Check code formatting
npm run lint           # Run linter
npm run lint:fix       # Fix linting issues
```

### 13.2 Development Server

```bash
npm start
# Server runs on http://localhost:4200
# Mock backend available for API requests
```

### 13.3 Code Organization Guidelines

- **Services**: Business logic, API calls, state management
- **Components**: UI presentation and user interaction
- **Directives**: DOM manipulation and reusable behaviors
- **Pipes**: Data transformation for display
- **Models**: Type definitions and interfaces
- **Guards**: Route access control

### 13.4 Adding New Features

**Step 1**: Define data models in `models.ts`

**Step 2**: Create service in `core/` with business logic

**Step 3**: Create component in `features/` with UI

**Step 4**: Add route to `app.routes.ts`

**Step 5**: Apply route guards if needed

**Step 6**: Add shared utilities if reusable

---

## 14. Testing Strategy

### 14.1 Unit Testing

- **Framework**: Vitest
- **Test Files**: `*.spec.ts`
- **Location**: Colocated with source files
- **Example**: `core/employee.service.spec.ts`

### 14.2 Running Tests

```bash
npm test              # Run all tests once
npm test -- --watch   # Watch mode
npm test -- --ui      # UI mode
```

### 14.3 Test Coverage Areas

- Service logic validation
- Guard behavior
- Component initialization
- Input validation
- State mutations

---

## 15. Deployment

### 15.1 Production Build

```bash
npm run build
# Artifacts: dist/angular-employee-management-portal
```

### 15.2 Docker Deployment

```bash
docker build -t angular-emp-portal .
docker run -p 80:80 angular-emp-portal
```

### 15.3 Environment Configuration

- **Development**: `angular.json` serves from `src/`
- **Production**: Optimized build with tree-shaking and minification
- **Environment-specific**: Configure in `angular.json`

---

## 16. Performance Optimization

### 16.1 Bundle Optimization

- **Lazy Loading**: Feature modules loaded on demand
- **Tree Shaking**: Unused code removed in production
- **Code Splitting**: Route-based code separation

### 16.2 Rendering Optimization

- **Signals**: Fine-grained change detection
- **OnPush Detection**: For component optimization
- **Change Detection Strategy**: Minimized re-renders

### 16.3 Monitoring

- Initial Load Time
- Time to Interactive (TTI)
- Lighthouse scores
- Bundle size analysis

---

## 17. Dependencies

### Production Dependencies
- `@angular/*`: Core framework packages
- `rxjs`: Reactive programming library

### Development Dependencies
- `@angular/cli`: CLI tooling
- `typescript`: Language compiler
- `vitest`: Testing framework
- `prettier`: Code formatter
- `oxlint`: JavaScript linter

---

## 18. Configuration Files

### 18.1 angular.json
- Build configuration
- Development server settings
- Testing configuration
- Production optimization

### 18.2 tsconfig.json
- TypeScript compilation settings
- Module resolution
- Type checking strictness

### 18.3 tsconfig.app.json & tsconfig.spec.json
- App-specific and test-specific TS configurations

### 18.4 oxlint.json
- Linting rules and configurations

---

## 19. Key Architectural Patterns

### 19.1 Service Locator Pattern
- Services injected via `inject()` function
- Centralized dependency injection

### 19.2 Guard Pattern
- Route protection via functional guards
- Authentication and authorization checks

### 19.3 Interceptor Pattern
- HTTP request/response interception
- Cross-cutting concerns (auth headers)

### 19.4 Pipe Pattern
- Data transformation for display
- Reusable formatting logic

### 19.5 Directive Pattern
- DOM manipulation and enhancement
- Reusable behavior attachment

---

## 20. Future Enhancements

- [ ] Real backend API integration
- [ ] Advanced filtering and search
- [ ] Data export (CSV, PDF)
- [ ] Multi-user collaboration features
- [ ] Audit logging
- [ ] Advanced reporting
- [ ] Mobile responsive design improvements
- [ ] Progressive Web App (PWA) features
- [ ] Internationalization (i18n)
- [ ] Accessibility improvements (a11y)
- [ ] Performance monitoring
- [ ] Error tracking integration

---

## 21. Troubleshooting

### Issue: Authentication fails after browser refresh
**Solution**: Check localStorage persistence. Ensure browser allows localStorage for the domain.

### Issue: Employee data not persisting
**Solution**: Verify localStorage is enabled. Clear browser cache and reload.

### Issue: Lazy-loaded components fail to load
**Solution**: Ensure mock server is running. Check network tab for failed requests.

### Issue: Styles not applying correctly
**Solution**: Clear browser cache. Rebuild with `npm run build`.

---

## 22. Resources & References

- [Angular Documentation](https://angular.io)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)
- [RxJS Documentation](https://rxjs.dev)
- [Angular Signals](https://angular.io/guide/signals)
- [Angular Routing](https://angular.io/guide/routing-overview)
- [Angular Standalone Components](https://angular.io/guide/standalone-components)

---

## 23. Glossary

| Term | Definition |
|------|-----------|
| **Standalone Component** | A component that manages its own dependencies without NgModule |
| **Signal** | Fine-grained reactive value that triggers updates when changed |
| **Computed** | Derived value from signals with automatic dependency tracking |
| **Lazy Loading** | Loading code only when needed, not at application startup |
| **Route Guard** | Function protecting route access based on conditions |
| **Interceptor** | Middleware for HTTP requests/responses |
| **Tree Shaking** | Removal of unused code during build optimization |
| **TTI** | Time to Interactive - when app responds to user input |

---

**Document Version**: 1.0  
**Last Updated**: 2026-08-25  
**Maintained By**: Architecture Team
