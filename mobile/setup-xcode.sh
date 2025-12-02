#!/bin/bash

echo "🔧 Setting up Xcode for React Native..."
echo ""

# Step 1: Set Xcode path
echo "Step 1: Setting Xcode developer path..."
sudo xcode-select -s /Applications/Xcode.app/Contents/Developer

# Step 2: Accept license
echo ""
echo "Step 2: Accepting Xcode license..."
sudo xcodebuild -license accept

# Step 3: Verify
echo ""
echo "Step 3: Verifying installation..."
xcode-select -p

# Step 4: Install CocoaPods
echo ""
echo "Step 4: Installing CocoaPods..."
sudo gem install cocoapods

echo ""
echo "✅ Xcode setup complete!"
echo ""
echo "Now run:"
echo "  cd mobile"
echo "  npm install"
echo "  npx expo start"
echo ""
echo "Then press 'i' for iOS simulator"
echo "Or scan QR code with Expo Go app on your iPhone"
