#!/usr/bin/env node

const qrcode = require('qrcode-terminal');
const os = require('os');

// Get local IP address
function getLocalIP() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return 'localhost';
}

const localIP = getLocalIP();
const expoUrl = `exp://${localIP}:8081`;

console.log('\n╔════════════════════════════════════════════════════════════╗');
console.log('║                                                            ║');
console.log('║              📱 FIT FUSION - EXPO GO QR CODE              ║');
console.log('║                                                            ║');
console.log('╚════════════════════════════════════════════════════════════╝\n');

console.log('🚀 Scan this QR code with Expo Go app:\n');

// Generate QR code in terminal
qrcode.generate(expoUrl, { small: true }, (qr) => {
  console.log(qr);
});

console.log('\n📱 Installation Steps:');
console.log('   1. Install Expo Go from App Store or Play Store');
console.log('   2. Open Expo Go app');
console.log('   3. Tap "Scan QR Code"');
console.log('   4. Point camera at the QR code above\n');

console.log('🔗 Or enter this URL manually in Expo Go:');
console.log(`   ${expoUrl}\n`);

console.log('💻 Local Network:');
console.log(`   IP Address: ${localIP}`);
console.log(`   Port: 8081\n`);

console.log('📖 Need help? Check: mobile/QUICKSTART.md\n');
console.log('═══════════════════════════════════════════════════════════════\n');
