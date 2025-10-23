const pool = require('../config/database');

class Product {
  static async findAll() {
    const [products] = await pool.execute(
      'SELECT * FROM products ORDER BY created_at DESC'
    );
    return products;
  }

  static async findById(id) {
    const [products] = await pool.execute(
      'SELECT * FROM products WHERE id = ?',
      [id]
    );
    return products[0];
  }

  static async findByCategory(category) {
    const [products] = await pool.execute(
      'SELECT * FROM products WHERE category = ? ORDER BY created_at DESC',
      [category]
    );
    return products;
  }

  static async searchProducts(query) {
    const [products] = await pool.execute(
      'SELECT * FROM products WHERE name LIKE ? OR description LIKE ? ORDER BY created_at DESC',
      [`%${query}%`, `%${query}%`]
    );
    return products;
  }

  static async getCategories() {
    const [categories] = await pool.execute(
      'SELECT DISTINCT category FROM products ORDER BY category'
    );
    return categories.map(cat => cat.category);
  }

  static async updateStock(productId, quantity) {
    await pool.execute(
      'UPDATE products SET stock_quantity = stock_quantity - ? WHERE id = ?',
      [quantity, productId]
    );
  }
}

module.exports = Product;