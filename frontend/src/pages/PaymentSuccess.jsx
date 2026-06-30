import React from 'react';
import { Link, useLocation, Navigate } from 'react-router-dom';
import { FaCheckCircle, FaClipboardList, FaShoppingBag } from 'react-icons/fa';

const PaymentSuccess = () => {
  const location = useLocation();
  const orderId = location.state?.orderId;

  // Protect Success page from direct random navigations without orderId
  if (!orderId) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="container py-5 text-center my-5">
      <div className="card border-0 glass-panel p-5 rounded-4 d-inline-block shadow-lg" style={{ maxWidth: '550px' }}>
        <FaCheckCircle className="text-success display-1 mb-4 animate-scale" style={{ fontSize: '5.5rem' }} />
        
        <h2 className="display-font fw-bold text-dark mb-2">Order Placed Successfully!</h2>
        <p className="text-muted fs-6 mb-4">
          Thank you for shopping with ShopEZ. Your order has been registered and is currently being processed.
        </p>

        {/* Order Receipt Code Card */}
        <div className="bg-light p-3 rounded-4 mb-4 border border-light text-center">
          <span className="text-muted d-block mb-1" style={{ fontSize: '0.8rem', fontWeight: 600, letterSpacing: '0.05em' }}>ORDER REFERENCE ID</span>
          <code className="text-primary fw-bold fs-6 select-all d-block">{orderId}</code>
        </div>

        <div className="d-flex flex-column gap-3 sm-flex-row justify-content-center">
          <Link to={`/orders/${orderId}`} className="btn btn-primary-glow py-2.5 d-flex align-items-center justify-content-center gap-2">
            <FaClipboardList /> Track Order Status
          </Link>
          
          <div className="d-flex gap-2">
            <Link to="/orders" className="btn btn-outline-secondary w-50 py-2.5" style={{ borderRadius: '14px' }}>
              Order History
            </Link>
            <Link to="/products" className="btn btn-dark-glow w-50 py-2.5">
              <FaShoppingBag /> Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
