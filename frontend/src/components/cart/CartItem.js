import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { formatPrice } from '../../utils/helpers';
import './CartItem.css';

const CartItem = ({ item }) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const { updateCartItem, removeFromCart } = useCart();

  const handleQuantityChange = async (newQuantity) => {
    if (newQuantity === item.quantity) return;

    setIsUpdating(true);
    try {
      await updateCartItem(item.product_id, newQuantity);
    } catch (error) {
      console.error('Error updating cart item:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleRemove = async () => {
    setIsUpdating(true);
    try {
      await removeFromCart(item.product_id);
    } catch (error) {
      console.error('Error removing cart item:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const incrementQuantity = () => {
    if (item.quantity < item.stock_quantity) {
      handleQuantityChange(item.quantity + 1);
    }
  };

  const decrementQuantity = () => {
    if (item.quantity > 1) {
      handleQuantityChange(item.quantity - 1);
    }
  };

  const totalPrice = item.price * item.quantity;

  return (
    <div className={`cart-item ${isUpdating ? 'updating' : ''}`}>
      <div className="cart-item-image">
        <img 
          src={item.image_url || '/images/placeholder-product.jpg'} 
          alt={item.name}
        />
      </div>
      
      <div className="cart-item-details">
        <h4 className="cart-item-name">{item.name}</h4>
        <p className="cart-item-price">{formatPrice(item.price)}</p>
        
        <div className="cart-item-controls">
          <div className="quantity-controls">
            <button
              className="quantity-btn"
              onClick={decrementQuantity}
              disabled={isUpdating || item.quantity <= 1}
              aria-label="Decrease quantity"
            >
              <i className="fas fa-minus"></i>
            </button>
            
            <span className="quantity-display">{item.quantity}</span>
            
            <button
              className="quantity-btn"
              onClick={incrementQuantity}
              disabled={isUpdating || item.quantity >= item.stock_quantity}
              aria-label="Increase quantity"
            >
              <i className="fas fa-plus"></i>
            </button>
          </div>
          
          <button
            className="remove-btn"
            onClick={handleRemove}
            disabled={isUpdating}
            aria-label="Remove item from cart"
          >
            <i className="fas fa-trash"></i>
          </button>
        </div>
        
        <div className="cart-item-total">
          Total: {formatPrice(totalPrice)}
        </div>
      </div>
      
      {isUpdating && (
        <div className="updating-overlay">
          <i className="fas fa-spinner fa-spin"></i>
        </div>
      )}
    </div>
  );
};

export default CartItem;