const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Chef = require('../models/Chef');

const generateToken = (id, role) =>
  jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: '30d' });

// @route POST /api/auth/register
exports.register = async (req, res) => {
  try {
    const { name, email, password, role, location, experience } = req.body;
    if (!['user', 'chef', 'admin'].includes(role))
      return res.status(400).json({ message: 'Invalid role' });

    if (role === 'chef') {
      const exists = await Chef.findOne({ email });
      if (exists) return res.status(400).json({ message: 'Chef already exists' });
      const chef = await Chef.create({ name, email, password, location, experience });
      return res.status(201).json({
        _id: chef._id,
        name: chef.name,
        email: chef.email,
        role: 'chef',
        verificationStatus: chef.verificationStatus,
        token: generateToken(chef._id, 'chef'),
      });
    }

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: 'User already exists' });
    const user = await User.create({ name, email, password, role: role || 'user' });
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id, user.role),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @route POST /api/auth/login
exports.login = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (role === 'chef') {
      const chef = await Chef.findOne({ email });
      if (!chef || !(await chef.matchPassword(password)))
        return res.status(401).json({ message: 'Invalid credentials' });
      return res.json({
        _id: chef._id,
        name: chef.name,
        email: chef.email,
        role: 'chef',
        verificationStatus: chef.verificationStatus,
        token: generateToken(chef._id, 'chef'),
      });
    }

    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password)))
      return res.status(401).json({ message: 'Invalid credentials' });
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      healthProfile: user.healthProfile,
      token: generateToken(user._id, user.role),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
