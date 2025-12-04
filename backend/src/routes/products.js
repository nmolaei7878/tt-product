const express = require('express');
const router = express.Router();
const { getDatabase } = require('../db/database');
const { 
  validateProduct, 
  validateProductUpdate, 
  validateProductId, 
  validateProductQuery 
} = require('../middleware/validation');

router.get('/', validateProductQuery, (req, res, next) => {
  try {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] [INFO] GET /api/products`, req.query);

    const db = getDatabase();
    
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;

    let whereClauses = [];
    let params = {};

    if (req.query.search) {
      whereClauses.push('(product_name LIKE @search OR sku LIKE @search)');
      params.search = `%${req.query.search}%`;
    }

    if (req.query.category) {
      whereClauses.push('category = @category');
      params.category = req.query.category;
    }

    if (req.query.status) {
      const statuses = Array.isArray(req.query.status) ? req.query.status : [req.query.status];
      const statusPlaceholders = statuses.map((_, i) => `@status${i}`).join(', ');
      whereClauses.push(`status IN (${statusPlaceholders})`);
      statuses.forEach((status, i) => {
        params[`status${i}`] = status;
      });
    }

    if (req.query.minPrice) {
      whereClauses.push('price >= @minPrice');
      params.minPrice = parseFloat(req.query.minPrice);
    }

    if (req.query.maxPrice) {
      whereClauses.push('price <= @maxPrice');
      params.maxPrice = parseFloat(req.query.maxPrice);
    }

    if (req.query.minStock !== undefined) {
      whereClauses.push('stock_quantity >= @minStock');
      params.minStock = parseInt(req.query.minStock);
    }

    if (req.query.maxStock !== undefined) {
      whereClauses.push('stock_quantity <= @maxStock');
      params.maxStock = parseInt(req.query.maxStock);
    }

    const whereSQL = whereClauses.length > 0 ? 'WHERE ' + whereClauses.join(' AND ') : '';

    const countSQL = `SELECT COUNT(*) as total FROM products ${whereSQL}`;
    const countStmt = db.prepare(countSQL);
    const { total } = countStmt.get(params);

    const dataSQL = `
      SELECT * FROM products 
      ${whereSQL}
      ORDER BY last_updated DESC
      LIMIT @limit OFFSET @offset
    `;
    
    const dataStmt = db.prepare(dataSQL);
    const products = dataStmt.all({ ...params, limit, offset });

    const productsWithParsedTags = products.map(product => ({
      ...product,
      tags: product.tags ? JSON.parse(product.tags) : []
    }));

    const hasMore = (page * limit) < total;

    db.close();

    res.json({
      data: productsWithParsedTags,
      total,
      hasMore,
      page,
      limit
    });
  } catch (error) {
    next(error);
  }
});

router.post('/', validateProduct, (req, res, next) => {
  try {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] [INFO] POST /api/products`, { sku: req.body.sku });

    const db = getDatabase();

    const existingProduct = db.prepare('SELECT id FROM products WHERE sku = ?').get(req.body.sku);
    if (existingProduct) {
      db.close();
      return res.status(409).json({
        error: 'SKU already exists',
        field: 'sku'
      });
    }

    const validCategories = db.prepare('SELECT name FROM categories').all().map(c => c.name);
    if (!validCategories.includes(req.body.category)) {
      db.close();
      return res.status(400).json({
        errors: [{
          field: 'category',
          message: `Category must be one of: ${validCategories.join(', ')}`
        }]
      });
    }

    const now = new Date().toISOString();
    const insertSQL = `
      INSERT INTO products (
        product_name, sku, category, description, price, cost_price,
        stock_quantity, reorder_level, status, tags, supplier, notes,
        last_updated, created_at
      ) VALUES (
        @product_name, @sku, @category, @description, @price, @cost_price,
        @stock_quantity, @reorder_level, @status, @tags, @supplier, @notes,
        @last_updated, @created_at
      )
    `;

    const params = {
      product_name: req.body.product_name,
      sku: req.body.sku,
      category: req.body.category,
      description: req.body.description || null,
      price: req.body.price,
      cost_price: req.body.cost_price || null,
      stock_quantity: req.body.stock_quantity,
      reorder_level: req.body.reorder_level || null,
      status: req.body.status,
      tags: req.body.tags ? JSON.stringify(req.body.tags) : null,
      supplier: req.body.supplier || null,
      notes: req.body.notes || null,
      last_updated: now,
      created_at: now
    };

    const stmt = db.prepare(insertSQL);
    const result = stmt.run(params);

    const newProduct = db.prepare('SELECT * FROM products WHERE id = ?').get(result.lastInsertRowid);
    
    const productWithParsedTags = {
      ...newProduct,
      tags: newProduct.tags ? JSON.parse(newProduct.tags) : []
    };

    db.close();

    console.log(`[${timestamp}] [INFO] Product created successfully with ID: ${result.lastInsertRowid}`);

    res.status(201).json({
      data: productWithParsedTags,
      message: 'Product created successfully'
    });
  } catch (error) {
    next(error);
  }
});

