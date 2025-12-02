#!/usr/bin/env python3
"""
Generate comprehensive meals database for Fit-Fusion
Creates 10 meals for each category (breakfast, lunch, dinner, snacks) 
across all weather types (hot, cold, rainy, humid, cloudy)
"""

import json

meals_database = {
    "meals": [
        # HOT WEATHER - BREAKFAST (10 meals)
        {"id": 1, "name": "Fresh Fruit Bowl", "ingredients": ["banana", "apple", "grapes", "honey"], "tags": ["breakfast"], "prepTime": "5 min", "weatherCategories": ["hot", "humid"], "image": "🍎", "description": "Refreshing fruit mix", "type": "veg", "protein": "2g", "calories": "180"},
        {"id": 2, "name": "Smoothie Bowl", "ingredients": ["banana", "berries", "yogurt", "granola"], "tags": ["breakfast"], "prepTime": "10 min", "weatherCategories": ["hot", "humid"], "image": "🥤", "description": "Cool breakfast bowl", "type": "veg", "protein": "12g", "calories": "350"},
        {"id": 3, "name": "Chia Pudding", "ingredients": ["chia seeds", "almond milk", "berries", "honey"], "tags": ["breakfast"], "prepTime": "5 min", "weatherCategories": ["hot", "humid"], "image": "🥣", "description": "Nutritious cold pudding", "type": "veg", "protein": "8g", "calories": "250"},
        {"id": 4, "name": "Cold Cereal", "ingredients": ["cornflakes", "milk", "banana", "nuts"], "tags": ["breakfast"], "prepTime": "3 min", "weatherCategories": ["hot", "humid"], "image": "🥣", "description": "Quick cold breakfast", "type": "veg", "protein": "10g", "calories": "300"},
        {"id": 5, "name": "Yogurt Parfait", "ingredients": ["yogurt", "granola", "berries", "honey"], "tags": ["breakfast"], "prepTime": "5 min", "weatherCategories": ["hot", "humid"], "image": "🍨", "description": "Layered yogurt delight", "type": "veg", "protein": "15g", "calories": "280"},
        {"id": 6, "name": "Fruit Salad", "ingredients": ["mixed fruits", "mint", "lemon juice"], "tags": ["breakfast"], "prepTime": "8 min", "weatherCategories": ["hot", "humid"], "image": "🍓", "description": "Fresh fruit medley", "type": "veg", "protein": "3g", "calories": "150"},
        {"id": 7, "name": "Avocado Toast", "ingredients": ["bread", "avocado", "tomato", "lemon"], "tags": ["breakfast"], "prepTime": "10 min", "weatherCategories": ["hot", "humid"], "image": "🥑", "description": "Creamy avocado on toast", "type": "veg", "protein": "8g", "calories": "320"},
        {"id": 8, "name": "Mango Lassi", "ingredients": ["mango", "yogurt", "milk", "cardamom"], "tags": ["breakfast"], "prepTime": "5 min", "weatherCategories": ["hot", "humid"], "image": "🥭", "description": "Cool mango drink", "type": "veg", "protein": "8g", "calories": "200"},
        {"id": 9, "name": "Oats with Fruits", "ingredients": ["oats", "milk", "banana", "berries"], "tags": ["breakfast"], "prepTime": "10 min", "weatherCategories": ["hot", "humid"], "image": "🥣", "description": "Cold overnight oats", "type": "veg", "protein": "12g", "calories": "350"},
        {"id": 10, "name": "Egg White Omelette", "ingredients": ["egg whites", "spinach", "tomato", "cheese"], "tags": ["breakfast"], "prepTime": "12 min", "weatherCategories": ["hot", "humid"], "image": "🍳", "description": "Light protein omelette", "type": "non-veg", "protein": "20g", "calories": "180"},
        
        # HOT WEATHER - LUNCH (10 meals)
        {"id": 11, "name": "Curd Rice", "ingredients": ["rice", "curd", "cucumber", "curry leaves"], "tags": ["lunch"], "prepTime": "15 min", "weatherCategories": ["hot", "humid"], "image": "🍚", "description": "Cool and soothing", "type": "veg", "protein": "8g", "calories": "320"},
        {"id": 12, "name": "Greek Salad", "ingredients": ["lettuce", "feta", "olives", "tomato"], "tags": ["lunch"], "prepTime": "10 min", "weatherCategories": ["hot", "humid"], "image": "🥗", "description": "Mediterranean salad", "type": "veg", "protein": "12g", "calories": "250"},
        {"id": 13, "name": "Grilled Chicken Salad", "ingredients": ["chicken", "lettuce", "tomato", "cucumber"], "tags": ["lunch"], "prepTime": "20 min", "weatherCategories": ["hot", "humid"], "image": "🥗", "description": "Protein-rich salad", "type": "non-veg", "protein": "32g", "calories": "280"},
        {"id": 14, "name": "Lemon Rice", "ingredients": ["rice", "lemon", "peanuts", "turmeric"], "tags": ["lunch"], "prepTime": "15 min", "weatherCategories": ["hot", "humid"], "image": "🍋", "description": "Tangy rice dish", "type": "veg", "protein": "6g", "calories": "300"},
        {"id": 15, "name": "Cold Pasta Salad", "ingredients": ["pasta", "vegetables", "olive oil", "herbs"], "tags": ["lunch"], "prepTime": "20 min", "weatherCategories": ["hot", "humid"], "image": "🍝", "description": "Chilled pasta", "type": "veg", "protein": "10g", "calories": "350"},
        {"id": 16, "name": "Tuna Salad", "ingredients": ["tuna", "lettuce", "corn", "mayo"], "tags": ["lunch"], "prepTime": "10 min", "weatherCategories": ["hot", "humid"], "image": "🐟", "description": "Light fish salad", "type": "non-veg", "protein": "28g", "calories": "260"},
        {"id": 17, "name": "Quinoa Bowl", "ingredients": ["quinoa", "vegetables", "chickpeas", "lemon"], "tags": ["lunch"], "prepTime": "25 min", "weatherCategories": ["hot", "humid"], "image": "🥗", "description": "Protein-packed bowl", "type": "veg", "protein": "15g", "calories": "380"},
        {"id": 18, "name": "Cucumber Raita", "ingredients": ["cucumber", "yogurt", "mint", "cumin"], "tags": ["lunch"], "prepTime": "8 min", "weatherCategories": ["hot", "humid"], "image": "🥒", "description": "Cooling side dish", "type": "veg", "protein": "6g", "calories": "120"},
        {"id": 19, "name": "Sprouts Salad", "ingredients": ["moong sprouts", "tomato", "onion", "lemon"], "tags": ["lunch"], "prepTime": "10 min", "weatherCategories": ["hot", "humid"], "image": "🥗", "description": "Healthy sprouts", "type": "veg", "protein": "12g", "calories": "150"},
        {"id": 20, "name": "Grilled Fish", "ingredients": ["fish", "lemon", "herbs", "vegetables"], "tags": ["lunch"], "prepTime": "25 min", "weatherCategories": ["hot", "humid"], "image": "🐟", "description": "Light grilled fish", "type": "non-veg", "protein": "30g", "calories": "280"},
        
        # Continue with DINNER, SNACKS for HOT weather, then COLD, RAINY, HUMID, CLOUDY...
        # This is a template - you can expand it
    ],
    "commonIngredients": [
        "rice", "wheat flour", "bread", "oats", "semolina", "pasta", "quinoa",
        "milk", "curd", "yogurt", "paneer", "cheese", "butter", "ghee", "cream",
        "egg", "chicken", "fish", "tuna", "prawns",
        "toor dal", "moong dal", "urad dal", "chickpeas", "kidney beans",
        "potato", "onion", "tomato", "carrot", "peas", "beans", "cucumber", "spinach", "broccoli",
        "banana", "apple", "grapes", "mango", "orange", "berries", "avocado",
        "salt", "pepper", "turmeric", "cumin", "mustard seeds", "curry leaves", "coriander",
        "lemon", "honey", "sugar", "oil", "olive oil"
    ]
}

# Write to file
with open('src/data/mealsData.json', 'w') as f:
    json.dump(meals_database, f, indent=2)

print("✅ Meals database generated successfully!")
print(f"📊 Total meals: {len(meals_database['meals'])}")
print("📝 Note: This is a starter template. Expand with more meals for each category and weather type.")
