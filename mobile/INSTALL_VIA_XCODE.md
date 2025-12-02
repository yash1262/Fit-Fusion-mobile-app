# Install FitFusion on iPhone via Xcode (FREE) 📱

## Complete Step-by-Step Guide

This method installs your app directly on iPhone using Xcode - **100% FREE**, no $99 payment needed!

---

## Prerequisites ✅

- Mac computer
- iPhone
- USB cable (Lightning or USB-C)
- Xcode installed
- FREE Apple ID

---

## Step 1: Install Xcode (if not installed)

### Check if Xcode is installed:
```bash
xcode-select -p
```

If you see a path, Xcode is installed. If not:

### Install Xcode:
1. Open **App Store** on Mac
2. Search **"Xcode"**
3. Click **"Get"** (it's FREE, but large ~12GB)
4. Wait for download (30-60 minutes)
5. Open Xcode once to complete setup

### Or install Command Line Tools only:
```bash
xcode-select --install
```

---

## Step 2: Connect iPhone to Mac

1. **Connect iPhone** to Mac with USB cable
2. **Unlock iPhone**
3. If prompted "Trust This Computer?" → Tap **"Trust"**
4. Enter iPhone passcode

### Verify connection:
```bash
# List connected devices
xcrun xctrace list devices
```

You should see your iPhone listed.

---

## Step 3: Configure Apple ID in Xcode

### Open Xcode Preferences:
1. Open **Xcode**
2. Go to **Xcode → Settings** (or Preferences)
3. Click **"Accounts"** tab
4. Click **"+"** button
5. Select **"Apple ID"**
6. Sign in with: `yashjambotkar90@gmail.com`
7. Click **"Done"**

Your FREE Apple ID is now configured!

---

## Step 4: Build and Install App

### Method A: Using Expo CLI (Easiest)

```bash
cd mobile

# Build and install on connected iPhone
npx expo run:ios --device
```

This will:
- Detect your connected iPhone
- Build the app
- Install automatically
- Open the app

**Wait 5-10 minutes for first build.**

### Method B: Using Xcode Directly

```bash
cd mobile

# Generate iOS project
npx expo prebuild --platform ios

# Open in Xcode
open ios/fitfusionmobile.xcworkspace
```

Then in Xcode:
1. Select your iPhone from device dropdown (top left)
2. Click **"Run"** button (▶️) or press `Cmd+R`
3. Wait for build
4. App installs and opens on iPhone

---

## Step 5: Trust Developer Certificate

First time installing, you'll need to trust the certificate:

1. On iPhone: **Settings** → **General** → **VPN & Device Management**
2. Under **"Developer App"**, tap your Apple ID email
3. Tap **"Trust [your email]"**
4. Tap **"Trust"** again to confirm
5. Go back to home screen
6. Open FitFusion app

---

## Step 6: Use Your App! 🎉

Your FitFusion app is now installed as a standalone app!

**Features:**
- ✅ Works like real App Store app
- ✅ All features enabled
- ✅ No Expo Go needed
- ✅ Appears on home screen
- ✅ Can use offline

**Limitations:**
- ⏰ Expires after 7 days
- 🔄 Need to reinstall after 7 days
- 📱 Only on your iPhone (can't share easily)

---

## Troubleshooting 🔧

### "No devices found"
**Solution:**
- Reconnect iPhone with USB cable
- Unlock iPhone
- Trust computer
- Run: `xcrun xctrace list devices`

### "Signing requires a development team"
**Solution:**
1. Open Xcode
2. Select project in left sidebar
3. Select target "fitfusionmobile"
4. Go to "Signing & Capabilities" tab
5. Check "Automatically manage signing"
6. Select your Apple ID team

### "Could not launch app"
**Solution:**
- Trust developer certificate on iPhone (Settings → General → VPN & Device Management)
- Restart iPhone
- Try again

### "Build failed"
**Solution:**
```bash
# Clean and rebuild
cd mobile
rm -rf ios
npx expo prebuild --platform ios --clean
npx expo run:ios --device
```

### "iPhone is locked"
**Solution:**
- Unlock iPhone
- Keep it unlocked during installation

---

## Reinstalling After 7 Days

Your app will stop working after 7 days. To reinstall:

```bash
cd mobile

# Reconnect iPhone via USB
# Run build again
npx expo run:ios --device
```

Takes 2-3 minutes to reinstall.

---

## Alternative: Keep Using Expo Go

If reinstalling every 7 days is annoying, just use Expo Go:

```bash
cd mobile
npx expo start
# Scan QR code with iPhone
```

**Expo Go advantages:**
- Never expires
- No USB cable needed
- Instant updates
- Works over WiFi

---

## Comparison

| Method | Duration | Setup | Updates |
|--------|----------|-------|---------|
| **Xcode Install** | 7 days | 10 min | Reinstall |
| **Expo Go** | Forever | 2 min | Instant |
| **TestFlight** | 90 days | 30 min + $99 | Automatic |

---

## Quick Commands Reference

```bash
# Install via Expo CLI
cd mobile
npx expo run:ios --device

# Or generate Xcode project
npx expo prebuild --platform ios
open ios/fitfusionmobile.xcworkspace

# List connected devices
xcrun xctrace list devices

# Clean build
rm -rf ios
npx expo prebuild --platform ios --clean
```

---

## Summary

**To install on iPhone via Xcode (FREE):**

1. ✅ Install Xcode (FREE)
2. ✅ Connect iPhone via USB
3. ✅ Add Apple ID to Xcode (FREE)
4. ✅ Run: `npx expo run:ios --device`
5. ✅ Trust certificate on iPhone
6. ✅ Use app for 7 days
7. 🔄 Reinstall after 7 days

**Cost:** $0 (completely FREE!)

**Time:** 10 minutes first time, 2 minutes to reinstall

---

**This is the best FREE method to get a standalone app on your iPhone!** 🎉
