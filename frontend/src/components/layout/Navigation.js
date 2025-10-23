import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import './Navigation.css';

const Navigation = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const { getCartItemCount } = useCart();
  const location = useLocation();
  const navigate = useNavigate();

  const categories = [
    { name: 'All', path: '/products', icon: 'fas fa-grid' },
    { name: 'Electronics', path: '/products?category=Electronics', icon: 'fas fa-laptop' },
    { name: 'Clothing', path: '/products?category=Clothing', icon: 'fas fa-tshirt' },
    { name: 'Home', path: '/products?category=Home', icon: 'fas fa-home' },
    { name: 'Sports', path: '/products?category=Sports', icon: 'fas fa-running' },
    { name: 'Accessories', path: '/products?category=Accessories', icon: 'fas fa-gem' }
  ];

  const isActiveLink = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
    setIsMobileMenuOpen(false);
    navigate('/');
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  const closeAllMenus = () => {
    setIsMobileMenuOpen(false);
    setIsUserMenuOpen(false);
  };

  const handleNavLinkClick = () => {
    closeAllMenus();
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button 
        className="mobile-menu-toggle"
        onClick={toggleMobileMenu}
        aria-label="Toggle navigation menu"
        aria-expanded={isMobileMenuOpen}
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      {/* Navigation Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="nav-overlay"
          onClick={closeAllMenus}
        ></div>
      )}

      {/* Navigation Menu */}
      <nav className={`navigation ${isMobileMenuOpen ? 'nav-open' : ''}`}>
        <div className="nav-header">
          <h3>Menu</h3>
          <button 
            className="close-nav"
            onClick={closeAllMenus}
            aria-label="Close navigation"
          >
            <i className="fas fa-times"></i>
          </button>
        </div>

        <div className="nav-content">
          {/* Main Navigation Links */}
          <div className="nav-section">
            <h4>Main Menu</h4>
            <ul className="nav-links">
              <li>
                <Link 
                  to="/" 
                  className={`nav-link ${isActiveLink('/') ? 'active' : ''}`}
                  onClick={handleNavLinkClick}
                >
                  <i className="fas fa-home"></i>
                  Home
                </Link>
              </li>
              <li>
                <Link 
                  to="/products" 
                  className={`nav-link ${isActiveLink('/products') ? 'active' : ''}`}
                  onClick={handleNavLinkClick}
                >
                  <i className="fas fa-store"></i>
                  All Products
                </Link>
              </li>
              {isAuthenticated && (
                <li>
                  <Link 
                    to="/cart" 
                    className={`nav-link cart-nav-link ${isActiveLink('/cart') ? 'active' : ''}`}
                    onClick={handleNavLinkClick}
                  >
                    <i className="fas fa-shopping-cart"></i>
                    Shopping Cart
                    {getCartItemCount() > 0 && (
                      <span className="cart-badge">{getCartItemCount()}</span>
                    )}
                  </Link>
                </li>
              )}
            </ul>
          </div>

          {/* Categories */}
          <div className="nav-section">
            <h4>Categories</h4>
            <ul className="nav-links">
              {categories.map((category, index) => (
                <li key={index}>
                  <Link 
                    to={category.path}
                    className="nav-link category-link"
                    onClick={handleNavLinkClick}
                  >
                    <i className={category.icon}></i>
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* User Section */}
          <div className="nav-section">
            <h4>Account</h4>
            <ul className="nav-links">
              {isAuthenticated ? (
                <>
                  <li>
                    <div className="user-welcome">
                      <i className="fas fa-user-circle"></i>
                      <div className="user-info">
                        <span className="user-name">Hello, {user?.name}</span>
                        <span className="user-email">{user?.email}</span>
                      </div>
                    </div>
                  </li>
                  <li>
                    <Link 
                      to="/checkout" 
                      className="nav-link"
                      onClick={handleNavLinkClick}
                    >
                      <i className="fas fa-receipt"></i>
                      Checkout
                    </Link>
                  </li>
                  <li>
                    <Link 
                      to="/orders" 
                      className="nav-link"
                      onClick={handleNavLinkClick}
                    >
                      <i className="fas fa-history"></i>
                      Order History
                    </Link>
                  </li>
                  <li>
                    <Link 
                      to="/profile" 
                      className="nav-link"
                      onClick={handleNavLinkClick}
                    >
                      <i className="fas fa-cog"></i>
                      Account Settings
                    </Link>
                  </li>
                  <li>
                    <button 
                      className="nav-link logout-btn"
                      onClick={handleLogout}
                    >
                      <i className="fas fa-sign-out-alt"></i>
                      Logout
                    </button>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <Link 
                      to="/login" 
                      className="nav-link"
                      onClick={handleNavLinkClick}
                    >
                      <i className="fas fa-sign-in-alt"></i>
                      Sign In
                    </Link>
                  </li>
                  <li>
                    <Link 
                      to="/register" 
                      className="nav-link register-link"
                      onClick={handleNavLinkClick}
                    >
                      <i className="fas fa-user-plus"></i>
                      Create Account
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>

          {/* Support Links */}
          <div className="nav-section">
            <h4>Support</h4>
            <ul className="nav-links">
              <li>
                <Link 
                  to="/help" 
                  className="nav-link"
                  onClick={handleNavLinkClick}
                >
                  <i className="fas fa-question-circle"></i>
                  Help Center
                </Link>
              </li>
              <li>
                <Link 
                  to="/contact" 
                  className="nav-link"
                  onClick={handleNavLinkClick}
                >
                  <i className="fas fa-envelope"></i>
                  Contact Us
                </Link>
              </li>
              <li>
                <Link 
                  to="/about" 
                  className="nav-link"
                  onClick={handleNavLinkClick}
                >
                  <i className="fas fa-info-circle"></i>
                  About Us
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer Section */}
        <div className="nav-footer">
          <div className="social-links">
            <a href="#" aria-label="Facebook">
              <i className="fab fa-facebook"></i>
            </a>
            <a href="#" aria-label="Twitter">
              <i className="fab fa-twitter"></i>
            </a>
            <a href="#" aria-label="Instagram">
              <i className="fab fa-instagram"></i>
            </a>
          </div>
          <p className="copyright">&copy; 2024 E-Store. All rights reserved.</p>
        </div>
      </nav>

      {/* User Menu Dropdown (Desktop) */}
      {isAuthenticated && (
        <div className={`user-menu-dropdown ${isUserMenuOpen ? 'open' : ''}`}>
          <div className="user-menu-header">
            <div className="user-avatar">
              <i className="fas fa-user-circle"></i>
            </div>
            <div className="user-details">
              <span className="user-name">{user?.name}</span>
              <span className="user-email">{user?.email}</span>
            </div>
          </div>
          <div className="user-menu-links">
            <Link to="/profile" className="user-menu-link">
              <i className="fas fa-user"></i>
              My Profile
            </Link>
            <Link to="/orders" className="user-menu-link">
              <i className="fas fa-history"></i>
              Order History
            </Link>
            <Link to="/wishlist" className="user-menu-link">
              <i className="fas fa-heart"></i>
              Wishlist
            </Link>
            <button onClick={handleLogout} className="user-menu-link logout">
              <i className="fas fa-sign-out-alt"></i>
              Logout
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Navigation;