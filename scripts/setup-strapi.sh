#!/bin/bash

# TechFix Pro - Strapi Setup Script
# Creates a Strapi backend for Sprint 1

echo "🚀 Setting up Strapi backend for TechFix Pro..."

# Check if Strapi directory exists
if [ ! -d "strapi-app" ]; then
  echo "📦 Creating new Strapi application..."
  npx create-strapi-app@latest strapi-app --quickstart --no-run
else
  echo "✅ Strapi app already exists"
fi

# Navigate to Strapi directory
cd strapi-app

# Install additional dependencies if needed
echo "📋 Installing additional dependencies..."
npm install

# Start Strapi in development mode
echo "🎯 Starting Strapi development server..."
npm run develop