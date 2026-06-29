# User Management API

Enterprise backend for the **Ithina Superadmin Console** (`http://localhost:8080/superadmin`).

Built with Node.js, Express, TypeScript (strict), MongoDB/Mongoose, JWT auth, RBAC, Zod validation, Pino logging, Swagger, Jest and Supertest.

## Prerequisites

- Node.js 18+
- MongoDB 6+ running locally (default: `mongodb://localhost:27017/ithina-user-management`)

## Quick start

```bash
cd user-management-api
cp .env.example .env
npm install
npm run seed
npm run dev
```

| Resource | URL |
|----------|-----|
| API base | `http://localhost:3002` |
| Health | `http://localhost:3002/health` |
| Swagger UI | `http://localhost:3002/api/docs` |
| OpenAPI JSON | `http://localhost:3002/api/docs.json` |

### Default super admin credentials (after seed)

| Field    | Value              |
|----------|--------------------|
| Email    | `anjali@ithina.ai` |
| Password | `SuperAdmin123!`   |

### Environment variables

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `3002` | HTTP listen port |
| `MONGODB_URI` | — | MongoDB connection string |
| `JWT_SECRET` | — | Signing secret (min 16 chars) |
| `JWT_EXPIRES_IN` | `8h` | Token lifetime |
| `CORS_ORIGIN` | `http://localhost:8080` | Allowed frontend origin |
| `SEED_ADMIN_EMAIL` | `anjali@ithina.ai` | Seed superadmin email |
| `SEED_ADMIN_PASSWORD` | `SuperAdmin123!` | Seed superadmin password |

## Architecture

```
user-management-api/
├── src/
│   ├── main.ts                    # Bootstrap entry
│   ├── app.ts                     # Express wiring
│   ├── config/                    # env, database, cors, swagger, logger
│   ├── common/                    # constants, enums, errors, middlewares, utils, validators
│   ├── infrastructure/            # database, logging, cache, queue, email, storage
│   ├── modules/                   # auth, tenants, users, roles, permissions, …
│   ├── shared/                    # responses, pagination, filters
│   ├── jobs/                      # background jobs
│   ├── seed/                      # seed data + runner
│   └── docs/                      # openapi.yaml
├── tests/                         # unit, integration, e2e
├── scripts/                       # seed.ts, create-indexes.ts
├── logs/
├── Dockerfile
└── docker-compose.yml
```

Each module contains: `model`, `types`, `schema`, `repository`, `service`, `controller`, `routes`.

## Authentication

All `/api/v1/superadmin/*` routes require:

1. **`Authorization: Bearer <JWT>`** from `POST /api/v1/auth/login`
2. **Super Admin role** — `r-super` or `r-platform`

```bash
curl -X POST http://localhost:3002/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"anjali@ithina.ai","password":"SuperAdmin123!"}'
```

## Standard response format

```json
{
  "success": true,
  "message": "Tenants retrieved",
  "data": [],
  "meta": { "page": 1, "limit": 20, "total": 7 }
}
```

List endpoints return items in `data` (array) and pagination in `meta`. Entity `id` fields use external IDs (e.g. `t-zabka`, `u-1`, `r-super`) and map directly to the frontend.

Errors return `{ "success": false, "message": "...", "errors": [...] }` with appropriate HTTP status.

## API endpoints

### Auth

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/api/v1/auth/login` | — | Login; returns `{ accessToken, expiresIn, user }` |
| GET | `/api/v1/auth/me` | JWT | Current user profile |

### Dashboard

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/v1/superadmin/dashboard/summary` | Platform KPIs (includes aliases `totalUsers`, `totalStores`, `monthlyRevenue`, `guardrailsTriggered24h`) |
| GET | `/api/v1/superadmin/dashboard/top-tenants` | Top 5 tenants by users |
| GET | `/api/v1/superadmin/dashboard/recent-activity` | Latest audit entries |
| GET | `/api/v1/superadmin/dashboard/platform-health` | Service health status |

### Search

