// Notification Service for morning reminders and weather-based meal suggestions
// Handles push notifications, scheduled alarms, and personalized meal recommendations

import { getWeather, WeatherData } from './weatherService';

export interface MealSuggestion {
  name: string;
  description: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  ingredients: string[];
  benefits: string;
  emoji: string;
}

interface NotificationSchedule {
  waterReminder: string; // Time in HH:MM format (24-hour)
  mealSuggestion: string; // Time in HH:MM format (24-hour)
  enabled: boolean;
}

const STORAGE_KEY = 'fitfusion_notification_schedule';
const LAST_NOTIFICATION_KEY = 'fitfusion_last_notification';

// Default schedule: 7:00 AM for water, 7:30 AM for meal suggestion
const DEFAULT_SCHEDULE: NotificationSchedule = {
  waterReminder: '07:00',
  mealSuggestion: '07:30',
  enabled: true
};

/**
 * Request notification permission from user
 */
export const requestNotificationPermission = async (): Promise<boolean> => {
  if (!('Notification' in window)) {
    console.warn('This browser does not support notifications');
    return false;
  }

  if (Notification.permission === 'granted') {
    return true;
  }

  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }

  return false;
};

/**
 * Show a notification
 */
export const showNotification = (title: string, options?: NotificationOptions): void => {
  if (Notification.permission === 'granted') {
    new Notification(title, {
      icon: '/logo192.png',
      badge: '/logo192.png',
      ...options
    });
  }
};

/**
 * Get notification schedule from localStorage
 */
export const getNotificationSchedule = (): NotificationSchedule => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Error reading notification schedule:', error);
  }
  return DEFAULT_SCHEDULE;
};

/**
 * Save notification schedule to localStorage
 */
export const saveNotificationSchedule = (schedule: NotificationSchedule): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(schedule));
    console.log('Notification schedule saved:', schedule);
  } catch (error) {
    console.error('Error saving notification schedule:', error);
  }
};

/**
 * Check if notification was already sent today
 */
const wasNotificationSentToday = (type: 'water' | 'meal'): boolean => {
  try {
    const stored = localStorage.getItem(LAST_NOTIFICATION_KEY);
    if (stored) {
      const data = JSON.parse(stored);
      const today = new Date().toDateString();
      return data[type] === today;
    }
  } catch (error) {
    console.error('Error checking last notification:', error);
  }
  return false;
};

/**
 * Mark notification as sent today
 */
