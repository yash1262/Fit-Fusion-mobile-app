# 🔧 Metro Bundler Troubleshooting Guide

## Common Issue: "Opening project..." Stuck

### Quick Fix (Run This First):

```bash
cd mobile
./fix-metro.sh
```

This script automatically:
- Kills existing Metro processes
- Clears all caches
- Restarts Metro with clean state

---

## Manual Troubleshooting Steps

### Step 1: Kill Existing Processes

```bash
# Kill Metro on port 8081
lsof -ti:8081 | xargs kill -9

# Kill Expo on port 19000
lsof -ti:19000 | xargs kill -9

# Kill Expo on port 19001
lsof -ti:19001 | xargs kill -9
```

### Step 2: Clear All Caches

```bash
cd mobile

# Clear Expo cache
rm -rf .expo

# Clear Metro cache
rm -rf node_modules/.cache

# Clear npm cache
npm cache clean --force

# Clear Watchman (if installed)
watchman watch-del-all
```

### Step 3: Start with Clean Cache

```bash
npx expo start --clear
```

---

## Common Causes & Solutions

### 1. Port Already in Use

**Symptom:** "Port 8081 already in use"

**Solution:**
```bash
# Find and kill process
lsof -ti:8081 | xargs kill -9

# Or use different port
npx expo start --port 8082
```

### 2. Cached Bundle Issues

**Symptom:** App stuck on "Opening project" or white screen

**Solution:**
```bash
# Clear cache and restart
npx expo start --clear

# Or reset cache completely
rm -rf .expo node_modules/.cache
npx expo start
```

### 3. Node Modules Corruption

**Symptom:** Random errors, missing modules

**Solution:**
```bash
# Reinstall dependencies
rm -rf node_modules
npm install

# Then start
npx expo start --clear
```

### 4. Watchman Issues (macOS)

**Symptom:** File watching not working, changes not detected

**Solution:**
```bash
# Install Watchman (if not installed)
brew install watchman

# Clear Watchman cache
watchman watch-del-all

# Restart Metro
npx expo start --clear
```

### 5. Network Issues

**Symptom:** Can't connect from phone, QR code not working

**Solution:**
```bash
# Use tunnel mode (slower but more reliable)
npx expo start --tunnel

# Or use LAN mode
npx expo start --lan

# Or localhost (for simulators only)
npx expo start --localhost
```

### 6. Expo Go App Issues

**Symptom:** App won't load in Expo Go

**Solution:**
1. Update Expo Go app on your phone
2. Clear Expo Go cache:
   - iOS: Delete and reinstall Expo Go
   - Android: Settings → Apps → Expo Go → Clear Cache
3. Restart your phone

### 7. Firewall Blocking

**Symptom:** Can't connect from phone on same WiFi

**Solution:**
1. Allow Node.js through firewall
2. Check if ports 8081, 19000, 19001 are open
3. Try tunnel mode: `npx expo start --tunnel`

---

## Advanced Troubleshooting

### Complete Reset

If nothing else works:

```bash
cd mobile

# 1. Kill all processes
lsof -ti:8081,19000,19001 | xargs kill -9

# 2. Remove everything
rm -rf node_modules
rm -rf .expo
rm -rf ios/build
rm -rf ios/Pods
rm -rf android/build
rm -rf android/.gradle

# 3. Clear all caches
npm cache clean --force
watchman watch-del-all  # if installed

# 4. Reinstall
npm install

# 5. Start fresh
npx expo start --clear
```

### Check for Conflicting Processes

```bash
# Check what's using port 8081
lsof -i:8081

# Check all Expo/Metro processes
ps aux | grep -E "expo|metro"

# Kill all Node processes (careful!)
killall node
```

### Verify Installation

```bash
# Check Node version (should be 16+)
node --version

# Check npm version
npm --version

# Check Expo CLI
npx expo --version

# Check if expo is working
npx expo doctor
```

---

## Connection Modes Explained

### 1. LAN Mode (Default)
```bash
npx expo start --lan
```
- **Pros**: Fast, reliable
- **Cons**: Requires same WiFi network
- **Use when**: Testing on physical device on same network

