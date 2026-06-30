import React, { useContext, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  FaShoppingCart, 
  FaHeart, 
  FaUser, 
  FaSearch, 
  FaSun, 
  FaMoon, 
  FaSignOutAlt, 
  FaUserShield,
  FaBars
} from 'react-icons/fa';
import { AuthContext } from '../context/AuthContext.jsx';
import { CartContext } from '../context/CartContext.jsx';
import { WishlistContext } from '../context/WishlistContext.jsx';
import { ThemeContext } from '../context/ThemeContext.jsx';
import axios from 'axios';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const { cartCount } = useContext(CartContext);
  const { wishlistItems } = useContext(WishlistContext);
  const { theme, toggleTheme } = useContext(ThemeContext);
  
  const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get('/api/categories');
        setCategories(data);
      } catch (err) {
        console.error('Error fetching categories:', err.message);
      }
    };
    fetchCategories();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?keyword=${searchQuery.trim()}`);
    }
  };

  return (
    <nav className="navbar navbar-expand-lg custom-navbar glass-panel sticky-top py-3">
      <div className="container">
        {/* Logo */}
        <Link className="navbar-brand d-flex align-items-center" to="/">
          <span className="display-font fs-3 fw-extrabold text-gradient" style={{
            background: 'linear-gradient(135deg, #4f46e5, #9333ea)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>ShopEZ</span>
        </Link>

        {/* Mobile Toggle */}
        <button 
          className="navbar-toggler border-0" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarContent"
          aria-controls="navbarContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <FaBars />
        </button>

        <div className="collapse navbar-collapse" id="navbarContent">
          {/* Main Links */}
          <ul className="navbar-nav me-auto mb-2 mb-lg-0 align-items-lg-center">
            <li className="nav-item">
              <Link className="nav-link px-3 fw-medium" to="/">Home</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link px-3 fw-medium" to="/products">Products</Link>
            </li>
            <li className="nav-item dropdown">
              <a 
                className="nav-link dropdown-toggle px-3 fw-medium text-capitalize" 
                href="#" 
                role="button" 
                data-bs-toggle="dropdown" 
                aria-expanded="false"
              >
                Categories
              </a>
              <ul className="dropdown-menu border-0 shadow-lg p-2" style={{ borderRadius: '12px' }}>
                {categories.map((cat) => (
                  <li key={cat._id}>
                    <Link className="dropdown-item py-2 px-3 text-capitalize" to={`/products?category=${cat._id}`}>
                      {cat.name}
                    </Link>
                  </li>
                ))}
                {categories.length === 0 && (
                  <li><span className="dropdown-item-text text-muted">No categories loaded</span></li>
                )}
              </ul>
            </li>
            <li className="nav-item">
              <Link className="nav-link px-3 fw-medium" to="/about">About</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link px-3 fw-medium" to="/contact">Contact</Link>
            </li>
          </ul>

          {/* Search Bar */}
          <form className="d-flex mx-lg-3 my-2 my-lg-0 flex-grow-1" style={{ maxWidth: '400px' }} onSubmit={handleSearchSubmit}>
            <div className="input-group">
              <input 
                type="text" 
                className="form-control custom-input border-end-0 py-2" 
                placeholder="Search products..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ borderTopRightRadius: 0, borderBottomRightRadius: 0 }}
              />
              <button 
                className="btn btn-outline-secondary custom-input border-start-0 py-2 d-flex align-items-center" 
                type="submit"
                style={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0, backgroundColor: 'hsl(var(--bg-input))' }}
              >
                <FaSearch />
              </button>
            </div>
          </form>

          {/* Icons and User Actions */}
          <div className="d-flex align-items-center gap-3 mt-3 mt-lg-0">
            {/* Theme Toggle */}
            <button 
              className="btn btn-link nav-link p-2 text-warning fs-5 border-0" 
              onClick={toggleTheme}
              title="Toggle light/dark theme"
            >
              {theme === 'light' ? <FaMoon /> : <FaSun />}
            </button>

            {/* Wishlist */}
            <Link to="/wishlist" className="position-relative p-2 text-danger fs-5" title="Wishlist">
              <FaHeart />
              {wishlistItems.length > 0 && (
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style={{ fontSize: '0.65rem' }}>
                  {wishlistItems.length}
                </span>
              )}
            </Link>

            {/* Cart */}
            <Link to="/cart" className="position-relative p-2 text-primary fs-5 me-2" title="Cart">
              <FaShoppingCart />
              {cartCount > 0 && (
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-primary" style={{ fontSize: '0.65rem' }}>
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Profile / Login */}
            {user ? (
              <div className="dropdown">
                <a 
                  className="d-flex align-items-center gap-2 text-decoration-none dropdown-toggle" 
                  href="#" 
                  role="button" 
                  data-bs-toggle="dropdown" 
                  aria-expanded="false"
                >
                  <img 
                    src={user.profileImage || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&auto=format&fit=crop&q=60'} 
                    alt={user.name} 
                    className="rounded-circle border border-2 border-primary"
                    style={{ width: '38px', height: '38px', objectFit: 'cover' }}
                  />
                  <span className="d-none d-xl-inline fw-semibold text-truncate" style={{ maxWidth: '100px' }}>
                    {user.name.split(' ')[0]}
                  </span>
                </a>
                <ul className="dropdown-menu dropdown-menu-end border-0 shadow-lg p-2 mt-2" style={{ borderRadius: '12px', minWidth: '200px' }}>
                  <li className="px-3 py-2 border-bottom border-light">
                    <span className="d-block fw-bold text-truncate">{user.name}</span>
                    <span className="d-block text-muted text-truncate" style={{ fontSize: '0.75rem' }}>{user.email}</span>
                  </li>
                  {user.role === 'admin' && (
                    <li>
                      <Link className="dropdown-item py-2 px-3 d-flex align-items-center gap-2 text-primary" to="/admin">
                        <FaUserShield /> Admin Panel
                      </Link>
                    </li>
                  )}
                  <li>
                    <Link className="dropdown-item py-2 px-3 d-flex align-items-center gap-2" to="/profile">
                      <FaUser /> My Profile
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item py-2 px-3 d-flex align-items-center gap-2" to="/orders">
                      <FaUser /> Order History
                    </Link>
                  </li>
                  <li><hr className="dropdown-divider" /></li>
                  <li>
                    <button className="dropdown-item py-2 px-3 d-flex align-items-center gap-2 text-danger" onClick={logout}>
                      <FaSignOutAlt /> Logout
                    </button>
                  </li>
                </ul>
              </div>
            ) : (
              <Link to="/login" className="btn btn-primary-glow d-flex align-items-center gap-2">
                <FaUser /> Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
