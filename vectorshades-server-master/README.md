# Vectorshades TSM — Backend API

Node.js / Express backend for the **Vectorshades Timesheet Management System (TSM)**. Handles authentication, business logic, REST APIs, file uploads, email notifications, scheduled jobs, and Socket.IO real-time messaging.

**Production URL:** https://tsm.vectorshades.com/server/  
**PM2 process name:** `timesheet-server`  
**Internal port:** 8000 (default in development: 50000)

For full deployment, network, database, and disaster recovery documentation, see the [Migration & Operations Guide](../migration-guide.md) at the repository root.

---

## Tech Stack

- Node.js / Express 4
- MongoDB via Mongoose 6
- JWT authentication
- Socket.IO 4 (path: `/socket.io/`)
- AWS SDK (S3 uploads and presigned URLs)
- Nodemailer (Office 365 SMTP)
- `cron` package (in-process scheduled jobs)

---

## Project Structure

| Path | Purpose |
|------|---------|
| `src/app.js` | Application entry point |
| `src/Routes/` | Express route definitions |
| `src/Controllers/` | Request handlers |
| `src/Controllers/ControllerFunction/` | Business logic |
| `src/Models/` | Mongoose schemas |
| `src/Middlewares/` | Auth, role checks, response formatting |
| `src/Cron/` | Scheduled job definitions |
| `src/Helpers/Functions/` | Email, S3, encryption, cron helpers |
| `src/Config/Database/DbConnection.js` | MongoDB connection |
| `config.js` | Shared config exports |
| `public/` | Static file uploads served at `/public` |

---

## API Routes

Routes are mounted at the application root. In production, Nginx exposes them under `/server/`.

| Path | Module |
|------|--------|
| `/auth` | Authentication (login, JWT) |
| `/employee` | Employee management |
| `/management` | HR / admin management |
| `/timesheet` | Timesheet operations |
| `/projects` | Project management |
| `/jobs` | Job management |
| `/rebar` | Rebar job workflows |
| `/reports` | Reporting |
| `/files` | File upload and download |
| `/cloud` | Cloud file storage |
| `/communication` | Email and notifications |
| `/messaging` | Chat / messaging |
| `/billing` | Billing |
| `/trainings` | LMS / training |
| `/review` | Performance reviews |
| `/filters`, `/constants`, `/config`, `/notice` | Supporting modules |
| `/public` | Public test endpoints (e.g. SMTP test) |

**Socket.IO:** `wss://tsm.vectorshades.com/socket.io/` (proxied to this server)

---

## Local Development

### Prerequisites

- Node.js 18.x – 20.x
- MongoDB running locally or Atlas connection string
- `.env` file configured (see below)
- File generation service running for document features (see `../filesSystem/README.md`)

### Setup

```bash
npm install
# Create vectorshades-server-master/.env with required variables
npm run dev
```

The server starts on `PORT` from `.env` (default `50000`). On successful DB connection you should see:

```
DB connection successfull
server running on port <PORT>
```

### Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start with nodemon (auto-reload) |
| `npm start` | Start production server (`node src/app.js`) |

---

## Environment Variables

Create a `.env` file in this directory. Do not commit it to source control.

| Variable | Description |
|----------|-------------|
| `PORT` | HTTP listen port (`8000` in production) |
| `MONGODBSRV` | MongoDB connection string (required) |
| `JWT_SECRET` | Secret for signing JWT tokens |
| `BACKEND_URL` | Public backend URL used in emails and links |
| `FRONTEND_URL` | Public frontend URL used in email templates |
| `FILE_SERVER` | Internal Django file service URL (`http://127.0.0.1:50000/`) |
| `AWS_ACCESS_KEY_ID` | AWS access key |
| `AWS_SECRET_ACCESS_KEY` | AWS secret key |
| `AWS_REGION` | S3 region (`ap-south-1`) |
| `BUCKET_NAME` | S3 bucket (`timesheet2026`) |
| `SMTP_HOST` | SMTP host (`smtp.office365.com`) |
| `SMTP_PORT` | SMTP port (`587`) |
| `SMTP_SECURE` | TLS mode (`false` for STARTTLS on 587) |
| `SMTP_USER` | SMTP username |
| `SMTP_PASS` | SMTP password |
| `SMTP_FROM_NAME` | Email sender display name |
| `SMTP_FROM_EMAIL` | Email sender address |
| `EMAIL_DEBUG` | Enable SMTP debug logging (`false` in production) |

---

## Scheduled Tasks

Cron jobs start automatically when the server boots (timezone: **Asia/Kolkata** unless noted). They run in-process — if the server restarts, jobs restart with it.

| Job | Schedule | Purpose |
|-----|----------|---------|
| Attendance | Daily 23:00 | Attendance processing |
| Employee morning logs | Daily 13:00 UTC | Morning activity logs |
| Employee general logs | Daily 16:00 UTC | General activity logs |
| Employee second logs | Daily 21:00 UTC | Secondary activity logs |
| Task overdue | Every 2h at :35 | Overdue task notifications |
| Work hours | Daily 23:25 | Work-hour log generation |
| Dashboard hours | Daily 23:25 | Dashboard metrics |
| Performance review | Daily 23:25 | Review processing |
| Project updates | Daily 23:30 | Project status updates |
| Review requests | Daily 23:40 | Review request processing |
| Todos | Daily 23:45 | Todo processing |

Cron definitions live in `src/Cron/`.

---

## Network & Routing

In production, Nginx proxies API and WebSocket traffic to this server:

| Public path | Internal target |
|-------------|-----------------|
| `https://tsm.vectorshades.com/server/*` | `http://localhost:8000/*` |
| `https://tsm.vectorshades.com/socket.io/*` | `http://127.0.0.1:8000/socket.io/*` |

The file generation service is called internally at `FILE_SERVER` (not exposed publicly).

See [Network Settings](../migration-guide.md#3-network-settings) in the migration guide for the full Nginx configuration.

---

## Production Deployment

```bash
npm install
npm start
```

**PM2 (recommended on the production server):**

```bash
cd /home/vsdevuser/timesheet/vectorshades-server-master
pm2 start npm --name timesheet-server -- start
```

Restart after code or `.env` changes:

```bash
pm2 restart timesheet-server
```

### Verification

- [ ] Console shows `DB connection successful`
- [ ] `https://tsm.vectorshades.com/server/auth` responds
- [ ] Socket.IO connects from the frontend
- [ ] File uploads reach S3
- [ ] Email notifications send
- [ ] `pm2 ls` shows `timesheet-server` as online

---

## Database

MongoDB is the primary data store (database name: `test`). Connection is configured via `MONGODBSRV` in `.env`.

See [Database Configuration](../migration-guide.md#4-database-configuration) in the migration guide for backup and restore procedures.

---

## Related Services

| Service | Directory | Port |
|---------|-----------|------|
| Frontend | `../vectorshades-frontend-master/` | 3000 |
| File generation | `../filesSystem/` | 50000 |
| MongoDB | — | 27017 |
