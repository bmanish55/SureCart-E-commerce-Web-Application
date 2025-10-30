import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useWishlist } from '../../context/WishlistContext';
import { formatPrice } from '../../utils/helpers';
import './ProductCard.css';

const ProductCard = ({ product }) => {
  const [isAdding, setIsAdding] = useState(false);
  const { addToCart, openQuickCart } = useCart();
  const { addToWishlist, isInWishlist, openWishlist, removeFromWishlist } = useWishlist();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    // Allow adding to cart for both guests and authenticated users
    // (cartService will handle persistence: localStorage for guests, API for auth users)

    setIsAdding(true);
    try {
      await addToCart(product, 1);
      // open quick cart to show the recently added item
      openQuickCart();
    } catch (error) {
      console.error('Error adding to cart:', error);
    } finally {
      setIsAdding(false);
    }
  };

  const isOutOfStock = product.stock_quantity === 0;
  const inWishlist = isInWishlist(product.id);

  const handleAddToWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (inWishlist) {
      removeFromWishlist(product.id);
      return;
    }

    const res = addToWishlist(product);
    if (res.success) {
      // open the slide-down wishlist preview
      openWishlist();
    }
  };

  return (
    <div className="product-card card">
      <Link to={`/products/${product.id}`} className="product-link">
        <div className="product-image">
          <img 
            src={product.image_url || '/images/placeholder-product.jpg'} 
            alt={product.name}
            loading="lazy"
          />
          {isOutOfStock && (
            <div className="out-of-stock-badge">Out of Stock</div>
          )}
          {product.stock_quantity > 0 && product.stock_quantity < 10 && (
            <div className="low-stock-badge">Low Stock</div>
          )}
        </div>
        
        <div className="product-info">
          <h3 className="product-name">{product.name}</h3>
          <p className="product-description">
            {product.description.length > 100 
              ? `${product.description.substring(0, 100)}...` 
              : product.description
            }
          </p>
          
          <div className="product-meta">
            <span className="product-category">{product.category}</span>
            <span className="product-stock">
              {product.stock_quantity > 0 
                ? `${product.stock_quantity} in stock` 
                : 'Out of stock'
              }
            </span>
          </div>
          
            <div className="product-footer">
            <span className="product-price">{formatPrice(product.price)}</span>
            <div className="product-actions">
            <button
              className={`add-to-cart-btn ${isAdding ? 'adding' : ''} ${isOutOfStock ? 'disabled' : ''}`}
              onClick={handleAddToCart}
              disabled={isAdding || isOutOfStock}
              aria-label={`Add ${product.name} to cart`}
            >
              {isAdding ? (
                <i className="fas fa-spinner fa-spin"></i>
              ) : isOutOfStock ? (
                'Out of Stock'
              ) : (
                <>
                  <i className="fas fa-cart-plus"></i>
                  Add to Cart
                </>
              )}
            </button>
            <button
              className={`wishlist-btn ${inWishlist ? 'in-wishlist' : ''}`}
              onClick={handleAddToWishlist}
              aria-pressed={inWishlist}
              aria-label={inWishlist ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
            >
              {inWishlist ? (
                <>
                  <i className="fas fa-heart"></i>
                  Remove Wishlist
                </>
              ) : (
                <>
                  <i className="far fa-heart"></i>
                  Add to Wishlist
                </>
              )}
            </button>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;