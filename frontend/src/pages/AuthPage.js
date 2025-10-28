import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/common/LoadingSpinner';
import './Auth.css';

const AuthPage = () => {
  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login, register, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Support both object `{ pathname }` and string `'/path'` for return location
  let from = '/';
  const rawFrom = location.state?.from;
  if (rawFrom) {
    if (typeof rawFrom === 'string') from = rawFrom;
    else if (rawFrom.pathname) from = rawFrom.pathname;
  }
  if (from === '/login' || from === '/register') from = '/'; // avoid redirect loop

  useEffect(() => {
    console.log('🔍 AuthPage - isAuthenticated:', isAuthenticated, 'from:', from);
    if (isAuthenticated) {
      console.log('✅ User is authenticated, navigating to:', from);
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  const switchTo = (next) => {
    setMode(next);
    setError('');
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (mode === 'register') {
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        return;
      }
      if (formData.password.length < 6) {
        setError('Password must be at least 6 characters long');
        return;
      }
    }

    setLoading(true);
    try {
      if (mode === 'login') {
        const result = await login(formData.email, formData.password);
        if (!result.success) setError(result.message);
      } else {
        const result = await register(formData.name, formData.email, formData.password);
        if (!result.success) setError(result.message);
      }
    } catch (err) {
      console.error('Auth error:', err);
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (isAuthenticated) return <LoadingSpinner text="Redirecting..." />;

  return (
    <div className="container">
      <div className="auth-page">
        <div className="auth-card">
          <div className="auth-header">
            <h1>{mode === 'login' ? 'Welcome Back' : 'Create Account'}</h1>
            <p>{mode === 'login' ? 'Sign in to your account to continue shopping' : 'Join us and start shopping today'}</p>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
            <button className={`btn ${mode==='login'?'btn-primary':''}`} onClick={() => switchTo('login')}>Login</button>
            <button className={`btn ${mode==='register'?'btn-primary':''}`} onClick={() => switchTo('register')}>Register</button>
          </div>

          {error && (
            <div className="error-message">
              <i className="fas fa-exclamation-circle"></i>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form">
            {mode === 'register' && (
              <div className="form-group">
                <label htmlFor="name">Full Name</label>
                <input id="name" name="name" value={formData.name} onChange={handleChange} required disabled={loading} />
              </div>
            )}

            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required disabled={loading} />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input id="password" name="password" type="password" value={formData.password} onChange={handleChange} required disabled={loading} />
            </div>

            {mode === 'register' && (
              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <input id="confirmPassword" name="confirmPassword" type="password" value={formData.confirmPassword} onChange={handleChange} required disabled={loading} />
              </div>
            )}

            <button type="submit" className="btn btn-primary auth-btn" disabled={loading}>
              {loading ? (
                <><i className="fas fa-spinner fa-spin"></i> {mode === 'login' ? 'Signing In...' : 'Creating Account...'}</>
              ) : (
                <>{mode === 'login' ? <><i className="fas fa-sign-in-alt"></i> Sign In</> : <><i className="fas fa-user-plus"></i> Create Account</>}</>
              )}
            </button>
          </form>

        </div>
      </div>
    </div>
  );
};

export default AuthPage;
