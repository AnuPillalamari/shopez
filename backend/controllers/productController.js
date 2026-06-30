import Product from '../models/Product.js';
import uploadImage from '../utils/uploader.js';

// @desc    Get products with filters, sorting & pagination
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;

    const query = {};

    // 1. Keyword search (case-insensitive regex)
    if (req.query.keyword) {
      query.$or = [
        { name: { $regex: req.query.keyword, $options: 'i' } },
        { brand: { $regex: req.query.keyword, $options: 'i' } },
        { description: { $regex: req.query.keyword, $options: 'i' } },
      ];
    }

    // 2. Category filtering
    if (req.query.category) {
      query.category = req.query.category;
    }

    // 3. Brand filtering
    if (req.query.brand) {
      query.brand = req.query.brand;
    }

    // 4. Price range filtering
    if (req.query.minPrice || req.query.maxPrice) {
      query.price = {};
      if (req.query.minPrice) {
        query.price.$gte = Number(req.query.minPrice);
      }
      if (req.query.maxPrice) {
        query.price.$lte = Number(req.query.maxPrice);
      }
    }

    // 5. Rating filtering
    if (req.query.minRating) {
      query.ratings = { $gte: Number(req.query.minRating) };
    }

    // 6. Sorting
    let sort = {};
    const sortBy = req.query.sortBy || 'newest';
    if (sortBy === 'newest') {
      sort = { createdAt: -1 };
    } else if (sortBy === 'price-asc') {
      sort = { price: 1 };
    } else if (sortBy === 'price-desc') {
      sort = { price: -1 };
    } else if (sortBy === 'rating') {
      sort = { ratings: -1 };
    } else if (sortBy === 'popular') {
      sort = { reviewsCount: -1 };
    }

    const count = await Product.countDocuments(query);
    const products = await Product.find(query)
      .populate('category', 'name')
      .sort(sort)
      .skip(skip)
      .limit(limit);

    res.json({
      products,
      page,
      pages: Math.ceil(count / limit),
      total: count,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get product by ID
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id).populate('category', 'name');
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = async (req, res, next) => {
  const {
    name,
    description,
    price,
    discountPrice,
    category,
    brand,
    stock,
    featured,
  } = req.body;

  try {
    const images = [];
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const url = await uploadImage(file);
        images.push(url);
      }
    }

    const product = await Product.create({
      name,
      description,
      price: Number(price),
      discountPrice: discountPrice ? Number(discountPrice) : 0,
      category,
      brand,
      stock: Number(stock),
      featured: featured === 'true' || featured === true,
      images,
    });

    res.status(201).json(product);
  } catch (error) {
    next(error);
  }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = async (req, res, next) => {
  const {
    name,
    description,
    price,
    discountPrice,
    category,
    brand,
    stock,
    featured,
  } = req.body;

  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      product.name = name || product.name;
      product.description = description || product.description;
      product.price = price !== undefined ? Number(price) : product.price;
      product.discountPrice = discountPrice !== undefined ? Number(discountPrice) : product.discountPrice;
      product.category = category || product.category;
      product.brand = brand || product.brand;
      product.stock = stock !== undefined ? Number(stock) : product.stock;
      product.featured = featured !== undefined ? (featured === 'true' || featured === true) : product.featured;

      // Handle new files
      if (req.files && req.files.length > 0) {
        const images = [];
        for (const file of req.files) {
          const url = await uploadImage(file);
          images.push(url);
        }
        product.images = images;
      } else if (req.body.images) {
        product.images = Array.isArray(req.body.images) ? req.body.images : [req.body.images];
      }

      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      await Product.deleteOne({ _id: req.params.id });
      res.json({ message: 'Product removed' });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get featured products
// @route   GET /api/products/featured
// @access  Public
const getFeaturedProducts = async (req, res, next) => {
  try {
    const products = await Product.find({ featured: true })
      .populate('category', 'name')
      .limit(8);
    res.json(products);
  } catch (error) {
    next(error);
  }
};

// @desc    Get new arrivals
// @route   GET /api/products/new-arrivals
// @access  Public
const getNewArrivals = async (req, res, next) => {
  try {
    const products = await Product.find({})
      .populate('category', 'name')
      .sort({ createdAt: -1 })
      .limit(8);
    res.json(products);
  } catch (error) {
    next(error);
  }
};

// @desc    Get best sellers
// @route   GET /api/products/best-sellers
// @access  Public
const getBestSellers = async (req, res, next) => {
  try {
    const products = await Product.find({})
      .populate('category', 'name')
      .sort({ reviewsCount: -1, ratings: -1 })
      .limit(8);
    res.json(products);
  } catch (error) {
    next(error);
  }
};

export {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getFeaturedProducts,
  getNewArrivals,
  getBestSellers,
};
