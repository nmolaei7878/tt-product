const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

const DB_PATH = process.env.DB_PATH || './data/products.db';

function initDatabase() {
  const dbDir = path.dirname(DB_PATH);
  
  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
    console.log(`[${new Date().toISOString()}] [INFO] Created database directory: ${dbDir}`);
  }

  const db = new Database(DB_PATH);
  db.pragma('journal_mode = WAL');
  
  createTables(db);
  
  return db;
}

function createTables(db) {
  const productsTableExists = db.prepare(
    "SELECT name FROM sqlite_master WHERE type='table' AND name='products'"
  ).get();

  if (!productsTableExists) {
    console.log(`[${new Date().toISOString()}] [INFO] Creating database tables...`);

    db.exec(`
      CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        product_name TEXT NOT NULL CHECK(length(product_name) >= 3),
        sku TEXT NOT NULL UNIQUE CHECK(sku GLOB '[A-Z][A-Z][A-Z]-[0-9][0-9][0-9][0-9]'),
        category TEXT NOT NULL,
        description TEXT CHECK(description IS NULL OR length(description) <= 500),
        price REAL NOT NULL CHECK(price >= 0.01 AND price <= 999999.99),
        cost_price REAL CHECK(cost_price IS NULL OR (cost_price >= 0 AND cost_price < price)),
        stock_quantity INTEGER NOT NULL CHECK(stock_quantity >= 0),
        reorder_level INTEGER CHECK(reorder_level IS NULL OR (reorder_level >= 0 AND reorder_level < stock_quantity)),
        status TEXT NOT NULL CHECK(status IN ('Active', 'Inactive', 'Discontinued')),
        tags TEXT,
        supplier TEXT,
        notes TEXT,
        last_updated TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
        created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
      );

      CREATE INDEX idx_product_name ON products(product_name);
      CREATE INDEX idx_sku ON products(sku);
      CREATE INDEX idx_category ON products(category);
      CREATE INDEX idx_status ON products(status);
      CREATE INDEX idx_price ON products(price);
      CREATE INDEX idx_stock ON products(stock_quantity);

      CREATE TABLE IF NOT EXISTS categories (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL UNIQUE
      );

      CREATE TABLE IF NOT EXISTS suppliers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL UNIQUE
      );
    `);

    console.log(`[${new Date().toISOString()}] [INFO] Database tables created successfully`);
  }
}

function getDatabase() {
  const db = new Database(DB_PATH);
  db.pragma('journal_mode = WAL');
  return db;
}

module.exports = {
  initDatabase,
  getDatabase,
  DB_PATH
};

