import React, { useContext } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext.jsx';
import AdminSidebar from '../components/AdminSidebar.jsx';

const AdminLayout = () => {
  const { user, loading } = useContext(AuthContext);

  // loading state
  if (loading) {
    return (
      <div className="d-flex align-items-center justify-content-center min-vh-100" style={{ backgroundColor: 'hsl(var(--bg-app))' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  // Route security check: Redirect if user is not authorized as admin
  if (!user || user.role !== 'admin') {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="container-fluid">
      <div className="row">
        {/* Sticky Admin Sidebar */}
        <aside className="col-md-3 col-lg-2 px-0" style={{ position: 'sticky', top: 0, height: '100vh', zIndex: 100 }}>
          <AdminSidebar />
        </aside>
        
        {/* Dynamic Content Panel */}
        <main className="col-md-9 col-lg-10 p-4" style={{ backgroundColor: 'hsl(var(--bg-app))', minHeight: '100vh' }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
