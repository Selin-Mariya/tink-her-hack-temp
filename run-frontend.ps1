# PowerShell script to run Next.js frontend
# Usage: ./run-frontend.ps1

Write-Host "⚛️  Starting Next.js Frontend..." -ForegroundColor Green

# Navigate to skillapp directory
$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $scriptPath

# Set API URL for development
$env:NEXT_PUBLIC_API_URL = 'http://localhost:5000'

# Install dependencies
Write-Host "Installing dependencies..." -ForegroundColor Yellow
npm install

# Start frontend dev server
Write-Host "Starting Next.js dev server..." -ForegroundColor Green
Write-Host "Frontend will be available at http://localhost:3000" -ForegroundColor Cyan
npm run dev
