import Category from '../models/Category.js';
import Subcategory from '../models/Subcategory.js';

const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    const categoriesWithSubcategories = [];
    for (let category of categories) {
      const subcategories = await Subcategory.find({ category: category._id });
      categoriesWithSubcategories.push({ ...category.toObject(), subcategories });
    }
    res.json(categoriesWithSubcategories);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getCategoryById = async (req, res) => {
  try {
    const category = await Category.findOne({ $or: [{ _id: req.params.id }, { slug: req.params.id }] });
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    const subcategories = await Subcategory.find({ category: category._id });
    res.json({ ...category.toObject(), subcategories });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const createCategory = async (req, res) => {
  try {
    const { name, slug, description, image } = req.body;
    const category = new Category({ name, slug, description, image });
    await category.save();
    res.status(201).json({ message: 'Category created', categoryId: category._id });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const updateCategory = async (req, res) => {
  try {
    const { name, slug, description, image } = req.body;
    await Category.findByIdAndUpdate(req.params.id, { name, slug, description, image });
    res.json({ message: 'Category updated' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const deleteCategory = async (req, res) => {
  try {
    await Category.findByIdAndDelete(req.params.id);
    await Subcategory.deleteMany({ category: req.params.id });
    res.json({ message: 'Category deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getAllSubcategories = async (req, res) => {
  try {
    const subcategories = await Subcategory.find();
    res.json(subcategories);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const createSubcategory = async (req, res) => {
  try {
    const { category, name, slug } = req.body;
    const subcategory = new Subcategory({ category, name, slug });
    await subcategory.save();
    res.status(201).json({ message: 'Subcategory created', subcategoryId: subcategory._id });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const updateSubcategory = async (req, res) => {
  try {
    const { category, name, slug } = req.body;
    await Subcategory.findByIdAndUpdate(req.params.id, { category, name, slug });
    res.json({ message: 'Subcategory updated' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const deleteSubcategory = async (req, res) => {
  try {
    await Subcategory.findByIdAndDelete(req.params.id);
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
