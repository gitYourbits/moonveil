# Finagen – End-to-End Deployment on Google Compute Engine (GCE)

This deploys the full stack on GCE:
- Backend: Django + DRF (Gunicorn) behind Nginx
- DB: Cloud SQL for PostgreSQL (recommended) or self-hosted PostgreSQL
- Frontend: Vite/React static build served by Nginx
- TLS: Let’s Encrypt (Certbot)

You’ll get:
- api.yourdomain.com → Django API (HTTPS)
- app.yourdomain.com → Frontend SPA (HTTPS)


## 1) Prerequisites
- Google Cloud project with billing enabled, `gcloud` CLI installed and authenticated
- A domain with DNS you can edit (Cloud DNS or your registrar)
- Repo layout:
  - `backend/` (Django app with `manage.py`)
  - `frontend/` (Vite React app)


## 2) Cloud SQL for PostgreSQL (recommended)
Create a small instance (adjust region/tiers):
```bash
# Create instance
gcloud sql instances create finagen-sql \
  --database-version=POSTGRES_15 \
  --tier=db-f1-micro \
  --region=us-central1

# Create DB + user
gcloud sql databases create finagen --instance=finagen-sql

gcloud sql users create finagen \
  --instance=finagen-sql \
  --password="REPLACE_ME_STRONG_PWD"

# Get instance public IP
gcloud sql instances describe finagen-sql \
  --format='value(ipAddresses.ipAddress)'
```
After the VM is created (next step), authorize its external IP to Cloud SQL:
```bash
gcloud sql instances patch finagen-sql \
  --authorized-networks="<VM_EXTERNAL_IP>/32"
```
Note: For production, prefer Private IP or Cloud SQL Auth Proxy.


## 3) Create a GCE VM
```bash
gcloud compute instances create finagen-vm \
  --zone=us-central1-a \
  --machine-type=e2-medium \
  --image-family=ubuntu-2204-lts \
  --image-project=ubuntu-os-cloud \
  --tags=http-server,https-server

# Ensure firewall rules exist (one-time if not already present)
gcloud compute firewall-rules create allow-http \
  --allow=tcp:80 --target-tags=http-server

gcloud compute firewall-rules create allow-https \
  --allow=tcp:443 --target-tags=https-server

# SSH to the VM
gcloud compute ssh finagen-vm --zone=us-central1-a
```


## 4) VM OS setup
```bash
# Update, base packages
sudo apt-get update -y && sudo apt-get upgrade -y
sudo apt-get install -y python3-pip python3-venv build-essential nginx git ufw certbot python3-certbot-nginx

# Optional firewall
autopass=$(echo y) || true
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
echo y | sudo ufw enable || true

# Create deploy dirs
sudo mkdir -p /opt/finagen/backend /opt/finagen/frontend
sudo chown -R $USER:$USER /opt/finagen
```


## 5) Deploy backend (Django)
Copy code to VM (git or scp):
```bash
cd /opt/finagen
# Example (adjust to your repo/flow):
# git clone <YOUR_REPO_URL> .
# or locally: scp -r backend frontend <user>@<vm_ip>:/opt/finagen/
```
Create venv and install deps:
```bash
cd /opt/finagen/backend
python3 -m venv .venv
source .venv/bin/activate
pip install --upgrade pip setuptools wheel
pip install -r requirements.txt
```
Set backend env (`/etc/finagen-backend.env`) for python-decouple:
```bash
sudo tee /etc/finagen-backend.env >/dev/null << 'EOF'
DJANGO_SECRET_KEY=REPLACE_ME
DJANGO_DEBUG=False
DJANGO_ALLOWED_HOSTS=api.yourdomain.com

# Database (Cloud SQL)
POSTGRES_ENABLED=True
POSTGRES_DB=finagen
POSTGRES_USER=finagen
POSTGRES_PASSWORD=REPLACE_ME_STRONG_PWD
POSTGRES_HOST=<CLOUD_SQL_PUBLIC_IP>
POSTGRES_PORT=5432

# CORS/CSRF
CORS_ALLOW_ALL=False
CORS_ALLOWED_ORIGINS=https://app.yourdomain.com
CSRF_TRUSTED_ORIGINS=https://app.yourdomain.com

# JWT lifetimes (optional)
JWT_ACCESS_MIN=60
JWT_REFRESH_DAYS=30
EOF
```
Migrate and create superuser:
```bash
source /opt/finagen/backend/.venv/bin/activate
cd /opt/finagen/backend
python manage.py migrate
python manage.py createsuperuser
```
Create Gunicorn systemd unit:
```bash
sudo tee /etc/systemd/system/finagen-backend.service >/dev/null << 'EOF'
[Unit]
Description=Finagen Django Backend (Gunicorn)
After=network.target

[Service]
User=www-data
Group=www-data
WorkingDirectory=/opt/finagen/backend
EnvironmentFile=/etc/finagen-backend.env
ExecStart=/opt/finagen/backend/.venv/bin/gunicorn finagen.wsgi:application \
  --bind 127.0.0.1:8001 \
  --workers 3 \
  --timeout 60
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
EOF

sudo systemctl daemon-reload
sudo systemctl enable finagen-backend
sudo systemctl start finagen-backend
sudo systemctl status finagen-backend --no-pager
```


