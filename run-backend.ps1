# PowerShell script to run backend server
# Usage: ./run-backend.ps1

Write-Host "🚀 Starting Backend Server..." -ForegroundColor Green

# Navigate to backend directory
$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path
$backendPath = Join-Path $scriptPath "backend"
Set-Location $backendPath

# Create .env if it doesn't exist
if (-not (Test-Path ".env")) {
    Write-Host "Creating .env file..." -ForegroundColor Yellow
    Copy-Item ".env.template" ".env" -Force
    Write-Host ".env created. Using Docker MySQL defaults." -ForegroundColor Green
}

# Install dependencies
Write-Host "Installing dependencies..." -ForegroundColor Yellow
npm install

# Start backend with nodemon
Write-Host "Starting backend server..." -ForegroundColor Green
npm run dev
