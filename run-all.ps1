# PowerShell script to run entire stack
# Usage: ./run-all.ps1

Write-Host "
╔════════════════════════════════════════════════════════════════╗
║           Campus Skill Match - Full Stack Runner              ║
╚════════════════════════════════════════════════════════════════╝
" -ForegroundColor Cyan

Write-Host "This script will start:" -ForegroundColor Yellow
Write-Host "  1. MySQL Database (Docker)" -ForegroundColor White
Write-Host "  2. Backend Server (Node.js on port 5000)" -ForegroundColor White
Write-Host "  3. Frontend (Next.js on port 3000)" -ForegroundColor White
Write-Host ""

# Navigate to skillapp directory
$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $scriptPath

# Start MySQL in background
Write-Host "Step 1: Starting MySQL in Docker..." -ForegroundColor Green
docker rm -f skillmatch-db 2>$null | Out-Null
docker compose up -d mysql
Start-Sleep -Seconds 3

# Wait for MySQL to be healthy
Write-Host "Waiting for MySQL to be ready..." -ForegroundColor Yellow
$maxAttempts = 30
$attempt = 0
while ($attempt -lt $maxAttempts) {
    $attempt++
    $pingResult = docker exec skillmatch-db mysqladmin ping -h localhost 2>$null
    if ($pingResult -like "*mysqld is alive*") {
        Write-Host "✅ MySQL is ready!" -ForegroundColor Green
        break
    }
    if ($attempt -eq $maxAttempts) {
        Write-Host "⚠️  MySQL may not be ready, but proceeding..." -ForegroundColor Yellow
    }
    Start-Sleep -Seconds 1
}

Write-Host ""
Write-Host "Step 2: Starting Backend Server..." -ForegroundColor Green
$backendPath = Join-Path $scriptPath "backend"
Set-Location $backendPath
if (-not (Test-Path ".env")) {
    Copy-Item ".env.template" ".env" -Force
}
npm install 2>$null | Out-Null

# Start backend in background
$backendJob = Start-Job -ScriptBlock {
    Set-Location $args[0]
    npm run dev
} -ArgumentList $backendPath
Write-Host "✅ Backend starting in background (PID: $($backendJob.Id))" -ForegroundColor Green

Start-Sleep -Seconds 2

Write-Host ""
Write-Host "Step 3: Starting Frontend..." -ForegroundColor Green
Set-Location $scriptPath
$env:NEXT_PUBLIC_API_URL = 'http://localhost:5000'
npm install 2>$null | Out-Null

# Start frontend in background
$frontendJob = Start-Job -ScriptBlock {
    Set-Location $args[0]
    $env:NEXT_PUBLIC_API_URL = 'http://localhost:5000'
    npm run dev
} -ArgumentList $scriptPath
Write-Host "✅ Frontend starting in background (PID: $($frontendJob.Id))" -ForegroundColor Green

Write-Host ""
Write-Host "════════════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "🎉 All services are starting!" -ForegroundColor Green
Write-Host ""
Write-Host "Access points:" -ForegroundColor Cyan
Write-Host "  🌐 Frontend:        http://localhost:3000" -ForegroundColor White
Write-Host "  🔧 Backend Health:  http://localhost:5000/api/health" -ForegroundColor White
Write-Host "  📊 Skills API:      http://localhost:5000/api/skills" -ForegroundColor White
Write-Host "  🗄️  Database:        127.0.0.1:3307 (user: root, password: root)" -ForegroundColor White
Write-Host ""
Write-Host "Helpful commands:" -ForegroundColor Cyan
Write-Host "  View logs:          docker compose logs -f" -ForegroundColor Gray
Write-Host "  Stop all:           docker compose down" -ForegroundColor Gray
Write-Host "  View backend logs:  Get-Job | Stop-Job" -ForegroundColor Gray
Write-Host ""
Write-Host "Press Ctrl+C to stop this script" -ForegroundColor Yellow
Write-Host "════════════════════════════════════════════════════════════════" -ForegroundColor Cyan

# Keep script running and monitor jobs
while ($true) {
    Start-Sleep -Seconds 5
    if (-not (Get-Job -Id $backendJob.Id -ErrorAction SilentlyContinue)) {
        Write-Host "⚠️  Backend job stopped" -ForegroundColor Yellow
    }
    if (-not (Get-Job -Id $frontendJob.Id -ErrorAction SilentlyContinue)) {
        Write-Host "⚠️  Frontend job stopped" -ForegroundColor Yellow
    }
}
