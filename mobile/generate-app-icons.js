#!/usr/bin/env node
/**
 * Generate App Icons with Heart Logo
 * Creates icon.png and splash.png for the mobile app
 */

const fs = require('fs');
const path = require('path');

// SVG for Heart with Glasses Logo
const heartLogoSVG = `
<svg width="1024" height="1024" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
  <!-- Background Circle -->
  <circle cx="512" cy="512" r="512" fill="#708d50"/>
  
  <!-- Heart Shape -->
  <path
    d="M512 768 C512 768, 256 614, 256 410 C256 256, 307 205, 410 256 C461 282, 512 358, 512 358 C512 358, 563 282, 614 256 C717 205, 768 256, 768 410 C768 614, 512 768, 512 768 Z"
    fill="#ffffff"
    stroke="#ffffff"
    stroke-width="8"
  />
  
  <!-- Glasses Frame -->
  <g>
    <!-- Left Lens -->
    <circle
      cx="410"
      cy="410"
      r="82"
      fill="none"
      stroke="#333333"
      stroke-width="25"
    />
    
    <!-- Right Lens -->
    <circle
      cx="614"
      cy="410"
      r="82"
      fill="none"
      stroke="#333333"
      stroke-width="25"
    />
    
    <!-- Bridge -->
    <path
      d="M492 410 L532 410"
      stroke="#333333"
      stroke-width="25"
      fill="none"
    />
    
    <!-- Left Temple -->
    <path
      d="M328 410 L256 390"
      stroke="#333333"
      stroke-width="25"
      fill="none"
      stroke-linecap="round"
    />
    
    <!-- Right Temple -->
    <path
      d="M696 410 L768 390"
      stroke="#333333"
      stroke-width="25"
      fill="none"
      stroke-linecap="round"
    />
    
    <!-- Lens Shine Effect -->
    <circle cx="380" cy="380" r="20" fill="white" opacity="0.7" />
    <circle cx="584" cy="380" r="20" fill="white" opacity="0.7" />
  </g>
  
  <!-- Smile -->
  <path
    d="M410 532 Q462 576, 512 532"
    stroke="#333333"
    stroke-width="20"
    fill="none"
    stroke-linecap="round"
  />
</svg>
`;

// SVG for Splash Screen
const splashSVG = `
<svg width="1284" height="2778" viewBox="0 0 1284 2778" xmlns="http://www.w3.org/2000/svg">
  <!-- Background -->
  <rect width="1284" height="2778" fill="#708d50"/>
  
  <!-- Heart Logo (centered) -->
  <g transform="translate(392, 1139)">
    <!-- Heart Shape -->
    <path
      d="M250 384 C250 384, 125 307, 125 205 C125 128, 153.5 102.5, 205 128 C230.5 141, 250 179, 250 179 C250 179, 281.5 141, 295 128 C358.5 102.5, 375 128, 375 205 C375 307, 250 384, 250 384 Z"
      fill="#ffffff"
      stroke="#ffffff"
      stroke-width="4"
    />
    
    <!-- Glasses -->
    <g>
      <circle cx="205" cy="205" r="41" fill="none" stroke="#333333" stroke-width="12.5"/>
      <circle cx="307" cy="205" r="41" fill="none" stroke="#333333" stroke-width="12.5"/>
      <path d="M246 205 L266 205" stroke="#333333" stroke-width="12.5" fill="none"/>
      <path d="M164 205 L128 195" stroke="#333333" stroke-width="12.5" fill="none" stroke-linecap="round"/>
      <path d="M348 205 L384 195" stroke="#333333" stroke-width="12.5" fill="none" stroke-linecap="round"/>
      <circle cx="190" cy="190" r="10" fill="white" opacity="0.7"/>
      <circle cx="292" cy="190" r="10" fill="white" opacity="0.7"/>
    </g>
    
    <!-- Smile -->
    <path d="M205 266 Q231 288, 256 266" stroke="#333333" stroke-width="10" fill="none" stroke-linecap="round"/>
  </g>
</svg>
`;

// Create assets directory if it doesn't exist
const assetsDir = path.join(__dirname, 'assets');
if (!fs.existsSync(assetsDir)) {
  fs.mkdirSync(assetsDir, { recursive: true });
}

// Write SVG files
const iconPath = path.join(assetsDir, 'icon.svg');
const splashPath = path.join(assetsDir, 'splash.svg');

fs.writeFileSync(iconPath, heartLogoSVG.trim());
fs.writeFileSync(splashPath, splashSVG.trim());

console.log('✅ Generated SVG files:');
console.log('   - assets/icon.svg');
console.log('   - assets/splash.svg');
console.log('');
console.log('📝 Next steps:');
console.log('   1. Convert SVG to PNG using an online tool or ImageMagick:');
console.log('      - Icon: 1024x1024 PNG');
console.log('      - Splash: 1284x2778 PNG');
console.log('   2. Or use: npx expo-optimize');
console.log('   3. Or install sharp: npm install --save-dev sharp');
console.log('');
console.log('🎨 Heart with Glasses logo created!');
