// Mobile Notification Service
// Handles scheduled notifications for water reminders and meal suggestions

import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getWeather, WeatherData } from './weatherService';
import { getWeatherBasedMealSuggestions, MealSuggestion } from './mealSuggestionService';

const NOTIFICATION_SCHEDULE_KEY = 'fitfusion_notification_schedule';
const LAST_NOTIFICATION_KEY = 'fitfusion_last_notification';

interface NotificationSchedule {
  waterReminderHour: number;
  waterReminderMinute: number;
  mealSuggestionHour: number;
  mealSuggestionMinute: number;
  morningMotivationHour: number;
  morningMotivationMinute: number;
  lunchReminderHour: number;
  lunchReminderMinute: number;
  dinnerReminderHour: number;
  dinnerReminderMinute: number;
  eveningWaterHour: number;
  eveningWaterMinute: number;
  enabled: boolean;
  waterRemindersEnabled: boolean;
  mealRemindersEnabled: boolean;
  motivationEnabled: boolean;
}

const DEFAULT_SCHEDULE: NotificationSchedule = {
  waterReminderHour: 7,
  waterReminderMinute: 0,
  mealSuggestionHour: 7,
  mealSuggestionMinute: 30,
  morningMotivationHour: 6,
  morningMotivationMinute: 30,
  lunchReminderHour: 12,
  lunchReminderMinute: 30,
  dinnerReminderHour: 19,
  dinnerReminderMinute: 0,
  eveningWaterHour: 21,
  eveningWaterMinute: 0,
  enabled: true,
  waterRemindersEnabled: true,
  mealRemindersEnabled: true,
  motivationEnabled: true,
};

// Configure notification handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

/**
 * Request notification permissions
 */
export const requestNotificationPermission = async (): Promise<boolean> => {
  if (!Device.isDevice) {
    console.warn('Must use physical device for Push Notifications');
    return false;
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    console.warn('Notification permission not granted');
    return false;
  }

  console.log('✅ Notification permission granted');
  return true;
};

/**
 * Get notification schedule
 */
