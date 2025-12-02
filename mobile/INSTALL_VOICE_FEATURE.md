# Install AI Voice Feature

## Step 1: Install expo-speech Package

Run this command in the `mobile` directory:

```bash
cd mobile
npx expo install expo-speech
```

## Step 2: Clear Cache and Restart

After installation, clear the cache and restart:

```bash
# Clear Metro bundler cache
npx expo start -c

# Or if using npm
npm start -- --reset-cache
```

## Step 3: Rebuild iOS (if needed)

If you're running on iOS simulator or device:

```bash
# For development build
npx expo run:ios

# Or rebuild the app
cd ios
pod install
cd ..
npx expo run:ios
```

## Alternative: Manual Installation

If the above doesn't work, try:

```bash
npm install expo-speech@~13.0.3
```

Then restart the bundler:

```bash
npx expo start -c
```

## Verify Installation

After installation, check that `expo-speech` appears in your `package.json`:

```json
{
  "dependencies": {
    "expo-speech": "~13.0.3"
  }
}
```

## Features Added

Once installed, you'll have:

1. **AI Coach Voice** - The AI coach speaks responses out loud
2. **Smart Workout Voice** - Mood-based workout greetings and motivation
3. **Voice Controls** - Toggle voice on/off with speaker icon
4. **Stop Speaking** - Stop button appears when AI is speaking

## Usage

- **Toggle Voice**: Tap the speaker icon in the top-right corner
- **Stop Speaking**: Tap the stop button when voice is active
- **Auto-Greeting**: AI coach greets you when you open the screen
- **Response Reading**: AI reads all responses automatically

## Troubleshooting

If you still get errors:

1. **Delete node_modules and reinstall:**
   ```bash
   rm -rf node_modules
   npm install
   ```

2. **Clear all caches:**
   ```bash
   npx expo start -c
   watchman watch-del-all  # if you have watchman
   ```

3. **Check Expo SDK compatibility:**
   Make sure you're using Expo SDK 54 (check `app.json`)

4. **Restart Metro bundler:**
   - Stop the current process (Ctrl+C)
   - Run `npx expo start -c`

## Testing Voice

Once installed, test the voice feature:

1. Open the AI Coach screen
2. Wait for the welcome greeting
3. Ask a question
4. The AI will speak the response
5. Toggle the speaker icon to disable/enable voice

The voice feature works on both iOS and Android devices!
