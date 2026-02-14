# Campus Skill Match - Running the Project

## Quick Start

### Option 1: Run Everything at Once (Recommended)

```powershell
cd C:\Users\selin\OneDrive\Desktop\tink-her-hack-temp\skillapp
.\run-all.ps1
```

This will start:
- MySQL database in Docker (port 3307)
- Backend server (port 5000)
- Next.js frontend (port 3000)

Then open **http://localhost:3000** in your browser.

---

### Option 2: Run Services Individually

#### Terminal 1: Start Database
```powershell
cd C:\Users\selin\OneDrive\Desktop\tink-her-hack-temp\skillapp
.\run-db.ps1
```

#### Terminal 2: Start Backend
```powershell
cd C:\Users\selin\OneDrive\Desktop\tink-her-hack-temp\skillapp
.\run-backend.ps1
```

#### Terminal 3: Start Frontend
```powershell
cd C:\Users\selin\OneDrive\Desktop\tink-her-hack-temp\skillapp
.\run-frontend.ps1
```

---

### Option 3: Use Static Dashboard (Pure HTML/CSS/JS)

Instead of Next.js frontend, use the elegant static dashboard:

```powershell
cd C:\Users\selin\OneDrive\Desktop\tink-her-hack-temp\skillapp
.\run-db.ps1          # Terminal 1
.\run-backend.ps1     # Terminal 2
.\run-static-dashboard.ps1  # Terminal 3
```

Then open **http://localhost:8080** in your browser.

---

## Manual Setup (Without Scripts)

If scripts don't work, run these commands manually:

### 1. Start Database
```powershell
cd C:\Users\selin\OneDrive\Desktop\tink-her-hack-temp\skillapp
docker compose up -d mysql
docker compose logs -f mysql
```

### 2. Start Backend
```powershell
cd C:\Users\selin\OneDrive\Desktop\tink-her-hack-temp\skillapp\backend
copy .env.template .env
npm install
npm run dev
```

### 3. Start Frontend (Next.js)
```powershell
cd C:\Users\selin\OneDrive\Desktop\tink-her-hack-temp\skillapp
$env:NEXT_PUBLIC_API_URL = 'http://localhost:5000'
npm install
npm run dev
```

Or Static Dashboard:
```powershell
cd C:\Users\selin\OneDrive\Desktop\tink-her-hack-temp\skillapp\frontend
python -m http.server 8080
```

---

## Access Points

| Service | URL | Purpose |
|---------|-----|---------|
| Frontend | http://localhost:3000 | Next.js app with UI pages |
| Static Dashboard | http://localhost:8080 | Pure HTML/CSS/JS dashboard |
| Backend Health | http://localhost:5000/api/health | API health check |
| Skills API | http://localhost:5000/api/skills | List all skills |
| Database | 127.0.0.1:3307 | MySQL (user: root, password: root) |

---

## Database Details

- **Host**: 127.0.0.1 (localhost)
- **Port**: 3307 (host) → 3306 (container)
- **User**: root
- **Password**: root
- **Database**: campus_skillmatch
- **Status**: Docker container auto-initializes with schema and sample data

---

## Useful Commands

### View Logs
```powershell
docker compose logs -f mysql
docker compose logs -f
```

### Stop Services
```powershell
# Stop database and remove containers
docker compose down

# Stop and remove data
docker compose down -v
```

### Check Backend Health
```powershell
# From PowerShell
Invoke-RestMethod -Uri http://localhost:5000/api/health

# Or from cmd
curl http://localhost:5000/api/health
```

### Database Access
```powershell
# Connect to MySQL in container
docker exec -it skillmatch-db mysql -u root -proot campus_skillmatch
```

---

## Project Structure

```
skillapp/
├── app/                    # Next.js pages (React UI)
├── backend/                # Express.js API server
│   ├── server.js
│   ├── config/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   └── .env
├── frontend/               # Static HTML/CSS/JS dashboard
│   ├── index.html
│   ├── styles.css
│   └── app.js
├── database/               # SQL schemas and sample data
│   ├── setup.sql
│   └── sample_data.sql
├── docker-compose.yml
├── Dockerfile              # Frontend Dockerfile
├── run-all.ps1             # Run everything
├── run-db.ps1              # Run database only
├── run-backend.ps1         # Run backend only
├── run-frontend.ps1        # Run frontend only
└── run-static-dashboard.ps1 # Run static dashboard
```

---

## Troubleshooting

### "npm: command not found"
- Install Node.js from https://nodejs.org/

### Docker errors
- Ensure Docker Desktop is running
- Run PowerShell as Administrator if needed

### Port already in use
- Change ports in `docker-compose.yml` or kill existing processes
- Or run services on different ports

### MySQL connection errors
- Wait 10-15 seconds for MySQL to be ready
- Check `docker compose logs mysql` for initialization errors
- Try: `docker compose down -v` and restart

### Backend won't start
- Ensure `.env` file exists in `skillapp/backend/`
- Check database connection: `DB_HOST=127.0.0.1 DB_PORT=3307`
- Run `npm install` again

---

## Frontend Versions

### Next.js Frontend (`http://localhost:3000`)
- Modern React UI
- Pages: Dashboard, Register, Login, Skills, Matches
- Responsive design
- Uses Next.js 16.1.6 + Tailwind CSS

### Static Dashboard (`http://localhost:8080`)
- Pure HTML/CSS/JavaScript
- Card-based layout with compatibility badges
- No frameworks or build tools
- Responsive and modern design
- Files: `frontend/index.html`, `styles.css`, `app.js`

---

## API Endpoints

Base URL: `http://localhost:5000/api`

- `GET /health` - Health check
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user
- `GET /skills` - List skills
- `GET /match` - Get matches
- `GET /teams` - List teams

See backend code for full API documentation.

---

## Default Credentials

**Database**:
- User: `root`
- Password: `root`
- Database: `campus_skillmatch`

**Sample Users** (from sample_data.sql):
- Check `database/sample_data.sql` for seeded data

---

## Next Steps

1. ✅ Start all services using `.\run-all.ps1`
2. 🌐 Open http://localhost:3000
3. 📝 Register or login with credentials
4. 🎯 View skill matches and compatibility scores
5. 🔗 Form teams with compatible students

Enjoy!
