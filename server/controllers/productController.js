import pool from '../config/db.js';

const getAllProducts = async (req, res) => {
  try {
    const { category, subcategory, search, minPrice, maxPrice, brand, rating, sort, page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;
    
    let query = `
      SELECT p.*, c.name as category_name, s.name as subcategory_name 
      FROM products p 
      LEFT JOIN categories c ON p.category_id = c.id 
      LEFT JOIN subcategories s ON p.subcategory_id = s.id 
      WHERE 1=1
    `;
    const params = [];

    if (category) {
      query += ' AND p.category_id = ?';
      params.push(category);
    }
    if (subcategory) {
      query += ' AND p.subcategory_id = ?';
      params.push(subcategory);
    }
    if (search) {
      query += ' AND (p.name LIKE ? OR p.description LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }
    if (minPrice) {
      query += ' AND p.price >= ?';
      params.push(minPrice);
    }
    if (maxPrice) {
      query += ' AND p.price <= ?';
      params.push(maxPrice);
    }
    if (brand) {
      query += ' AND p.brand = ?';
      params.push(brand);
    }
    if (rating) {
      query += ' AND p.rating >= ?';
      params.push(rating);
    }

    if (sort === 'price-asc') {
      query += ' ORDER BY p.price ASC';
    } else if (sort === 'price-desc') {
      query += ' ORDER BY p.price DESC';
    } else if (sort === 'rating') {
      query += ' ORDER BY p.rating DESC';
    } else if (sort === 'newest') {
      query += ' ORDER BY p.created_at DESC';
    } else {
      query += ' ORDER BY p.id DESC';
    }

    query += ' LIMIT ? OFFSET ?';
    params.push(parseInt(limit), parseInt(offset));

    const [products] = await pool.query(query, params);

    for (let product of products) {
      const [images] = await pool.query('SELECT * FROM product_images WHERE product_id = ?', [product.id]);
      product.images = images;
    }

    const [countResult] = await pool.query(query.replace(/SELECT.*FROM/, 'SELECT COUNT(*) as total FROM').replace(/ORDER BY.*/, '').replace(/LIMIT.*/, ''), params.slice(0, -2));

    res.json({
      products,
      total: countResult[0].total,
      page: parseInt(page),
      totalPages: Math.ceil(countResult[0].total / limit)
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getProductById = async (req, res) => {
  try {
    const [products] = await pool.query('SELECT * FROM products WHERE id = ? OR slug = ?', [req.params.id, req.params.id]);
    if (products.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }
    const product = products[0];
    
    const [images] = await pool.query('SELECT * FROM product_images WHERE product_id = ?', [product.id]);
    product.images = images;

    const [related] = await pool.query(`
      SELECT * FROM products 
      WHERE category_id = ? AND id != ? 
      LIMIT 10
    `, [product.category_id, product.id]);

    product.relatedProducts = related;

    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getFeaturedProducts = async (req, res) => {
  try {
    const [products] = await pool.query('SELECT * FROM products WHERE featured = true LIMIT 10');
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getBestSellers = async (req, res) => {
  try {
    const [products] = await pool.query('SELECT * FROM products WHERE best_seller = true LIMIT 10');
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getNewArrivals = async (req, res) => {
  try {
    const [products] = await pool.query('SELECT * FROM products WHERE new_arrival = true LIMIT 10');
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getFlashSaleProducts = async (req, res) => {
  try {
    const [products] = await pool.query('SELECT * FROM products WHERE flash_sale = true LIMIT 10');
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const createProduct = async (req, res) => {
  try {
    const { name, slug, description, price, discount_price, stock, sku, brand, category_id, subcategory_id, featured, best_seller, new_arrival, flash_sale } = req.body;
    const [result] = await pool.query(
      'INSERT INTO products (name, slug, description, price, discount_price, stock, sku, brand, category_id, subcategory_id, featured, best_seller, new_arrival, flash_sale) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [name, slug, description, price, discount_price, stock, sku, brand, category_id, subcategory_id, featured || false, best_seller || false, new_arrival || false, flash_sale || false]
    );
    res.status(201).json({ message: 'Product created', productId: result.insertId });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const updateProduct = async (req, res) => {
  try {
    const { name, slug, description, price, discount_price, stock, sku, brand, category_id, subcategory_id, featured, best_seller, new_arrival, flash_sale } = req.body;
    await pool.query(
      'UPDATE products SET name=?, slug=?, description=?, price=?, discount_price=?, stock=?, sku=?, brand=?, category_id=?, subcategory_id=?, featured=?, best_seller=?, new_arrival=?, flash_sale=? WHERE id=?',
      [name, slug, description, price, discount_price, stock, sku, brand, category_id, subcategory_id, featured, best_seller, new_arrival, flash_sale, req.params.id]
    );
    res.json({ message: 'Product updated' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    await pool.query('DELETE FROM products WHERE id = ?', [req.params.id]);
    res.json({ message: 'Product deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export {
  getAllProducts,
  getProductById,
  getFeaturedProducts,
  getBestSellers,
  getNewArrivals,
  getFlashSaleProducts,
  createProduct,
  updateProduct,
  deleteProduct
};