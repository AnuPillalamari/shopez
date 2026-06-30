import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaTrashAlt, FaShoppingCart, FaArrowRight, FaTicketAlt } from 'react-icons/fa';
import { CartContext } from '../context/CartContext.jsx';
import { ToastContext } from '../context/ToastContext.jsx';
import { formatCurrency } from '../utils/formatCurrency.js';

const Cart = () => {
  const { 
    cartItems, 
    updateQuantity, 
    removeFromCart, 
    cartSubtotal, 
    shippingCharges, 
    grandTotal 
  } = useContext(CartContext);
  const { showToast } = useContext(ToastContext);
  const navigate = useNavigate();

  // Coupon Simulator States
  const [couponCode, setCouponCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (couponCode.toUpperCase() === 'EZDEAL20') {
      setDiscountPercent(20);
      showToast('Coupon code applied: 20% discount!', 'success');
    } else {
      showToast('Invalid coupon code. Try: EZDEAL20', 'warning');
    }
  };

  const getDiscountAmount = () => {
    return (cartSubtotal * discountPercent) / 100;
  };

  const getFinalTotal = () => {
    return cartSubtotal - getDiscountAmount() + shippingCharges;
  };

  const handleProceedToCheckout = () => {
    // Navigate passing discount info in state
    navigate('/checkout', { 
      state: { 
        appliedCoupon: discountPercent > 0 ? 'EZDEAL20' : '',
        discountAmount: getDiscountAmount()
      } 
    });
  };

  if (cartItems.length === 0) {
    return (
      <div className="container py-5 text-center my-5">
        <div className="glass-panel p-5 rounded-4 d-inline-block" style={{ maxWidth: '500px' }}>
          <FaShoppingCart className="text-muted display-1 mb-4" style={{ opacity: 0.2 }} />
          <h3 className="fw-bold display-font">Your Cart is Empty</h3>
          <p className="text-muted mb-4">Looks like you haven't added any products to your cart yet.</p>
          <Link to="/products" className="btn btn-primary-glow px-4 py-2">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <h2 className="display-font fw-bold mb-4">Shopping Cart ({cartItems.length} items)</h2>

      <div className="row g-4">
        {/* Items List */}
        <div className="col-lg-8">
          <div className="d-flex flex-column gap-3">
            {cartItems.map((item) => (
              <div key={item._id} className="card border-0 glass-panel p-3 rounded-4">
                <div className="row align-items-center g-3">
                  {/* Thumbnail */}
                  <div className="col-3 col-sm-2">
                    <div className="bg-light rounded-3 overflow-hidden d-flex align-items-center justify-content-center" style={{ height: '70px', width: '70px' }}>
                      <img 
                        src={item.product?.images[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100&auto=format&fit=crop&q=60'} 
                        alt="" 
                        className="img-fluid"
                        style={{ maxHeight: '100%', objectFit: 'contain' }}
                      />
                    </div>
                  </div>

                  {/* Name and Brand */}
                  <div className="col-9 col-sm-4">
                    <h6 className="fw-bold mb-0 text-truncate text-capitalize">
                      <Link to={`/product/${item.product?._id}`} className="text-decoration-none text-dark">
                        {item.product?.name}
                      </Link>
                    </h6>
                    <span className="text-muted text-uppercase fw-bold" style={{ fontSize: '0.75rem' }}>{item.product?.brand}</span>
                  </div>

                  {/* Quantity adjustment */}
                  <div className="col-6 col-sm-3 d-flex align-items-center justify-content-start justify-content-sm-center">
                    <div className="d-flex align-items-center border rounded-pill px-2 py-0.5 bg-light">
                      <button 
                        onClick={() => updateQuantity(item._id, item.quantity - 1)}
                        className="btn btn-link py-0 px-2 text-decoration-none text-dark fw-bold"
                        disabled={item.quantity <= 1}
                      >-</button>
                      <span className="fw-semibold px-2" style={{ fontSize: '0.9rem' }}>{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item._id, item.quantity + 1)}
                        className="btn btn-link py-0 px-2 text-decoration-none text-dark fw-bold"
                        disabled={item.quantity >= item.product?.stock}
                      >+</button>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="col-4 col-sm-2 text-end text-sm-center">
                    <span className="fw-bold" style={{ fontSize: '1.05rem' }}>
                      {formatCurrency(item.totalPrice)}
                    </span>
                  </div>

                  {/* Remove action */}
                  <div className="col-2 col-sm-1 text-end">
                    <button 
                      onClick={() => removeFromCart(item._id)}
                      className="btn btn-link text-danger p-2"
                      title="Remove Item"
                    >
                      <FaTrashAlt />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Summary Panel */}
        <div className="col-lg-4">
          <div className="card border-0 glass-panel p-4 rounded-4 position-sticky" style={{ top: '100px' }}>
            <h5 className="fw-bold mb-4 display-font">Order Summary</h5>

            {/* Price Calculations */}
            <div className="d-flex flex-column gap-2 mb-4 fs-6">
              <div className="d-flex align-items-center justify-content-between text-muted">
                <span>Subtotal</span>
                <span>{formatCurrency(cartSubtotal)}</span>
              </div>
              {discountPercent > 0 && (
                <div className="d-flex align-items-center justify-content-between text-success fw-medium">
                  <span>Discount (EZDEAL20)</span>
                  <span>-{formatCurrency(getDiscountAmount())}</span>
                </div>
              )}
              <div className="d-flex align-items-center justify-content-between text-muted">
                <span>Shipping Charges</span>
                <span>{shippingCharges === 0 ? 'FREE' : formatCurrency(shippingCharges)}</span>
              </div>
              <div className="text-muted" style={{ fontSize: '0.75rem', marginTop: '-4px' }}>
                (Free shipping on orders above ₹999)
              </div>
              <hr className="my-2" style={{ borderColor: 'hsl(var(--border))' }} />
              <div className="d-flex align-items-center justify-content-between fw-bold text-dark fs-5">
                <span>Grand Total</span>
                <span>{formatCurrency(getFinalTotal())}</span>
              </div>
            </div>

            {/* Coupon input */}
            <form onSubmit={handleApplyCoupon} className="mb-4">
              <label className="form-label text-muted fw-semibold" style={{ fontSize: '0.8rem' }}>Promo Code</label>
              <div className="input-group">
                <input 
                  type="text" 
                  className="form-control custom-input py-2" 
                  placeholder="Code (e.g. EZDEAL20)" 
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  style={{ fontSize: '0.85rem', borderTopRightRadius: 0, borderBottomRightRadius: 0 }}
                />
                <button 
                  className="btn btn-outline-secondary d-flex align-items-center justify-content-center px-3" 
                  type="submit"
                  style={{ 
                    borderTopLeftRadius: 0, 
                    borderBottomLeftRadius: 0,
                    borderColor: 'hsl(var(--border))',
                    backgroundColor: 'hsl(var(--bg-input))'
                  }}
                >
                  <FaTicketAlt />
                </button>
              </div>
            </form>

            {/* Proceed */}
            <button 
              onClick={handleProceedToCheckout}
              className="btn btn-primary-glow w-100 py-2.5 d-flex align-items-center justify-content-center gap-2"
            >
              Proceed to Checkout <FaArrowRight />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
