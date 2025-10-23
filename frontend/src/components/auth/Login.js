import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Login.css';

const Login = ({ onClose, onSwitchToRegister }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
  console.log('🎯 STEP 1: HandleSubmit function STARTED');
  e.preventDefault();
  console.log('🎯 STEP 2: PreventDefault executed');
  setLoading(true);
  setError('');

  console.log('🎯 STEP 3: Form data:', formData);

  try {
    console.log('🎯 STEP 4: Calling login function...');
    const result = await login(formData.email, formData.password);
    console.log('🎯 STEP 5: Login result:', result);
    
    if (result.success) {
      console.log('🎯 STEP 6: Login successful, redirecting');
      navigate('/');
      if (onClose) onClose();
    } else {
      console.log('🎯 STEP 7: Login failed:', result.message);
      setError(result.message);
    }
  } catch (err) {
    console.log('🎯 STEP 8: Error caught:', err);
    setError('An unexpected error occurred');
  } finally {
    console.log('🎯 STEP 9: Finally block');
    setLoading(false);
  }
};

  return (
    <div className="auth-modal">
      <div className="auth-header">
        <h2>Welcome Back</h2>
        <p>Sign in to your account</p>
        {onClose && (
          <button className="close-btn" onClick={onClose} aria-label="Close">
            <i className="fas fa-times"></i>
          </button>
        )}
      </div>

      {error && (
        <div className="error-message">
          <i className="fas fa-exclamation-circle"></i>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="auth-form">
        <div className="form-group">
          <label htmlFor="login-email">Email Address</label>
          <input
            type="email"
            id="login-email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="Enter your email"
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="login-password">Password</label>
          <input
            type="password"
            id="login-password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            placeholder="Enter your password"
            disabled={loading}
          />
        </div>

        <button 
          type="submit" 
          className="btn btn-primary auth-btn"
          disabled={loading}
        >
          {loading ? (
            <>
              <i className="fas fa-spinner fa-spin"></i>
              Signing In...
            </>
          ) : (
            <>
              <i className="fas fa-sign-in-alt"></i>
              Sign In
            </>
          )}
        </button>
      </form>

      <div className="auth-footer">
        <p>
          Don't have an account?{' '}
          {onSwitchToRegister ? (
            <button className="auth-link" onClick={onSwitchToRegister}>
              Sign up
            </button>
          ) : (
            <Link to="/register" className="auth-link">
              Sign up
            </Link>
          )}
        </p>
      </div>
    </div>
  );
};

export default Login;