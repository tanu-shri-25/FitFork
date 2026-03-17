const Chef = require('../models/Chef');
const Meal = require('../models/Meal');
const Order = require('../models/Order');
const aiService = require('../utils/aiService');

// @route GET /api/chefs/me
exports.getProfile = async (req, res) => {
  try {
    const chef = await Chef.findById(req.user._id).select('-password');
    if (!chef) return res.status(404).json({ message: 'Chef not found' });
    res.json(chef);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @route PUT /api/chefs/me
exports.updateProfile = async (req, res) => {
  try {
    const { name, location, experience, bio } = req.body;
    const chef = await Chef.findByIdAndUpdate(
      req.user._id,
      { name, location, experience, bio },
      { new: true }
    ).select('-password');
    res.json(chef);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @route POST /api/chefs/upload-verification (idProof or kitchenPhoto)
exports.uploadVerificationFile = async (req, res) => {
  try {
    const fileUrl = `/uploads/${req.file.filename}`;
    const { fileType } = req.body; // 'idProof' or 'kitchenPhoto'
    const update =
      fileType === 'idProof'
        ? { idProof: fileUrl }
        : { $push: { kitchenPhotos: fileUrl } };
    await Chef.findByIdAndUpdate(req.user._id, update);
    res.json({ url: fileUrl });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @route POST /api/chefs/meals – upload + AI verify
exports.uploadMeal = async (req, res) => {
  try {
    const { name, description, dietCategory, ingredients, price } = req.body;
    const parsedIngredients = typeof ingredients === 'string' ? JSON.parse(ingredients) : ingredients;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : '';

    // Call AI service for nutrition calculation + verification
    const { nutrition, approved, message } = await aiService.verifyMeal(
      parsedIngredients,
      dietCategory
    );

    const meal = await Meal.create({
      name,
      description,
      dietCategory,
      chefId: req.user._id,
      ingredients: parsedIngredients,
      nutrition,
      image: imageUrl,
      price: price || 150,
      status: approved ? 'approved' : 'rejected',
      rejectionReason: approved ? null : message,
    });

    res.status(201).json({ meal, approved, message, nutrition });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @route GET /api/chefs/meals
exports.getMyMeals = async (req, res) => {
  try {
    const meals = await Meal.find({ chefId: req.user._id }).sort({ createdAt: -1 });
    res.json(meals);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @route GET /api/chefs/orders
exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ chefId: req.user._id })
      .populate('userId', 'name email')
      .populate('mealId', 'name image price')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @route PATCH /api/chefs/orders/:id/status
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findOneAndUpdate(
      { _id: req.params.id, chefId: req.user._id },
      {
        status,
        $push: { statusHistory: { status, timestamp: new Date() } },
      },
      { new: true }
    );
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @route GET /api/chefs/all – public list of approved chefs
exports.getAllApprovedChefs = async (req, res) => {
  try {
    const chefs = await Chef.find({ verificationStatus: 'approved' }).select('-password');
    res.json(chefs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
