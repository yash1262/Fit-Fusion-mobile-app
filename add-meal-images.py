import json

# Read the existing meals database
with open('src/data/mealsData.json', 'r') as f:
    data = json.load(f)

# Curated Unsplash food images for different meal types
meal_images = {
    # Breakfast items
    "fruit": "https://images.unsplash.com/photo-1564093497595-593b96d80180?w=800&q=80",
    "smoothie": "https://images.unsplash.com/photo-1590301157890-4810ed352733?w=800&q=80",
    "chia": "https://images.unsplash.com/photo-1623428187969-5da2dcea5ebf?w=800&q=80",
    "yogurt": "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=800&q=80",
    "oatmeal": "https://images.unsplash.com/photo-1517673132405-a56a62b18caf?w=800&q=80",
    "oats": "https://images.unsplash.com/photo-1517673132405-a56a62b18caf?w=800&q=80",
    "porridge": "https://images.unsplash.com/photo-1517673132405-a56a62b18caf?w=800&q=80",
    "pancake": "https://images.unsplash.com/photo-1528207776546-365bb710ee93?w=800&q=80",
    "waffle": "https://images.unsplash.com/photo-1562376552-0d160a2f238d?w=800&q=80",
    "toast": "https://images.unsplash.com/photo-1525351484163-7529414344d8?w=800&q=80",
    "egg": "https://images.unsplash.com/photo-1525351484163-7529414344d8?w=800&q=80",
    "scrambled": "https://images.unsplash.com/photo-1525351484163-7529414344d8?w=800&q=80",
    "omelet": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80",
    "poha": "https://images.unsplash.com/photo-1630383249896-424e482df921?w=800&q=80",
    "upma": "https://images.unsplash.com/photo-1630383249896-424e482df921?w=800&q=80",
    "idli": "https://images.unsplash.com/photo-1630383249896-424e482df921?w=800&q=80",
    "dosa": "https://images.unsplash.com/photo-1630383249896-424e482df921?w=800&q=80",
    "paratha": "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&q=80",
    
    # Salads
    "salad": "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=800&q=80",
    "caesar": "https://images.unsplash.com/photo-1546793665-c74683f339c1?w=800&q=80",
    "greek": "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=800&q=80",
    "quinoa": "https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?w=800&q=80",
    "watermelon": "https://images.unsplash.com/photo-1621510456681-2330135e5871?w=800&q=80",
    
    # Rice dishes
    "rice": "https://images.unsplash.com/photo-1516684732162-798a0062be99?w=800&q=80",
    "biryani": "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&q=80",
    "pulao": "https://images.unsplash.com/photo-1596797038530-2c107229654b?w=800&q=80",
    "fried rice": "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=800&q=80",
    "khichdi": "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800&q=80",
    
    # Curries and gravies
    "curry": "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800&q=80",
    "dal": "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800&q=80",
    "rajma": "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800&q=80",
    "chole": "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800&q=80",
    "paneer": "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=800&q=80",
    "butter chicken": "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=800&q=80",
    "chicken": "https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=800&q=80",
    "mutton": "https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=800&q=80",
    
    # Soups
    "soup": "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=800&q=80",
    "tomato soup": "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=800&q=80",
    "lentil": "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=800&q=80",
    "gazpacho": "https://images.unsplash.com/photo-1541529086526-db283c563270?w=800&q=80",
    
    # Noodles and pasta
    "noodle": "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=800&q=80",
    "ramen": "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=800&q=80",
    "pasta": "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=800&q=80",
    "spaghetti": "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=800&q=80",
    "mac": "https://images.unsplash.com/photo-1543339494-b4cd4f7ba686?w=800&q=80",
    "lasagna": "https://images.unsplash.com/photo-1574894709920-11b28e7367e3?w=800&q=80",
    
    # Sandwiches and wraps
    "sandwich": "https://images.unsplash.com/photo-1528736235302-52922df5c122?w=800&q=80",
    "wrap": "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=800&q=80",
    "burrito": "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=800&q=80",
    "taco": "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=800&q=80",
    "burger": "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&q=80",
    
    # Fish and seafood
    "fish": "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=800&q=80",
    "salmon": "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=800&q=80",
    "tuna": "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=800&q=80",
    "prawn": "https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?w=800&q=80",
    "shrimp": "https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?w=800&q=80",
    
    # Sushi and Asian
    "sushi": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80",
    "poke": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80",
    "stir fry": "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=800&q=80",
    
    # Snacks
    "pakora": "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&q=80",
    "samosa": "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&q=80",
    "spring roll": "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&q=80",
    "fries": "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=800&q=80",
    "chips": "https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=800&q=80",
    "nachos": "https://images.unsplash.com/photo-1582169296194-e4d644c48063?w=800&q=80",
    "popcorn": "https://images.unsplash.com/photo-1578849278619-e73505e9610f?w=800&q=80",
    "nuts": "https://images.unsplash.com/photo-1599599810769-bcde5a160d32?w=800&q=80",
    "trail mix": "https://images.unsplash.com/photo-1599599810769-bcde5a160d32?w=800&q=80",
    
    # Beverages
    "tea": "https://images.unsplash.com/photo-1571934811356-5cc061b6821f?w=800&q=80",
    "chai": "https://images.unsplash.com/photo-1571934811356-5cc061b6821f?w=800&q=80",
    "coffee": "https://images.unsplash.com/photo-1542990253-0d0f5be5f0ed?w=800&q=80",
    "hot chocolate": "https://images.unsplash.com/photo-1542990253-0d0f5be5f0ed?w=800&q=80",
    "juice": "https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=800&q=80",
    "shake": "https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=800&q=80",
    "lassi": "https://images.unsplash.com/photo-1563636619-e9143da7973b?w=800&q=80",
    "buttermilk": "https://images.unsplash.com/photo-1563636619-e9143da7973b?w=800&q=80",
    
    # Desserts
    "ice cream": "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=800&q=80",
    "popsicle": "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=800&q=80",
    "cake": "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&q=80",
    "cookie": "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=800&q=80",
    "brownie": "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=800&q=80",
    "muffin": "https://images.unsplash.com/photo-1607958996333-41aef7caefaa?w=800&q=80",
    
    # Vegetables
    "cucumber": "https://images.unsplash.com/photo-1603046891726-36bfd957e0bf?w=800&q=80",
    "hummus": "https://images.unsplash.com/photo-1603046891726-36bfd957e0bf?w=800&q=80",
    "avocado": "https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=800&q=80",
    
    # Bowls
    "bowl": "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&q=80",
    "buddha": "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&q=80",
    "poke bowl": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80",
    
    # Stews and casseroles
    "stew": "https://images.unsplash.com/photo-1588566565463-180a5b2090d2?w=800&q=80",
    "casserole": "https://images.unsplash.com/photo-1588566565463-180a5b2090d2?w=800&q=80",
    "hot pot": "https://images.unsplash.com/photo-1588566565463-180a5b2090d2?w=800&q=80",
    
    # Grilled items
    "grilled": "https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=800&q=80",
    "bbq": "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&q=80",
    "kebab": "https://images.unsplash.com/photo-1603360946369-dc9bb6258143?w=800&q=80",
    
    # Breads
    "bread": "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&q=80",
    "naan": "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&q=80",
    "roti": "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&q=80",
    "bhature": "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&q=80",
    
    # Coconut items
    "coconut": "https://images.unsplash.com/photo-1585238341710-4a1b0d2d1b5d?w=800&q=80",
    
    # Raita
    "raita": "https://images.unsplash.com/photo-1623428187969-5da2dcea5ebf?w=800&q=80",
}

# Default fallback images for different meal types
default_images = {
    "breakfast": "https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?w=800&q=80",
    "lunch": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80",
    "dinner": "https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=800&q=80",
    "snack": "https://images.unsplash.com/photo-1568471173238-64ed8e7e9d8e?w=800&q=80",
}

def get_image_url(meal_name, meal_tags):
    """Find the best matching image URL for a meal"""
    name_lower = meal_name.lower()
    
    # Try to find exact or partial match in meal_images
    for keyword, url in meal_images.items():
        if keyword in name_lower:
            return url
    
    # Fall back to default image based on meal type
    for tag in meal_tags:
        if tag in default_images:
            return default_images[tag]
    
    # Ultimate fallback
    return "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80"

# Add imageUrl to each meal
meals_updated = 0
for meal in data['meals']:
    if 'imageUrl' not in meal:
        meal['imageUrl'] = get_image_url(meal['name'], meal['tags'])
        meals_updated += 1

# Save the updated database
with open('src/data/mealsData.json', 'w') as f:
    json.dump(data, f, indent=2)

print(f"✅ Successfully added imageUrl to {meals_updated} meals")
print(f"📊 Total meals in database: {len(data['meals'])}")
