# Vectorshades Timesheet Management (TSM) — Migration & Operations Guide

**Document Version:** 1.0  
**Date:** June 30, 2026  
**Production URL:** https://tsm.vectorshades.com  
**Repository root:** `/home/vsdevuser/timesheet`

---

## 1. Server Configuration

### 1.1 Hosting Environment

The Vectorshades Timesheet Management System (TSM) is hosted on **Amazon Web Services (AWS)** on a **Linux** server (EC2).

The application consists of three main deployable components plus supporting infrastructure:

| Component | Technology | Directory | Internal Port |
|-----------|------------|-----------|---------------|
| Frontend | Next.js 13 (React 18), Node.js | `vectorshades-frontend-master/` | 3000 |
| Backend API | Node.js / Express 4 | `vectorshades-server-master/` | 8000 |
| File Generation Service | Python 3.11 / Django 4.0 | `filesSystem/` | 50000 |

| Infrastructure | Technology | Purpose |
|----------------|------------|---------|
| Primary database | MongoDB 8.x | Application data (database: `test`) |
| Object storage | Amazon S3 (`ap-south-1`, bucket `timesheet2026`) | Uploads, reports, cloud files |
| Email | Microsoft Office 365 SMTP (`smtp.office365.com:587`) | Notifications and activation emails |
| Real-time messaging | Socket.IO (`/socket.io/`) | Live notifications and chat |
| Process manager | PM2 | Keeps all services running |

### 1.2 Application Components

**Frontend (`timesheet-interface`)**

- Next.js application providing the UI for employees, managers, and administrators.
- Communicates with the backend at `https://tsm.vectorshades.com/server/`.
- Socket.IO connects to `https://tsm.vectorshades.com` (configured via `NEXT_PUBLIC_SOCKET_ORIGIN`).
- PM2 process name: `timesheet-interface`
- Working directory: `vectorshades-frontend-master/`
- Commands: `npm run build` (deploy) → `npm start` (run)

**Backend (`timesheet-server`)**

- Express API server handling JWT authentication, business logic, file uploads, notifications, and scheduled tasks.
- API routes include `/auth`, `/employee`, `/management`, `/timesheet`, `/projects`, `/jobs`, `/rebar`, `/reports`, `/files`, `/cloud`, `/communication`, `/messaging`, `/billing`, `/trainings`, and others.
- Serves static uploads from `/public`.
- PM2 process name: `timesheet-server`
- Working directory: `vectorshades-server-master/`
- Start command: `npm start` (`node src/app.js`)

**File Generation Service (`files-processing`)**

- Django REST service for document generation.
- Primary endpoint: `POST /files/generate/activation`
- Called internally by the backend via `FILE_SERVER` (`http://127.0.0.1:50000/`).
- PM2 process name: `files-processing`
- Working directory: `filesSystem/`
- Start command: `python3 manage.py runserver 0.0.0.0:50000`

**MongoDB (`timesheet-mongodb`)**

- Managed locally via PM2 process name: `timesheet-mongodb`
- Listens on `127.0.0.1:27017` (internal only)

### 1.3 Scheduled Tasks

Scheduled jobs run inside the backend Node.js process while `timesheet-server` is active. They use the `cron` package and start automatically on application boot (timezone: **Asia/Kolkata** unless noted).

| Job | Schedule | Purpose |
|-----|----------|---------|
| Attendance processing | Daily 23:00 | Processes daily attendance records |
| Employee morning logs | Daily 13:00 UTC | Morning activity logs |
| Employee general logs | Daily 16:00 UTC | General activity logs |
| Employee second logs | Daily 21:00 UTC | Secondary activity logs |
| Task overdue notifications | Every 2 hours at :35 | Overdue task email/notification alerts |
| Work hours calculation | Daily 23:25 | Employee work-hour log generation |
| Dashboard hours aggregation | Daily 23:25 | Dashboard hour metrics |
| Performance review processing | Daily 23:25 | Employee performance reviews |
| Project updates | Daily 23:30 | Project status updates |
| Review request processing | Daily 23:40 | Pending review requests |
| Todo processing | Daily 23:45 | Employee todo items |

If the backend restarts, all cron jobs restart with it. Ensure PM2 auto-restart is enabled.

### 1.4 Environment Variables

Store credentials in `.env` files — never commit them to source control.

**Frontend** (`vectorshades-frontend-master/.env`):

