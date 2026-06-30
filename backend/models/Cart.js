import mongoose from 'mongoose';

const CartSchema = new mongoose.Schema(
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
    quantity: {
      type: Number,
      required: true,
      min: [1, 'Quantity must be at least 1'],
      default: 1,
    },
    totalPrice: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index so that a user cannot have duplicate product rows in cart
CartSchema.index({ user: 1, product: 1 }, { unique: true });

const Cart = mongoose.model('Cart', CartSchema);
export default Cart;
