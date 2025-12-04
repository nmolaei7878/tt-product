const { body, query, param, validationResult } = require('express-validator');

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] [WARN] Validation errors for ${req.method} ${req.path}:`, errors.array());
    
    const formattedErrors = errors.array().map(err => ({
      field: err.path || err.param,
      message: err.msg
    }));
    
    return res.status(400).json({
      errors: formattedErrors
    });
  }
  
  next();
};

const validateProduct = [
  body('product_name')
    .trim()
    .notEmpty().withMessage('Product name is required')
    .isLength({ min: 3, max: 200 }).withMessage('Product name must be between 3 and 200 characters'),
  
  body('sku')
    .trim()
    .notEmpty().withMessage('SKU is required')
    .matches(/^[A-Z]{3}-\d{4}$/).withMessage('SKU must match format XXX-#### (3 uppercase letters, hyphen, 4 digits)'),
  
  body('category')
    .trim()
    .notEmpty().withMessage('Category is required'),
  
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 }).withMessage('Description must not exceed 500 characters'),
  
  body('price')
    .notEmpty().withMessage('Price is required')
    .isFloat({ min: 0.01, max: 999999.99 }).withMessage('Price must be between 0.01 and 999999.99')
    .custom(value => {
      const decimal = value.toString().split('.')[1];
      if (decimal && decimal.length > 2) {
        throw new Error('Price can have maximum 2 decimal places');
      }
      return true;
    }),
  
  body('cost_price')
    .optional({ nullable: true, checkFalsy: true })
    .isFloat({ min: 0 }).withMessage('Cost price must be a positive number')
    .custom((value, { req }) => {
      if (value !== null && value !== undefined && value !== '' && req.body.price) {
        if (parseFloat(value) >= parseFloat(req.body.price)) {
          throw new Error('Cost price must be less than price');
        }
      }
      return true;
    })
    .custom(value => {
      if (value !== null && value !== undefined && value !== '') {
        const decimal = value.toString().split('.')[1];
        if (decimal && decimal.length > 2) {
          throw new Error('Cost price can have maximum 2 decimal places');
        }
      }
      return true;
    }),
  
  body('stock_quantity')
    .notEmpty().withMessage('Stock quantity is required')
    .isInt({ min: 0, max: 999999 }).withMessage('Stock quantity must be an integer between 0 and 999999'),
  
  body('reorder_level')
    .optional({ nullable: true, checkFalsy: true })
    .isInt({ min: 0 }).withMessage('Reorder level must be a non-negative integer')
    .custom((value, { req }) => {
      if (value !== null && value !== undefined && value !== '' && req.body.stock_quantity !== undefined) {
        if (parseInt(value) >= parseInt(req.body.stock_quantity)) {
          throw new Error('Reorder level must be less than stock quantity');
        }
      }
      return true;
    }),
  
  body('status')
    .notEmpty().withMessage('Status is required')
    .isIn(['Active', 'Inactive', 'Discontinued']).withMessage('Status must be Active, Inactive, or Discontinued'),
  
  body('tags')
    .optional()
    .isArray().withMessage('Tags must be an array')
    .custom(value => {
      if (value && value.length > 10) {
        throw new Error('Maximum 10 tags allowed');
      }
      if (value && value.some(tag => typeof tag !== 'string' || tag.length < 1 || tag.length > 50)) {
        throw new Error('Each tag must be a string between 1 and 50 characters');
      }
      return true;
    }),
  
  body('supplier')
    .optional()
    .trim()
    .isLength({ max: 200 }).withMessage('Supplier name must not exceed 200 characters'),
  
  body('notes')
    .optional()
    .trim()
    .isLength({ max: 1000 }).withMessage('Notes must not exceed 1000 characters'),
  
  handleValidationErrors
];

const validateProductUpdate = [
  body('product_name')
    .optional()
    .trim()
    .isLength({ min: 3, max: 200 }).withMessage('Product name must be between 3 and 200 characters'),
  
  body('sku')
    .optional()
    .trim()
    .matches(/^[A-Z]{3}-\d{4}$/).withMessage('SKU must match format XXX-#### (3 uppercase letters, hyphen, 4 digits)'),
  
  body('category')
    .optional()
    .trim()
    .notEmpty().withMessage('Category cannot be empty'),
  
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 }).withMessage('Description must not exceed 500 characters'),
  
  body('price')
    .optional()
    .isFloat({ min: 0.01, max: 999999.99 }).withMessage('Price must be between 0.01 and 999999.99')
    .custom(value => {
      const decimal = value.toString().split('.')[1];
      if (decimal && decimal.length > 2) {
        throw new Error('Price can have maximum 2 decimal places');
      }
      return true;
    }),
  
  body('cost_price')
    .optional({ nullable: true, checkFalsy: true })
    .isFloat({ min: 0 }).withMessage('Cost price must be a positive number')
    .custom((value, { req }) => {
      if (value !== null && value !== undefined && value !== '' && req.body.price) {
        if (parseFloat(value) >= parseFloat(req.body.price)) {
          throw new Error('Cost price must be less than price');
        }
      }
      return true;
    })
    .custom(value => {
      if (value !== null && value !== undefined && value !== '') {
        const decimal = value.toString().split('.')[1];
        if (decimal && decimal.length > 2) {
          throw new Error('Cost price can have maximum 2 decimal places');
        }
      }
      return true;
    }),
  
  body('stock_quantity')
    .optional()
    .isInt({ min: 0, max: 999999 }).withMessage('Stock quantity must be an integer between 0 and 999999'),
  
  body('reorder_level')
    .optional({ nullable: true, checkFalsy: true })
    .isInt({ min: 0 }).withMessage('Reorder level must be a non-negative integer')
    .custom((value, { req }) => {
      if (value !== null && value !== undefined && value !== '' && req.body.stock_quantity !== undefined) {
        if (parseInt(value) >= parseInt(req.body.stock_quantity)) {
          throw new Error('Reorder level must be less than stock quantity');
        }
      }
      return true;
    }),
  
  body('status')
    .optional()
    .isIn(['Active', 'Inactive', 'Discontinued']).withMessage('Status must be Active, Inactive, or Discontinued'),
  
  body('tags')
    .optional()
    .isArray().withMessage('Tags must be an array')
    .custom(value => {
      if (value && value.length > 10) {
        throw new Error('Maximum 10 tags allowed');
      }
      if (value && value.some(tag => typeof tag !== 'string' || tag.length < 1 || tag.length > 50)) {
        throw new Error('Each tag must be a string between 1 and 50 characters');
      }
      return true;
    }),
  
  body('supplier')
    .optional()
    .trim()
    .isLength({ max: 200 }).withMessage('Supplier name must not exceed 200 characters'),
  
  body('notes')
    .optional()
    .trim()
    .isLength({ max: 1000 }).withMessage('Notes must not exceed 1000 characters'),
  
  handleValidationErrors
];

const validateProductId = [
  param('id')
    .isInt({ min: 1 }).withMessage('Product ID must be a positive integer'),
  
  handleValidationErrors
];

const validateProductQuery = [
  query('page')
    .optional()
    .isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  
  query('search')
    .optional()
    .trim()
    .isLength({ min: 1 }).withMessage('Search term must not be empty'),
  
  query('minPrice')
    .optional()
    .isFloat({ min: 0 }).withMessage('Min price must be a non-negative number'),
  
  query('maxPrice')
    .optional()
    .isFloat({ min: 0 }).withMessage('Max price must be a non-negative number')
    .custom((value, { req }) => {
      if (value && req.query.minPrice && parseFloat(value) < parseFloat(req.query.minPrice)) {
        throw new Error('Max price must be greater than or equal to min price');
      }
      return true;
    }),
  
  query('minStock')
    .optional()
    .isInt({ min: 0 }).withMessage('Min stock must be a non-negative integer'),
  
  query('maxStock')
    .optional()
    .isInt({ min: 0 }).withMessage('Max stock must be a non-negative integer')
    .custom((value, { req }) => {
      if (value && req.query.minStock && parseInt(value) < parseInt(req.query.minStock)) {
        throw new Error('Max stock must be greater than or equal to min stock');
      }
      return true;
    }),
  
  query('status')
    .optional()
    .custom(value => {
      const validStatuses = ['Active', 'Inactive', 'Discontinued'];
      if (Array.isArray(value)) {
        if (value.some(s => !validStatuses.includes(s))) {
          throw new Error('Status must be Active, Inactive, or Discontinued');
        }
      } else {
        if (!validStatuses.includes(value)) {
          throw new Error('Status must be Active, Inactive, or Discontinued');
        }
      }
      return true;
    }),
  
  handleValidationErrors
];

module.exports = {
  validateProduct,
  validateProductUpdate,
  validateProductId,
  validateProductQuery,
  handleValidationErrors
};

