import React, { useContext, useState, useEffect } from 'react';
import { useLocation, useNavigate, Navigate } from 'react-router-dom';
import axios from 'axios';
import { FaCreditCard, FaMoneyBillWave, FaLock, FaShoppingBag } from 'react-icons/fa';
import { AuthContext } from '../context/AuthContext.jsx';
import { CartContext } from '../context/CartContext.jsx';
import { ToastContext } from '../context/ToastContext.jsx';
import { formatCurrency } from '../utils/formatCurrency.js';

const Checkout = () => {
  const { user } = useContext(AuthContext);
  const { cartItems, cartSubtotal, shippingCharges, clearCart } = useContext(CartContext);
  const { showToast } = useContext(ToastContext);
  const navigate = useNavigate();
  const location = useLocation();

  // Redirect if not logged in
  if (!user) {
    showToast('Please login to checkout', 'warning');
    return <Navigate to="/login?redirect=checkout" replace />;
  }

  // Redirect if cart is empty
  if (cartItems.length === 0) {
    return <Navigate to="/cart" replace />;
  }

  // Extract coupon discount details from location state
  const discountAmount = location.state?.discountAmount || 0;
  const appliedCoupon = location.state?.appliedCoupon || '';

  // Shipping form states (pre-populated with user details)
  const [shippingAddress, setShippingAddress] = useState({
    street: user.address?.street || '',
    city: user.address?.city || '',
    state: user.address?.state || '',
    zip: user.address?.zip || '',
    country: user.address?.country || '',
  });

  const [paymentMethod, setPaymentMethod] = useState('COD'); // 'COD' or 'Online'

  // Dummy Credit Card fields
  const [cardDetails, setCardDetails] = useState({
    name: user.name || '',
    number: '',
    expiry: '',
    cvv: '',
  });

  const [placingOrder, setPlacingOrder] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShippingAddress((prev) => ({ ...prev, [name]: value }));
  };

  const handleCardChange = (e) => {
    const { name, value } = e.target;
    setCardDetails((prev) => ({ ...prev, [name]: value }));
  };

  const getFinalTotal = () => {
    return cartSubtotal - discountAmount + shippingCharges;
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    // Basic address validation
    const { street, city, state, zip, country } = shippingAddress;
    if (!street || !city || !state || !zip || !country) {
      return showToast('Please complete all shipping address fields', 'warning');
    }

    if (paymentMethod === 'Online') {
      const { name, number, expiry, cvv } = cardDetails;
      if (!name || !number || !expiry || !cvv) {
        return showToast('Please enter your simulated credit card details', 'warning');
      }
    }

    try {
      setPlacingOrder(true);

      const payload = {
        products: cartItems.map((item) => ({
          product: item.product._id,
          quantity: item.quantity,
        })),
        shippingAddress,
        paymentMethod,
        paymentStatus: paymentMethod === 'Online' ? 'Completed' : 'Pending',
      };

      const { data } = await axios.post('/api/orders', payload);

      showToast('Order placed successfully!', 'success');
      
      // Clear cart locally (backend already cleared it in DB)
      setPlacingOrder(false);
      clearCart();

      // Navigate to success screen
      navigate('/payment-success', { state: { orderId: data._id } });

    } catch (error) {
      setPlacingOrder(false);
      showToast(error.response?.data?.message || 'Failed to place order', 'danger');
    }
  };

  return (
    <div className="container py-5">
      <h2 className="display-font fw-bold mb-4">Secure Checkout</h2>

      <form onSubmit={handlePlaceOrder}>
        <div className="row g-4">
          {/* Shipping & Payment Fields */}
          <div className="col-lg-7">
            {/* Address */}
            <div className="card border-0 glass-panel p-4 rounded-4 mb-4">
              <h5 className="fw-bold mb-3 display-font">Shipping Address</h5>
              
              <div className="row g-3">
                <div className="col-12">
                  <label className="form-label text-muted fw-semibold" style={{ fontSize: '0.8rem' }}>Street Address</label>
                  <input 
                    type="text" 
                    name="street"
                    className="form-control custom-input" 
                    value={shippingAddress.street} 
                    onChange={handleInputChange}
                    placeholder="123 Main St"
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label text-muted fw-semibold" style={{ fontSize: '0.8rem' }}>City</label>
                  <input 
                    type="text" 
                    name="city"
                    className="form-control custom-input" 
                    value={shippingAddress.city} 
                    onChange={handleInputChange}
                    placeholder="New York"
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label text-muted fw-semibold" style={{ fontSize: '0.8rem' }}>State / Province</label>
                  <input 
                    type="text" 
                    name="state"
                    className="form-control custom-input" 
                    value={shippingAddress.state} 
                    onChange={handleInputChange}
                    placeholder="NY"
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label text-muted fw-semibold" style={{ fontSize: '0.8rem' }}>Postal Code / PIN</label>
                  <input 
                    type="text" 
                    name="zip"
                    className="form-control custom-input" 
                    value={shippingAddress.zip} 
                    onChange={handleInputChange}
                    placeholder="500001"
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label text-muted fw-semibold" style={{ fontSize: '0.8rem' }}>Country</label>
                  <input 
                    type="text" 
                    name="country"
                    className="form-control custom-input" 
                    value={shippingAddress.country} 
                    onChange={handleInputChange}
                    placeholder="India"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Payment Options */}
            <div className="card border-0 glass-panel p-4 rounded-4">
              <h5 className="fw-bold mb-3 display-font">Payment Method</h5>
              
              <div className="d-flex flex-column gap-3 mb-4">
                {/* COD option */}
                <div 
                  className={`border p-3 rounded-4 cursor-pointer d-flex align-items-center justify-content-between ${paymentMethod === 'COD' ? 'border-primary bg-light' : 'border-light'}`}
                  onClick={() => setPaymentMethod('COD')}
                >
                  <div className="d-flex align-items-center gap-3">
                    <FaMoneyBillWave className="text-success fs-4" />
                    <div>
                      <h6 className="mb-0 fw-bold">Cash on Delivery (COD)</h6>
                      <span className="text-muted" style={{ fontSize: '0.75rem' }}>Pay with cash/UPI when items arrive.</span>
                    </div>
                  </div>
                  <input 
                    type="radio" 
                    name="paymentMethod" 
                    className="form-check-input" 
                    checked={paymentMethod === 'COD'}
                    onChange={() => setPaymentMethod('COD')}
                  />
                </div>

                {/* UPI option */}
                <div 
                  className={`border p-3 rounded-4 cursor-pointer d-flex align-items-center justify-content-between ${paymentMethod === 'UPI' ? 'border-primary bg-light' : 'border-light'}`}
                  onClick={() => setPaymentMethod('UPI')}
                >
                  <div className="d-flex align-items-center gap-3">
                    <FaLock className="text-info fs-4" />
                    <div>
                      <h6 className="mb-0 fw-bold">UPI (GPay, PhonePe, Paytm)</h6>
                      <span className="text-muted" style={{ fontSize: '0.75rem' }}>Instant payment via UPI apps.</span>
                    </div>
                  </div>
                  <input 
                    type="radio" 
                    name="paymentMethod" 
                    className="form-check-input" 
                    checked={paymentMethod === 'UPI'}
                    onChange={() => setPaymentMethod('UPI')}
                  />
                </div>

                {/* Card option */}
                <div 
                  className={`border p-3 rounded-4 cursor-pointer d-flex align-items-center justify-content-between ${(paymentMethod === 'Credit Card' || paymentMethod === 'Debit Card') ? 'border-primary bg-light' : 'border-light'}`}
                  onClick={() => setPaymentMethod('Credit Card')}
                >
                  <div className="d-flex align-items-center gap-3">
                    <FaCreditCard className="text-primary fs-4" />
                    <div>
                      <h6 className="mb-0 fw-bold">Credit / Debit Card</h6>
                      <span className="text-muted" style={{ fontSize: '0.75rem' }}>Simulate instant card transaction checks.</span>
                    </div>
                  </div>
                  <input 
                    type="radio" 
                    name="paymentMethod" 
                    className="form-check-input" 
                    checked={paymentMethod === 'Credit Card' || paymentMethod === 'Debit Card'}
                    onChange={() => setPaymentMethod('Credit Card')}
                  />
                </div>
                
                {/* Net Banking option */}
                <div 
                  className={`border p-3 rounded-4 cursor-pointer d-flex align-items-center justify-content-between ${paymentMethod === 'Net Banking' ? 'border-primary bg-light' : 'border-light'}`}
                  onClick={() => setPaymentMethod('Net Banking')}
                >
                  <div className="d-flex align-items-center gap-3">
                    <FaLock className="text-secondary fs-4" />
                    <div>
                      <h6 className="mb-0 fw-bold">Net Banking</h6>
                      <span className="text-muted" style={{ fontSize: '0.75rem' }}>All major Indian banks supported.</span>
                    </div>
                  </div>
                  <input 
                    type="radio" 
                    name="paymentMethod" 
                    className="form-check-input" 
                    checked={paymentMethod === 'Net Banking'}
                    onChange={() => setPaymentMethod('Net Banking')}
                  />
                </div>
              </div>

              {/* Dummy Card Input Fields */}
              {(paymentMethod === 'Credit Card' || paymentMethod === 'Debit Card') && (
                <div className="bg-light p-3 rounded-4 border border-light animation-fade">
                  <div className="d-flex align-items-center gap-2 mb-3 text-muted" style={{ fontSize: '0.85rem' }}>
                    <FaLock /> <span>Simulated 256-Bit Transaction Port</span>
                  </div>
                  <div className="row g-3">
                    <div className="col-12">
                      <label className="form-label text-muted fw-semibold" style={{ fontSize: '0.75rem' }}>Cardholder Name</label>
                      <input 
                        type="text" 
                        name="name"
                        className="form-control custom-input py-1.5" 
                        value={cardDetails.name} 
                        onChange={handleCardChange}
                        placeholder="John Doe"
                      />
                    </div>
                    <div className="col-12">
                      <label className="form-label text-muted fw-semibold" style={{ fontSize: '0.75rem' }}>Card Number</label>
                      <input 
                        type="text" 
                        name="number"
                        className="form-control custom-input py-1.5" 
                        value={cardDetails.number} 
                        onChange={handleCardChange}
                        placeholder="4111 2222 3333 4444"
                      />
                    </div>
                    <div className="col-6">
                      <label className="form-label text-muted fw-semibold" style={{ fontSize: '0.75rem' }}>Expiry Date</label>
                      <input 
                        type="text" 
                        name="expiry"
                        className="form-control custom-input py-1.5" 
                        value={cardDetails.expiry} 
                        onChange={handleCardChange}
                        placeholder="MM/YY"
                      />
                    </div>
                    <div className="col-6">
                      <label className="form-label text-muted fw-semibold" style={{ fontSize: '0.75rem' }}>CVV</label>
                      <input 
                        type="password" 
                        name="cvv"
                        className="form-control custom-input py-1.5" 
                        value={cardDetails.cvv} 
                        onChange={handleCardChange}
                        placeholder="123"
                        maxLength="3"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Checkout Totals Panel */}
          <div className="col-lg-5">
            <div className="card border-0 glass-panel p-4 rounded-4 position-sticky" style={{ top: '100px' }}>
              <h5 className="fw-bold mb-3 display-font d-flex align-items-center gap-2">
                <FaShoppingBag className="text-primary" /> Order Summary
              </h5>

              {/* Items Summary list */}
              <div className="d-flex flex-column gap-2 mb-4 max-vh-30 overflow-y-auto pr-1">
                {cartItems.map((item) => (
                  <div key={item._id} className="d-flex align-items-center justify-content-between" style={{ fontSize: '0.9rem' }}>
                    <span className="text-muted text-truncate text-capitalize" style={{ maxWidth: '75%' }}>
                      {item.product?.name} <strong className="text-dark">x {item.quantity}</strong>
                    </span>
                    <span className="fw-bold">{formatCurrency(item.totalPrice)}</span>
                  </div>
                ))}
              </div>

              <hr className="my-3" style={{ borderColor: 'hsl(var(--border))' }} />

              {/* Calculation fields */}
              <div className="d-flex flex-column gap-2 mb-4">
                <div className="d-flex align-items-center justify-content-between text-muted" style={{ fontSize: '0.9rem' }}>
                  <span>Subtotal</span>
                  <span>{formatCurrency(cartSubtotal)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="d-flex align-items-center justify-content-between text-success fw-medium" style={{ fontSize: '0.9rem' }}>
                    <span>Promo Discount ({appliedCoupon})</span>
                    <span>-{formatCurrency(discountAmount)}</span>
                  </div>
                )}
                <div className="d-flex align-items-center justify-content-between text-muted" style={{ fontSize: '0.9rem' }}>
                  <span>Shipping Charges</span>
                  <span>{shippingCharges === 0 ? 'FREE' : formatCurrency(shippingCharges)}</span>
                </div>
                <hr className="my-2" style={{ borderColor: 'hsl(var(--border))' }} />
                <div className="d-flex align-items-center justify-content-between fw-bold text-dark fs-5">
                  <span>Total Amount</span>
                  <span>{formatCurrency(getFinalTotal())}</span>
                </div>
              </div>

              {/* Place Order */}
              <button 
                type="submit" 
                className="btn btn-primary-glow w-100 py-3 d-flex align-items-center justify-content-center gap-2 fs-6"
                disabled={placingOrder}
              >
                {placingOrder ? (
                  <div className="spinner-border spinner-border-sm text-light" role="status">
                    <span className="visually-hidden">Placing Order...</span>
                  </div>
                ) : (
                  <>Place Order ({formatCurrency(getFinalTotal())})</>
                )}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Checkout;
