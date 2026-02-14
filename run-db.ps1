# PowerShell script to run MySQL database in Docker
# Usage: ./run-db.ps1

Write-Host "🐳 Starting MySQL in Docker..." -ForegroundColor Green

# Navigate to skillapp directory
$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $scriptPath

# Remove old container if it exists
Write-Host "Cleaning up old containers..." -ForegroundColor Yellow
docker rm -f skillmatch-db 2>$null | Out-Null

# Start MySQL service only (not backend/frontend)
Write-Host "Starting MySQL container..." -ForegroundColor Green
docker compose up -d mysql

# Wait for MySQL to be healthy
Write-Host "Waiting for MySQL to be healthy..." -ForegroundColor Yellow
$maxAttempts = 30
$attempt = 0
$isHealthy = $false

while ($attempt -lt $maxAttempts -and -not $isHealthy) {
    $attempt++
    $healthCheck = docker compose ps mysql --format "{{.State}}" 2>$null
    
    if ($healthCheck -like "*healthy*" -or $healthCheck -like "*running*") {
        # Double-check with mysqladmin
        $pingResult = docker exec skillmatch-db mysqladmin ping -h localhost 2>$null
        if ($pingResult -like "*mysqld is alive*") {
            $isHealthy = $true
            break
        }
    }
    
    Write-Host "  Attempt $attempt/$maxAttempts..." -ForegroundColor Gray
    Start-Sleep -Seconds 1
}

if ($isHealthy) {
    Write-Host "✅ MySQL is ready!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Connection Details:" -ForegroundColor Cyan
    Write-Host "  Host: 127.0.0.1" -ForegroundColor White
    Write-Host "  Port: 3307 (host) → 3306 (container)" -ForegroundColor White
    Write-Host "  User: root" -ForegroundColor White
    Write-Host "  Password: root" -ForegroundColor White
    Write-Host "  Database: campus_skillmatch" -ForegroundColor White
    Write-Host ""
    Write-Host "View logs:" -ForegroundColor Cyan
    Write-Host "  docker compose logs -f mysql" -ForegroundColor Gray
    Write-Host ""
    Write-Host "Stop database:" -ForegroundColor Cyan
    Write-Host "  docker compose down" -ForegroundColor Gray
} else {
    Write-Host "❌ MySQL failed to start. Check logs:" -ForegroundColor Red
    docker compose logs mysql
}
