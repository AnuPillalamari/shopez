import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';

const StorefrontLayout = () => {
  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar />
      <main className="flex-grow-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default StorefrontLayout;
