# Install FitFusion on Your iPhone 📱

## Complete Guide to Installing Your App on iPhone

There are **3 methods** to install your app on iPhone. Choose the one that works best for you:

---

## Method 1: Expo Go App (Easiest - 5 minutes) ⚡

This is the **fastest way** to test your app without building.

### Step 1: Install Expo Go on iPhone
1. Open **App Store** on your iPhone
2. Search for **"Expo Go"**
3. Download and install the app
4. Open Expo Go

### Step 2: Start Development Server on Mac
```bash
cd mobile
npx expo start
```

### Step 3: Connect iPhone to App

**Option A: Scan QR Code (Same WiFi)**
1. Make sure iPhone and Mac are on **same WiFi network**
2. In terminal, you'll see a QR code
3. Open **Camera app** on iPhone
4. Point at QR code
5. Tap notification to open in Expo Go

**Option B: Manual Connection**
1. In Expo Go app, tap **"Enter URL manually"**
2. Type the URL shown in terminal (e.g., `exp://192.168.x.x:8081`)
3. Tap **"Connect"**

### Step 4: Use the App
- App will load on your iPhone
- Make changes in code → app updates automatically
- Shake phone to open developer menu

### ⚠️ Limitations:
- Requires Expo Go app
- Some native features may not work
- Need to keep development server running
- Not a standalone app

---

## Method 2: Development Build (Recommended - 30 minutes) 🔨

This creates a **real app** on your iPhone that works without Expo Go.

### Prerequisites:
- Apple Developer Account (free or paid)
- Xcode installed on Mac
- iPhone connected via USB

### Step 1: Install EAS CLI
```bash
npm install -g eas-cli
```

### Step 2: Login to Expo
```bash
cd mobile
eas login
```

### Step 3: Configure Project
```bash
eas build:configure
```

### Step 4: Create Development Build
```bash
eas build --profile development --platform ios
```

This will:
- Upload your code to Expo servers
- Build the app in the cloud
- Give you a download link

### Step 5: Install on iPhone

**Option A: Direct Install (Easiest)**
1. Open the link on your iPhone
2. Tap **"Install"**
3. Go to **Settings → General → VPN & Device Management**
4. Trust the developer certificate
5. App appears on home screen

**Option B: Via Xcode**
1. Download the `.ipa` file
2. Connect iPhone to Mac via USB
3. Open Xcode
4. Go to **Window → Devices and Simulators**
5. Select your iPhone
6. Drag `.ipa` file to **Installed Apps** section

### Step 6: Run Development Server
```bash
cd mobile
npx expo start --dev-client
```

### Step 7: Open App on iPhone
1. Open FitFusion app on iPhone
2. It will connect to development server
3. App works like a real app!

### ✅ Benefits:
- Real app on your phone
- All native features work
- Can use without computer (after initial setup)
- Better performance

---

## Method 3: Production Build (Full App - 1-2 hours) 🚀

This creates a **complete standalone app** ready for App Store.

### Prerequisites:
- **Paid Apple Developer Account** ($99/year)
- Xcode installed
- App Store Connect account

### Step 1: Enroll in Apple Developer Program
1. Go to https://developer.apple.com
2. Sign up for Apple Developer Program
3. Pay $99/year fee
4. Wait for approval (1-2 days)

### Step 2: Create App in App Store Connect
1. Go to https://appstoreconnect.apple.com
2. Click **"My Apps"** → **"+"** → **"New App"**
3. Fill in details:
   - Platform: iOS
   - Name: FitFusion
   - Bundle ID: com.fitfusion.app
   - SKU: fitfusion-001
   - User Access: Full Access

### Step 3: Configure app.json
```json
{
  "expo": {
    "name": "FitFusion",
    "slug": "fitfusion-mobile",
    "version": "1.0.0",
    "ios": {
      "bundleIdentifier": "com.fitfusion.app",
      "buildNumber": "1"
    }
  }
}
```

### Step 4: Build for App Store
```bash
cd mobile
eas build --platform ios --profile production
```

### Step 5: Submit to App Store
```bash
eas submit --platform ios
```

### Step 6: App Review
1. Go to App Store Connect
2. Fill in app information:
   - Description
   - Screenshots
   - Privacy policy
   - Support URL
3. Submit for review
4. Wait 1-3 days for approval

### Step 7: Download from App Store
1. Once approved, app appears in App Store
2. Search "FitFusion"
3. Download like any other app

### ✅ Benefits:
- Complete standalone app
- Available in App Store
- Professional distribution
- Automatic updates

---

## Quick Start (Recommended for Testing) 🎯

**For immediate testing, use Method 1:**

```bash
# 1. Install Expo Go on iPhone from App Store

# 2. Start server on Mac
cd mobile
npx expo start

# 3. Scan QR code with iPhone Camera app

# 4. App opens in Expo Go!
```

---

## Troubleshooting 🔧

### "Unable to connect to development server"
**Solution:**
1. Make sure iPhone and Mac are on **same WiFi**
2. Disable VPN on both devices
3. Check firewall isn't blocking port 8081
4. Try manual connection with IP address

### "App crashes on launch"
**Solution:**
1. Clear Expo cache: `npx expo start --clear`
2. Reinstall node_modules: `rm -rf node_modules && npm install`
3. Update Expo Go app on iPhone
4. Restart development server

### "Cannot install app on iPhone"
**Solution:**
1. Trust developer certificate in Settings
2. Make sure iPhone is not in Low Power Mode
3. Free up storage space on iPhone
4. Restart iPhone

### "QR code not scanning"
**Solution:**
1. Make sure Camera app has permission
2. Try manual URL entry in Expo Go
3. Use Expo Go's built-in scanner
4. Check QR code is fully visible

