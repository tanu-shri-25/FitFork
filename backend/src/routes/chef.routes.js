const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth.middleware');
const upload = require('../middleware/upload.middleware');
const {
  getProfile,
  updateProfile,
  uploadVerificationFile,
  uploadMeal,
  getMyMeals,
  getMyOrders,
  updateOrderStatus,
  getAllApprovedChefs,
} = require('../controllers/chef.controller');

// Public
router.get('/all', getAllApprovedChefs);

// Protected Chef routes
router.use(protect);
router.get('/me', getProfile);
router.put('/me', updateProfile);
router.post('/upload-verification', authorize('chef'), upload.single('file'), uploadVerificationFile);
router.post('/meals', authorize('chef'), upload.single('image'), uploadMeal);
router.get('/meals', authorize('chef'), getMyMeals);
router.get('/orders', authorize('chef'), getMyOrders);
router.patch('/orders/:id/status', authorize('chef'), updateOrderStatus);

module.exports = router;
