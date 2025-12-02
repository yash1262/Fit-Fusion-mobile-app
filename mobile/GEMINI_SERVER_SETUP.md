# 🤖 Gemini AI Server Setup Guide

## Quick Start

### 1. Install Python Dependencies
```bash
cd server
pip3 install flask flask-cors google-generativeai python-dotenv pillow
```

### 2. Get Gemini API Key (FREE!)
1. Go to: https://makersuite.google.com/app/apikey
2. Click "Create API Key"
3. Copy your key

### 3. Add API Key to .env
```bash
cd server
echo "GEMINI_API_KEY=your_key_here" >> .env
```

Or edit `server/.env` and add:
```
GEMINI_API_KEY=your_actual_api_key_here
```

### 4. Start Gemini Server
```bash
cd server
python3 gemini_ai_server.py
```

You should see:
```
============================================================
🤖 Fit Fusion AI Coach - Gemini Server
============================================================
✅ Gemini API Key: Configured
✅ Model: gemini-2.0-flash (LATEST & FREE!)
✅ Training: Complete (all diets, workouts, etc.)
✅ Rate Limits: NONE (Free tier is generous!)
📡 Server starting on http://localhost:5002
📡 API endpoint: http://localhost:5002/api/chatbot/message
✅ Health check: http://localhost:5002/api/health
============================================================
```

### 5. Test the Server
Open a new terminal:
```bash
curl http://localhost:5002/api/health
```

Should return:
```json
{
  "status": "ok",
  "message": "AI Coach Gemini server is running",
  "model": "gemini-2.0-flash",
  "version": "2.0.0"
}
```

### 6. Start Mobile App
```bash
cd mobile
npx expo start --clear
```

## How It Works

### Mobile App Flow:
1. User sends message in AI Coach
2. Shows thinking animation (2 seconds)
3. Calls Gemini server: `http://localhost:5002/api/chatbot/message`
4. If Gemini works: Uses Gemini response
5. If Gemini fails: Falls back to local AI service
6. Types response with fast animation (1-2 seconds)

### Gemini Server Features:
- ✅ FREE API (generous limits)
- ✅ Latest model: gemini-2.0-flash
- ✅ Trained on all fitness topics
- ✅ Supports conversation history
- ✅ Image analysis support
- ✅ No rate limits on free tier

## Troubleshooting

### Server won't start?
```bash
# Install dependencies
pip3 install flask flask-cors google-generativeai python-dotenv pillow

# Check Python version (need 3.7+)
python3 --version
```

### API Key not working?
1. Make sure you copied the full key
2. Check `.env` file has: `GEMINI_API_KEY=your_key`
3. No spaces around the `=` sign
4. Restart the server after adding key

### Mobile app can't connect?
1. Make sure Gemini server is running on port 5002
2. Check terminal shows "Server starting on http://localhost:5002"
3. Test with: `curl http://localhost:5002/api/health`
4. If fails, app will use fallback AI service (still works!)

### Port 5002 already in use?
```bash
# Kill process on port 5002
lsof -ti:5002 | xargs kill -9

# Or change port in gemini_ai_server.py:
# port = int(os.getenv('PORT', 5003))  # Change to 5003
```

## Features

### AI Coach Capabilities:
- 💪 Workout plans (all types)
- 🥗 Nutrition advice (all diets)
- 🎯 Goal setting
- 📊 Progress tracking
- 🧠 Motivation & mindset
- 💤 Recovery & sleep
- 🏃 Performance optimization

### Supported Diets:
- Keto, Vegan, Vegetarian, Paleo
- Intermittent Fasting, Mediterranean
- Low-Carb, Carnivore, Gluten-Free
- And more!

## Testing

### Test AI Coach:
1. Open mobile app
2. Go to AI Coach
3. Send message: "Create a 4-day workout plan"
4. Watch thinking animation (2 seconds)
5. See typed response (1-2 seconds)

### Test Fallback:
1. Stop Gemini server (Ctrl+C)
2. Send message in AI Coach
3. Should still work with local AI service

## Production Notes

For production deployment:
1. Use environment variables for API key
2. Deploy Gemini server to cloud (Heroku, Railway, etc.)
3. Update mobile app to use production URL
4. Consider rate limiting and authentication

## Support

If you need help:
1. Check server logs in terminal
2. Test health endpoint: `curl http://localhost:5002/api/health`
3. Verify API key is valid
4. Check Python dependencies are installed

---

**Everything is set up and ready to use!** 🚀
