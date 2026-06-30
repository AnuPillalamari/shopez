import mongoose from 'mongoose';
import Product from './Product.js';

const ReviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    rating: {
      type: Number,
      required: [true, 'Please add a rating between 1 and 5'],
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      required: [true, 'Please add a comment'],
    },
  },
  {
    timestamps: true,
  }
);

// Prevent user from submitting more than one review per product
ReviewSchema.index({ user: 1, product: 1 }, { unique: true });

// Static method to get avg rating and save
ReviewSchema.statics.getAverageRating = async function (productId) {
  const obj = await this.aggregate([
    {
      $match: { product: productId },
    },
    {
      $group: {
        _id: '$product',
        averageRating: { $avg: '$rating' },
        reviewsCount: { $sum: 1 },
      },
    },
  ]);

  try {
    if (obj.length > 0) {
      await Product.findByIdAndUpdate(productId, {
        ratings: Math.round(obj[0].averageRating * 10) / 10,
        reviewsCount: obj[0].reviewsCount,
      });
    } else {
      await Product.findByIdAndUpdate(productId, {
        ratings: 0,
        reviewsCount: 0,
      });
    }
  } catch (err) {
    console.error(err);
  }
};

// Call getAverageRating after save
ReviewSchema.post('save', function () {
  this.constructor.getAverageRating(this.product);
});

// Call getAverageRating before remove (using post to fetch correct updated state)
ReviewSchema.post('deleteOne', { document: true, query: false }, function () {
  this.constructor.getAverageRating(this.product);
});

const Review = mongoose.model('Review', ReviewSchema);
export default Review;
