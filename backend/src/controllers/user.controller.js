const User = require('../models/User');

// @route GET /api/users/me
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @route PUT /api/users/me
exports.updateProfile = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name: req.body.name },
      { new: true }
    ).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @route GET /api/users/health-profile
exports.getHealthProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('healthProfile');
    res.json(user.healthProfile || {});
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @route PUT /api/users/health-profile
exports.updateHealthProfile = async (req, res) => {
  try {
    const { age, heightCm, weightKg, goal } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { healthProfile: { age, heightCm, weightKg, goal } },
      { new: true }
    ).select('healthProfile');
    res.json(user.healthProfile);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @route GET /api/users/all (admin)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ role: 'user' }).select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
