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
echo "║         📱 PUBLISH FIT FUSION TO EXPO & GET QR CODE       ║"
echo "║                                                            ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo -e "${NC}\n"

# Check if EAS CLI is installed
if ! command -v eas &> /dev/null; then
    echo -e "${YELLOW}⚠️  EAS CLI not found. Installing...${NC}"
    npm install -g eas-cli
fi

# Check if logged in
echo -e "${BLUE}🔐 Checking Expo authentication...${NC}"
if ! eas whoami &> /dev/null; then
    echo -e "${YELLOW}Please login to Expo:${NC}"
    eas login
fi

echo -e "${GREEN}✅ Authenticated!${NC}\n"

# Get commit message
echo -e "${BLUE}📝 Enter update message (or press Enter for default):${NC}"
read -p "Message: " UPDATE_MESSAGE
UPDATE_MESSAGE=${UPDATE_MESSAGE:-"App update from $(date +%Y-%m-%d)"}

# Publish to Expo
echo -e "\n${BLUE}🚀 Publishing to Expo...${NC}\n"
eas update --branch production --message "$UPDATE_MESSAGE"

if [ $? -eq 0 ]; then
    echo -e "\n${GREEN}✅ Successfully published!${NC}\n"
    
    # Get project ID from app.json
    PROJECT_ID=$(grep -o '"projectId": "[^"]*' app.json | cut -d'"' -f4)
    
    if [ -n "$PROJECT_ID" ]; then
        EXPO_URL="exp://u.expo.dev/${PROJECT_ID}?channel-name=production"
        QR_URL="https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${EXPO_URL}"
        
        echo -e "${GREEN}╔════════════════════════════════════════════════════════════╗${NC}"
        echo -e "${GREEN}║                    🎉 SUCCESS!                            ║${NC}"
        echo -e "${GREEN}╚════════════════════════════════════════════════════════════╝${NC}\n"
        
        echo -e "${BLUE}📱 Your Permanent Expo URL:${NC}"
        echo -e "${GREEN}${EXPO_URL}${NC}\n"
        
        echo -e "${BLUE}🔗 QR Code Image URL:${NC}"
        echo -e "${GREEN}${QR_URL}${NC}\n"
        
        echo -e "${BLUE}📋 Add this to your GitHub README:${NC}"
        echo -e "${YELLOW}"
        cat << EOF
<p align="center">
  <img src="${QR_URL}" alt="Scan with Expo Go" width="300"/>
</p>

**Scan with Expo Go to try the app instantly!**

1. Install [Expo Go](https://expo.dev/go)
2. Scan the QR code above
3. App loads in seconds!

Direct link: ${EXPO_URL}
EOF
        echo -e "${NC}\n"
        
        # Save to file
        cat > EXPO_PUBLISHED_URL.txt << EOF
Fit Fusion - Published to Expo
Generated: $(date)

Expo URL: ${EXPO_URL}
QR Code: ${QR_URL}

Markdown for README:
<p align="center">
  <img src="${QR_URL}" alt="Scan with Expo Go" width="300"/>
</p>

**Scan with Expo Go to try the app instantly!**
EOF
        
        echo -e "${GREEN}✅ URLs saved to EXPO_PUBLISHED_URL.txt${NC}\n"
        
        # Open QR code in browser
        echo -e "${BLUE}🌐 Opening QR code in browser...${NC}"
        if [[ "$OSTYPE" == "darwin"* ]]; then
            open "$QR_URL"
        elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
            xdg-open "$QR_URL"
        fi
        
    else
        echo -e "${RED}❌ Could not find project ID in app.json${NC}"
    fi
else
    echo -e "\n${RED}❌ Publishing failed. Please check the errors above.${NC}"
    exit 1
fi

echo -e "\n${BLUE}═══════════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}🎯 Next Steps:${NC}"
echo -e "   1. Copy the markdown above"
echo -e "   2. Add it to your GitHub README"
echo -e "   3. Commit and push to GitHub"
echo -e "   4. Users can now scan the QR code from GitHub!"
echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}\n"
