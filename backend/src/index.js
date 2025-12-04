require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { initDatabase, getDatabase } = require('./db/database');
const { seedDatabase, resetDatabase } = require('./db/seed');
const delayMiddleware = require('./utils/delay');
const errorSimulatorMiddleware = require('./utils/errorSimulator');
const errorHandler = require('./middleware/errorHandler');
const productsRouter = require('./routes/products');
const categoriesRouter = require('./routes/categories');
const suppliersRouter = require('./routes/suppliers');

const app = express();
const PORT = process.env.PORT || 3001;
const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:3000';

app.use(cors({
  origin: CORS_ORIGIN,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type']
}));

app.use(express.json());

app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] [INFO] ${req.method} ${req.path}`);
  next();
});

app.use(delayMiddleware);
app.use(errorSimulatorMiddleware);

app.get('/api/health', (req, res) => {
  const timestamp = new Date().toISOString();
  
  let databaseStatus = 'connected';
  try {
    const db = getDatabase();
    db.prepare('SELECT 1').get();
    db.close();
  } catch (error) {
    databaseStatus = 'disconnected';
    console.error(`[${timestamp}] [ERROR] Database health check failed:`, error.message);
  }

  res.json({
    status: 'ok',
    timestamp,
    database: databaseStatus
  });
});

app.use('/api/products', productsRouter);
app.use('/api/categories', categoriesRouter);
app.use('/api/suppliers', suppliersRouter);

app.post('/api/reset', (req, res, next) => {
  try {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] [INFO] POST /api/reset - Resetting database`);

    resetDatabase();

    const db = getDatabase();
    const { count } = db.prepare('SELECT COUNT(*) as count FROM products').get();
    db.close();

    res.json({
      message: 'Database reset successfully',
      productsCount: count
    });
  } catch (error) {
    next(error);
  }
});

app.use((req, res) => {
  res.status(404).json({
    error: 'Route not found',
    path: req.path
  });
});

app.use(errorHandler);

function startServer() {
  const timestamp = new Date().toISOString();
  
  console.log(`[${timestamp}] [INFO] Initializing database...`);
  initDatabase();
  
  const db = getDatabase();
  const { count } = db.prepare('SELECT COUNT(*) as count FROM products').get();
  
  if (count === 0) {
    console.log(`[${timestamp}] [INFO] Database is empty, running seed...`);
    db.close();
    seedDatabase();
  } else {
    console.log(`[${timestamp}] [INFO] Database already contains ${count} products`);
    db.close();
  }

  app.listen(PORT, () => {
    console.log(`[${new Date().toISOString()}] [INFO] ========================================`);
    console.log(`[${new Date().toISOString()}] [INFO] Product Catalog API Server Started`);
    console.log(`[${new Date().toISOString()}] [INFO] ========================================`);
    console.log(`[${new Date().toISOString()}] [INFO] Server running on port ${PORT}`);
    console.log(`[${new Date().toISOString()}] [INFO] API Base URL: http://localhost:${PORT}`);
    console.log(`[${new Date().toISOString()}] [INFO] Health Check: http://localhost:${PORT}/api/health`);
    console.log(`[${new Date().toISOString()}] [INFO] CORS Origin: ${CORS_ORIGIN}`);
    console.log(`[${new Date().toISOString()}] [INFO] Delay: ${process.env.DELAY_MS || 300}ms ±100ms`);
    console.log(`[${new Date().toISOString()}] [INFO] Error Rate: ${(parseFloat(process.env.ERROR_RATE || 0.05) * 100).toFixed(1)}%`);
    console.log(`[${new Date().toISOString()}] [INFO] ========================================`);
  });
}

startServer();

module.exports = app;

