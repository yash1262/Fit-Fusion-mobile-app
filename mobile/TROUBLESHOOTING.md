# 🔧 Troubleshooting "Could Not Connect to Server"

## Quick Fixes (Try in Order)

### Fix 1: Restart Metro Bundler
```bash
# Stop any running processes (Ctrl+C)
# Then restart:
cd mobile
npx expo start --clear
```

### Fix 2: Check if Port is Blocked
```bash
# Kill any process using port 8081
lsof -ti:8081 | xargs kill -9

# Or use port 19000
lsof -ti:19000 | xargs kill -9

# Then restart
npx expo start --clear
```

### Fix 3: Reset Everything
```bash
cd mobile
rm -rf node_modules
rm -rf .expo
rm package-lock.json
npm install
npx expo start --clear
```

### Fix 4: Use Tunnel Mode
```bash
cd mobile
npx expo start --tunnel
```

This creates a public URL that works even with firewall issues.

---

## 🎯 Recommended: Use Expo Go on iPhone

This is the **easiest and most reliable** way:

### Step 1: Install Expo Go
- Open **App Store** on your iPhone
- Search for **"Expo Go"**
- Install it

### Step 2: Start the Server
```bash
cd mobile
npx expo start
```

### Step 3: Scan QR Code
- Open **Camera** app on iPhone
- Point at the QR code in terminal
- Tap the notification
- App opens in Expo Go! ✅

**This bypasses all simulator issues!**

---

## Alternative: Use Web Browser

Test the app in your browser first:

```bash
cd mobile
npx expo start --web
```

This opens in Chrome/Safari - perfect for testing UI!

---

## If You Must Use iOS Simulator

### Option 1: Use Expo's iOS Simulator
```bash
cd mobile
npx expo start
# Press 'i' when it's ready
```

### Option 2: Open Simulator First
```bash
# Open simulator manually
open -a Simulator

# Wait for it to fully load
# Then run:
cd mobile
npx expo start
# Press 'i'
```

---

## Common Issues & Solutions

### Issue: "Expo Go not installed"
**Solution:** Install Expo Go on your iPhone from App Store

### Issue: "Network error"
**Solution:** Make sure iPhone and computer are on same WiFi

### Issue: "Metro bundler not starting"
**Solution:** 
```bash
# Clear watchman
watchman watch-del-all

# Clear metro cache
rm -rf /tmp/metro-*

# Restart
npx expo start --clear
```

### Issue: "Port already in use"
**Solution:**
```bash
# Kill the process
lsof -ti:8081 | xargs kill -9
npx expo start
```

---

## 🚀 Best Development Setup

1. **Use Expo Go on iPhone** - Most reliable
2. **Use web browser** - Fast for UI testing
3. **Use iOS simulator** - Only when needed

**Most developers use physical devices because:**
- ✅ Real sensors (step tracking)
- ✅ Real notifications
- ✅ Faster
- ✅ No connection issues
- ✅ Better testing

---

## Step-by-Step: Fresh Start

```bash
# 1. Go to mobile folder
cd mobile

# 2. Clean everything
rm -rf node_modules .expo package-lock.json

# 3. Install dependencies
npm install

# 4. Start with tunnel (most reliable)
npx expo start --tunnel

# 5. Scan QR code with Expo Go on iPhone
```

---

## Still Not Working?

### Check These:

1. **Is Metro running?**
   - You should see "Metro waiting on exp://..." in terminal
   - If not, something is blocking it

2. **Is your firewall blocking it?**
   - Try `--tunnel` mode
   - Or temporarily disable firewall

3. **Are you on the same network?**
   - iPhone and computer must be on same WiFi
   - Or use `--tunnel` mode

4. **Is Expo Go installed?**
   - Must be installed from App Store
   - Not the old "Expo Client"

---

## Quick Test

Run this to verify everything works:

```bash
cd mobile
npx expo start --web
```

If this works, your code is fine - it's just a connection issue.

---

## My Recommendation

**Stop fighting with the simulator!** 

Use Expo Go on your iPhone:
1. Install Expo Go from App Store
2. Run `npx expo start --tunnel`
3. Scan QR code
4. Done! ✅

This is how most React Native developers work. The simulator is only for final testing.

---

## Need Help?

Run these diagnostic commands:

```bash
# Check Node version (should be 18+)
node --version

# Check npm version
npm --version

# Check Expo CLI
npx expo --version

# Check if port is free
lsof -i:8081
lsof -i:19000
```

Send me the output if you're still stuck!
