import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getWeather, WeatherData } from '../services/weatherService';
import { 
  getMealSuggestions, 
  getIngredientSuggestions, 
  getPopularMeals,
  Meal,
  MealSuggestions 
} from '../services/mealRecommendationService';
import '../styles/MealPlanner.css';

const MealPlanner: React.FC = () => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [mealSuggestions, setMealSuggestions] = useState<MealSuggestions | null>(null);
  const [activeTab, setActiveTab] = useState<'breakfast' | 'lunch' | 'dinner' | 'snacks' | 'baby'>('breakfast');
  const [savedMeals, setSavedMeals] = useState<number[]>([]);
  const [showCelebration, setShowCelebration] = useState(false);
  const [perfectMatches, setPerfectMatches] = useState<number>(0);

  // Load weather and initial data
  useEffect(() => {
    const loadData = async () => {
      // Clear old cache and force refresh to get real-time weather
      localStorage.removeItem('weatherData');
      localStorage.removeItem('weatherTimestamp');
      const weatherData = await getWeather(true);
      setWeather(weatherData);
      console.log('Meal Planner: Weather loaded', weatherData);
      
      // Load saved ingredients from localStorage
      const saved = localStorage.getItem('mealPlannerIngredients');
      if (saved) {
        const savedIngredients = JSON.parse(saved);
        setIngredients(savedIngredients);
        
        // Generate suggestions with saved ingredients
        const meals = getMealSuggestions(weatherData, savedIngredients);
        setMealSuggestions(meals);
      } else {
        // Show popular meals if no ingredients
        const meals = getPopularMeals(weatherData, []);
        setMealSuggestions(meals);
      }
      
      // Load saved meals
      const savedMealIds = localStorage.getItem('savedMeals');
      if (savedMealIds) {
        setSavedMeals(JSON.parse(savedMealIds));
      }
    };

    loadData();
  }, []);

  // Handle ingredient input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    
    if (value.trim().length >= 2) {
      const ingredientSuggestions = getIngredientSuggestions(value);
      setSuggestions(ingredientSuggestions);
    } else {
      setSuggestions([]);
    }
  };

  // Add ingredient
  const addIngredient = (ingredient: string) => {
    const trimmed = ingredient.trim().toLowerCase();
    
    if (trimmed && !ingredients.includes(trimmed)) {
      const newIngredients = [...ingredients, trimmed];
      setIngredients(newIngredients);
      setInputValue('');
      setSuggestions([]);
      
      // Save to localStorage
      localStorage.setItem('mealPlannerIngredients', JSON.stringify(newIngredients));
      
      // Update meal suggestions
      if (weather) {
        const meals = getMealSuggestions(weather, newIngredients);
        setMealSuggestions(meals);
        
        // Check for perfect matches and trigger celebration
        const perfectMatchCount = Object.values(meals).flat().filter(m => m.matchScore === 100).length;
        if (perfectMatchCount > 0 && perfectMatchCount > perfectMatches) {
          setPerfectMatches(perfectMatchCount);
          setShowCelebration(true);
          setTimeout(() => setShowCelebration(false), 5000);
        }
      }
    }
  };

  // Remove ingredient
  const removeIngredient = (ingredient: string) => {
    const newIngredients = ingredients.filter(i => i !== ingredient);
    setIngredients(newIngredients);
    
    // Save to localStorage
    localStorage.setItem('mealPlannerIngredients', JSON.stringify(newIngredients));
    
    // Update meal suggestions
    if (weather) {
      if (newIngredients.length > 0) {
        const meals = getMealSuggestions(weather, newIngredients);
        setMealSuggestions(meals);
      } else {
        const meals = getPopularMeals(weather, []);
        setMealSuggestions(meals);
      }
    }
  };

  // Handle key press
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      addIngredient(inputValue);
    }
  };

  // Toggle saved meal
  const toggleSaveMeal = (mealId: number) => {
    let newSavedMeals: number[];
    
    if (savedMeals.includes(mealId)) {
      newSavedMeals = savedMeals.filter(id => id !== mealId);
    } else {
      newSavedMeals = [...savedMeals, mealId];
    }
    
    setSavedMeals(newSavedMeals);
    localStorage.setItem('savedMeals', JSON.stringify(newSavedMeals));
  };

  // Render meal card
  const renderMealCard = (meal: Meal) => {
    const isSaved = savedMeals.includes(meal.id);
    const canMake = meal.matchScore === 100;
    
    return (
      <div key={meal.id} className={`meal-card ${canMake ? 'can-make' : 'partial-match'}`}>
        <div className="meal-card-header">
          <span className="meal-emoji">{meal.image}</span>
          <button 
            className={`save-btn ${isSaved ? 'saved' : ''}`}
            onClick={() => toggleSaveMeal(meal.id)}
            aria-label={isSaved ? 'Unsave meal' : 'Save meal'}
          >
            {isSaved ? '❤️' : '🤍'}
          </button>
        </div>
        
        <h3 className="meal-name">{meal.name}</h3>
        <p className="meal-description">{meal.description}</p>
        
        <div className="meal-meta">
          <span className="prep-time">⏱️ {meal.prepTime}</span>
          <span className={`meal-type ${meal.type}`}>
            {meal.type === 'veg' ? '🥬 Veg' : '🍗 Non-Veg'}
          </span>
        </div>
        
        <div className="meal-nutrition">
          <span className="nutrition-item">💪 {meal.protein}</span>
          <span className="nutrition-item">🔥 {meal.calories}</span>
          {meal.matchScore !== undefined && (
            <span className={`match-score ${canMake ? 'perfect' : 'partial'}`}>
              {meal.matchScore}% Match
            </span>
          )}
        </div>
        
        {meal.availableIngredients && meal.availableIngredients.length > 0 && (
          <div className="ingredients-section">
            <h4>Available Ingredients:</h4>
            <div className="ingredient-tags">
              {meal.availableIngredients.map((ing, idx) => (
                <span key={idx} className="ingredient-tag available">{ing}</span>
              ))}
            </div>
          </div>
        )}
        
        {meal.missingIngredients && meal.missingIngredients.length > 0 && (
          <div className="ingredients-section">
            <h4>Missing Ingredients:</h4>
            <div className="ingredient-tags">
              {meal.missingIngredients.map((ing, idx) => (
                <span key={idx} className="ingredient-tag missing">{ing}</span>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  if (!weather || !mealSuggestions) {
    return (
      <div className="meal-planner-loading">
        <div className="loading-spinner"></div>
        <p>Loading meal suggestions...</p>
      </div>
    );
  }

  const currentMeals = mealSuggestions[activeTab];

  return (
    <div className="meal-planner-page">
      {/* Celebration Animation */}
      {showCelebration && (
        <div className="celebration-overlay">
          <div className="celebration-content">
            <div className="celebration-text">
              🎉 Perfect Match Found! 🎉
              <div className="celebration-subtext">
                You can make {perfectMatches} meal{perfectMatches > 1 ? 's' : ''} with your ingredients!
              </div>
            </div>
          </div>
          <div className="confetti-container">
            {[...Array(50)].map((_, i) => (
              <div key={i} className="confetti" style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 0.5}s`,
                backgroundColor: ['#ff6b6b', '#4ecdc4', '#45b7d1', '#f9ca24', '#6c5ce7', '#a29bfe'][Math.floor(Math.random() * 6)]
              }}></div>
            ))}
          </div>
        </div>
      )}
      
      <nav className="navbar">
        <div className="nav-container">
          <Link to="/landing" className="logo">FitFusion</Link>
          <ul className="nav-menu">
            <li><Link to="/landing" className="nav-link">Home</Link></li>
            <li><Link to="/dashboard" className="nav-link">Dashboard</Link></li>
            <li><Link to="/contact" className="nav-link">Contact</Link></li>
          </ul>
        </div>
      </nav>

      <div className="meal-planner-container">
        {/* Weather Card */}
        <div className="weather-card">
          <div className="weather-icon-large">{weather.icon}</div>
          <div className="weather-info">
            <h2>Current Weather</h2>
            <div className="weather-stats">
              <div className="weather-stat">
                <span className="stat-label">Temperature</span>
                <span className="stat-value">{weather.temperature}°C</span>
              </div>
              <div className="weather-stat">
                <span className="stat-label">Humidity</span>
                <span className="stat-value">{weather.humidity}%</span>
              </div>
              <div className="weather-stat">
                <span className="stat-label">Condition</span>
                <span className="stat-value">{weather.condition}</span>
              </div>
              <div className="weather-stat">
                <span className="stat-label">Category</span>
                <span className="stat-value category">{weather.category}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Ingredient Input Section */}
        <div className="ingredient-input-section">
          <h2>What's in Your Kitchen?</h2>
          <p className="section-subtitle">Add ingredients you have at home to get personalized meal suggestions</p>
          
          <div className="input-wrapper">
            <input
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              placeholder="Type an ingredient (e.g., rice, tomato, egg)..."
              className="ingredient-input"
            />
            <button 
              onClick={() => addIngredient(inputValue)}
              className="add-btn"
              disabled={!inputValue.trim()}
            >
              Add
            </button>
          </div>

          {suggestions.length > 0 && (
            <div className="suggestions-dropdown">
              {suggestions.map((suggestion, idx) => (
                <button
                  key={idx}
                  className="suggestion-item"
                  onClick={() => addIngredient(suggestion)}
                >
                  {suggestion}
                </button>
              ))}
            </div>
          )}

          {ingredients.length > 0 && (
            <div className="selected-ingredients">
              <h3>Your Ingredients ({ingredients.length}):</h3>
              <div className="ingredient-chips">
                {ingredients.map((ingredient, idx) => (
                  <div key={idx} className="ingredient-chip">
                    <span>{ingredient}</span>
                    <button 
                      onClick={() => removeIngredient(ingredient)}
                      className="remove-chip-btn"
                      aria-label={`Remove ${ingredient}`}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Meal Suggestions Section */}
        <div className="meal-suggestions-section">
          <h2>Meal Suggestions</h2>
          
          {/* Weather Filter Buttons */}
          <div className="weather-filters">
            <button 
              className={`weather-filter-btn hot ${weather.category === 'hot' ? 'active' : ''}`}
              onClick={() => setWeather({...weather, category: 'hot', icon: '☀️', temperature: 35})}
            >
              ☀️ Hot
            </button>
            <button 
              className={`weather-filter-btn cold ${weather.category === 'cold' ? 'active' : ''}`}
              onClick={() => setWeather({...weather, category: 'cold', icon: '❄️', temperature: 10})}
            >
              ❄️ Cold
            </button>
            <button 
              className={`weather-filter-btn rainy ${weather.category === 'rainy' ? 'active' : ''}`}
              onClick={() => setWeather({...weather, category: 'rainy', icon: '🌧️', temperature: 22})}
            >
              🌧️ Rainy
            </button>
            <button 
              className={`weather-filter-btn humid ${weather.category === 'humid' ? 'active' : ''}`}
              onClick={() => setWeather({...weather, category: 'humid', icon: '💧', temperature: 28})}
            >
              💧 Humid
            </button>
            <button 
              className={`weather-filter-btn cloudy ${weather.category === 'cloudy' ? 'active' : ''}`}
              onClick={() => setWeather({...weather, category: 'cloudy', icon: '☁️', temperature: 20})}
            >
              ☁️ Cloudy
            </button>
          </div>
          
          {/* Meal Type Tabs */}
          <div className="meal-tabs">
            <button 
              className={`meal-tab ${activeTab === 'breakfast' ? 'active' : ''}`}
              onClick={() => setActiveTab('breakfast')}
            >
              🌅 Breakfast ({mealSuggestions.breakfast.length})
            </button>
            <button 
              className={`meal-tab ${activeTab === 'lunch' ? 'active' : ''}`}
              onClick={() => setActiveTab('lunch')}
            >
              🌞 Lunch ({mealSuggestions.lunch.length})
            </button>
            <button 
              className={`meal-tab ${activeTab === 'dinner' ? 'active' : ''}`}
              onClick={() => setActiveTab('dinner')}
            >
              🌙 Dinner ({mealSuggestions.dinner.length})
            </button>
            <button 
              className={`meal-tab ${activeTab === 'snacks' ? 'active' : ''}`}
              onClick={() => setActiveTab('snacks')}
            >
              🍪 Snacks ({mealSuggestions.snacks.length})
            </button>
            <button 
              className={`meal-tab ${activeTab === 'baby' ? 'active' : ''}`}
              onClick={() => setActiveTab('baby')}
            >
              👶 Baby Food ({mealSuggestions.baby.length})
            </button>
          </div>

          {/* Meal Cards */}
          <div className="meal-cards-grid">
            {currentMeals.length > 0 ? (
              currentMeals.map(meal => renderMealCard(meal))
            ) : (
              <div className="no-meals-message">
                <p>😔 No {activeTab} suggestions available with your current ingredients.</p>
                <p>Try adding more ingredients to get personalized recommendations!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MealPlanner;
