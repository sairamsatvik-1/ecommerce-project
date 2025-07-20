const express = require('express');
const router = express.Router();
const Review = require('../public/reviewsch');
const Product = require('../public/product');

router.post('/submitreview', async (req, res) => {
  const { productId, rating } = req.body;
  const userId = req.session.user?.id;
console.log(userId);
  if (!userId) return res.status(401).json({ message: 'Login required' });

  try {
    const review = await Review.findOneAndUpdate(
      { productId, userId },
      { rating },
      { upsert: true, new: true }
    );
    res.json({ success: true, review });
  } catch (err) {
    res.status(500).json({ message: 'Error saving review' });
  }
});

router.get('/:productId', async (req, res) => {
  const productId = req.params.productId;
  const userId = req.session.user?.id;

  try {
    const allReviews = await Review.find({ productId });
    const total = allReviews.reduce((sum, r) => sum + r.rating, 0);
    const avgRating = allReviews.length ? (total / allReviews.length).toFixed(1) : 0;

    const userReview = await Review.findOne({ productId, userId });

    res.json({
      average: avgRating,
      count: allReviews.length,
      userRating: userReview ? userReview.rating : 0
    });
  } catch {
    res.status(500).json({ message: 'Error fetching reviews' });
  }
});

module.exports = router;
