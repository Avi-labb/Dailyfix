import Product from '../models/Product.js';
import mongoose from 'mongoose';

const getAllProducts = async (req, res) => {
  try {
    const { search, minPrice, maxPrice, brand, sort, page = 1, limit = 20 } = req.query;
    const skip = (page - 1) * limit;
    
    const filter = {};

    if (search) filter.$or = [{ name: { $regex: search, $options: 'i' } }, { description: { $regex: search, $options: 'i' } }];
    if (minPrice) filter.price = { ...filter.price, $gte: parseFloat(minPrice) };
    if (maxPrice) filter.price = { ...filter.price, $lte: parseFloat(maxPrice) };
    if (brand) filter.brand = brand;

    let sortOption = { _id: -1 };
    if (sort === 'price-asc') sortOption = { price: 1 };
    else if (sort === 'price-desc') sortOption = { price: -1 };
    else if (sort === 'newest') sortOption = { createdAt: -1 };

    const products = await Product.find(filter)
      .sort(sortOption)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Product.countDocuments(filter);

    res.json({
      products,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / limit)
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getProductById = async (req, res) => {
  try {
    const query = {};
    if (mongoose.isValidObjectId(req.params.id)) {
      query.$or = [{ _id: req.params.id }, { slug: req.params.id }];
    } else {
      query.slug = req.params.id;
    }
    const product = await Product.findOne(query);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const createProduct = async (req, res) => {
  try {
    const { name, slug, description, price, stock, sku, brand, image } = req.body;
    const product = new Product({
      name,
      slug,
      description,
      price,
      stock,
      sku,
      brand,
      image
    });
    await product.save();
    res.status(201).json({ message: 'Product created', productId: product._id });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const updateProduct = async (req, res) => {
  try {
    const { name, slug, description, price, stock, sku, brand, image } = req.body;
    await Product.findByIdAndUpdate(req.params.id, {
      name,
      slug,
      description,
      price,
      stock,
      sku,
      brand,
      image
    });
    res.json({ message: 'Product updated' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Product deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
};
