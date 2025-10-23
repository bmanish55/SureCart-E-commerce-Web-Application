import React from 'react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { formatPrice } from '../../utils/helpers';
import CartItem from './CartItem';
import './CartSidebar.css';

const CartSidebar = ({ isOpen, onClose, onCheckout }) => {
  const { cartItems, cartTotal, clearCart } = useCart();
  const { isAuthenticated } = useAuth();

  const handleCheckout = () => {
    onCheckout();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="cart-sidebar-backdrop" onClick={onClose}>
      <div className="cart-sidebar" onClick={e => e.stopPropagation()}>
        <div className="cart-header">
          <h2>Shopping Cart</h2>
          <button className="close-btn" onClick={onClose} aria-label="Close cart">
            <i className="fas fa-times"></i>
          </button>
        </div>

        <div className="cart-content">
          {cartItems.length === 0 ? (
            <div className="empty-cart">
              <i className="fas fa-shopping-cart"></i>
              <p>Your cart is empty</p>
              <button className="btn btn-primary" onClick={onClose}>
                Continue Shopping
              </button>
            </div>
          ) : (
            <>
              <div className="cart-items">
                {cartItems.map(item => (
                  <CartItem key={item.product_id} item={item} />
                ))}
              </div>

              <div className="cart-summary">
                <div className="cart-total">
                  <span>Subtotal:</span>
                  <span>{formatPrice(cartTotal)}</span>
                </div>
                <p className="shipping-note">Shipping calculated at checkout</p>

                <div className="cart-actions">
                  <button 
                    className="btn btn-primary checkout-btn"
                    onClick={handleCheckout}
                    disabled={!isAuthenticated}
                  >
                    {isAuthenticated ? 'Proceed to Checkout' : 'Login to Checkout'}
                  </button>
                  
                  <button 
                    className="btn btn-outline clear-cart-btn"
                    onClick={clearCart}
                  >
                    <i className="fas fa-trash"></i>
                    Clear Cart
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartSidebar;