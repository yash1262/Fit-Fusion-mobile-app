# 🚀 How to Run Fit Fusion App

## ⚠️ Important: Expo Go QR Code

**The Expo Go QR code is NOT in GitHub!**

The QR code is **dynamically generated** when you run the development server on your computer.

---

## 📱 For Developers (Run Locally)

### Step 1: Start the Development Server

```bash
cd mobile
npm install
npm start
```

### Step 2: Look at Your Terminal

You'll see something like this:

```
╔════════════════════════════════════════════════════════════╗
║              📱 FIT FUSION - EXPO GO QR CODE              ║
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

📱 Scan THIS QR code with your phone!
```

### Step 3: Scan the QR Code

**On iOS:**
1. Open Camera app
2. Point at the QR code in your terminal
3. Tap the notification
4. App opens in Expo Go

**On Android:**
1. Open Expo Go app
2. Tap "Scan QR Code"
3. Point at the QR code in your terminal
4. App loads automatically

---

## 🎯 What Each QR Code Does

### ❌ GitHub QR Codes (In README)
- These point to GitHub repository
- Used for sharing the project
- **NOT for running the app**

### ✅ Terminal QR Code (When you run `npm start`)
- Points to your local development server
- Format: `exp://192.168.1.100:8081`
- **THIS is what you scan to run the app**

---

## 🔍 Why Two Different QR Codes?

### GitHub QR Codes:
- **Purpose**: Share the project repository
- **Scans to**: GitHub website
- **Use case**: Show others your code

### Expo Development QR Code:
- **Purpose**: Run the app on your phone
- **Scans to**: Your local development server
- **Use case**: Test the app while developing

---

## 📋 Complete Workflow

### For Development:

1. **Clone the repo:**
   ```bash
   git clone https://github.com/yash1262/Fit-Fusion-mobile-app.git
   cd Fit-Fusion-mobile-app
   ```

2. **Install dependencies:**
   ```bash
   cd mobile
   npm install
   ```

3. **Start the server:**
   ```bash
   npm start
   ```

4. **Scan QR from terminal:**
   - Use Expo Go app
   - Scan the QR code that appears in your terminal
   - App loads on your phone

### For End Users:

1. **iOS Users:**
   - Get TestFlight invitation
   - Install via TestFlight
   - No QR code needed

2. **Android Users:**
   - Download APK from releases
   - Install APK
   - No QR code needed

---

## 🛠️ Troubleshooting

### "QR Code Opens GitHub Instead of App"

**Problem:** You're scanning the QR code from GitHub README

**Solution:** 
1. Run `npm start` in the mobile folder
2. Scan the QR code from your **terminal**, not from GitHub
3. The terminal QR code is the correct one

### "Can't Find QR Code in Terminal"

**Solution:**
```bash
cd mobile
npm start
```

Wait a few seconds, the QR code will appear.

If it doesn't show, try:
```bash
npm start -- --clear
```

### "QR Code Not Scanning"

**Solution 1:** Use tunnel mode
```bash
npm start -- --tunnel
```

**Solution 2:** Enter URL manually
1. Look for the URL in terminal (e.g., `exp://192.168.1.100:8081`)
2. In Expo Go, tap "Enter URL manually"
3. Type the URL

---

## 📸 Visual Guide

### ❌ Wrong: Scanning GitHub QR Code
```
GitHub README → QR Code → Opens GitHub Website ❌
```

### ✅ Correct: Scanning Terminal QR Code
```
npm start → Terminal QR Code → Opens App in Expo Go ✅
```

---

## 🎓 Quick Reference

| QR Code Location | What It Does | When to Use |
|-----------------|--------------|-------------|
| GitHub README | Opens GitHub repo | Share project with others |
| Terminal (after `npm start`) | Runs app in Expo Go | Development & testing |
| TestFlight Link | Installs iOS beta | End users (iOS) |
| APK Download | Installs Android app | End users (Android) |

---

## 💡 Pro Tips

1. **Always run `npm start` first** before scanning
2. **Scan from terminal**, not from GitHub
3. **Same WiFi network** required (or use tunnel mode)
4. **Keep terminal open** while using the app
5. **Shake device** to open developer menu

---

## 🆘 Still Having Issues?

1. Check [START_APP.md](START_APP.md) for detailed instructions
2. Read [mobile/EXPO_QR_GUIDE.md](mobile/EXPO_QR_GUIDE.md) for troubleshooting
3. Open an issue on GitHub
4. Make sure Expo Go app is installed and updated

---

## 📱 Install Expo Go

**iOS:** https://apps.apple.com/app/expo-go/id982107779

**Android:** https://play.google.com/store/apps/details?id=host.exp.exponent

---

**Remember: The magic QR code appears in your terminal when you run `npm start`! 🎯**
