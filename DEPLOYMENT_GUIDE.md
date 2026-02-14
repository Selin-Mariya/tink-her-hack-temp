# Vercel Deployment Guide

## Architecture

This project has two separate deployments:
- **Frontend**: Next.js app (in root `/`)
- **Backend**: Express API (in `/backend`)

## Prerequisites

1. GitHub repository with both frontend and backend
2. Vercel account
3. Supabase database (already configured)

---

## Backend Deployment

### Root Directory
```
./backend
```

### Configuration Files
- ✅ `backend/vercel.json` - Already created
- ✅ `backend/package.json` - Already configured with environment variables

### Environment Variables (Vercel Dashboard)

Set these in Vercel Project Settings → Environment Variables:

```env
# Database
DB_HOST=db.qpspepfemgjaqannngcw.supabase.co
DB_USER=postgres
DB_PASSWORD=parvana@2006
DB_NAME=postgres
DB_PORT=5432

# JWT Secret (CHANGE THIS!)
JWT_SECRET=some_secure_secret

# Supabase
SUPABASE_URL=https://qpspepfemgjaqannngcw.supabase.co
SUPABASE_ANON_KEY=sb_publishable_tDay5AjSI9snKKORIE7PlA_o-RkfvwQ

# Server
NODE_ENV=production
PORT=5000
```

### Deployment Steps

1. Go to [vercel.com](https://vercel.com)
2. Click **New Project**
3. Import your GitHub repository
4. **Framework**: Select "Other" or "Node.js"
5. **Root Directory**: `./backend`
6. **Build Command**: `npm install`
7. **Start Command**: `node server.js`
8. Add all Environment Variables above
9. Click **Deploy**

### After Deployment
- Copy the backend URL: `https://campus-skill-backend.vercel.app`
- Test health check: `https://campus-skill-backend.vercel.app/api/health`

---

## Frontend Deployment

### Root Directory
```
./
```

### Environment Variables (Vercel Dashboard)

```env
NEXT_PUBLIC_API_URL=https://your-backend-url.vercel.app
```

Replace `https://your-backend-url.vercel.app` with the actual backend URL from backend deployment.

### Deployment Steps

1. Go to [vercel.com](https://vercel.com)
2. Click **New Project**
3. Import the same GitHub repository
4. **Framework**: Auto-detect (Next.js)
5. **Root Directory**: `.` (leave default)
6. **Build Command**: Auto-detected
7. **Output Directory**: Auto-detected
8. Add Environment Variable:
   - `NEXT_PUBLIC_API_URL` = `https://your-backend.vercel.app`
9. Click **Deploy**

### After Deployment
- Test at `https://your-frontend.vercel.app`
- Login/Register should work and connect to backend

---

## Verifying Deployment

### Backend Health Check
```bash
curl https://your-backend.vercel.app/api/health
```

Expected response:
```json
{ "message": "Campus Skill-Match Engine API is running" }
```

### Frontend Check
Visit `https://your-frontend.vercel.app` in browser:
- Homepage should load
- Register/Login pages should work
- After login, redirects to skills page (which calls backend API)

### Connection Test
1. Go to frontend URL
2. Click "Sign In"
3. Try logging in with test credentials
4. Check browser DevTools → Network tab:
   - API requests should go to `https://your-backend.vercel.app/api/...`

---

## Troubleshooting

### Frontend shows "Error connecting to server"
- Check `NEXT_PUBLIC_API_URL` is set correctly
- Verify backend is deployed and `/api/health` works
- Check browser console for actual error

### Backend returns 500 errors
- Check Vercel logs: Settings → Deployments → Function logs
- Verify all environment variables are set
- Check database credentials are correct

### CORS errors
- Backend middleware is configured for production CORS
- If frontend URL changes, update `FRONTEND_URL` in backend env vars (optional)

### Database connection failed
- Verify `DB_*` environment variables match Supabase credentials
- Check database is accessible from Vercel (Supabase allows public access by default)

---

## Production Checklist

- [ ] Backend deployed to Vercel with all env vars
- [ ] Frontend deployed to Vercel with `NEXT_PUBLIC_API_URL`
- [ ] Health check endpoint works: `/api/health`
- [ ] Can register new user
- [ ] Can login with credentials
- [ ] Skills page loads and connects to backend
- [ ] Matches page shows compatibility calculations

---

## Important Security Notes

🔒 **Never commit `.env` file with real credentials to GitHub**
- Use Vercel Environment Variables instead
- `.env` files are in `.gitignore`

🔒 **JWT_SECRET should be strong and random**
- Generate with: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
- Store only in Vercel (not in code)

🔒 **Database password is in `.env`**
- In production, use Vercel Environment Variables
- Never expose in frontend code

---

## Redeploying After Changes

### Backend Changes
```bash
git push origin main
```
→ Vercel automatically redeploys

### Environment Variable Changes
→ Redeploy from Vercel dashboard (Settings → Deployments)

### Both Frontend & Backend
→ Push to GitHub, both will redeploy automatically
