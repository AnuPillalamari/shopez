import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext.jsx';
import { ToastContext } from '../context/ToastContext.jsx';
import { FaUser, FaEnvelope, FaLock, FaUserPlus } from 'react-icons/fa';

const Register = () => {
  const { register, user } = useContext(AuthContext);
  const { showToast } = useContext(ToastContext);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const redirect = searchParams.get('redirect') || '/';

  // If user is already logged in, redirect them
  useEffect(() => {
    if (user) {
      navigate(redirect, { replace: true });
    }
  }, [user, redirect, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !email || !password || !confirmPassword) {
      return showToast('Please fill in all fields', 'warning');
    }

    if (password.length < 6) {
      return showToast('Password must be at least 6 characters', 'warning');
    }

    if (password !== confirmPassword) {
      return showToast('Passwords do not match', 'warning');
    }

    setIsSubmitting(true);
    const res = await register(name, email, password);
    setIsSubmitting(false);

    if (res.success) {
      navigate(redirect, { replace: true });
    }
  };

  return (
    <div className="container py-5 d-flex justify-content-center align-items-center" style={{ minHeight: '70vh' }}>
      <div className="card border-0 glass-panel p-4 rounded-4 shadow-lg w-100" style={{ maxWidth: '450px' }}>
        <div className="text-center mb-4">
          <h2 className="display-font fw-extrabold text-gradient mb-1" style={{
            background: 'linear-gradient(135deg, #4f46e5, #9333ea)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>ShopEZ</h2>
          <span className="text-muted fw-semibold">Create your customer account</span>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Full Name */}
          <div className="mb-3">
            <label className="form-label text-muted fw-semibold" style={{ fontSize: '0.8rem' }}>Full Name</label>
            <div className="input-group">
              <span className="input-group-text bg-light border-end-0 text-muted" style={{ borderTopLeftRadius: '14px', borderBottomLeftRadius: '14px', border: '1px solid hsl(var(--border))' }}><FaUser /></span>
              <input 
                type="text" 
                className="form-control custom-input border-start-0 py-2.5"
                placeholder="Nikhil Ravva"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}
                required
              />
            </div>
          </div>

          {/* Email */}
          <div className="mb-3">
            <label className="form-label text-muted fw-semibold" style={{ fontSize: '0.8rem' }}>Email Address</label>
            <div className="input-group">
              <span className="input-group-text bg-light border-end-0 text-muted" style={{ borderTopLeftRadius: '14px', borderBottomLeftRadius: '14px', border: '1px solid hsl(var(--border))' }}><FaEnvelope /></span>
              <input 
                type="email" 
                className="form-control custom-input border-start-0 py-2.5"
                placeholder="email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}
                required
              />
            </div>
          </div>

          {/* Password */}
          <div className="mb-3">
            <label className="form-label text-muted fw-semibold" style={{ fontSize: '0.8rem' }}>Password</label>
            <div className="input-group">
              <span className="input-group-text bg-light border-end-0 text-muted" style={{ borderTopLeftRadius: '14px', borderBottomLeftRadius: '14px', border: '1px solid hsl(var(--border))' }}><FaLock /></span>
              <input 
                type="password" 
                className="form-control custom-input border-start-0 py-2.5"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}
                required
              />
            </div>
          </div>

          {/* Confirm Password */}
          <div className="mb-4">
            <label className="form-label text-muted fw-semibold" style={{ fontSize: '0.8rem' }}>Confirm Password</label>
            <div className="input-group">
              <span className="input-group-text bg-light border-end-0 text-muted" style={{ borderTopLeftRadius: '14px', borderBottomLeftRadius: '14px', border: '1px solid hsl(var(--border))' }}><FaLock /></span>
              <input 
                type="password" 
                className="form-control custom-input border-start-0 py-2.5"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                style={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}
                required
              />
            </div>
          </div>

          {/* Submit */}
          <button 
            type="submit" 
            className="btn btn-primary-glow w-100 py-2.5 d-flex align-items-center justify-content-center gap-2 mb-3 fs-6"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <div className="spinner-border spinner-border-sm text-light" role="status"></div>
            ) : (
              <><FaUserPlus /> Register</>
            )}
          </button>
        </form>

        <div className="text-center mt-3" style={{ fontSize: '0.9rem' }}>
          <span className="text-muted">Already have an account? </span>
          <Link to={redirect !== '/' ? `/login?redirect=${redirect}` : '/login'} className="fw-bold text-decoration-none text-primary">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