## 6) Build + upload frontend
On your machine:
```bash
cd frontend
# Set API base URL for prod
# PowerShell (Windows): $env:VITE_API_BASE_URL="https://api.yourdomain.com"
# macOS/Linux: export VITE_API_BASE_URL="https://api.yourdomain.com"
npm install
npm run build
```
Upload `dist` to VM:
```bash
scp -r frontend/dist <user>@<vm_ip>:/opt/finagen/frontend/
```


## 7) Nginx sites (reverse proxy + static)
Backend at api.yourdomain.com → 127.0.0.1:8001, Frontend at app.yourdomain.com → /opt/finagen/frontend/dist
```bash
# Backend
sudo tee /etc/nginx/sites-available/finagen-api >/dev/null << 'EOF'
server {
    listen 80;
    server_name api.yourdomain.com;

    client_max_body_size 20m;

    location / {
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_pass http://127.0.0.1:8001;
    }
}
EOF

# Frontend
sudo tee /etc/nginx/sites-available/finagen-app >/dev/null << 'EOF'
server {
    listen 80;
    server_name app.yourdomain.com;

    root /opt/finagen/frontend/dist;
    index index.html;

    location / {
        try_files $uri /index.html;
    }
}
EOF

sudo ln -s /etc/nginx/sites-available/finagen-api /etc/nginx/sites-enabled/
sudo ln -s /etc/nginx/sites-available/finagen-app /etc/nginx/sites-enabled/

sudo nginx -t && sudo systemctl reload nginx
```


## 8) DNS + TLS (HTTPS)
- Create A records in your DNS pointing to the VM IP:
  - `api.yourdomain.com` → <VM_IP>
  - `app.yourdomain.com` → <VM_IP>
- Issue TLS certs:
```bash
sudo certbot --nginx -d api.yourdomain.com -d app.yourdomain.com \
  --redirect --agree-tos -m admin@yourdomain.com
```


## 9) Environment alignment
Backend (`/etc/finagen-backend.env`):
- `DJANGO_SECRET_KEY`: strong secret
- `DJANGO_DEBUG`: False
- `DJANGO_ALLOWED_HOSTS`: `api.yourdomain.com`
- `POSTGRES_*`: match Cloud SQL
- `CORS_ALLOWED_ORIGINS`/`CSRF_TRUSTED_ORIGINS`: `https://app.yourdomain.com`

Frontend build env:
- `VITE_API_BASE_URL`: `https://api.yourdomain.com`


## 10) Single-domain option (/api)
If you prefer one domain (e.g., `app.yourdomain.com`) and proxy `/api` to backend, use:
```nginx
server {
    listen 80;
    server_name app.yourdomain.com;

    root /opt/finagen/frontend/dist;
    index index.html;

    location /api/ {
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_pass http://127.0.0.1:8001/api/;
    }

    location / {
        try_files $uri /index.html;
    }
}
```
Then set `VITE_API_BASE_URL=https://app.yourdomain.com` and update CORS/CSRF/ALLOWED_HOSTS accordingly.


## 11) Updates (manual zero-downtime)
Backend:
```bash
cd /opt/finagen/backend
# sync code (git pull / rsync)
source .venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
sudo systemctl restart finagen-backend
```
Frontend:
```bash
# build locally, upload dist to /opt/finagen/frontend/dist
sudo systemctl reload nginx
```


## 12) Logs, monitoring, backups
- Backend logs: `journalctl -u finagen-backend -f`
- Nginx logs: `/var/log/nginx/`
- Cloud SQL backups: enable in instance settings
- VM snapshots: Compute Engine → Disks


## 13) Self-hosted PostgreSQL (alternative)
```bash
sudo apt-get install -y postgresql postgresql-contrib
sudo -u postgres psql -c "CREATE DATABASE finagen;"
sudo -u postgres psql -c "CREATE USER finagen WITH PASSWORD 'REPLACE_ME_STRONG_PWD';"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE finagen TO finagen;"
```
Set in `/etc/finagen-backend.env`:
```
POSTGRES_ENABLED=True
POSTGRES_DB=finagen
POSTGRES_USER=finagen
POSTGRES_PASSWORD=REPLACE_ME_STRONG_PWD
POSTGRES_HOST=127.0.0.1
POSTGRES_PORT=5432
```
Restart backend: `sudo systemctl restart finagen-backend`.


## 14) Quick validation
- `https://api.yourdomain.com/api/docs` → Swagger UI
- `https://app.yourdomain.com/` → SPA loads; login with JWT
- Create API key and call API with `Api-Key: <token>`

You are now live on GCE with HTTPS for both API and UI.
