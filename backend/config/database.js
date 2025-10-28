const mysql = require('mysql2/promise');
require('dotenv').config();

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '845905',
  database: process.env.DB_NAME || 'ecommerce_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

const pool = mysql.createPool(dbConfig);

// Test database connection
async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('✅ Database connected successfully');
    connection.release();
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
  }
}

// Initialize database and tables
async function initializeDatabase() {
  try {
    // Create database if not exists
    // Use the dbConfig defaults/fallbacks so the initializer works even when .env is not set
    const connection = await mysql.createConnection({
      host: dbConfig.host,
      user: dbConfig.user,
      password: dbConfig.password
    });
    
    await connection.execute(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME}`);
    await connection.end();
    
    console.log('✅ Database created or already exists');
    
    // Create tables
    await createTables();
  } catch (error) {
    console.error('❌ Database initialization error:', error);
  }
}

async function createTables() {
  try {
    // Users table
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Products table
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS products (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        price DECIMAL(10, 2) NOT NULL,
        category VARCHAR(100) NOT NULL,
        image_url VARCHAR(500),
        stock_quantity INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Cart table
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS cart (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT,
        product_id INT,
        quantity INT NOT NULL DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
        UNIQUE KEY unique_cart_item (user_id, product_id)
      )
    `);

    // Orders table
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS orders (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT,
        total_amount DECIMAL(10, 2) NOT NULL,
        status ENUM('pending', 'completed', 'cancelled') DEFAULT 'pending',
        shipping_address TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id)
      )
    `);

    // Order items table
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS order_items (
        id INT AUTO_INCREMENT PRIMARY KEY,
        order_id INT,
        product_id INT,
        quantity INT NOT NULL,
        price DECIMAL(10, 2) NOT NULL,
        FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
        FOREIGN KEY (product_id) REFERENCES products(id)
      )
    `);

    console.log('✅ All tables created successfully');
    
    // Insert sample data
    await insertSampleData();
  } catch (error) {
    console.error('❌ Table creation error:', error);
  }
}

async function insertSampleData() {
  try {
    // Check if users already exist
    const [users] = await pool.execute('SELECT COUNT(*) as count FROM users');
    
    // Create demo user if no users exist
    if (users[0].count === 0) {
      const bcrypt = require('bcryptjs');
      const hashedPassword = await bcrypt.hash('password123', 10);
      
      await pool.execute(
        'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
        ['Demo User', 'demo@example.com', hashedPassword]
      );
      console.log('✅ Demo user created successfully');
      
      // Create a second test user
      const hashedPassword2 = await bcrypt.hash('test123', 10);
      await pool.execute(
        'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
        ['Test User', 'test@example.com', hashedPassword2]
      );
      console.log('✅ Test user created successfully');
    }

    // Check if products already exist
    const [products] = await pool.execute('SELECT COUNT(*) as count FROM products');
    if (products[0].count > 0) {
      console.log('✅ Sample data already exists');
      return;
    }

    const sampleProducts = [
      {
        name: "Wireless Bluetooth Headphones",
        description: "High-quality wireless headphones with noise cancellation. Perfect for music lovers and professionals.",
        price: 4999, // ₹4,999
        category: "Electronics",
        image_url: "/images/headphones.jpg",
        stock_quantity: 50
      },
      {
        name: "Smart Fitness Watch",
        description: "Advanced fitness tracking with heart rate monitor, GPS, and 7-day battery life.",
        price: 12999, // ₹12,999
        category: "Electronics",
        image_url: "/images/smartwatch.jpg",
        stock_quantity: 30
      },
      {
        name: "Cotton T-Shirt",
        description: "Comfortable 100% cotton t-shirt available in multiple colors. Machine washable.",
        price: 899, // ₹899
        category: "Clothing",
        image_url: "/images/tshirt.jpg",
        stock_quantity: 100
      },
      {
        name: "Professional Coffee Maker",
        description: "Programmable coffee maker with thermal carafe and built-in grinder.",
        price: 5999, // ₹5,999
        category: "Home",
        image_url: "/images/coffeemaker.jpg",
        stock_quantity: 25
      },
      {
        name: "Running Shoes",
        description: "Lightweight running shoes with advanced cushioning technology for maximum comfort.",
        price: 4599, // ₹4,599
        category: "Sports",
        image_url: "/images/shoes.jpg",
        stock_quantity: 40
      },
      {
        name: "Waterproof Backpack",
        description: "Water-resistant backpack with laptop compartment and multiple organizational pockets.",
        price: 2499, // ₹2,499
        category: "Accessories",
        image_url: "/images/backpack.jpg",
        stock_quantity: 60
      },
      {
        name: "Wireless Mouse",
        description: "Ergonomic wireless mouse with precision tracking and long battery life.",
        price: 1499, // ₹1,499
        category: "Electronics",
        image_url: "/images/mouse.jpg",
        stock_quantity: 75
      },
      {
        name: "Yoga Mat",
        description: "Non-slip yoga mat with carrying strap. Perfect for yoga and exercise routines.",
        price: 1299, // ₹1,299
        category: "Sports",
        image_url: "/images/yogamat.jpg",
        stock_quantity: 80
      },
      {
        name: "Smartphone",
        description: "Latest smartphone with high-resolution camera and fast processor.",
        price: 25999, // ₹25,999
        category: "Electronics",
        image_url: "/images/smartphone.jpg",
        stock_quantity: 20
      },
      {
        name: "Jeans",
        description: "Comfortable denim jeans with perfect fit and modern style.",
        price: 1599, // ₹1,599
        category: "Clothing",
        image_url: "/images/jeans.jpg",
        stock_quantity: 75
      },
      {
        name: "Study Table",
        description: "Ergonomic study table with ample storage space.",
        price: 7999, // ₹7,999
        category: "Home",
        image_url: "/images/study-table.jpg",
        stock_quantity: 15
      },
      {
        name: "Cricket Bat",
        description: "Professional grade cricket bat with excellent grip.",
        price: 3499, // ₹3,499
        category: "Sports",
        image_url: "/images/cricket-bat.jpg",
        stock_quantity: 30
      }
    ];

    for (const product of sampleProducts) {
      await pool.execute(
        'INSERT INTO products (name, description, price, category, image_url, stock_quantity) VALUES (?, ?, ?, ?, ?, ?)',
        [product.name, product.description, product.price, product.category, product.image_url, product.stock_quantity]
      );
    }

    console.log('✅ Sample products inserted successfully');
  } catch (error) {
    console.error('❌ Error inserting sample data:', error);
  }
}

// Initialize when module loads
initializeDatabase();
testConnection();

module.exports = pool;