# RoleGuard — Full Stack Angular + Node.js Application

A role-based access control SPA built with **Angular 15**, **Node.js/Express**, and a **local JSON store** (drop-in replaceable with DynamoDB or MongoDB).

---

## Quick Start (2 terminals, 2 minutes)

### Terminal 1 — Backend API
```bash
cd backend
npm install
npm run dev
# API running at http://localhost:3000
```

### Terminal 2 — Angular Frontend
```bash
cd frontend
npm install
ng serve
# App running at http://localhost:4200
```

### Demo Credentials
| Role         | User ID | Password    |
|--------------|---------|-------------|
| Admin        | admin   | password123 |
| General User | priya   | password123 |
| General User | rohan   | password123 |

---

## Features Implemented

### 1. Login Page
- Reactive Form with validation (required, minLength, email)
- User ID + Password + Role display
- Show/hide password toggle
- Quick-fill demo credential pills
- JWT token stored in localStorage on success
- Error handling for invalid credentials and disabled accounts

### 2. Dashboard (Logged-In Page)
- **User profile card** — name, email, role badge, department, join date
- **Stats row** — total, completed, in-progress, admin-only counts
- **Records table** — Angular Material `mat-table` with status/priority colour badges
- **Role-based data** — Admin sees all 6 records; General User sees 4 public ones
- **Async delay demo** — "Simulate API delay" buttons (0 / 1.5s / 3s) call `GET /records?delay=ms`, triggering animated loading bar — demonstrates async processing explicitly

### 3. Admin Panel (Admin only)
- Full **CRUD** for users — create, edit, toggle active/inactive, delete
- Inline form panel (no page navigation needed)
- Self-protection: cannot delete or deactivate your own account
- MatSnackBar notifications on every action
- Role guard blocks non-admin users from accessing this route

---

## Angular Architecture

```
app/
├── core/
│   ├── guards/
│   │   ├── auth.guard.ts         # Redirects unauthenticated → /auth/login
│   │   └── role.guard.ts         # Blocks non-admin from /admin
│   ├── interceptors/
│   │   ├── jwt.interceptor.ts    # Attaches Bearer token to every HTTP request
│   │   └── loading.interceptor.ts# Shows/hides global top loading bar
│   └── services/
│       ├── auth.service.ts       # BehaviorSubject<User>, login/logout, APP_INITIALIZER
│       ├── records.service.ts    # GET /records with optional delay param
│       ├── users.service.ts      # Full CRUD for /users (admin)
│       └── loading.service.ts    # BehaviorSubject<boolean> for global loader
├── modules/
│   ├── auth/          # Lazy-loaded login module
│   ├── dashboard/     # Lazy-loaded dashboard module
│   └── admin/         # Lazy-loaded admin module (role-guarded)
└── shared/
    ├── components/nav/ # Sidebar with role-aware links
    └── models/         # User, Record TypeScript interfaces
```

### Key Angular Patterns Used

| Pattern | File |
|---|---|
| `APP_INITIALIZER` | `app.module.ts` — rehydrates user on every page refresh |
| `BehaviorSubject` | `auth.service.ts`, `loading.service.ts` |
| `HTTP_INTERCEPTORS` | JWT token injection + global loading indicator |
| `CanActivate` guards | `auth.guard.ts`, `role.guard.ts` |
| Lazy loading | `app-routing.module.ts` — all 3 modules lazy-loaded |
| `forkJoin` | `dashboard.component.ts` — parallel async API calls |
| `Reactive Forms` | Login + admin user form with validators |
| `APP_INITIALIZER` | Session rehydration on bootstrap |
| `finalize` operator | Hides loading state after observable completes or errors |
| Angular Material | `mat-table`, `MatSnackBar`, `MatButton` |

---

## Backend API

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/login` | None | Login, returns JWT |
| GET | `/api/auth/me` | JWT | Get current user |
| GET | `/api/records?delay=ms` | JWT | Get records (role-filtered) |
| GET | `/api/users` | Admin JWT | List all users |
| POST | `/api/users` | Admin JWT | Create user |
| PATCH | `/api/users/:id` | Admin JWT | Update user |
| DELETE | `/api/users/:id` | Admin JWT | Delete user |

### Storage
- Local JSON file: `backend/src/data/db.json`
- Replaceable with **DynamoDB** — swap `db.service.ts` with `@aws-sdk/client-dynamodb`
- Replaceable with **MongoDB** — swap with `mongoose` models

### Security
- Passwords hashed with `bcryptjs` (10 salt rounds)
- JWT signed with HS256, 8-hour expiry
- `helmet` for secure HTTP headers
- CORS restricted to `localhost:4200`
- `simulateDelay` middleware capped at 5000ms to prevent abuse

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Angular 15, TypeScript, RxJS, Angular Material |
| Backend | Node.js, Express 4, TypeScript |
| Auth | JSON Web Tokens (jsonwebtoken), bcryptjs |
| Storage | JSON file (production-swappable to DynamoDB/MongoDB) |
| Styling | Custom SCSS, DM Sans font, no UI kit dependency |