const markNotificationSent = (type: 'water' | 'meal'): void => {
  try {
    const stored = localStorage.getItem(LAST_NOTIFICATION_KEY);
    const data = stored ? JSON.parse(stored) : {};
    data[type] = new Date().toDateString();
    localStorage.setItem(LAST_NOTIFICATION_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Error marking notification sent:', error);
  }
};

/**
 * Get weather-based meal suggestions
 */
export const getWeatherBasedMealSuggestions = (weather: WeatherData): MealSuggestion[] => {
  const suggestions: Record<WeatherData['category'], MealSuggestion[]> = {
    hot: [
      {
        name: 'Chilled Greek Yogurt Bowl',
        description: 'Refreshing yogurt with berries, honey, and granola',
        calories: 320,
        protein: 18,
        carbs: 42,
        fats: 8,
        ingredients: ['Greek yogurt', 'Mixed berries', 'Honey', 'Granola', 'Chia seeds'],
        benefits: 'High protein, cooling, hydrating, and packed with antioxidants',
        emoji: '🥣'
      },
      {
        name: 'Watermelon & Feta Salad',
        description: 'Light and refreshing salad with mint',
        calories: 180,
        protein: 6,
        carbs: 28,
        fats: 7,
        ingredients: ['Watermelon', 'Feta cheese', 'Mint', 'Lime', 'Olive oil'],
        benefits: 'Hydrating, low-calorie, rich in vitamins A & C',
        emoji: '🍉'
      },
      {
        name: 'Smoothie Bowl',
        description: 'Frozen fruit smoothie with toppings',
        calories: 280,
        protein: 12,
        carbs: 48,
        fats: 6,
        ingredients: ['Frozen banana', 'Berries', 'Almond milk', 'Protein powder', 'Coconut flakes'],
        benefits: 'Cooling, nutrient-dense, easy to digest',
        emoji: '🥤'
      }
    ],
    cold: [
      {
        name: 'Warm Oatmeal Bowl',
        description: 'Hearty oats with nuts, banana, and cinnamon',
        calories: 380,
        protein: 14,
        carbs: 58,
        fats: 12,
        ingredients: ['Steel-cut oats', 'Banana', 'Walnuts', 'Cinnamon', 'Honey'],
        benefits: 'Warming, high fiber, sustained energy release',
        emoji: '🥣'
      },
      {
        name: 'Scrambled Eggs & Avocado Toast',
        description: 'Protein-rich breakfast with healthy fats',
        calories: 420,
        protein: 22,
        carbs: 32,
        fats: 24,
        ingredients: ['Eggs', 'Whole grain bread', 'Avocado', 'Cherry tomatoes', 'Pepper'],
        benefits: 'High protein, warming, keeps you full longer',
        emoji: '🍳'
      },
      {
        name: 'Hot Quinoa Porridge',
        description: 'Warm quinoa with almond milk and berries',
        calories: 340,
        protein: 12,
        carbs: 52,
        fats: 10,
        ingredients: ['Quinoa', 'Almond milk', 'Berries', 'Maple syrup', 'Almonds'],
        benefits: 'Complete protein, warming, gluten-free',
        emoji: '🍲'
      }
    ],
    rainy: [
      {
        name: 'Masala Chai & Whole Wheat Toast',
        description: 'Spiced tea with protein-rich toast',
        calories: 320,
        protein: 16,
        carbs: 44,
        fats: 10,
        ingredients: ['Masala chai', 'Whole wheat bread', 'Peanut butter', 'Banana'],
        benefits: 'Warming spices boost immunity, comforting',
        emoji: '☕'
      },
      {
        name: 'Vegetable Upma',
        description: 'South Indian savory semolina dish',
        calories: 280,
        protein: 8,
        carbs: 48,
        fats: 8,
        ingredients: ['Semolina', 'Mixed vegetables', 'Curry leaves', 'Mustard seeds', 'Peanuts'],
        benefits: 'Warm, filling, rich in vegetables',
        emoji: '🍛'
      },
      {
        name: 'Poha with Peanuts',
        description: 'Light flattened rice with spices',
        calories: 260,
        protein: 7,
        carbs: 42,
        fats: 8,
        ingredients: ['Poha', 'Peanuts', 'Curry leaves', 'Turmeric', 'Lemon'],
        benefits: 'Easy to digest, warming, probiotic-friendly',
        emoji: '🍚'
      }
    ],
    humid: [
      {
        name: 'Fresh Fruit Salad',
        description: 'Mixed seasonal fruits with lime',
        calories: 180,
        protein: 3,
        carbs: 44,
        fats: 1,
        ingredients: ['Papaya', 'Pineapple', 'Grapes', 'Pomegranate', 'Lime juice'],
        benefits: 'Light, hydrating, rich in enzymes',
        emoji: '🍇'
      },
      {
        name: 'Cucumber & Mint Raita Bowl',
        description: 'Cooling yogurt-based dish',
        calories: 160,
        protein: 10,
        carbs: 18,
        fats: 6,
        ingredients: ['Yogurt', 'Cucumber', 'Mint', 'Cumin', 'Rock salt'],
        benefits: 'Cooling, probiotic, aids digestion',
        emoji: '🥒'
      },
      {
        name: 'Green Smoothie',
        description: 'Refreshing vegetable and fruit blend',
        calories: 220,
        protein: 8,
        carbs: 38,
        fats: 5,
        ingredients: ['Spinach', 'Cucumber', 'Green apple', 'Ginger', 'Coconut water'],
        benefits: 'Hydrating, detoxifying, nutrient-dense',
        emoji: '🥬'
      }
    ],
    cloudy: [
      {
        name: 'Balanced Breakfast Plate',
        description: 'Eggs, toast, and fresh vegetables',
        calories: 380,
        protein: 24,
        carbs: 36,
        fats: 16,
        ingredients: ['Eggs', 'Whole grain toast', 'Avocado', 'Tomatoes', 'Spinach'],
        benefits: 'Complete nutrition, balanced macros',
        emoji: '🍽️'
      },
      {
        name: 'Idli with Sambar',
        description: 'Steamed rice cakes with lentil soup',
        calories: 320,
        protein: 12,
        carbs: 58,
        fats: 4,
        ingredients: ['Idli', 'Sambar', 'Coconut chutney', 'Curry leaves'],
        benefits: 'Light, fermented, easy to digest',
        emoji: '🥘'
      },
      {
        name: 'Multigrain Pancakes',
        description: 'Protein-rich pancakes with berries',
        calories: 360,
        protein: 18,
        carbs: 48,
        fats: 12,
        ingredients: ['Multigrain flour', 'Eggs', 'Berries', 'Honey', 'Greek yogurt'],
        benefits: 'High fiber, sustained energy, delicious',
        emoji: '🥞'
      }
    ]
  };

  return suggestions[weather.category] || suggestions.cloudy;
};

/**
 * Send morning water reminder notification
 */
export const sendWaterReminder = async (): Promise<void> => {
  if (wasNotificationSentToday('water')) {
    console.log('Water reminder already sent today');
    return;
  }

  const hasPermission = await requestNotificationPermission();
  if (!hasPermission) {
    console.warn('Notification permission not granted');
    return;
  }

  const messages = [
    '💧 Good Morning! Start your day with a glass of water',
    '🌊 Rise & Hydrate! Your body needs water after sleep',
    '💦 Morning Hydration Alert! Drink 500ml of water now',
    '🥤 Wake Up & Drink Up! Begin your day hydrated',
    '💧 Hydration Time! Your morning glass of water awaits'
  ];

  const randomMessage = messages[Math.floor(Math.random() * messages.length)];

  showNotification(randomMessage, {
    body: 'Drinking water first thing helps boost metabolism, flush toxins, and energize your body!',
    icon: '/logo192.png',
    badge: '/logo192.png',
    tag: 'water-reminder',
    requireInteraction: true
  });

  markNotificationSent('water');
  console.log('Water reminder sent');
};

/**
 * Send weather-based meal suggestion notification
 */
export const sendMealSuggestion = async (): Promise<void> => {
  if (wasNotificationSentToday('meal')) {
    console.log('Meal suggestion already sent today');
    return;
  }

  const hasPermission = await requestNotificationPermission();
  if (!hasPermission) {
    console.warn('Notification permission not granted');
    return;
  }

  try {
    // Fetch current weather
    const weather = await getWeather();
    const suggestions = getWeatherBasedMealSuggestions(weather);
    
    // Pick a random suggestion
    const meal = suggestions[Math.floor(Math.random() * suggestions.length)];

    const title = `${meal.emoji} ${weather.icon} Breakfast Suggestion for ${weather.temperature}°C`;
    const body = `${meal.name} - ${meal.description}\n${meal.calories} cal | ${meal.protein}g protein\n\n${meal.benefits}`;

    showNotification(title, {
      body,
      icon: '/logo192.png',
      badge: '/logo192.png',
      tag: 'meal-suggestion',
      requireInteraction: false,
      data: { meal, weather }
    });

    markNotificationSent('meal');
    console.log('Meal suggestion sent:', meal.name);
  } catch (error) {
    console.error('Error sending meal suggestion:', error);
  }
};

/**
 * Check and send scheduled notifications
 */
export const checkScheduledNotifications = async (): Promise<void> => {
  const schedule = getNotificationSchedule();
  
  if (!schedule.enabled) {
    console.log('Notifications are disabled');
    return;
  }

  const now = new Date();
  const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

  // Check water reminder
  if (currentTime === schedule.waterReminder) {
    await sendWaterReminder();
  }

  // Check meal suggestion
  if (currentTime === schedule.mealSuggestion) {
    await sendMealSuggestion();
  }
};

/**
 * Initialize notification service
 * Sets up interval to check for scheduled notifications every minute
 */
export const initializeNotificationService = (): (() => void) => {
  console.log('Initializing notification service...');
  
  // Request permission on initialization
  requestNotificationPermission();

  // Check immediately
  checkScheduledNotifications();

  // Check every minute
  const intervalId = setInterval(() => {
    checkScheduledNotifications();
  }, 60000); // 60 seconds

  console.log('Notification service initialized');

  // Return cleanup function
  return () => {
    clearInterval(intervalId);
    console.log('Notification service stopped');
  };
};

/**
 * Test notifications (for debugging)
 */
export const testNotifications = async (): Promise<void> => {
  const hasPermission = await requestNotificationPermission();
  if (!hasPermission) {
    alert('Please enable notifications in your browser settings');
    return;
  }

  // Test water reminder
  showNotification('💧 Test Water Reminder', {
    body: 'This is a test notification for water reminder',
    tag: 'test-water'
  });

  // Test meal suggestion after 2 seconds
  setTimeout(async () => {
    const weather = await getWeather();
    const suggestions = getWeatherBasedMealSuggestions(weather);
    const meal = suggestions[0];
    
    showNotification(`${meal.emoji} Test Meal Suggestion`, {
      body: `${meal.name} - ${meal.calories} cal`,
      tag: 'test-meal'
    });
  }, 2000);
};
