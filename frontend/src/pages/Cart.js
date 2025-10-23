import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { formatPrice } from '../utils/helpers';
import CartItem from '../components/cart/CartItem';
import LoadingSpinner from '../components/common/LoadingSpinner';
import './Cart.css';

const Cart = () => {
  const { cartItems, cartTotal, loading, clearCart } = useCart();
  const { isAuthenticated } = useAuth();

  if (loading) {
    return (
      <div className="container">
        <LoadingSpinner text="Loading cart..." />
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="container">
        <div className="cart-page">
          <div className="cart-header">
            <h1>Shopping Cart</h1>
          </div>
          <div className="empty-cart-page">
            <i className="fas fa-shopping-cart"></i>
            <h2>Your cart is empty</h2>
            <p>Browse our products and add items to your cart</p>
            <Link to="/products" className="btn btn-primary">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="cart-page">
        <div className="cart-header">
          <h1>Shopping Cart</h1>
          <button 
            className="btn btn-outline clear-cart-btn"
            onClick={clearCart}
          >
            <i className="fas fa-trash"></i>
            Clear Cart
          </button>
        </div>

        <div className="cart-layout">
          <div className="cart-items-section">
            {cartItems.map(item => (
              <CartItem key={item.product_id} item={item} />
            ))}
          </div>

          <div className="cart-summary-section">
            <div className="order-summary card">
              <h3>Order Summary</h3>
              
              <div className="summary-row">
                <span>Subtotal:</span>
                <span>{formatPrice(cartTotal)}</span>
              </div>
              
              <div className="summary-row">
                <span>Shipping:</span>
                <span>Calculated at checkout</span>
              </div>
              
              <div className="summary-row">
                <span>Tax:</span>
                <span>Calculated at checkout</span>
              </div>
              
              <div className="summary-divider"></div>
              
              <div className="summary-row total">
                <span>Estimated Total:</span>
                <span>{formatPrice(cartTotal)}</span>
              </div>

              <Link 
                to={isAuthenticated ? "/checkout" : "/login"} 
                className="btn btn-primary checkout-btn"
              >
                {isAuthenticated ? 'Proceed to Checkout' : 'Login to Checkout'}
              </Link>

              <Link to="/products" className="btn btn-outline continue-shopping-btn">
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;