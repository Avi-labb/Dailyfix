import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import path from 'path';
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

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});

app.use(limiter);
app.use(helmet());
const allowedOrigins = [
    "http://localhost:5173",
    "http://localhost:5174",
    "https://dailyfixcare.com",
    "https://www.dailyfixcare.com"
];
app.use(cors({ origin: (origin, callback) => {
  if (!origin || allowedOrigins.includes(origin)) {
    callback(null, true);
  } else {
    callback(new Error('Not allowed by CORS'));
  }
}, credentials: true }));

// Parse cookies and JSON bodies
app.use(cookieParser());
app.use(express.json());

// API routes first (so they don't get caught by the catch-all
app.use('/api/admin', adminRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/orders', orderRoutes);

// Serve static uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Serve static client files
app.use(express.static(path.join(__dirname, '..', 'client', 'dist')));

// Catch-all route for client-side routing (must be last!)
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'client', 'dist', 'index.html'));
});

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer();