# 🧱 DesignMint Medusa Monorepo Setup

This repository contains two separate projects:

- `admin/` - Medusa Admin Dashboard
- `storefront/` - Frontend Storefront UI

---

## 🚀 Quick Start

### Option 1: Manual Setup

#### Prerequisites
- Node.js (v18 or later)
- PostgreSQL database server
- Redis server

#### 🧰 1. Environment Setup

1. Copy environment template files:
   ```bash
   cp admin/.env.template admin/.env
   cp storefront/.env.template storefront/.env
   ```

2. Update the `.env` files with your PostgreSQL and Redis connection details:
   
   In `admin/.env`:
   ```
   DATABASE_URL=postgresql://postgres:postgres@localhost:5432/medusa-docker
   REDIS_URL=redis://localhost:6379
   ```

#### 🧰 2. Initial Setup

Run this once to install dependencies and build both projects:

```bash
npm run deploy
```

This command runs:
- `npm install --legacy-peer-deps` in both `admin/` and `storefront/`
- Builds both projects
- Runs database migrations for the admin

#### 3. Running the Projects

Open two separate terminals:

📦 **Terminal 1: Start Admin**
```bash
npm run start-admin
```

Admin will be available at:
http://localhost:9000

⚠️ **Important**: After the admin backend is running, you need to:
1. Go to Settings in the admin panel
2. Copy the publishable API key
3. Update the `NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY` in `storefront/.env`

🛍️ **Terminal 2: Start Storefront**
```bash
npm run start-storefront
```

Storefront will be available at:
http://localhost:8000
(Port may vary depending on config.)

> **Note**: If this setup seems too complex, consider using Option 2 (Docker setup) below which handles all dependencies automatically.

### Option 2: Docker Setup

Docker provides an easier way to set up the entire project with all dependencies.

#### Prerequisites
- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/)

#### 🐳 1. Docker Setup

Run this command to start all services with Docker:

```bash
docker compose up
```

This will:
- Set up PostgreSQL database
- Set up Redis
- Build and start the Medusa admin backend
- Build and start the storefront

#### 2. Accessing the Services

Once Docker Compose has finished startup:

- **Admin Dashboard**: http://localhost:9000
- **Storefront**: http://localhost:8000
- **PostgreSQL**: Available on `localhost:5432`
  - User: `postgres`
  - Password: `postgres`
  - Database: `medusa-docker`
- **Redis**: Available on `localhost:6379`

#### 3. Stopping the Services

To stop all services:

```bash
docker compose down
```

To stop and remove volumes (will delete database data):

```bash
docker compose down -v
```

---

## Scripts

| Script | Description |
|--------|-------------|
| `npm run deploy` | Installs and builds both admin & storefront |
| `npm run setup-admin` | Setup, install & build admin; run migrations |
| `npm run start-admin` | Starts admin server |
| `npm run setup-storefront` | Setup, install & build storefront |
| `npm run start-storefront` | Starts storefront server |

## Notes
- No background processes are used in this setup — run servers in separate terminals (when not using Docker).
- When using Docker, all services are managed automatically.
- The Docker setup includes persistent volumes for the database and node_modules.

## Contributing
Feel free to open issues or PRs if you'd like to improve or extend this setup!

## License

This Medusa starter is open source and available under the MIT License. See the [LICENSE](./LICENSE) file for more information.

### Important Licensing Notice

This starter includes the FrontendDesigner.jsx component in the admin interface which references or depends on the designmint designer, which is **not** open source. Users of this starter must separately obtain appropriate licensing for the designmint designer component. See the [NOTICE](./NOTICE) file for more details about third-party components.