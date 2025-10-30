import React, { createContext, useContext, useEffect, useState } from 'react';
import { getFromLocalStorage, setToLocalStorage } from '../utils/localStorage';

const WishlistContext = createContext();

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) throw new Error('useWishlist must be used within a WishlistProvider');
  return context;
};

export const WishlistProvider = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [wishlistOpen, setWishlistOpen] = useState(false);

  // Load wishlist from localStorage on mount
  useEffect(() => {
    const stored = getFromLocalStorage('wishlist', []);
    setWishlistItems(stored || []);
  }, []);

  useEffect(() => {
    setToLocalStorage('wishlist', wishlistItems);
  }, [wishlistItems]);

  const addToWishlist = (product) => {
    const exists = wishlistItems.find(item => item.product_id === product.id);
    if (exists) return { success: false, message: 'Already in wishlist' };
    const newItem = {
      product_id: product.id,
      name: product.name,
      price: product.price,
      image_url: product.image_url
    };
    const updated = [...wishlistItems, newItem];
    setWishlistItems(updated);
    return { success: true };
  };

  const removeFromWishlist = (productId) => {
    const updated = wishlistItems.filter(i => i.product_id !== productId);
    setWishlistItems(updated);
    return { success: true };
  };

  const isInWishlist = (productId) => {
    return wishlistItems.some(i => i.product_id === productId);
  };

  const getWishlistCount = () => wishlistItems.length;

  const openWishlist = () => setWishlistOpen(true);
  const closeWishlist = () => setWishlistOpen(false);
  const toggleWishlist = () => setWishlistOpen(v => !v);

  const value = {
    wishlistItems,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    getWishlistCount,
    wishlistOpen,
    openWishlist,
    closeWishlist,
    toggleWishlist
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
};

export default WishlistContext;
