import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  FaStar, 
  FaShoppingCart, 
  FaHeart, 
  FaRegHeart,
  FaArrowLeft,
  FaUser,
  FaTrashAlt,
  FaEdit
} from 'react-icons/fa';
import { CartContext } from '../context/CartContext.jsx';
import { WishlistContext } from '../context/WishlistContext.jsx';
import { AuthContext } from '../context/AuthContext.jsx';
import { ToastContext } from '../context/ToastContext.jsx';
import { formatCurrency } from '../utils/formatCurrency.js';
import ProductCard from '../components/ProductCard.jsx';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const { addToCart } = useContext(CartContext);
  const { addToWishlist, removeFromWishlist, isInWishlist } = useContext(WishlistContext);
  const { showToast } = useContext(ToastContext);

  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Gallery and Quantities
  const [activeImage, setActiveImage] = useState('');
  const [quantity, setQuantity] = useState(1);

  // Review Form States
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [editingReviewId, setEditingReviewId] = useState(null);

  // Zoom magnifier positions
  const [zoomStyle, setZoomStyle] = useState({ transformOrigin: '0% 0%' });

  // Fetch product data on parameters change
  useEffect(() => {
    const fetchProductData = async () => {
      try {
        setLoading(true);
        // Load details and reviews in parallel
        const [prodRes, revRes] = await Promise.all([
          axios.get(`/api/products/${id}`),
          axios.get(`/api/reviews/product/${id}`),
        ]);

        setProduct(prodRes.data);
        setReviews(revRes.data);
        setActiveImage(prodRes.data.images[0] || '');
        setQuantity(1);

        // Fetch related products
        const relRes = await axios.get('/api/products', {
          params: { category: prodRes.data.category?._id, limit: 5 }
        });
        // Exclude current product
        setRelatedProducts(relRes.data.products.filter(p => p._id !== prodRes.data._id).slice(0, 4));

      } catch (err) {
        console.error('Error loading product details:', err.message);
        showToast('Failed to load product details', 'danger');
      } finally {
        setLoading(false);
      }
    };

    fetchProductData();
  }, [id]);

  const handleZoomMove = (e) => {
    const { left, top, width, height } = e.target.getBoundingClientRect();
    const x = ((e.pageX - left - window.scrollX) / width) * 100;
    const y = ((e.pageY - top - window.scrollY) / height) * 100;
    setZoomStyle({ transformOrigin: `${x}% ${y}%` });
  };

  const handleAddToCart = async () => {
    await addToCart(product._id, quantity);
  };

  const handleWishlistToggle = async () => {
    const isBookmarked = isInWishlist(product._id);
    if (isBookmarked) {
      await removeFromWishlist(product._id);
    } else {
      await addToWishlist(product._id);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) {
      return showToast('Please write a comment', 'warning');
    }

    try {
      if (editingReviewId) {
        // Edit Review
        const { data } = await axios.put(`/api/reviews/${editingReviewId}`, { rating, comment });
        setReviews(prev => prev.map(r => r._id === editingReviewId ? { ...r, rating: data.rating, comment: data.comment } : r));
        showToast('Review updated successfully', 'success');
      } else {
        // Create Review
        const { data } = await axios.post('/api/reviews', { productId: product._id, rating, comment });
        // Re-fetch reviews to populate user schema details
        const revRes = await axios.get(`/api/reviews/product/${product._id}`);
        setReviews(revRes.data);
        showToast('Review submitted successfully', 'success');
      }

      // Re-fetch product details to sync ratings aggregates
      const { data: updatedProd } = await axios.get(`/api/products/${product._id}`);
      setProduct(updatedProd);

      // Reset
      setComment('');
      setRating(5);
      setEditingReviewId(null);
    } catch (error) {
      showToast(error.response?.data?.message || 'Failed to submit review', 'danger');
    }
  };

  const handleEditClick = (review) => {
    setEditingReviewId(review._id);
    setRating(review.rating);
    setComment(review.comment);
    // Scroll to review box
    document.getElementById('reviewFormSection')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleDeleteReview = async (reviewId) => {
    if (window.confirm('Are you sure you want to delete your review?')) {
      try {
        await axios.delete(`/api/reviews/${reviewId}`);
        setReviews(prev => prev.filter(r => r._id !== reviewId));
        showToast('Review deleted successfully', 'success');

        // Re-fetch product details to sync ratings aggregates
        const { data: updatedProd } = await axios.get(`/api/products/${product._id}`);
        setProduct(updatedProd);
      } catch (error) {
        showToast(error.response?.data?.message || 'Delete failed', 'danger');
      }
    }
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <FaStar 
        key={i} 
        className={i < Math.round(rating) ? 'text-warning' : 'text-secondary'} 
        style={{ fontSize: '0.95rem', opacity: i < Math.round(rating) ? 1 : 0.25 }}
      />
    ));
  };

  if (loading) {
    return (
      <div className="container py-5">
        <div className="row g-5">
          <div className="col-md-6"><div className="skeleton" style={{ height: '400px' }}></div></div>
          <div className="col-md-6">
            <div className="skeleton mb-3" style={{ height: '30px', width: '50%' }}></div>
            <div className="skeleton mb-4" style={{ height: '60px' }}></div>
            <div className="skeleton mb-3" style={{ height: '100px' }}></div>
            <div className="skeleton" style={{ height: '45px', width: '40%' }}></div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container py-5 text-center">
        <h4 className="display-font fw-bold">Product Not Found</h4>
        <Link to="/products" className="btn btn-primary-glow mt-3">
          <FaArrowLeft className="me-2" /> Back to Products
        </Link>
      </div>
    );
  }

  const isBookmarked = isInWishlist(product._id);
  const userHasReviewed = reviews.some(r => r.user?._id === user?._id);

  return (
    <div className="container py-5">
      {/* Breadcrumb Navigation */}
      <nav aria-label="breadcrumb" className="mb-4">
        <ol className="breadcrumb">
          <li className="breadcrumb-item"><Link to="/">Home</Link></li>
          <li className="breadcrumb-item"><Link to="/products">Products</Link></li>
          <li className="breadcrumb-item active text-capitalize" aria-current="page">{product.name}</li>
        </ol>
      </nav>

      {/* Detail Block */}
      <div className="row g-5">
        {/* Left Column - Gallery */}
        <div className="col-lg-6">
          <div className="zoom-container bg-light d-flex align-items-center justify-content-center p-3" style={{ height: '450px' }}>
            <img 
              src={activeImage || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80'} 
              alt={product.name} 
              className="zoom-img img-fluid w-100 h-100"
              style={{ objectFit: 'contain', ...zoomStyle }}
              onMouseMove={handleZoomMove}
            />
          </div>
          
          {/* Thumbnails */}
          {product.images && product.images.length > 1 && (
            <div className="d-flex gap-2 mt-3 overflow-x-auto pb-2">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(img)}
                  className={`btn p-0 border-2 bg-light ${activeImage === img ? 'border-primary' : 'border-light'}`}
                  style={{ width: '80px', height: '80px', overflow: 'hidden', borderRadius: '8px' }}
                >
                  <img src={img} alt="" className="w-100 h-100" style={{ objectFit: 'cover' }} />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column - Product Meta */}
        <div className="col-lg-6">
          <span className="text-uppercase fw-bold text-muted" style={{ fontSize: '0.8rem', letterSpacing: '0.1em' }}>
            {product.brand}
          </span>
          <h1 className="fw-extrabold display-font mt-1 mb-2" style={{ fontSize: '2.2rem' }}>{product.name}</h1>

          {/* Ratings & reviews count */}
          <div className="d-flex align-items-center gap-2 mb-4">
            <div className="d-flex">{renderStars(product.ratings)}</div>
            <span className="text-muted" style={{ fontSize: '0.9rem' }}>({product.ratings.toFixed(1)} / 5.0 from {product.reviewsCount} reviews)</span>
          </div>

          {/* Price Block */}
          <div className="mb-4">
            {product.discountPrice > 0 ? (
              <div className="d-flex align-items-center gap-3 mb-4">
                <span className="fs-3 fw-extrabold text-danger">{formatCurrency(product.discountPrice)}</span>
                <span className="text-decoration-line-through text-muted fs-5">{formatCurrency(product.price)}</span>
                <span className="badge bg-danger-subtle text-danger px-2 py-1 rounded-pill fw-bold">
                  Save {formatCurrency(product.price - product.discountPrice)}
                </span>
              </div>
            ) : (
              <div className="mb-4">
                <span className="fs-3 fw-extrabold text-dark" style={{
                  background: 'linear-gradient(45deg, #2d3748, #1a202c)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}>{formatCurrency(product.price)}</span>
              </div>
            )}</div>

          <hr className="my-4" style={{ borderColor: 'hsl(var(--border))' }} />

          {/* Description */}
          <p className="text-muted mb-4" style={{ lineHeight: '1.7', fontSize: '0.95rem' }}>{product.description}</p>

          {/* Specifications */}
          <div className="mb-4 bg-light p-3 rounded-4" style={{ border: '1px solid hsl(var(--border))' }}>
            <h6 className="fw-bold mb-2">Details & Specifications</h6>
            <ul className="list-unstyled mb-0 d-flex flex-column gap-1 text-muted" style={{ fontSize: '0.9rem' }}>
              <li><strong>Brand:</strong> {product.brand}</li>
              <li><strong>Category:</strong> <span className="text-capitalize">{product.category?.name}</span></li>
              <li><strong>Availability Status:</strong> {product.stock > 0 ? (
                <span className="text-success fw-semibold">In Stock ({product.stock} items left)</span>
              ) : (
                <span className="text-danger fw-semibold">Out of Stock</span>
              )}</li>
            </ul>
          </div>

          {/* Cart & Wishlist Actions */}
          {product.stock > 0 && (
            <div className="d-flex align-items-center gap-3 flex-wrap">
              {/* Quantity Select */}
              <div className="d-flex align-items-center border rounded-pill px-2 py-1" style={{ borderColor: 'hsl(var(--border))', backgroundColor: 'hsl(var(--bg-input))' }}>
                <button 
                  disabled={quantity <= 1}
                  onClick={() => setQuantity(q => q - 1)}
                  className="btn btn-link text-decoration-none py-1 px-3 border-0 text-dark fw-bold"
                >-</button>
                <span className="fw-semibold px-2">{quantity}</span>
                <button 
                  disabled={quantity >= product.stock}
                  onClick={() => setQuantity(q => q + 1)}
                  className="btn btn-link text-decoration-none py-1 px-3 border-0 text-dark fw-bold"
                >+</button>
              </div>

              {/* Add to cart */}
              <button 
                onClick={handleAddToCart} 
                className="btn btn-primary-glow px-4 py-2.5 d-flex align-items-center gap-2"
                style={{ height: '46px' }}
              >
                <FaShoppingCart /> Add to Cart
              </button>

              {/* Wishlist */}
              <button 
                onClick={handleWishlistToggle}
                className="btn btn-outline-secondary rounded-pill d-flex align-items-center justify-content-center"
                style={{
                  height: '46px',
                  width: '46px',
                  borderColor: 'hsl(var(--border))',
                  color: isBookmarked ? '#e11d48' : 'inherit',
                  backgroundColor: 'hsl(var(--bg-input))',
                  border: '1px solid hsl(var(--border))'
                }}
              >
                {isBookmarked ? <FaHeart /> : <FaRegHeart />}
              </button>
            </div>
          )}
        </div>
      </div>

      <hr className="my-5" style={{ borderColor: 'hsl(var(--border))' }} />

      {/* Reviews & Submit Form */}
      <div className="row g-5">
        {/* Reviews List */}
        <div className="col-lg-7">
          <h4 className="fw-bold display-font mb-4">Reviews & Comments ({reviews.length})</h4>
          
          <div className="d-flex flex-column gap-3">
            {reviews.map((rev) => (
              <div key={rev._id} className="card border-0 glass-panel p-3 rounded-4">
                <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
                  <div className="d-flex align-items-center gap-2">
                    <img 
                      src={rev.user?.profileImage || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&auto=format&fit=crop&q=60'} 
                      alt="" 
                      className="rounded-circle"
                      style={{ width: '38px', height: '38px', objectFit: 'cover' }}
                    />
                    <div>
                      <h6 className="mb-0 fw-bold">{rev.user?.name || 'Anonymous User'}</h6>
                      <span className="text-muted" style={{ fontSize: '0.75rem' }}>{new Date(rev.createdAt || Date.now()).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="d-flex align-items-center gap-1.5">
                    <div className="d-flex">{renderStars(rev.rating)}</div>
                    
                    {/* Edit/Delete for Review Owner */}
                    {user && rev.user?._id === user._id && (
                      <div className="d-flex gap-1 ms-2">
                        <button onClick={() => handleEditClick(rev)} className="btn btn-link text-primary btn-sm p-1"><FaEdit /></button>
                        <button onClick={() => handleDeleteReview(rev._id)} className="btn btn-link text-danger btn-sm p-1"><FaTrashAlt /></button>
                      </div>
                    )}
                  </div>
                </div>
                <p className="text-muted mt-3 mb-0" style={{ fontSize: '0.9rem', lineHeight: '1.5' }}>{rev.comment}</p>
              </div>
            ))}

            {reviews.length === 0 && (
              <div className="text-center py-4 bg-light rounded-4 border border-light">
                <span className="text-muted">No reviews yet for this product. Be the first to leave one!</span>
              </div>
            )}
          </div>
        </div>

        {/* Submit Review Box */}
        <div className="col-lg-5" id="reviewFormSection">
          <div className="card border-0 glass-panel p-4 rounded-4">
            <h5 className="fw-bold mb-3 display-font">
              {editingReviewId ? 'Modify Your Review' : 'Submit Product Review'}
            </h5>
            
            {user ? (
              userHasReviewed && !editingReviewId ? (
                <div className="alert alert-info py-2 px-3 mb-0" style={{ borderRadius: '10px' }}>
                  You have already reviewed this product. You can update or delete your existing review in the list.
                </div>
              ) : (
                <form onSubmit={handleReviewSubmit}>
                  {/* Rating Selector */}
                  <div className="mb-3">
                    <label className="form-label text-muted fw-semibold" style={{ fontSize: '0.8rem' }}>Your Rating</label>
                    <select 
                      className="form-select custom-input py-2"
                      value={rating}
                      onChange={(e) => setRating(Number(e.target.value))}
                    >
                      <option value="5">5 Stars (Excellent)</option>
                      <option value="4">4 Stars (Good)</option>
                      <option value="3">3 Stars (Average)</option>
                      <option value="2">2 Stars (Poor)</option>
                      <option value="1">1 Star (Very Bad)</option>
                    </select>
                  </div>

                  {/* Comment */}
                  <div className="mb-3">
                    <label className="form-label text-muted fw-semibold" style={{ fontSize: '0.8rem' }}>Review Details</label>
                    <textarea 
                      className="form-control custom-input" 
                      rows="4"
                      placeholder="Share your experience with this item..."
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                    ></textarea>
                  </div>

                  <div className="d-flex gap-2">
                    <button type="submit" className="btn btn-primary-glow w-100 py-2">
                      {editingReviewId ? 'Update Review' : 'Post Review'}
                    </button>
                    {editingReviewId && (
                      <button 
                        type="button" 
                        className="btn btn-outline-secondary w-50 py-2"
                        onClick={() => {
                          setEditingReviewId(null);
                          setComment('');
                          setRating(5);
                        }}
                        style={{ borderRadius: '14px' }}
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </form>
              )
            ) : (
              <div className="text-center py-3">
                <span className="text-muted d-block mb-3" style={{ fontSize: '0.9rem' }}>Please log in to write reviews</span>
                <Link to="/login" className="btn btn-primary-glow px-4 py-2">Login Now</Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Related Products Carousel */}
      {relatedProducts.length > 0 && (
        <div className="mt-5 pt-4">
          <h4 className="fw-bold display-font mb-4">Related Products</h4>
          <div className="row g-4">
            {relatedProducts.map(product => (
              <div key={product._id} className="col-6 col-md-3">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetails;
