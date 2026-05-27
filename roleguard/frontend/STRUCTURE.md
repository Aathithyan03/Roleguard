# RoleGuard — Angular 15 Frontend Structure

## Module Map

```
src/app/
├── app.module.ts                    # Root module (imports Core, Auth, Dashboard, Admin)
├── app-routing.module.ts            # Lazy-loaded routes
├── app.component.ts/html/scss       # Root shell
│
├── core/
│   ├── guards/
│   │   ├── auth.guard.ts            # Redirect unauthenticated users to /login
│   │   └── role.guard.ts            # Block non-admin from /admin
│   ├── interceptors/
│   │   ├── jwt.interceptor.ts       # Attach Bearer token to every request
│   │   └── loading.interceptor.ts   # Show/hide global spinner
│   ├── services/
│   │   ├── auth.service.ts          # Login, logout, token decode, currentUser$
│   │   └── api.service.ts           # Base HTTP wrapper
│   └── models/
│       ├── user.model.ts
│       └── record.model.ts
│
├── modules/
│   ├── auth/
│   │   ├── auth.module.ts
│   │   ├── auth-routing.module.ts
│   │   └── login/
│   │       ├── login.component.ts   # Reactive form, error states, role badge
│   │       ├── login.component.html
│   │       └── login.component.scss
│   │
│   ├── dashboard/
│   │   ├── dashboard.module.ts
│   │   ├── dashboard-routing.module.ts
│   │   └── dashboard/
│   │       ├── dashboard.component.ts   # forkJoin(user$, records$), delay param
│   │       ├── dashboard.component.html # Profile card + Material table
│   │       └── dashboard.component.scss
│   │
│   └── admin/
│       ├── admin.module.ts
│       ├── admin-routing.module.ts
│       └── user-management/
│           ├── user-management.component.ts   # CRUD table, dialog forms
│           ├── user-management.component.html
│           └── user-management.component.scss
│
└── shared/
    ├── components/
    │   ├── loader/
    │   │   └── loader.component.ts     # Full-page animated spinner
    │   └── nav/
    │       └── nav.component.ts        # Sidebar nav, role-aware links
    └── models/
        ├── user.model.ts
        └── record.model.ts
```

## Key Angular Patterns Used

| Pattern | Where |
|---|---|
| Lazy loading | app-routing (loadChildren) |
| Reactive Forms + validators | LoginComponent |
| forkJoin async | DashboardComponent (parallel API calls) |
| BehaviorSubject | AuthService.currentUser$ |
| HTTP Interceptor (JWT) | JwtInterceptor |
| HTTP Interceptor (loading) | LoadingInterceptor |
| Route Guard (auth) | AuthGuard |
| Route Guard (role) | RoleGuard |
| Angular Material Table | DashboardComponent, AdminComponent |
| MatDialog (CRUD) | UserManagementComponent |
| Delay param async demo | RecordsService.getRecords(delay?) |
| APP_INITIALIZER | Load user profile on bootstrap |
