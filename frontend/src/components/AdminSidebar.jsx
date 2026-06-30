import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { 
  FaChartLine, 
  FaBox, 
  FaTags, 
  FaClipboardList, 
  FaUsers, 
  FaArrowLeft,
  FaUserShield
} from 'react-icons/fa';

const AdminSidebar = () => {
  return (
    <div className="admin-sidebar d-flex flex-column p-3 h-100 shadow-sm">
      <div className="d-flex align-items-center gap-2 mb-4 px-2">
        <FaUserShield className="text-primary fs-3" />
        <div>
          <h5 className="mb-0 fw-bold display-font">ShopEZ</h5>
          <span className="badge bg-primary rounded-pill text-uppercase" style={{ fontSize: '0.6rem', letterSpacing: '0.05em' }}>Admin Panel</span>
        </div>
      </div>

      <ul className="nav nav-pills flex-column mb-auto">
        <li className="nav-item">
          <NavLink to="/admin" end className="nav-link d-flex align-items-center gap-3">
            <FaChartLine />
            <span>Dashboard</span>
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink to="/admin/products" className="nav-link d-flex align-items-center gap-3">
            <FaBox />
            <span>Products</span>
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink to="/admin/categories" className="nav-link d-flex align-items-center gap-3">
            <FaTags />
            <span>Categories</span>
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink to="/admin/orders" className="nav-link d-flex align-items-center gap-3">
            <FaClipboardList />
            <span>Orders</span>
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink to="/admin/users" className="nav-link d-flex align-items-center gap-3">
            <FaUsers />
            <span>Users</span>
          </NavLink>
        </li>
      </ul>

      <hr className="my-3 text-muted" />

      <div className="px-2">
        <Link to="/" className="btn btn-outline-secondary w-100 d-flex align-items-center justify-content-center gap-2 py-2" style={{ borderRadius: '10px' }}>
          <FaArrowLeft />
          <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>Back to Store</span>
        </Link>
      </div>
    </div>
  );
};

export default AdminSidebar;
