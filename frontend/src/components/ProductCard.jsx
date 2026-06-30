import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaHeart, FaRegHeart, FaStar, FaShoppingCart } from 'react-icons/fa';
import { CartContext } from '../context/CartContext.jsx';
import { WishlistContext } from '../context/WishlistContext.jsx';
import { formatCurrency } from '../utils/formatCurrency.js';

const ProductCard = ({ product }) => {
  const { addToCart } = useContext(CartContext);
  const { addToWishlist, removeFromWishlist, isInWishlist } = useContext(WishlistContext);
  const navigate = useNavigate();

  const isBookmarked = isInWishlist(product._id);

  const handleWishlistToggle = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isBookmarked) {
      await removeFromWishlist(product._id);
    } else {
      await addToWishlist(product._id);
    }
  };

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    await addToCart(product._id, 1);
  };

  const getDiscountPercent = () => {
    if (product.discountPrice && product.discountPrice > 0) {
      const discount = ((product.price - product.discountPrice) / product.price) * 100;
      return Math.round(discount);
    }
    return 0;
  };

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <FaStar 
          key={i} 
          className={i <= Math.round(rating) ? 'text-warning' : 'text-secondary'} 
          style={{ fontSize: '0.8rem', opacity: i <= Math.round(rating) ? 1 : 0.25 }}
        />
      );
    }
    return stars;
  };

  const hasDiscount = product.discountPrice && product.discountPrice > 0;

  return (
    <div 
      className="card custom-card h-100 cursor-pointer overflow-hidden border-0" 
      onClick={() => navigate(`/product/${product._id}`)}
      style={{ position: 'relative' }}
    >
      {/* Wishlist Icon Button */}
      <button
        onClick={handleWishlistToggle}
        className="btn bg-white shadow-sm rounded-circle d-flex align-items-center justify-content-center"
        style={{
          position: 'absolute',
          top: '12px',
          right: '12px',
          zIndex: 10,
          width: '36px',
          height: '36px',
          border: 'none',
          color: isBookmarked ? '#e11d48' : '#64748b',
          transition: 'all 0.2s ease',
        }}
        title={isBookmarked ? 'Remove from Wishlist' : 'Add to Wishlist'}
      >
        {isBookmarked ? <FaHeart /> : <FaRegHeart />}
      </button>

      {/* Sale Percentage Badge */}
      {hasDiscount && (
        <span 
          className="badge bg-danger rounded-pill px-3 py-2 text-uppercase fw-bold"
          style={{
            position: 'absolute',
            top: '12px',
            left: '12px',
            zIndex: 10,
            fontSize: '0.75rem',
            letterSpacing: '0.05em',
          }}
        >
          {getDiscountPercent()}% Off
        </span>
      )}

      {/* Image Wrap */}
      <div 
        className="bg-light d-flex align-items-center justify-content-center" 
        style={{ height: '220px', overflow: 'hidden' }}
      >
        <img
          src={product.images[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=60'}
          alt={product.name}
          className="w-100 h-100"
          style={{ objectFit: 'cover', transition: 'transform 0.5s ease' }}
          onMouseOver={(e) => (e.currentTarget.style.transform = 'scale(1.08)')}
          onMouseOut={(e) => (e.currentTarget.style.transform = 'scale(1)')}
        />
      </div>

      {/* Card Info */}
      <div className="card-body d-flex flex-column justify-content-between p-3">
        <div>
          {/* Brand & Category */}
          <div className="d-flex align-items-center justify-content-between mb-2">
            <span className="text-uppercase fw-bold text-muted" style={{ fontSize: '0.7rem', letterSpacing: '0.05em' }}>
              {product.brand}
            </span>
            <span className="badge bg-light text-secondary rounded-pill text-capitalize" style={{ fontSize: '0.7rem' }}>
              {product.category?.name}
            </span>
          </div>

          {/* Name */}
          <h6 className="card-title fw-bold text-truncate mb-2" title={product.name} style={{ fontSize: '0.95rem' }}>
            {product.name}
          </h6>

          {/* Stars & Reviews */}
          <div className="d-flex align-items-center gap-1 mb-3">
            <div className="d-flex gap-0.5">{renderStars(product.ratings)}</div>
            <span className="text-muted" style={{ fontSize: '0.75rem' }}>({product.reviewsCount})</span>
          </div>
        </div>

        {/* Pricing & Add to Cart */}
        <div className="d-flex align-items-center justify-content-between mt-2 pt-2 border-top border-light">
          <div>
            {hasDiscount ? (
              <>
                <span className="text-muted text-decoration-line-through me-2" style={{ fontSize: '0.85rem' }}>
                  {formatCurrency(product.price)}
                </span>
                <span className="fw-bold text-danger fs-5">
                  {formatCurrency(product.discountPrice)}
                </span>
              </>
            ) : (
              <span className="fw-bold text-dark fs-5">
                {formatCurrency(product.price)}
              </span>
            )}
          </div>

          {/* Cart Trigger */}
          {product.stock > 0 ? (
            <button
              onClick={handleAddToCart}
              className="btn btn-outline-primary btn-sm rounded-circle d-flex align-items-center justify-content-center"
              style={{
                width: '38px',
                height: '38px',
                borderWidth: '1.5px',
                transition: 'all 0.2s ease',
              }}
              title="Add to Cart"
            >
              <FaShoppingCart />
            </button>
          ) : (
            <span className="badge bg-secondary text-uppercase fw-semibold" style={{ fontSize: '0.65rem' }}>
              Out of Stock
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
