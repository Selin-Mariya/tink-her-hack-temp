# PowerShell script to test database connection and verify end-to-end functionality
# Usage: ./test-connection.ps1

Write-Host "
╔════════════════════════════════════════════════════════════════╗
║        Campus Skill Match - End-to-End Test Suite             ║
╚════════════════════════════════════════════════════════════════╝
" -ForegroundColor Cyan

$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $scriptPath

# Test 1: Docker and MySQL
Write-Host "Test 1: Checking Docker MySQL..." -ForegroundColor Yellow
try {
    $mysqlStatus = docker compose ps mysql --format "{{.Status}}"
    if ($mysqlStatus -like "*running*" -or $mysqlStatus -like "*healthy*") {
        Write-Host "✅ MySQL is running" -ForegroundColor Green
        
        # Try to ping MySQL
        $ping = docker exec skillmatch-db mysqladmin ping -h localhost 2>$null
        if ($ping -like "*mysqld is alive*") {
            Write-Host "✅ MySQL is responding to pings" -ForegroundColor Green
        } else {
            Write-Host "⚠️  MySQL ping failed, but container may still be initializing" -ForegroundColor Yellow
        }
    } else {
        Write-Host "❌ MySQL is not running. Status: $mysqlStatus" -ForegroundColor Red
        Write-Host "Start it with: docker compose up -d mysql" -ForegroundColor Yellow
    }
} catch {
    Write-Host "❌ Error checking MySQL: $_" -ForegroundColor Red
}

Write-Host ""

# Test 2: Backend API
Write-Host "Test 2: Checking Backend API..." -ForegroundColor Yellow
try {
    $health = Invoke-RestMethod -Uri "http://localhost:5000/api/health" -ErrorAction Stop
    if ($health.message) {
        Write-Host "✅ Backend is responding" -ForegroundColor Green
        Write-Host "   Message: $($health.message)" -ForegroundColor Gray
    }
} catch {
    Write-Host "❌ Backend not responding at http://localhost:5000" -ForegroundColor Red
    Write-Host "   Make sure backend is running with: npm run dev (from skillapp/backend)" -ForegroundColor Yellow
}

Write-Host ""

# Test 3: Skills API
Write-Host "Test 3: Testing Skills API..." -ForegroundColor Yellow
try {
    $skills = Invoke-RestMethod -Uri "http://localhost:5000/api/skills" -ErrorAction Stop
    $skillCount = if ($skills -is [array]) { $skills.Count } else { 1 }
    if ($skillCount -gt 0) {
        Write-Host "✅ Skills API is working" -ForegroundColor Green
        Write-Host "   Found $skillCount skills" -ForegroundColor Gray
    } else {
        Write-Host "⚠️  Skills API returned empty result" -ForegroundColor Yellow
    }
} catch {
    Write-Host "❌ Skills API not responding" -ForegroundColor Red
}

Write-Host ""

# Test 4: Database Connection from Backend
Write-Host "Test 4: Testing Database Connection..." -ForegroundColor Yellow
try {
    # Try to connect directly to MySQL
    $mysqlTest = docker exec skillmatch-db mysql -u root -proot -e "SELECT 1" 2>$null
    if ($mysqlTest) {
        Write-Host "✅ Database connection successful" -ForegroundColor Green
        
        # Check if tables exist
        $tables = docker exec skillmatch-db mysql -u root -proot campus_skillmatch -e "SHOW TABLES" 2>$null
        if ($tables) {
            Write-Host "✅ Database tables found" -ForegroundColor Green
        } else {
            Write-Host "⚠️  No tables found in database" -ForegroundColor Yellow
        }
    }
} catch {
    Write-Host "⚠️  Could not verify database connection" -ForegroundColor Yellow
}

Write-Host ""

# Test 5: Ports Check
Write-Host "Test 5: Checking Ports..." -ForegroundColor Yellow
try {
    $port3000 = Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue
    if ($port3000) {
        Write-Host "✅ Port 3000 (Frontend) is in use" -ForegroundColor Green
    } else {
        Write-Host "⚠️  Port 3000 (Frontend) not in use" -ForegroundColor Yellow
    }
} catch {}

try {
    $port5000 = Get-NetTCPConnection -LocalPort 5000 -ErrorAction SilentlyContinue
    if ($port5000) {
        Write-Host "✅ Port 5000 (Backend) is in use" -ForegroundColor Green
    } else {
        Write-Host "⚠️  Port 5000 (Backend) not in use" -ForegroundColor Yellow
    }
} catch {}

try {
    $port3307 = Get-NetTCPConnection -LocalPort 3307 -ErrorAction SilentlyContinue
    if ($port3307) {
        Write-Host "✅ Port 3307 (Database) is in use" -ForegroundColor Green
    } else {
        Write-Host "⚠️  Port 3307 (Database) not in use" -ForegroundColor Yellow
    }
} catch {}

Write-Host ""

# Test 6: Frontend URLs
Write-Host "Test 6: Frontend URLs..." -ForegroundColor Yellow
try {
    $nextResponse = Invoke-RestMethod -Uri "http://localhost:3000" -ErrorAction Stop
    Write-Host "✅ Next.js Frontend is accessible at http://localhost:3000" -ForegroundColor Green
} catch {
    Write-Host "⚠️  Next.js Frontend not responding at http://localhost:3000" -ForegroundColor Yellow
}

try {
    $staticResponse = Invoke-RestMethod -Uri "http://localhost:8080" -ErrorAction Stop
    Write-Host "✅ Static Dashboard is accessible at http://localhost:8080" -ForegroundColor Green
} catch {
    Write-Host "⚠️  Static Dashboard not responding at http://localhost:8080" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "════════════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "Test Summary" -ForegroundColor Green
Write-Host ""
Write-Host "Quick Start Guide:" -ForegroundColor Cyan
Write-Host "  1. Start Database:  docker compose up -d mysql" -ForegroundColor Gray
Write-Host "  2. Start Backend:   cd backend && npm run dev" -ForegroundColor Gray
Write-Host "  3. Start Frontend:  npm run dev (from skillapp)" -ForegroundColor Gray
Write-Host "  4. Access: http://localhost:3000" -ForegroundColor Gray
Write-Host ""
Write-Host "Or run everything at once: .\run-all.ps1" -ForegroundColor Cyan
Write-Host "════════════════════════════════════════════════════════════════" -ForegroundColor Cyan