export const getNotificationSchedule = async (): Promise<NotificationSchedule> => {
  try {
    const stored = await AsyncStorage.getItem(NOTIFICATION_SCHEDULE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Error reading notification schedule:', error);
  }
  return DEFAULT_SCHEDULE;
};

/**
 * Save notification schedule
 */
export const saveNotificationSchedule = async (
  schedule: NotificationSchedule
): Promise<void> => {
  try {
    await AsyncStorage.setItem(
      NOTIFICATION_SCHEDULE_KEY,
      JSON.stringify(schedule)
    );
    console.log('Notification schedule saved:', schedule);
  } catch (error) {
    console.error('Error saving notification schedule:', error);
  }
};

/**
 * Check if notification was sent today
 */
const wasNotificationSentToday = async (type: 'water' | 'meal'): Promise<boolean> => {
  try {
    const stored = await AsyncStorage.getItem(LAST_NOTIFICATION_KEY);
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
const markNotificationSent = async (type: 'water' | 'meal'): Promise<void> => {
  try {
    const stored = await AsyncStorage.getItem(LAST_NOTIFICATION_KEY);
    const data = stored ? JSON.parse(stored) : {};
    data[type] = new Date().toDateString();
    await AsyncStorage.setItem(LAST_NOTIFICATION_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Error marking notification sent:', error);
  }
};

/**
 * Schedule morning water reminder
 */
export const scheduleWaterReminder = async (): Promise<void> => {
  const schedule = await getNotificationSchedule();

  if (!schedule.enabled) {
    console.log('Notifications disabled');
    return;
  }

  // Cancel existing water reminder
  await Notifications.cancelScheduledNotificationAsync('water-reminder');

  // Schedule new notification
  await Notifications.scheduleNotificationAsync({
    identifier: 'water-reminder',
    content: {
      title: '💧 Good Morning! Time to Hydrate',
      body: 'Start your day with a glass of water to boost metabolism and energy!',
      sound: true,
      priority: Notifications.AndroidNotificationPriority.HIGH,
      data: { type: 'water-reminder' },
    },
    trigger: {
      hour: schedule.waterReminderHour,
      minute: schedule.waterReminderMinute,
      repeats: true,
    },
  });

  console.log(
    `Water reminder scheduled for ${schedule.waterReminderHour}:${schedule.waterReminderMinute}`
  );
};

/**
 * Schedule weather-based meal suggestion
 */
export const scheduleMealSuggestion = async (): Promise<void> => {
  const schedule = await getNotificationSchedule();

  if (!schedule.enabled) {
    console.log('Notifications disabled');
    return;
  }

  try {
    // Get current weather
    const weather = await getWeather();
    const suggestions = getWeatherBasedMealSuggestions(weather);
    const meal = suggestions[0];

    // Cancel existing meal suggestion
    await Notifications.cancelScheduledNotificationAsync('meal-suggestion');

    // Schedule new notification
    await Notifications.scheduleNotificationAsync({
      identifier: 'meal-suggestion',
      content: {
        title: `${meal.emoji} ${weather.icon} Breakfast Suggestion`,
        body: `${meal.name} - ${meal.calories} cal | ${meal.protein}g protein\n\n${meal.benefits}`,
        sound: true,
        priority: Notifications.AndroidNotificationPriority.DEFAULT,
        data: {
          type: 'meal-suggestion',
          meal,
          weather,
        },
      },
      trigger: {
        hour: schedule.mealSuggestionHour,
        minute: schedule.mealSuggestionMinute,
        repeats: true,
      },
    });

    console.log(
      `Meal suggestion scheduled for ${schedule.mealSuggestionHour}:${schedule.mealSuggestionMinute}`
    );
  } catch (error) {
    console.error('Error scheduling meal suggestion:', error);
  }
};

/**
 * Send immediate water reminder (for testing)
 */
export const sendWaterReminderNow = async (): Promise<void> => {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: '💧 Water Reminder',
      body: 'Time to hydrate! Drink a glass of water now.',
      sound: true,
      data: { type: 'water-reminder' },
    },
    trigger: null, // Send immediately
  });
};

/**
 * Send immediate meal suggestion (for testing)
 */
export const sendMealSuggestionNow = async (): Promise<void> => {
  try {
    const weather = await getWeather();
    const suggestions = getWeatherBasedMealSuggestions(weather);
    const meal = suggestions[0];

    await Notifications.scheduleNotificationAsync({
      content: {
        title: `${meal.emoji} ${weather.icon} Breakfast Suggestion`,
        body: `${meal.name} - ${meal.calories} cal`,
        sound: true,
        data: { type: 'meal-suggestion', meal, weather },
      },
      trigger: null, // Send immediately
    });
  } catch (error) {
    console.error('Error sending meal suggestion:', error);
  }
};

/**
 * Setup notification listeners
 */
export const setupNotificationListeners = (navigation: any) => {
  // Handle notification received while app is foregrounded
  Notifications.addNotificationReceivedListener((notification) => {
    console.log('Notification received:', notification);
  });

  // Handle notification tap
  Notifications.addNotificationResponseReceivedListener((response) => {
    const data = response.notification.request.content.data;

    if (data.type === 'water-reminder') {
      // Navigate to dashboard
      navigation.navigate('Main', { screen: 'Dashboard' });
    } else if (data.type === 'meal-suggestion') {
      // Navigate to diet screen
      navigation.navigate('Main', { screen: 'Diet' });
    }
  });
};

/**
 * Initialize notification service
 */
export const initializeNotificationService = (): (() => void) => {
  console.log('Initializing notification service...');

  // Request permissions
  requestNotificationPermission().then((granted) => {
    if (granted) {
      // Schedule all notifications
      scheduleMorningMotivation();
      scheduleWaterReminder();
      scheduleMealSuggestion();
      scheduleLunchReminder();
      scheduleDinnerReminder();
      scheduleMiddayWaterReminder();
      scheduleEveningWaterReminder();
    }
  });

  console.log('✅ Notification service initialized with all reminders');

  // Return cleanup function
  return () => {
    Notifications.cancelAllScheduledNotificationsAsync();
    console.log('Notification service stopped');
  };
};

/**
 * Schedule morning motivation
 */
export const scheduleMorningMotivation = async (): Promise<void> => {
  const schedule = await getNotificationSchedule();

  if (!schedule.enabled || !schedule.motivationEnabled) {
    return;
  }

  const motivations = [
    '🌅 Good Morning! Today is a new opportunity to become stronger!',
    '💪 Rise and shine! Your fitness journey starts now!',
    '🎯 New day, new goals! Let\'s crush it today!',
    '⭐ You\'re capable of amazing things! Start your day strong!',
    '🔥 Wake up with determination, go to bed with satisfaction!',
  ];

  const randomMotivation = motivations[Math.floor(Math.random() * motivations.length)];

  await Notifications.scheduleNotificationAsync({
    identifier: 'morning-motivation',
    content: {
      title: 'Good Morning, Champion! 🌟',
      body: randomMotivation,
      sound: true,
      priority: Notifications.AndroidNotificationPriority.HIGH,
      data: { type: 'morning-motivation' },
    },
    trigger: {
      hour: schedule.morningMotivationHour,
      minute: schedule.morningMotivationMinute,
      repeats: true,
    },
  });

  console.log('Morning motivation scheduled');
};

/**
 * Schedule lunch reminder
 */
export const scheduleLunchReminder = async (): Promise<void> => {
  const schedule = await getNotificationSchedule();

  if (!schedule.enabled || !schedule.mealRemindersEnabled) {
    return;
  }

  try {
    const weather = await getWeather();
    const suggestions = getWeatherBasedMealSuggestions(weather, 'lunch');
    const meal = suggestions[0];

    await Notifications.scheduleNotificationAsync({
      identifier: 'lunch-reminder',
      content: {
        title: `🍽️ Lunch Time! ${weather.icon}`,
        body: `Try ${meal.name} - ${meal.calories} cal | Perfect for today's weather!`,
        sound: true,
        priority: Notifications.AndroidNotificationPriority.DEFAULT,
        data: { type: 'lunch-reminder', meal },
      },
      trigger: {
        hour: schedule.lunchReminderHour,
        minute: schedule.lunchReminderMinute,
        repeats: true,
      },
    });

    console.log('Lunch reminder scheduled');
  } catch (error) {
    console.error('Error scheduling lunch reminder:', error);
  }
};

/**
 * Schedule dinner reminder
 */
export const scheduleDinnerReminder = async (): Promise<void> => {
  const schedule = await getNotificationSchedule();

  if (!schedule.enabled || !schedule.mealRemindersEnabled) {
    return;
  }

  try {
    const weather = await getWeather();
    const suggestions = getWeatherBasedMealSuggestions(weather, 'dinner');
    const meal = suggestions[0];

    await Notifications.scheduleNotificationAsync({
      identifier: 'dinner-reminder',
      content: {
        title: `🌙 Dinner Time! ${meal.emoji}`,
        body: `${meal.name} - ${meal.calories} cal | ${meal.benefits}`,
        sound: true,
        priority: Notifications.AndroidNotificationPriority.DEFAULT,
        data: { type: 'dinner-reminder', meal },
      },
      trigger: {
        hour: schedule.dinnerReminderHour,
        minute: schedule.dinnerReminderMinute,
        repeats: true,
      },
    });

    console.log('Dinner reminder scheduled');
  } catch (error) {
    console.error('Error scheduling dinner reminder:', error);
  }
};

/**
 * Schedule evening water reminder
 */
export const scheduleEveningWaterReminder = async (): Promise<void> => {
  const schedule = await getNotificationSchedule();

  if (!schedule.enabled || !schedule.waterRemindersEnabled) {
    return;
  }

  await Notifications.scheduleNotificationAsync({
    identifier: 'evening-water',
    content: {
      title: '💧 Evening Hydration',
      body: 'Don\'t forget to drink water before bed! Stay hydrated for better sleep.',
      sound: true,
      priority: Notifications.AndroidNotificationPriority.DEFAULT,
      data: { type: 'evening-water' },
    },
    trigger: {
      hour: schedule.eveningWaterHour,
      minute: schedule.eveningWaterMinute,
      repeats: true,
    },
  });

  console.log('Evening water reminder scheduled');
};

/**
 * Schedule midday water reminder
 */
export const scheduleMiddayWaterReminder = async (): Promise<void> => {
  const schedule = await getNotificationSchedule();

  if (!schedule.enabled || !schedule.waterRemindersEnabled) {
    return;
  }

  await Notifications.scheduleNotificationAsync({
    identifier: 'midday-water',
    content: {
      title: '💧 Hydration Check!',
      body: 'Time for a water break! Keep your energy levels up.',
      sound: true,
      priority: Notifications.AndroidNotificationPriority.DEFAULT,
      data: { type: 'midday-water' },
    },
    trigger: {
      hour: 14,
      minute: 0,
      repeats: true,
    },
  });

  console.log('Midday water reminder scheduled');
};

/**
 * Cancel all notifications
 */
export const cancelAllNotifications = async (): Promise<void> => {
  await Notifications.cancelAllScheduledNotificationsAsync();
  console.log('All notifications cancelled');
};

/**
 * Get all scheduled notifications
 */
export const getScheduledNotifications = async (): Promise<
  Notifications.NotificationRequest[]
> => {
  return await Notifications.getAllScheduledNotificationsAsync();
};
