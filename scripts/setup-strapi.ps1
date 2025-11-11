# TechFix Pro - Strapi Setup Script for Windows
# Creates a Strapi backend for Sprint 1

Write-Host "🚀 Setting up Strapi backend for TechFix Pro..." -ForegroundColor Green

# Check if Strapi directory exists
if (-not (Test-Path "strapi-app")) {
    Write-Host "📦 Creating new Strapi application..." -ForegroundColor Yellow
    npx create-strapi-app@latest strapi-app --quickstart --no-run
} else {
    Write-Host "✅ Strapi app already exists" -ForegroundColor Green
}

# Navigate to Strapi directory
Set-Location strapi-app

# Check if package.json exists
if (Test-Path "package.json") {
    Write-Host "📋 Installing dependencies..." -ForegroundColor Yellow
    npm install
    
    Write-Host "🎯 Starting Strapi development server..." -ForegroundColor Green
    npm run develop
} else {
    Write-Host "❌ Error: package.json not found in strapi-app directory" -ForegroundColor Red
}