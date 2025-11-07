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
    
    // Drop database if exists (to refresh schema during development)
    await connection.execute(`DROP DATABASE IF EXISTS ${process.env.DB_NAME || 'ecommerce_db'}`);
    
    await connection.execute(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME || 'ecommerce_db'}`);
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
        subcategory VARCHAR(100),
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
    // Note: Demo users are no longer created automatically
    // Users must register through the application

    // Check if products already exist
    const [products] = await pool.execute('SELECT COUNT(*) as count FROM products');
    if (products[0].count > 0) {
      console.log('✅ Sample data already exists');
      return;
    }

    const sampleProducts = [
      // Electronics - Mobile And Tablets
      {
        name: "iPhone 14 Pro",
        description: "Latest iPhone with advanced camera and processor. Perfect for photography and gaming.",
        price: 89999,
        category: "Electronics",
        subcategory: "Mobile And Tablets",
        image_url: "/images/iphone.jpg",
        stock_quantity: 20
      },
      {
        name: "Samsung Galaxy S23",
        description: "Flagship Android smartphone with stunning display and performance.",
        price: 79999,
        category: "Electronics",
        subcategory: "Mobile And Tablets",
        image_url: "/images/samsung.jpg",
        stock_quantity: 25
      },
      {
        name: "iPad Air",
        description: "Powerful tablet for work and entertainment with M1 chip.",
        price: 59999,
        category: "Electronics",
        subcategory: "Mobile And Tablets",
        image_url: "/images/ipad.jpg",
        stock_quantity: 15
      },
      {
        name: "OnePlus 11",
        description: "Fast and smooth Android phone with 5G connectivity.",
        price: 49999,
        category: "Electronics",
        subcategory: "Mobile And Tablets",
        image_url: "/images/oneplus.jpg",
        stock_quantity: 30
      },

      // Electronics - Computer and Laptops
      {
        name: "Dell XPS 13 Laptop",
        description: "Ultra-slim laptop with Intel Core i7 processor and 16GB RAM. Perfect for professionals.",
        price: 99999,
        category: "Electronics",
        subcategory: "Computer and Laptops",
        image_url: "/images/dell-xps.jpg",
        stock_quantity: 15
      },
      {
        name: "MacBook Pro 14",
        description: "Powerful laptop with Apple M2 chip and stunning Retina display.",
        price: 149999,
        category: "Electronics",
        subcategory: "Computer and Laptops",
        image_url: "/images/macbook.jpg",
        stock_quantity: 12
      },
      {
        name: "HP Pavilion Gaming Laptop",
        description: "Gaming laptop with RTX 3050 graphics and high refresh rate display.",
        price: 79999,
        category: "Electronics",
        subcategory: "Computer and Laptops",
        image_url: "/images/hp-gaming.jpg",
        stock_quantity: 18
      },

      // Electronics - Audio and Wearables
      {
        name: "Sony WH-1000XM5 Headphones",
        description: "Premium noise-cancelling headphones with industry-leading sound quality.",
        price: 29999,
        category: "Electronics",
        subcategory: "Audio and Wearables",
        image_url: "/images/sony-headphones.jpg",
        stock_quantity: 25
      },
      {
        name: "Apple Watch Series 8",
        description: "Advanced fitness tracking with health monitoring and always-on display.",
        price: 45999,
        category: "Electronics",
        subcategory: "Audio and Wearables",
        image_url: "/images/apple-watch.jpg",
        stock_quantity: 20
      },
      {
        name: "Samsung Galaxy Buds Pro",
        description: "True wireless earbuds with active noise cancellation and premium sound.",
        price: 16999,
        category: "Electronics",
        subcategory: "Audio and Wearables",
        image_url: "/images/samsung-buds.jpg",
        stock_quantity: 35
      },

      // Sports - Cricket
      {
        name: "Professional Cricket Bat",
        description: "Premium cricket bat made with English willow. Excellent grip and balance.",
        price: 8999,
        category: "Sports",
        subcategory: "Cricket",
        image_url: "/images/cricket-bat.jpg",
        stock_quantity: 20
      },
      {
        name: "Cricket Ball Set",
        description: "Professional cricket balls set of 6 with leather cover.",
        price: 1299,
        category: "Sports",
        subcategory: "Cricket",
        image_url: "/images/cricket-ball.jpg",
        stock_quantity: 50
      },
      {
        name: "Cricket Helmet",
        description: "Safety cricket helmet with protective visor and comfortable padding.",
        price: 2499,
        category: "Sports",
        subcategory: "Cricket",
        image_url: "/images/cricket-helmet.jpg",
        stock_quantity: 30
      },

      // Sports - Football
      {
        name: "Professional Football",
        description: "Regulation size football for professional matches with superior grip.",
        price: 1899,
        category: "Sports",
        subcategory: "Football",
        image_url: "/images/football.jpg",
        stock_quantity: 40
      },
      {
        name: "Football Boots",
        description: "Premium football boots with enhanced traction and comfort.",
        price: 4999,
        category: "Sports",
        subcategory: "Football",
        image_url: "/images/football-boots.jpg",
        stock_quantity: 25
      },
      {
        name: "Football Shin Guards",
        description: "Protective shin guards for safe and comfortable play.",
        price: 999,
        category: "Sports",
        subcategory: "Football",
        image_url: "/images/shin-guards.jpg",
        stock_quantity: 35
      },

      // Sports - Basketball
      {
        name: "Professional Basketball",
        description: "Official size basketball with superior grip and durability.",
        price: 2299,
        category: "Sports",
        subcategory: "Basketball",
        image_url: "/images/basketball.jpg",
        stock_quantity: 30
      },
      {
        name: "Basketball Shoes",
        description: "High-performance basketball shoes with ankle support.",
        price: 5999,
        category: "Sports",
        subcategory: "Basketball",
        image_url: "/images/basketball-shoes.jpg",
        stock_quantity: 20
      },
      {
        name: "Basketball Socks",
        description: "Comfortable basketball socks with arch support and cushioning.",
        price: 599,
        category: "Sports",
        subcategory: "Basketball",
        image_url: "/images/basketball-socks.jpg",
        stock_quantity: 50
      },

      // Sports - Tennis
      {
        name: "Professional Tennis Racket",
        description: "Carbon fiber tennis racket with superior control and power.",
        price: 7999,
        category: "Sports",
        subcategory: "Tennis",
        image_url: "/images/tennis-racket.jpg",
        stock_quantity: 15
      },
      {
        name: "Tennis Ball Set",
        description: "Can of 3 professional tennis balls with excellent performance.",
        price: 399,
        category: "Sports",
        subcategory: "Tennis",
        image_url: "/images/tennis-ball.jpg",
        stock_quantity: 60
      },
      {
        name: "Tennis Shoes",
        description: "Specialized tennis shoes designed for court play.",
        price: 4499,
        category: "Sports",
        subcategory: "Tennis",
        image_url: "/images/tennis-shoes.jpg",
        stock_quantity: 25
      },

      // Sports - Badminton
      {
        name: "Professional Badminton Racket",
        description: "Lightweight badminton racket perfect for competitive play.",
        price: 2999,
        category: "Sports",
        subcategory: "Badminton",
        image_url: "/images/badminton-racket.jpg",
        stock_quantity: 35
      },
      {
        name: "Badminton Shuttle Cock",
        description: "Pack of 10 professional badminton shuttles with feather.",
        price: 499,
        category: "Sports",
        subcategory: "Badminton",
        image_url: "/images/shuttle.jpg",
        stock_quantity: 80
      },
      {
        name: "Badminton Net",
        description: "Professional badminton net with adjustable stand.",
        price: 3499,
        category: "Sports",
        subcategory: "Badminton",
        image_url: "/images/badminton-net.jpg",
        stock_quantity: 10
      },

      // Clothing - Mens
      {
        name: "Premium Cotton T-Shirt",
        description: "Comfortable 100% cotton t-shirt for men in various colors.",
        price: 899,
        category: "Clothing",
        subcategory: "Mens",
        image_url: "/images/mens-tshirt.jpg",
        stock_quantity: 100
      },
      {
        name: "Casual Denim Jeans",
        description: "Comfortable denim jeans with perfect fit and modern style.",
        price: 1599,
        category: "Clothing",
        subcategory: "Mens",
        image_url: "/images/mens-jeans.jpg",
        stock_quantity: 75
      },
      {
        name: "Formal Shirt",
        description: "Premium formal shirt perfect for office and occasions.",
        price: 1299,
        category: "Clothing",
        subcategory: "Mens",
        image_url: "/images/formal-shirt.jpg",
        stock_quantity: 50
      },

      // Clothing - Womens
      {
        name: "Women's Cotton Dress",
        description: "Elegant cotton dress perfect for casual and formal occasions.",
        price: 1499,
        category: "Clothing",
        subcategory: "Womens",
        image_url: "/images/womens-dress.jpg",
        stock_quantity: 60
      },
      {
        name: "Women's Denim Jeans",
        description: "Stylish women's denim jeans with comfortable fit.",
        price: 1799,
        category: "Clothing",
        subcategory: "Womens",
        image_url: "/images/womens-jeans.jpg",
        stock_quantity: 70
      },
      {
        name: "Women's Tops",
        description: "Trendy women's tops in various colors and designs.",
        price: 799,
        category: "Clothing",
        subcategory: "Womens",
        image_url: "/images/womens-tops.jpg",
        stock_quantity: 80
      },

      // Clothing - Kids
      {
        name: "Kids T-Shirt",
        description: "Colorful t-shirt for kids made from soft cotton.",
        price: 499,
        category: "Clothing",
        subcategory: "Kids",
        image_url: "/images/kids-tshirt.jpg",
        stock_quantity: 120
      },
      {
        name: "Kids Shorts",
        description: "Comfortable shorts for kids perfect for play and casual wear.",
        price: 699,
        category: "Clothing",
        subcategory: "Kids",
        image_url: "/images/kids-shorts.jpg",
        stock_quantity: 90
      },
      {
        name: "Kids Jacket",
        description: "Warm and stylish jacket for kids in various sizes.",
        price: 1299,
        category: "Clothing",
        subcategory: "Kids",
        image_url: "/images/kids-jacket.jpg",
        stock_quantity: 50
      },

      // Additional products (Home, Accessories, etc)
      {
        name: "Wireless Bluetooth Headphones",
        description: "High-quality wireless headphones with noise cancellation.",
        price: 4999,
        category: "Electronics",
        subcategory: null,
        image_url: "/images/headphones.jpg",
        stock_quantity: 50
      },
      {
        name: "Professional Coffee Maker",
        description: "Programmable coffee maker with thermal carafe.",
        price: 5999,
        category: "Home",
        subcategory: null,
        image_url: "/images/coffeemaker.jpg",
        stock_quantity: 25
      },
      {
        name: "Waterproof Backpack",
        description: "Water-resistant backpack with laptop compartment.",
        price: 2499,
        category: "Accessories",
        subcategory: null,
        image_url: "/images/backpack.jpg",
        stock_quantity: 60
      }
    ];

    for (const product of sampleProducts) {
      await pool.execute(
        'INSERT INTO products (name, description, price, category, subcategory, image_url, stock_quantity) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [product.name, product.description, product.price, product.category, product.subcategory, product.image_url, product.stock_quantity]
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