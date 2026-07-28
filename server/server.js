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
import Admin from './models/Admin.js';
import bcrypt from 'bcryptjs';

// Routes
import adminRoutes from './routes/adminRoutes.js';
import productRoutes from './routes/productRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import contactRoutes from './routes/contactRoutes.js';

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
app.use('/api/contact', contactRoutes);

// ===============================
// FRONTEND (dist folder serving)
//   Supports 3 paths, checked in this order:
//   1. FRONTEND_DIST_PATH from .env (absolute or relative — for deployed servers)
//   2. ../client/dist               (local dev, default XAMPP structure)
//   3. ./dist                       (server-folder-only deployments e.g. upload dist/ into server/)
// ===============================
const projectRoot = path.join(__dirname, '..');
const envPath = process.env.FRONTEND_DIST_PATH;

let frontendPath;
if (envPath && envPath.trim()) {
  frontendPath = path.isAbsolute(envPath)
    ? envPath
    : path.resolve(projectRoot, envPath);
} else {
  const adjacentClientDist = path.join(__dirname, '..', 'client', 'dist');
  const serverInternalDist = path.join(__dirname, 'dist');
  frontendPath = fs.existsSync(adjacentClientDist)
    ? adjacentClientDist
    : serverInternalDist;
}

const frontendExists = fs.existsSync(frontendPath) &&
  fs.existsSync(path.join(frontendPath, 'index.html'));

if (frontendExists) {
  app.use(express.static(frontendPath));

  app.get(/^\/(?!api|uploads).*/, (req, res) => {
    res.sendFile(
      path.join(frontendPath, 'index.html')
    );
  });

  console.log('✅ Frontend dist folder found at:', frontendPath);
} else {
  console.log(
    '⚠️  Frontend dist folder not found at:', frontendPath
  );
  if (envPath) {
    console.log(
      '⚠️  FRONTEND_DIST_PATH is set to:', envPath
    );
  }
  console.log(
    '⚠️  Option 1 (local):  cd client && npm run build   (creates client/dist)'
  );
  console.log(
    '⚠️  Option 2 (deploy): copy client/dist/* into   server/dist/'
  );
  console.log(
    '⚠️  Option 3 (deploy): set FRONTEND_DIST_PATH in .env to the absolute folder path'
  );
  console.log(
    '⚠️  Only API routes will work until dist exists.'
  );
}

// ===============================
// START SERVER FIRST
// ===============================
const PORT = process.env.PORT || 5001;

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
  .then(async () => {
    console.log('✅ Database connected successfully');

    // Seed default admin user if not exists
    try {
      const existingAdmin = await Admin.findOne({ email: 'avidevelop60@gmail.com' });
      if (!existingAdmin) {
        const hashedPassword = await bcrypt.hash('Admin@123', 10);
        await Admin.create({
          email: 'avidevelop60@gmail.com',
          password: hashedPassword
        });
        console.log('✅ Default admin created: avidevelop60@gmail.com / Admin@123');
      } else {
        console.log('ℹ️  Default admin user already exists');
      }
    } catch (seedError) {
      console.error('⚠ Admin seeding failed:', seedError.message);
    }
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