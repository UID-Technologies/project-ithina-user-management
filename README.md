# Ithina RBAC — Superadmin Platform

Monorepo for the **Ithina Superadmin Console**: a multi-tenant RBAC governance UI backed by a Node.js API and MongoDB. Supports **platform**, **organization**, and **tenant** admin personas with scoped dashboards, navigation, and data access.

## Repository structure

```text
ithina-rbac/
├── smartsave/                 # Main frontend (React + Vite + TanStack Query) — port 8080
├── user-management-api/       # Backend API (Express + TypeScript + MongoDB) — port 3002
└── deploy/                    # Docker Compose + Azure VM deployment scripts
    ├── docker-compose.yml     # mongo + api + smartsave (3 containers)
    ├── .env.example
    ├── smartsave/Dockerfile
    ├── smartsave/nginx.conf
    ├── user-management-api/Dockerfile
    └── scripts/
        ├── setup-vm.sh        # Install Docker on Ubuntu
        └── deploy.sh          # Build & start stack on VM
```

| Project | Role | Default port |
|---------|------|--------------|
| **smartsave** | Superadmin UI (`/superadmin/*`) | `8080` |
| **user-management-api** | REST API, JWT auth, RBAC | `3002` |
| **MongoDB** | Persistent data store | `27017` (local / internal in Docker) |

## Features

- **Persona-based console** — Platform super admin, organization admin, and tenant admin see different dashboards, sidebar items, and scoped data.
- **Full RBAC modules** — Tenants, organization tree, users, roles & permissions, module access, guardrails, audit log.
- **Real API integration** — Frontend reads and writes through `smartsave/src/lib/api/*` hooks (no mock store in production paths).
- **Swagger** — Interactive API docs at `/api/docs`.
- **Seed & clean scripts** — Repeatable demo data for local dev and deployment.
- **Docker deployment** — Three-container stack for Azure Ubuntu VM with on-VM image builds.

## Architecture

```text
┌─────────────────────────────────────────────────────────────┐
│  Browser  →  smartsave (nginx / Vite dev)  :8080            │
│              /superadmin/login, /superadmin/*                 │
└──────────────────────────┬──────────────────────────────────┘
                           │ HTTP + JWT (Bearer)
                           ▼
┌─────────────────────────────────────────────────────────────┐
│  user-management-api  :3002                                 │
│  /api/v1/auth/*  ·  /api/v1/superadmin/*                    │
└──────────────────────────┬──────────────────────────────────┘
                           │ mongodb://…
                           ▼
┌─────────────────────────────────────────────────────────────┐
│  MongoDB  :27017  (ithina-user-management)                  │
└─────────────────────────────────────────────────────────────┘
```

## Prerequisites

- **Node.js** 20+ (local development)
- **MongoDB** 6+ (local development) or use Docker
- **npm** (both projects)
- **Docker + Compose plugin** (deployment only)

---

## Local development

### 1. Start MongoDB

Use a local MongoDB instance or Docker:

```bash
docker run -d --name ithina-mongo -p 27017:27017 mongo:7
```

### 2. Backend — user-management-api

```bash
cd user-management-api
cp .env.example .env
npm install
npm run seed          # load demo tenants, users, roles, audit, auth accounts
npm run dev           # http://localhost:3002
```

| Resource | URL |
|----------|-----|
| Health | http://localhost:3002/health |
| Swagger UI | http://localhost:3002/api/docs |
| OpenAPI JSON | http://localhost:3002/api/docs.json |

**Database scripts** (from `user-management-api/`):

| Command | Description |
|---------|-------------|
| `npm run seed` | Clear app collections and load demo data |
| `npm run clean` | Remove all application data |
| `npm run db:reset` | Clean + seed |
| `npm run seed:prod` | Seed using compiled JS (Docker / production) |

### 3. Frontend — smartsave

```bash
cd smartsave
cp .env.example .env
npm install
npm run dev           # http://localhost:8080
```

`.env` defaults:

