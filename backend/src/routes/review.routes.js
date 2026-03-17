const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth.middleware');
const { createReview, getChefReviews } = require('../controllers/review.controller');

router.post('/', protect, authorize('user'), createReview);
router.get('/chef/:chefId', getChefReviews);

module.exports = router;
