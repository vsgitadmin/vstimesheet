# Vectorshades TSM — Frontend

Next.js frontend for the **Vectorshades Timesheet Management System (TSM)**. Provides the web UI for employees, managers, and administrators.

**Production URL:** https://tsm.vectorshades.com  
**PM2 process name:** `timesheet-interface`  
**Internal port:** 3000

For full deployment, network, and disaster recovery documentation, see the [Migration & Operations Guide](../migration-guide.md) at the repository root.

---

## Tech Stack

- Next.js 13.5 (Pages Router)
- React 18
- Redux Toolkit + redux-persist
- Material UI (MUI)
- Axios (REST API)
- Socket.IO client (real-time notifications and chat)
- AWS SDK (S3 API routes under `pages/api/s3/`)

**Node.js:** `>=18 <21` (see `engines` in `package.json`)

---

## Project Structure

| Path | Purpose |
|------|---------|
| `pages/` | Next.js routes and API routes |
| `pages/admin/dashboard/` | Admin and HR dashboards |
| `pages/api/s3/` | Server-side S3 helpers (presign, upload, delete) |
| `src/Components/` | React UI components |
| `src/Controllers/` | Client-side data/action helpers |
| `src/Constants/Servers/` | Backend URL and Socket.IO origin configuration |
| `src/Axios/` | Axios instance configuration |
| `src/Store/` | Redux store |

---

## Local Development

### Prerequisites

- Node.js 18.x – 20.x
- Running backend API (see `vectorshades-server-master/README.md`)
- `.env` file configured (see below)

### Setup

```bash
npm install
cp .env.example .env   # if an example exists; otherwise create .env manually
npm run dev
```

Open http://localhost:3000

### Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server (port 3000) |
| `npm run build` | Production build (required before `npm start`) |
| `npm start` | Start production server |
| `npm run lint` | Run ESLint |

---

## Environment Variables

Create a `.env` file in this directory. Do not commit it to source control.

| Variable | Description | Production example |
|----------|-------------|-------------------|
| `NEXT_PUBLIC_AXIOS_BASEURL` | Backend API base URL for Axios | `https://tsm.vectorshades.com/server/` |
| `NEXT_PUBLIC_BACKEND_URL` | Alternate backend URL (fallback) | Same as above |
| `BACKEND_URL` | Server-side backend URL fallback | Same as above |
| `NEXT_PUBLIC_SOCKET_ORIGIN` | Socket.IO server origin (no path suffix) | `https://tsm.vectorshades.com` |
| `AWS_ACCESS_KEY_ID` | AWS key for `pages/api/s3/*` routes | — |
| `AWS_SECRET_ACCESS_KEY` | AWS secret | — |
| `AWS_REGION` | S3 region | `ap-south-1` |
| `S3_BUCKET_NAME` | S3 bucket name | `timesheet2026` |

Backend URL resolution is defined in `src/Constants/Servers/index.js`. Socket.IO uses the origin only (not `/server/`) so connections hit the default namespace correctly.

---

## Network & Routing

In production, Nginx proxies public traffic to this app:

| Public path | Internal target |
|-------------|-----------------|
| `https://tsm.vectorshades.com/` | `http://localhost:3000` |

API requests go to the backend via `/server/` (not served by Next.js directly). Socket.IO connects to the site origin at `/socket.io/`, proxied to the backend on port 8000.

See [Network Settings](../migration-guide.md#3-network-settings) in the migration guide for the full Nginx configuration.

---

## Production Deployment

```bash
npm install
npm run build
npm start
```

**PM2 (recommended on the production server):**

```bash
cd /home/vsdevuser/timesheet/vectorshades-frontend-master
pm2 start npm --name timesheet-interface -- start
```

After code changes, rebuild before restarting:

```bash
npm run build && pm2 restart timesheet-interface
```

### Verification

- [ ] https://tsm.vectorshades.com loads
- [ ] Login works
- [ ] API calls succeed (check browser Network tab — requests to `/server/`)
- [ ] Real-time notifications connect (Socket.IO)
- [ ] `pm2 ls` shows `timesheet-interface` as online

---

## Related Services

| Service | Directory | Port |
|---------|-----------|------|
| Backend API | `../vectorshades-server-master/` | 8000 |
| File generation | `../filesSystem/` | 50000 |
| MongoDB | — | 27017 |
