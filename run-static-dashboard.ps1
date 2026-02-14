# PowerShell script to run static dashboard
# Usage: ./run-static-dashboard.ps1

Write-Host "🎨 Starting Static Dashboard..." -ForegroundColor Green

# Navigate to frontend directory
$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path
$frontendPath = Join-Path $scriptPath "frontend"
Set-Location $frontendPath

Write-Host "Dashboard will be available at http://localhost:8080" -ForegroundColor Cyan
Write-Host "Press Ctrl+C to stop" -ForegroundColor Yellow
Write-Host ""

# Try Python first (recommended)
try {
    python --version >$null 2>&1
    Write-Host "Starting with Python http.server..." -ForegroundColor Green
    python -m http.server 8080
} catch {
    # Fallback to Node http-server
    Write-Host "Python not found. Using Node http-server..." -ForegroundColor Yellow
    npm install -g http-server
    http-server -c-1 -p 8080
}
