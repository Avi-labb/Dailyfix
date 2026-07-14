import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Category from './models/Category.js';
import Product from './models/Product.js';

dotenv.config();

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await Category.deleteMany({});
    await Product.deleteMany({});
    console.log('Cleared existing data');

    // Create category
    const category = new Category({
      name: 'Beard Colour',
      slug: 'beard-colour',
      description: 'Premium beard colour products'
    });
    await category.save();
    console.log('Created category');

    // Create products
    const products = [
      {
        name: 'Mens Beard Colour Natural Black',
        slug: 'natural-black',
        description: 'Our Natural Black Beard Colour gives a perfect natural black shade. Formulated without ammonia, gentle on skin and beard.',
        price: 450,
        discountPrice: null,
        stock: 100,
        sku: 'DF-NB-001',
        brand: 'Dailyfix',
        category: category._id,
        featured: true,
        bestSeller: true,
        newArrival: true,
        rating: 4.8,
        reviewsCount: 150
      },
      {
        name: 'Mens Beard Colour Black Brown',
        slug: 'black-brown',
        description: 'Our Black Brown Beard Colour provides a rich warm brownish-black hue. Perfect for a natural distinguished look.',
        price: 450,
        discountPrice: null,
        stock: 100,
        sku: 'DF-BB-002',
        brand: 'Dailyfix',
        category: category._id,
        featured: true,
        bestSeller: true,
        newArrival: true,
        rating: 4.7,
        reviewsCount: 120
      },
      {
        name: 'Mens Beard Colour Dark Brown',
        slug: 'dark-brown',
        description: 'Our Dark Brown Beard Colour offers a classic deep brown shade. Blends seamlessly for a natural well-groomed appearance.',
        price: 450,
        discountPrice: null,
        stock: 100,
        sku: 'DF-DB-003',
        brand: 'Dailyfix',
        category: category._id,
        featured: true,
        bestSeller: true,
        newArrival: true,
        rating: 4.6,
        reviewsCount: 100
      }
    ];

    await Product.insertMany(products);
    console.log('Created products');

    console.log('Seed complete!');
    process.exit(0);
  } catch (error) {
    console.error('Seed failed:', error);
    process.exit(1);
  }
};

seed();
