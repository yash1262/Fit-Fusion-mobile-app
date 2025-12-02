// Weather Service for fetching real-time weather data
// Uses OpenWeather API with fallback handling

export interface WeatherData {
  temperature: number;
  humidity: number;
  condition: string;
  category: 'hot' | 'cold' | 'rainy' | 'humid' | 'cloudy';
  description: string;
  icon: string;
}

// Get API key from environment variable or use placeholder
// Note: New API keys take 1-2 hours to activate after creation
const OPENWEATHER_API_KEY = process.env.REACT_APP_OPENWEATHER_API_KEY || 'f8a11a88ceb11cada9023f8bea4ca0b1';

// Manual override for testing (set to null to use API)
// Set to null to use real-time weather from API
const MANUAL_WEATHER_OVERRIDE: WeatherData | null = null;

// Default location (Mumbai, India) - can be overridden by environment variables
const DEFAULT_LATITUDE = parseFloat(process.env.REACT_APP_DEFAULT_LATITUDE || '19.0760');
const DEFAULT_LONGITUDE = parseFloat(process.env.REACT_APP_DEFAULT_LONGITUDE || '72.8777');

// Cache duration in milliseconds (default: 30 minutes)
const CACHE_DURATION = parseInt(process.env.REACT_APP_WEATHER_CACHE_DURATION || '30') * 60 * 1000;

const FALLBACK_WEATHER: WeatherData = {
  temperature: 25,
  humidity: 60,
  condition: 'Cloudy',
  category: 'cloudy',
  description: 'Pleasant weather',
  icon: '☁️'
};

/**
 * Categorize weather based on temperature, humidity, and condition
 */
const categorizeWeather = (temp: number, humidity: number, condition: string): WeatherData['category'] => {
  const conditionLower = condition.toLowerCase();
  
  // Rainy conditions
  if (conditionLower.includes('rain') || conditionLower.includes('drizzle') || conditionLower.includes('thunderstorm')) {
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
    hot: '☀️',
    cold: '❄️',
    rainy: '🌧️',
    humid: '💧',
    cloudy: '☁️'
  };
  return icons[category];
};

/**
 * Get greeting message based on weather
 */
export const getWeatherGreeting = (weather: WeatherData): string => {
  const greetings = {
    hot: `It's a warm ${weather.temperature}°C today! Stay hydrated with cooling meals.`,
    cold: `Chilly at ${weather.temperature}°C! Time for some warm, comforting food.`,
    rainy: `Rainy day ahead! Perfect weather for warm snacks and soups.`,
    humid: `Humid at ${weather.humidity}%! Light, refreshing meals are ideal.`,
    cloudy: `Pleasant ${weather.temperature}°C weather! Great day for balanced meals.`
  };
  return greetings[weather.category];
};

/**
 * Fetch weather data from OpenWeather API
 */
export const fetchWeatherData = async (latitude?: number, longitude?: number): Promise<WeatherData> => {
  // Check for manual override first (for testing when API key is not active)
  if (MANUAL_WEATHER_OVERRIDE) {
    console.log('Using manual weather override:', MANUAL_WEATHER_OVERRIDE);
    return MANUAL_WEATHER_OVERRIDE;
  }
  
  // Get user location if not provided
  let lat = latitude;
  let lon = longitude;
  
  try {
    if (!lat || !lon) {
      // Try to get geolocation
      if (navigator.geolocation) {
        try {
          const position = await new Promise<GeolocationPosition>((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject, {
              timeout: 10000,
              enableHighAccuracy: true
            });
          });
          lat = position.coords.latitude;
          lon = position.coords.longitude;
          console.log('✅ Geolocation obtained:', { lat, lon });
        } catch (geoError) {
          console.warn('⚠️ Geolocation failed, using default location:', geoError);
          lat = DEFAULT_LATITUDE;
          lon = DEFAULT_LONGITUDE;
        }
      } else {
        // Use default location from environment or fallback
        lat = DEFAULT_LATITUDE;
        lon = DEFAULT_LONGITUDE;
        console.log('ℹ️ Using default location (Mumbai):', { lat, lon });
      }
    }
    
    // Fetch weather data
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${OPENWEATHER_API_KEY}`;
    console.log('Fetching weather from API...');
    
    const response = await fetch(url);
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Weather API request failed: ${response.status} - ${errorText}`);
    }
    
    const data = await response.json();
    console.log('🌍 Weather API response:', data);
    console.log('📍 Location:', data.name, data.sys?.country);
    
    const temperature = Math.round(data.main.temp);
    const humidity = data.main.humidity;
    const condition = data.weather[0].main;
    const description = data.weather[0].description;
    const category = categorizeWeather(temperature, humidity, condition);
    const icon = getWeatherIcon(category);
    
    const weatherData = {
      temperature,
      humidity,
      condition,
      category,
      description,
      icon
    };
    
    console.log('🌡️ Weather data processed:', weatherData);
    console.log(`📊 Temperature: ${temperature}°C, Category: ${category}`);
    return weatherData;
  } catch (error) {
    console.error('Error fetching weather data:', error);
    console.error('Error details:', error instanceof Error ? error.message : 'Unknown error');
    console.log('API Key present:', OPENWEATHER_API_KEY ? 'Yes' : 'No');
    console.log('Coordinates used:', { lat, lon });
    // Return fallback weather data
    console.warn('Returning fallback weather data');
    return FALLBACK_WEATHER;
  }
};

/**
 * Get cached weather data (valid for 30 minutes)
 */
export const getCachedWeather = (): WeatherData | null => {
  try {
    const cached = localStorage.getItem('weatherData');
    const timestamp = localStorage.getItem('weatherTimestamp');
    
    if (cached && timestamp) {
      const age = Date.now() - parseInt(timestamp);
      // Cache valid for configured duration
      if (age < CACHE_DURATION) {
        return JSON.parse(cached);
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
export const cacheWeather = (weather: WeatherData): void => {
  try {
    localStorage.setItem('weatherData', JSON.stringify(weather));
    localStorage.setItem('weatherTimestamp', Date.now().toString());
  } catch (error) {
    console.error('Error caching weather:', error);
  }
};

/**
 * Clear cached weather data
 */
export const clearWeatherCache = (): void => {
  try {
    localStorage.removeItem('weatherData');
    localStorage.removeItem('weatherTimestamp');
    console.log('Weather cache cleared');
  } catch (error) {
    console.error('Error clearing weather cache:', error);
  }
};

/**
 * Get weather with caching
 */
export const getWeather = async (forceRefresh: boolean = false): Promise<WeatherData> => {
  // Clear cache if force refresh
  if (forceRefresh) {
    clearWeatherCache();
  }
  
  // Try to get cached weather first (only if not forcing refresh)
  if (!forceRefresh) {
    const cached = getCachedWeather();
    if (cached) {
      console.log('Using cached weather:', cached);
      return cached;
    }
  }
  
  // Fetch fresh weather data
  console.log('Fetching fresh weather data...');
  const weather = await fetchWeatherData();
  console.log('Weather fetched:', weather);
  
  // Only cache if it's not fallback data
  if (weather.temperature !== FALLBACK_WEATHER.temperature || weather.condition !== FALLBACK_WEATHER.condition) {
    cacheWeather(weather);
    console.log('Weather cached successfully');
  } else {
    console.warn('Using fallback weather - not caching');
  }
  
  return weather;
};
