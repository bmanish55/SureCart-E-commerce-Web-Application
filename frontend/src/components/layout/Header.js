import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import SearchBar from '../common/SearchBar';
import Navigation from './Navigation';
import './Header.css';

const Header = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { getCartItemCount, quickCartOpen, openQuickCart, closeQuickCart } = useCart();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const userMenuRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleCheckout = () => {
    navigate('/checkout');
  };

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          {/* Logo */}
          <Link to="/" className="logo">
            <i className="fas fa-shopping-bag"></i>
            <span>SureCart</span>
          </Link>

          {/* Search Bar - Desktop */}
          <div className="search-container">
            <SearchBar />
          </div>

          {/* Desktop Navigation */}
          <nav className="desktop-nav">
            <Link to="/" className="nav-link">
              <i className="fas fa-home"></i>
              Home
            </Link>
            <Link to="/products" className="nav-link">
              <i className="fas fa-store"></i>
              Products
            </Link>

            {/* Auth Links */}
            {isAuthenticated ? (
              <>
                <button 
                  className="nav-link cart-link"
                  onClick={() => openQuickCart()}
                  aria-label="Open cart"
                >
                  <i className="fas fa-shopping-cart"></i>
                  {getCartItemCount() > 0 && (
                    <span className="cart-badge">{getCartItemCount()}</span>
                  )}
                </button>

                <div className="user-menu" ref={userMenuRef}>
                  <button 
                    className="user-btn"
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    aria-haspopup="true"
                    aria-expanded={showUserMenu}
                  >
                    <i className="fas fa-user-circle user-avatar"></i>
                    <span className="user-name">Hi, {user?.name?.split(' ')[0]}</span>
                    <i className="fas fa-caret-down user-caret" />
                  </button>

                  {showUserMenu && (
                    <div className="user-dropdown" role="menu">
                      <Link to="/profile" className="user-dropdown-link" onClick={() => setShowUserMenu(false)}>
                        <i className="fas fa-user"></i>
                        Profile
                      </Link>
                      <Link to="/orders" className="user-dropdown-link" onClick={() => setShowUserMenu(false)}>
                        <i className="fas fa-history"></i>
                        Orders
                      </Link>
                      <Link to="/checkout" className="user-dropdown-link" onClick={() => setShowUserMenu(false)}>
                        <i className="fas fa-credit-card"></i>
                        Checkout
                      </Link>
                      <button className="user-dropdown-link logout" onClick={() => { setShowUserMenu(false); handleLogout(); }}>
                        <i className="fas fa-sign-out-alt"></i>
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="auth-links">
                <Link to="/register" className="nav-link btn-primary">
                  <i className="fas fa-user-plus"></i>
                  Login
                </Link>
              </div>
            )}
          </nav>

          {/* Mobile Navigation */}
          <Navigation />

          {/* Cart Icon - Mobile */}
          {isAuthenticated && (
            <button 
              className="cart-mobile"
              onClick={() => setIsCartOpen(true)}
            >
              <i className="fas fa-shopping-cart"></i>
              {getCartItemCount() > 0 && (
                <span className="cart-badge">{getCartItemCount()}</span>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Cart Sidebar */}
      {quickCartOpen && (
        <CartSidebar 
          isOpen={quickCartOpen}
          onClose={() => closeQuickCart()}
          onCheckout={handleCheckout}
        />
      )}
    </header>
  );
};

// Simple CartSidebar component for the header
const CartSidebar = ({ isOpen, onClose, onCheckout }) => {
  const { cartItems, cartTotal } = useCart();
  
  if (!isOpen) return null;

  return (
    <div className="cart-sidebar-backdrop" onClick={onClose}>
      <div className="cart-sidebar" onClick={e => e.stopPropagation()}>
        <div className="cart-header">
          <h2>Quick Cart</h2>
          <button className="close-btn" onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>
        
        <div className="cart-content">
          {cartItems.length === 0 ? (
            <div className="empty-cart">
              <i className="fas fa-shopping-cart"></i>
              <p>Your cart is empty</p>
            </div>
          ) : (
            <>
              <div className="cart-items-preview">
                {cartItems.slice(0, 3).map(item => (
                  <div key={item.product_id} className="cart-item-preview">
                    <img 
                      src={item.image_url || '/images/placeholder-product.jpg'} 
                      alt={item.name}
                    />
                    <div className="item-info">
                      <span className="item-name">{item.name}</span>
                      <span className="item-quantity">Qty: {item.quantity}</span>
                    </div>
                  </div>
                ))}
                {cartItems.length > 3 && (
                  <div className="more-items">
                    +{cartItems.length - 3} more items
                  </div>
                )}
              </div>
              
              <div className="cart-preview-actions">
                <div className="preview-total">
                  Total: ${cartTotal.toFixed(2)}
                </div>
                <button className="btn btn-primary" onClick={onCheckout}>
                  Checkout
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;