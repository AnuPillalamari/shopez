import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';

import User from '../models/User.js';
import Category from '../models/Category.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';
import Review from '../models/Review.js';
import Cart from '../models/Cart.js';
import Wishlist from '../models/Wishlist.js';

dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const CATEGORIES_DATA = [
  { name: 'Electronics', image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=500&auto=format&fit=crop&q=60', description: 'Gadgets, laptops, and smart wearables.' },
  { name: 'Mobiles', image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&auto=format&fit=crop&q=60', description: 'Latest smartphones and 5G mobiles.' },
  { name: 'Men\'s Clothing', image: 'https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?w=500&auto=format&fit=crop&q=60', description: 'Shirts, t-shirts, kurtas, and more.' },
  { name: 'Women\'s Clothing', image: 'https://images.unsplash.com/photo-1610030469983-98e550d61dc9?w=500&auto=format&fit=crop&q=60', description: 'Sarees, kurtis, dresses, and ethnic wear.' },
  { name: 'Footwear', image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500&auto=format&fit=crop&q=60', description: 'Sneakers, formal shoes, and sandals.' },
  { name: 'Grocery', image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=500&auto=format&fit=crop&q=60', description: 'Daily essentials, spices, rice, and snacks.' },
  { name: 'Kitchen Appliances', image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=500&auto=format&fit=crop&q=60', description: 'Mixer grinders, gas stoves, and cookers.' },
  { name: 'Home Decor', image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=500&auto=format&fit=crop&q=60', description: 'Bedsheets, curtains, and wall art.' },
  { name: 'Beauty Products', image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=500&auto=format&fit=crop&q=60', description: 'Skincare, makeup, and grooming essentials.' },
  { name: 'Books', image: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=500&auto=format&fit=crop&q=60', description: 'Novels, biographies, and textbooks.' },
  { name: 'Sports Equipment', image: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=500&auto=format&fit=crop&q=60', description: 'Cricket bats, badminton rackets, and fitness gear.' }
];

const BRANDS = ['Samsung', 'Boat', 'Titan', 'Allen Solly', 'Peter England', 'Biba', 'W', 'FabIndia', 'Fastrack', 'Noise', 'Mi', 'Sony', 'Pigeon', 'Prestige', 'Himalaya', 'Lakme', 'Nivea', 'Apple', 'Dell', 'HP', 'Puma', 'Nike', 'Adidas', 'Bata', 'Aashirvaad', 'Tata Sampann'];

const ADJECTIVES = ['Premium', 'Classic', 'Stylish', 'Traditional', 'Authentic', 'Pure', 'Smart', 'Wireless', 'Elite', 'Comfort', 'Super', 'Elegant', 'Modern'];

const NOUNS = {
  'Electronics': ['Earbuds', 'Smart Watch', 'Laptop', 'Tablet', 'Power Bank', 'Headphones', 'Speaker'],
  'Mobiles': ['Smartphone', '5G Mobile'],
  'Men\'s Clothing': ['Shirt', 'T-Shirt', 'Kurta', 'Jeans', 'Trousers', 'Jacket'],
  'Women\'s Clothing': ['Saree', 'Kurti', 'Lehenga', 'Top', 'Dress', 'Salwar Suit'],
  'Footwear': ['Sneakers', 'Sandals', 'Shoes', 'Heels', 'Slippers', 'Loafers'],
  'Grocery': ['Basmati Rice', 'Dal', 'Tea', 'Coffee', 'Spices', 'Atta', 'Ghee'],
  'Kitchen Appliances': ['Mixer Grinder', 'Gas Stove', 'Rice Cooker', 'Air Fryer', 'Induction Cooktop', 'Blender'],
  'Home Decor': ['Curtains', 'Bedsheet', 'Wall Art', 'Vase', 'Cushion Covers', 'Lamp'],
  'Beauty Products': ['Face Wash', 'Moisturizer', 'Shampoo', 'Kajal', 'Lipstick', 'Perfume'],
  'Books': ['Novel', 'Biography', 'Textbook', 'Notebook'],
  'Sports Equipment': ['Cricket Bat', 'Badminton Racket', 'Yoga Mat', 'Dumbbells', 'Football', 'Tennis Racket']
};

const IMAGE_POOLS = {
  'Electronics': [
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=60',
  ],
  'Mobiles': [
    'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1598327105666-5b89351cb315?w=500&auto=format&fit=crop&q=60',
  ],
  'Men\'s Clothing': [
    'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=500&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1602810318383-e386cc2a3ce3?w=500&auto=format&fit=crop&q=60',
  ],
  'Women\'s Clothing': [
    'https://images.unsplash.com/photo-1610030469983-98e550d61dc9?w=500&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1583391733958-65e298dde191?w=500&auto=format&fit=crop&q=60',
  ]
};

const getSampleImage = (catName) => {
  const pool = IMAGE_POOLS[catName];
  if (pool && pool.length > 0) {
    return pool[Math.floor(Math.random() * pool.length)];
  }
  const placeholderIds = [
    'photo-1526170375885-4d8ecf77b99f',
    'photo-1527689368864-3a821dbccc34',
    'photo-1560343090-f0409e92791a',
    'photo-1572635196237-14b3f281503f',
    'photo-1542291026-7eec264c27ff',
    'photo-1505740420928-5e560c06d30e',
    'photo-1523275335684-37898b6baf30',
  ];
  const randId = placeholderIds[Math.floor(Math.random() * placeholderIds.length)];
  return `https://images.unsplash.com/` + randId + `?w=500&auto=format&fit=crop&q=60`;
};

const INDIAN_USERS = [
  { name: 'Amit Kumar', city: 'Delhi', state: 'Delhi', zip: '110001' },
  { name: 'Priya Reddy', city: 'Hyderabad', state: 'Telangana', zip: '500001' },
  { name: 'Rahul Sharma', city: 'Mumbai', state: 'Maharashtra', zip: '400001' },
  { name: 'Sneha Patel', city: 'Ahmedabad', state: 'Gujarat', zip: '380001' },
  { name: 'Karthik Iyer', city: 'Chennai', state: 'Tamil Nadu', zip: '600001' },
  { name: 'Neha Gupta', city: 'Bengaluru', state: 'Karnataka', zip: '560001' },
  { name: 'Vikram Singh', city: 'Pune', state: 'Maharashtra', zip: '411001' },
  { name: 'Pooja Desai', city: 'Visakhapatnam', state: 'Andhra Pradesh', zip: '530001' },
  { name: 'Rohit Verma', city: 'Vijayawada', state: 'Andhra Pradesh', zip: '520001' }
];

const generateIndianPhone = () => {
  return `+91 98${Math.floor(10000000 + Math.random() * 90000000)}`;
};

const destroyData = async () => {
  try {
    await User.deleteMany({});
    await Category.deleteMany({});
    await Product.deleteMany({});
    await Order.deleteMany({});
    await Review.deleteMany({});
    await Cart.deleteMany({});
    await Wishlist.deleteMany({});
    console.log('Database collections cleared!');
  } catch (error) {
    console.error('Error clearing database:', error.message);
    process.exit(1);
  }
};

const seedData = async () => {
  try {
    await destroyData();

    // 1. Create Users
    console.log('Seeding users...');
    const users = [];

    // Create 1 Admin
    const adminUser = await User.create({
      name: 'ShopEZ Admin',
      email: 'admin@shopez.com',
      password: 'admin123',
      phone: '+91 9876543210',
      address: {
        street: 'ShopEZ Tower, Hitech City',
        city: 'Hyderabad',
        state: 'Telangana',
        zip: '500081',
        country: 'India'
      },
      profileImage: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=60',
      role: 'admin'
    });
    users.push(adminUser);

    // Create 9 Regular Users (Indian)
    for (let i = 0; i < INDIAN_USERS.length; i++) {
      const u = INDIAN_USERS[i];
      const user = await User.create({
        name: u.name,
        email: `user${i+1}@shopez.com`,
        password: 'user123',
        phone: generateIndianPhone(),
        address: {
          street: `${(i + 1) * 12} Main Road, Block ${String.fromCharCode(65 + i)}`,
          city: u.city,
          state: u.state,
          zip: u.zip,
          country: 'India'
        },
        profileImage: `https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=60`,
        role: 'user'
      });
      users.push(user);
    }
    console.log(`${users.length} Users seeded.`);

    // 2. Create Categories
    console.log('Seeding categories...');
    const categories = [];
    for (const cat of CATEGORIES_DATA) {
      const category = await Category.create({
        name: cat.name,
        image: cat.image,
        description: cat.description
      });
      categories.push(category);
    }
    console.log(`${categories.length} Categories seeded.`);

    // 3. Create 100 Products
    console.log('Seeding products...');
    const products = [];

    for (let i = 1; i <= 100; i++) {
      const randomCategory = categories[Math.floor(Math.random() * categories.length)];
      const categoryName = randomCategory.name;

      const brand = BRANDS[Math.floor(Math.random() * BRANDS.length)];
      const adj = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
      const nounsList = NOUNS[categoryName] || ['Item'];
      const noun = nounsList[Math.floor(Math.random() * nounsList.length)];
      const productName = `${brand} ${adj} ${noun}`;

      // Realistic INR Pricing
      const basePrice = Math.floor(Math.random() * 4900) + 100; // 100 to 5000
      let price = basePrice;
      if (categoryName === 'Electronics' || categoryName === 'Mobiles') {
        price = Math.floor(Math.random() * 45000) + 5000; // 5000 to 50000
      }
      
      let discountPrice = 0;
      if (Math.random() > 0.4) {
        discountPrice = Math.floor(price * (Math.random() * 0.3 + 0.6)); // 10% to 40% off
      }

      const stock = Math.floor(Math.random() * 50) + 1;
      
      const description = `This is a highly durable, high-quality ${productName} manufactured by ${brand}. Perfect for everyday use in India. High quality materials ensure long lasting performance.`;

      const mainImage = getSampleImage(categoryName);
      const secondaryImage = 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=500&auto=format&fit=crop&q=60';
      
      const product = new Product({
        name: productName,
        description,
        price,
        discountPrice,
        category: randomCategory._id,
        brand,
        stock,
        images: [mainImage, secondaryImage],
        ratings: 0,
        reviewsCount: 0,
        featured: Math.random() > 0.8
      });
      await product.save();
      products.push(product);
    }
    console.log(`${products.length} Products seeded.`);

    // 4. Create Reviews
    console.log('Seeding reviews and updating ratings...');
    const comments = [
      'Amazing product! Highly recommend it.',
      'Very happy with the build quality, works perfectly.',
      'Good value for money. Delivery was fast too.',
      'Decent, but could be improved. Overall good.',
      'Absolutely love it! The best in its class.',
      'Not bad, does what it says on the box.',
      'Exceeded my expectations, super premium feel.'
    ];

    for (const product of products) {
      if (Math.random() > 0.3) {
        const numReviews = Math.floor(Math.random() * 3) + 1;
        const reviewers = [...users].filter(u => u.role === 'user').sort(() => 0.5 - Math.random()).slice(0, numReviews);

        for (const reviewer of reviewers) {
          const rating = Math.floor(Math.random() * 3) + 3;
          const comment = comments[Math.floor(Math.random() * comments.length)];

          await Review.create({
            user: reviewer._id,
            product: product._id,
            rating,
            comment
          });
        }
      }
    }
    console.log('Reviews seeded.');

    // 5. Create 50 Orders
    console.log('Seeding order history (50 orders)...');
    const orderStatuses = ['Processing', 'Shipped', 'Delivered', 'Cancelled'];
    const paymentMethods = ['COD', 'Online'];

    for (let o = 1; o <= 50; o++) {
      const customerUsers = users.filter(u => u.role === 'user');
      const randomUser = customerUsers[Math.floor(Math.random() * customerUsers.length)];

      const orderProducts = [];
      const numProducts = Math.floor(Math.random() * 3) + 1;
      const shuffledProds = [...products].sort(() => 0.5 - Math.random()).slice(0, numProducts);

      let totalAmount = 0;
      for (const prod of shuffledProds) {
        const qty = Math.floor(Math.random() * 2) + 1;
        const price = prod.discountPrice > 0 ? prod.discountPrice : prod.price;
        totalAmount += price * qty;

        orderProducts.push({
          product: prod._id,
          quantity: qty,
          price
        });
      }

      const orderStatus = orderStatuses[Math.floor(Math.random() * orderStatuses.length)];
      const paymentMethod = paymentMethods[Math.floor(Math.random() * paymentMethods.length)];
      
      let paymentStatus = 'Pending';
      if (orderStatus === 'Delivered') {
        paymentStatus = 'Completed';
      } else if (orderStatus === 'Cancelled') {
        paymentStatus = 'Failed';
      } else if (paymentMethod === 'Online' && Math.random() > 0.2) {
        paymentStatus = 'Completed';
      }

      const orderDate = new Date();
      orderDate.setMonth(orderDate.getMonth() - Math.floor(Math.random() * 5));
      orderDate.setDate(Math.floor(Math.random() * 28) + 1);

      await Order.create({
        user: randomUser._id,
        products: orderProducts,
        totalAmount,
        shippingAddress: randomUser.address,
        paymentMethod,
        paymentStatus,
        orderStatus,
        orderDate,
        createdAt: orderDate
      });
    }

    console.log('50 Orders seeded successfully.');
    console.log('Database Seeding Completed!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error.message);
    process.exit(1);
  }
};

seedData();
