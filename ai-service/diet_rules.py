# Diet category nutrition rules (±10% tolerance applied by the verifier)

DIET_RULES = {
    "Weight Loss": {
        "calories_min": 300,
        "calories_max": 500,
        "protein_min": 20,
    },
    "Muscle Gain": {
        "calories_min": 500,
        "calories_max": 800,
        "protein_min": 35,
    },
    "Diabetic Friendly": {
        "calories_min": 250,
        "calories_max": 450,
        "protein_min": 15,
    },
    "Healthy Living": {
        "calories_min": 350,
        "calories_max": 600,
        "protein_min": 18,
    },
}

TOLERANCE = 0.10  # 10%
