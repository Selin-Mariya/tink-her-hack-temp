#!/usr/bin/env pwsh

# Test Registration API
Write-Host "Testing Campus Skill Match Registration" -ForegroundColor Cyan

$apiUrl = "http://localhost:5000/api/auth/register"

# Create test user data
$testUser = @{
    name = "Test User $(Get-Random 10000)"
    email = "testuser_$(Get-Random 10000)@example.com"
    password = "TestPassword123"
    branch = "Computer Science"
}

Write-Host "Test Data:" -ForegroundColor Yellow
$testUser | ConvertTo-Json | Write-Host

Write-Host "`nSending registration request to $apiUrl..." -ForegroundColor Yellow

try {
    $response = Invoke-WebRequest -Uri $apiUrl `
        -Method POST `
        -ContentType "application/json" `
        -Body ($testUser | ConvertTo-Json) `
        -UseBasicParsing `
        -TimeoutSec 5

    Write-Host "Response Status: $($response.StatusCode)" -ForegroundColor Green
    $data = $response.Content | ConvertFrom-Json
    Write-Host "Response:" -ForegroundColor Green
    $data | ConvertTo-Json | Write-Host
    
    if ($data.token) {
        Write-Host "`nRegistration successful! Token received." -ForegroundColor Green
        Write-Host "User ID: $($data.user.id)" -ForegroundColor Green
        Write-Host "Email: $($data.user.email)" -ForegroundColor Green
    }
} catch {
    Write-Host "Registration failed!" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}

# Test database query to verify user was registered
Write-Host "`nVerifying user in database..." -ForegroundColor Yellow
try {
    $dbCheck = docker exec skillapp-mysql-1 mysql -u root -proot campus_skillmatch -e "SELECT COUNT(*) as total FROM users" 2>&1
    Write-Host "Database check result:" -ForegroundColor Green
    Write-Host $dbCheck
} catch {
    Write-Host "Database check failed: $($_.Exception.Message)" -ForegroundColor Red
}
