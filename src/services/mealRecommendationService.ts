// Meal Recommendation Service
// Smart matching algorithm for meal suggestions based on available ingredients and weather

import mealsData from '../data/mealsData.json';
import { WeatherData } from './weatherService';

export interface Meal {
  id: number;
  name: string;
  ingredients: string[];
  tags: string[];
  prepTime: string;
  weatherCategories: string[];
  image: string;
  description: string;
  type: 'veg' | 'non-veg';
  protein: string;
  calories: string;
  matchScore?: number;
  missingIngredients?: string[];
  availableIngredients?: string[];
}

export interface MealSuggestions {
  breakfast: Meal[];
  lunch: Meal[];
  dinner: Meal[];
  snacks: Meal[];
  baby: Meal[];
}

/**
 * Calculate match score for a meal based on available ingredients
 * Returns: { score: 0-100, missing: [], available: [] }
 */
const calculateMatchScore = (meal: Meal, availableIngredients: string[]): {
  score: number;
  missing: string[];
  available: string[];
} => {
  const mealIngredients = meal.ingredients.map(i => i.toLowerCase());
  const available = availableIngredients.map(i => i.toLowerCase());
  
  const matchedIngredients = mealIngredients.filter(ingredient => 
    available.includes(ingredient)
  );
  
  const missingIngredients = mealIngredients.filter(ingredient => 
    !available.includes(ingredient)
  );
  
  // Calculate score: (matched / total) * 100
  const score = (matchedIngredients.length / mealIngredients.length) * 100;
  
  return {
    score: Math.round(score),
    missing: missingIngredients,
    available: matchedIngredients
  };
};

/**
 * Filter meals by weather category
 */
const filterByWeather = (meals: Meal[], weatherCategory: string): Meal[] => {
  return meals.filter(meal => 
    meal.weatherCategories.includes(weatherCategory)
  );
};

/**
 * Filter meals by tag (breakfast, lunch, dinner, snack)
 */
const filterByTag = (meals: Meal[], tag: string): Meal[] => {
  return meals.filter(meal => meal.tags.includes(tag));
};

/**
 * Sort meals by match score
 */
const sortByMatchScore = (meals: Meal[]): Meal[] => {
  return meals.sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));
};

/**
 * Get meal suggestions based on weather and available ingredients
 */
export const getMealSuggestions = (
  weather: WeatherData,
  availableIngredients: string[]
): MealSuggestions => {
  const allMeals: Meal[] = mealsData.meals as Meal[];
  
  // Filter meals suitable for current weather
  const weatherSuitableMeals = filterByWeather(allMeals, weather.category);
  
  // Calculate match scores for all meals
  const mealsWithScores = weatherSuitableMeals.map(meal => {
    const { score, missing, available } = calculateMatchScore(meal, availableIngredients);
    return {
      ...meal,
      matchScore: score,
      missingIngredients: missing,
      availableIngredients: available
    };
  });
  
  // If no ingredients provided, show all weather-suitable meals
  // Otherwise show meals with ANY matching ingredients (at least 1 ingredient match)
  const viableMeals = availableIngredients.length === 0 
    ? mealsWithScores 
    : mealsWithScores.filter(meal => 
        meal.matchScore && meal.matchScore > 0
      );
  
  // Sort by match score
  const sortedMeals = sortByMatchScore(viableMeals);
  
  // Categorize by meal type (show ALL matching meals)
  const breakfast = sortByMatchScore(filterByTag(sortedMeals, 'breakfast'));
  const lunch = sortByMatchScore(filterByTag(sortedMeals, 'lunch'));
  const dinner = sortByMatchScore(filterByTag(sortedMeals, 'dinner'));
  const snacks = sortByMatchScore(filterByTag(sortedMeals, 'snack'));
  const baby = sortByMatchScore(filterByTag(sortedMeals, 'baby'));
  
  return {
    breakfast,
    lunch,
    dinner,
    snacks,
    baby
  };
};

/**
 * Get ingredient suggestions based on partial input
 */
export const getIngredientSuggestions = (input: string): string[] => {
  const inputLower = input.toLowerCase().trim();
  
  if (inputLower.length < 2) {
    return [];
  }
  
  return mealsData.commonIngredients
    .filter(ingredient => ingredient.toLowerCase().includes(inputLower))
    .slice(0, 10);
};

/**
 * Get popular meal recommendations (shows ALL meals for current weather when no ingredients provided)
 */
export const getPopularMeals = (weather: WeatherData, availableIngredients: string[] = []): MealSuggestions => {
  const allMeals: Meal[] = mealsData.meals as Meal[];
  const weatherSuitableMeals = filterByWeather(allMeals, weather.category);
  
  // Calculate match scores for all meals
  const mealsWithScores = weatherSuitableMeals.map(meal => {
    const { score, missing, available } = calculateMatchScore(meal, availableIngredients);
    return {
      ...meal,
      matchScore: score,
      missingIngredients: missing,
      availableIngredients: available
    };
  });
  
  // If no ingredients provided, show ALL weather-suitable meals
  // Otherwise show meals with ANY matching ingredients (at least 1 ingredient match)
  const viableMeals = availableIngredients.length === 0 
    ? mealsWithScores 
    : mealsWithScores.filter(meal => 
        meal.matchScore && meal.matchScore > 0
      );
  
  // Sort by match score
  const sortedMeals = sortByMatchScore(viableMeals);
  
  // Return ALL matching meals (not limited)
  return {
    breakfast: sortByMatchScore(filterByTag(sortedMeals, 'breakfast')),
    lunch: sortByMatchScore(filterByTag(sortedMeals, 'lunch')),
    dinner: sortByMatchScore(filterByTag(sortedMeals, 'dinner')),
    snacks: sortByMatchScore(filterByTag(sortedMeals, 'snack')),
    baby: sortByMatchScore(filterByTag(sortedMeals, 'baby'))
  };
};
