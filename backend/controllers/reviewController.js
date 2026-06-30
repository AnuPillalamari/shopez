import Review from '../models/Review.js';
import Product from '../models/Product.js';

// @desc    Create product review
// @route   POST /api/reviews
// @access  Private
const createProductReview = async (req, res, next) => {
  const { productId, rating, comment } = req.body;

  try {
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Check if user already reviewed this product
    const alreadyReviewed = await Review.findOne({
      user: req.user._id,
      product: productId,
    });

    if (alreadyReviewed) {
      return res.status(400).json({ message: 'Product already reviewed' });
    }

    const review = await Review.create({
      user: req.user._id,
      product: productId,
      rating: Number(rating),
      comment,
    });

    res.status(201).json(review);
  } catch (error) {
    next(error);
  }
};

// @desc    Update product review
// @route   PUT /api/reviews/:id
// @access  Private
const updateProductReview = async (req, res, next) => {
  const { rating, comment } = req.body;

  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    // Ensure the review belongs to the user
    if (review.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to edit this review' });
    }

    review.rating = Number(rating) || review.rating;
    review.comment = comment || review.comment;

    await review.save(); // Save triggers post-save rating recalculation hook

    res.json(review);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete product review
// @route   DELETE /api/reviews/:id
// @access  Private
const deleteProductReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    // Ensure review owner or admin
    if (review.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this review' });
    }

    await review.deleteOne(); // Triggers post-deleteOne rating hook
    res.json({ message: 'Review deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc    Get reviews for a product
// @route   GET /api/reviews/product/:productId
// @access  Public
const getProductReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({ product: req.params.productId })
      .populate('user', 'name profileImage')
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    next(error);
  }
};

export {
  createProductReview,
  updateProductReview,
  deleteProductReview,
  getProductReviews,
};
