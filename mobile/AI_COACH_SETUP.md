# 🤖 AI Coach Setup Guide - Mobile App

## Issue: AI Coach Not Giving Proper Responses

The mobile app needs to connect to the Gemini server, but `localhost` doesn't work the same way in React Native.

## Solution: Network Configuration

### For Android Emulator:
Use `10.0.2.2` instead of `localhost`

### For iOS Simulator:
Use `localhost` (works fine)

### For Physical Device:
Use your computer's local IP address (e.g., `192.168.1.100`)

## Setup Steps

### 1. Start Gemini Server

```bash
cd server
python3 gemini_ai_server.py
```

Server will start on: `http://localhost:5002`

### 2. Find Your Computer's IP Address

**On Mac/Linux:**
```bash
ifconfig | grep "inet " | grep -v 127.0.0.1
```

**On Windows:**
```bash
ipconfig
```

Look for something like: `192.168.1.100` or `10.0.0.5`

### 3. Update Mobile App (if needed)

The app already tries multiple URLs automatically:
- `http://10.0.2.2:5002` (Android emulator)
- `http://localhost:5002` (iOS simulator)
- `http://192.168.1.1:5002` (Physical device - update with your IP)

To update for your network, edit `mobile/src/screens/AiCoachScreen.tsx`:

```typescript
const serverUrls = [
  'http://10.0.2.2:5002/api/chatbot/message', // Android emulator
  'http://localhost:5002/api/chatbot/message', // iOS simulator
  'http://YOUR_IP_HERE:5002/api/chatbot/message', // Replace with your IP
];
```

### 4. Test Connection

**Check if Gemini server is running:**
```bash
curl http://localhost:5002/api/health
```

Should return:
```json
{
  "status": "ok",
  "message": "AI Coach Gemini server is running"
}
```

### 5. Test in Mobile App

1. Open AI Coach screen
2. Send a message
3. Watch console logs:
   - ✅ "Gemini server connected" = Working!
   - ❌ "Failed to connect" = Falls back to local AI
   - 📱 "Using enhanced local AI service" = Fallback active

## Features

### AI Coach Now Has:
✅ **Multiple server fallbacks** - Tries Android, iOS, and network URLs
✅ **2-second thinking animation** - Shows AI is processing
✅ **Fast typing animation** - Types response in 1-2 seconds
✅ **Enhanced local AI** - Works even without Gemini server
✅ **Context-aware responses** - Uses your activity data
✅ **Conversation history** - Remembers previous messages

### Local AI Service:
The app includes a comprehensive local AI service that works without the Gemini server:
- Workout plans (beginner, HIIT, cardio, strength)
- Nutrition advice (weight loss, muscle gain, meal planning)
- Goal setting and progress tracking
- Motivation and mindset coaching
- Diet-specific recommendations

## Troubleshooting

### "AI Coach not responding properly"

**Check 1: Is Gemini server running?**
```bash
# In server directory
python3 gemini_ai_server.py
```

**Check 2: Can you reach the server?**
```bash
# From your computer
curl http://localhost:5002/api/health

# From Android emulator
adb shell
curl http://10.0.2.2:5002/api/health
```

**Check 3: Check mobile app logs**
Look for these messages in Metro bundler:
- "✅ Gemini server connected" = Good!
- "❌ Failed to connect" = Server unreachable
- "📱 Using enhanced local AI service" = Fallback working

### "Responses are generic"

If using local AI fallback:
- Responses are still intelligent but not as advanced as Gemini
- Local AI covers: workouts, nutrition, goals, motivation
- To get Gemini responses, ensure server is running and reachable

### "Can't connect from physical device"

1. Make sure phone and computer are on same WiFi
2. Find your computer's IP: `ifconfig` (Mac/Linux) or `ipconfig` (Windows)
3. Update the IP in `AiCoachScreen.tsx`
4. Restart the app

### "Server starts but app can't connect"

**For Android Emulator:**
- Use `10.0.2.2:5002` (already configured)

**For iOS Simulator:**
- Use `localhost:5002` (already configured)

**For Physical Device:**
- Update IP in code to your computer's local IP
- Make sure firewall allows port 5002

## Testing Different Scenarios

### Test 1: With Gemini Server
1. Start Gemini server
2. Send message in AI Coach
3. Should see "✅ Gemini server connected" in logs
4. Get advanced AI responses

### Test 2: Without Gemini Server
1. Stop Gemini server (Ctrl+C)
2. Send message in AI Coach
3. Should see "📱 Using enhanced local AI service"
4. Still get intelligent responses (local AI)

### Test 3: Network Issues
1. Disconnect WiFi
2. Send message
3. Falls back to local AI automatically
4. No errors, seamless experience

## What's Working Now

✅ **AI Coach Screen** - Full chat interface
✅ **Gemini Integration** - Connects to server when available
✅ **Fallback AI** - Works without server
✅ **Thinking Animation** - 2 seconds before response
✅ **Typing Animation** - Fast 1-2 second typing
✅ **Context Awareness** - Uses your activity data
✅ **Conversation History** - Remembers chat
✅ **Error Handling** - Graceful fallbacks

## New Feature: Meal Logger

✅ **Log Meals** button added to Dashboard
✅ **Search 15+ foods** with full nutrition data
✅ **Track calories, protein, carbs, fats, fiber**
✅ **Daily nutrition summary** with progress bars
✅ **Meal types**: Breakfast, Lunch, Dinner, Snacks
✅ **Visual macro tracking** with color-coded progress

### Food Database Includes:
- Grilled Chicken, Salmon, Eggs
- Brown Rice, Quinoa, Oatmeal
- Broccoli, Sweet Potato, Avocado
- Greek Yogurt, Almonds, Peanut Butter
- Protein Shake, Banana, Apple
- And more!

## Summary

The AI Coach is now fully functional with:
1. **Gemini server integration** (when available)
2. **Enhanced local AI fallback** (always works)
3. **Proper network configuration** (Android/iOS/Physical)
4. **Smooth animations** (thinking + typing)
5. **Context-aware responses** (uses your data)

Plus the new **Meal Logger** feature for complete nutrition tracking!

---

**Everything is ready to use!** 🚀
