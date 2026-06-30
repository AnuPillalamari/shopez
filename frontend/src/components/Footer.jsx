import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { 
  FaFacebookF, 
  FaTwitter, 
  FaInstagram, 
  FaLinkedinIn, 
  FaEnvelope, 
  FaCcVisa, 
  FaCcMastercard, 
  FaCcPaypal, 
  FaCcApplePay 
} from 'react-icons/fa';
import { ToastContext } from '../context/ToastContext.jsx';

const Footer = () => {
  const [email, setEmail] = useState('');
  const { showToast } = useContext(ToastContext);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      showToast(`Thank you for subscribing, ${email.trim()}! Check your inbox for deals.`, 'success');
      setEmail('');
    } else {
      showToast('Please enter a valid email address', 'warning');
    }
  };

  return (
    <footer className="pt-5 pb-4 mt-5 border-top" style={{ backgroundColor: 'hsl(var(--bg-card))', borderColor: 'hsl(var(--border))' }}>
      <div className="container">
        <div className="row justify-content-between">
          {/* Logo & Description */}
          <div className="col-lg-4 col-md-6 mb-4">
            <h5 className="display-font text-gradient fs-4 mb-3" style={{
              background: 'linear-gradient(135deg, #4f46e5, #9333ea)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>ShopEZ</h5>
            <p className="text-muted mb-4" style={{ fontSize: '0.9rem', lineHeight: '1.6' }}>
              Your premium neighborhood shopping portal. Explore 100+ verified tech gadgets, fashion statements, home enhancements, and accessories, engineered with seamless local delivery and payment options.
            </p>
            <div className="d-flex gap-2">
              <a href="#" className="btn btn-outline-secondary btn-sm rounded-circle d-flex align-items-center justify-content-center" style={{ width: '36px', height: '36px' }}><FaFacebookF /></a>
              <a href="#" className="btn btn-outline-secondary btn-sm rounded-circle d-flex align-items-center justify-content-center" style={{ width: '36px', height: '36px' }}><FaTwitter /></a>
              <a href="#" className="btn btn-outline-secondary btn-sm rounded-circle d-flex align-items-center justify-content-center" style={{ width: '36px', height: '36px' }}><FaInstagram /></a>
              <a href="#" className="btn btn-outline-secondary btn-sm rounded-circle d-flex align-items-center justify-content-center" style={{ width: '36px', height: '36px' }}><FaLinkedinIn /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="col-lg-2 col-md-6 mb-4">
            <h6 className="text-uppercase fw-bold mb-3" style={{ fontSize: '0.85rem', letterSpacing: '0.05em' }}>Explore</h6>
            <ul className="list-unstyled d-flex flex-column gap-2" style={{ fontSize: '0.9rem' }}>
              <li><Link to="/" className="text-muted text-decoration-none hover-glow">Home</Link></li>
              <li><Link to="/products" className="text-muted text-decoration-none hover-glow">All Products</Link></li>
              <li><Link to="/about" className="text-muted text-decoration-none hover-glow">About Us</Link></li>
              <li><Link to="/contact" className="text-muted text-decoration-none hover-glow">Contact Support</Link></li>
            </ul>
          </div>

          {/* Support Info */}
          <div className="col-lg-2 col-md-6 mb-4">
            <h6 className="text-uppercase fw-bold mb-3" style={{ fontSize: '0.85rem', letterSpacing: '0.05em' }}>Support</h6>
            <ul className="list-unstyled d-flex flex-column gap-2" style={{ fontSize: '0.9rem' }}>
              <li><a href="#" className="text-muted text-decoration-none hover-glow">FAQ</a></li>
              <li><a href="#" className="text-muted text-decoration-none hover-glow">Privacy Policy</a></li>
              <li><a href="#" className="text-muted text-decoration-none hover-glow">Terms of Service</a></li>
              <li><a href="#" className="text-muted text-decoration-none hover-glow">Order Cancellation</a></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="col-lg-3 col-md-6 mb-4">
            <h6 className="text-uppercase fw-bold mb-3" style={{ fontSize: '0.85rem', letterSpacing: '0.05em' }}>Newsletter</h6>
            <p className="text-muted" style={{ fontSize: '0.85rem' }}>Subscribe to get dynamic sale alerts and discount coupons!</p>
            <form onSubmit={handleSubscribe}>
              <div className="input-group">
                <input 
                  type="email" 
                  className="form-control custom-input py-2" 
                  placeholder="Enter email..." 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{ fontSize: '0.85rem', borderTopRightRadius: 0, borderBottomRightRadius: 0 }}
                  required
                />
                <button 
                  className="btn btn-primary-glow d-flex align-items-center justify-content-center" 
                  type="submit"
                  style={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}
                >
                  <FaEnvelope />
                </button>
              </div>
            </form>
          </div>
        </div>

        <hr className="my-4" style={{ borderColor: 'hsl(var(--border))' }} />

        {/* Bottom Section */}
        <div className="row align-items-center justify-content-between">
          <div className="col-md-6 text-center text-md-start mb-2 mb-md-0">
            <span className="text-muted" style={{ fontSize: '0.85rem' }}>
              &copy; {new Date().getFullYear()} ShopEZ. All rights reserved. Made with ❤️ in India.
            </span>
          </div>
          <div className="col-md-6 text-center text-md-end">
            <div className="d-flex justify-content-center justify-content-md-end gap-3 fs-3 text-muted">
              <FaCcVisa title="Visa" />
              <FaCcMastercard title="Mastercard" />
              <FaCcPaypal title="Paypal" />
              <FaCcApplePay title="Apple Pay" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
