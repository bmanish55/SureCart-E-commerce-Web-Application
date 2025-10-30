import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { formatPrice } from '../../utils/helpers';
import SearchBar from '../common/SearchBar';
import Navigation from './Navigation';
import './Header.css';

const Header = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { getCartItemCount, quickCartOpen, openQuickCart, closeQuickCart } = useCart();
  const { getWishlistCount, wishlistOpen, toggleWishlist, openWishlist, closeWishlist, wishlistItems, removeFromWishlist } = useWishlist();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMegaMenu, setShowMegaMenu] = useState(null);
  const [headerScrolled, setHeaderScrolled] = useState(false);
  const userMenuRef = useRef(null);
  const megaMenuRef = useRef(null);

  // Mega menu categories structure
  const megaMenuCategories = [
    {
      name: 'Electronics',
      icon: 'fas fa-laptop',
      subcategories: ['Mobile And Tablets', 'Computer and Laptops', 'Audio and Wearables']
    },
    {
      name: 'Sports',
      icon: 'fas fa-dumbbell',
      subcategories: ['Cricket', 'Football', 'Basketball', 'Tennis', 'Badminton']
    },
    {
      name: 'Clothing',
      icon: 'fas fa-shirt',
      subcategories: ['Mens', 'Womens', 'Kids']
    }
  ];

  // Handle scroll for header styling
  useEffect(() => {
    const handleScroll = () => {
      setHeaderScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setShowUserMenu(false);
      }
      if (megaMenuRef.current && !megaMenuRef.current.contains(e.target)) {
        setShowMegaMenu(null);
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
    <header className={`header ${headerScrolled ? 'scrolled' : ''}`}>
      <div className="container">
        <div className="header-content">
          {/* Logo */}
          <Link to="/" className="logo">
            <i className="fas fa-shopping-bag logo-icon-main"></i>
            <span className="logo-text">SureCart</span>
          </Link>

          {/* Search Bar - Desktop */}
          <div className="search-container">
            <SearchBar />
          </div>

          {/* Desktop Navigation */}
          <nav className="desktop-nav">
            <Link to="/" className="nav-link">
              <i className="fas fa-home"></i>
              <span>Home</span>
            </Link>

            {/* Mega Menu Trigger */}
            <div className="mega-menu-container" ref={megaMenuRef}>
              <button 
                className="nav-link mega-menu-trigger"
                onClick={() => setShowMegaMenu(showMegaMenu ? null : 'categories')}
              >
                <i className="fas fa-th"></i>
                <span>Shop</span>
                <i className="fas fa-chevron-down"></i>
              </button>

              {showMegaMenu === 'categories' && (
                <div className="mega-menu">
                  <div className="mega-menu-header">
                    <h3>Shop by Category</h3>
                  </div>
                  <div className="mega-menu-content">
                    {megaMenuCategories.map(cat => (
                      <div key={cat.name} className="mega-menu-column">
                        <div className="category-header">
                          <i className={cat.icon}></i>
                          <Link 
                            to={`/products?category=${encodeURIComponent(cat.name)}`}
                            className="category-link"
                            onClick={() => setShowMegaMenu(null)}
                          >
                            {cat.name}
                          </Link>
                        </div>
                        <ul className="subcategory-list">
                          {cat.subcategories.map(sub => (
                            <li key={sub}>
                              <Link 
                                to={`/products?category=${encodeURIComponent(cat.name)}&subcategory=${encodeURIComponent(sub)}`}
                                onClick={() => setShowMegaMenu(null)}
                              >
                                {sub}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <Link to="/products" className="nav-link">
              <i className="fas fa-store"></i>
              <span>All Products</span>
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

                <button
                  className="nav-link wishlist-link"
                  onClick={() => toggleWishlist()}
                  aria-label="Open wishlist"
                >
                  <i className="fas fa-heart"></i>
                  {getWishlistCount() > 0 && (
                    <span className="cart-badge wishlist-badge">{getWishlistCount()}</span>
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
                    <i className={`fas fa-caret-down user-caret ${showUserMenu ? 'open' : ''}`} />
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
                  <span>Login</span>
                </Link>
                <button
                  className="nav-link wishlist-link"
                  onClick={() => toggleWishlist()}
                  aria-label="Open wishlist"
                >
                  <i className="fas fa-heart"></i>
                  {getWishlistCount() > 0 && (
                    <span className="cart-badge wishlist-badge">{getWishlistCount()}</span>
                  )}
                </button>
              </div>
            )}
          </nav>

          {/* Mobile Navigation */}
          <Navigation />

          {/* Cart Icon - Mobile */}
          {isAuthenticated && (
            <button 
              className="cart-mobile"
              onClick={() => openQuickCart()}
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
      {/* Wishlist Sidebar */}
      {wishlistOpen && (
        <WishlistSidebar
          isOpen={wishlistOpen}
          onClose={() => closeWishlist()}
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
                  Total: ₹{cartTotal.toFixed(2)}
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

// Wishlist Sidebar component similar to CartSidebar
const WishlistSidebar = ({ isOpen, onClose }) => {
  const { wishlistItems, removeFromWishlist } = useWishlist();

  if (!isOpen) return null;

  return (
    <div className="cart-sidebar-backdrop" onClick={onClose}>
      <div className="cart-sidebar" onClick={e => e.stopPropagation()}>
        <div className="cart-header">
          <h2>Wishlist</h2>
          <button className="close-btn" onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>

        <div className="cart-content">
          {wishlistItems.length === 0 ? (
            <div className="empty-cart">
              <i className="fas fa-heart"></i>
              <p>Your wishlist is empty</p>
            </div>
          ) : (
            <>
              <div className="cart-items-preview">
                {wishlistItems.slice(0, 6).map(item => (
                  <div key={item.product_id} className="cart-item-preview">
                    <Link to={`/products/${item.product_id}`} onClick={onClose} className="wish-link">
                      <img src={item.image_url || '/images/placeholder-product.jpg'} alt={item.name} />
                      <div className="item-info">
                        <span className="item-name">{item.name}</span>
                        <span className="item-quantity">{item.price ? `₹${item.price}` : ''}</span>
                      </div>
                    </Link>
                    <button className="remove-wish" onClick={(e) => { e.stopPropagation(); removeFromWishlist(item.product_id); }}>
                      <i className="fas fa-trash"></i>
                    </button>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};