import json

# Read the existing meals data
with open('src/data/mealsData.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

# Baby meals to add
baby_meals = [
    {
        "id": 201,
        "name": "Warm Vegetable Puree",
        "ingredients": ["carrot", "potato", "peas"],
        "tags": ["baby"],
        "prepTime": "20 min",
        "weatherCategories": ["cold"],
        "image": "🍲",
        "description": "Warm mashed veggies for babies (6-12 months)",
        "type": "veg",
        "protein": "3g",
        "calories": "80",
        "ageGroup": "6-12 months"
    },
    {
        "id": 202,
        "name": "Warm Rice Cereal",
        "ingredients": ["rice", "milk", "ghee"],
        "tags": ["baby"],
        "prepTime": "15 min",
        "weatherCategories": ["cold"],
        "image": "🍚",
        "description": "Soft warm rice for infants (6-12 months)",
        "type": "veg",
        "protein": "4g",
        "calories": "120",
        "ageGroup": "6-12 months"
    },
    {
        "id": 203,
        "name": "Warm Lentil Soup",
        "ingredients": ["moong dal", "carrot", "ghee"],
        "tags": ["baby"],
        "prepTime": "25 min",
        "weatherCategories": ["cold"],
        "image": "🍵",
        "description": "Protein-rich warm soup (8-12 months)",
        "type": "veg",
        "protein": "6g",
        "calories": "100",
        "ageGroup": "8-12 months"
    },
    {
        "id": 204,
        "name": "Warm Oatmeal Porridge",
        "ingredients": ["oats", "milk", "banana"],
        "tags": ["baby"],
        "prepTime": "10 min",
        "weatherCategories": ["cold"],
        "image": "🥣",
        "description": "Creamy warm oats (8-12 months)",
        "type": "veg",
        "protein": "5g",
        "calories": "150",
        "ageGroup": "8-12 months"
    },
    {
        "id": 205,
        "name": "Warm Sweet Potato Mash",
        "ingredients": ["sweet potato", "milk", "butter"],
        "tags": ["baby"],
        "prepTime": "20 min",
        "weatherCategories": ["cold"],
        "image": "🍠",
        "description": "Nutritious warm mash (6-12 months)",
        "type": "veg",
        "protein": "2g",
        "calories": "110",
        "ageGroup": "6-12 months"
    },
    {
        "id": 206,
        "name": "Warm Chicken Puree",
        "ingredients": ["chicken", "carrot", "rice"],
        "tags": ["baby"],
        "prepTime": "30 min",
        "weatherCategories": ["cold"],
        "image": "🍗",
        "description": "Protein-rich warm meal (10-12 months)",
        "type": "non-veg",
        "protein": "10g",
        "calories": "140",
        "ageGroup": "10-12 months"
    },
    {
        "id": 207,
        "name": "Warm Apple Sauce",
        "ingredients": ["apple", "cinnamon"],
        "tags": ["baby"],
        "prepTime": "15 min",
        "weatherCategories": ["cold"],
        "image": "🍎",
        "description": "Warm fruit puree (6-12 months)",
        "type": "veg",
        "protein": "1g",
        "calories": "70",
        "ageGroup": "6-12 months"
    },
    {
        "id": 208,
        "name": "Warm Khichdi",
        "ingredients": ["rice", "moong dal", "ghee"],
        "tags": ["baby"],
        "prepTime": "25 min",
        "weatherCategories": ["cold"],
        "image": "🍲",
        "description": "Traditional warm baby food (8-12 months)",
        "type": "veg",
        "protein": "7g",
        "calories": "130",
        "ageGroup": "8-12 months"
    },
    {
        "id": 209,
        "name": "Cool Mashed Banana",
        "ingredients": ["banana", "milk"],
        "tags": ["baby"],
        "prepTime": "5 min",
        "weatherCategories": ["hot", "humid"],
        "image": "🍌",
        "description": "Cool easy fruit mash (6-12 months)",
        "type": "veg",
        "protein": "2g",
        "calories": "90",
        "ageGroup": "6-12 months"
    },
    {
        "id": 210,
        "name": "Cool Yogurt with Fruit",
        "ingredients": ["yogurt", "mashed fruit"],
        "tags": ["baby"],
        "prepTime": "5 min",
        "weatherCategories": ["hot", "humid"],
        "image": "🍨",
        "description": "Cool probiotic snack (8-12 months)",
        "type": "veg",
        "protein": "5g",
        "calories": "100",
        "ageGroup": "8-12 months"
    },
    {
        "id": 211,
        "name": "Cool Cucumber Puree",
        "ingredients": ["cucumber", "yogurt"],
        "tags": ["baby"],
        "prepTime": "10 min",
        "weatherCategories": ["hot", "humid"],
        "image": "🥒",
        "description": "Hydrating cool puree (8-12 months)",
        "type": "veg",
        "protein": "3g",
        "calories": "50",
        "ageGroup": "8-12 months"
    },
    {
        "id": 212,
        "name": "Cool Watermelon Puree",
        "ingredients": ["watermelon"],
        "tags": ["baby"],
        "prepTime": "5 min",
        "weatherCategories": ["hot", "humid"],
        "image": "🍉",
        "description": "Refreshing fruit puree (8-12 months)",
        "type": "veg",
        "protein": "1g",
        "calories": "60",
        "ageGroup": "8-12 months"
    },
    {
        "id": 213,
        "name": "Cool Avocado Mash",
        "ingredients": ["avocado", "milk"],
        "tags": ["baby"],
        "prepTime": "5 min",
        "weatherCategories": ["hot", "humid"],
        "image": "🥑",
        "description": "Creamy cool mash (6-12 months)",
        "type": "veg",
        "protein": "2g",
        "calories": "120",
        "ageGroup": "6-12 months"
    },
    {
        "id": 214,
        "name": "Cool Mango Puree",
        "ingredients": ["mango", "yogurt"],
        "tags": ["baby"],
        "prepTime": "8 min",
        "weatherCategories": ["hot", "humid"],
        "image": "🥭",
        "description": "Sweet cool fruit (8-12 months)",
        "type": "veg",
        "protein": "3g",
        "calories": "95",
        "ageGroup": "8-12 months"
    },
    {
        "id": 215,
        "name": "Cool Rice Porridge",
        "ingredients": ["rice", "milk"],
        "tags": ["baby"],
        "prepTime": "15 min",
        "weatherCategories": ["hot", "humid"],
        "image": "🍚",
        "description": "Light cool porridge (6-12 months)",
        "type": "veg",
        "protein": "4g",
        "calories": "110",
        "ageGroup": "6-12 months"
    },
    {
        "id": 216,
        "name": "Cool Curd Rice",
        "ingredients": ["rice", "curd", "carrot"],
        "tags": ["baby"],
        "prepTime": "15 min",
        "weatherCategories": ["hot", "humid"],
        "image": "🍚",
        "description": "Soothing cool meal (10-12 months)",
        "type": "veg",
        "protein": "5g",
        "calories": "130",
        "ageGroup": "10-12 months"
    },
    {
        "id": 217,
        "name": "Mild Vegetable Soup",
        "ingredients": ["carrot", "potato", "peas"],
        "tags": ["baby"],
        "prepTime": "20 min",
        "weatherCategories": ["rainy", "cloudy"],
        "image": "🍲",
        "description": "Comforting soup (8-12 months)",
        "type": "veg",
        "protein": "3g",
        "calories": "85",
        "ageGroup": "8-12 months"
    },
    {
        "id": 218,
        "name": "Soft Roti with Ghee",
        "ingredients": ["wheat flour", "ghee", "milk"],
        "tags": ["baby"],
        "prepTime": "15 min",
        "weatherCategories": ["rainy", "cloudy", "cold"],
        "image": "🫓",
        "description": "Soft bread for babies (10-12 months)",
        "type": "veg",
        "protein": "4g",
        "calories": "140",
        "ageGroup": "10-12 months"
    },
    {
        "id": 219,
        "name": "Warm Milk with Dates",
        "ingredients": ["milk", "dates"],
        "tags": ["baby"],
        "prepTime": "10 min",
        "weatherCategories": ["cold", "rainy"],
        "image": "🥛",
        "description": "Nutritious warm drink (10-12 months)",
        "type": "veg",
        "protein": "8g",
        "calories": "150",
        "ageGroup": "10-12 months"
    },
    {
        "id": 220,
        "name": "Soft Idli with Ghee",
        "ingredients": ["rice", "urad dal", "ghee"],
        "tags": ["baby"],
        "prepTime": "30 min",
        "weatherCategories": ["rainy", "cloudy", "cold"],
        "image": "🍘",
        "description": "Soft steamed cake (10-12 months)",
        "type": "veg",
        "protein": "5g",
        "calories": "120",
        "ageGroup": "10-12 months"
    }
]

# Add baby meals to the meals array
data['meals'].extend(baby_meals)

# Write back to file
with open('src/data/mealsData.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, indent=2, ensure_ascii=False)

print("✅ Successfully added 20 baby/infant meals!")
print("📊 Total meals now:", len(data['meals']))
