#!/usr/bin/env node
/**
 * Create PNG icons from SVG using canvas
 * Simple fallback if sharp is not available
 */

const fs = require('fs');
const path = require('path');

// Create simple placeholder PNGs with base64 data
// These are minimal 1x1 transparent PNGs that Expo will accept
const transparentPNG = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
  'base64'
);

const assetsDir = path.join(__dirname, 'assets');

// Create placeholder files
fs.writeFileSync(path.join(assetsDir, 'icon.png'), transparentPNG);
fs.writeFileSync(path.join(assetsDir, 'splash.png'), transparentPNG);

console.log('✅ Created placeholder PNG files');
console.log('');
console.log('📝 To create proper icons:');
console.log('   1. Open assets/icon.svg in a browser');
console.log('   2. Take a screenshot or use a tool to convert to PNG');
console.log('   3. Save as assets/icon.png (1024x1024)');
console.log('   4. Save as assets/splash.png (1284x2778)');
console.log('');
console.log('   Or use an online converter:');
console.log('   - https://cloudconvert.com/svg-to-png');
console.log('   - https://svgtopng.com/');
console.log('');
console.log('💡 The app will work with these placeholders for now!');
