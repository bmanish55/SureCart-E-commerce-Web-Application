import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Register.css';

const Register = ({ onClose, onSwitchToLogin }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
    setError('');
  };

  const validateForm = () => {
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }

    if (!formData.agreeToTerms) {
      setError('Please agree to the Terms of Service and Privacy Policy');
      return false;
    }

    return true;
  };

  const getPasswordStrength = (password) => {
    if (password.length === 0) return '';
    if (password.length < 6) return 'weak';
    if (password.length < 8) return 'medium';
    
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    
    const strength = [hasUpperCase, hasLowerCase, hasNumbers, hasSpecialChar].filter(Boolean).length;
    
    if (strength < 2) return 'weak';
    if (strength < 4) return 'medium';
    return 'strong';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const result = await register(formData.name, formData.email, formData.password);
      if (result.success) {
        if (onClose) {
          onClose();
        } else {
          navigate('/');
        }
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const passwordStrength = getPasswordStrength(formData.password);

  return (
    <div className="auth-modal">
      <div className="auth-header">
        <h2>Create Account</h2>
        <p>Join us and start shopping today</p>
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
          <label htmlFor="register-name">Full Name</label>
          <input
            type="text"
            id="register-name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="Enter your full name"
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="register-email">Email Address</label>
          <input
            type="email"
            id="register-email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="Enter your email"
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="register-password">Password</label>
          <input
            type="password"
            id="register-password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            placeholder="Create a password (min. 6 characters)"
            disabled={loading}
          />
          {formData.password && (
            <div className={`password-strength ${passwordStrength}`}>
              <div className="strength-bar">
                <div className={`strength-fill ${passwordStrength}`}></div>
              </div>
              <span className="strength-text">
                {passwordStrength === 'weak' && 'Weak password'}
                {passwordStrength === 'medium' && 'Medium strength'}
                {passwordStrength === 'strong' && 'Strong password'}
              </span>
            </div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="register-confirm-password">Confirm Password</label>
          <input
            type="password"
            id="register-confirm-password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            placeholder="Confirm your password"
            disabled={loading}
          />
          {formData.confirmPassword && formData.password === formData.confirmPassword && (
            <div className="password-match success">
              <i className="fas fa-check"></i>
              Passwords match
            </div>
          )}
          {formData.confirmPassword && formData.password !== formData.confirmPassword && (
            <div className="password-match error">
              <i className="fas fa-times"></i>
              Passwords don't match
            </div>
          )}
        </div>

        <label className="terms-checkbox">
          <input
            type="checkbox"
            name="agreeToTerms"
            checked={formData.agreeToTerms}
            onChange={handleChange}
            disabled={loading}
          />
          <span>
            I agree to the{' '}
            <Link to="/terms" className="terms-link">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link to="/privacy" className="terms-link">
              Privacy Policy
            </Link>
          </span>
        </label>

        <button 
          type="submit" 
          className="btn btn-primary auth-btn"
          disabled={loading}
        >
          {loading ? (
            <>
              <i className="fas fa-spinner fa-spin"></i>
              Creating Account...
            </>
          ) : (
            <>
              <i className="fas fa-user-plus"></i>
              Create Account
            </>
          )}
        </button>
      </form>

      <div className="auth-footer">
        <p>
          Already have an account?{' '}
          {onSwitchToLogin ? (
            <button className="auth-link" onClick={onSwitchToLogin}>
              Sign in
            </button>
          ) : (
            <Link to="/login" className="auth-link">
              Sign in
            </Link>
          )}
        </p>
      </div>
    </div>
  );
};

export default Register;