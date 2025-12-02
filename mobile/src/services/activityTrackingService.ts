// Real-time Activity Tracking Service for Mobile
// Syncs data across all screens using event emitters

import AsyncStorage from '@react-native-async-storage/async-storage';

// Simple EventEmitter implementation for React Native
class SimpleEventEmitter {
  private listeners: Map<string, Set<Function>> = new Map();

  on(event: string, callback: Function): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(callback);
  }

  off(event: string, callback: Function): void {
    const eventListeners = this.listeners.get(event);
    if (eventListeners) {
      eventListeners.delete(callback);
    }
  }

  emit(event: string, ...args: any[]): void {
    const eventListeners = this.listeners.get(event);
    if (eventListeners) {
      eventListeners.forEach(callback => callback(...args));
    }
  }
}

interface DailyActivity {
  date: string; // YYYY-MM-DD format
  steps: number;
  calories: number;
  activeMinutes: number;
  hydration: number;
  workoutsCompleted: number;
  sleep: number;
  stress: number;
  mood: number;
  soreness: number;
}

const STORAGE_KEY = 'fitfusion_daily_activity';
const eventEmitter = new SimpleEventEmitter();

// Get today's date in YYYY-MM-DD format
const getTodayDate = (): string => {
  const today = new Date();
  return today.toISOString().split('T')[0];
};

// Initialize or get today's activity
export const getTodayActivity = async (): Promise<DailyActivity> => {
  try {
    const stored = await AsyncStorage.getItem(STORAGE_KEY);
    const today = getTodayDate();

    if (stored) {
      const data = JSON.parse(stored);

      // If stored date is not today, reset to new day
      if (data.date !== today) {
        const newActivity: DailyActivity = {
          date: today,
          steps: 0,
          calories: 0,
          activeMinutes: 0,
          hydration: 0,
          workoutsCompleted: 0,
          sleep: 7,
          stress: 5,
          mood: 7,
          soreness: 3,
        };
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newActivity));
        return newActivity;
      }

      return data;
    }

    // First time - create new activity
    const newActivity: DailyActivity = {
      date: today,
      steps: 0,
      calories: 0,
      activeMinutes: 0,
      hydration: 0,
      workoutsCompleted: 0,
      sleep: 7,
      stress: 5,
      mood: 7,
      soreness: 3,
    };
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newActivity));
    return newActivity;
  } catch (error) {
    console.error('Error getting today activity:', error);
    // Return default activity
    return {
      date: getTodayDate(),
      steps: 0,
      calories: 0,
      activeMinutes: 0,
      hydration: 0,
      workoutsCompleted: 0,
      sleep: 7,
      stress: 5,
      mood: 7,
      soreness: 3,
    };
  }
};

// Update activity
export const updateActivity = async (
  updates: Partial<DailyActivity>
): Promise<DailyActivity> => {
  const current = await getTodayActivity();
  const updated = { ...current, ...updates, date: getTodayDate() };
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

  console.log('Activity updated:', updated);

  // Emit event for real-time sync
  eventEmitter.emit('activityUpdated', updated);

  return updated;
};

// Add to existing values (for incremental updates)
export const incrementActivity = async (
  field: keyof Omit<DailyActivity, 'date'>,
  amount: number
): Promise<DailyActivity> => {
  const current = await getTodayActivity();
  const updated = {
    ...current,
    [field]: (current[field] as number) + amount,
    date: getTodayDate(),
  };
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

  console.log('Activity incremented:', field, amount, updated);

  // Emit event for real-time sync
  eventEmitter.emit('activityUpdated', updated);

  return updated;
};

// Subscribe to activity updates
export const subscribeToActivityUpdates = (
  callback: (activity: DailyActivity) => void
): (() => void) => {
  const handler = (activity: DailyActivity) => {
    console.log('Activity update received:', activity);
    callback(activity);
  };

  eventEmitter.on('activityUpdated', handler);
  console.log('Subscribed to activity updates');

  // Return unsubscribe function
  return () => {
    eventEmitter.off('activityUpdated', handler);
    console.log('Unsubscribed from activity updates');
  };
};

// Get activity history for the past N days
export const getActivityHistory = async (
  days: number = 7
): Promise<DailyActivity[]> => {
  try {
    const history: DailyActivity[] = [];
    const today = new Date();

    for (let i = 0; i < days; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];

      const key = `${STORAGE_KEY}_${dateStr}`;
      const stored = await AsyncStorage.getItem(key);

      if (stored) {
        history.push(JSON.parse(stored));
      } else {
        // Create empty activity for missing days
        history.push({
          date: dateStr,
          steps: 0,
          calories: 0,
          activeMinutes: 0,
          hydration: 0,
          workoutsCompleted: 0,
          sleep: 7,
          stress: 5,
          mood: 7,
          soreness: 3,
        });
      }
    }

    return history;
  } catch (error) {
    console.error('Error getting activity history:', error);
    return [];
  }
};

// Save today's activity to history (call at end of day)
export const archiveTodayActivity = async (): Promise<void> => {
  try {
    const activity = await getTodayActivity();
    const key = `${STORAGE_KEY}_${activity.date}`;
    await AsyncStorage.setItem(key, JSON.stringify(activity));
    console.log('Activity archived for', activity.date);
  } catch (error) {
    console.error('Error archiving activity:', error);
  }
};

// Clear all activity data (for testing/reset)
export const clearAllActivityData = async (): Promise<void> => {
  try {
    const keys = await AsyncStorage.getAllKeys();
    const activityKeys = keys.filter((key) => key.startsWith(STORAGE_KEY));
    await AsyncStorage.multiRemove(activityKeys);
    console.log('All activity data cleared');
  } catch (error) {
    console.error('Error clearing activity data:', error);
  }
};
