import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
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
    contentSecurityPolicy: false, // Allow inline styles and font assets for rich botanical UI
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

// Health & Metadata Route
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    project: 'HabitGarden – Mindful Habit Progress & Reflection Platform',
    developer: {
      studentName: 'DEEPAK KONAKALLA',
      studentId: '2102508559',
      role: 'Principal Full-Stack Architect & Product Designer',
    },
    philosophy: 'Non-shaming, flexible weekly targets, botanical dormancy metaphor',
    timestamp: new Date().toISOString(),
  });
});

// Mount Feature API Routes
app.use('/api/habits', habitRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/seed', seedRoutes);

// Unified Production Static Frontend Serving
// If frontend/dist is built, serve React UI on port 5000 as well!
const frontendDistPath = path.resolve(__dirname, '../frontend/dist');
if (fs.existsSync(frontendDistPath)) {
  app.use(express.static(frontendDistPath));
  app.get('*', (req, res, next) => {
    // If request is not an API call, serve React index.html
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
    await connectDB();
    app.listen(PORT, () => {
      console.log(`🌿 [HabitGarden API] Server blossoming on http://localhost:${PORT}`);
      console.log(`🌱 Developed by DEEPAK KONAKALLA (USN: 2102508559)`);
    });
  } catch (err) {
    console.error('Failed to start HabitGarden API:', err);
    process.exit(1);
  }
};

startServer();

export default app;

