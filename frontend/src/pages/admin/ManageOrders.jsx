import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { FaEye } from 'react-icons/fa';
import { ToastContext } from '../../context/ToastContext.jsx';
import { formatCurrency } from '../../utils/formatCurrency.js';

const STATUS_OPTIONS = ['Processing', 'Shipped', 'Delivered', 'Cancelled'];

const getStatusBadge = (status) => {
  const map = { Processing: 'bg-primary', Shipped: 'bg-info text-dark', Delivered: 'bg-success', Cancelled: 'bg-danger' };
  return map[status] || 'bg-secondary';
};

const ManageOrders = () => {
  const { showToast } = useContext(ToastContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get('/api/admin/orders');
      setOrders(data);
    } catch (err) {
      showToast('Failed to load orders', 'danger');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOrders(); }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    setUpdatingId(orderId);
    try {
      const { data } = await axios.put(`/api/admin/orders/${orderId}/status`, { orderStatus: newStatus });
      setOrders(prev => prev.map(o => o._id === orderId ? { ...o, orderStatus: data.orderStatus, paymentStatus: data.paymentStatus } : o));
      showToast(`Order status updated to ${newStatus}`, 'success');
    } catch (err) {
      showToast(err.response?.data?.message || 'Update failed', 'danger');
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div>
      <div className="mb-4">
        <h3 className="display-font fw-bold mb-0">Manage Orders</h3>
        <span className="text-muted">{orders.length} total orders</span>
      </div>

      <div className="card border-0 glass-panel rounded-4 overflow-hidden">
        {loading ? (
          <div className="p-4">
            {[1,2,3,4].map(n => <div key={n} className="skeleton mb-3" style={{ height: '60px' }}></div>)}
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table align-middle mb-0" style={{ fontSize: '0.85rem' }}>
              <thead style={{ backgroundColor: 'hsl(var(--bg-input))' }}>
                <tr className="text-muted text-uppercase border-bottom" style={{ fontSize: '0.7rem' }}>
                  <th className="py-3 px-4 fw-semibold">Order ID</th>
                  <th className="py-3 fw-semibold">Customer</th>
                  <th className="py-3 fw-semibold">Date</th>
                  <th className="py-3 fw-semibold">Total</th>
                  <th className="py-3 fw-semibold">Payment</th>
                  <th className="py-3 fw-semibold">Status</th>
                  <th className="py-3 pe-4 fw-semibold text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(order => (
                  <tr key={order._id} className="border-bottom border-light">
                    <td className="py-3 px-4">
                      <code style={{ fontSize: '0.78rem' }}>{order._id.slice(-10)}</code>
                    </td>
                    <td className="py-3">
                      <span className="fw-medium d-block">{order.user?.name}</span>
                      <span className="text-muted" style={{ fontSize: '0.75rem' }}>{order.user?.email}</span>
                    </td>
                    <td className="py-3 text-muted">
                      {new Date(order.createdAt).toLocaleDateString('en-IN')}
                    </td>
                    <td className="py-3 fw-bold">{formatCurrency(order.totalAmount)}</td>
                    <td className="py-3">
                      <span className={`badge rounded-pill px-2 py-1 ${order.paymentStatus === 'Completed' ? 'bg-success' : order.paymentStatus === 'Failed' ? 'bg-danger' : 'bg-warning text-dark'}`} style={{ fontSize: '0.65rem' }}>
                        {order.paymentStatus}
                      </span>
                    </td>
                    <td className="py-3">
                      <select
                        className="form-select form-select-sm custom-input py-1"
                        value={order.orderStatus}
                        onChange={e => handleStatusChange(order._id, e.target.value)}
                        disabled={updatingId === order._id}
                        style={{ width: '130px', fontSize: '0.8rem', borderRadius: '8px' }}
                      >
                        {STATUS_OPTIONS.map(s => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </td>
                    <td className="py-3 pe-4 text-end">
                      <a href={`/orders/${order._id}`} target="_blank" rel="noreferrer" className="btn btn-outline-secondary btn-sm d-inline-flex align-items-center gap-1 px-2 py-1" style={{ borderRadius: '8px', fontSize: '0.78rem' }}>
                        <FaEye /> View
                      </a>
                    </td>
                  </tr>
                ))}
                {orders.length === 0 && (
                  <tr><td colSpan="7" className="text-center py-5 text-muted">No orders yet</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageOrders;
