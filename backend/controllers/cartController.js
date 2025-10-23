const Cart = require('../models/Cart');

exports.getCart = async (req, res) => {
  try {
    const cartItems = await Cart.getCart(req.user.id);
    const total = await Cart.getCartTotal(req.user.id);
    
    res.json({
      items: cartItems,
      total: parseFloat(total.toFixed(2))
    });
  } catch (error) {
    console.error('Get cart error:', error);
    res.status(500).json({ message: 'Server error while fetching cart' });
  }
};

exports.addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;

    if (!productId) {
      return res.status(400).json({ message: 'Product ID is required' });
    }

    await Cart.addToCart(req.user.id, productId, quantity);
    const cartItems = await Cart.getCart(req.user.id);
    const total = await Cart.getCartTotal(req.user.id);

    res.json({
      message: 'Product added to cart',
      items: cartItems,
      total: parseFloat(total.toFixed(2))
    });
  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({ message: 'Server error while adding to cart' });
  }
};

exports.updateCartItem = async (req, res) => {
  try {
    const { productId } = req.params;
    const { quantity } = req.body;

    if (quantity === undefined) {
      return res.status(400).json({ message: 'Quantity is required' });
    }

    await Cart.updateCartItem(req.user.id, productId, quantity);
    const cartItems = await Cart.getCart(req.user.id);
    const total = await Cart.getCartTotal(req.user.id);

    res.json({
      message: 'Cart updated successfully',
      items: cartItems,
      total: parseFloat(total.toFixed(2))
    });
  } catch (error) {
    console.error('Update cart error:', error);
    res.status(500).json({ message: 'Server error while updating cart' });
  }
};

exports.removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;

    await Cart.removeFromCart(req.user.id, productId);
    const cartItems = await Cart.getCart(req.user.id);
    const total = await Cart.getCartTotal(req.user.id);

    res.json({
      message: 'Product removed from cart',
      items: cartItems,
      total: parseFloat(total.toFixed(2))
    });
  } catch (error) {
    console.error('Remove from cart error:', error);
    res.status(500).json({ message: 'Server error while removing from cart' });
  }
};

exports.clearCart = async (req, res) => {
  try {
    await Cart.clearCart(req.user.id);
    
    res.json({
      message: 'Cart cleared successfully',
      items: [],
      total: 0
    });
  } catch (error) {
    console.error('Clear cart error:', error);
    res.status(500).json({ message: 'Server error while clearing cart' });
  }
};