### 2. Tunnel Mode
```bash
npx expo start --tunnel
```
- **Pros**: Works on any network, no WiFi needed
- **Cons**: Slower, requires ngrok
- **Use when**: Different networks, firewall issues

### 3. Localhost Mode
```bash
npx expo start --localhost
```
- **Pros**: Fastest
- **Cons**: Only works with simulators/emulators
- **Use when**: Testing on iOS Simulator or Android Emulator

---

## Error Messages & Solutions

### "Unable to resolve module"
```bash
# Clear cache and reinstall
rm -rf node_modules
npm install
npx expo start --clear
```

### "Metro bundler has encountered an internal error"
```bash
# Reset Metro
rm -rf .expo node_modules/.cache
npx expo start --clear
```

### "Network response timed out"
```bash
# Use tunnel mode
npx expo start --tunnel
```

### "Cannot connect to Metro"
```bash
# Check if Metro is running
lsof -i:8081

# Restart Metro
npx expo start --clear
```

### "Invariant Violation" or "Element type is invalid"
```bash
# Usually a code error, check console
# Or clear cache
npx expo start --clear
```

---

## Performance Optimization

### Speed Up Metro Bundler

1. **Install Watchman** (macOS):
   ```bash
   brew install watchman
   ```

2. **Increase Node Memory**:
   ```bash
   export NODE_OPTIONS=--max_old_space_size=4096
   npx expo start
   ```

3. **Use SSD** for node_modules

4. **Exclude from Antivirus**:
   - Add `node_modules` to antivirus exclusions
   - Add `.expo` to exclusions

---

## Debugging Tips

### Enable Verbose Logging

```bash
# See detailed Metro logs
EXPO_DEBUG=true npx expo start

# See network requests
DEBUG=* npx expo start
```

### Check Metro Config

```bash
# View Metro configuration
cat metro.config.js

# Test Metro directly
npx react-native start --reset-cache
```

### Monitor Performance

```bash
# Check Metro performance
npx expo start --max-workers 4

# Reduce workers if slow
npx expo start --max-workers 2
```

---

## Prevention Tips

### Best Practices

1. **Always use `--clear` flag** when having issues
2. **Keep Expo Go updated** on your phone
3. **Use same WiFi network** for phone and computer
4. **Close other Metro instances** before starting new one
5. **Restart Metro** after installing new packages
6. **Use tunnel mode** for demos/presentations

### Regular Maintenance

```bash
# Weekly cleanup
rm -rf .expo node_modules/.cache
watchman watch-del-all

# Monthly full reset
rm -rf node_modules
npm install
```

---

## Quick Reference

| Issue | Command |
|-------|---------|
| Stuck on "Opening project" | `npx expo start --clear` |
| Port in use | `lsof -ti:8081 \| xargs kill -9` |
| Can't connect | `npx expo start --tunnel` |
| White screen | `rm -rf .expo && npx expo start --clear` |
| Module errors | `rm -rf node_modules && npm install` |
| Complete reset | `./fix-metro.sh` |

---

## Still Having Issues?

1. **Run the fix script**: `./fix-metro.sh`
2. **Check console logs** for specific errors
3. **Try tunnel mode**: `npx expo start --tunnel`
4. **Update everything**:
   ```bash
   npm install -g expo-cli
   npm update
   ```
5. **Restart computer** (seriously, it helps!)
6. **Check GitHub issues**: Search for similar problems
7. **Ask for help**: Open an issue with:
   - Error message
   - Console logs
   - Steps to reproduce
   - Device/OS info

---

## Success Checklist

When Metro is working correctly, you should see:

```
✔ Metro waiting on exp://192.168.1.100:8081
› Scan the QR code above with Expo Go (Android) or the Camera app (iOS)

› Press a │ open Android
› Press i │ open iOS simulator
› Press w │ open web

› Press r │ reload app
› Press m │ toggle menu
› Press ? │ show all commands
```

**If you see this, Metro is working! 🎉**
