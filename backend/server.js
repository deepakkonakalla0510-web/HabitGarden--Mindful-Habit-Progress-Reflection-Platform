import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import mongoose from 'mongoose';
import { fileURLToPath } from 'url';
import { connectDB } from './config/db.js';
import habitRoutes from './routes/habitRoutes.js';
import analyticsRoutes from './routes/analyticsRoutes.js';
import seedRoutes from './routes/seedRoutes.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';

// Resolve __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Security & Utility Middlewares
app.use(
  helmet({
    contentSecurityPolicy: false, // Allow inline styles & font assets for rich botanical UI
  })
);
app.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// Health & Metadata Route (Always responds 200 for Render Health Checks)
app.get('/api/health', (req, res) => {
  const isDbConnected = mongoose.connection.readyState === 1;
  res.status(200).json({
    status: 'healthy',
    project: 'HabitGarden – Mindful Habit Progress & Reflection Platform',
    developer: {
      studentName: 'DEEPAK KONAKALLA',
      role: 'Principal Full-Stack Architect & Product Designer',
    },
    database: isDbConnected ? 'connected' : 'connecting_or_pending_uri',
    philosophy: 'Non-shaming, flexible weekly targets, botanical dormancy metaphor',
    timestamp: new Date().toISOString(),
  });
});

// Guard API feature routes if database is still connecting
app.use('/api', (req, res, next) => {
  if (req.path === '/health') return next();
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({
      success: false,
      message: 'MongoDB is connecting or MONGODB_URI is not yet configured.',
      guide:
        'In Render Dashboard -> Environment, ensure MONGODB_URI is set to your MongoDB Atlas connection string.',
    });
  }
  next();
});

// Mount Feature API Routes
app.use('/api/habits', habitRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/seed', seedRoutes);

// Unified Production Static Frontend Serving
// If frontend/dist exists, serve React UI seamlessly on Render
const frontendDistPath = path.resolve(__dirname, '../frontend/dist');
if (fs.existsSync(frontendDistPath)) {
  app.use(express.static(frontendDistPath));
  app.get('*', (req, res, next) => {
    if (!req.path.startsWith('/api')) {
      return res.sendFile(path.join(frontendDistPath, 'index.html'));
    }
    next();
  });
}

// Catch-all 404 for unmatched API routes and Centralized Error Handling
app.use(notFoundHandler);
app.use(errorHandler);

// Connect to Database & Start Server
const startServer = async () => {
  try {
    // Bind to 0.0.0.0 so cloud providers like Render can route traffic immediately
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🌿 [HabitGarden API] Server blossoming on port ${PORT}`);
      console.log(`🌱 Developed by DEEPAK KONAKALLA`);
    });

    // Connect to database in background without blocking server boot
    await connectDB();
  } catch (err) {
    console.error('Failed to start HabitGarden API:', err);
  }
};

startServer();

export default app;
