console.log("🚀 Starting server...");
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Load environment variables first
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({
  path: path.join(__dirname, '.env')
});

// Database
import connectDB from './config/db.js';

// Routes
import adminRoutes from './routes/adminRoutes.js';
import productRoutes from './routes/productRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import orderRoutes from './routes/orderRoutes.js';

const app = express();

// Important for Hostinger reverse proxy
app.set('trust proxy', 1);

// ===============================
// RATE LIMITER
// ===============================
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false
});

app.use(limiter);

// ===============================
// SECURITY
// ===============================
app.use(helmet());

app.use(
  cors({
    origin: true,
    credentials: true
  })
);

// ===============================
// BODY PARSER
// ===============================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ===============================
// COOKIES
// ===============================
app.use(cookieParser());

// ===============================
// UPLOADS
// ===============================
app.use(
  '/uploads',
  express.static(path.join(__dirname, 'uploads'))
);

// ===============================
// API ROUTES
// ===============================
app.use('/api/admin', adminRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/orders', orderRoutes);

// ===============================
// FRONTEND
// ===============================
const frontendPath = path.join(__dirname,'dist');

const frontendExists = fs.existsSync(frontendPath);

if (frontendExists) {
  app.use(express.static(frontendPath));

  app.get('*', (req, res) => {
    res.sendFile(
      path.join(frontendPath, 'index.html')
    );
  });

  console.log('✅ Frontend dist folder found');
} else {
  console.log(
    '⚠️ Frontend dist folder not found. Only API routes are available.'
  );

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

// ===============================
// START SERVER FIRST
// ===============================
const PORT = process.env.PORT || 5000;

const server = app.listen(
  PORT,
  '0.0.0.0',
  () => {
    console.log(`✅ Server running on port ${PORT}`);
    console.log(`🌐 Port: ${PORT}`);
  }
);

// ===============================
// CONNECT DATABASE AFTER SERVER STARTS
// ===============================
connectDB()
  .then(() => {
    console.log('✅ Database connected successfully');
  })
  .catch((error) => {
    console.error(
      '❌ Database connection failed:',
      error.message
    );
  });

// ===============================
// ERROR HANDLING
// ===============================
process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
});

process.on('unhandledRejection', (error) => {
  console.error('❌ Unhandled Promise Rejection:', error);
});