import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from './AuthContext.jsx';
import { ToastContext } from './ToastContext.jsx';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useContext(AuthContext);
  const { showToast } = useContext(ToastContext);

  // Load cart when user logs in
  useEffect(() => {
    const fetchCart = async () => {
      if (user) {
        try {
          setLoading(true);
          const { data } = await axios.get('/api/cart');
          setCartItems(data);
        } catch (error) {
          console.error('Failed to fetch cart:', error.message);
        } finally {
          setLoading(false);
        }
      } else {
        setCartItems([]);
      }
    };

    fetchCart();
  }, [user]);

  // Add product to cart
  const addToCart = async (productId, quantity = 1) => {
    if (!user) {
      showToast('Please login to add items to cart', 'warning');
      return { success: false, loginRequired: true };
    }

    try {
      setLoading(true);
      const { data } = await axios.post('/api/cart', { productId, quantity });
      
      // Update local state: if already in cart, update it; else append it
      setCartItems((prev) => {
        const exists = prev.find((item) => item.product._id === productId);
        if (exists) {
          return prev.map((item) =>
            item.product._id === productId ? data : item
          );
        }
        return [...prev, data];
      });

      showToast('Item added to cart', 'success');
      return { success: true };
    } catch (error) {
      const msg = error.response?.data?.message || 'Failed to add item';
      showToast(msg, 'danger');
      return { success: false, error: msg };
    } finally {
      setLoading(false);
    }
  };

  // Update item quantity
  const updateQuantity = async (cartItemId, quantity) => {
    try {
      const { data } = await axios.put(`/api/cart/${cartItemId}`, { quantity });
      setCartItems((prev) =>
        prev.map((item) => (item._id === cartItemId ? { ...item, quantity: data.quantity, totalPrice: data.totalPrice } : item))
      );
      return { success: true };
    } catch (error) {
      const msg = error.response?.data?.message || 'Failed to update quantity';
      showToast(msg, 'danger');
      return { success: false, error: msg };
    }
  };

  // Remove item from cart
  const removeFromCart = async (cartItemId) => {
    try {
      await axios.delete(`/api/cart/${cartItemId}`);
      setCartItems((prev) => prev.filter((item) => item._id !== cartItemId));
      showToast('Item removed from cart', 'info');
      return { success: true };
    } catch (error) {
      const msg = error.response?.data?.message || 'Failed to remove item';
      showToast(msg, 'danger');
      return { success: false, error: msg };
    }
  };

  // Clear entire cart
  const clearCart = async () => {
    try {
      await axios.delete('/api/cart');
      setCartItems([]);
      return { success: true };
    } catch (error) {
      const msg = error.response?.data?.message || 'Failed to clear cart';
      showToast(msg, 'danger');
      return { success: false, error: msg };
    }
  };

  // Compute Cart Calculations
  const cartSubtotal = cartItems.reduce((acc, item) => acc + item.totalPrice, 0);
  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  
  // Free shipping on orders over ₹999, else flat ₹99 shipping fee
  const shippingCharges = cartSubtotal > 999 || cartSubtotal === 0 ? 0 : 99;
  
  const grandTotal = cartSubtotal + shippingCharges;

  return (
    <CartContext.Provider
      value={{
        cartItems,
        loading,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        cartSubtotal,
        cartCount,
        shippingCharges,
        grandTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
