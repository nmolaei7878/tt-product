# Quick Start Guide

## Installation & Setup

```bash
# 1. Install dependencies
npm install

# 2. Environment is already configured (.env file exists)

# 3. Start the server
npm run dev
```

The server will automatically:
- Create the SQLite database at `./data/products.db`
- Seed 1000 realistic products on first run
- Start listening on `http://localhost:3001`

## Test the API

```bash
# Health check
curl http://localhost:3001/api/health

# Get products (first page)
curl http://localhost:3001/api/products

# Get categories
curl http://localhost:3001/api/categories

# Search products
curl 'http://localhost:3001/api/products?search=laptop&category=Electronics&status=Active&minPrice=100&maxPrice=2000'
```

## Available Scripts

```bash
npm start       # Start in production mode
npm run dev     # Start with auto-reload (development)
npm run seed    # Manually re-seed database
npm run reset   # Delete all data and re-seed
```

## API Endpoints Summary

- `GET /api/health` - Health check
- `GET /api/products` - List products (with filtering & pagination)
- `POST /api/products` - Create product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product
- `GET /api/categories` - List all categories
- `GET /api/suppliers` - List suppliers (with optional search)
- `POST /api/reset` - Reset database

## Example: Create a Product

```bash
curl -X POST http://localhost:3001/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "product_name": "Test Product",
    "sku": "TST-1234",
    "category": "Electronics",
    "description": "A test product",
    "price": 99.99,
    "stock_quantity": 50,
    "status": "Active",
    "tags": ["test", "demo"]
  }'
```

For complete documentation, see [README.md](./README.md)

