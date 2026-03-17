const Meal = require('../models/Meal');
const aiService = require('../utils/aiService');

// @route GET /api/meals – all approved meals
exports.getAllMeals = async (req, res) => {
  try {
    const { category, chefId } = req.query;
    const filter = { status: 'approved', isAvailable: true };
    if (category) filter.dietCategory = category;
    if (chefId) filter.chefId = chefId;
    const meals = await Meal.find(filter)
      .populate('chefId', 'name location rating totalReviews verificationStatus')
      .sort({ createdAt: -1 });
    res.json(meals);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @route GET /api/meals/recommended
exports.getRecommendedMeals = async (req, res) => {
  try {
    const user = req.user;
    if (!user.healthProfile || !user.healthProfile.goal) {
      return res.status(400).json({ message: 'Please set your diet goal first' });
    }
    const goal = user.healthProfile.goal;
    const meals = await Meal.find({
      status: 'approved',
      isAvailable: true,
      dietCategory: goal,
    })
      .populate('chefId', 'name location rating totalReviews verificationStatus')
      .sort({ 'nutrition.protein': -1 })
      .limit(10);
    res.json({ goal, meals });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @route GET /api/meals/:id
exports.getMealById = async (req, res) => {
  try {
    const meal = await Meal.findById(req.params.id).populate(
      'chefId',
      'name location rating totalReviews bio'
    );
    if (!meal) return res.status(404).json({ message: 'Meal not found' });
    res.json(meal);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
