const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Add support for additional file extensions
config.resolver.assetExts.push('db', 'mp3', 'ttf', 'obj', 'png', 'jpg');

// Enable symlinks
config.resolver.unstable_enableSymlinks = true;

// Reset cache on start
config.resetCache = true;

module.exports = config;