| Method | Path | Query | Description |
|--------|------|-------|-------------|
| GET | `/api/v1/superadmin/search` | `q` | Global search — tenants, users, roles (5 each) |

### Tenants — CRUD

Base: `/api/v1/superadmin/tenants`

| Method | Path | Query / body |
|--------|------|--------------|
| GET | `/` | `?search=&tier=&status=&page=&limit=` |
| GET | `/:id` | — |
| POST | `/` | Create tenant body |
| PUT | `/:id` | Partial update |
| DELETE | `/:id` | Cascades locations, users, module access |

### Organizations

Base: `/api/v1/superadmin/organizations`

| Method | Path | Description |
|--------|------|-------------|
| GET | `/?tenantId=` | Flat location list |
| GET | `/tree?tenantId=` | Nested org hierarchy |
| GET | `/:id` | Single location |
| POST | `/` | Create location |
| PUT | `/:id` | Update location |
| DELETE | `/:id` | Delete (cascades children) |

### Users — CRUD

Base: `/api/v1/superadmin/users`

| Method | Path | Query / body |
|--------|------|--------------|
| GET | `/` | `?search=&tenantId=&status=&page=&limit=` |
| GET | `/:id` | — |
| POST | `/` | `{ name, email, tenantId, roleIds?, locationIds?, status?, mfaEnabled? }` |
| PUT | `/:id` | Partial update |
| DELETE | `/:id` | — |

### Roles — CRUD

Base: `/api/v1/superadmin/roles`

| Method | Path | Query / body |
|--------|------|--------------|
| GET | `/` | `?type=Platform\|Tenant&tenantId=&page=&limit=` |
| GET | `/:id` | — |
| POST | `/` | `{ name, type, description?, isCustom?, inheritsFrom?, tenantId?, permissionIds? }` |
| PUT | `/:id` | Partial update |
| DELETE | `/:id` | Unassigns role from all users, then deletes |

`RoleDto` omits `permissionIds`; use the role-map endpoint for permission assignments.

### Permissions

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/v1/superadmin/permissions` | Permission catalog (`?module=&page=&limit=`) |
| GET | `/api/v1/superadmin/permissions/role-map` | `Record<roleId, permissionIds[]>` |

### Module access

Base: `/api/v1/superadmin/module-access`

| Method | Path | Body | Description |
|--------|------|------|-------------|
| GET | `/modules` | — | Module catalog |
| GET | `/` | — | All tenant module access rows |
| GET | `/:tenantId` | — | Single tenant access (falls back to tenant.modules) |
| PATCH | `/:tenantId/toggle` | `{ module, enabled }` | Enable/disable one module |
| PATCH | `/:tenantId` | `{ enabledModules: [] }` | Replace full enabled set |

Toggle and patch sync both `TenantModuleAccess` and the tenant document's `modules` field.

### Guardrails

Base: `/api/v1/superadmin/guardrails`

| Method | Path | Query / body |
|--------|------|--------------|
| GET | `/rules` | `?page=&limit=` |
| GET | `/rules/:id` | — |
| POST | `/rules` | Create rule (returns 201) |
| PUT | `/rules/:id` | Partial update |
| DELETE | `/rules/:id` | — |
| GET | `/events` | `?tenantId=&hours=&page=&limit=` |

Events are read-only. `hours=24` powers the dashboard and guardrails "triggered (24h)" stat.

### Approvals

| Method | Path | Query |
|--------|------|-------|
| GET | `/api/v1/superadmin/approvals` | `?status=&tenantId=&page=&limit=` |

Read-only list of pending/completed approval requests.

### Audit

| Method | Path | Query |
|--------|------|-------|
| GET | `/api/v1/superadmin/audit` | `?search=&tenant=&result=&actor=&page=&limit=` |

`search` matches actor, action, resource, or tenant (case-insensitive).

## Dashboard seed metrics

After `npm run seed`, the dashboard summary matches the Superadmin UI:

- **Active tenants:** 5 / 7 (2 trial, 1 suspended)
- **Platform users:** 8,438
- **Stores under management:** 10,084
- **MRR:** $308,100
- **Pending approvals:** 7
- **Guardrails fired (24h):** 23
- **Custom roles:** 1 of 15
- **Modules deployed:** 6

Featured tenants: Żabka Group, Infomil Retail, Buc-ee's, GreenLeaf Markets, SmartStore Demo.

## Frontend integration (`smartsave-dd`)

The frontend lives in `../smartsave-dd` and runs on port **8080**. It uses TanStack Query, a shared API client, and auto-login via `SuperadminAuthProvider`.

### Setup

```bash
cd smartsave-dd
cp .env.example .env   # optional — defaults work for local dev
npm install
npm run dev
```

`.env` values:

```env
VITE_API_BASE_URL=http://localhost:3002
VITE_SUPERADMIN_EMAIL=anjali@ithina.ai
VITE_SUPERADMIN_PASSWORD=SuperAdmin123!
```

### Frontend API layer

```
smartsave-dd/src/
├── lib/api/
│   ├── client.ts          # fetch wrapper, JWT in sessionStorage
│   ├── auth.ts            # login, /me
│   ├── tenants.ts
│   ├── users.ts
│   ├── roles.ts
│   ├── permissions.ts
│   ├── organizations.ts
│   ├── module-access.ts
│   └── guardrails.ts
├── hooks/
│   ├── useTenantsApi.ts
│   ├── useUsersApi.ts
│   ├── useRolesApi.ts
│   ├── useModuleAccessApi.ts
│   └── useGuardrailsApi.ts
└── contexts/
    └── SuperadminAuthProvider.tsx
