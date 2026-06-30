import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FaClipboardList, FaEye, FaCalendarAlt, FaMoneyBillAlt } from 'react-icons/fa';
import { AuthContext } from '../context/AuthContext.jsx';
import { ToastContext } from '../context/ToastContext.jsx';
import { formatCurrency } from '../utils/formatCurrency.js';

const OrderHistory = () => {
  const { user } = useContext(AuthContext);
  const { showToast } = useContext(ToastContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get('/api/orders/myorders');
        setOrders(data);
      } catch (err) {
        console.error('Error fetching order history:', err.message);
        showToast('Failed to load orders', 'danger');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchOrders();
    }
  }, [user]);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Processing': return 'bg-primary';
      case 'Shipped': return 'bg-info text-dark';
      case 'Delivered': return 'bg-success';
      case 'Cancelled': return 'bg-danger';
      default: return 'bg-secondary';
    }
  };

  if (loading) {
    return (
      <div className="container py-5">
        <h2 className="display-font fw-bold mb-4">My Orders</h2>
        <div className="skeleton" style={{ height: '80px', marginBottom: '15px' }}></div>
        <div className="skeleton" style={{ height: '80px', marginBottom: '15px' }}></div>
        <div className="skeleton" style={{ height: '80px' }}></div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <h2 className="display-font fw-bold mb-4">Order History</h2>

      {orders.length === 0 ? (
        <div className="text-center py-5 glass-panel rounded-4">
          <FaClipboardList className="text-muted display-2 mb-3" style={{ opacity: 0.2 }} />
          <h4 className="fw-bold display-font">No Orders Placed Yet</h4>
          <p className="text-muted mb-4">Once you check out products, your orders will appear here.</p>
          <Link to="/products" className="btn btn-primary-glow px-4 py-2">Start Shopping</Link>
        </div>
      ) : (
        <div className="d-flex flex-column gap-3">
          {orders.map((order) => (
            <div key={order._id} className="card border-0 glass-panel p-4 rounded-4 custom-card">
              <div className="row align-items-center g-3">
                {/* ID & Date */}
                <div className="col-md-4">
                  <span className="text-muted d-block" style={{ fontSize: '0.75rem', fontWeight: 600 }}>ORDER REFERENCE</span>
                  <code className="text-dark fw-bold d-block mb-2">{order._id}</code>
                  
                  <span className="text-muted d-flex align-items-center gap-1.5" style={{ fontSize: '0.85rem' }}>
                    <FaCalendarAlt className="text-primary" />
                    {new Date(order.orderDate || order.createdAt).toLocaleDateString('en-IN', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </span>
                </div>

                {/* Items previews thumbnails */}
                <div className="col-md-3">
                  <span className="text-muted d-block mb-1.5" style={{ fontSize: '0.75rem', fontWeight: 600 }}>PRODUCTS</span>
                  <div className="d-flex gap-1.5 flex-wrap">
                    {order.products.slice(0, 3).map((item, idx) => (
                      <div 
                        key={idx} 
                        className="bg-light rounded-2 border" 
                        style={{ width: '40px', height: '40px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        title={item.product?.name}
                      >
                        <img 
                          src={item.product?.images?.[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=50&auto=format&fit=crop&q=60'} 
                          alt="" 
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      </div>
                    ))}
                    {order.products.length > 3 && (
                      <div 
                        className="bg-light rounded-2 border d-flex align-items-center justify-content-center fw-bold text-muted" 
                        style={{ width: '40px', height: '40px', fontSize: '0.75rem' }}
                      >
                        +{order.products.length - 3}
                      </div>
                    )}
                  </div>
                </div>

                {/* Amount & Status */}
                <div className="col-md-3">
                  <div className="d-flex justify-content-between align-items-center d-md-block">
                    <div className="mb-2">
                      <span className="text-muted d-block d-md-inline me-1" style={{ fontSize: '0.75rem', fontWeight: 600 }}>TOTAL BILL:</span>
                      <span className="fw-extrabold text-dark fs-5">{formatCurrency(order.totalAmount)}</span>
                    </div>
                    <div>
                      <span className={`badge rounded-pill px-3 py-1.5 text-uppercase fw-semibold ${getStatusBadge(order.orderStatus)}`} style={{ fontSize: '0.7rem', letterSpacing: '0.05em' }}>
                        {order.orderStatus}
                      </span>
                    </div>
                  </div>
                </div>

                {/* View Button */}
                <div className="col-md-2 text-md-end">
                  <Link to={`/orders/${order._id}`} className="btn btn-outline-primary d-flex d-md-inline-flex align-items-center justify-content-center gap-2 py-2 px-3" style={{ borderRadius: '10px' }}>
                    <FaEye /> View Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderHistory;
