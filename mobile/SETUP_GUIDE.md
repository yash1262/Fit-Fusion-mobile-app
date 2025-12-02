# FitFusion Mobile App - Complete Setup Guide

## 🚀 Quick Start

This guide will help you convert your FitFusion web app to a fully functional React Native mobile app with real-time step tracking and notifications.

---

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

### Required Software
- **Node.js** (v18 or higher): https://nodejs.org/
- **npm** or **yarn**: Comes with Node.js
- **Expo CLI**: `npm install -g expo-cli`
- **Git**: https://git-scm.com/

### For iOS Development (Mac only)
- **Xcode** (latest version from App Store)
- **CocoaPods**: `sudo gem install cocoapods`
- **iOS Simulator** (included with Xcode)

### For Android Development
- **Android Studio**: https://developer.android.com/studio
- **Android SDK** (API 33 or higher)
- **Android Emulator** or physical device

---

## 📁 Project Structure

```
mobile/
├── src/
│   ├── screens/           # All app screens
│   │   ├── SplashScreen.tsx
│   │   ├── LandingScreen.tsx
│   │   ├── SignInScreen.tsx
│   │   ├── SignUpScreen.tsx
│   │   ├── DashboardScreen.tsx
│   │   ├── WorkoutScreen.tsx
│   │   ├── DietScreen.tsx
│   │   ├── ProgressScreen.tsx
│   │   ├── ProfileScreen.tsx
│   │   ├── NotificationSettingsScreen.tsx
│   │   ├── AiCoachScreen.tsx
│   │   └── SmartWorkoutScreen.tsx
│   ├── services/          # Business logic
│   │   ├── activityTrackingService.ts
│   │   ├── stepTrackingService.ts
│   │   ├── notificationService.ts
│   │   ├── weatherService.ts
│   │   └── mealSuggestionService.ts
│   └── config/
│       └── firebaseConfig.ts
├── App.tsx                # Main app component
├── package.json           # Dependencies
├── app.json              # Expo configuration
├── tsconfig.json         # TypeScript config
└── babel.config.js       # Babel config
```

---

## 🛠️ Installation Steps

### Step 1: Navigate to Mobile Directory
```bash
cd mobile
```

### Step 2: Install Dependencies
```bash
npm install
```

Or with yarn:
```bash
yarn install
```

### Step 3: Install Expo Dependencies
```bash
npx expo install expo-sensors expo-notifications expo-location expo-device
npx expo install @react-native-async-storage/async-storage
npx expo install react-native-linear-gradient
npx expo install react-native-vector-icons
```

### Step 4: Configure Firebase

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project (or create a new one)
3. Add an iOS app and/or Android app
4. Download the configuration files:
   - iOS: `GoogleService-Info.plist`
   - Android: `google-services.json`

5. Update `src/config/firebaseConfig.ts` with your Firebase credentials:
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

### Step 5: Configure OpenWeather API

Update `src/services/weatherService.ts` with your API key:
```typescript
const OPENWEATHER_API_KEY = 'YOUR_OPENWEATHER_API_KEY';
```

Get your free API key at: https://openweathermap.org/api

---

## 🏃 Running the App

### Development Mode (Expo Go)

1. **Start the development server:**
```bash
npx expo start
```

2. **Run on iOS Simulator:**
```bash
npx expo start --ios
```

3. **Run on Android Emulator:**
```bash
npx expo start --android
```

4. **Run on Physical Device:**
   - Install **Expo Go** app from App Store or Play Store
   - Scan the QR code shown in terminal

---

## 📱 Platform-Specific Setup

### iOS Setup

1. **Install CocoaPods dependencies:**
```bash
cd ios
pod install
cd ..
```

2. **Update Info.plist** (ios/FitFusion/Info.plist):
```xml
<key>NSMotionUsageDescription</key>
<string>We need access to your motion data to track your steps and activity.</string>
<key>NSLocationWhenInUseUsageDescription</key>
<string>We need your location to provide weather-based meal suggestions.</string>
<key>NSUserNotificationsUsageDescription</key>
<string>We need permission to send you health reminders and notifications.</string>
```

3. **Enable Background Modes:**
   - Open project in Xcode
   - Select target → Signing & Capabilities
   - Add "Background Modes" capability
   - Enable "Background fetch" and "Remote notifications"

### Android Setup

1. **Update AndroidManifest.xml** (android/app/src/main/AndroidManifest.xml):
```xml
<uses-permission android:name="android.permission.ACTIVITY_RECOGNITION" />
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
<uses-permission android:name="android.permission.POST_NOTIFICATIONS" />
<uses-permission android:name="android.permission.RECEIVE_BOOT_COMPLETED" />
```

2. **Update build.gradle** (android/app/build.gradle):
```gradle
android {
    compileSdkVersion 33
    defaultConfig {
        minSdkVersion 23
        targetSdkVersion 33
    }
}
```

---

## ✨ Key Features

### 1. Real-Time Step Tracking
- Automatic step counting using device motion sensors
- Background tracking (even when app is closed)
- Historical step data for past 7 days
- Real-time sync across all screens

