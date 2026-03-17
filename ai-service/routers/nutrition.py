from fastapi import APIRouter
from pydantic import BaseModel
from typing import List
from nutrition_db import get_nutrition
from diet_rules import DIET_RULES, TOLERANCE

router = APIRouter(prefix="/nutrition", tags=["nutrition"])


class Ingredient(BaseModel):
    name: str
    quantity_g: float


class IngredientsPayload(BaseModel):
    ingredients: List[Ingredient]


class NutritionData(BaseModel):
    calories: float
    protein: float
    carbs: float
    fat: float


class VerifyPayload(BaseModel):
    nutrition: NutritionData
    diet_category: str


def round2(val: float) -> float:
    return round(val, 2)


@router.post("/calculate")
def calculate_nutrition(payload: IngredientsPayload):
    """Calculate total nutrition from ingredient list."""
    totals = {"calories": 0.0, "protein": 0.0, "carbs": 0.0, "fat": 0.0}
    breakdown = []

    for ing in payload.ingredients:
        per100 = get_nutrition(ing.name)
        factor = ing.quantity_g / 100.0
        item = {
            "name": ing.name,
            "quantity_g": ing.quantity_g,
            "calories": round2(per100["calories"] * factor),
            "protein": round2(per100["protein"] * factor),
            "carbs": round2(per100["carbs"] * factor),
            "fat": round2(per100["fat"] * factor),
        }
        breakdown.append(item)
        for key in totals:
            totals[key] += item[key]

    return {
        "calories": round2(totals["calories"]),
        "protein": round2(totals["protein"]),
        "carbs": round2(totals["carbs"]),
        "fat": round2(totals["fat"]),
        "breakdown": breakdown,
    }


@router.post("/verify")
def verify_nutrition(payload: VerifyPayload):
    """Verify if a meal meets the diet category rules (±10% tolerance)."""
    category = payload.diet_category
    rules = DIET_RULES.get(category)

    if not rules:
        return {"approved": False, "message": f"Unknown diet category: {category}"}

    n = payload.nutrition
    tol = TOLERANCE
    issues = []

    cal_min = rules["calories_min"] * (1 - tol)
    cal_max = rules["calories_max"] * (1 + tol)
    pro_min = rules["protein_min"] * (1 - tol)

    if not (cal_min <= n.calories <= cal_max):
        issues.append(
            f"Calories {n.calories:.0f} kcal out of range "
            f"({rules['calories_min']}–{rules['calories_max']} kcal ±10%)"
        )

    if n.protein < pro_min:
        issues.append(
            f"Protein {n.protein:.1f}g below minimum "
            f"({rules['protein_min']}g ±10%)"
        )

    if issues:
        return {"approved": False, "message": "; ".join(issues)}

    return {
        "approved": True,
        "message": f"Meal approved for {category} category ✓",
    }
