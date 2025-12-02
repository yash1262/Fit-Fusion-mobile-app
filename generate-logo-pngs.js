/**
 * Script to generate PNG logos from SVG
 * Run this with Node.js to create logo192.png and logo512.png
 * 
 * Requirements:
 * npm install sharp
 * 
 * Usage:
 * node generate-logo-pngs.js
 */

const fs = require('fs');
const sharp = require('sharp');

const svgContent = `
<svg width="512" height="512" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
  <!-- Heart shape -->
  <path d="M50 85 C 20 65, 10 50, 10 35 C 10 20, 20 10, 32 10 C 40 10, 45 15, 50 22 C 55 15, 60 10, 68 10 C 80 10, 90 20, 90 35 C 90 50, 80 65, 50 85 Z" fill="#708d50"/>
  
  <!-- Left glasses lens -->
  <circle cx="35" cy="40" r="10" fill="none" stroke="#262621" stroke-width="3"/>
  <ellipse cx="35" cy="40" rx="4" ry="6" fill="#262621"/>
  
  <!-- Right glasses lens -->
  <circle cx="65" cy="40" r="10" fill="none" stroke="#262621" stroke-width="3"/>
  <ellipse cx="65" cy="40" rx="4" ry="6" fill="#262621"/>
  
  <!-- Glasses bridge -->
  <path d="M 45 40 Q 50 38, 55 40" fill="none" stroke="#262621" stroke-width="3" stroke-linecap="round"/>
  
  <!-- Glasses arm (left) -->
  <path d="M 25 40 Q 20 38, 18 35" fill="none" stroke="#262621" stroke-width="3" stroke-linecap="round"/>
  
  <!-- Glasses arm (right) -->
  <path d="M 75 40 Q 80 38, 82 35" fill="none" stroke="#262621" stroke-width="3" stroke-linecap="round"/>
  
  <!-- Nose -->
  <line x1="50" y1="48" x2="48" y2="55" stroke="#262621" stroke-width="2.5" stroke-linecap="round"/>
  
  <!-- Smile -->
  <path d="M 40 60 Q 50 68, 60 60" fill="none" stroke="#262621" stroke-width="2.5" stroke-linecap="round"/>
</svg>
`;

async function generateLogos() {
  try {
    const svgBuffer = Buffer.from(svgContent);
    
    // Generate 192x192 logo
    await sharp(svgBuffer)
      .resize(192, 192)
      .png()
      .toFile('public/logo192.png');
    
    console.log('✅ Generated public/logo192.png');
    
    // Generate 512x512 logo
    await sharp(svgBuffer)
      .resize(512, 512)
      .png()
      .toFile('public/logo512.png');
    
    console.log('✅ Generated public/logo512.png');
    
    // Generate favicon (optional)
    await sharp(svgBuffer)
      .resize(64, 64)
      .png()
      .toFile('public/favicon.png');
    
    console.log('✅ Generated public/favicon.png');
    
    console.log('\n🎉 All logos generated successfully!');
    console.log('Your heart with glasses logo is now ready to use.');
    
  } catch (error) {
    console.error('❌ Error generating logos:', error);
    console.log('\nMake sure you have installed sharp:');
    console.log('npm install sharp');
  }
}

generateLogos();