```env
VITE_API_BASE_URL=http://localhost:3002
VITE_SUPERADMIN_EMAIL=anjali@ithina.ai
VITE_SUPERADMIN_PASSWORD=SuperAdmin123!
```

Open **http://localhost:8080/superadmin/login**

### Demo login accounts (after seed)

| Persona | Email | Password |
|---------|-------|----------|
| Platform super admin | `anjali@ithina.ai` | `SuperAdmin123!` |
| Organization admin (Buc-ee's) | `marcus.t@bucees.com` | `DemoAdmin123!` |
| Organization admin (Żabka) | `a.kowalski@zabka.pl` | `DemoAdmin123!` |
| Organization admin (SmartStore) | `priya@smartstore.io` | `DemoAdmin123!` |
| Tenant admin (Buc-ee's Texas) | `j.cole@bucees.com` | `DemoAdmin123!` |
| Tenant admin (Żabka) | `p.nowak@zabka.pl` | `DemoAdmin123!` |

Use **Quick sign-in** on the login page or enter credentials manually. Each persona redirects to a scoped workspace dashboard.

---

## Superadmin modules

| Route | Page | API wired |
|-------|------|-----------|
| `/superadmin/login` | Login + persona quick sign-in | `POST /auth/login`, `GET /auth/me` |
| `/superadmin` | Persona dashboard | Dashboard, tenants, users, audit, guardrails |
| `/superadmin/tenants` | Tenant management | Full CRUD |
| `/superadmin/organization` | Organization tree | Locations CRUD |
| `/superadmin/users` | User management | Full CRUD |
| `/superadmin/roles` | Roles & permission matrix | Roles CRUD + permissions |
| `/superadmin/modules` | Module access per tenant | Toggle / patch |
| `/superadmin/guardrails` | Guardrail rules | Full CRUD + 24h events |
| `/superadmin/audit` | Audit log | List + search + export |

### Persona access

| Section | Platform | Organization | Tenant |
|---------|----------|--------------|--------|
| Dashboard | ✓ | ✓ | ✓ |
| Tenants | ✓ | ✓ (own tenant) | — |
| Organization tree | ✓ | ✓ | ✓ (scoped) |
| Users | ✓ | ✓ | ✓ (scoped) |
| Roles | ✓ | ✓ | ✓ |
| Module access | ✓ | ✓ | — |
| Guardrails | ✓ | ✓ | — |
| Audit log | ✓ | ✓ | ✓ |

---

## API overview

Base URL: `http://localhost:3002` (local) or `http://<host>:3002` (deployed)

### Auth

```bash
curl -X POST http://localhost:3002/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"anjali@ithina.ai","password":"SuperAdmin123!"}'
```

All `/api/v1/superadmin/*` routes require `Authorization: Bearer <token>`.

### Main endpoint groups

| Group | Base path |
|-------|-----------|
| Auth | `/api/v1/auth` |
| Dashboard | `/api/v1/superadmin/dashboard` |
| Search | `/api/v1/superadmin/search` |
| Tenants | `/api/v1/superadmin/tenants` |
| Organizations | `/api/v1/superadmin/organizations` |
| Users | `/api/v1/superadmin/users` |
| Roles | `/api/v1/superadmin/roles` |
| Permissions | `/api/v1/superadmin/permissions` |
| Module access | `/api/v1/superadmin/module-access` |
| Guardrails | `/api/v1/superadmin/guardrails` |
| Audit | `/api/v1/superadmin/audit` |
| Approvals | `/api/v1/superadmin/approvals` |

Full endpoint reference, request shapes, and troubleshooting: **[user-management-api/README.md](user-management-api/README.md)**

Swagger (recommended): **http://localhost:3002/api/docs**

---

## Frontend API layer (smartsave)

```text
smartsave/src/
├── lib/api/           # HTTP client, auth, tenants, users, roles, …
├── hooks/             # TanStack Query hooks (useTenantsApi, useUsersApi, …)
├── contexts/          # SuperadminAuthProvider (JWT + persona session)
├── lib/superadminScope.ts   # Persona scoping + canAccess()
└── pages/superadmin/  # Console pages
```

Auth token is stored in `sessionStorage`. Sign out clears the token and returns to `/superadmin/login`.

---

## Environment variables

### user-management-api (`.env`)

| Variable | Default (local) | Description |
|----------|-----------------|-------------|
| `PORT` | `3002` | API listen port |
| `MONGODB_URI` | `mongodb://localhost:27017/ithina-user-management` | MongoDB connection |
| `JWT_SECRET` | — | Signing secret (min 16 chars) |
| `JWT_EXPIRES_IN` | `8h` | Token lifetime |
| `CORS_ORIGIN` | `http://localhost:8080` | Allowed frontend origin |
| `API_PUBLIC_URL` | `http://localhost:3002` | Public API URL for Swagger (use `http://` without TLS) |
| `SEED_ADMIN_EMAIL` | `anjali@ithina.ai` | Platform admin seed email |
| `SEED_ADMIN_PASSWORD` | `SuperAdmin123!` | Platform admin seed password |

### smartsave (`.env`)

| Variable | Default (local) | Description |
|----------|-----------------|-------------|
| `VITE_API_BASE_URL` | `http://localhost:3002` | API URL (baked at build time) |
| `VITE_SUPERADMIN_EMAIL` | `anjali@ithina.ai` | Quick sign-in default |
| `VITE_SUPERADMIN_PASSWORD` | `SuperAdmin123!` | Quick sign-in default |

### deploy (`.env` for Docker)

See **[deploy/.env.example](deploy/.env.example)** — includes `PUBLIC_HOST`, `JWT_SECRET`, `VITE_API_BASE_URL`, `CORS_ORIGIN`.

---

## Testing

```bash
cd user-management-api
npm test
```

Uses Jest + Supertest with in-memory MongoDB.

---

## Deployment (Azure Ubuntu VM)

Production deployment runs **three Docker containers** on an Ubuntu VM. Images are built on the VM from this repo (no container registry required). MongoDB stays on the internal Docker network:

```text
MONGODB_URI=mongodb://mongo:27017/ithina-user-management
```

Full deploy guide: **[deploy/README.md](deploy/README.md)**

### Quick deploy checklist

| Step | Action |
|------|--------|
| 1 | Open Azure NSG inbound rules for **TCP 8080** and **TCP 3002** |
| 2 | SSH into the VM |
| 3 | Clone this repository |
| 4 | Install Docker (once per VM) |
| 5 | Copy and edit `deploy/.env` |
| 6 | Run `./deploy/scripts/deploy.sh --seed` |
| 7 | Open the superadmin login URL in a browser |

### Deployment architecture

| Container | Image | Host port | Purpose |
|-----------|-------|-----------|---------|
| `ithina-mongo` | `mongo:7` | *(internal only)* | Database |
| `ithina-api` | Built from `user-management-api` | `3002` | REST API |
| `ithina-smartsave` | Built from `smartsave` | `8080` | Frontend (nginx) |

### Prerequisites

- **Azure VM** — Ubuntu 22.04+
- **Network** — Inbound NSG: **TCP 8080** (frontend), **TCP 3002** (API)
- **Access** — SSH key for the VM admin user (e.g. `ubuntu`)
- **Git** — Clone access to this repository

### Step 1 — Open network ports (Azure portal)

In the VM’s **Network Security Group**, add inbound rules:

| Priority | Port | Purpose |
|----------|------|---------|
| — | **8080** | SmartSave frontend |
| — | **3002** | User Management API |

### Step 2 — Connect to the VM

```bash
ssh ubuntu@<YOUR_VM_PUBLIC_IP>
```

Replace `<YOUR_VM_PUBLIC_IP>` with the VM’s public IP or DNS name.

### Step 3 — Clone the repository

```bash
git clone <your-repo-url> ~/ithina-rbac
cd ~/ithina-rbac
```

### Step 4 — Install Docker (once per VM)

```bash
chmod +x deploy/scripts/setup-vm.sh deploy/scripts/deploy.sh
sudo deploy/scripts/setup-vm.sh
```

Log out and back in (or run `newgrp docker`) so your user can run Docker without `sudo`.

### Step 5 — Configure environment

```bash
cp deploy/.env.example deploy/.env
nano deploy/.env
```

Set at minimum:

| Variable | Example | Notes |
|----------|---------|-------|
| `PUBLIC_HOST` | `20.123.45.67` | VM public IP or domain |
| `JWT_SECRET` | *(32+ random chars)* | Required; change from placeholder |
| `VITE_API_BASE_URL` | `http://20.123.45.67:3002` | Baked into frontend at **build** time |
| `CORS_ORIGIN` | `http://20.123.45.67:8080` | Must match the browser URL exactly |

If placeholders remain, `deploy.sh` replaces `YOUR_VM_PUBLIC_IP_OR_DOMAIN` with `PUBLIC_HOST` automatically.

### Step 6 — Build, start, and seed

From the **repository root**:

```bash
./deploy/scripts/deploy.sh --seed
```

This will:

1. Build Docker images for the API and frontend
2. Start `mongo`, `api`, and `smartsave` containers
3. Wait for the API health check
4. Load demo tenants, users, roles, and login accounts

Equivalent manual command (without seed):

```bash
docker compose -f deploy/docker-compose.yml --env-file deploy/.env up -d --build
```

Seed demo data later (if you skipped `--seed`):

```bash
docker compose -f deploy/docker-compose.yml --env-file deploy/.env --profile seed run --rm seed
```

### Step 7 — Verify deployment

On the VM:

```bash
curl http://localhost:3002/health
curl -I http://localhost:8080/
docker compose -f deploy/docker-compose.yml ps
```

From your machine (after NSG rules are open):

| Service | URL |
|---------|-----|
| Superadmin login | `http://<PUBLIC_HOST>:8080/superadmin/login` |
| API health | `http://<PUBLIC_HOST>:3002/health` |
| Swagger | `http://<PUBLIC_HOST>:3002/api/docs` |

Log in with a seeded account (see [Demo login accounts](#demo-login-accounts-after-seed)).

### Step 8 — Update after code changes

```bash
cd ~/ithina-rbac
git pull
./deploy/scripts/deploy.sh          # rebuild + restart
# or, if DB should be reset:
./deploy/scripts/deploy.sh --seed
```

### Deployment commands reference

```bash
# Full build + start + seed
./deploy/scripts/deploy.sh --seed

# Rebuild after git pull
git pull
./deploy/scripts/deploy.sh

# Stop all containers
./deploy/scripts/deploy.sh --down

# View logs
docker compose -f deploy/docker-compose.yml logs -f api
docker compose -f deploy/docker-compose.yml logs -f smartsave
docker compose -f deploy/docker-compose.yml logs -f mongo

# Re-seed database only
docker compose -f deploy/docker-compose.yml --env-file deploy/.env --profile seed run --rm seed

# Shell into API container
docker compose -f deploy/docker-compose.yml exec api sh

# Restart a single service
docker compose -f deploy/docker-compose.yml restart api
```

### Deployment troubleshooting

| Issue | Fix |
|-------|-----|
| API cannot reach MongoDB | URI must use hostname `mongo`, not `localhost`. Check `docker logs ithina-api` |
| Frontend cannot call API | Rebuild after changing `VITE_API_BASE_URL` in `deploy/.env`. Open NSG port 3002 |
| CORS errors | `CORS_ORIGIN` must exactly match browser URL, e.g. `http://20.123.45.67:8080` |
| Swagger blank / SSL errors | Use **http://** not **https://** when TLS is not configured. Rebuild API after fix (`./deploy/scripts/deploy.sh`) |
| Login fails after deploy | Run seed: `./deploy/scripts/deploy.sh --seed` or seed profile command above |

---

## License

MIT