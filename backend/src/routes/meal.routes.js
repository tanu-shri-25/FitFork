const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
const { getAllMeals, getRecommendedMeals, getMealById } = require('../controllers/meal.controller');

router.get('/', getAllMeals);
router.get('/recommended', protect, getRecommendedMeals);
router.get('/:id', getMealById);

module.exports = router;
