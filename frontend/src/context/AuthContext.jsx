import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { ToastContext } from './ToastContext.jsx';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { showToast } = useContext(ToastContext);

  // Set default axios parameters
  axios.defaults.withCredentials = true;

  // Initialize and check current token session on boot
  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem('shopez-token');
      if (storedToken) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
        try {
          const { data } = await axios.get('/api/auth/me');
          setUser(data);
        } catch (error) {
          console.error('Session validation failed:', error.message);
          localStorage.removeItem('shopez-token');
          delete axios.defaults.headers.common['Authorization'];
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  // Login handler
  const login = async (email, password) => {
    try {
      setLoading(true);
      const { data } = await axios.post('/api/auth/login', { email, password });
      
      localStorage.setItem('shopez-token', data.token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
      setUser(data);
      
      showToast(`Welcome back, ${data.name}!`, 'success');
      return { success: true };
    } catch (error) {
      const msg = error.response?.data?.message || 'Login failed';
      showToast(msg, 'danger');
      return { success: false, error: msg };
    } finally {
      setLoading(false);
    }
  };

  // Registration handler
  const register = async (name, email, password) => {
    try {
      setLoading(true);
      const { data } = await axios.post('/api/auth/register', { name, email, password });
      
      localStorage.setItem('shopez-token', data.token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
      setUser(data);
      
      showToast(`Registration successful! Welcome, ${data.name}!`, 'success');
      return { success: true };
    } catch (error) {
      const errorsList = error.response?.data?.errors;
      const msg = errorsList ? errorsList[0].msg : (error.response?.data?.message || 'Registration failed');
      showToast(msg, 'danger');
      return { success: false, error: msg };
    } finally {
      setLoading(false);
    }
  };

  // Logout handler
  const logout = async () => {
    try {
      await axios.post('/api/auth/logout');
    } catch (error) {
      console.error('Logout request failed:', error.message);
    } finally {
      localStorage.removeItem('shopez-token');
      delete axios.defaults.headers.common['Authorization'];
      setUser(null);
      showToast('Logged out successfully', 'info');
    }
  };

  // Update profile details
  const updateProfile = async (profileData) => {
    try {
      const { data } = await axios.put('/api/users/profile', profileData);
      setUser(data);
      showToast('Profile updated successfully', 'success');
      return { success: true };
    } catch (error) {
      const msg = error.response?.data?.message || 'Update failed';
      showToast(msg, 'danger');
      return { success: false, error: msg };
    }
  };

  // Update profile image
  const updateProfileImage = async (formData) => {
    try {
      const { data } = await axios.post('/api/users/profile-image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setUser((prev) => ({ ...prev, profileImage: data.imageUrl }));
      showToast('Profile image updated', 'success');
      return { success: true, imageUrl: data.imageUrl };
    } catch (error) {
      const msg = error.response?.data?.message || 'Image upload failed';
      showToast(msg, 'danger');
      return { success: false, error: msg };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        updateProfile,
        updateProfileImage,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
