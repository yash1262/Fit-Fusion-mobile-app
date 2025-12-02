import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getWeather, getWeatherGreeting, WeatherData } from '../services/weatherService';
import '../styles/WeatherMealNotification.css';

interface WeatherMealNotificationProps {
  onClose?: () => void;
}

const WeatherMealNotification: React.FC<WeatherMealNotificationProps> = ({ onClose }) => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [isVisible, setIsVisible] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch weather data on component mount
    const loadWeather = async () => {
      try {
        // Clear old cache and force refresh to get real-time data
        localStorage.removeItem('weatherData');
        localStorage.removeItem('weatherTimestamp');
        const weatherData = await getWeather(true);
        setWeather(weatherData);
        console.log('Notification: Weather loaded', weatherData);
      } catch (error) {
        console.error('Failed to load weather:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadWeather();
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    if (onClose) {
      onClose();
    }
  };

  if (!isVisible || isLoading) {
    return null;
  }

  if (!weather) {
    return null;
  }

  const greeting = getWeatherGreeting(weather);

  return (
    <div className="weather-notification-wrapper">
      <div className="weather-notification-banner">
        <button className="notification-close" onClick={handleClose} aria-label="Close notification">
          ✕
        </button>
        
        <div className="notification-content">
          <div className="notification-icon">
            <span className="weather-icon">{weather.icon}</span>
            <span className="meal-icon">🍽️</span>
          </div>
          
          <div className="notification-text">
            <h3 className="notification-title">
              🌟 Meal Suggestions Ready!
            </h3>
            <p className="notification-greeting">{greeting}</p>
            <p className="notification-description">
              Weather-based child-friendly meals are available based on your home ingredients.
            </p>
            
            <div className="weather-details">
              <span className="weather-detail">
                <span className="detail-icon">🌡️</span>
                {weather.temperature}°C
              </span>
              <span className="weather-detail">
                <span className="detail-icon">💧</span>
                {weather.humidity}%
              </span>
              <span className="weather-detail">
                <span className="detail-icon">☁️</span>
                {weather.condition}
              </span>
            </div>
          </div>
          
          <Link to="/meal-planner" className="notification-cta">
            View Meal Ideas
            <span className="cta-arrow">→</span>
          </Link>
        </div>
        
        <div className="notification-tail"></div>
      </div>
    </div>
  );
};

export default WeatherMealNotification;
