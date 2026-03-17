const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth.middleware');
const {
  getPendingChefs,
  updateChefStatus,
  getAllChefs,
  getAllOrders,
  getAnalytics,
} = require('../controllers/admin.controller');

router.use(protect, authorize('admin'));

router.get('/chefs/pending', getPendingChefs);
router.patch('/chefs/:id/status', updateChefStatus);
router.get('/chefs', getAllChefs);
router.get('/orders', getAllOrders);
router.get('/analytics', getAnalytics);

module.exports = router;
