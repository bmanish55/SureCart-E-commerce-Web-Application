import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import ProductGrid from '../components/products/ProductGrid';
import LoadingSpinner from '../components/common/LoadingSpinner';
import './Home.css';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const response = await api.get('/products?limit=8');
        setFeaturedProducts(response.data);
      } catch (err) {
        setError('Failed to load featured products');
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <div className="hero-text">
              <h1>Welcome to E-Store</h1>
              <p>Discover amazing products at unbeatable prices. Shop with confidence and enjoy fast delivery.</p>
              <div className="hero-actions">
                <Link to="/products" className="btn btn-primary btn-large">
                  Shop Now
                </Link>
                {!isAuthenticated && (
                  <Link to="/register" className="btn btn-outline btn-large">
                    Create Account
                  </Link>
                )}
              </div>
            </div>
            <div className="hero-image">
              <img src="/images/hero-shopping.jpg" alt="Shopping" />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="container">
          <h2>Why Shop With Us?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <i className="fas fa-shipping-fast"></i>
              <h3>Free Shipping</h3>
              <p>Free delivery on orders over $50</p>
            </div>
            <div className="feature-card">
              <i className="fas fa-shield-alt"></i>
              <h3>Secure Payment</h3>
              <p>100% secure payment processing</p>
            </div>
            <div className="feature-card">
              <i className="fas fa-undo"></i>
              <h3>Easy Returns</h3>
              <p>30-day money back guarantee</p>
            </div>
            <div className="feature-card">
              <i className="fas fa-headset"></i>
              <h3>24/7 Support</h3>
              <p>Round-the-clock customer service</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="featured-products">
        <div className="container">
          <div className="section-header">
            <h2>Featured Products</h2>
            <Link to="/products" className="view-all-btn">
              View All Products <i className="fas fa-arrow-right"></i>
            </Link>
          </div>
          
          {loading ? (
            <LoadingSpinner text="Loading featured products..." />
          ) : (
            <ProductGrid 
              products={featuredProducts} 
              loading={false} 
              error={error} 
            />
          )}
        </div>
      </section>

      {/* Categories Section */}
      <section className="categories">
        <div className="container">
          <h2>Shop by Category</h2>
          <div className="categories-grid">
            <Link to="/products?category=Electronics" className="category-card">
              <i className="fas fa-laptop"></i>
              <h3>Electronics</h3>
              <p>Latest gadgets and devices</p>
            </Link>
            <Link to="/products?category=Clothing" className="category-card">
              <i className="fas fa-tshirt"></i>
              <h3>Clothing</h3>
              <p>Fashion for everyone</p>
            </Link>
            <Link to="/products?category=Home" className="category-card">
              <i className="fas fa-home"></i>
              <h3>Home & Kitchen</h3>
              <p>Everything for your home</p>
            </Link>
            <Link to="/products?category=Sports" className="category-card">
              <i className="fas fa-running"></i>
              <h3>Sports</h3>
              <p>Fitness and outdoor gear</p>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;