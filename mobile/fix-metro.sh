#!/bin/bash

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${BLUE}"
echo "╔════════════════════════════════════════════════════════════╗"
echo "║                                                            ║"
echo "║         🔧 FIX METRO BUNDLER - TROUBLESHOOTING           ║"
echo "║                                                            ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo -e "${NC}\n"

echo -e "${YELLOW}🔍 Diagnosing Metro Bundler issues...${NC}\n"

# Check if we're in mobile directory
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ Error: Not in mobile directory${NC}"
    echo -e "${YELLOW}Run: cd mobile${NC}"
    exit 1
fi

# Step 1: Kill existing Metro processes
echo -e "${BLUE}1. Killing existing Metro processes...${NC}"
PORT_8081=$(lsof -ti:8081 2>/dev/null)
if [ -n "$PORT_8081" ]; then
    kill -9 $PORT_8081 2>/dev/null
    echo -e "${GREEN}   ✅ Killed process on port 8081${NC}"
else
    echo -e "${YELLOW}   ℹ️  No process on port 8081${NC}"
fi

PORT_19000=$(lsof -ti:19000 2>/dev/null)
if [ -n "$PORT_19000" ]; then
    kill -9 $PORT_19000 2>/dev/null
    echo -e "${GREEN}   ✅ Killed process on port 19000${NC}"
else
    echo -e "${YELLOW}   ℹ️  No process on port 19000${NC}"
fi

PORT_19001=$(lsof -ti:19001 2>/dev/null)
if [ -n "$PORT_19001" ]; then
    kill -9 $PORT_19001 2>/dev/null
    echo -e "${GREEN}   ✅ Killed process on port 19001${NC}"
else
    echo -e "${YELLOW}   ℹ️  No process on port 19001${NC}"
fi

# Step 2: Clear Metro cache
echo -e "\n${BLUE}2. Clearing Metro bundler cache...${NC}"
if [ -d ".expo" ]; then
    rm -rf .expo
    echo -e "${GREEN}   ✅ Cleared .expo directory${NC}"
fi

if [ -d "node_modules/.cache" ]; then
    rm -rf node_modules/.cache
    echo -e "${GREEN}   ✅ Cleared node_modules cache${NC}"
fi

# Step 3: Clear watchman (if installed)
echo -e "\n${BLUE}3. Clearing Watchman cache...${NC}"
if command -v watchman &> /dev/null; then
    watchman watch-del-all 2>/dev/null
    echo -e "${GREEN}   ✅ Cleared Watchman cache${NC}"
else
    echo -e "${YELLOW}   ℹ️  Watchman not installed (optional)${NC}"
fi

# Step 4: Clear npm cache
echo -e "\n${BLUE}4. Clearing npm cache...${NC}"
npm cache clean --force 2>/dev/null
echo -e "${GREEN}   ✅ Cleared npm cache${NC}"

# Step 5: Clear iOS build cache (if on macOS)
if [[ "$OSTYPE" == "darwin"* ]]; then
    echo -e "\n${BLUE}5. Clearing iOS build cache...${NC}"
    if [ -d "ios/build" ]; then
        rm -rf ios/build
        echo -e "${GREEN}   ✅ Cleared iOS build cache${NC}"
    fi
    if [ -d "ios/Pods" ]; then
        rm -rf ios/Pods
        echo -e "${GREEN}   ✅ Cleared iOS Pods${NC}"
    fi
fi

# Step 6: Clear Android build cache
echo -e "\n${BLUE}6. Clearing Android build cache...${NC}"
if [ -d "android/build" ]; then
    rm -rf android/build
    echo -e "${GREEN}   ✅ Cleared Android build cache${NC}"
fi
if [ -d "android/.gradle" ]; then
    rm -rf android/.gradle
    echo -e "${GREEN}   ✅ Cleared Gradle cache${NC}"
fi

# Step 7: Check node_modules
echo -e "\n${BLUE}7. Checking node_modules...${NC}"
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}   ⚠️  node_modules not found. Installing...${NC}"
    npm install
else
    echo -e "${GREEN}   ✅ node_modules exists${NC}"
fi

echo -e "\n${GREEN}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║                    ✅ CLEANUP COMPLETE!                    ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════════════════════════╝${NC}\n"

echo -e "${BLUE}🚀 Now starting Metro with clean cache...${NC}\n"

# Start Metro with clean cache
npx expo start --clear

echo -e "\n${YELLOW}If the issue persists, try:${NC}"
echo -e "   1. ${GREEN}rm -rf node_modules && npm install${NC}"
echo -e "   2. ${GREEN}npx expo start --tunnel${NC} (slower but more reliable)"
echo -e "   3. Restart your computer"
echo -e "   4. Update Expo Go app on your phone"
echo -e ""
