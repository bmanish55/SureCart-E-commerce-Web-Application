import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import SearchBar from '../common/SearchBar';
import Navigation from './Navigation';
import './Header.css';

const Header = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { getCartItemCount } = useCart();
  const [isCartOpen, setIsCartOpen] = useState(false);
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
            <span>E-Store</span>
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
                  onClick={() => setIsCartOpen(true)}
                >
                  <i className="fas fa-shopping-cart"></i>
                  Cart
                  {getCartItemCount() > 0 && (
                    <span className="cart-badge">{getCartItemCount()}</span>
                  )}
                </button>
                
                <div className="user-menu">
                  <button className="user-btn">
                    <i className="fas fa-user"></i>
                    {user?.name}
                  </button>
                </div>
              </>
            ) : (
              <div className="auth-links">
                <Link to="/login" className="nav-link">
                  <i className="fas fa-sign-in-alt"></i>
                  Login
                </Link>
                <Link to="/register" className="nav-link btn-primary">
                  <i className="fas fa-user-plus"></i>
                  Register
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
      {isCartOpen && (
        <CartSidebar 
          isOpen={isCartOpen}
          onClose={() => setIsCartOpen(false)}
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