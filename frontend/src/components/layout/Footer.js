import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer" role="contentinfo">
      <div className="container">
        <div className="footer-content">
          {/* Brand Section */}
          <div className="footer-section">
            <Link to="/" className="logo">
              <i className="fas fa-shopping-bag"></i>
              <span>SureCart</span>
            </Link>
            <p className="footer-description">
              Your one-stop destination for all your shopping needs. 
              Quality products at affordable prices, delivered with care.
            </p>
            <div className="social-links">
              <a href="https://www.facebook.com/" aria-label="Visit our Facebook page" target="_blank" rel="noopener noreferrer">
                <i className="fab fa-facebook"></i>
              </a>
              <a href="https://x.com/" aria-label="Visit our Twitter page" target="_blank" rel="noopener noreferrer">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="https://www.instagram.com/accounts/login/?hl=en" aria-label="Visit our Instagram page" target="_blank" rel="noopener noreferrer">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="https://www.linkedin.com/in/manish-bhavar-598aba297/" aria-label="Visit our LinkedIn page" target="_blank" rel="noopener noreferrer">
                <i className="fab fa-linkedin"></i>
              </a>
            </div>
          </div>

          {/* Quick Links Section */}
          <div className="footer-section">
            <h3>Quick Links</h3>
            <ul className="footer-links">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/products">Products</Link></li>
              <li><Link to="/cart">Shopping Cart</Link></li>
              <li><Link to="/checkout">Checkout</Link></li>
            </ul>
          </div>

          {/* Contact Info Section */}
          <div className="footer-section">
            <h3>Contact Info</h3>
            <div className="contact-info">
              <p title="Our Location">
                <i className="fas fa-map-marker-alt"></i>
                <span>Nashik, Maharashtra, India</span>
              </p>
              <p title="Call us">
                <i className="fas fa-phone"></i>
                <a href="tel:+918459059460" style={{ color: 'inherit', textDecoration: 'none' }}>+91 8459059460</a>
              </p>
              <p title="Email us">
                <i className="fas fa-envelope"></i>
                <a href="mailto:mbhavar2121@gmail.com" style={{ color: 'inherit', textDecoration: 'none' }}>mbhavar2121@gmail.com</a>
              </p>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="footer-bottom">
          <p>&copy; 2025 SureCart. All rights reserved.</p>
          <nav className="footer-bottom-links">
            <Link to="/privacy">Privacy Policy</Link>
            <Link to="/terms">Terms of Service</Link>
            <Link to="/returns">Returns Policy</Link>
          </nav>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
