import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './models/Product.js';

dotenv.config();

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await Product.deleteMany({});
    console.log('Cleared existing data');

    // Create products
    const products = [
      {
        name: 'Mens Beard Colour Natural Black',
        slug: 'natural-black',
        description: 'Our Natural Black Beard Colour gives a perfect natural black shade. Formulated without ammonia, gentle on skin and beard.',
        price: 450,
        stock: 100,
        sku: 'DF-NB-001',
        brand: 'Dailyfix',
        image: 'natural-black'
      },
      {
        name: 'Mens Beard Colour Black Brown',
        slug: 'black-brown',
        description: 'Our Black Brown Beard Colour provides a rich warm brownish-black hue. Perfect for a natural distinguished look.',
        price: 450,
        stock: 100,
        sku: 'DF-BB-002',
        brand: 'Dailyfix',
        image: 'black-brown'
      },
      {
        name: 'Mens Beard Colour Dark Brown',
        slug: 'dark-brown',
        description: 'Our Dark Brown Beard Colour offers a classic deep brown shade. Blends seamlessly for a natural well-groomed appearance.',
        price: 450,
        stock: 100,
        sku: 'DF-DB-003',
        brand: 'Dailyfix',
        image: 'dark-brown'
      },
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
