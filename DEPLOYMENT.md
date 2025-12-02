# 🚀 Deployment Guide

## Prerequisites
- GitHub account
- Git installed locally
- Node.js >= 16.0.0
- npm >= 8.0.0

## Push to GitHub

### Step 1: Create a New Repository on GitHub
1. Go to [GitHub](https://github.com/new)
2. Create a new repository named `fit-fusion` (or your preferred name)
3. **DO NOT** initialize with README, .gitignore, or license (we already have these)
4. Keep it public or private based on your preference

### Step 2: Configure Git User (First Time Only)
```bash
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

### Step 3: Add Remote and Push
```bash
# Add your GitHub repository as remote
git remote add origin https://github.com/YOUR_USERNAME/fit-fusion.git

# Verify the remote was added
git remote -v

# Push to GitHub
git push -u origin main
```

### Alternative: Using SSH
If you prefer SSH:
```bash
git remote add origin git@github.com:YOUR_USERNAME/fit-fusion.git
git push -u origin main
```

## Deployment Options

### Option 1: Vercel (Recommended for Web App)
1. Install Vercel CLI: `npm i -g vercel`
2. Run: `vercel`
3. Follow the prompts
4. Your app will be live at: `https://your-app.vercel.app`

### Option 2: Netlify
1. Install Netlify CLI: `npm i -g netlify-cli`
2. Run: `netlify deploy`
3. For production: `netlify deploy --prod`

### Option 3: GitHub Pages
1. Install gh-pages: `npm install --save-dev gh-pages`
2. Add to package.json scripts:
   ```json
   "predeploy": "npm run build",
   "deploy": "gh-pages -d build"
   ```
3. Run: `npm run deploy`
4. Enable GitHub Pages in repository settings

### Option 4: Firebase Hosting
1. Install Firebase CLI: `npm install -g firebase-tools`
2. Login: `firebase login`
3. Initialize: `firebase init hosting`
4. Deploy: `firebase deploy`

## Mobile App Deployment

### iOS (TestFlight)
See `mobile/TESTFLIGHT_SETUP_COMPLETE.md` for detailed instructions.

### Android (Google Play)
1. Build: `cd mobile && eas build --platform android`
2. Submit: `eas submit --platform android`

## Environment Variables

### Web App
Create `.env` file in root:
```env
REACT_APP_OPENWEATHER_API_KEY=your_key_here
REACT_APP_DEFAULT_LATITUDE=19.0760
REACT_APP_DEFAULT_LONGITUDE=72.8777
```

### Server
Create `server/.env`:
```env
OPENAI_API_KEY=your_openai_key
OPENAI_MODEL=gpt-4o-mini
PORT=5002
```

## Post-Deployment Checklist
- [ ] Update README.md with live demo link
- [ ] Configure custom domain (if applicable)
- [ ] Set up CI/CD pipeline
- [ ] Enable HTTPS
- [ ] Configure environment variables
- [ ] Test all features in production
- [ ] Set up monitoring and analytics
- [ ] Configure error tracking (Sentry, etc.)

## Continuous Deployment

### GitHub Actions (Recommended)
Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build
      - run: npm run deploy
```

## Troubleshooting

### Push Rejected
```bash
git pull origin main --rebase
git push origin main
```

### Large Files
If you have large files, use Git LFS:
```bash
git lfs install
git lfs track "*.mp4"
git add .gitattributes
git commit -m "Add Git LFS"
```

## Support
For issues, please open a GitHub issue or contact the maintainers.