### "App is slow or laggy"
**Solution:**
1. Use development build (Method 2) instead of Expo Go
2. Enable production mode
3. Optimize images and assets
4. Close other apps on iPhone

---

## System Requirements 📋

### For Mac:
- macOS 10.15 or later
- Node.js 18+ installed
- Xcode 14+ (for Method 2 & 3)
- 10GB free disk space

### For iPhone:
- iOS 13.0 or later
- 500MB free storage
- WiFi connection
- Camera (for QR scanning)

---

## Comparison of Methods 📊

| Feature | Expo Go | Development Build | Production Build |
|---------|---------|-------------------|------------------|
| **Setup Time** | 5 min | 30 min | 1-2 hours |
| **Cost** | Free | Free | $99/year |
| **Standalone** | ❌ No | ✅ Yes | ✅ Yes |
| **App Store** | ❌ No | ❌ No | ✅ Yes |
| **Native Features** | ⚠️ Limited | ✅ Full | ✅ Full |
| **Performance** | ⚠️ Good | ✅ Great | ✅ Great |
| **Updates** | 🔄 Instant | 🔄 Fast | ⏳ Slow |
| **Best For** | Testing | Development | Production |

---

## Recommended Workflow 🎯

### Phase 1: Development (Use Expo Go)
```bash
cd mobile
npx expo start
# Scan QR code with iPhone
```
- Fast iteration
- Instant updates
- Easy testing

### Phase 2: Testing (Use Development Build)
```bash
eas build --profile development --platform ios
# Install on iPhone
```
- Test all features
- Real app experience
- Share with testers

### Phase 3: Release (Use Production Build)
```bash
eas build --profile production --platform ios
eas submit --platform ios
```
- Submit to App Store
- Public release
- Professional distribution

---

## Step-by-Step: Expo Go Method (Detailed) 📱

### 1. Prepare Your Mac
```bash
# Navigate to mobile folder
cd /path/to/your/project/mobile

# Install dependencies (if not done)
npm install

# Make sure Gemini server is running (for AI features)
cd ../server
python3 gemini_ai_server.py &
cd ../mobile
```

### 2. Start Development Server
```bash
npx expo start
```

You'll see:
```
› Metro waiting on exp://192.168.x.x:8081
› Scan the QR code above with Expo Go (Android) or the Camera app (iOS)

› Press a │ open Android
› Press i │ open iOS simulator
› Press w │ open web

› Press r │ reload app
› Press m │ toggle menu
› Press ? │ show all commands
```

### 3. Install Expo Go on iPhone
1. Open **App Store**
2. Search **"Expo Go"**
3. Tap **"Get"** → **"Install"**
4. Open the app

### 4. Connect to Your App

**Method A: QR Code (Easiest)**
1. Open **Camera** app on iPhone
2. Point at QR code in terminal
3. Notification appears: **"Open in Expo Go"**
4. Tap notification
5. App loads!

**Method B: Manual URL**
1. In Expo Go, tap **"Enter URL manually"**
2. Type: `exp://192.168.x.x:8081` (use IP from terminal)
3. Tap **"Connect"**
4. App loads!

### 5. Use Your App
- App is now running on your iPhone
- All features work (AI Coach, step tracking, etc.)
- Make code changes → app updates automatically
- Shake phone to open developer menu

### 6. Troubleshooting Connection
If app won't connect:

```bash
# Check your Mac's IP address
ifconfig | grep "inet " | grep -v 127.0.0.1

# Use that IP in Expo Go
# Example: exp://192.168.1.100:8081
```

---

## Features That Work on iPhone 📱

### ✅ Fully Working:
- All screens and navigation
- AI Coach (if Gemini server running)
- Weather-based meal suggestions
- Progress tracking with charts
- Workout plans
- Diet/nutrition tracking
- Profile management
- Authentication (Firebase)

### ⚠️ Limited in Expo Go:
- Step tracking (works better in dev build)
- Push notifications (need dev build)
- Background tasks (need dev build)

### ✅ Works in Development Build:
- Everything above
- Full step tracking
- Push notifications
- Background location
- All native features

---

## Next Steps After Installation 🎉

### 1. Test All Features
- [ ] Sign up / Sign in
- [ ] Complete profile
- [ ] Try AI Coach
- [ ] Check weather-based meals
- [ ] View progress charts
- [ ] Start a workout
- [ ] Log meals

### 2. Share with Friends
```bash
# They can scan the same QR code!
# Or send them the URL
```

### 3. Build for Production
When ready to publish:
```bash
eas build --platform ios --profile production
eas submit --platform ios
```

---

## Support & Help 🆘

### Common Issues:

**"Cannot connect to server"**
- Check WiFi connection
- Restart development server
- Try manual URL entry

**"App crashes"**
- Clear cache: `npx expo start --clear`
- Update Expo Go app
- Check error logs in terminal

**"Features not working"**
- Make sure Gemini server is running
- Check Firebase configuration
- Verify API keys in .env

### Get Help:
- Expo Documentation: https://docs.expo.dev
- Expo Forums: https://forums.expo.dev
- Stack Overflow: Tag `expo`

---

## Summary 📝

**Fastest Way (5 minutes):**
1. Install Expo Go on iPhone
2. Run `npx expo start` on Mac
3. Scan QR code
4. Done! ✅

**Best Way (30 minutes):**
1. Run `eas build --profile development --platform ios`
2. Install on iPhone
3. Real app experience! ✅

**Production Way (1-2 hours):**
1. Get Apple Developer account
2. Build and submit to App Store
3. Download from App Store! ✅

---

**Start with Expo Go for immediate testing, then move to development build for full features!** 🚀
