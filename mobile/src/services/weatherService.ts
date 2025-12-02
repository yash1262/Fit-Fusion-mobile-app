// Weather Service for Mobile
// Fetches real-time weather data using device location

import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

export interface WeatherData {
  temperature: number;
  humidity: number;
  condition: string;
  category: 'hot' | 'cold' | 'rainy' | 'humid' | 'cloudy';
  description: string;
  icon: string;
}

const OPENWEATHER_API_KEY = 'f8a11a88ceb11cada9023f8bea4ca0b1'; // Replace with your API key
const CACHE_KEY = 'fitfusion_weather_cache';
const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes

const FALLBACK_WEATHER: WeatherData = {
  temperature: 25,
  humidity: 60,
  condition: 'Cloudy',
  category: 'cloudy',
  description: 'Pleasant weather',
  icon: 'weather',
};

/**
 * Categorize weather based on temperature, humidity, and condition
 */
const categorizeWeather = (
  temp: number,
  humidity: number,
  condition: string
): WeatherData['category'] => {
  const conditionLower = condition.toLowerCase();

  // Rainy conditions
  if (
    conditionLower.includes('rain') ||
    conditionLower.includes('drizzle') ||
    conditionLower.includes('thunderstorm')
  ) {
    return 'rainy';
  }

  // Hot conditions (temp > 30°C)
  if (temp > 30) {
    return 'hot';
  }

  // Cold conditions (temp < 15°C)
  if (temp < 15) {
    return 'cold';
  }

  // Humid conditions (humidity > 75%)
  if (humidity > 75) {
    return 'humid';
  }

  // Default to cloudy
  return 'cloudy';
};

/**
 * Get weather icon based on category
 */
const getWeatherIcon = (category: WeatherData['category']): string => {
  const icons = {
    hot: 'sun',
    cold: 'moon',
    rainy: 'water',
    humid: 'water',
    cloudy: 'weather',
  };
  return icons[category];
};

/**
 * Request location permission
 */
export const requestLocationPermission = async (): Promise<boolean> => {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    return status === 'granted';
  } catch (error) {
    console.error('Error requesting location permission:', error);
    return false;
  }
};

/**
 * Get current location
 */
export const getCurrentLocation = async (): Promise<{
  latitude: number;
  longitude: number;
} | null> => {
  try {
    const hasPermission = await requestLocationPermission();
    if (!hasPermission) {
      console.warn('Location permission not granted');
      return null;
    }

    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
    });

    return {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    };
  } catch (error) {
    console.error('Error getting location:', error);
    return null;
  }
};

/**
 * Fetch weather data from OpenWeather API
 */
export const fetchWeatherData = async (
  latitude?: number,
  longitude?: number
): Promise<WeatherData> => {
  try {
    let lat = latitude;
    let lon = longitude;

    // Get location if not provided
    if (!lat || !lon) {
      const location = await getCurrentLocation();
      if (location) {
        lat = location.latitude;
        lon = location.longitude;
      } else {
        // Use default location (Mumbai, India)
        lat = 19.076;
        lon = 72.8777;
      }
    }

    // Fetch weather data
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${OPENWEATHER_API_KEY}`;
    const response = await axios.get(url);

    const temperature = Math.round(response.data.main.temp);
    const humidity = response.data.main.humidity;
    const condition = response.data.weather[0].main;
    const description = response.data.weather[0].description;
    const category = categorizeWeather(temperature, humidity, condition);
    const icon = getWeatherIcon(category);

    const weatherData: WeatherData = {
      temperature,
      humidity,
      condition,
      category,
      description,
      icon,
    };

    console.log('Weather data fetched:', weatherData);
    return weatherData;
  } catch (error) {
    console.error('Error fetching weather data:', error);
    return FALLBACK_WEATHER;
  }
};

/**
 * Get cached weather data
 */
export const getCachedWeather = async (): Promise<WeatherData | null> => {
  try {
    const cached = await AsyncStorage.getItem(CACHE_KEY);
    if (cached) {
      const { data, timestamp } = JSON.parse(cached);
      const age = Date.now() - timestamp;

      // Cache valid for 30 minutes
      if (age < CACHE_DURATION) {
        console.log('Using cached weather:', data);
        return data;
      }
    }
  } catch (error) {
    console.error('Error reading cached weather:', error);
  }
  return null;
};

/**
 * Cache weather data
 */
export const cacheWeather = async (weather: WeatherData): Promise<void> => {
  try {
    const cacheData = {
      data: weather,
      timestamp: Date.now(),
    };
    await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
    console.log('Weather cached');
  } catch (error) {
    console.error('Error caching weather:', error);
  }
};

/**
 * Get weather with caching
 */
export const getWeather = async (forceRefresh: boolean = false): Promise<WeatherData> => {
  // Try to get cached weather first
  if (!forceRefresh) {
    const cached = await getCachedWeather();
    if (cached) {
      return cached;
    }
  }

  // Fetch fresh weather data
  const weather = await fetchWeatherData();

  // Cache if not fallback data
  if (
    weather.temperature !== FALLBACK_WEATHER.temperature ||
    weather.condition !== FALLBACK_WEATHER.condition
  ) {
    await cacheWeather(weather);
  }

  return weather;
};

/**
 * Get weather greeting message
 */
export const getWeatherGreeting = (weather: WeatherData): string => {
  const greetings = {
    hot: `It's a warm ${weather.temperature}°C today! Stay hydrated with cooling meals.`,
    cold: `Chilly at ${weather.temperature}°C! Time for some warm, comforting food.`,
    rainy: `Rainy day ahead! Perfect weather for warm snacks and soups.`,
    humid: `Humid at ${weather.humidity}%! Light, refreshing meals are ideal.`,
    cloudy: `Pleasant ${weather.temperature}°C weather! Great day for balanced meals.`,
  };
  return greetings[weather.category];
};
