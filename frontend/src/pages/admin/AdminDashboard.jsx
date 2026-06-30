import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Bar, Line, Doughnut } from 'react-chartjs-2';
import { FaUsers, FaBox, FaClipboardList, FaRupeeSign, FaExclamationTriangle } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { formatCurrency } from '../../utils/formatCurrency.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, ArcElement, Title, Tooltip, Legend, Filler);

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const getStatusBadge = (status) => {
  const map = {
    Processing: 'bg-primary',
    Shipped: 'bg-info text-dark',
    Delivered: 'bg-success',
    Cancelled: 'bg-danger',
  };
  return map[status] || 'bg-secondary';
};

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [statsRes, analyticsRes] = await Promise.all([
          axios.get('/api/admin/stats'),
          axios.get('/api/admin/analytics'),
        ]);
        setStats(statsRes.data);
        setAnalytics(analyticsRes.data);
      } catch (err) {
        console.error('Error fetching admin dashboard data:', err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div>
        <div className="skeleton mb-4" style={{ height: '40px', width: '200px' }}></div>
        <div className="row g-4 mb-4">
          {[1, 2, 3, 4].map(n => (
            <div key={n} className="col-md-3">
              <div className="skeleton" style={{ height: '100px' }}></div>
            </div>
          ))}
        </div>
        <div className="row g-4">
          <div className="col-md-8"><div className="skeleton" style={{ height: '300px' }}></div></div>
          <div className="col-md-4"><div className="skeleton" style={{ height: '300px' }}></div></div>
        </div>
      </div>
    );
  }

  // Build monthly revenue chart data
  const revenueLabels = analytics?.monthlySales?.map(d => `${MONTH_NAMES[d._id.month - 1]} ${d._id.year}`) || [];
  const revenueData = analytics?.monthlySales?.map(d => d.revenue) || [];
  const ordersData = analytics?.monthlySales?.map(d => d.count) || [];

  const revenueChartData = {
    labels: revenueLabels,
    datasets: [
      {
        label: 'Revenue (₹)',
        data: revenueData,
        backgroundColor: 'rgba(79, 70, 229, 0.15)',
        borderColor: 'rgba(79, 70, 229, 1)',
        borderWidth: 2,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: 'rgba(79, 70, 229, 1)',
      },
    ],
  };

  const ordersChartData = {
    labels: revenueLabels,
    datasets: [
      {
        label: 'Orders',
        data: ordersData,
        backgroundColor: 'rgba(147, 51, 234, 0.7)',
        borderRadius: 8,
        borderSkipped: false,
      },
    ],
  };

  // Category Doughnut
  const catLabels = analytics?.categoriesShare?.map(c => c.categoryName) || [];
  const catCounts = analytics?.categoriesShare?.map(c => c.count) || [];
  const doughnutData = {
    labels: catLabels,
    datasets: [
      {
        data: catCounts,
        backgroundColor: [
          '#4f46e5', '#9333ea', '#06b6d4', '#10b981', '#f59e0b', '#ef4444',
          '#8b5cf6', '#ec4899', '#14b8a6', '#f97316',
        ],
        borderWidth: 2,
        borderColor: 'hsl(var(--bg-card))',
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: { legend: { display: false } },
    scales: {
      x: { grid: { display: false } },
      y: { grid: { color: 'rgba(0,0,0,0.05)' } },
    },
  };

  return (
    <div>
      <div className="mb-4">
        <h3 className="display-font fw-bold mb-0">Dashboard Overview</h3>
        <span className="text-muted">Welcome back, Admin! Here's what's happening today.</span>
      </div>

      {/* Stat Cards */}
      <div className="row g-3 mb-5">
        {[
          { label: 'Total Users', value: stats?.totalUsers || 0, icon: FaUsers, color: 'text-primary', bg: 'rgba(79,70,229,0.1)' },
          { label: 'Total Products', value: stats?.totalProducts || 0, icon: FaBox, color: 'text-success', bg: 'rgba(16,185,129,0.1)' },
          { label: 'Total Orders', value: stats?.totalOrders || 0, icon: FaClipboardList, color: 'text-warning', bg: 'rgba(245,158,11,0.1)' },
          { label: 'Total Revenue', value: formatCurrency(stats?.totalRevenue || 0), icon: FaRupeeSign, color: 'text-danger', bg: 'rgba(239,68,68,0.1)' },
        ].map((card, idx) => (
          <div key={idx} className="col-6 col-xl-3">
            <div className="card border-0 glass-panel p-4 rounded-4 h-100">
              <div className="d-flex align-items-center justify-content-between">
                <div>
                  <span className="text-muted text-uppercase fw-semibold d-block mb-1" style={{ fontSize: '0.7rem', letterSpacing: '0.08em' }}>{card.label}</span>
                  <h3 className="fw-extrabold display-font mb-0">{card.value}</h3>
                </div>
                <div className="rounded-3 p-3" style={{ backgroundColor: card.bg }}>
                  <card.icon className={`${card.color} fs-3`} />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="row g-4 mb-5">
        {/* Revenue Line Chart */}
        <div className="col-lg-8">
          <div className="card border-0 glass-panel p-4 rounded-4 h-100">
            <h6 className="fw-bold mb-4 display-font">Monthly Revenue Trend</h6>
            <Line data={revenueChartData} options={chartOptions} />
          </div>
        </div>

        {/* Category Doughnut */}
        <div className="col-lg-4">
          <div className="card border-0 glass-panel p-4 rounded-4 h-100">
            <h6 className="fw-bold mb-4 display-font">Products by Category</h6>
            {catCounts.length > 0 ? (
              <div style={{ maxHeight: '260px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Doughnut data={doughnutData} options={{ responsive: true, plugins: { legend: { position: 'bottom', labels: { boxWidth: 12, font: { size: 11 } } } } }} />
              </div>
            ) : (
              <div className="text-center text-muted py-5">No category data available</div>
            )}
          </div>
        </div>
      </div>

      {/* Orders Bar Chart */}
      <div className="row g-4 mb-5">
        <div className="col-lg-7">
          <div className="card border-0 glass-panel p-4 rounded-4 h-100">
            <h6 className="fw-bold mb-4 display-font">Monthly Orders Volume</h6>
            <Bar data={ordersChartData} options={chartOptions} />
          </div>
        </div>

        {/* Low Stock Alert */}
        <div className="col-lg-5">
          <div className="card border-0 glass-panel p-4 rounded-4 h-100">
            <h6 className="fw-bold mb-3 display-font d-flex align-items-center gap-2">
              <FaExclamationTriangle className="text-warning" /> Low Stock Alerts
            </h6>
            {analytics?.lowStockProducts?.length === 0 ? (
              <div className="text-center text-muted py-4">No low stock items found 🎉</div>
            ) : (
              <div className="d-flex flex-column gap-2" style={{ maxHeight: '250px', overflowY: 'auto' }}>
                {analytics?.lowStockProducts?.map(prod => (
                  <div key={prod._id} className="d-flex align-items-center justify-content-between p-2 bg-light rounded-3">
                    <div>
                      <span className="fw-semibold d-block text-truncate text-capitalize" style={{ fontSize: '0.85rem', maxWidth: '160px' }}>{prod.name}</span>
                      <span className="text-muted text-uppercase" style={{ fontSize: '0.7rem' }}>{prod.brand}</span>
                    </div>
                    <span className={`badge rounded-pill px-2 py-1 fw-bold ${prod.stock === 0 ? 'bg-danger' : 'bg-warning text-dark'}`} style={{ fontSize: '0.75rem' }}>
                      {prod.stock} left
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recent Orders & Recent Users */}
      <div className="row g-4">
        {/* Latest Orders */}
        <div className="col-lg-7">
          <div className="card border-0 glass-panel p-4 rounded-4">
            <div className="d-flex align-items-center justify-content-between mb-3">
              <h6 className="fw-bold display-font mb-0">Latest Orders</h6>
              <Link to="/admin/orders" className="btn btn-link btn-sm text-primary p-0 text-decoration-none fw-semibold" style={{ fontSize: '0.85rem' }}>View All →</Link>
            </div>
            <div className="table-responsive">
              <table className="table table-sm align-middle" style={{ fontSize: '0.85rem' }}>
                <thead>
                  <tr className="text-muted text-uppercase border-bottom" style={{ fontSize: '0.7rem' }}>
                    <th className="fw-semibold pb-2">Order ID</th>
                    <th className="fw-semibold pb-2">Customer</th>
                    <th className="fw-semibold pb-2">Amount</th>
                    <th className="fw-semibold pb-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {stats?.latestOrders?.map(order => (
                    <tr key={order._id} className="border-bottom border-light">
                      <td><code style={{ fontSize: '0.78rem' }}>{order._id.slice(-8)}</code></td>
                      <td className="fw-medium">{order.user?.name}</td>
                      <td className="fw-bold">{formatCurrency(order.totalAmount)}</td>
                      <td><span className={`badge rounded-pill px-2 py-1 ${getStatusBadge(order.orderStatus)}`} style={{ fontSize: '0.65rem' }}>{order.orderStatus}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Recent Users */}
        <div className="col-lg-5">
          <div className="card border-0 glass-panel p-4 rounded-4">
            <div className="d-flex align-items-center justify-content-between mb-3">
              <h6 className="fw-bold display-font mb-0">Recent Users</h6>
              <Link to="/admin/users" className="btn btn-link btn-sm text-primary p-0 text-decoration-none fw-semibold" style={{ fontSize: '0.85rem' }}>View All →</Link>
            </div>
            <div className="d-flex flex-column gap-2">
              {stats?.recentUsers?.map(u => (
                <div key={u._id} className="d-flex align-items-center gap-2">
                  <img
                    src={u.profileImage || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=60&auto=format&fit=crop&q=60'}
                    alt=""
                    className="rounded-circle border"
                    style={{ width: '36px', height: '36px', objectFit: 'cover', flexShrink: 0 }}
                  />
                  <div style={{ minWidth: 0 }}>
                    <span className="fw-semibold d-block text-truncate" style={{ fontSize: '0.88rem' }}>{u.name}</span>
                    <span className="text-muted text-truncate d-block" style={{ fontSize: '0.75rem' }}>{u.email}</span>
                  </div>
                  <span className={`badge ms-auto rounded-pill px-2 py-1 flex-shrink-0 ${u.role === 'admin' ? 'bg-primary' : 'bg-secondary'}`} style={{ fontSize: '0.65rem' }}>{u.role}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
