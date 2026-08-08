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
        name: "Dailyfix Men's Beard Colour – Natural Black",
        slug: 'natural-black',
        description: 'Get a bold, youthful and well-groomed appearance with Dailyfix Natural Black Beard Colour. Premium beard colour designed to provide rich, natural-looking black coverage. Grey beard coverage with smooth, even colour and a clean, polished appearance.',
        price: 450,
        stock: 100,
        sku: 'DF-NB-001',
        brand: 'Dailyfix',
        image: 'natural-black',
        isActive: true
      },
      {
        name: "Dailyfix Men's Beard Colour – Black Brown",
        slug: 'black-brown',
        description: 'Get a naturally groomed look with Dailyfix Black Brown Beard Colour for Men. It helps cover grey beard hair while providing rich, even and natural-looking colour. The easy-to-use formula is ideal for regular grooming and gives your beard a smooth, polished finish.',
        price: 450,
        stock: 100,
        sku: 'DF-BB-002',
        brand: 'Dailyfix',
        image: 'black-brown',
        isActive: true
      },
      {
        name: "Dailyfix Men's Beard Colour – Dark Brown",
        slug: 'dark-brown',
        description: 'Get a naturally groomed look with Dailyfix Dark Brown Beard Colour for Men. It helps cover grey beard hair while providing rich, even and natural-looking colour. The easy-to-use formula is ideal for regular grooming and gives your beard a smooth, polished finish.',
        price: 450,
        stock: 100,
        sku: 'DF-DB-003',
        brand: 'Dailyfix',
        image: 'dark-brown',
        isActive: true
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
