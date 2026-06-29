# Azure Ubuntu VM deployment

Three-container stack built on the VM from this repository:

| Container | Image | Host port | Purpose |
|-----------|-------|-----------|---------|
| `ithina-mongo` | `mongo:7` | *(internal only)* | MongoDB for RBAC data |
| `ithina-api` | built from `user-management-api` | `3002` | User Management API |
| `ithina-smartsave` | built from `smartsave` | `8080` | Superadmin frontend (nginx) |

MongoDB is **not** published to the host. The API connects via the Docker network:

```text
MONGODB_URI=mongodb://mongo:27017/ithina-user-management
```

(`mongo` is the Compose service name.)

## Prerequisites

- Ubuntu 22.04+ Azure VM
- Inbound NSG rules: TCP **8080** (frontend), TCP **3002** (API)
- Git access to this repository

## 1. Prepare the VM (once)

```bash
git clone <your-repo-url> ~/ithina-rbac
cd ~/ithina-rbac
chmod +x deploy/scripts/setup-vm.sh deploy/scripts/deploy.sh
sudo deploy/scripts/setup-vm.sh
```

Log out and back in so your user is in the `docker` group.

## 2. Configure environment

```bash
cp deploy/.env.example deploy/.env
nano deploy/.env
```

Set at minimum:

| Variable | Example |
|----------|---------|
| `PUBLIC_HOST` | `20.123.45.67` or `app.example.com` |
| `JWT_SECRET` | 32+ character random string |
| `VITE_API_BASE_URL` | `http://20.123.45.67:3002` |
| `CORS_ORIGIN` | `http://20.123.45.67:8080` |

`deploy.sh` can auto-replace `YOUR_VM_PUBLIC_IP_OR_DOMAIN` when `PUBLIC_HOST` is set.

## 3. Build and deploy

From the **repository root**:

```bash
./deploy/scripts/deploy.sh --seed
```

This runs:

```bash
docker compose -f deploy/docker-compose.yml --env-file deploy/.env up -d --build
```

Images are built on the VM (no external registry required).

## 4. Verify

```bash
curl http://localhost:3002/health
curl -I http://localhost:8080/
docker compose -f deploy/docker-compose.yml ps
```

Open in a browser:

- **Superadmin login:** `http://<PUBLIC_HOST>:8080/superadmin/login`
- **Swagger:** `http://<PUBLIC_HOST>:3002/api/docs`

Demo logins (after `--seed`):

- Platform: `anjali@ithina.ai` / `SuperAdmin123!`
- Org/Tenant demos: `DemoAdmin123!`

## Common commands

```bash
# Rebuild after git pull
git pull
./deploy/scripts/deploy.sh

# Stop stack
./deploy/scripts/deploy.sh --down

# Logs
docker compose -f deploy/docker-compose.yml logs -f api
docker compose -f deploy/docker-compose.yml logs -f smartsave

# Re-seed without full rebuild
docker compose -f deploy/docker-compose.yml --env-file deploy/.env --profile seed run --rm seed

# Shell into API container
docker compose -f deploy/docker-compose.yml exec api sh
```

## Folder layout

```text
deploy/
  docker-compose.yml          # 3 services + optional seed profile
  .env.example                # copy to .env
  smartsave/
    Dockerfile                # Vite build + nginx
    nginx.conf
  user-management-api/
    Dockerfile                # Node production API
  scripts/
    setup-vm.sh               # install Docker on Ubuntu
    deploy.sh                 # build, up, optional seed
```

## Troubleshooting

**API cannot connect to MongoDB**

- Check mongo health: `docker compose -f deploy/docker-compose.yml ps`
- API logs: `docker logs ithina-api`
- URI must use hostname `mongo`, not `localhost`

**Frontend cannot reach API**

- `VITE_API_BASE_URL` is baked at **build** time — change `.env` and run `./deploy/scripts/deploy.sh` again
- Ensure NSG allows port 3002 from clients

**CORS errors**

- `CORS_ORIGIN` must exactly match the browser URL (scheme + host + port), e.g. `http://20.123.45.67:8080`
