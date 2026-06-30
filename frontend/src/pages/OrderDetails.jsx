import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { 
  FaArrowLeft, 
  FaBoxOpen, 
  FaTruck, 
  FaCheckCircle, 
  FaTimesCircle,
  FaMapMarkerAlt,
  FaCreditCard
} from 'react-icons/fa';
import { ToastContext } from '../context/ToastContext.jsx';
import { formatCurrency } from '../utils/formatCurrency.js';

const OrderDetails = () => {
  const { id } = useParams();
  const { showToast } = useContext(ToastContext);
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(`/api/orders/${id}`);
        setOrder(data);
      } catch (err) {
        console.error('Error fetching order details:', err.message);
        showToast('Failed to load order details', 'danger');
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [id]);

  const getStepClass = (stepName) => {
    if (!order) return 'text-muted';
    const status = order.orderStatus;

    const steps = ['Processing', 'Shipped', 'Delivered'];
    const currentIdx = steps.indexOf(status);
    const targetIdx = steps.indexOf(stepName);

    if (status === 'Cancelled') {
      return 'text-muted';
    }

    if (currentIdx >= targetIdx) {
      return currentIdx === targetIdx ? 'active completed text-primary fw-bold' : 'completed text-success';
    }
    return 'text-muted';
  };

  if (loading) {
    return (
      <div className="container py-5">
        <div className="skeleton mb-3" style={{ height: '40px', width: '30%' }}></div>
        <div className="skeleton mb-4" style={{ height: '120px' }}></div>
        <div className="row g-4">
          <div className="col-md-7"><div className="skeleton" style={{ height: '250px' }}></div></div>
          <div className="col-md-5"><div className="skeleton" style={{ height: '250px' }}></div></div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container py-5 text-center">
        <h4 className="display-font fw-bold">Order Details Not Found</h4>
        <Link to="/orders" className="btn btn-primary-glow mt-3">
          <FaArrowLeft className="me-2" /> Back to History
        </Link>
      </div>
    );
  }

  const isCancelled = order.orderStatus === 'Cancelled';

  return (
    <div className="container py-5">
      {/* Header action */}
      <div className="d-flex align-items-center justify-content-between mb-4 flex-wrap gap-2">
        <div>
          <Link to="/orders" className="btn btn-link text-decoration-none text-muted p-0 d-flex align-items-center gap-2 mb-2">
            <FaArrowLeft /> Back to Order History
          </Link>
          <h3 className="display-font fw-bold mb-0">Order Details</h3>
          <span className="text-muted" style={{ fontSize: '0.85rem' }}>Placed on {new Date(order.createdAt).toLocaleString()}</span>
        </div>
        <div>
          <code className="bg-light px-3 py-2 border rounded text-dark fw-bold select-all">{order._id}</code>
        </div>
      </div>

      {/* 1. Progress Timeline Tracker */}
      <div className="card border-0 glass-panel p-4 rounded-4 mb-4">
        {isCancelled ? (
          <div className="d-flex align-items-center gap-3 text-danger">
            <FaTimesCircle className="fs-1" />
            <div>
              <h5 className="fw-bold mb-1">Order Cancelled</h5>
              <p className="text-muted mb-0" style={{ fontSize: '0.9rem' }}>This order was cancelled by the administrator and product stock has been restored.</p>
            </div>
          </div>
        ) : (
          <div className="row justify-content-around text-center g-3">
            {/* Step 1 */}
            <div className={`col-4 timeline-item ${getStepClass('Processing')}`}>
              <div className="d-flex flex-column align-items-center">
                <FaBoxOpen className="fs-3 mb-2" />
                <span style={{ fontSize: '0.9rem' }}>Processing</span>
              </div>
            </div>

            {/* Step 2 */}
            <div className={`col-4 timeline-item ${getStepClass('Shipped')}`}>
              <div className="d-flex flex-column align-items-center">
                <FaTruck className="fs-3 mb-2" />
                <span style={{ fontSize: '0.9rem' }}>Shipped</span>
              </div>
            </div>

            {/* Step 3 */}
            <div className={`col-4 timeline-item ${getStepClass('Delivered')}`}>
              <div className="d-flex flex-column align-items-center">
                <FaCheckCircle className="fs-3 mb-2" />
                <span style={{ fontSize: '0.9rem' }}>Delivered</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 2. Content Info panels */}
      <div className="row g-4">
        {/* Left Column: Shipment & Payments */}
        <div className="col-lg-6">
          <div className="card border-0 glass-panel p-4 rounded-4 h-100">
            {/* Shipment address */}
            <div className="mb-4">
              <h6 className="fw-bold d-flex align-items-center gap-2 mb-3">
                <FaMapMarkerAlt className="text-primary" /> Shipping Destination
              </h6>
              <div className="text-muted bg-light p-3 rounded-4" style={{ fontSize: '0.9rem', lineHeight: '1.6', border: '1px solid hsl(var(--border))' }}>
                <strong className="text-dark d-block mb-1">{order.user?.name}</strong>
                <span>{order.shippingAddress.street}</span><br />
                <span>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zip}</span><br />
                <span>{order.shippingAddress.country}</span>
              </div>
            </div>

            {/* Payment details */}
            <div>
              <h6 className="fw-bold d-flex align-items-center gap-2 mb-3">
                <FaCreditCard className="text-primary" /> Payment Summary
              </h6>
              <ul className="list-unstyled mb-0 d-flex flex-column gap-2 text-muted" style={{ fontSize: '0.9rem' }}>
                <li className="d-flex justify-content-between">
                  <span>Payment Method:</span>
                  <strong className="text-dark">{order.paymentMethod === 'COD' ? 'Cash on Delivery' : 'Online Payment'}</strong>
                </li>
                <li className="d-flex justify-content-between">
                  <span>Payment Status:</span>
                  <span className={`badge rounded-pill px-2.5 py-1 ${
                    order.paymentStatus === 'Completed' ? 'bg-success' : order.paymentStatus === 'Failed' ? 'bg-danger' : 'bg-warning text-dark'
                  }`} style={{ fontSize: '0.7rem' }}>{order.paymentStatus}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Right Column: Order Items */}
        <div className="col-lg-6">
          <div className="card border-0 glass-panel p-4 rounded-4 h-100">
            <h6 className="fw-bold mb-3">Ordered Items</h6>

            <div className="d-flex flex-column gap-3 mb-4 max-vh-30 overflow-y-auto pr-1">
              {order.products.map((item, idx) => (
                <div key={idx} className="d-flex align-items-center justify-content-between g-2">
                  <div className="d-flex align-items-center gap-2 text-truncate" style={{ maxWidth: '75%' }}>
                    <div className="bg-light rounded overflow-hidden d-flex align-items-center justify-content-center" style={{ width: '45px', height: '45px', flexShrink: 0 }}>
                      <img src={item.product?.images?.[0]} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                    <div className="text-truncate">
                      <span className="d-block fw-bold text-truncate text-capitalize" style={{ fontSize: '0.9rem' }}>{item.product?.name}</span>
                      <span className="text-muted" style={{ fontSize: '0.75rem' }}>Qty: {item.quantity} &times; {formatCurrency(item.price)}</span>
                    </div>
                  </div>
                  <span className="fw-bold" style={{ fontSize: '0.95rem' }}>
                    {formatCurrency(item.quantity * item.price)}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-top border-light pt-3">
              <div className="d-flex justify-content-between fw-bold text-dark fs-5">
                <span>Total Bill Amount</span>
                <span>{formatCurrency(order.totalAmount)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
