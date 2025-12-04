const express = require('express');
const router = express.Router();
const { getDatabase } = require('../db/database');

router.get('/', (req, res, next) => {
  try {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] [INFO] GET /api/categories`);

    const db = getDatabase();
    
    const categories = db.prepare('SELECT * FROM categories ORDER BY name').all();
    
    db.close();

    res.json({
      data: categories
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;

