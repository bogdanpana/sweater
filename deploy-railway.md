# Deploy to Railway

Railway is another great platform for Next.js apps with a free tier.

## Steps:

1. **Push to GitHub** (if not already done)
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git push
   ```

2. **Go to Railway.app**
   - Visit [railway.app](https://railway.app)
   - Sign in with GitHub
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository

3. **Configure:**
   - Railway auto-detects Next.js
   - Add environment variables:
     - `NEXT_PUBLIC_SUPABASE_URL`
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
     - `SUPABASE_SERVICE_ROLE_KEY`
     - `NEXT_PUBLIC_BASE_URL` (use the Railway provided URL)

4. **Deploy!**
   - Railway automatically builds and deploys
   - You get a domain like `yourapp.railway.app`
   - Can add custom domain later

## Free Tier:
- $5 free credit monthly
- Perfect for small projects
- Automatic HTTPS
- Environment variables support
