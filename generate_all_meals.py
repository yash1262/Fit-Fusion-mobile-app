import json

meals = []
meal_id = 1

# Template for generating meals for each weather type
def add_weather_meals(weather_types, meal_data, meal_id_start):
    global meal_id
    meal_id = meal_id_start
    
    for category, category_meals in meal_data.items():
        for meal in category_meals:
            meals.append({
                "id": meal_id,
                "name": meal["name"],
                "ingredients": meal["ing"],
                "tags": [category],
                "prepTime": meal["time"],
                "weatherCategories": weather_types,
                "image": meal["img"],
                "description": meal["desc"],
                "type": meal["type"],
                "protein": meal["prot"],
                "calories": meal["cal"]
            })
            meal_id += 1
    return meal_id

# COLD WEATHER MEALS
cold_meals = {
    "breakfast": [
        {"name": "Hot Oatmeal", "ing": ["oats", "milk", "honey"], "img": "🥣", "desc": "Warm breakfast", "type": "veg", "prot": "12g", "cal": "350", "time": "10 min"},
        {"name": "Scrambled Eggs", "ing": ["eggs", "butter", "milk"], "img": "🍳", "desc": "Protein breakfast", "type": "non-veg", "prot": "18g", "cal": "280", "time": "8 min"},
        {"name": "Pancakes", "ing": ["flour", "milk", "eggs", "syrup"], "img": "🥞", "desc": "Fluffy pancakes", "type": "veg", "prot": "10g", "cal": "400", "time": "15 min"},
        {"name": "French Toast", "ing": ["bread", "eggs", "cinnamon"], "img": "🍞", "desc": "Sweet toast", "type": "veg", "prot": "12g", "cal": "350", "time": "12 min"},
        {"name": "Porridge", "ing": ["oats", "milk", "banana"], "img": "🥣", "desc": "Creamy porridge", "type": "veg", "prot": "10g", "cal": "320", "time": "15 min"},
        {"name": "Egg Benedict", "ing": ["eggs", "bread", "ham"], "img": "🍳", "desc": "Classic breakfast", "type": "non-veg", "prot": "22g", "cal": "450", "time": "20 min"},
        {"name": "Waffles", "ing": ["flour", "eggs", "milk"], "img": "🧇", "desc": "Crispy waffles", "type": "veg", "prot": "8g", "cal": "380", "time": "15 min"},
        {"name": "Hot Chocolate", "ing": ["cocoa", "milk", "sugar"], "img": "☕", "desc": "Warm drink", "type": "veg", "prot": "8g", "cal": "250", "time": "5 min"},
        {"name": "Breakfast Burrito", "ing": ["tortilla", "eggs", "cheese"], "img": "🌯", "desc": "Filling wrap", "type": "veg", "prot": "20g", "cal": "420", "time": "15 min"},
        {"name": "Masala Chai", "ing": ["tea", "milk", "spices"], "img": "☕", "desc": "Spiced tea", "type": "veg", "prot": "4g", "cal": "120", "time": "10 min"}
    ],
    "lunch": [
        {"name": "Chicken Soup", "ing": ["chicken", "vegetables", "noodles"], "img": "🍲", "desc": "Warm soup", "type": "non-veg", "prot": "25g", "cal": "320", "time": "30 min"},
        {"name": "Dal Tadka", "ing": ["toor dal", "tomato", "spices"], "img": "🍛", "desc": "Lentil curry", "type": "veg", "prot": "18g", "cal": "280", "time": "25 min"},
        {"name": "Rajma Chawal", "ing": ["kidney beans", "rice", "spices"], "img": "🍚", "desc": "Bean rice", "type": "veg", "prot": "20g", "cal": "450", "time": "35 min"},
        {"name": "Butter Chicken", "ing": ["chicken", "butter", "cream"], "img": "🍗", "desc": "Rich curry", "type": "non-veg", "prot": "35g", "cal": "520", "time": "40 min"},
        {"name": "Vegetable Pulao", "ing": ["rice", "vegetables", "ghee"], "img": "🍚", "desc": "Spiced rice", "type": "veg", "prot": "8g", "cal": "380", "time": "25 min"},
        {"name": "Mutton Curry", "ing": ["mutton", "onion", "spices"], "img": "🍖", "desc": "Spicy curry", "type": "non-veg", "prot": "32g", "cal": "480", "time": "50 min"},
        {"name": "Chole Bhature", "ing": ["chickpeas", "flour", "spices"], "img": "🫓", "desc": "Punjabi dish", "type": "veg", "prot": "15g", "cal": "550", "time": "40 min"},
        {"name": "Biryani", "ing": ["rice", "chicken", "spices"], "img": "🍛", "desc": "Aromatic rice", "type": "non-veg", "prot": "28g", "cal": "580", "time": "45 min"},
        {"name": "Paneer Butter Masala", "ing": ["paneer", "butter", "cream"], "img": "🧀", "desc": "Creamy curry", "type": "veg", "prot": "22g", "cal": "420", "time": "30 min"},
        {"name": "Fish Curry", "ing": ["fish", "coconut", "spices"], "img": "🐟", "desc": "Coastal curry", "type": "non-veg", "prot": "30g", "cal": "350", "time": "35 min"}
    ],
    "dinner": [
        {"name": "Hot Pot", "ing": ["vegetables", "tofu", "broth"], "img": "🍲", "desc": "Asian hot pot", "type": "veg", "prot": "15g", "cal": "320", "time": "30 min"},
        {"name": "Ramen", "ing": ["noodles", "egg", "broth"], "img": "🍜", "desc": "Japanese noodles", "type": "non-veg", "prot": "20g", "cal": "450", "time": "25 min"},
        {"name": "Stew", "ing": ["meat", "potato", "carrot"], "img": "🍲", "desc": "Hearty stew", "type": "non-veg", "prot": "28g", "cal": "480", "time": "45 min"},
        {"name": "Pasta Alfredo", "ing": ["pasta", "cream", "cheese"], "img": "🍝", "desc": "Creamy pasta", "type": "veg", "prot": "18g", "cal": "520", "time": "20 min"},
        {"name": "Roast Chicken", "ing": ["chicken", "herbs", "vegetables"], "img": "🍗", "desc": "Oven roasted", "type": "non-veg", "prot": "40g", "cal": "550", "time": "60 min"},
        {"name": "Shepherd's Pie", "ing": ["meat", "potato", "vegetables"], "img": "��", "desc": "Comfort food", "type": "non-veg", "prot": "25g", "cal": "480", "time": "50 min"},
        {"name": "Lasagna", "ing": ["pasta", "cheese", "meat sauce"], "img": "🍝", "desc": "Layered pasta", "type": "non-veg", "prot": "30g", "cal": "580", "time": "55 min"},
        {"name": "Vegetable Casserole", "ing": ["vegetables", "cheese", "cream"], "img": "🥘", "desc": "Baked dish", "type": "veg", "prot": "12g", "cal": "380", "time": "40 min"},
        {"name": "Beef Stroganoff", "ing": ["beef", "mushroom", "cream"], "img": "🍖", "desc": "Russian dish", "type": "non-veg", "prot": "35g", "cal": "520", "time": "35 min"},
        {"name": "Mac and Cheese", "ing": ["pasta", "cheese", "milk"], "img": "🧀", "desc": "Cheesy pasta", "type": "veg", "prot": "20g", "cal": "450", "time": "25 min"}
    ],
    "snack": [
        {"name": "Hot Tea", "ing": ["tea", "milk", "sugar"], "img": "☕", "desc": "Warm beverage", "type": "veg", "prot": "2g", "cal": "80", "time": "5 min"},
        {"name": "Pakora", "ing": ["vegetables", "flour", "spices"], "img": "🥟", "desc": "Fried snack", "type": "veg", "prot": "6g", "cal": "220", "time": "15 min"},
        {"name": "Samosa", "ing": ["potato", "peas", "pastry"], "img": "🥟", "desc": "Crispy snack", "type": "veg", "prot": "5g", "cal": "250", "time": "20 min"},
        {"name": "Hot Soup", "ing": ["vegetables", "broth"], "img": "🍲", "desc": "Warm soup", "type": "veg", "prot": "4g", "cal": "120", "time": "15 min"},
        {"name": "Grilled Sandwich", "ing": ["bread", "cheese", "vegetables"], "img": "🥪", "desc": "Toasted sandwich", "type": "veg", "prot": "12g", "cal": "320", "time": "10 min"},
        {"name": "Muffin", "ing": ["flour", "eggs", "sugar"], "img": "🧁", "desc": "Sweet treat", "type": "veg", "prot": "6g", "cal": "280", "time": "5 min"},
        {"name": "Hot Chocolate Cookies", "ing": ["flour", "chocolate", "butter"], "img": "🍪", "desc": "Warm cookies", "type": "veg", "prot": "4g", "cal": "200", "time": "15 min"},
        {"name": "Corn Soup", "ing": ["corn", "milk", "butter"], "img": "🌽", "desc": "Creamy soup", "type": "veg", "prot": "6g", "cal": "180", "time": "15 min"},
        {"name": "Toast with Jam", "ing": ["bread", "butter", "jam"], "img": "🍞", "desc": "Simple snack", "type": "veg", "prot": "4g", "cal": "150", "time": "5 min"},
        {"name": "Hot Coffee", "ing": ["coffee", "milk", "sugar"], "img": "☕", "desc": "Energy boost", "type": "veg", "prot": "3g", "cal": "100", "time": "5 min"}
    ]
}

# Add COLD weather meals
meal_id = add_weather_meals(["cold"], cold_meals, meal_id)
print(f"Added COLD weather meals. Current ID: {meal_id}")

# Save
data = {
    "meals": meals,
    "commonIngredients": ["rice", "wheat flour", "bread", "oats", "pasta", "milk", "curd", "yogurt", "paneer", "cheese", "egg", "chicken", "fish", "mutton", "toor dal", "moong dal", "chickpeas", "potato", "onion", "tomato", "carrot", "cucumber", "spinach", "banana", "apple", "mango", "berries", "salt", "pepper", "turmeric", "cumin", "lemon", "honey"]
}

with open('src/data/mealsData.json', 'w') as f:
    json.dump(data, f, indent=2)

print(f"✅ Generated {len(meals)} meals total")
print(f"Breakfast: {len([m for m in meals if 'breakfast' in m['tags']])}")
print(f"Lunch: {len([m for m in meals if 'lunch' in m['tags']])}")
print(f"Dinner: {len([m for m in meals if 'dinner' in m['tags']])}")
print(f"Snacks: {len([m for m in meals if 'snack' in m['tags']])}")