router.put('/:id', validateProductId, validateProductUpdate, (req, res, next) => {
  try {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] [INFO] PUT /api/products/${req.params.id}`);

    const db = getDatabase();

    const existingProduct = db.prepare('SELECT * FROM products WHERE id = ?').get(req.params.id);
    if (!existingProduct) {
      db.close();
      return res.status(404).json({
        error: 'Product not found'
      });
    }

    if (req.body.sku && req.body.sku !== existingProduct.sku) {
      const duplicateSKU = db.prepare('SELECT id FROM products WHERE sku = ? AND id != ?').get(req.body.sku, req.params.id);
      if (duplicateSKU) {
        db.close();
        return res.status(409).json({
          error: 'SKU already exists',
          field: 'sku'
        });
      }
    }

    if (req.body.category) {
      const validCategories = db.prepare('SELECT name FROM categories').all().map(c => c.name);
      if (!validCategories.includes(req.body.category)) {
        db.close();
        return res.status(400).json({
          errors: [{
            field: 'category',
            message: `Category must be one of: ${validCategories.join(', ')}`
          }]
        });
      }
    }

    const updateFields = [];
    const params = { id: req.params.id };

    const allowedFields = [
      'product_name', 'sku', 'category', 'description', 'price', 'cost_price',
      'stock_quantity', 'reorder_level', 'status', 'supplier', 'notes'
    ];

    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        updateFields.push(`${field} = @${field}`);
        params[field] = req.body[field];
      }
    });

    if (req.body.tags !== undefined) {
      updateFields.push('tags = @tags');
      params.tags = JSON.stringify(req.body.tags);
    }

    if (updateFields.length === 0) {
      db.close();
      return res.status(400).json({
        error: 'No fields to update'
      });
    }

    updateFields.push('last_updated = @last_updated');
    params.last_updated = new Date().toISOString();

    const updateSQL = `UPDATE products SET ${updateFields.join(', ')} WHERE id = @id`;
    const stmt = db.prepare(updateSQL);
    stmt.run(params);

    const updatedProduct = db.prepare('SELECT * FROM products WHERE id = ?').get(req.params.id);
    
    const productWithParsedTags = {
      ...updatedProduct,
      tags: updatedProduct.tags ? JSON.parse(updatedProduct.tags) : []
    };

    db.close();

    console.log(`[${timestamp}] [INFO] Product updated successfully: ${req.params.id}`);

    res.json({
      data: productWithParsedTags,
      message: 'Product updated successfully'
    });
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', validateProductId, (req, res, next) => {
  try {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] [INFO] DELETE /api/products/${req.params.id}`);

    const db = getDatabase();

    const existingProduct = db.prepare('SELECT id FROM products WHERE id = ?').get(req.params.id);
    if (!existingProduct) {
      db.close();
      return res.status(404).json({
        error: 'Product not found'
      });
    }

    const stmt = db.prepare('DELETE FROM products WHERE id = ?');
    stmt.run(req.params.id);

    db.close();

    console.log(`[${timestamp}] [INFO] Product deleted successfully: ${req.params.id}`);

    res.json({
      message: 'Product deleted successfully',
      id: parseInt(req.params.id)
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;

