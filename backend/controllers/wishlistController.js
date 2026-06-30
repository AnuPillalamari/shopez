import Wishlist from '../models/Wishlist.js';

// @desc    Get user wishlist
// @route   GET /api/wishlist
// @access  Private
const getWishlist = async (req, res, next) => {
  try {
    const wishlistItems = await Wishlist.find({ user: req.user._id })
      .populate('product', 'name price discountPrice images stock brand ratings reviewsCount');
    res.json(wishlistItems);
  } catch (error) {
    next(error);
  }
};

// @desc    Add product to wishlist
// @route   POST /api/wishlist
// @access  Private
const addToWishlist = async (req, res, next) => {
  const { productId } = req.body;

  try {
    const itemExists = await Wishlist.findOne({ user: req.user._id, product: productId });
    if (itemExists) {
      return res.status(400).json({ message: 'Product already in wishlist' });
    }

    const wishlistItem = await Wishlist.create({
      user: req.user._id,
      product: productId,
    });

    const populatedItem = await Wishlist.findById(wishlistItem._id).populate('product');
    res.status(201).json(populatedItem);
  } catch (error) {
    next(error);
  }
};

// @desc    Remove product from wishlist
// @route   DELETE /api/wishlist/:productId
// @access  Private
const removeFromWishlist = async (req, res, next) => {
  try {
    const wishlistItem = await Wishlist.findOne({
      user: req.user._id,
      product: req.params.productId,
    });

    if (!wishlistItem) {
      return res.status(404).json({ message: 'Product not found in wishlist' });
    }

    await Wishlist.deleteOne({ _id: wishlistItem._id });
    res.json({ message: 'Product removed from wishlist' });
  } catch (error) {
    next(error);
  }
};

export { getWishlist, addToWishlist, removeFromWishlist };
