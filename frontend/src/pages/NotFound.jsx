import React from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaSearch } from 'react-icons/fa';

const NotFound = () => {
  return (
    <div className="container py-5 d-flex justify-content-center align-items-center" style={{ minHeight: '70vh' }}>
      <div className="text-center">
        <div 
          className="mb-4 fw-extrabold display-font"
          style={{
            fontSize: 'clamp(6rem, 20vw, 12rem)',
            lineHeight: 1,
            background: 'linear-gradient(135deg, #4f46e5, #9333ea)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            opacity: 0.2,
          }}
        >
          404
        </div>
        <h2 className="display-font fw-bold mb-3">Page Not Found</h2>
        <p className="text-muted mb-5 fs-6" style={{ maxWidth: '400px', margin: '0 auto' }}>
          The page you're looking for doesn't exist or has been moved. Try browsing our product catalog instead.
        </p>
        <div className="d-flex flex-wrap justify-content-center gap-3">
          <Link to="/" className="btn btn-primary-glow px-4 py-2 d-flex align-items-center gap-2">
            <FaHome /> Back to Home
          </Link>
          <Link to="/products" className="btn btn-dark-glow px-4 py-2 d-flex align-items-center gap-2">
            <FaSearch /> Browse Products
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
