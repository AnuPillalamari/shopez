import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext.jsx';
import { FaEnvelope, FaLock, FaSignInAlt } from 'react-icons/fa';

const Login = () => {
  const { login, user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
    if (!email || !password) return;

    setIsSubmitting(true);
    const res = await login(email, password);
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
          <span className="text-muted fw-semibold">Sign in to your e-commerce account</span>
        </div>

        <form onSubmit={handleSubmit}>
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
          <div className="mb-4">
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

          {/* Submit */}
          <button 
            type="submit" 
            className="btn btn-primary-glow w-100 py-2.5 d-flex align-items-center justify-content-center gap-2 mb-3 fs-6"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <div className="spinner-border spinner-border-sm text-light" role="status"></div>
            ) : (
              <><FaSignInAlt /> Login</>
            )}
          </button>
        </form>

        <div className="text-center mt-3" style={{ fontSize: '0.9rem' }}>
          <span className="text-muted">Don't have an account? </span>
          <Link to={redirect !== '/' ? `/register?redirect=${redirect}` : '/register'} className="fw-bold text-decoration-none text-primary">
            Register Now
          </Link>
        </div>

        {/* Demo Credentials Alert Info */}
        <div className="alert alert-info mt-4 mb-0 py-2 px-3" style={{ borderRadius: '10px', fontSize: '0.8rem' }}>
          <strong>Demo Accounts:</strong><br />
          Customer: <code>user1@shopez.com</code> / <code>user123</code><br />
          Administrator: <code>admin@shopez.com</code> / <code>admin123</code>
        </div>
      </div>
    </div>
  );
};

export default Login;
