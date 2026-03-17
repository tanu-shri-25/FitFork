const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth.middleware');
const {
  getProfile,
  updateProfile,
  getHealthProfile,
  updateHealthProfile,
  getAllUsers,
} = require('../controllers/user.controller');

router.use(protect);

router.get('/me', getProfile);
router.put('/me', updateProfile);
router.get('/health-profile', getHealthProfile);
router.put('/health-profile', updateHealthProfile);
router.get('/all', authorize('admin'), getAllUsers);

module.exports = router;
