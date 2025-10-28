const pool = require('../config/database');

class Cart {
  static async getCart(userId) {
    const [cartItems] = await pool.execute(
      `SELECT c.*, p.name, p.price, p.image_url, p.stock_quantity 
       FROM cart c 
       JOIN products p ON c.product_id = p.id 
       WHERE c.user_id = ?`,
      [userId]
    );
    return cartItems;
  }

  static async addToCart(userId, productId, quantity = 1) {
    // Check if item already exists in cart
    const [existingItems] = await pool.execute(
      'SELECT * FROM cart WHERE user_id = ? AND product_id = ?',
      [userId, productId]
    );

    if (existingItems.length > 0) {
      // Update quantity
      const [result] = await pool.execute(
        'UPDATE cart SET quantity = quantity + ? WHERE user_id = ? AND product_id = ?',
        [quantity, userId, productId]
      );
      return result;
    } else {
      // Add new item
      const [result] = await pool.execute(
        'INSERT INTO cart (user_id, product_id, quantity) VALUES (?, ?, ?)',
        [userId, productId, quantity]
      );
      return result;
    }
  }

  static async updateCartItem(userId, productId, quantity) {
    if (quantity <= 0) {
      return await this.removeFromCart(userId, productId);
    }

    const [result] = await pool.execute(
      'UPDATE cart SET quantity = ? WHERE user_id = ? AND product_id = ?',
      [quantity, userId, productId]
    );
    return result;
  }

  static async removeFromCart(userId, productId) {
    const [result] = await pool.execute(
      'DELETE FROM cart WHERE user_id = ? AND product_id = ?',
      [userId, productId]
    );
    return result;
  }

  static async clearCart(userId) {
    const [result] = await pool.execute(
      'DELETE FROM cart WHERE user_id = ?',
      [userId]
    );
    return result;
  }

  static async getCartTotal(userId) {
    // this.getCart returns an array of cart item objects
    const cartItems = await this.getCart(userId);
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  }
}

module.exports = Cart;