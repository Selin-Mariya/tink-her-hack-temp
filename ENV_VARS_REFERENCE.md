# Environment Variables Reference

## Frontend
Located in: Next.js root directory

### Development (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

### Production (.env.production)
```env
NEXT_PUBLIC_API_URL=https://your-backend-api.vercel.app
```

**Why `NEXT_PUBLIC_`?**
- Exposed to browser (frontend code runs in browser)
- Must be set at build time
- Anyone can see it in browser DevTools

---

## Backend
Located in: `./backend/`

### Required Environment Variables

| Variable | Value | Where to Set |
|----------|-------|--------------|
| **DB_HOST** | `db.qpspepfemgjaqannngcw.supabase.co` | `.env` or Vercel |
| **DB_USER** | `postgres` | `.env` or Vercel |
| **DB_PASSWORD** | `parvana@2006` | `.env` or Vercel |
| **DB_NAME** | `postgres` | `.env` or Vercel |
| **DB_PORT** | `5432` | `.env` or Vercel |
| **JWT_SECRET** | Random string (generate new) | Vercel only, never commit |
| **SUPABASE_URL** | `https://qpspepfemgjaqannngcw.supabase.co` | `.env` or Vercel |
| **SUPABASE_ANON_KEY** | `sb_publishable_...` | `.env` or Vercel |
| **NODE_ENV** | `production` | Vercel only |
| **PORT** | `5000` | Vercel only |

### Development (.env in local)
```env
# Can be plain text in .env for development
DB_HOST=db.qpspepfemgjaqannngcw.supabase.co
DB_USER=postgres
DB_PASSWORD=parvana@2006
DB_NAME=postgres
DB_PORT=5432
JWT_SECRET=some_secure_secret
SUPABASE_URL=https://qpspepfemgjaqannngcw.supabase.co
SUPABASE_ANON_KEY=sb_publishable_tDay5AjSI9snKKORIE7PlA_o-RkfvwQ
PORT=5000
NODE_ENV=development
```

### Production (Vercel Dashboard)
Set these in **Project Settings → Environment Variables**:
1. All variables from Development
2. Change `NODE_ENV=production`
3. Generate new `JWT_SECRET` (never use same as dev)

---

## Environment Variable Types

### `NEXT_PUBLIC_*` (Frontend only)
- **When**: Needed at **build time**
- **Visible**: In browser (don't put secrets!)
- **Set in**: Vercel → Environment Variables (Production)
- **Example**: `NEXT_PUBLIC_API_URL`

### Private (Backend only)
- **When**: Needed at **runtime**
- **Visible**: Only on server (secrets are safe)
- **Set in**: Vercel → Environment Variables
- **Example**: `JWT_SECRET`, `DB_PASSWORD`

---

## Vercel Deployment Flow

```
Code Push to GitHub (main branch)
          ↓
Vercel detects changes
          ↓
Frontend Build:
  - Read NEXT_PUBLIC_* vars
  - Build Next.js app
  - Deploy to vercel.app
          ↓
Backend Build:
  - Run npm install
  - Start server.js with other vars
  - Deploy serverless function
```

---

## Quick Commands

### Generate Strong JWT Secret
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Test Backend Health Check (local)
```bash
curl http://localhost:5000/api/health
```

### Test Backend Health Check (Vercel)
```bash
curl https://your-backend.vercel.app/api/health
```

### View Vercel Logs
- Go to Vercel dashboard → Deployments → Function Logs

---

## Security Best Practices

✅ **DO:**
- Store secrets in Vercel Environment Variables
- Use strong random `JWT_SECRET`
- Keep `.env` in `.gitignore`
- Use HTTPS only in production
- Validate all user inputs

❌ **DON'T:**
- Commit `.env` with real credentials
- Use same JWT_SECRET in dev and prod
- Put secrets in `NEXT_PUBLIC_*` variables
- Hardcode API URLs
- Log sensitive data to console

---

## Troubleshooting

### "API_URL is undefined"
- Check `NEXT_PUBLIC_API_URL` is set in Vercel
- Rebuilt after changing: Redeploy from dashboard

### "JWT is not configured"
- Check `JWT_SECRET` is set in Vercel
- Cannot run backend without it

### Frontend can't reach backend
- Check `NEXT_PUBLIC_API_URL` is correct
- Verify backend is deployed
- Test `/api/health` endpoint

### Database connection fails
- Check all `DB_*` variables match Supabase
- Verify IP whitelist (Supabase → Settings)
