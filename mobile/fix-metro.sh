#!/bin/bash

echo "🔧 Fixing Metro bundler permanently..."

# Kill any existing Metro processes
echo "Killing existing Metro processes..."
pkill -f "metro" || true
pkill -f "expo" || true

# Kill processes on common ports
lsof -ti:8081 | xargs kill -9 2>/dev/null || true
lsof -ti:8082 | xargs kill -9 2>/dev/null || true
lsof -ti:8083 | xargs kill -9 2>/dev/null || true

# Clear all caches
echo "Clearing caches..."
rm -rf node_modules
rm -rf .expo
rm -rf ~/.expo
rm -rf /tmp/metro-*
rm -rf /tmp/react-*

# Clear npm cache
npm cache clean --force

# Clear watchman cache
watchman watch-del-all 2>/dev/null || true

# Reinstall dependencies with legacy peer deps
echo "Reinstalling dependencies..."
npm install --legacy-peer-deps

# Clear Metro cache and start fresh
echo "Starting Metro with cleared cache..."
npx expo start --clear

echo "✅ Metro bundler fixed!"