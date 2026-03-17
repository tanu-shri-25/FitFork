const Chef = require('../models/Chef');
const User = require('../models/User');
const Meal = require('../models/Meal');
const Order = require('../models/Order');

// @route GET /api/admin/chefs/pending
exports.getPendingChefs = async (req, res) => {
  try {
    const chefs = await Chef.find({ verificationStatus: 'pending' }).select('-password').sort({ createdAt: -1 });
    res.json(chefs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @route PATCH /api/admin/chefs/:id/status
exports.updateChefStatus = async (req, res) => {
  try {
    const { status } = req.body; // 'approved' or 'rejected'
    const chef = await Chef.findByIdAndUpdate(
      req.params.id,
      { verificationStatus: status },
      { new: true }
    ).select('-password');
    if (!chef) return res.status(404).json({ message: 'Chef not found' });
    res.json(chef);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @route GET /api/admin/chefs
exports.getAllChefs = async (req, res) => {
  try {
    const chefs = await Chef.find().select('-password').sort({ createdAt: -1 });
    res.json(chefs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @route GET /api/admin/orders
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('userId', 'name email')
      .populate('chefId', 'name')
      .populate('mealId', 'name price')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @route GET /api/admin/analytics
exports.getAnalytics = async (req, res) => {
  try {
    const [totalUsers, totalChefs, totalMeals, totalOrders, pendingChefs, approvedMeals] =
      await Promise.all([
        User.countDocuments({ role: 'user' }),
        Chef.countDocuments(),
        Meal.countDocuments(),
        Order.countDocuments(),
        Chef.countDocuments({ verificationStatus: 'pending' }),
        Meal.countDocuments({ status: 'approved' }),
      ]);

    const recentOrders = await Order.find()
      .populate('userId', 'name')
      .populate('mealId', 'name price')
      .sort({ createdAt: -1 })
      .limit(5);

    // Revenue calculation
    const revenueAgg = await Order.aggregate([
      { $match: { status: { $ne: 'cancelled' } } },
      { $group: { _id: null, total: { $sum: '$totalPrice' } } },
    ]);
    const totalRevenue = revenueAgg[0]?.total || 0;

    res.json({
      totalUsers,
      totalChefs,
      totalMeals,
      totalOrders,
      pendingChefs,
      approvedMeals,
      totalRevenue,
      recentOrders,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
