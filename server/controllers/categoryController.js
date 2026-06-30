import pool from '../config/db.js';

const getAllCategories = async (req, res) => {
  try {
    const [categories] = await pool.query('SELECT * FROM categories');
    for (let category of categories) {
      const [subcategories] = await pool.query('SELECT * FROM subcategories WHERE category_id = ?', [category.id]);
      category.subcategories = subcategories;
    }
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getCategoryById = async (req, res) => {
  try {
    const [categories] = await pool.query('SELECT * FROM categories WHERE id = ? OR slug = ?', [req.params.id, req.params.id]);
    if (categories.length === 0) {
      return res.status(404).json({ message: 'Category not found' });
    }
    const category = categories[0];
    const [subcategories] = await pool.query('SELECT * FROM subcategories WHERE category_id = ?', [category.id]);
    category.subcategories = subcategories;
    res.json(category);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const createCategory = async (req, res) => {
  try {
    const { name, slug, description, image } = req.body;
    const [result] = await pool.query(
      'INSERT INTO categories (name, slug, description, image) VALUES (?, ?, ?, ?)',
      [name, slug, description, image]
    );
    res.status(201).json({ message: 'Category created', categoryId: result.insertId });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const updateCategory = async (req, res) => {
  try {
    const { name, slug, description, image } = req.body;
    await pool.query(
      'UPDATE categories SET name=?, slug=?, description=?, image=? WHERE id=?',
      [name, slug, description, image, req.params.id]
    );
    res.json({ message: 'Category updated' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const deleteCategory = async (req, res) => {
  try {
    await pool.query('DELETE FROM categories WHERE id = ?', [req.params.id]);
    res.json({ message: 'Category deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getAllSubcategories = async (req, res) => {
  try {
    const [subcategories] = await pool.query('SELECT * FROM subcategories');
    res.json(subcategories);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const createSubcategory = async (req, res) => {
  try {
    const { category_id, name, slug } = req.body;
    const [result] = await pool.query(
      'INSERT INTO subcategories (category_id, name, slug) VALUES (?, ?, ?)',
      [category_id, name, slug]
    );
    res.status(201).json({ message: 'Subcategory created', subcategoryId: result.insertId });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const updateSubcategory = async (req, res) => {
  try {
    const { category_id, name, slug } = req.body;
    await pool.query(
      'UPDATE subcategories SET category_id=?, name=?, slug=? WHERE id=?',
      [category_id, name, slug, req.params.id]
    );
    res.json({ message: 'Subcategory updated' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const deleteSubcategory = async (req, res) => {
  try {
    await pool.query('DELETE FROM subcategories WHERE id = ?', [req.params.id]);
    res.json({ message: 'Subcategory deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
  getAllSubcategories,
  createSubcategory,
  updateSubcategory,
  deleteSubcategory
};