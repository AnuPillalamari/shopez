import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Providers
import { ToastProvider } from './context/ToastContext.jsx';
import { ThemeProvider } from './context/ThemeContext.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import { CartProvider } from './context/CartContext.jsx';
import { WishlistProvider } from './context/WishlistContext.jsx';

// Layouts
import StorefrontLayout from './layouts/StorefrontLayout.jsx';
import AdminLayout from './layouts/AdminLayout.jsx';

// Storefront Pages
import Home from './pages/Home.jsx';
import Products from './pages/Products.jsx';
import ProductDetails from './pages/ProductDetails.jsx';
import Cart from './pages/Cart.jsx';
import Checkout from './pages/Checkout.jsx';
import PaymentSuccess from './pages/PaymentSuccess.jsx';
import OrderHistory from './pages/OrderHistory.jsx';
import OrderDetails from './pages/OrderDetails.jsx';
import UserProfile from './pages/UserProfile.jsx';
import Wishlist from './pages/Wishlist.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import AboutUs from './pages/AboutUs.jsx';
import ContactUs from './pages/ContactUs.jsx';
import NotFound from './pages/NotFound.jsx';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard.jsx';
import ManageProducts from './pages/admin/ManageProducts.jsx';
import ManageCategories from './pages/admin/ManageCategories.jsx';
import ManageOrders from './pages/admin/ManageOrders.jsx';
import ManageUsers from './pages/admin/ManageUsers.jsx';

const LoadingSpinner = () => (
  <div className="d-flex align-items-center justify-content-center" style={{ minHeight: '60vh' }}>
    <div className="spinner-border text-primary" role="status">
      <span className="visually-hidden">Loading...</span>
    </div>
  </div>
);

function App() {
  return (
    <Router>
      <ThemeProvider>
        <ToastProvider>
          <AuthProvider>
            <CartProvider>
              <WishlistProvider>
                <Suspense fallback={<LoadingSpinner />}>
                  <Routes>
                    {/* Customer Storefront */}
                    <Route path="/" element={<StorefrontLayout />}>
                      <Route index element={<Home />} />
                      <Route path="products" element={<Products />} />
                      <Route path="product/:id" element={<ProductDetails />} />
                      <Route path="cart" element={<Cart />} />
                      <Route path="checkout" element={<Checkout />} />
                      <Route path="payment-success" element={<PaymentSuccess />} />
                      <Route path="orders" element={<OrderHistory />} />
                      <Route path="orders/:id" element={<OrderDetails />} />
                      <Route path="profile" element={<UserProfile />} />
                      <Route path="wishlist" element={<Wishlist />} />
                      <Route path="login" element={<Login />} />
                      <Route path="register" element={<Register />} />
                      <Route path="about" element={<AboutUs />} />
                      <Route path="contact" element={<ContactUs />} />
                      <Route path="*" element={<NotFound />} />
                    </Route>

                    {/* Admin Panel (protected inside AdminLayout) */}
                    <Route path="/admin" element={<AdminLayout />}>
                      <Route index element={<AdminDashboard />} />
                      <Route path="products" element={<ManageProducts />} />
                      <Route path="categories" element={<ManageCategories />} />
                      <Route path="orders" element={<ManageOrders />} />
                      <Route path="users" element={<ManageUsers />} />
                    </Route>
                  </Routes>
                </Suspense>
              </WishlistProvider>
            </CartProvider>
          </AuthProvider>
        </ToastProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;
