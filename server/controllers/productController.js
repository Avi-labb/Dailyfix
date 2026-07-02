import Product from '../models/Product.js';
import ProductImage from '../models/ProductImage.js';

const getAllProducts = async (req, res) => {
  try {
    const { category, subcategory, search, minPrice, maxPrice, brand, rating, sort, page = 1, limit = 20 } = req.query;
    const skip = (page - 1) * limit;
    
    const filter = {};

    if (category) filter.category = category;
    if (subcategory) filter.subcategory = subcategory;
    if (search) filter.$or = [{ name: { $regex: search, $options: 'i' } }, { description: { $regex: search, $options: 'i' } }];
    if (minPrice) filter.price = { ...filter.price, $gte: parseFloat(minPrice) };
    if (maxPrice) filter.price = { ...filter.price, $lte: parseFloat(maxPrice) };
    if (brand) filter.brand = brand;
    if (rating) filter.rating = { $gte: parseFloat(rating) };

    let sortOption = { _id: -1 };
    if (sort === 'price-asc') sortOption = { price: 1 };
    else if (sort === 'price-desc') sortOption = { price: -1 };
    else if (sort === 'rating') sortOption = { rating: -1 };
    else if (sort === 'newest') sortOption = { createdAt: -1 };

    const products = await Product.find(filter)
      .populate('category', 'name')
      .populate('subcategory', 'name')
      .sort(sortOption)
      .skip(skip)
      .limit(parseInt(limit));

    const productsWithImages = [];
    for (let product of products) {
      const images = await ProductImage.find({ product: product._id });
      productsWithImages.push({ ...product.toObject(), images });
    }

    const total = await Product.countDocuments(filter);

    res.json({
      products: productsWithImages,
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
    const product = await Product.findOne({ $or: [{ _id: req.params.id }, { slug: req.params.id }] })
      .populate('category', 'name')
      .populate('subcategory', 'name');
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    const images = await ProductImage.find({ product: product._id });
    const relatedProducts = await Product.find({ category: product.category._id, _id: { $ne: product._id } }).limit(10);

    res.json({ ...product.toObject(), images, relatedProducts });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getFeaturedProducts = async (req, res) => {
  try {
    const products = await Product.find({ featured: true }).limit(10);
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getBestSellers = async (req, res) => {
  try {
    const products = await Product.find({ bestSeller: true }).limit(10);
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getNewArrivals = async (req, res) => {
  try {
    const products = await Product.find({ newArrival: true }).limit(10);
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getFlashSaleProducts = async (req, res) => {
  try {
    const products = await Product.find({ flashSale: true }).limit(10);
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const createProduct = async (req, res) => {
  try {
    const { name, slug, description, price, discountPrice, stock, sku, brand, category, subcategory, featured, bestSeller, newArrival, flashSale } = req.body;
    const product = new Product({
      name,
      slug,
      description,
      price,
      discountPrice,
      stock,
      sku,
      brand,
      category,
      subcategory,
      featured: featured || false,
      bestSeller: bestSeller || false,
      newArrival: newArrival || false,
      flashSale: flashSale || false
    });
    await product.save();
    res.status(201).json({ message: 'Product created', productId: product._id });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const updateProduct = async (req, res) => {
  try {
    const { name, slug, description, price, discountPrice, stock, sku, brand, category, subcategory, featured, bestSeller, newArrival, flashSale } = req.body;
    await Product.findByIdAndUpdate(req.params.id, {
      name,
      slug,
      description,
      price,
      discountPrice,
      stock,
      sku,
      brand,
      category,
      subcategory,
      featured,
      bestSeller,
      newArrival,
      flashSale
    });
    res.json({ message: 'Product updated' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    await ProductImage.deleteMany({ product: req.params.id });
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
