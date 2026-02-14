# Quick Command Reference

## 🎯 Most Important Commands

### Start Everything at Once
```powershell
cd C:\Users\selin\OneDrive\Desktop\tink-her-hack-temp\skillapp
.\run-all.ps1
```
Then open: **http://localhost:3000**

---

## 🧪 Test Everything Works

### Test 1: Database & APIs
```powershell
.\test-connection.ps1
```

### Test 2: End-to-End (Register → Login → Fetch Data)
```powershell
.\test-e2e.ps1
```

---

## 🚀 Start Individual Services

### Database Only
```powershell
.\run-db.ps1
```
**Access:** 127.0.0.1:3307 (user: root, password: root)

### Backend Only
```powershell
cd backend
.\run-backend.ps1
```
**Access:** http://localhost:5000/api/health

### Frontend (Next.js)
```powershell
.\run-frontend.ps1
```
**Access:** http://localhost:3000

### Static Dashboard (Pure HTML/CSS/JS)
```powershell
.\run-static-dashboard.ps1
```
**Access:** http://localhost:8080

---

## 🔗 Manual Startup (No Scripts)

### Terminal 1: Database
```powershell
cd C:\Users\selin\OneDrive\Desktop\tink-her-hack-temp\skillapp
docker compose up -d mysql
docker compose logs -f mysql
```

### Terminal 2: Backend
```powershell
cd C:\Users\selin\OneDrive\Desktop\tink-her-hack-temp\skillapp\backend
copy .env.template .env
npm install
npm run dev
```

### Terminal 3: Frontend
```powershell
cd C:\Users\selin\OneDrive\Desktop\tink-her-hack-temp\skillapp
$env:NEXT_PUBLIC_API_URL = 'http://localhost:5000'
npm install
npm run dev
```

---

## 🔍 Health Checks

### Backend Health
```powershell
Invoke-RestMethod -Uri http://localhost:5000/api/health
```

### Database Status
```powershell
docker compose ps mysql
docker compose logs mysql
```

### Database Connection Test
```powershell
docker exec skillmatch-db mysqladmin ping -h localhost
```

### Check Ports
```powershell
netstat -ano | findstr :3000
netstat -ano | findstr :5000
netstat -ano | findstr :3307
```

---

## 🛑 Stop & Cleanup

### Stop Database
```powershell
docker compose stop mysql
```

### Stop & Remove All Containers
```powershell
docker compose down
```

### Stop & Remove Containers + Data
```powershell
docker compose down -v
```

### Kill Process on Port
```powershell
# Port 3000
lsof -i :3000 | grep LISTEN | awk '{print $2}' | xargs kill -9

# Or Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

---

## 📊 Monitor & Debug

### View All Logs
```powershell
docker compose logs -f
```

### View MySQL Logs Only
```powershell
docker compose logs -f mysql
```

### View Backend Logs Only
```powershell
docker compose logs -f backend
```

### Connect to Database Directly
```powershell
docker exec -it skillmatch-db mysql -u root -proot campus_skillmatch
```

Then run SQL:
```sql
SHOW TABLES;
SELECT * FROM students;
SELECT * FROM skills;
```

---

## 🧵 API Endpoints

### Authentication
```bash
POST http://localhost:5000/api/auth/register
POST http://localhost:5000/api/auth/login
GET  http://localhost:5000/api/auth/profile
```

### Skills
```bash
GET  http://localhost:5000/api/skills
POST http://localhost:5000/api/skills
```

### Matches
```bash
GET  http://localhost:5000/api/match
```

### Teams
```bash
GET  http://localhost:5000/api/teams
POST http://localhost:5000/api/teams
```

### Health
```bash
GET  http://localhost:5000/api/health
```

---

## 🎨 Access Frontends

| Frontend | URL | Type |
|----------|-----|------|
| Next.js App | http://localhost:3000 | React Framework |
| Static Dashboard | http://localhost:8080 | Pure HTML/CSS/JS |

---

## 🐳 Docker Commands

### List Containers
```powershell
docker compose ps
docker compose ps -a
```

### Container Logs
```powershell
docker compose logs -f mysql
docker logs -f skillmatch-db
```

### Execute Command in Container
```powershell
docker exec -it skillmatch-db bash
docker exec -it skillmatch-db mysql -u root -proot
```

### Remove Old Container
```powershell
docker rm -f skillmatch-db
docker rm -f skillapp-backend
```

---

## 📁 Important Files

| File | Purpose |
|------|---------|
| `app/page.tsx` | Next.js landing page |
| `frontend/index.html` | Static dashboard |
| `frontend/styles.css` | Dashboard styling |
| `backend/.env` | Backend configuration |
| `database/setup.sql` | Database schema |
| `docker-compose.yml` | Docker services config |
| `RUN.md` | Full running guide |
| `TESTING.md` | Testing guide |

---

## ⚡ Performance Tips

### Rebuild Docker Images
```powershell
docker compose build --no-cache
docker compose up --build
```

### Clear npm Cache
```powershell
npm cache clean --force
rm -r node_modules
npm install
```

### Monitor Resource Usage
```powershell
docker stats
```

---

## 📞 Common Issues & Fixes

### "Port 3000 already in use"
```powershell
# Kill process on port 3000
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### "Database connection refused"
```powershell
# Restart database
docker compose down
docker compose up -d mysql
# Wait 10 seconds
Start-Sleep -Seconds 10
```

### "npm: command not found"
- Install Node.js from https://nodejs.org/
- Restart PowerShell

### "Docker not found"
- Install Docker Desktop from https://www.docker.com/products/docker-desktop
- Restart computer

---

## 🚀 Ready to Go?

**Quickest way to get everything running:**

```powershell
cd C:\Users\selin\OneDrive\Desktop\tink-her-hack-temp\skillapp
.\run-all.ps1
# Wait for services to start...
# Open http://localhost:3000 in browser
```

Done! 🎉
