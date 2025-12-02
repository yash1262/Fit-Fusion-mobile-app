// API Configuration
// Automatically detects the correct API URL based on environment

import { Platform } from 'react-native';
import Constants from 'expo-constants';

// Get the local IP address from Expo
const getLocalIP = (): string => {
  try {
    // In Expo Go, we can get the debugger host which contains the IP
    const debuggerHost = Constants.expoConfig?.hostUri || Constants.manifest?.debuggerHost;
    
    if (debuggerHost) {
      // Extract IP from debuggerHost (format: "192.168.x.x:8081")
      const ip = debuggerHost.split(':')[0];
      console.log('📱 Detected IP from Expo:', ip);
      return ip;
    }
  } catch (error) {
    console.log('⚠️ Could not detect IP from Expo');
  }
  
  // Fallback to localhost (for simulators)
  return 'localhost';
};

// Determine if we're running on a physical device
const isPhysicalDevice = Constants.isDevice;

// Get the API base URL
export const getApiBaseUrl = (): string => {
  // For iOS simulator or Android emulator, use localhost
  if (!isPhysicalDevice) {
    console.log('🖥️ Running on simulator/emulator - using localhost');
    return 'http://localhost:5002';
  }
  
  // For physical devices, use local network IP
  const localIP = getLocalIP();
  
  if (localIP === 'localhost') {
    console.log('⚠️ Could not detect local IP, using localhost (may not work on physical device)');
  } else {
    console.log('📱 Running on physical device - using local IP:', localIP);
  }
  
  return `http://${localIP}:5002`;
};

// API endpoints
export const API_ENDPOINTS = {
  GEMINI_CHAT: '/api/chatbot/message',
  HEALTH_CHECK: '/api/health',
};

// Get full API URL
export const getApiUrl = (endpoint: string): string => {
  return `${getApiBaseUrl()}${endpoint}`;
};

// Log the API configuration on startup
const apiBaseUrl = getApiBaseUrl();
console.log('🌐 API Configuration:');
console.log('   Base URL:', apiBaseUrl);
console.log('   Device:', isPhysicalDevice ? 'Physical' : 'Simulator');
console.log('   Platform:', Platform.OS);
