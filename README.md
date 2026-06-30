# ShopEZ 🛒 — Full Stack MERN E-Commerce Platform

[![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=flat-square&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Express.js](https://img.shields.io/badge/Express.js-000000?style=flat-square&logo=express&logoColor=white)](https://expressjs.com/)
[![React](https://img.shields.io/badge/React-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Bootstrap](https://img.shields.io/badge/Bootstrap_5-7952B3?style=flat-square&logo=bootstrap&logoColor=white)](https://getbootstrap.com/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev/)

A production-ready, full stack e-commerce application built with the **MERN Stack**. ShopEZ features a modern customer storefront with product browsing, cart management, checkout flows, and order tracking — along with a comprehensive Admin Dashboard for managing products, categories, users, and orders with real-time analytics.

---

## ✨ Features

### Customer Storefront
- 🔐 JWT Authentication (Register, Login, Logout, Profile)
- 🛍️ Browse 100+ Products with advanced filters & sorting
- 🔍 Full-text Search across names, brands, and descriptions
- 📂 Category Navigation with image grids
- ❤️ Wishlist Bookmarks
- 🛒 Shopping Cart with real-time price calculations
- 🎟️ Coupon Code simulator (`EZDEAL20` for 20% off)
- 💳 Checkout (Cash on Delivery + Simulated Online Payment)
- 📦 Order Tracking with multi-step status timeline
- ⭐ Product Reviews & Ratings (with avg. score recalculation)
- 👤 Profile Management with image upload
- 🌙 Light/Dark Mode Theme Toggler
- 📱 Fully Responsive Mobile Layout

### Admin Dashboard
- 📊 Analytics Dashboard (Line, Bar, Doughnut Charts via Chart.js)
- 👥 User Management (Role changes, deletion)
- 📦 Product Management (Full CRUD with image upload)
- 🏷️ Category Management (Full CRUD)
- 🧾 Order Management (Status updates, cancellations with stock restore)
- ⚠️ Low Stock Alerts
- 💰 Revenue & Orders trend charts

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React.js 18, React Router DOM v6, Vite |
| Styling | Bootstrap 5, Custom CSS (HSL color system, glassmorphism) |
| Charts | Chart.js 4, react-chartjs-2 |
| HTTP Client | Axios |
| Icons | React Icons |
| Backend | Node.js, Express.js |
| Authentication | JWT (jsonwebtoken), bcryptjs |
| Database | MongoDB, Mongoose |
| File Uploads | Multer (local), Cloudinary (optional) |
| Validation | express-validator |
| CORS | cors, cookie-parser |
| Dev Tools | Nodemon, Vite HMR |

---

## 📁 Folder Structure

```
shopez/
├── backend/
│   ├── config/          # DB connection, Cloudinary config
│   ├── controllers/     # Business logic (auth, users, products, cart, etc.)
│   ├── middleware/      # Auth guards, error handler, multer uploader
│   ├── models/          # Mongoose schemas (User, Product, Category, etc.)
│   ├── routes/          # REST API route definitions
│   ├── utils/           # Token generator, image uploader, seeder script
│   ├── uploads/         # Local image storage fallback directory
│   ├── server.js        # Express app entry point
│   └── .env             # Environment configuration
└── frontend/
    ├── public/
    ├── src/
    │   ├── assets/
    │   ├── components/  # Navbar, Footer, ProductCard, AdminSidebar
    │   ├── context/     # Auth, Cart, Wishlist, Theme, Toast contexts
    │   ├── layouts/     # StorefrontLayout, AdminLayout
    │   ├── pages/       # All route pages + admin/ subdirectory
    │   ├── styles/      # index.css design system
    │   ├── App.jsx      # Router configuration
    │   └── main.jsx     # React entry point
    ├── vite.config.js
    └── package.json
```

---

## 🚀 Installation & Setup

### Prerequisites
- Node.js v18+
- MongoDB (local or Atlas)
- Git

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/shopez.git
cd shopez
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Create your `.env` file (already pre-configured):
```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/shopez
JWT_SECRET=shopez_super_secret_jwt_key_2026
CLOUDINARY_CLOUD_NAME=        # Optional
CLOUDINARY_API_KEY=           # Optional
CLOUDINARY_API_SECRET=        # Optional
NODE_ENV=development
```

Seed the database with dummy data:
```bash
npm run seed
```

Start the backend server:
```bash
npm run dev
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install
npm run dev
```

Open your browser at: **http://localhost:5173**

---

## 🌐 API Endpoints

### Authentication
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/api/auth/register` | Register new user | Public |
| POST | `/api/auth/login` | Login user | Public |
| POST | `/api/auth/logout` | Logout | Public |
| GET | `/api/auth/me` | Get current user | Protected |

### Products
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/api/products` | Get all (filter/sort/search/page) | Public |
| GET | `/api/products/featured` | Featured products | Public |
| GET | `/api/products/new-arrivals` | Newest products | Public |
| GET | `/api/products/best-sellers` | Top rated | Public |
| GET | `/api/products/:id` | Single product | Public |
| POST | `/api/products` | Create product | Admin |
| PUT | `/api/products/:id` | Update product | Admin |
| DELETE | `/api/products/:id` | Delete product | Admin |

### Categories, Cart, Wishlist, Orders, Reviews
Full CRUD on all entities following the same pattern. See `backend/routes/` for complete definitions.

### Admin
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/admin/stats` | Dashboard stats cards |
| GET | `/api/admin/analytics` | Charts data |
| GET | `/api/admin/users` | All users |
| PUT | `/api/admin/users/:id/role` | Change user role |
| DELETE | `/api/admin/users/:id` | Delete user |
| GET | `/api/admin/orders` | All orders |
| PUT | `/api/admin/orders/:id/status` | Update order status |

---

## 🔐 Default Demo Accounts

After seeding, use these credentials:

| Role | Email | Password |
|---|---|---|
| 👑 Admin | `admin@shopez.com` | `admin123` |
| 👤 Customer | `user1@shopez.com` | `user123` |

---

## 🌍 Deployment

### Backend → Render
1. Create a Web Service on [render.com](https://render.com)
2. Connect your GitHub repo, set root to `backend/`
3. Build command: `npm install`
4. Start command: `node server.js`
5. Add environment variables in Render dashboard

### Frontend → Vercel
1. Create a project on [vercel.com](https://vercel.com)
2. Connect your GitHub repo, set root to `frontend/`
3. Build command: `npm run build`
4. Output directory: `dist`
5. Add `VITE_API_URL` env variable pointing to your Render backend

### Database → MongoDB Atlas
1. Create a free cluster at [cloud.mongodb.com](https://cloud.mongodb.com)
2. Create a database user and whitelist your IP
3. Copy the connection string into `MONGODB_URI` on Render

---

## 🎨 Design Highlights
- **Glassmorphism** cards with backdrop blur
- **HSL-based** custom CSS variable color system
- **Dark mode** with persistent localStorage preference
- **Skeleton loaders** for all async states
- **Smooth hover animations** on product cards (+6px lift)
- **Gradient glowing buttons** with scale transform
- **Custom toast notification** system (no external dependency)

---

## 🔮 Future Enhancements
- [ ] Real Stripe/Razorpay payment gateway integration
- [ ] Email notifications for order confirmations
- [ ] Product variant system (size, color, etc.)
- [ ] Advanced coupon management from Admin
- [ ] Return/Refund request flow
- [ ] Multi-vendor marketplace support
- [ ] PWA support with service workers
- [ ] Real-time notifications via WebSockets

---

## 📄 License

This project is licensed under the MIT License — free to use for portfolio, internship, and academic purposes.

---

## 👨‍💻 Built With ❤️ 

Built as a full stack portfolio/internship project showcasing complete MERN stack development skills including REST API design, MongoDB aggregations, React Context state management, Chart.js analytics, and responsive UI engineering.
