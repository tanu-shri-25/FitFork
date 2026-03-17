const axios = require('axios');

const AI_URL = process.env.AI_SERVICE_URL || 'http://localhost:8000';

/**
 * Call the AI service to calculate nutrition and verify a meal
 * @param {Array} ingredients  [{name, quantity_g}]
 * @param {string} dietCategory
 * @returns {Promise<{nutrition, approved, message}>}
 */
exports.verifyMeal = async (ingredients, dietCategory) => {
  try {
    // Step 1: calculate nutrition
    const calcRes = await axios.post(`${AI_URL}/nutrition/calculate`, { ingredients });
    const nutrition = calcRes.data;

    // Step 2: verify against diet rules
    const verifyRes = await axios.post(`${AI_URL}/nutrition/verify`, {
      nutrition,
      diet_category: dietCategory,
    });
    const { approved, message } = verifyRes.data;

    return { nutrition, approved, message };
  } catch (err) {
    console.error('AI service error:', err.message);
    // If AI service is unavailable, store as pending for manual review
    return {
      nutrition: { calories: 0, protein: 0, carbs: 0, fat: 0 },
      approved: false,
      message: 'AI service unavailable – pending manual review',
    };
  }
};
