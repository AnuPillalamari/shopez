import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FaBolt, FaStar, FaFire, FaRegClock, FaArrowRight, FaQuoteLeft } from 'react-icons/fa';
import ProductCard from '../components/ProductCard.jsx';

const Home = () => {
  const [categories, setCategories] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        setLoading(true);
        const [catRes, featRes, newRes, bestRes] = await Promise.all([
          axios.get('/api/categories'),
          axios.get('/api/products/featured'),
          axios.get('/api/products/new-arrivals'),
          axios.get('/api/products/best-sellers'),
        ]);

        setCategories(catRes.data);
        setFeaturedProducts(featRes.data);
        setNewArrivals(newRes.data);
        setBestSellers(bestRes.data);
      } catch (err) {
        console.error('Error fetching homepage data:', err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchHomeData();
  }, []);

  return (
    <div style={{ position: 'relative' }}>
      {/* 1. Hero Banner */}
      <section 
        className="py-5 d-flex align-items-center"
        style={{
          background: 'linear-gradient(135deg, hsl(var(--bg-card)), hsl(var(--bg-app)))',
          minHeight: '80vh',
          borderBottom: '1px solid hsl(var(--border))'
        }}
      >
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6 mb-5 mb-lg-0 text-center text-lg-start">
              <span className="badge bg-primary rounded-pill px-3 py-2 text-uppercase mb-3 fw-bold" style={{ letterSpacing: '0.1em', fontSize: '0.75rem' }}>
                Exclusive Launch Sale 2026
              </span>
              <h1 className="display-3 fw-extrabold mb-4 display-font" style={{ lineHeight: '1.1' }}>
                Shop Smart.<br />
                <span className="text-gradient" style={{
                  background: 'linear-gradient(135deg, #4f46e5, #9333ea)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}>Shop EZ.</span>
              </h1>
              <p className="lead text-muted mb-4 fs-5" style={{ lineHeight: '1.7' }}>
                Discover an curated collection of top-rated electronics, fashion statements, home necessities, and pet supplies. Enjoy instant checkouts, dedicated order tracking, and local shipments.
              </p>
              <div className="d-flex flex-wrap justify-content-center justify-content-lg-start gap-3">
                <Link to="/products" className="btn btn-primary-glow px-4 py-3 fs-6">
                  Explore Products <FaArrowRight className="ms-2" />
                </Link>
                <Link to="/about" className="btn btn-dark-glow px-4 py-3 fs-6">
                  Learn More
                </Link>
              </div>
            </div>
            {/* Visual Floating Mockup */}
            <div className="col-lg-6 d-flex justify-content-center">
              <div className="animate-float" style={{ position: 'relative', width: '80%', maxWidth: '420px' }}>
                <div 
                  className="glass-panel rounded-circle position-absolute" 
                  style={{ width: '400px', height: '400px', zIndex: 1, top: '50%', left: '50%', transform: 'translate(-50%, -50%)', opacity: 0.1, background: 'hsl(var(--primary))' }}
                ></div>
                <img 
                  src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80" 
                  alt="Sneakers Mockup" 
                  className="img-fluid rounded-4 shadow-lg position-relative"
                  style={{ zIndex: 2, transform: 'rotate(-12deg)' }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Featured Categories */}
      <section className="py-5 mt-5">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="display-font fw-bold">Explore Categories</h2>
            <p className="text-muted">Find specific gear tailored to your daily activities</p>
          </div>
          <div className="row g-4">
            {categories.slice(0, 6).map((cat) => (
              <div key={cat._id} className="col-6 col-md-4 col-lg-2">
                <Link 
                  to={`/products?category=${cat._id}`}
                  className="card text-center text-decoration-none custom-card border-0 h-100 p-3 d-flex flex-column align-items-center"
                >
                  <img 
                    src={cat.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=150&auto=format&fit=crop&q=60'} 
                    alt={cat.name} 
                    className="rounded-circle mb-3"
                    style={{ width: '80px', height: '80px', objectFit: 'cover' }}
                  />
                  <h6 className="fw-bold text-dark text-capitalize text-truncate w-100 mb-0" style={{ fontSize: '0.9rem' }}>{cat.name}</h6>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Flash Sale Section */}
      <section className="py-5 mt-4" style={{ backgroundColor: 'hsl(var(--bg-card))', borderY: '1px solid hsl(var(--border))' }}>
        <div className="container">
          <div className="d-flex align-items-center justify-content-between mb-4 flex-wrap gap-2">
            <div className="d-flex align-items-center gap-2">
              <FaBolt className="text-warning fs-3 animate-pulse" />
              <h2 className="mb-0 fw-bold display-font">Flash Sale Deals</h2>
              <span className="badge bg-danger ms-2 px-2 py-1 text-uppercase fw-semibold" style={{ fontSize: '0.65rem' }}>Limited Time</span>
            </div>
            <div className="d-flex align-items-center gap-2 text-muted" style={{ fontSize: '0.9rem' }}>
              <FaRegClock /> Ending soon!
            </div>
          </div>
          {loading ? (
            <div className="row g-4">
              {[1, 2, 4].map(n => (
                <div key={n} className="col-md-3"><div className="skeleton" style={{ height: '350px' }}></div></div>
              ))}
            </div>
          ) : (
            <div className="row g-4">
              {featuredProducts.slice(0, 4).map((product) => (
                <div key={product._id} className="col-md-6 col-lg-3">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 4. Best Sellers & New Arrivals Row */}
      <section className="py-5 mt-4">
        <div className="container">
          <div className="row g-5">
            {/* Best Sellers */}
            <div className="col-lg-6">
              <div className="d-flex align-items-center gap-2 mb-4">
                <FaFire className="text-danger fs-3" />
                <h3 className="mb-0 fw-bold display-font">Best Sellers</h3>
              </div>
              <div className="row g-3">
                {bestSellers.slice(0, 4).map(product => (
                  <div key={product._id} className="col-md-6">
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
            </div>

            {/* New Arrivals */}
            <div className="col-lg-6">
              <div className="d-flex align-items-center gap-2 mb-4">
                <FaStar className="text-warning fs-3" />
                <h3 className="mb-0 fw-bold display-font">New Arrivals</h3>
              </div>
              <div className="row g-3">
                {newArrivals.slice(0, 4).map(product => (
                  <div key={product._id} className="col-md-6">
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Customer Testimonials */}
      <section className="py-5 mt-4 bg-light border-y">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="display-font fw-bold">Customer Testimonials</h2>
            <p className="text-muted">Hear from our users shopping around the country</p>
          </div>
          <div className="row g-4">
            {[
              { name: 'Sarah Miller', feedback: 'ShopEZ made ordering tech gadgets incredibly fast. The items arrived in 2 days and the packaging was absolutely premium.', rating: 5, job: 'Product Designer' },
              { name: 'David Chen', feedback: 'Amazing service! Toggling wishlist items is smooth and checking out with dummy card simulation works perfectly. Highly recommend.', rating: 5, job: 'Software Dev' },
              { name: 'Amanda Ross', feedback: 'The support panel was very responsive, and the dark mode makes late night browsing extremely comfortable on the eyes.', rating: 4, job: 'Freelancer' }
            ].map((t, idx) => (
              <div key={idx} className="col-md-4">
                <div className="card border-0 glass-panel p-4 h-100 rounded-4">
                  <FaQuoteLeft className="text-primary mb-3 fs-3 opacity-25" />
                  <p className="text-muted mb-4" style={{ fontSize: '0.92rem', lineHeight: '1.6' }}>"{t.feedback}"</p>
                  <div className="mt-auto border-top border-light pt-3 d-flex align-items-center justify-content-between">
                    <div>
                      <h6 className="fw-bold mb-0 text-dark">{t.name}</h6>
                      <span className="text-muted" style={{ fontSize: '0.75rem' }}>{t.job}</span>
                    </div>
                    <div className="d-flex gap-0.5">
                      {Array.from({ length: t.rating }).map((_, i) => (
                        <FaStar key={i} className="text-warning" style={{ fontSize: '0.8rem' }} />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Brand Banner */}
      <section className="py-4 text-center border-top border-bottom" style={{ backgroundColor: 'hsl(var(--bg-card))' }}>
        <div className="container">
          <div className="d-flex flex-wrap align-items-center justify-content-around gap-4 text-uppercase fw-bold text-muted" style={{ opacity: 0.5, fontSize: '1.1rem', letterSpacing: '0.15em' }}>
            <span>Apple</span>
            <span>Sony</span>
            <span>Samsung</span>
            <span>Nike</span>
            <span>Dell</span>
            <span>Canon</span>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
