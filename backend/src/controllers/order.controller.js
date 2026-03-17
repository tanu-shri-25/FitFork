const Order = require('../models/Order');
const Meal = require('../models/Meal');

// @route POST /api/orders
exports.placeOrder = async (req, res) => {
  try {
    const { mealId, quantity, deliveryAddress, notes } = req.body;
    const meal = await Meal.findById(mealId);
    if (!meal || meal.status !== 'approved')
      return res.status(400).json({ message: 'Meal not available' });

    const order = await Order.create({
      userId: req.user._id,
      chefId: meal.chefId,
      mealId,
      quantity: quantity || 1,
      totalPrice: meal.price * (quantity || 1),
      deliveryAddress,
      notes,
      statusHistory: [{ status: 'placed' }],
    });
    const populated = await Order.findById(order._id)
      .populate('mealId', 'name image price')
      .populate('chefId', 'name location');
    res.status(201).json(populated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @route GET /api/orders/my
exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user._id })
      .populate('mealId', 'name image price dietCategory')
      .populate('chefId', 'name location')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @route GET /api/orders/:id
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('mealId', 'name image price nutrition ingredients')
      .populate('chefId', 'name location')
      .populate('userId', 'name email');
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
