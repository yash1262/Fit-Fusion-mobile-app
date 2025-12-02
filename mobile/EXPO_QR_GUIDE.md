# 📱 Expo Go QR Code Guide

## Quick Start with QR Code

### Method 1: Automatic QR Code Display (Recommended)

When you run the app, a QR code will automatically appear in your terminal!

```bash
cd mobile
npm install
npm start
```

The Expo development server will show a QR code that you can scan with:
- **iOS**: Camera app or Expo Go app
- **Android**: Expo Go app

### Method 2: Show QR Code Separately

If you want to see the QR code again without restarting:

```bash
cd mobile
npm run qr
```

### Method 3: Use the Shell Script

```bash
cd mobile
./start-with-qr.sh
```

---

## 📱 Install Expo Go App

### iOS (iPhone/iPad)
1. Open App Store
2. Search for "Expo Go"
3. Install the app
4. Open Expo Go

### Android
1. Open Google Play Store
2. Search for "Expo Go"
3. Install the app
4. Open Expo Go

**Download Links:**
- iOS: https://apps.apple.com/app/expo-go/id982107779
- Android: https://play.google.com/store/apps/details?id=host.exp.exponent

---

## 🔍 How to Scan the QR Code

### On iOS:
**Option 1: Using Camera App**
1. Open the default Camera app
2. Point at the QR code
3. Tap the notification that appears
4. App will open in Expo Go

**Option 2: Using Expo Go**
1. Open Expo Go app
2. Tap "Scan QR Code"
3. Point at the QR code
4. App will load automatically

### On Android:
1. Open Expo Go app
2. Tap "Scan QR Code"
3. Point at the QR code
4. App will load automatically

---

## 🌐 Connect to Same Network

**IMPORTANT:** Your phone and computer must be on the same WiFi network!

### Check Your Connection:

**On Computer:**
```bash
# macOS/Linux
ifconfig | grep "inet "

# Windows
ipconfig
```

**On Phone:**
- Go to Settings → WiFi
- Check connected network name
- Make sure it matches your computer's network

### Troubleshooting Network Issues:

If QR code doesn't work:

1. **Use Tunnel Mode:**
   ```bash
   npm start -- --tunnel
   ```
   This works even on different networks but is slower.

2. **Use LAN Mode:**
   ```bash
   npm start -- --lan
   ```
   Uses your local IP address.

3. **Manual Connection:**
   - In Expo Go, tap "Enter URL manually"
   - Type: `exp://YOUR_IP:8081`
   - Replace YOUR_IP with your computer's IP address

---

## 🎯 What You'll See

After scanning the QR code:

1. **Loading Screen** - Expo Go downloads your app
2. **Splash Screen** - Fit Fusion logo appears
3. **Landing Page** - Welcome to Fit Fusion!

---

## 🔄 Live Reload

Once connected, any changes you make to the code will automatically reload on your phone!

- **Fast Refresh**: Changes appear instantly
- **Shake Device**: Opens developer menu
- **Two-Finger Long Press**: Opens developer menu (iOS)

---

## 🛠️ Developer Menu

Shake your device or press:
- **iOS**: Cmd+D (simulator) or shake device
- **Android**: Cmd+M (emulator) or shake device

Options:
- Reload
- Debug Remote JS
- Show Performance Monitor
- Toggle Element Inspector

---

## 📊 QR Code Information

The QR code contains:
- Your local IP address
- Port number (usually 8081)
- Protocol (exp://)

Example: `exp://192.168.1.100:8081`

---

## 🚨 Common Issues

### QR Code Not Scanning

**Solution 1:** Make sure:
- Phone and computer on same WiFi
- Firewall not blocking port 8081
- Expo Go app is updated

**Solution 2:** Use tunnel mode:
```bash
npm start -- --tunnel
```

**Solution 3:** Enter URL manually in Expo Go

### "Unable to Connect"

**Check:**
1. Is the development server running?
2. Are you on the same network?
3. Is your firewall blocking connections?

**Fix:**
```bash
# Restart the server
npm start -- --clear

# Or use tunnel
npm start -- --tunnel
```

### "Network Response Timed Out"

**Solution:**
```bash
# Use tunnel mode (slower but more reliable)
npm start -- --tunnel
```

### App Crashes on Load

**Solution:**
```bash
# Clear cache and restart
npm start -- --clear
```

---

## 📱 Share Your App

### Generate Shareable QR Code

1. **Start with Tunnel:**
   ```bash
   npm start -- --tunnel
   ```

2. **Share the QR Code:**
   - Take a screenshot
   - Share with testers
   - They can scan from anywhere!

### Create Permanent QR Code

For GitHub or documentation:

```bash
# Get your Expo URL
npm start

# Generate QR code image
# Use: https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=YOUR_EXPO_URL
```

---

## 🎨 Customize QR Display

Edit `mobile/show-qr.js` to customize:
- QR code size
- Colors
- Additional information
- Branding

---

## 📖 Additional Resources

- [Expo Go Documentation](https://docs.expo.dev/get-started/expo-go/)
- [Expo Development](https://docs.expo.dev/develop/development-builds/introduction/)
- [Troubleshooting Guide](https://docs.expo.dev/troubleshooting/overview/)

---

## 🎯 Next Steps

After scanning and loading:

1. **Sign Up** - Create your account
2. **Set Goals** - Define your fitness objectives
3. **Track Workouts** - Log your first workout
4. **Scan Food** - Try the barcode scanner
5. **AI Coach** - Chat with your AI fitness coach

---

## 💡 Pro Tips

1. **Keep Expo Go Open** - Faster reconnection
2. **Use Tunnel for Demos** - Works anywhere
3. **Shake for Menu** - Quick access to tools
4. **Enable Fast Refresh** - Instant updates
5. **Check Network** - Same WiFi = faster loading

---

## 🆘 Need Help?

- Check [TROUBLESHOOTING.md](TROUBLESHOOTING.md)
- Open an issue on GitHub
- Check Expo documentation
- Join Expo Discord community

---

**Happy Testing! 🚀**
