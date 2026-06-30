import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from './AuthContext.jsx';
import { ToastContext } from './ToastContext.jsx';

export const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useContext(AuthContext);
  const { showToast } = useContext(ToastContext);

  // Load wishlist when user logs in
  useEffect(() => {
    const fetchWishlist = async () => {
      if (user) {
        try {
          setLoading(true);
          const { data } = await axios.get('/api/wishlist');
          setWishlistItems(data);
        } catch (error) {
          console.error('Failed to fetch wishlist:', error.message);
        } finally {
          setLoading(false);
        }
      } else {
        setWishlistItems([]);
      }
    };

    fetchWishlist();
  }, [user]);

  // Toggle or add item to wishlist
  const addToWishlist = async (productId) => {
    if (!user) {
      showToast('Please login to bookmark products', 'warning');
      return { success: false, loginRequired: true };
    }

    try {
      setLoading(true);
      const { data } = await axios.post('/api/wishlist', { productId });
      setWishlistItems((prev) => [...prev, data]);
      showToast('Added to wishlist', 'success');
      return { success: true };
    } catch (error) {
      const msg = error.response?.data?.message || 'Failed to bookmark item';
      showToast(msg, 'danger');
      return { success: false, error: msg };
    } finally {
      setLoading(false);
    }
  };

  // Remove item from wishlist
  const removeFromWishlist = async (productId) => {
    try {
      setLoading(true);
      await axios.delete(`/api/wishlist/${productId}`);
      setWishlistItems((prev) => prev.filter((item) => item.product._id !== productId));
      showToast('Removed from wishlist', 'info');
      return { success: true };
    } catch (error) {
      const msg = error.response?.data?.message || 'Failed to remove from wishlist';
      showToast(msg, 'danger');
      return { success: false, error: msg };
    } finally {
      setLoading(false);
    }
  };

  // Check if a product is in wishlist
  const isInWishlist = (productId) => {
    return wishlistItems.some((item) => item.product._id === productId);
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlistItems,
        loading,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};
