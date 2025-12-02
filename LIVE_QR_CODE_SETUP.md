# 🎯 Get a Live, Scannable QR Code on GitHub

## What You Want
A QR code on GitHub that anyone can scan to instantly run your app in Expo Go - **without needing to run a local server**.

## ✅ Solution: Publish to Expo

This creates a **permanent URL** that works from anywhere, anytime.

---

## 🚀 Quick Setup (5 Minutes)

### Step 1: Install EAS CLI
```bash
npm install -g eas-cli
```

### Step 2: Login to Expo
```bash
eas login
```
(Create a free account at expo.dev if you don't have one)

### Step 3: Publish Your App
```bash
cd mobile
./publish-and-generate-qr.sh
```

This script will:
- ✅ Publish your app to Expo
- ✅ Generate a permanent QR code
- ✅ Give you markdown to add to GitHub
- ✅ Open the QR code in your browser

### Step 4: Add to GitHub README

The script will give you markdown like this:
```markdown
<p align="center">
  <img src="https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=exp://u.expo.dev/YOUR-PROJECT-ID" alt="Scan with Expo Go" width="300"/>
</p>

**Scan with Expo Go to try the app instantly!**
```

Copy and paste it into your README.md!

---

## 📱 How It Works

### Before (Local Development):
```
Your Computer → Local Server → QR Code → Only works on same WiFi
```

### After (Published to Expo):
```
Expo Servers → Permanent URL → QR Code → Works anywhere, anytime! ✅
```

---

## 🎯 Manual Method

If you prefer to do it manually:

### 1. Publish to Expo
```bash
cd mobile
eas update --branch production --message "Initial release"
```

### 2. Get Your URL
After publishing, you'll see:
```
✔ Published!
URL: exp://u.expo.dev/405a61dd-5014-4757-a451-093e683ab86d?channel-name=production
```

### 3. Create QR Code
Use this URL format:
```
https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=YOUR_EXPO_URL
```

### 4. Add to README
```markdown
![Scan with Expo Go](https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=exp://u.expo.dev/405a61dd-5014-4757-a451-093e683ab86d?channel-name=production)
```

---

## 🔄 Updating Your App

Whenever you make changes:

```bash
cd mobile
eas update --branch production --message "Bug fixes"
```

The QR code **stays the same**, but users get the new version automatically!

---

## 📊 What You Get

### ✅ Permanent QR Code
- Never changes
- Works from GitHub
- No local server needed

### ✅ Global Access
- Works on any WiFi
- Works on mobile data
- Works anywhere in the world

### ✅ Instant Updates
- Push updates anytime
- Users get updates automatically
- No reinstall needed

### ✅ Analytics
- See how many people use your app
- Track errors and crashes
- Monitor performance

---

## 🎨 Example README Section

Here's what it will look like on GitHub:

```markdown
## 📱 Try the App Now

<p align="center">
  <img src="https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=exp://u.expo.dev/405a61dd-5014-4757-a451-093e683ab86d?channel-name=production" alt="Scan with Expo Go" width="300"/>
</p>

### Quick Start
1. Install [Expo Go](https://expo.dev/go) on your phone
2. Scan the QR code above
3. App loads instantly - no signup required!

**Works on iOS and Android**
```

---

## 🆚 Comparison

| Feature | Local Dev Server | Published to Expo |
|---------|-----------------|-------------------|
| QR Code Location | Terminal | GitHub ✅ |
| Requires Local Server | Yes ❌ | No ✅ |
| Same WiFi Required | Yes ❌ | No ✅ |
| Works Globally | No ❌ | Yes ✅ |
| Permanent URL | No ❌ | Yes ✅ |
| Easy to Share | No ❌ | Yes ✅ |

---

## 🛠️ Troubleshooting

### "eas: command not found"
```bash
npm install -g eas-cli
```

### "Not logged in"
```bash
eas login
```

### "Project not configured"
```bash
cd mobile
eas build:configure
```

### "Update failed"
```bash
# Make sure you're in the mobile directory
cd mobile

# Try with clear cache
expo start --clear
eas update --branch production --message "Retry"
```

---

## 💰 Cost

**FREE!** 

Expo's free tier includes:
- ✅ Unlimited updates
- ✅ Unlimited users
- ✅ Global CDN
- ✅ Analytics
- ✅ Error tracking

---

## 🎯 Complete Workflow

### 1. Develop Locally
```bash
cd mobile
npm start
# Scan QR from terminal for testing
```

### 2. Publish to Expo
```bash
./publish-and-generate-qr.sh
```

### 3. Update GitHub
```bash
# Add QR code to README
git add README.md
git commit -m "Add live Expo QR code"
git push
```

### 4. Share!
Now anyone can scan the QR code from your GitHub and try your app!

---

## 📖 Additional Resources

- [EAS Update Docs](https://docs.expo.dev/eas-update/introduction/)
- [Expo Go Guide](https://docs.expo.dev/get-started/expo-go/)
- [Publishing Guide](mobile/PUBLISH_TO_EXPO.md)

---

## 🎉 Benefits for Your Project

### For Users:
- ✅ Try app instantly
- ✅ No technical knowledge needed
- ✅ Works on any device
- ✅ No account required

### For You:
- ✅ Easy to share
- ✅ Professional presentation
- ✅ Track usage
- ✅ Push updates instantly

### For Recruiters/Employers:
- ✅ See your work immediately
- ✅ No setup required
- ✅ Professional deployment
- ✅ Shows you know modern tools

---

## 🚀 Ready to Go Live?

Run this command:
```bash
cd mobile
./publish-and-generate-qr.sh
```

In 5 minutes, you'll have a live QR code on GitHub that anyone can scan! 🎯

---

**Questions? Check [mobile/PUBLISH_TO_EXPO.md](mobile/PUBLISH_TO_EXPO.md) for detailed instructions.**
