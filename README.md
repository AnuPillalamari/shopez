# ShopEZ – MERN Stack E-Commerce Website

## Project Overview

ShopEZ is a full-stack e-commerce website developed using the MERN Stack (MongoDB, Express.js, React.js, and Node.js). The main objective of this project was to understand how a complete online shopping platform works by connecting the frontend, backend, and database into a single application.

The application allows users to browse products, register and log in, manage their shopping cart, place orders, and view their order history. An admin dashboard is also included to manage products, users, categories, and customer orders.

This project was built as part of my learning in full-stack web development and helped me gain practical experience in authentication, REST APIs, database management, and responsive UI design.

---

## Features

### Customer Features

* User Registration and Login using JWT Authentication
* Browse and search products
* Filter and sort products
* View product details
* Add and remove items from cart
* Wishlist functionality
* Checkout process
* View order history
* Update user profile
* Responsive design for desktop and mobile devices

### Admin Features

* Dashboard with basic analytics
* Manage products (Add, Edit, Delete)
* Manage categories
* Manage customer orders
* View registered users
* Update order status

---

## Technologies Used

### Frontend

* React.js
* React Router DOM
* Bootstrap 5
* Axios
* Chart.js
* React Icons

### Backend

* Node.js
* Express.js
* JWT Authentication
* bcryptjs
* Express Validator
* Multer

### Database

* MongoDB
* Mongoose

### Other Tools

* Git & GitHub
* Vite
* Nodemon
* Cloudinary (optional for image uploads)

---

## Project Structure

```
ShopEZ
│
├── backend
│   ├── config
│   ├── controllers
│   ├── middleware
│   ├── models
│   ├── routes
│   ├── utils
│   └── server.js
│
└── frontend
    ├── src
    │   ├── components
    │   ├── pages
    │   ├── context
    │   ├── layouts
    │   ├── assets
    │   └── styles
    └── App.jsx
```

---

## Installation

### Clone the repository

```bash
git clone https://github.com/AnuPillalamari/shopez.git
cd shopez
```

### Backend Setup

```bash
cd backend
npm install
npm run dev
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

---

## Environment Variables

Create a `.env` file inside the backend folder.

```
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/shopez
JWT_SECRET=your_secret_key
```

---

## Main Modules

* User Authentication
* Product Management
* Category Management
* Shopping Cart
* Wishlist
* Order Management
* Admin Dashboard

---

## What I Learned

While working on this project, I learned how to:

* Build a full-stack application using the MERN Stack.
* Connect React with an Express backend.
* Design RESTful APIs.
* Store and retrieve data using MongoDB.
* Implement JWT-based authentication.
* Manage application state using React Context.
* Perform CRUD operations.
* Build responsive user interfaces with Bootstrap.
* Organize a project using a modular folder structure.

---

## Future Improvements

Some features that can be added in the future include:

* Online payment integration (Razorpay/Stripe)
* Email notifications
* Product recommendations
* Better search and filtering
* Product variants (size, color, etc.)
* Real-time order updates
* Performance optimization

---

## GitHub Repository

https://github.com/AnuPillalamari/shopez

---

## Author

**Anu Priya**

B.Tech – Computer Science Engineering

Anurag University

---

This project was developed as part of my learning journey in MERN Stack development and serves as a portfolio project to demonstrate my understanding of full-stack web development.
