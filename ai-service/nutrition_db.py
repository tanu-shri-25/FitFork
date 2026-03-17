# Nutritional data per 100g (approximate USDA values)
# Format: ingredient_name -> {calories, protein, carbs, fat}  (all in grams/kcal)

NUTRITION_DB = {
    # Proteins
    "chicken": {"calories": 165, "protein": 31, "carbs": 0, "fat": 3.6},
    "chicken breast": {"calories": 165, "protein": 31, "carbs": 0, "fat": 3.6},
    "grilled chicken": {"calories": 165, "protein": 31, "carbs": 0, "fat": 3.6},
    "egg": {"calories": 155, "protein": 13, "carbs": 1.1, "fat": 11},
    "eggs": {"calories": 155, "protein": 13, "carbs": 1.1, "fat": 11},
    "paneer": {"calories": 265, "protein": 18, "carbs": 3.6, "fat": 20},
    "tofu": {"calories": 76,  "protein": 8,  "carbs": 1.9, "fat": 4.8},
    "fish": {"calories": 136, "protein": 25, "carbs": 0,   "fat": 3.4},
    "salmon": {"calories": 208, "protein": 20, "carbs": 0,   "fat": 13},
    "tuna": {"calories": 132, "protein": 28, "carbs": 0,   "fat": 1.3},
    "lentils": {"calories": 116, "protein": 9,  "carbs": 20,  "fat": 0.4},
    "dal": {"calories": 116, "protein": 9,  "carbs": 20,  "fat": 0.4},
    "chickpeas": {"calories": 164, "protein": 9,  "carbs": 27,  "fat": 2.6},
    "chole": {"calories": 164, "protein": 9,  "carbs": 27,  "fat": 2.6},
    "kidney beans": {"calories": 127, "protein": 9,  "carbs": 23,  "fat": 0.5},
    "rajma": {"calories": 127, "protein": 9,  "carbs": 23,  "fat": 0.5},
    "greek yogurt": {"calories": 59,  "protein": 10, "carbs": 3.6, "fat": 0.4},
    "yogurt": {"calories": 61,  "protein": 3.5,"carbs": 4.7, "fat": 3.3},

    # Carbohydrates / Grains
    "brown rice": {"calories": 110, "protein": 2.6, "carbs": 23, "fat": 0.9},
    "white rice": {"calories": 130, "protein": 2.7, "carbs": 28, "fat": 0.3},
    "rice": {"calories": 130, "protein": 2.7, "carbs": 28, "fat": 0.3},
    "oats": {"calories": 389, "protein": 17,  "carbs": 66, "fat": 7.0},
    "oatmeal": {"calories": 389, "protein": 17,  "carbs": 66, "fat": 7.0},
    "quinoa": {"calories": 120, "protein": 4.4, "carbs": 22, "fat": 1.9},
    "whole wheat bread": {"calories": 247, "protein": 13,  "carbs": 41, "fat": 3.4},
    "bread": {"calories": 265, "protein": 9,   "carbs": 49, "fat": 3.2},
    "roti": {"calories": 297, "protein": 9,   "carbs": 61, "fat": 3.0},
    "chapati": {"calories": 297, "protein": 9,   "carbs": 61, "fat": 3.0},
    "sweet potato": {"calories": 86,  "protein": 1.6, "carbs": 20, "fat": 0.1},
    "pasta": {"calories": 131, "protein": 5,   "carbs": 25, "fat": 1.1},

    # Vegetables
    "broccoli": {"calories": 34,  "protein": 2.8, "carbs": 7,   "fat": 0.4},
    "spinach": {"calories": 23,  "protein": 2.9, "carbs": 3.6, "fat": 0.4},
    "carrot": {"calories": 41,  "protein": 0.9, "carbs": 10,  "fat": 0.2},
    "tomato": {"calories": 18,  "protein": 0.9, "carbs": 3.9, "fat": 0.2},
    "cucumber": {"calories": 15,  "protein": 0.7, "carbs": 3.6, "fat": 0.1},
    "onion": {"calories": 40,  "protein": 1.1, "carbs": 9.3, "fat": 0.1},
    "capsicum": {"calories": 31,  "protein": 1.0, "carbs": 6.0, "fat": 0.3},
    "peppers": {"calories": 31,  "protein": 1.0, "carbs": 6.0, "fat": 0.3},
    "lettuce": {"calories": 15,  "protein": 1.4, "carbs": 2.9, "fat": 0.2},
    "cabbage": {"calories": 25,  "protein": 1.3, "carbs": 5.8, "fat": 0.1},
    "vegetables": {"calories": 35,  "protein": 2.0, "carbs": 7.0, "fat": 0.3},
    "mixed vegetables": {"calories": 35,  "protein": 2.0, "carbs": 7.0, "fat": 0.3},

    # Fats / Oils
    "olive oil": {"calories": 884, "protein": 0,   "carbs": 0,   "fat": 100},
    "coconut oil": {"calories": 862, "protein": 0,   "carbs": 0,   "fat": 100},
    "butter": {"calories": 717, "protein": 0.9, "carbs": 0.1, "fat": 81},
    "ghee": {"calories": 900, "protein": 0,   "carbs": 0,   "fat": 100},
    "nuts": {"calories": 607, "protein": 20,  "carbs": 22,  "fat": 54},
    "almonds": {"calories": 579, "protein": 21,  "carbs": 22,  "fat": 50},
    "avocado": {"calories": 160, "protein": 2.0, "carbs": 9.0, "fat": 15},

    # Fruits
    "banana": {"calories": 89,  "protein": 1.1, "carbs": 23,  "fat": 0.3},
    "apple": {"calories": 52,  "protein": 0.3, "carbs": 14,  "fat": 0.2},
    "berries": {"calories": 57,  "protein": 0.7, "carbs": 14,  "fat": 0.3},
    "mango": {"calories": 60,  "protein": 0.8, "carbs": 15,  "fat": 0.4},

    # Dairy
    "milk": {"calories": 61,  "protein": 3.2, "carbs": 4.8, "fat": 3.3},
    "cheese": {"calories": 402, "protein": 25,  "carbs": 1.3, "fat": 33},
    "cottage cheese": {"calories": 98,  "protein": 11,  "carbs": 3.4, "fat": 4.3},

    # Sauces / Misc
    "salt": {"calories": 0,   "protein": 0,   "carbs": 0,   "fat": 0},
    "spices": {"calories": 50,  "protein": 2.0, "carbs": 10,  "fat": 1.0},
    "soy sauce": {"calories": 53,  "protein": 8.1, "carbs": 4.9, "fat": 0.1},
    "lemon juice": {"calories": 22,  "protein": 0.4, "carbs": 7,   "fat": 0.2},
    "honey": {"calories": 304, "protein": 0.3, "carbs": 82,  "fat": 0},
    "sugar": {"calories": 387, "protein": 0,   "carbs": 100, "fat": 0},
}

def get_nutrition(name: str) -> dict:
    """Fuzzy lookup: check exact, then partial match."""
    key = name.lower().strip()
    if key in NUTRITION_DB:
        return NUTRITION_DB[key]
    # Try partial match
    for db_key, val in NUTRITION_DB.items():
        if key in db_key or db_key in key:
            return val
    # Default fallback: generic food ~100 kcal / 5g protein
    return {"calories": 100, "protein": 5, "carbs": 15, "fat": 2}