```

Auth flow: on entering `/superadmin/*`, the provider calls `POST /auth/login` (unless a token exists in `sessionStorage`), then `GET /auth/me` for the header profile.

### Integration status

| Frontend page | Route | Backend wired | Notes |
|---------------|-------|---------------|-------|
| **Tenants** | `/superadmin/tenants` | Yes | Full CRUD, search, tier filter |
| **Users** | `/superadmin/users` | Yes | CRUD, search, tenant filter; locations from org API |
| **Roles & permissions** | `/superadmin/roles` | Yes | Role CRUD; permissions + role-map for matrix |
| **Module access** | `/superadmin/modules` | Yes | Catalog + per-tenant toggle |
| **Guardrails** | `/superadmin/guardrails` | Yes | Rule CRUD, status toggle, 24h event count |
| **Dashboard** | `/superadmin` | No | Still uses static `superadminData.ts` |
| **Organization tree** | `/superadmin/organization` | No | Still uses `useSuperadminStore` mock |
| **Audit log** | `/superadmin/audit` | No | Still uses mock store |
| **Layout search** | Header input | No | Not wired to `/search` yet |

Remaining pages can follow the same pattern: add `lib/api/*.ts`, React Query hooks, and replace `useSuperadminStore` calls.

## Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start dev server with hot reload (`tsx watch src/main.ts`) |
| `npm run build` | Compile TypeScript to `dist/` |
| `npm start` | Run compiled server |
| `npm run seed` | Seed MongoDB with demo data |
| `npm run indexes` | Sync MongoDB indexes |
| `npm test` | Run Jest integration tests |
| `npm run lint` | Type-check without emit |

### Docker

```bash
docker compose up --build
```

Maps host port **3002** → container **3002**. MongoDB on **27017**.

## Testing

```bash
npm test
```

Uses Jest + Supertest with an in-memory MongoDB instance. Integration tests live in `tests/integration/`.

## Troubleshooting

**`EADDRINUSE` on port 3002** — a previous dev server is still running:

```powershell
netstat -ano | findstr :3002
taskkill /PID <PID> /F
npm run dev
```

**Login returns 400 from frontend** — ensure TanStack Query uses `queryFn: () => login()`, not `queryFn: login` (Query passes its context as the first argument).

**401 on superadmin routes** — run `npm run seed`, confirm JWT is sent as `Authorization: Bearer <token>`, and the user has role `r-super` or `r-platform`.

**CORS errors** — set `CORS_ORIGIN=http://localhost:8080` in `.env` to match the Vite dev server.
