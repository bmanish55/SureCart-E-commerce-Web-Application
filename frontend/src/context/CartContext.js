import React, { createContext, useState, useContext, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { cartService } from '../services/cartService';
import { getCartFromStorage, saveCartToStorage, clearCartFromStorage } from '../utils/localStorage';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [cartTotal, setCartTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated, user } = useAuth();

  // Load cart from appropriate source (localStorage or API)
  useEffect(() => {
    const loadCart = async () => {
      setLoading(true);
      try {
        if (isAuthenticated) {
          // Load from API for authenticated users
          const response = await cartService.getCart();
          setCartItems(response.items || []);
          setCartTotal(response.total || 0);
        } else {
          // Load from localStorage for guests
          const localCart = getCartFromStorage();
          setCartItems(localCart);
          calculateTotal(localCart);
        }
      } catch (error) {
        console.error('Error loading cart:', error);
      } finally {
        setLoading(false);
      }
    };

    loadCart();
  }, [isAuthenticated, user]);

  const calculateTotal = (items) => {
    const total = items.reduce((sum, item) => {
      return sum + (item.price * item.quantity);
    }, 0);
    setCartTotal(parseFloat(total.toFixed(2)));
  };

  const addToCart = async (product, quantity = 1) => {
    try {
      let updatedItems;

      if (isAuthenticated) {
        // Add to cart via API
        const response = await cartService.addToCart(product.id, quantity);
        updatedItems = response.items;
        setCartTotal(response.total);
      } else {
        // Add to localStorage for guests
        const existingItemIndex = cartItems.findIndex(item => item.product_id === product.id);
        
        if (existingItemIndex > -1) {
          updatedItems = cartItems.map((item, index) =>
            index === existingItemIndex
              ? { ...item, quantity: item.quantity + quantity }
              : item
          );
        } else {
          const newItem = {
            product_id: product.id,
            quantity,
            name: product.name,
            price: product.price,
            image_url: product.image_url,
            stock_quantity: product.stock_quantity
          };
          updatedItems = [...cartItems, newItem];
        }

        saveCartToStorage(updatedItems);
        calculateTotal(updatedItems);
      }

      setCartItems(updatedItems || cartItems);
      return { success: true };
    } catch (error) {
      console.error('Error adding to cart:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Failed to add to cart' 
      };
    }
  };

  const updateCartItem = async (productId, quantity) => {
    try {
      let updatedItems;

      if (isAuthenticated) {
        const response = await cartService.updateCartItem(productId, quantity);
        updatedItems = response.items;
        setCartTotal(response.total);
      } else {
        if (quantity <= 0) {
          return removeFromCart(productId);
        }

        updatedItems = cartItems.map(item =>
          item.product_id === productId
            ? { ...item, quantity }
            : item
        );

        saveCartToStorage(updatedItems);
        calculateTotal(updatedItems);
      }

      setCartItems(updatedItems);
      return { success: true };
    } catch (error) {
      console.error('Error updating cart:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Failed to update cart' 
      };
    }
  };

  const removeFromCart = async (productId) => {
    try {
      let updatedItems;

      if (isAuthenticated) {
        const response = await cartService.removeFromCart(productId);
        updatedItems = response.items;
        setCartTotal(response.total);
      } else {
        updatedItems = cartItems.filter(item => item.product_id !== productId);
        saveCartToStorage(updatedItems);
        calculateTotal(updatedItems);
      }

      setCartItems(updatedItems);
      return { success: true };
    } catch (error) {
      console.error('Error removing from cart:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Failed to remove from cart' 
      };
    }
  };

  const clearCart = async () => {
    try {
      if (isAuthenticated) {
        await cartService.clearCart();
      } else {
        clearCartFromStorage();
      }

      setCartItems([]);
      setCartTotal(0);
      return { success: true };
    } catch (error) {
      console.error('Error clearing cart:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Failed to clear cart' 
      };
    }
  };

  const getCartItemCount = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const value = {
    cartItems,
    cartTotal,
    loading,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    getCartItemCount
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};