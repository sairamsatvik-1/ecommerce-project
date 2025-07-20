const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'LoginInfo',
    required: true,
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  }
}, { timestamps: true });

reviewSchema.index({ productId: 1, userId: 1 }, { unique: true }); // Only one review per user per product

module.exports = mongoose.model('Review', reviewSchema);
