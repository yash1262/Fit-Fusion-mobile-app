# 🚀 FitFusion Mobile - Quick Start (5 Minutes)

## Step 1: Install Dependencies (2 min)

```bash
cd mobile
npm install
```

## Step 2: Configure Firebase (1 min)

Edit `src/config/firebaseConfig.ts`:

```typescript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

Get your config from: https://console.firebase.google.com/

## Step 3: Add Weather API Key (30 sec)

Edit `src/services/weatherService.ts`:

```typescript
const OPENWEATHER_API_KEY = 'YOUR_API_KEY';
```

Get free API key from: https://openweathermap.org/api

## Step 4: Run the App (1 min)

```bash
npx expo start
```

Then:
- Press `i` for iOS
- Press `a` for Android
- Or scan QR code with Expo Go app

## Step 5: Test Features (30 sec)

1. Sign up with email/password
2. Check Dashboard - see step tracking status
3. Go to Profile → Notification Settings
4. Enable notifications and test them

## ✅ Done!

Your mobile app is running with:
- ✅ Real-time step tracking
- ✅ Smart notifications
- ✅ Weather-based meals
- ✅ All features from web app

## 🆘 Issues?

See `SETUP_GUIDE.md` for detailed troubleshooting.

## 📱 Test on Physical Device

1. Install **Expo Go** from App Store or Play Store
2. Scan QR code from terminal
3. Walk around to test step tracking
4. Test notifications

**That's it! You're ready to go! 🎉**
