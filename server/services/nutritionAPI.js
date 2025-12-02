const axios = require('axios');

// Using USDA FoodData Central API or similar nutrition API
const getNutritionInfo = async (foodName, quantity = 100) => {
  try {
    // Example using USDA FoodData Central API
    const response = await axios.get(
      `https://api.nal.usda.gov/fdc/v1/foods/search`,
      {
        params: {
          query: foodName,
          pageSize: 1,
          api_key: process.env.USDA_API_KEY,
        },
      }
    );

    if (response.data.foods && response.data.foods.length > 0) {
      const food = response.data.foods[0];
      const nutrients = food.foodNutrients;

      // Extract key nutrients
      const nutritionData = {
        name: food.description,
        quantity: quantity,
        unit: 'g',
        calories: extractNutrient(nutrients, 'Energy') || 0,
        protein: extractNutrient(nutrients, 'Protein') || 0,
        carbs: extractNutrient(nutrients, 'Carbohydrate, by difference') || 0,
        fats: extractNutrient(nutrients, 'Total lipid (fat)') || 0,
        fiber: extractNutrient(nutrients, 'Fiber, total dietary') || 0,
      };

      // Adjust for quantity
      const ratio = quantity / 100;
      Object.keys(nutritionData).forEach(key => {
        if (typeof nutritionData[key] === 'number') {
          nutritionData[key] = Math.round(nutritionData[key] * ratio * 10) / 10;
        }
      });

      return nutritionData;
    } else {
      // Fallback if no data found
      return getFallbackNutrition(foodName, quantity);
    }
  } catch (error) {
    console.error('Nutrition API Error:', error.message);
    return getFallbackNutrition(foodName, quantity);
  }
};

// Helper function to extract nutrient value
const extractNutrient = (nutrients, nutrientName) => {
  const nutrient = nutrients.find(n => n.nutrientName === nutrientName);
  return nutrient ? nutrient.value : null;
};

// Fallback nutrition data
const getFallbackNutrition = (foodName, quantity) => {
  return {
    name: foodName,
    quantity: quantity,
    unit: 'g',
    calories: 150,
    protein: 5,
    carbs: 20,
    fats: 5,
    fiber: 2,
    note: 'Estimated values - please verify',
  };
};

module.exports = {
  getNutritionInfo,
};
