import User from '../models/User.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';

// @desc    Get Admin Dashboard Stats Cards
// @route   GET /api/admin/stats
// @access  Private/Admin
const getDashboardStats = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments({});
    const totalProducts = await Product.countDocuments({});
    const totalOrders = await Order.countDocuments({});

    // Calculate total revenue from non-cancelled orders
    const revenueStats = await Order.aggregate([
      { $match: { orderStatus: { $ne: 'Cancelled' } } },
      { $group: { _id: null, totalRevenue: { $sum: '$totalAmount' } } },
    ]);
    const totalRevenue = revenueStats.length > 0 ? revenueStats[0].totalRevenue : 0;

    // Get recent 5 orders
    const latestOrders = await Order.find({})
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .limit(5);

    // Get recent 5 users
    const recentUsers = await User.find({})
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      totalUsers,
      totalProducts,
      totalOrders,
      totalRevenue,
      latestOrders,
      recentUsers,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get Admin Dashboard Charts & Analytics
// @route   GET /api/admin/analytics
// @access  Private/Admin
const getDashboardAnalytics = async (req, res, next) => {
  try {
    // 1. Monthly Revenue & Orders (Last 6 Months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
    sixMonthsAgo.setDate(1);
    sixMonthsAgo.setHours(0, 0, 0, 0);

    const monthlySales = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: sixMonthsAgo },
          orderStatus: { $ne: 'Cancelled' },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
          },
          revenue: { $sum: '$totalAmount' },
          count: { $sum: 1 },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
    ]);

    // 2. Products Per Category (Category Share)
    const categoryStats = await Product.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
        },
      },
    ]);
    // Populate category names manually to keep aggregate pipeline simple
    const categoriesShare = await Promise.all(
      categoryStats.map(async (stat) => {
        const ProductModel = Product.db.model('Category');
        const cat = await ProductModel.findById(stat._id);
        return {
          categoryName: cat ? cat.name : 'Unknown',
          count: stat.count,
        };
      })
    );

    // 3. Top Selling Products (by reviews count / sales quantity in orders)
    const topSellersAgg = await Order.aggregate([
      { $match: { orderStatus: { $ne: 'Cancelled' } } },
      { $unwind: '$products' },
      {
        $group: {
          _id: '$products.product',
          totalQuantity: { $sum: '$products.quantity' },
        },
      },
      { $sort: { totalQuantity: -1 } },
      { $limit: 5 },
    ]);

    const topSellingProducts = await Promise.all(
      topSellersAgg.map(async (item) => {
        const prod = await Product.findById(item._id).select('name price brand images');
        return {
          product: prod,
          totalQuantity: item.totalQuantity,
        };
      })
    );

    // 4. Low stock products (stock < 10)
    const lowStockProducts = await Product.find({ stock: { $lt: 10 } })
      .populate('category', 'name')
      .select('name stock price brand');

    res.json({
      monthlySales,
      categoriesShare,
      topSellingProducts: topSellingProducts.filter(item => item.product !== null),
      lowStockProducts,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find({}).sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: 'You cannot delete yourself' });
    }

    await User.deleteOne({ _id: req.params.id });
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc    Change user role
// @route   PUT /api/admin/users/:id/role
// @access  Private/Admin
const updateUserRole = async (req, res, next) => {
  const { role } = req.body;

  if (!['user', 'admin'].includes(role)) {
    return res.status(400).json({ message: 'Invalid role type' });
  }

  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: 'You cannot change your own role' });
    }

    user.role = role;
    await user.save();

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all orders
// @route   GET /api/admin/orders
// @access  Private/Admin
const getAllOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({})
      .populate('user', 'name email')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    next(error);
  }
};

// @desc    Update order status
// @route   PUT /api/admin/orders/:id/status
// @access  Private/Admin
const updateOrderStatus = async (req, res, next) => {
  const { orderStatus } = req.body;

  if (!['Processing', 'Shipped', 'Delivered', 'Cancelled'].includes(orderStatus)) {
    return res.status(400).json({ message: 'Invalid order status' });
  }

  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // If order was cancelled, restore product stock
    if (orderStatus === 'Cancelled' && order.orderStatus !== 'Cancelled') {
      for (const item of order.products) {
        await Product.findByIdAndUpdate(item.product, {
          $inc: { stock: item.quantity },
        });
      }
      order.paymentStatus = 'Failed';
    } else if (orderStatus === 'Delivered') {
      order.paymentStatus = 'Completed';
    }

    order.orderStatus = orderStatus;
    const updatedOrder = await order.save();

    res.json(updatedOrder);
  } catch (error) {
    next(error);
  }
};

export {
  getDashboardStats,
  getDashboardAnalytics,
  getAllUsers,
  deleteUser,
  updateUserRole,
  getAllOrders,
  updateOrderStatus,
};
