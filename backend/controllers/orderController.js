import Order from '../models/Order.js';
import Product from '../models/Product.js';
import Cart from '../models/Cart.js';

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const createOrder = async (req, res, next) => {
  const { products, shippingAddress, paymentMethod, paymentStatus } = req.body;

  if (!products || products.length === 0) {
    return res.status(400).json({ message: 'No ordered products' });
  }

  try {
    const orderItems = [];
    let totalAmount = 0;

    // Verify stock and calculate prices
    for (const item of products) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(404).json({ message: `Product not found: ${item.product}` });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          message: `Insufficient stock for product ${product.name}. Available: ${product.stock}, Requested: ${item.quantity}`,
        });
      }

      const itemPrice = product.discountPrice && product.discountPrice > 0 
        ? product.discountPrice 
        : product.price;

      totalAmount += itemPrice * item.quantity;
      
      orderItems.push({
        product: product._id,
        quantity: item.quantity,
        price: itemPrice,
      });
    }

    // Create order
    const order = await Order.create({
      user: req.user._id,
      products: orderItems,
      totalAmount,
      shippingAddress,
      paymentMethod,
      paymentStatus: paymentMethod === 'COD' ? 'Pending' : (paymentStatus || 'Completed'),
      orderStatus: 'Processing',
    });

    // Update product stocks
    for (const item of products) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: -item.quantity },
      });
    }

    // Clear user's cart
    await Cart.deleteMany({ user: req.user._id });

    res.status(201).json(order);
  } catch (error) {
    next(error);
  }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate('products.product', 'name images')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    next(error);
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'name email')
      .populate('products.product', 'name images price brand');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Allow access only to order owner or admin
    if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to view this order' });
    }

    res.json(order);
  } catch (error) {
    next(error);
  }
};

export { createOrder, getMyOrders, getOrderById };