**How it works:**
- Uses `expo-sensors` Pedometer API
- Tracks steps from midnight to current time
- Updates activity data automatically
- Calculates calories based on steps

### 2. Smart Notifications
- Morning water reminders (default: 7:00 AM)
- Weather-based meal suggestions (default: 7:30 AM)
- Customizable notification times
- One notification per day (no spam)

**How it works:**
- Uses `expo-notifications` for local notifications
- Fetches real-time weather data
- Generates personalized meal recommendations
- Schedules recurring daily notifications

### 3. Weather-Based Meal Suggestions
- Hot weather: Cooling meals (smoothies, salads)
- Cold weather: Warming meals (oatmeal, eggs)
- Rainy weather: Comfort foods (chai, upma)
- Humid weather: Light meals (fruits, raita)
- Cloudy weather: Balanced meals

### 4. Activity Tracking
- Steps, calories, active minutes
- Hydration tracking (water glasses)
- Workout completion
- Sleep, stress, mood tracking
- Real-time sync using EventEmitter

---

## 🔧 Troubleshooting

### Common Issues

#### 1. "Module not found" errors
```bash
# Clear cache and reinstall
rm -rf node_modules
npm install
npx expo start --clear
```

#### 2. Step tracking not working
- Ensure device has motion sensors (not available on simulators)
- Check permissions in device settings
- Test on physical device, not emulator

#### 3. Notifications not appearing
- Check notification permissions in device settings
- Ensure app is not in Do Not Disturb mode
- Test on physical device (notifications don't work on simulators)

#### 4. Firebase authentication errors
- Verify Firebase configuration is correct
- Enable Email/Password authentication in Firebase Console
- Check internet connection

#### 5. Weather API not working
- Verify OpenWeather API key is valid
- Check location permissions
- Wait 1-2 hours for new API keys to activate

---

## 📦 Building for Production

### Build for iOS

1. **Create Expo build:**
```bash
eas build --platform ios
```

2. **Or build locally:**
```bash
npx expo run:ios --configuration Release
```

3. **Submit to App Store:**
```bash
eas submit --platform ios
```

### Build for Android

1. **Create Expo build:**
```bash
eas build --platform android
```

2. **Or build locally:**
```bash
npx expo run:android --variant release
```

3. **Submit to Play Store:**
```bash
eas submit --platform android
```

---

## 🎨 Customization

### Change App Colors

Update colors in each screen's StyleSheet:
```typescript
const styles = StyleSheet.create({
  primaryColor: '#708d50',  // Your brand color
  secondaryColor: '#5a7340',
  // ... other styles
});
```

### Change App Icon

Replace files in `assets/` directory:
- `icon.png` (1024x1024)
- `adaptive-icon.png` (1024x1024)
- `splash.png` (1242x2436)

### Change App Name

Update `app.json`:
```json
{
  "expo": {
    "name": "Your App Name",
    "slug": "your-app-slug"
  }
}
```

---

## 📊 Testing

### Test Step Tracking
1. Open app on physical device
2. Go to Dashboard
3. Walk around for 1-2 minutes
4. Check if step count increases

### Test Notifications
1. Go to Profile → Notification Settings
2. Enable notifications
3. Click "Test Water Reminder"
4. Check if notification appears

### Test Weather Integration
1. Go to Diet screen
2. Check if weather banner shows current weather
3. Verify meal suggestions match weather

---

## 🚀 Deployment Checklist

Before deploying to production:

- [ ] Update Firebase configuration
- [ ] Add OpenWeather API key
- [ ] Test on physical iOS device
- [ ] Test on physical Android device
- [ ] Test step tracking
- [ ] Test notifications
- [ ] Test weather integration
- [ ] Update app icon and splash screen
- [ ] Update app name and version
- [ ] Test sign up/sign in flow
- [ ] Test all navigation flows
- [ ] Check permissions are requested properly
- [ ] Test offline functionality
- [ ] Optimize images and assets
- [ ] Remove console.log statements
- [ ] Add error tracking (Sentry, etc.)
- [ ] Add analytics (Firebase Analytics, etc.)

---

## 📚 Additional Resources

- **Expo Documentation**: https://docs.expo.dev/
- **React Native Documentation**: https://reactnative.dev/
- **Firebase Documentation**: https://firebase.google.com/docs
- **OpenWeather API**: https://openweathermap.org/api
- **React Navigation**: https://reactnavigation.org/

---

## 🆘 Support

If you encounter any issues:

1. Check the troubleshooting section above
2. Search for similar issues on GitHub
3. Check Expo forums: https://forums.expo.dev/
4. Check Stack Overflow with tag `react-native`

---

## 📝 License

MIT License - Feel free to use this code for your projects!

---

## 🎉 You're All Set!

Your FitFusion mobile app is now ready to transform users' fitness journeys with:
- ✅ Real-time step tracking
- ✅ Smart morning notifications
- ✅ Weather-based meal suggestions
- ✅ Comprehensive activity tracking
- ✅ Beautiful, responsive UI

**Happy coding! 💪📱**
