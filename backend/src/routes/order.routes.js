const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth.middleware');
const { placeOrder, getMyOrders, getOrderById } = require('../controllers/order.controller');

router.use(protect);
router.post('/', authorize('user'), placeOrder);
router.get('/my', getMyOrders);
router.get('/:id', getOrderById);

module.exports = router;
