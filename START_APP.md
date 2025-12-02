# 🚀 Start Fit Fusion App - Quick Guide

## ⚠️ IMPORTANT: Where to Find the QR Code

**The QR code is NOT on GitHub!**

The QR code appears in your **TERMINAL** when you run the app.

---

## For Developers (Run Locally with Expo Go)

### Step 1: Install Dependencies
```bash
cd mobile
npm install
```

### Step 2: Start the App
```bash
npm start
```

### Step 3: Look at Your Terminal!

**A QR code will appear in your terminal!** 📱

**DO NOT scan QR codes from GitHub - they won't work!**

### Step 3: Scan QR Code

**On iOS:**
- Open Camera app
- Point at QR code
- Tap notification
- App opens in Expo Go

**On Android:**
- Open Expo Go app
- Tap "Scan QR Code"
- Point at QR code
- App loads automatically

---

## What You'll See

When you run `npm start`, you'll see:

```
╔════════════════════════════════════════════════════════════╗
║                                                            ║
║              📱 FIT FUSION - EXPO GO QR CODE              ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝

🚀 Scan this QR code with Expo Go app:

█████████████████████████████████
█████████████████████████████████
████ ▄▄▄▄▄ █▀█ █▄▄▀▄█ ▄▄▄▄▄ ████
████ █   █ █▀▀▀█ ▀ ▄█ █   █ ████
████ █▄▄▄█ █▀ █▀▀█ ▀█ █▄▄▄█ ████
████▄▄▄▄▄▄▄█▄▀ ▀▄█ █▄▄▄▄▄▄▄████
████▄▀ ▄▀ ▄  ▄▀▀▀▀▄ ▄ ▀ ▀▄█▄████
████▄ ▄▄  ▄█▄█ ▀▀▄▄▀▀▀▄▄▄▀▀▄████
████ ▄▄▄▄▄ █▄▄▀▄▀▄▀▄▄▄ ▀ ▀ ▀████
████ █   █ █  ▄▀▀▀▀▄▄▄▄▄▀▀▀▄████
████ █▄▄▄█ █ ▄▀▀▀▀▄▄▄▄▄▀▀▀▄▀████
████▄▄▄▄▄▄▄█▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄████
█████████████████████████████████
█████████████████████████████████

📱 Installation Steps:
   1. Install Expo Go from App Store or Play Store
   2. Open Expo Go app
   3. Tap "Scan QR Code"
   4. Point camera at the QR code above

🔗 Or enter this URL manually in Expo Go:
   exp://192.168.1.100:8081
```

---

## Alternative Commands

### Show QR Code Only
```bash
cd mobile
npm run qr
```

### Use Shell Script
```bash
cd mobile
./start-with-qr.sh
```

### Start with Tunnel (Works on Different Networks)
```bash
cd mobile
npm start -- --tunnel
```

---

## First Time Setup

### 1. Install Expo Go App

**iOS:**
- App Store → Search "Expo Go" → Install
- Or visit: https://apps.apple.com/app/expo-go/id982107779

**Android:**
- Play Store → Search "Expo Go" → Install
- Or visit: https://play.google.com/store/apps/details?id=host.exp.exponent

### 2. Connect to Same WiFi

**Important:** Your phone and computer must be on the same WiFi network!

Check your network:
```bash
# macOS/Linux
ifconfig | grep "inet "

# Windows
ipconfig
```

### 3. Allow Firewall Access

If prompted, allow Node.js to accept incoming connections.

---

## Troubleshooting

### QR Code Not Working?

**Solution 1: Use Tunnel Mode**
```bash
npm start -- --tunnel
```
Works even on different networks (slower but reliable)

**Solution 2: Manual URL Entry**
1. In Expo Go, tap "Enter URL manually"
2. Type: `exp://YOUR_IP:8081`
3. Replace YOUR_IP with your computer's IP

**Solution 3: Clear Cache**
```bash
npm start -- --clear
```

### Can't Connect?

Check:
- ✅ Same WiFi network
- ✅ Firewall allows port 8081
- ✅ Expo Go app is updated
- ✅ Development server is running

---

## Features to Try

Once the app loads:

1. **🏋️ Workout Tracker** - Log your exercises
2. **🥗 Barcode Scanner** - Scan food items
3. **🤖 AI Coach** - Chat with AI fitness coach
4. **📊 Progress Charts** - View your analytics
5. **🌤️ Weather Meals** - Get weather-based meal suggestions

---

## Development Tips

### Live Reload
- Changes auto-reload on your phone
- Save any file to see updates instantly

### Developer Menu
- **iOS**: Shake device or Cmd+D (simulator)
- **Android**: Shake device or Cmd+M (emulator)

### Debug
- Open developer menu
- Tap "Debug Remote JS"
- Chrome DevTools will open

---

## For End Users (Production Apps)

### iOS (TestFlight)
1. Get TestFlight invitation
2. Install TestFlight from App Store
3. Open invitation link
4. Install Fit Fusion

### Android (APK)
1. Download APK from releases
2. Enable "Install from Unknown Sources"
3. Install APK
4. Open Fit Fusion

---

## Need More Help?

- **Expo QR Guide**: [mobile/EXPO_QR_GUIDE.md](mobile/EXPO_QR_GUIDE.md)
- **Installation Guide**: [APP_INSTALL.md](APP_INSTALL.md)
- **Troubleshooting**: [mobile/TROUBLESHOOTING.md](mobile/TROUBLESHOOTING.md)
- **GitHub Issues**: https://github.com/yash1262/Fit-Fusion-mobile-app/issues

---

**Ready to start? Run `cd mobile && npm start` and scan the QR code! 🚀**
