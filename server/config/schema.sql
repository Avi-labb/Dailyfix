CREATE DATABASE IF NOT EXISTS dailyfixcare;
USE dailyfixcare;

CREATE TABLE IF NOT EXISTS admins (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  image VARCHAR(255),
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS subcategories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  category_id INT NOT NULL,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  discount_price DECIMAL(10, 2),
  stock INT DEFAULT 0,
  sku VARCHAR(100),
  brand VARCHAR(100),
  category_id INT NOT NULL,
  subcategory_id INT,
  featured BOOLEAN DEFAULT false,
  best_seller BOOLEAN DEFAULT false,
  new_arrival BOOLEAN DEFAULT false,
  flash_sale BOOLEAN DEFAULT false,
  rating DECIMAL(3, 2) DEFAULT 0,
  reviews_count INT DEFAULT 0,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE,
  FOREIGN KEY (subcategory_id) REFERENCES subcategories(id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS product_images (
  id INT AUTO_INCREMENT PRIMARY KEY,
  product_id INT NOT NULL,
  image_path VARCHAR(255) NOT NULL,
  is_primary BOOLEAN DEFAULT false,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS customers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  first_name VARCHAR(255),
  last_name VARCHAR(255),
  email VARCHAR(255),
  phone VARCHAR(20),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id VARCHAR(50) NOT NULL UNIQUE,
  customer_id INT,
  total DECIMAL(10, 2) NOT NULL,
  tax DECIMAL(10, 2) DEFAULT 0,
  shipping DECIMAL(10, 2) DEFAULT 0,
  discount DECIMAL(10, 2) DEFAULT 0,
  status ENUM('Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled') DEFAULT 'Pending',
  payment_method VARCHAR(50),
  shipping_address TEXT,
  billing_address TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS order_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT NOT NULL,
  product_id INT NOT NULL,
  quantity INT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS banners (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255),
  subtitle VARCHAR(255),
  image VARCHAR(255),
  link VARCHAR(255),
  position INT DEFAULT 0,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS coupons (
  id INT AUTO_INCREMENT PRIMARY KEY,
  code VARCHAR(50) NOT NULL UNIQUE,
  discount_type ENUM('percentage', 'fixed') NOT NULL,
  discount_value DECIMAL(10, 2) NOT NULL,
  min_order_value DECIMAL(10, 2),
  max_discount DECIMAL(10, 2),
  usage_limit INT,
  used_count INT DEFAULT 0,
  valid_from DATETIME,
  valid_to DATETIME,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS settings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  key_name VARCHAR(100) NOT NULL UNIQUE,
  value TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO categories (name, slug, description) VALUES
('Medicines', 'medicines', 'Prescription and OTC medicines'),
('Personal Care', 'personal-care', 'Personal care and hygiene products'),
('Health Supplements', 'health-supplements', 'Vitamins, minerals, and nutritional supplements'),
('Healthcare Devices', 'healthcare-devices', 'Medical devices and equipment'),
('Baby Care', 'baby-care', 'Baby care products'),
('Beauty Products', 'beauty-products', 'Skincare, makeup, and beauty products'),
('Wellness Products', 'wellness-products', 'Wellness and fitness products'),
('Ayurvedic Products', 'ayurvedic-products', 'Ayurvedic and herbal products');

INSERT INTO subcategories (category_id, name, slug) VALUES
(1, 'Pain Relief', 'pain-relief'),
(1, 'Cold & Flu', 'cold-flu'),
(1, 'Diabetes Care', 'diabetes-care'),
(2, 'Oral Care', 'oral-care'),
(2, 'Skin Care', 'skin-care'),
(2, 'Hair Care', 'hair-care'),
(3, 'Vitamins', 'vitamins'),
(3, 'Minerals', 'minerals'),
(4, 'Blood Pressure Monitors', 'bp-monitors'),
(4, 'Thermometers', 'thermometers'),
(5, 'Diapers', 'diapers'),
(5, 'Baby Food', 'baby-food'),
(6, 'Face Wash', 'face-wash'),
(6, 'Moisturizers', 'moisturizers'),
(7, 'Fitness', 'fitness'),
(7, 'Yoga', 'yoga'),
(8, 'Herbal Medicines', 'herbal-medicines'),
(8, 'Herbal Teas', 'herbal-teas');

INSERT INTO products (name, slug, description, price, discount_price, stock, sku, brand, category_id, subcategory_id, featured, best_seller, new_arrival, flash_sale, rating) VALUES
('Paracetamol 500mg', 'paracetamol-500mg', 'Pain reliever and fever reducer', 25.00, 20.00, 100, 'MED001', 'Generic', 1, 1, true, true, false, false, 4.5),
('Ibuprofen 200mg', 'ibuprofen-200mg', 'Anti-inflammatory pain reliever', 35.00, NULL, 80, 'MED002', 'Generic', 1, 1, false, true, true, false, 4.3),
('Vitamin C Tablets', 'vitamin-c-tablets', 'Immunity booster', 150.00, 120.00, 200, 'SUP001', 'HealthPlus', 3, 7, true, false, true, true, 4.8),
('Digital Thermometer', 'digital-thermometer', 'Accurate temperature measurement', 250.00, 199.00, 50, 'DEV001', 'MedTech', 4, 10, true, true, false, false, 4.6),
('Herbal Tea - Chamomile', 'herbal-tea-chamomile', 'Calming herbal tea', 180.00, NULL, 60, 'AYU001', 'AyurLife', 8, 18, false, false, true, false, 4.4),
('Baby Diapers Size M', 'baby-diapers-size-m', 'Soft and absorbent diapers', 450.00, 399.00, 120, 'BAB001', 'LittleOne', 5, 11, true, true, false, true, 4.7);

INSERT INTO banners (title, subtitle, image, link, position) VALUES
('Summer Health Sale', 'Up to 50% off on all healthcare products', NULL, '/sale', 1),
('New Arrivals', 'Check out our latest products', NULL, '/new-arrivals', 2),
('Wellness Week', 'Special offers on wellness products', NULL, '/wellness', 3);

INSERT INTO coupons (code, discount_type, discount_value, min_order_value, usage_limit, valid_from, valid_to) VALUES
('WELCOME10', 'percentage', 10, 500, 100, NOW(), DATE_ADD(NOW(), INTERVAL 30 DAY)),
('SAVE20', 'percentage', 20, 1000, 50, NOW(), DATE_ADD(NOW(), INTERVAL 15 DAY)),
('FLAT50', 'fixed', 50, 300, 200, NOW(), DATE_ADD(NOW(), INTERVAL 7 DAY));