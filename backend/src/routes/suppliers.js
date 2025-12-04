const express = require('express');
const router = express.Router();
const { getDatabase } = require('../db/database');

router.get('/', (req, res, next) => {
  try {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] [INFO] GET /api/suppliers`, req.query);

    const db = getDatabase();
    
    let sql = 'SELECT * FROM suppliers';
    let params = {};
    
    if (req.query.search) {
      sql += ' WHERE name LIKE @search';
      params.search = `%${req.query.search}%`;
    }
    
    sql += ' ORDER BY name LIMIT 50';
    
    const stmt = db.prepare(sql);
    const suppliers = stmt.all(params);
    
    db.close();

    res.json({
      data: suppliers
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;

