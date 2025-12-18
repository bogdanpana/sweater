# Deploy to VPS/SSH Server

## Prerequisites
- SSH access to your server
- Node.js 18+ installed

## Step 1: Connect via SSH
```bash
ssh username@yourserver.com
```

## Step 2: Install Node.js (if not installed)
```bash
# Using NVM (recommended)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
source ~/.bashrc
nvm install 18
nvm use 18
```

## Step 3: Upload your project
Using SCP from your local machine:
```bash
scp sweater-deploy.zip username@yourserver.com:~/
```

Or use FTP/SFTP client to upload `sweater-deploy.zip`

## Step 4: On the server
```bash
# Navigate to web directory
cd ~/public_html/sweater  # or wherever you want

# Unzip
unzip ~/sweater-deploy.zip

# Install dependencies
npm install

# Build
npm run build
```

## Step 5: Set up PM2 (Process Manager)
```bash
# Install PM2 globally
npm install -g pm2

# Start the app
pm2 start npm --name "sweater" -- start

# Make it run on startup
pm2 startup
pm2 save
```

## Step 6: Configure Nginx/Apache
Point your domain to port 3000 or set up a reverse proxy.

### Nginx example:
```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## Managing the app
```bash
pm2 list          # See running apps
pm2 restart sweater  # Restart
pm2 stop sweater     # Stop
pm2 logs sweater     # View logs
```