| Variable | Purpose |
|----------|---------|
| `NEXT_PUBLIC_AXIOS_BASEURL` | API base URL (`https://tsm.vectorshades.com/server/`) |
| `NEXT_PUBLIC_SOCKET_ORIGIN` | Socket.IO origin (`https://tsm.vectorshades.com`) |
| `BACKEND_URL` | Alternate backend URL |
| `AWS_ACCESS_KEY_ID` | AWS credentials for S3 API routes |
| `AWS_SECRET_ACCESS_KEY` | AWS secret key |
| `AWS_REGION` | S3 region (`ap-south-1`) |
| `S3_BUCKET_NAME` | S3 bucket (`timesheet2026`) |

**Backend** (`vectorshades-server-master/.env`):

| Variable | Purpose |
|----------|---------|
| `PORT` | HTTP listen port (`8000`) |
| `MONGODBSRV` | MongoDB connection string |
| `JWT_SECRET` | JWT signing secret |
| `BACKEND_URL` | Public backend URL for emails/links |
| `FRONTEND_URL` | Public frontend URL for email templates |
| `FILE_SERVER` | Internal Django URL (`http://127.0.0.1:50000/`) |
| `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_REGION`, `BUCKET_NAME` | S3 configuration |
| `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASS` | Email configuration |
| `SMTP_FROM_NAME`, `SMTP_FROM_EMAIL` | Email sender details |

**File service** (`filesSystem/.env`):

| Variable | Purpose |
|----------|---------|
| `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_REGION`, `S3_BUCKET_NAME` | S3 configuration |

---

## 2. Deployment Process

### 2.1 Prerequisites

Before deployment, ensure the following are available:

