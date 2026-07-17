import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

import connectDB from './config/db.js';

dotenv.config();

import adminRoutes from './routes/adminRoutes.js';
import productRoutes from './routes/productRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import orderRoutes from './routes/orderRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Important for Hostinger reverse proxy
app.set('trust proxy', 1);

// Rate limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});

app.use(limiter);

app.use(helmet());

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:5175",
  "https://dailyfixcare.com",
  "https://www.dailyfixcare.com"
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use(cookieParser());
app.use(express.json());

// API routes
app.use('/api/admin', adminRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/orders', orderRoutes);

// Uploads
app.use(
  '/uploads',
  express.static(path.join(__dirname, 'uploads'))
);

// React frontend
const frontendPath = path.join(
  __dirname,
  '..',
  'client',
  'dist'
);

// Check if frontend dist exists
const frontendExists = fs.existsSync(frontendPath);
if (frontendExists) {
  app.use(express.static(frontendPath));
  
  // React routing
  app.get('*', (req, res) => {
    res.sendFile(
      path.join(frontendPath, 'index.html')
    );
  });
} else {
  // If frontend not built yet, just serve API
  console.log('⚠️ Frontend dist folder not found. Only API routes are available.');
  app.get('*', (req, res) => {
    res.status(404).json({ 
      message: 'API is running. Frontend not built yet.',
      availableRoutes: [
        '/api/products',
        '/api/categories',
        '/api/orders',
        '/api/admin'
      ]
    });
  });
}

// Hostinger provides the PORT
const PORT = process.env.PORT || 5000;

// Connect to MongoDB first
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
  });
}).catch(err => {
  console.error('❌ Failed to connect to MongoDB:', err);
  process.exit(1);
});