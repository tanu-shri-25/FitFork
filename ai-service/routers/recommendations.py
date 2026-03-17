from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional

router = APIRouter(prefix="/recommendations", tags=["recommendations"])


class HealthProfile(BaseModel):
    age: Optional[int] = None
    heightCm: Optional[float] = None
    weightKg: Optional[float] = None


class RecommendationsPayload(BaseModel):
    goal: str
    health_profile: Optional[HealthProfile] = None


# Category to meal name suggestions (metadata only – real filtering done by backend)
GOAL_MEAL_SUGGESTIONS = {
    "Weight Loss": [
        "Oats Breakfast Bowl",
        "Grilled Chicken Salad",
        "Vegetable Soup",
        "Steamed Fish & Greens",
        "Quinoa Veggie Bowl",
    ],
    "Muscle Gain": [
        "Chicken Protein Bowl",
        "Paneer Protein Bowl",
        "Egg & Oats Power Meal",
        "Salmon Rice Bowl",
        "Lentil & Quinoa Stack",
    ],
    "Diabetic Friendly": [
        "Vegetable Stir-Fry",
        "Dal & Brown Rice",
        "Grilled Tofu Salad",
        "Methi Roti with Dal",
        "Stuffed Capsicum with Paneer",
    ],
    "Healthy Living": [
        "Rainbow Grain Bowl",
        "Spinach Smoothie Bowl",
        "Avocado & Egg Toast",
        "Greek Yogurt Parfait",
        "Chickpea Salad",
    ],
}

GOAL_TIPS = {
    "Weight Loss": "Focus on high-protein, low-calorie meals (300–500 kcal). Stay hydrated and avoid processed sugars.",
    "Muscle Gain": "Prioritise protein-dense meals (35g+ protein, 500–800 kcal). Eat within 1 hour post-workout.",
    "Diabetic Friendly": "Choose low-GI carbohydrates and fibre-rich meals. Keep calories between 250–450 kcal.",
    "Healthy Living": "Aim for balanced macros with whole foods (350–600 kcal, 18g+ protein) and plenty of vegetables.",
}


@router.post("")
def get_recommendations(payload: RecommendationsPayload):
    goal = payload.goal
    suggestions = GOAL_MEAL_SUGGESTIONS.get(goal, [])
    tip = GOAL_TIPS.get(goal, "Eat balanced, homemade meals for best results.")

    return {
        "goal": goal,
        "diet_category": goal,
        "tip": tip,
        "suggested_meal_names": suggestions,
    }