- Linux server (AWS EC2)
- Node.js 18.x – 20.x (production currently runs Node 25.x via NVM)
- Python 3.11+ with virtual environment
- MongoDB 8.x
- Nginx with valid TLS certificate (Let's Encrypt)
- AWS S3 bucket `timesheet2026` in `ap-south-1`
- Office 365 SMTP credentials
- PM2 installed globally

### 2.2 Deployment Procedure

Deploy in the following order:

1. **Verify MongoDB is running**
   ```bash
   pm2 ls   # confirm timesheet-mongodb is online
   ```

2. **Configure environment variables** in `.env` files for frontend, backend, and file service.

3. **Install and build the backend**
   ```bash
   cd vectorshades-server-master
   npm install
   ```

4. **Install and build the frontend**
   ```bash
   cd vectorshades-frontend-master
   npm install
   npm run build
   ```

5. **Install the file generation service**
   ```bash
   cd filesSystem
   python3 -m venv venv && source venv/bin/activate
   pip install -r requirements.txt   # if available
   ```

6. **Start services with PM2** (in dependency order)
   ```bash
   # File generation service
   cd /home/vsdevuser/timesheet/filesSystem
   pm2 start bash --name files-processing -- -c "python3 manage.py runserver 0.0.0.0:50000"

   # Backend API
   cd /home/vsdevuser/timesheet/vectorshades-server-master
   pm2 start npm --name timesheet-server -- start

   # Frontend
   cd /home/vsdevuser/timesheet/vectorshades-frontend-master
   pm2 start npm --name timesheet-interface -- start
   ```

7. **Configure Nginx** (see Section 3) and reload:
   ```bash
   sudo nginx -t && sudo systemctl reload nginx
   ```

8. **Persist PM2 process list**
   ```bash
   pm2 save
   ```

9. **Verify** the application at `https://tsm.vectorshades.com`.

### 2.3 Updating an Existing Deployment

```bash
# Pull latest code
cd /home/vsdevuser/timesheet
git pull

# Backend
cd vectorshades-server-master && npm install && pm2 restart timesheet-server

# Frontend (rebuild required after code changes)
cd ../vectorshades-frontend-master && npm install && npm run build && pm2 restart timesheet-interface

# File service (if changed)
cd ../filesSystem && pm2 restart files-processing
```

### 2.4 Verification Checklist

After deployment, verify:

- [ ] Frontend loads at `https://tsm.vectorshades.com`
- [ ] Users can log in (JWT via `/server/auth`)
- [ ] Backend APIs respond (e.g. `/server/employee`, `/server/timesheet`)
- [ ] Socket.IO connects (real-time notifications)
- [ ] File uploads to S3 succeed
- [ ] Email notifications are sent
- [ ] Document generation works (activation documents)
- [ ] All PM2 processes are online: `pm2 ls`

Expected PM2 output:

| Process | Status |
|---------|--------|
| `timesheet-mongodb` | online |
| `timesheet-server` | online |
| `timesheet-interface` | online |
| `files-processing` | online |

---

## 3. Network Settings

### 3.1 Public Access

| Setting | Value |
|---------|-------|
| Production URL | `https://tsm.vectorshades.com` |
| HTTPS port | 443 |
| HTTP port | 80 (redirects to HTTPS) |
| API path | `/server/` → backend on port 8000 |
| WebSocket path | `/socket.io/` → backend on port 8000 |
| Frontend path | `/` → Next.js on port 3000 |

Only ports **80** and **443** are publicly accessible. All application services run on localhost and are reached through Nginx.

### 3.2 Internal Services

| Service | PM2 Name | Port | Access |
|---------|----------|------|--------|
| Next.js frontend | `timesheet-interface` | 3000 | Reverse-proxied only |
| Node.js backend | `timesheet-server` | 8000 | Reverse-proxied only |
| Django file service | `files-processing` | 50000 | Localhost only |
| MongoDB | `timesheet-mongodb` | 27017 | Localhost only |

### 3.3 External Services

| Service | Endpoint | Purpose |
|---------|----------|---------|
| Amazon S3 | `s3.ap-south-1.amazonaws.com` | File storage (bucket: `timesheet2026`) |
| Office 365 SMTP | `smtp.office365.com:587` (STARTTLS) | Transactional email |
| MongoDB | `127.0.0.1:27017` (local) or `*.mongodb.net` (Atlas) | Primary database |

### 3.4 AWS Security Group Recommendations

| Direction | Port | Source | Purpose |
|-----------|------|--------|---------|
| Inbound | 443 | 0.0.0.0/0 | HTTPS web access |
| Inbound | 80 | 0.0.0.0/0 | HTTP → HTTPS redirect |
| Inbound | 22 | Admin IP only | SSH administration |
| Outbound | All | 0.0.0.0/0 | S3, SMTP, external APIs |

Ports 3000, 8000, 50000, and 27017 must **not** be exposed publicly.

### 3.5 Nginx Configuration

The production reverse proxy is defined in `/etc/nginx/sites-available/default` (symlinked from `sites-enabled/default`).

WebSocket upgrade mapping is also included in `/etc/nginx/conf.d/websocket-upgrade-map.conf`.

**Full site configuration (`/etc/nginx/sites-available/default`):**

```nginx
map $http_upgrade $connection_upgrade {
    default upgrade;
    ''      close;
}


server {
    listen 80 default_server;
    listen [::]:80 default_server;
    root /var/www/html;
    index index.html index.htm;
    server_name _;
    location / {
        try_files $uri $uri/ =404;
    }
}

server {
    listen 443 ssl;
    listen [::]:443 ssl ipv6only=on;
    server_name tsm.vectorshades.com;

    ssl_certificate /etc/letsencrypt/live/tsm.vectorshades.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/tsm.vectorshades.com/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;


    location /socket.io/ {
        proxy_pass http://127.0.0.1:8000/socket.io/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection $connection_upgrade;
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_read_timeout 600s;
        proxy_buffering off;
    }

    # Backend API
    location /server/ {
        proxy_pass http://localhost:8000/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
    }

    # Frontend
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

server {
    listen 80;
    listen [::]:80;
    server_name tsm.vectorshades.com;

    if ($host = tsm.vectorshades.com) {
        return 301 https://$host$request_uri;
    }

    return 404;
}
```

**Routing summary:**

| Public URL | Proxied To | Service |
|------------|------------|---------|
| `https://tsm.vectorshades.com/` | `http://localhost:3000` | Next.js frontend |
| `https://tsm.vectorshades.com/server/*` | `http://localhost:8000/*` | Express backend API |
| `https://tsm.vectorshades.com/socket.io/*` | `http://127.0.0.1:8000/socket.io/*` | Socket.IO (WebSocket) |
| `http://tsm.vectorshades.com/*` | 301 redirect | → HTTPS |

**Nginx management commands:**

```bash
# Test configuration
sudo nginx -t

# Reload after changes
sudo systemctl reload nginx

# View error log
sudo tail -f /var/log/nginx/error.log
```

---

## 4. Database Configuration

### 4.1 Database

**MongoDB** is the primary database.

| Setting | Value |
|---------|-------|
| Engine | MongoDB 8.0.x |
| Database name | `test` |
| ODM | Mongoose 6.x |
| Connection variable | `MONGODBSRV` (backend `.env`) |
| Auth source | `test` |

It stores employee records, timesheets, projects, jobs, rebar data, reports, notifications, chat, cloud files, billing, training, and other data across **48 collections**.

A reference schema dump is available at `mongodb-dump/test/` in this repository.

The Django file service uses a separate **SQLite** database (`filesSystem/db.sqlite3`) for Django internals only.

### 4.2 Database Access

- The backend connects with a dedicated MongoDB application user.
- Connection string format:
  ```
  mongodb://[username]:[password]@127.0.0.1:27017/test?authSource=test
  ```
- Alternative Atlas connection (QA/cloud):
  ```
  mongodb+srv://[username]:[password]@[cluster].mongodb.net/?retryWrites=true&w=majority
  ```
- Credentials are in `vectorshades-server-master/.env` — never share or commit to source control.
- MongoDB should bind to `127.0.0.1` only in production.

**Backup:**

```bash
mongodump --uri="$MONGODBSRV" --out=/backup/mongodb/$(date +%Y%m%d)
```

**Restore:**

```bash
mongorestore --uri="$MONGODBSRV" --drop /backup/mongodb/YYYYMMDD/test/
```

---

## 5. Disaster Recovery Procedures

### 5.1 Service Recovery

If the application becomes unavailable or the server fails:

1. Provision or prepare a replacement Linux server on AWS.
2. Install prerequisites: Node.js, Python 3.11+, MongoDB 8.x, Nginx, PM2, Certbot.
3. Restore MongoDB from the most recent `mongodump` backup.
4. Clone application code from the Git repository to `/home/vsdevuser/timesheet`.
5. Restore `.env` files from secure storage.
6. Install dependencies and build the frontend (`npm install`, `npm run build`).
7. Restore the Nginx configuration (Section 3.5) and obtain/restore SSL certificates.
8. Start services with PM2 in order: `timesheet-mongodb` → `files-processing` → `timesheet-server` → `timesheet-interface`.
9. Run `pm2 save` to persist the process list.
10. Update DNS if the server IP changed.
11. Run the verification checklist (Section 2.4).

**Components requiring backup:**

| Component | Method | Frequency |
|-----------|--------|-----------|
| MongoDB (`test` database) | `mongodump` or Atlas snapshots | Daily |
| S3 bucket (`timesheet2026`) | S3 versioning / cross-region replication | Continuous |
| Backend `public/` uploads | Filesystem backup or S3 sync | Daily |
| `.env` configuration files | Encrypted secure store | On change |
| Nginx config (`/etc/nginx/sites-available/default`) | Copy to secure store | On change |
| SSL certificates (`/etc/letsencrypt/`) | Certbot auto-renewal | Automatic |
| Source code | Git remote repository | Continuous |

### 5.2 Health Check

After restarting services:

```bash
# Confirm all PM2 processes are running
pm2 ls

# Check MongoDB connectivity
mongosh --eval "db.serverStatus().ok"

# Test Nginx configuration
sudo nginx -t

# View recent backend logs
pm2 logs timesheet-server --lines 50
```

Manual verification:

- Frontend accessible at `https://tsm.vectorshades.com`
- Users can log in
- File uploads work (S3)
- Email notifications send (SMTP)
- Activation document generation works (backend → Django)
- Backend logs show `DB connection successful`
- Cron jobs produce `CRON` log entries after scheduled times

### 5.3 Monitoring

Monitor regularly to ensure:

- All PM2 processes are online (`timesheet-mongodb`, `timesheet-server`, `timesheet-interface`, `files-processing`)
- MongoDB is available and disk usage is acceptable
- The website is accessible at `https://tsm.vectorshades.com`
- Nginx is running (`sudo systemctl status nginx`)
- SSL certificate is valid (`sudo certbot certificates`)
- Scheduled background jobs continue to execute
- S3 uploads and SMTP delivery are functioning

Investigate any issues promptly to minimize service interruption.

---

## 6. Quick Reference

```bash
# Service status
pm2 ls

# Restart all application services
pm2 restart timesheet-server timesheet-interface files-processing

# View logs
pm2 logs timesheet-server
pm2 logs timesheet-interface
pm2 logs files-processing

# Nginx
sudo nginx -t && sudo systemctl reload nginx

# MongoDB backup
mongodump --uri="$MONGODBSRV" --out=/backup/mongodb/$(date +%Y%m%d)
```
