import Cart from '../models/Cart.js';
import Product from '../models/Product.js';

// Helper to calculate price
const getProductItemPrice = (product) => {
  return product.discountPrice && product.discountPrice > 0
    ? product.discountPrice
    : product.price;
};

// @desc    Get user cart items
// @route   GET /api/cart
// @access  Private
const getCart = async (req, res, next) => {
  try {
    const cartItems = await Cart.find({ user: req.user._id })
      .populate('product', 'name price discountPrice images stock brand');
    res.json(cartItems);
  } catch (error) {
    next(error);
  }
};

// @desc    Add item to cart
// @route   POST /api/cart
// @access  Private
const addToCart = async (req, res, next) => {
  const { productId, quantity } = req.body;
  const qty = Number(quantity) || 1;

  try {
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (product.stock < qty) {
      return res.status(400).json({ message: 'Requested quantity exceeds available stock' });
    }

    const itemPrice = getProductItemPrice(product);

    // Check if product is already in cart
    let cartItem = await Cart.findOne({ user: req.user._id, product: productId });

    if (cartItem) {
      cartItem.quantity += qty;
      
      // Verify new quantity doesn't exceed stock
      if (product.stock < cartItem.quantity) {
        return res.status(400).json({ message: `Cannot add more. Stock limit: ${product.stock}` });
      }

      cartItem.totalPrice = cartItem.quantity * itemPrice;
      await cartItem.save();
    } else {
      cartItem = await Cart.create({
        user: req.user._id,
        product: productId,
        quantity: qty,
        totalPrice: qty * itemPrice,
      });
    }

    // Return updated cart item with populated product details
    const populatedItem = await Cart.findById(cartItem._id).populate('product', 'name price discountPrice images stock brand');
    res.status(201).json(populatedItem);
  } catch (error) {
    next(error);
  }
};

// @desc    Update cart item quantity
// @route   PUT /api/cart/:id
// @access  Private
const updateCartQuantity = async (req, res, next) => {
  const { quantity } = req.body;
  const qty = Number(quantity);

  if (qty < 1) {
    return res.status(400).json({ message: 'Quantity must be at least 1' });
  }

  try {
    const cartItem = await Cart.findById(req.params.id).populate('product');
    if (!cartItem) {
      return res.status(404).json({ message: 'Cart item not found' });
    }

    if (cartItem.product.stock < qty) {
      return res.status(400).json({ message: `Only ${cartItem.product.stock} items left in stock` });
    }

    const itemPrice = getProductItemPrice(cartItem.product);

    cartItem.quantity = qty;
    cartItem.totalPrice = qty * itemPrice;
    await cartItem.save();

    res.json(cartItem);
  } catch (error) {
    next(error);
  }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/:id
// @access  Private
const removeFromCart = async (req, res, next) => {
  try {
    const cartItem = await Cart.findOne({ _id: req.params.id, user: req.user._id });
    if (!cartItem) {
      return res.status(404).json({ message: 'Cart item not found' });
    }

    await Cart.deleteOne({ _id: req.params.id });
    res.json({ message: 'Item removed from cart' });
  } catch (error) {
    next(error);
  }
};

// @desc    Clear entire cart
// @route   DELETE /api/cart
// @access  Private
const clearCart = async (req, res, next) => {
  try {
    await Cart.deleteMany({ user: req.user._id });
    res.json({ message: 'Cart cleared successfully' });
  } catch (error) {
    next(error);
  }
};

export {
  getCart,
  addToCart,
  updateCartQuantity,
  removeFromCart,
  clearCart,
};
