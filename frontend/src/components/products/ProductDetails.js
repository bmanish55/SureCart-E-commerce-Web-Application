import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { formatPrice } from '../../utils/helpers';
import './ProductDetails.css';

const ProductDetails = ({ product }) => {
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const { addToCart, openQuickCart } = useCart();
  const { isAuthenticated } = useAuth();

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    if (value > 0 && value <= product.stock_quantity) {
      setQuantity(value);
    }
  };

  const handleAddToCart = async () => {
    // Allow adding to cart for both guests and authenticated users
    setIsAdding(true);
    try {
      await addToCart(product, quantity);
      setQuantity(1);
      // open quick cart preview if available
      if (openQuickCart) openQuickCart();
      // Show success message (could be a toast)
    } catch (error) {
      console.error('Error adding to cart:', error);
    } finally {
      setIsAdding(false);
    }
  };

  const isOutOfStock = product.stock_quantity === 0;

  return (
    <div className="product-details">
      <div className="product-details-grid">
        <div className="product-image-section">
          <img 
            src={product.image_url || '/images/placeholder-product.jpg'} 
            alt={product.name}
            className="product-detail-image"
          />
        </div>
        
        <div className="product-info-section">
          <div className="product-header">
            <h1 className="product-title">{product.name}</h1>
            <span className="product-category">{product.category}</span>
          </div>
          
          <div className="product-price-section">
            <span className="product-price">{formatPrice(product.price)}</span>
            <div className="stock-status">
              {isOutOfStock ? (
                <span className="out-of-stock">Out of Stock</span>
              ) : (
                <span className="in-stock">
                  {product.stock_quantity} in stock
                </span>
              )}
            </div>
          </div>
          
          <div className="product-description-section">
            <h3>Description</h3>
            <p>{product.description}</p>
          </div>
          
          {!isOutOfStock && (
            <div className="purchase-section">
              <div className="quantity-selector">
                <label htmlFor="quantity">Quantity:</label>
                <input
                  id="quantity"
                  type="number"
                  min="1"
                  max={product.stock_quantity}
                  value={quantity}
                  onChange={handleQuantityChange}
                  className="quantity-input"
                />
              </div>
              
              <button
                className={`add-to-cart-btn large ${isAdding ? 'adding' : ''}`}
                onClick={handleAddToCart}
                disabled={isAdding || !isAuthenticated}
              >
                {isAdding ? (
                  <>
                    <i className="fas fa-spinner fa-spin"></i>
                    Adding...
                  </>
                ) : !isAuthenticated ? (
                  'Login to Purchase'
                ) : (
                  <>
                    <i className="fas fa-cart-plus"></i>
                    Add to Cart - {formatPrice(product.price * quantity)}
                  </>
                )}
              </button>
            </div>
          )}
          
          <div className="product-features">
            <div className="feature">
              <i className="fas fa-shipping-fast"></i>
              <span>Free shipping on orders over $50</span>
            </div>
            <div className="feature">
              <i className="fas fa-undo"></i>
              <span>30-day return policy</span>
            </div>
            <div className="feature">
              <i className="fas fa-shield-alt"></i>
              <span>Secure checkout</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;