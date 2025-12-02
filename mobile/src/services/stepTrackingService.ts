// Real-time Step Tracking Service for Mobile
// Uses device motion sensors (Pedometer) for automatic step counting

import { Pedometer } from 'expo-sensors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { updateActivity, incrementActivity } from './activityTrackingService';

const STEP_STORAGE_KEY = 'fitfusion_step_tracking';
const LAST_STEP_COUNT_KEY = 'fitfusion_last_step_count';

interface StepTrackingData {
  todaySteps: number;
  lastUpdate: string;
  isTracking: boolean;
}

let stepSubscription: any = null;
let lastKnownSteps = 0;

/**
 * Check if step counting is available on device
 */
export const isStepCountingAvailable = async (): Promise<boolean> => {
  const available = await Pedometer.isAvailableAsync();
  return available;
};

/**
 * Request motion & fitness permissions
 */
export const requestStepTrackingPermission = async (): Promise<boolean> => {
  try {
    const available = await isStepCountingAvailable();
    if (!available) {
      console.warn('Step counting not available on this device');
      return false;
    }
    
    // Permissions are handled automatically by Expo
    // For iOS: Add NSMotionUsageDescription to Info.plist
    // For Android: Add ACTIVITY_RECOGNITION permission to AndroidManifest.xml
    
    return true;
  } catch (error) {
    console.error('Error requesting step tracking permission:', error);
    return false;
  }
};

/**
 * Get today's step count from storage
 */
const getTodayStepData = async (): Promise<StepTrackingData> => {
  try {
    const stored = await AsyncStorage.getItem(STEP_STORAGE_KEY);
    if (stored) {
      const data = JSON.parse(stored);
      const today = new Date().toDateString();
      
      // Reset if it's a new day
      if (data.lastUpdate !== today) {
        return {
          todaySteps: 0,
          lastUpdate: today,
          isTracking: false,
        };
      }
      
      return data;
    }
  } catch (error) {
    console.error('Error reading step data:', error);
  }
  
  return {
    todaySteps: 0,
    lastUpdate: new Date().toDateString(),
    isTracking: false,
  };
};

/**
 * Save step data to storage
 */
const saveStepData = async (data: StepTrackingData): Promise<void> => {
  try {
    await AsyncStorage.setItem(STEP_STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving step data:', error);
  }
};

/**
 * Get historical steps for today (from midnight to now)
 */
export const getTodayHistoricalSteps = async (): Promise<number> => {
  try {
    const end = new Date();
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    
    const result = await Pedometer.getStepCountAsync(start, end);
    console.log('Historical steps today:', result.steps);
    return result.steps;
  } catch (error) {
    console.error('Error getting historical steps:', error);
    return 0;
  }
};

/**
 * Start real-time step tracking
 */
export const startStepTracking = async (): Promise<boolean> => {
  try {
    const hasPermission = await requestStepTrackingPermission();
    if (!hasPermission) {
      console.warn('Step tracking permission not granted');
      return false;
    }
    
    // Get historical steps first
    const historicalSteps = await getTodayHistoricalSteps();
    lastKnownSteps = historicalSteps;
    
    // Update activity with historical steps
    updateActivity({ steps: historicalSteps });
    
    // Save to storage
    await saveStepData({
      todaySteps: historicalSteps,
      lastUpdate: new Date().toDateString(),
      isTracking: true,
    });
    
    // Start watching for new steps
    stepSubscription = Pedometer.watchStepCount((result) => {
      const newSteps = result.steps;
      
      // Calculate step difference
      const stepDifference = newSteps - lastKnownSteps;
      
      if (stepDifference > 0) {
        console.log(`New steps detected: +${stepDifference} (Total: ${historicalSteps + newSteps})`);
        
        // Update activity incrementally
        incrementActivity('steps', stepDifference);
        
        // Update last known steps
        lastKnownSteps = newSteps;
        
        // Save to storage
        saveStepData({
          todaySteps: historicalSteps + newSteps,
          lastUpdate: new Date().toDateString(),
          isTracking: true,
        });
      }
    });
    
    console.log('✅ Step tracking started');
    return true;
  } catch (error) {
    console.error('Error starting step tracking:', error);
    return false;
  }
};

/**
 * Stop step tracking
 */
export const stopStepTracking = async (): Promise<void> => {
  if (stepSubscription) {
    stepSubscription.remove();
    stepSubscription = null;
    console.log('Step tracking stopped');
  }
  
  // Update storage
  const data = await getTodayStepData();
  await saveStepData({
    ...data,
    isTracking: false,
  });
};

/**
 * Get current step tracking status
 */
export const getStepTrackingStatus = async (): Promise<{
  isTracking: boolean;
  todaySteps: number;
  isAvailable: boolean;
}> => {
  const data = await getTodayStepData();
  const available = await isStepCountingAvailable();
  
  return {
    isTracking: data.isTracking,
    todaySteps: data.todaySteps,
    isAvailable: available,
  };
};

/**
 * Initialize step tracking service
 * Automatically starts tracking when app launches
 */
export const initializeStepTracking = (): (() => void) => {
  console.log('Initializing step tracking service...');
  
  // Start tracking immediately
  startStepTracking();
  
  // Return cleanup function
  return () => {
    stopStepTracking();
    console.log('Step tracking service stopped');
  };
};

/**
 * Get step count for a specific date range
 */
export const getStepCountForRange = async (
  startDate: Date,
  endDate: Date
): Promise<number> => {
  try {
    const result = await Pedometer.getStepCountAsync(startDate, endDate);
    return result.steps;
  } catch (error) {
    console.error('Error getting step count for range:', error);
    return 0;
  }
};

/**
 * Get weekly step statistics
 */
export const getWeeklyStepStats = async (): Promise<{
  totalSteps: number;
  dailyAverage: number;
  dailySteps: number[];
}> => {
  const dailySteps: number[] = [];
  const today = new Date();
  
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    date.setHours(0, 0, 0, 0);
    
    const nextDay = new Date(date);
    nextDay.setDate(nextDay.getDate() + 1);
    
    const steps = await getStepCountForRange(date, nextDay);
    dailySteps.push(steps);
  }
  
  const totalSteps = dailySteps.reduce((sum, steps) => sum + steps, 0);
  const dailyAverage = Math.round(totalSteps / 7);
  
  return {
    totalSteps,
    dailyAverage,
    dailySteps,
  };
};
