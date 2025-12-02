# AI Coach Fix for Expo Go 🤖

## Problem
AI Coach was using fallback responses on Expo Go because it was trying to connect to `localhost:5002`, which doesn't work on physical devices (localhost refers to the phone, not your Mac).

## Solution
Updated the app to automatically detect your Mac's local network IP and use that instead.

## What Was Changed

### 1. Created API Configuration
**File:** `mobile/src/config/apiConfig.ts`

This file:
- Automatically detects if running on physical device or simulator
- Gets your Mac's IP address from Expo
- Uses correct URL based on environment:
  - **Simulator:** `http://localhost:5002`
  - **Physical Device:** `http://192.168.29.180:5002` (your Mac's IP)

### 2. Updated AI Coach Screen
**File:** `mobile/src/screens/AiCoachScreen.tsx`

Changes:
- Imports API configuration
- Uses dynamic API URL instead of hardcoded localhost
- Logs API calls for debugging
- Increased timeout to 5 seconds for network requests

## How It Works Now

### On Simulator/Emulator:
```
iPhone Simulator → localhost:5002 → Gemini Server ✅
```

### On Physical Device (Expo Go):
```
Your iPhone → WiFi → 192.168.29.180:5002 → Your Mac → Gemini Server ✅
```

## Testing

### 1. Check Server is Running
```bash
# Should return OK
curl http://192.168.29.180:5002/api/health
```

### 2. Restart Expo
```bash
cd mobile
npx expo start --clear
```

### 3. Open App on iPhone
- Scan QR code with Expo Go
- App will automatically detect it's on physical device
- Will use your Mac's IP address

### 4. Test AI Coach
1. Open AI Coach screen
2. Send a message: "Create a 4 day workout plan"
3. Check console logs in terminal
4. Should see:
   ```
   🌐 API Configuration:
      Base URL: http://192.168.29.180:5002
      Device: Physical
      Platform: ios
   🤖 Calling Gemini API: http://192.168.29.180:5002/api/chatbot/message
   ```

### 5. Verify Response
- Should get detailed, day-by-day workout plan
- NOT generic fallback response
- Response should be personalized

## Console Logs to Look For

### ✅ Success (Real AI):
```
🌐 API Configuration:
   Base URL: http://192.168.29.180:5002
   Device: Physical
   Platform: ios
🤖 Calling Gemini API: http://192.168.29.180:5002/api/chatbot/message
✅ Gemini server connected
```

### ❌ Fallback (Local AI):
```
📱 Using local AI (Gemini unavailable)
```

## Troubleshooting

### Still Getting Fallback Responses?

#### 1. Check Server is Running
```bash
# In terminal, check if Gemini server is running
curl http://192.168.29.180:5002/api/health

# Should return:
# {
#   "status": "ok",
#   "message": "AI Coach Gemini server is running",
#   "model": "gemini-2.0-flash"
# }
```

#### 2. Check Same WiFi Network
- Make sure iPhone and Mac are on **same WiFi**
- Disable VPN on both devices
- Check firewall isn't blocking port 5002

#### 3. Check Firewall
```bash
# On Mac, allow port 5002
# System Preferences → Security & Privacy → Firewall → Firewall Options
# Allow Python to accept incoming connections
```

#### 4. Restart Everything
```bash
# Stop Gemini server (Ctrl+C)
# Stop Expo (Ctrl+C)

# Start Gemini server
cd server
python3 gemini_ai_server.py

# In new terminal, start Expo
cd mobile
npx expo start --clear

# Rescan QR code on iPhone
```

#### 5. Check IP Address
```bash
# Get your Mac's IP
ifconfig | grep "inet " | grep -v 127.0.0.1

# Should match the IP in console logs
```

#### 6. Manual IP Override (if needed)
If automatic detection fails, you can hardcode the IP:

Edit `mobile/src/config/apiConfig.ts`:
```typescript
export const getApiBaseUrl = (): string => {
  // Force your Mac's IP
  return 'http://192.168.29.180:5002';
};
```

### Network Request Failed?

**Possible causes:**
1. **Different WiFi networks** - Connect both to same network
2. **VPN active** - Disable VPN on both devices
3. **Firewall blocking** - Allow Python in firewall
4. **Server not running** - Check server is running on port 5002
5. **Wrong IP** - Verify IP address is correct

### How to Verify IP is Correct

**On Mac:**
```bash
# Get IP address
ifconfig | grep "inet " | grep -v 127.0.0.1

# Test server is accessible
curl http://YOUR_IP:5002/api/health
```

**On iPhone:**
- Open Safari
- Go to: `http://192.168.29.180:5002/api/health`
- Should see JSON response
- If it works in Safari, it will work in app

## Expected Behavior

### Before Fix:
```
User: "Create a workout plan"
AI: "I'd love to help with your workout! Could you tell me more about your fitness level?"
```
(Generic fallback response)

### After Fix:
```
User: "Create a workout plan"
AI: "Hey there! 💪 Let's create a solid 4-day workout plan for you!

**DAY 1 - UPPER BODY**
Warm-up: 5 minutes light cardio
1. Push-ups: 3 sets × 10 reps
2. Dumbbell rows: 3 sets × 12 reps
..."
```
(Detailed, structured response from Gemini)

## Features Now Working

### ✅ On Expo Go (Physical Device):
- Real-time Gemini AI responses
- Detailed workout plans
- Specific meal suggestions
- Personalized advice
- Conversation history
- All AI Coach features

### ⚠️ Requirements:
- Gemini server must be running
- iPhone and Mac on same WiFi
- Port 5002 not blocked by firewall

## Quick Test Commands

### Test from Mac:
```bash
# Test server locally
curl http://localhost:5002/api/health

# Test server from network
curl http://192.168.29.180:5002/api/health

# Test AI endpoint
curl -X POST http://192.168.29.180:5002/api/chatbot/message \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello"}'
```

### Test from iPhone:
1. Open Safari on iPhone
2. Go to: `http://192.168.29.180:5002/api/health`
3. Should see JSON response
4. If this works, app will work

## Summary

### What Changed:
- ✅ Created automatic IP detection
- ✅ Updated AI Coach to use dynamic URL
- ✅ Added better logging
- ✅ Increased network timeout

### What You Need:
- ✅ Gemini server running on Mac
- ✅ iPhone and Mac on same WiFi
- ✅ Port 5002 accessible

### How to Use:
1. Start Gemini server: `python3 gemini_ai_server.py`
2. Start Expo: `npx expo start --clear`
3. Scan QR code on iPhone
4. Open AI Coach
5. Send message
6. Get real AI responses! 🎉

---

**Your AI Coach should now work with real Gemini responses on Expo Go!** 🚀

If you still see fallback responses, check the console logs and follow the troubleshooting steps above.
