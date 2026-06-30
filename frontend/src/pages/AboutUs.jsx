import React from 'react';
import { FaBoxes, FaTruck, FaShieldAlt, FaThumbsUp } from 'react-icons/fa';

const AboutUs = () => {
  return (
    <div className="container py-5">
      {/* Title */}
      <div className="text-center mb-5" style={{ maxWidth: '700px', margin: '0 auto' }}>
        <span className="badge bg-primary rounded-pill px-3 py-1.5 text-uppercase mb-2 fw-semibold" style={{ fontSize: '0.7rem' }}>Who We Are</span>
        <h2 className="display-font fw-extrabold display-4 mb-3">About ShopEZ</h2>
        <p className="text-muted lead">We are a next-generation MERN Stack E-Commerce platform committed to providing smooth, modern, and secure online shopping experiences.</p>
      </div>

      {/* Grid Features */}
      <div className="row g-4 mb-5">
        <div className="col-md-6 col-lg-3">
          <div className="card border-0 glass-panel p-4 h-100 text-center rounded-4">
            <div className="bg-light rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3" style={{ width: '60px', height: '60px' }}>
              <FaBoxes className="text-primary fs-3" />
            </div>
            <h5 className="fw-bold mb-2">100+ Products</h5>
            <p className="text-muted mb-0" style={{ fontSize: '0.88rem' }}>Diverse catalog from electronic gadgets to pet care supplies, verified by admins.</p>
          </div>
        </div>

        <div className="col-md-6 col-lg-3">
          <div className="card border-0 glass-panel p-4 h-100 text-center rounded-4">
            <div className="bg-light rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3" style={{ width: '60px', height: '60px' }}>
              <FaTruck className="text-success fs-3" />
            </div>
            <h5 className="fw-bold mb-2">Local Delivery</h5>
            <p className="text-muted mb-0" style={{ fontSize: '0.88rem' }}>Fast, reliable door delivery networks coordinating seamlessly behind the scenes.</p>
          </div>
        </div>

        <div className="col-md-6 col-lg-3">
          <div className="card border-0 glass-panel p-4 h-100 text-center rounded-4">
            <div className="bg-light rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3" style={{ width: '60px', height: '60px' }}>
              <FaShieldAlt className="text-warning fs-3" />
            </div>
            <h5 className="fw-bold mb-2">Secure Checks</h5>
            <p className="text-muted mb-0" style={{ fontSize: '0.88rem' }}>JWT tokens, password hashes, and SSL API integrations keeping transactions private.</p>
          </div>
        </div>

        <div className="col-md-6 col-lg-3">
          <div className="card border-0 glass-panel p-4 h-100 text-center rounded-4">
            <div className="bg-light rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3" style={{ width: '60px', height: '60px' }}>
              <FaThumbsUp className="text-info fs-3" />
            </div>
            <h5 className="fw-bold mb-2">Premium Support</h5>
            <p className="text-muted mb-0" style={{ fontSize: '0.88rem' }}>Dedicated administrators keeping tracks of shipment progress and customer feedback.</p>
          </div>
        </div>
      </div>

      {/* Main Text Content */}
      <div className="card border-0 glass-panel p-4 p-md-5 rounded-4 mb-5">
        <div className="row align-items-center g-4">
          <div className="col-lg-6">
            <h3 className="fw-bold mb-3 display-font">Engineered For Visual Excellence</h3>
            <p className="text-muted" style={{ lineHeight: '1.7', fontSize: '0.95rem' }}>
              ShopEZ was designed and built to showcase how cutting-edge technologies like React.js and Mongoose can cooperate to power large-scale, responsive websites. The frontend uses Bootstrap 5 alongside a custom-curated HSL CSS system to maintain glassmorphic panels, rich shadows, and loading skeletons.
            </p>
            <p className="text-muted" style={{ lineHeight: '1.7', fontSize: '0.95rem' }}>
              On the backend, Node.js and Express.js handle API endpoints with JWT authentication guards, input validator middlewares, and file streams that automatically switch to Cloudinary for media uploads.
            </p>
          </div>
          <div className="col-lg-6">
            <img 
              src="https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=600&auto=format&fit=crop&q=80" 
              alt="Workspace Teamwork" 
              className="img-fluid rounded-4 shadow"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
