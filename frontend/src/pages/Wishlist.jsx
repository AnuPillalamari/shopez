import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { FaHeart, FaShoppingBag } from 'react-icons/fa';
import { WishlistContext } from '../context/WishlistContext.jsx';
import ProductCard from '../components/ProductCard.jsx';

const Wishlist = () => {
  const { wishlistItems, loading } = useContext(WishlistContext);

  if (loading) {
    return (
      <div className="container py-5">
        <h2 className="display-font fw-bold mb-4">My Wishlist</h2>
        <div className="row g-4">
          {[1, 2, 3].map(n => (
            <div key={n} className="col-md-4">
              <div className="skeleton" style={{ height: '350px' }}></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <h2 className="display-font fw-bold mb-4">My Wishlist ({wishlistItems.length} items)</h2>

      {wishlistItems.length === 0 ? (
        <div className="text-center py-5 glass-panel rounded-4">
          <FaHeart className="text-muted display-2 mb-3" style={{ opacity: 0.2 }} />
          <h4 className="fw-bold display-font">Your Wishlist is Empty</h4>
          <p className="text-muted mb-4">Tap the heart icons on products to bookmark them here.</p>
          <Link to="/products" className="btn btn-primary-glow px-4 py-2">
            <FaShoppingBag className="me-2" /> Explore Products
          </Link>
        </div>
      ) : (
        <div className="row g-4">
          {wishlistItems.map((item) => (
            <div key={item._id} className="col-6 col-md-4 col-lg-3">
              {/* Reuse our ProductCard which already handles toggles and clicks */}
              <ProductCard product={item.product} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;
