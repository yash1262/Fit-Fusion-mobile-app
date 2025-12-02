// Real-time activity tracking service
// Syncs data across Dashboard, Health Insights, and Smart Workout

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

// Get today's date in YYYY-MM-DD format
const getTodayDate = (): string => {
  const today = new Date();
  return today.toISOString().split('T')[0];
};

// Initialize or get today's activity
export const getTodayActivity = (): DailyActivity => {
  const stored = localStorage.getItem(STORAGE_KEY);
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
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newActivity));
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
  localStorage.setItem(STORAGE_KEY, JSON.stringify(newActivity));
  return newActivity;
};

// Update activity
export const updateActivity = (updates: Partial<DailyActivity>): DailyActivity => {
  const current = getTodayActivity();
  const updated = { ...current, ...updates, date: getTodayDate() };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  
  console.log('Activity updated:', updated);
  
  // Dispatch custom event for real-time sync
  const event = new CustomEvent('activityUpdated', { detail: updated });
  window.dispatchEvent(event);
  
  return updated;
};

// Add to existing values (for incremental updates)
export const incrementActivity = (field: keyof Omit<DailyActivity, 'date'>, amount: number): DailyActivity => {
  const current = getTodayActivity();
  const updated = {
    ...current,
    [field]: (current[field] as number) + amount,
    date: getTodayDate(),
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  
  console.log('Activity incremented:', field, amount, updated);
  
  // Dispatch custom event for real-time sync
  const event = new CustomEvent('activityUpdated', { detail: updated });
  window.dispatchEvent(event);
  
  return updated;
};

// Subscribe to activity updates
export const subscribeToActivityUpdates = (callback: (activity: DailyActivity) => void): (() => void) => {
  const handler = (event: Event) => {
    const customEvent = event as CustomEvent<DailyActivity>;
    console.log('Activity update received:', customEvent.detail);
    callback(customEvent.detail);
  };
  
  window.addEventListener('activityUpdated', handler);
  console.log('Subscribed to activity updates');
  
  // Return unsubscribe function
  return () => {
    window.removeEventListener('activityUpdated', handler);
    console.log('Unsubscribed from activity updates');
  };
};
