const Review = require('../models/Review');
const Chef = require('../models/Chef');

// @route POST /api/reviews
exports.createReview = async (req, res) => {
  try {
    const { chefId, orderId, rating, comment } = req.body;
    const review = await Review.create({
      userId: req.user._id,
      chefId,
      orderId,
      rating,
      comment,
    });

    // Update chef average rating
    const reviews = await Review.find({ chefId });
    const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
    await Chef.findByIdAndUpdate(chefId, { rating: avgRating.toFixed(1), totalReviews: reviews.length });

    res.status(201).json(review);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @route GET /api/reviews/chef/:chefId
exports.getChefReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ chefId: req.params.chefId })
      .populate('userId', 'name')
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
