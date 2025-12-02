#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}"
echo "╔════════════════════════════════════════════════════════════╗"
echo "║                                                            ║"
echo "║              🏋️  FIT FUSION MOBILE APP 🏋️                 ║"
echo "║                                                            ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo -e "${NC}"

echo -e "${GREEN}🚀 Starting Expo development server...${NC}\n"

# Start Expo in the background
npm start &
EXPO_PID=$!

# Wait for Expo to start
echo -e "${YELLOW}⏳ Waiting for server to start...${NC}"
sleep 5

# Show QR code
echo -e "\n${GREEN}✅ Server started!${NC}\n"
node show-qr.js

# Keep the script running
echo -e "${BLUE}Press Ctrl+C to stop the server${NC}\n"
wait $EXPO_PID
