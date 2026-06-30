import mongoose from 'mongoose';

const WishlistSchema = new mongoose.Schema(
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
  },
  {
    timestamps: true,
  }
);

WishlistSchema.index({ user: 1, product: 1 }, { unique: true });

const Wishlist = mongoose.model('Wishlist', WishlistSchema);
export default Wishlist;
