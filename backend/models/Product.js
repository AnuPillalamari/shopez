import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a product name'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please add a product description'],
    },
    price: {
      type: Number,
      required: [true, 'Please add a product price'],
      min: [0, 'Price must be positive'],
    },
    discountPrice: {
      type: Number,
      default: 0,
      validate: {
        validator: function (value) {
          // discountPrice must be less than price
          return value < this.price;
        },
        message: 'Discount price must be less than regular price',
      },
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Please associate a category'],
    },
    brand: {
      type: String,
      required: [true, 'Please add a product brand'],
    },
    stock: {
      type: Number,
      required: [true, 'Please add stock quantity'],
      min: [0, 'Stock cannot be negative'],
      default: 0,
    },
    images: {
      type: [String],
      default: [],
    },
    ratings: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    reviewsCount: {
      type: Number,
      default: 0,
    },
    featured: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for searching and filtering performance
ProductSchema.index({ name: 'text', brand: 'text', description: 'text' });
ProductSchema.index({ price: 1 });
ProductSchema.index({ category: 1 });

const Product = mongoose.model('Product', ProductSchema);
export default Product;
