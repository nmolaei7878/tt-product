# Product Catalog Backend API

A comprehensive REST API backend for a Product Catalog Management System, built with Express.js and SQLite. Features include advanced filtering, pagination, validation, and simulated network conditions for realistic frontend testing.

## Overview

This backend provides a complete API for managing products, categories, and suppliers. It includes:

- **1000+ pre-seeded realistic products** across 12 categories
- **Advanced filtering and search** with multiple parameters
- **Pagination with infinite scroll support**
- **Comprehensive validation** using express-validator
- **Simulated network delay** and error conditions for testing
- **SQLite database** with full ACID compliance
- **RESTful endpoints** with consistent response formats

## Prerequisites

- **Node.js** 18+ (recommended: 20+)
- **npm** 9+ or **yarn** 1.22+

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

Copy the example environment file:

```bash
cp .env.example .env
```

Edit `.env` if needed (defaults work out of the box):

```env
PORT=3001
DELAY_MS=300
ERROR_RATE=0.05
CORS_ORIGIN=http://localhost:3000
DB_PATH=./data/products.db
```

### 3. Run the Server

**Development mode with auto-reload:**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

The server will:
- Create the database if it doesn't exist
- Auto-seed 1000 products on first run
- Start listening on `http://localhost:3001`

## Environment Variables

| Variable | Description | Default | Valid Values |
|----------|-------------|---------|--------------|
| `PORT` | Server port number | `3001` | 1-65535 |
| `DELAY_MS` | Simulated network delay (ms) | `300` | 0-5000 |
| `ERROR_RATE` | Probability of random errors | `0.05` | 0.0-1.0 (5% = 0.05) |
| `CORS_ORIGIN` | Allowed CORS origin | `http://localhost:3000` | URL string |
| `DB_PATH` | SQLite database file path | `./data/products.db` | File path |

### Delay Middleware
Adds a random delay of `DELAY_MS ±100ms` to simulate real network latency. Not applied to `/api/health`.

### Error Simulator
Randomly fails requests with 500 status based on `ERROR_RATE`. Set to `0` to disable. Not applied to `/api/health`.

## API Endpoints

### Base URL
```
http://localhost:3001
```

### Health Check

#### `GET /api/health`
Check if the API and database are running.

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "database": "connected"
}
```

---

### Products

#### `GET /api/products`
Get paginated and filtered products.

**Query Parameters:**

| Parameter | Type | Description | Example |
|-----------|------|-------------|---------|
| `page` | integer | Page number (default: 1) | `page=2` |
| `limit` | integer | Items per page (default: 20, max: 100) | `limit=50` |
| `search` | string | Search in product_name and sku | `search=laptop` |
| `category` | string | Filter by exact category | `category=Electronics` |
| `status` | string[] | Filter by status (can specify multiple) | `status=Active&status=Inactive` |
| `minPrice` | number | Minimum price filter | `minPrice=100` |
| `maxPrice` | number | Maximum price filter | `maxPrice=500` |
| `minStock` | integer | Minimum stock quantity | `minStock=10` |
| `maxStock` | integer | Maximum stock quantity | `maxStock=1000` |

**Example Request:**
```bash
curl 'http://localhost:3001/api/products?page=1&limit=20&search=laptop&category=Electronics&minPrice=100&maxPrice=2000&status=Active'
```

**Response:**
```json
{
  "data": [
    {
      "id": 1,
      "product_name": "Samsung 55-inch 4K Smart TV",
      "sku": "ELC-1234",
      "category": "Electronics",
      "description": "High-quality smart TV with 4K resolution...",
      "price": 899.99,
      "cost_price": 720.00,
      "stock_quantity": 45,
      "reorder_level": 10,
      "status": "Active",
      "tags": ["4K", "smart", "wireless"],
      "supplier": "Samsung Electronics Co.",
      "notes": "Popular item - restocks quickly",
      "last_updated": "2024-01-10T14:30:00.000Z",
      "created_at": "2023-06-15T09:00:00.000Z"
    }
  ],
  "total": 156,
  "hasMore": true,
  "page": 1,
  "limit": 20
}
```

---

#### `POST /api/products`
Create a new product.

**Request Body:**
```json
{
  "product_name": "Wireless Bluetooth Headphones",
  "sku": "ELC-5678",
  "category": "Electronics",
  "description": "Premium noise-cancelling wireless headphones with 30-hour battery life",
  "price": 199.99,
  "cost_price": 140.00,
  "stock_quantity": 100,
  "reorder_level": 20,
  "status": "Active",
  "tags": ["wireless", "bluetooth", "audio"],
  "supplier": "Audio Tech Inc.",
  "notes": "New product launch"
}
```

**Example Request:**
```bash
curl -X POST http://localhost:3001/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "product_name": "Wireless Bluetooth Headphones",
    "sku": "ELC-5678",
    "category": "Electronics",
    "description": "Premium wireless headphones",
    "price": 199.99,
    "stock_quantity": 100,
    "status": "Active",
    "tags": ["wireless", "bluetooth"]
  }'
```

**Success Response (201):**
```json
{
  "data": {
    "id": 1001,
    "product_name": "Wireless Bluetooth Headphones",
    "sku": "ELC-5678",
    "category": "Electronics",
    "description": "Premium wireless headphones",
    "price": 199.99,
    "cost_price": null,
    "stock_quantity": 100,
    "reorder_level": null,
    "status": "Active",
    "tags": ["wireless", "bluetooth"],
    "supplier": null,
    "notes": null,
    "last_updated": "2024-01-15T10:30:00.000Z",
    "created_at": "2024-01-15T10:30:00.000Z"
  },
  "message": "Product created successfully"
}
```

**Validation Error Response (400):**
```json
{
  "errors": [
    {
      "field": "sku",
      "message": "SKU must match format XXX-#### (3 uppercase letters, hyphen, 4 digits)"
    },
    {
      "field": "price",
      "message": "Price must be between 0.01 and 999999.99"
    }
  ]
}
```

**Duplicate SKU Error (409):**
```json
{
  "error": "SKU already exists",
  "field": "sku"
}
```

---

#### `PUT /api/products/:id`
Update an existing product.

**Path Parameters:**
- `id` (integer, required): Product ID

**Request Body:**
Same as POST, but all fields are optional. Only provided fields will be updated.

**Example Request:**
```bash
curl -X PUT http://localhost:3001/api/products/1 \
  -H "Content-Type: application/json" \
  -d '{
    "price": 179.99,
    "stock_quantity": 85,
    "status": "Active"
  }'
```

**Success Response (200):**
```json
{
  "data": {
    "id": 1,
    "product_name": "Wireless Bluetooth Headphones",
    "sku": "ELC-5678",
    "price": 179.99,
    "stock_quantity": 85,
    "status": "Active",
    "last_updated": "2024-01-15T11:00:00.000Z",
    ...
  },
  "message": "Product updated successfully"
}
```

**Not Found Error (404):**
```json
{
  "error": "Product not found"
}
```

---

#### `DELETE /api/products/:id`
Delete a product.

**Path Parameters:**
- `id` (integer, required): Product ID

**Example Request:**
```bash
curl -X DELETE http://localhost:3001/api/products/1
```

**Success Response (200):**
```json
{
  "message": "Product deleted successfully",
  "id": 1
}
```

---

### Categories

#### `GET /api/categories`
Get all available categories.

**Example Request:**
```bash
curl http://localhost:3001/api/categories
```

**Response:**
```json
{
  "data": [
    { "id": 1, "name": "Electronics" },
    { "id": 2, "name": "Clothing" },
    { "id": 3, "name": "Food & Beverages" },
    { "id": 4, "name": "Books" },
    { "id": 5, "name": "Home & Garden" },
    { "id": 6, "name": "Sports & Outdoors" },
    { "id": 7, "name": "Toys & Games" },
    { "id": 8, "name": "Beauty & Personal Care" },
    { "id": 9, "name": "Automotive" },
    { "id": 10, "name": "Office Supplies" },
    { "id": 11, "name": "Pet Supplies" },
    { "id": 12, "name": "Health & Wellness" }
  ]
}
```

---

### Suppliers

#### `GET /api/suppliers`
Get suppliers (optionally filtered for autocomplete).

**Query Parameters:**
- `search` (string, optional): Filter suppliers by name

**Example Request:**
```bash
curl 'http://localhost:3001/api/suppliers?search=tech'
```

**Response:**
```json
{
  "data": [
    { "id": 5, "name": "Audio Tech Inc." },
    { "id": 12, "name": "Global Tech Trading" },
    { "id": 28, "name": "Tech Supply Co." }
  ]
}
```

---

### Database Reset

#### `POST /api/reset`
Reset database to initial seeded state (development only).

**Example Request:**
```bash
curl -X POST http://localhost:3001/api/reset
```

**Response:**
```json
{
  "message": "Database reset successfully",
  "productsCount": 1000
}
```

---

## Data Models

### Product Schema

| Field | Type | Required | Constraints | Description |
|-------|------|----------|-------------|-------------|
| `id` | INTEGER | Auto | PRIMARY KEY | Auto-incremented unique identifier |
| `product_name` | TEXT | Yes | 3-200 chars | Product name |
| `sku` | TEXT | Yes | XXX-#### pattern, UNIQUE | Stock Keeping Unit |
| `category` | TEXT | Yes | Must exist in categories | Product category |
| `description` | TEXT | No | Max 500 chars | Product description |
| `price` | REAL | Yes | 0.01-999999.99 | Selling price |
| `cost_price` | REAL | No | >= 0, < price | Cost from supplier |
| `stock_quantity` | INTEGER | Yes | >= 0 | Current stock level |
| `reorder_level` | INTEGER | No | >= 0, < stock_quantity | Reorder threshold |
| `status` | TEXT | Yes | Active/Inactive/Discontinued | Product status |
| `tags` | TEXT | No | JSON array, max 10 tags | Product tags |
| `supplier` | TEXT | No | Max 200 chars | Supplier name |
| `notes` | TEXT | No | Max 1000 chars | Internal notes |
| `last_updated` | TEXT | Auto | ISO 8601 | Last modification timestamp |
| `created_at` | TEXT | Auto | ISO 8601 | Creation timestamp |

### Validation Rules

**SKU Format:**
- Pattern: `XXX-####` (e.g., `ELC-1234`)
- First 3 characters: Uppercase letters (typically category prefix)
- Hyphen separator
- Last 4 characters: Digits
- Must be unique across all products

**Price Validation:**
- Must be between $0.01 and $999,999.99
- Maximum 2 decimal places
- `cost_price` must be less than `price` if provided

**Stock Validation:**
- `stock_quantity` must be >= 0
- `reorder_level` must be less than `stock_quantity` if provided

**Tags:**
- Must be an array of strings
- Each tag: 1-50 characters
- Maximum 10 tags per product

---

## Testing

### Using cURL

**Get all products:**
```bash
curl http://localhost:3001/api/products
```

**Search products:**
```bash
curl 'http://localhost:3001/api/products?search=laptop&category=Electronics&minPrice=500'
```

**Create a product:**
```bash
curl -X POST http://localhost:3001/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "product_name": "Test Product",
    "sku": "TST-1234",
    "category": "Electronics",
    "price": 99.99,
    "stock_quantity": 50,
    "status": "Active"
  }'
```

**Update a product:**
```bash
curl -X PUT http://localhost:3001/api/products/1 \
  -H "Content-Type: application/json" \
  -d '{"price": 89.99, "stock_quantity": 45}'
```

**Delete a product:**
```bash
curl -X DELETE http://localhost:3001/api/products/1
```

### Using Postman

Import the following endpoints into Postman:
1. Health Check: `GET http://localhost:3001/api/health`
2. Get Products: `GET http://localhost:3001/api/products`
3. Create Product: `POST http://localhost:3001/api/products`
4. Update Product: `PUT http://localhost:3001/api/products/:id`
5. Delete Product: `DELETE http://localhost:3001/api/products/:id`

---

## Troubleshooting

### Port Already in Use

**Error:** `EADDRINUSE: address already in use :::3001`

**Solution:** Change the port in `.env`:
```env
PORT=3002
```

### Database Locked

**Error:** `SQLITE_BUSY: database is locked`

**Solution:** Close other applications accessing the database, or restart the server.

### CORS Errors

**Error:** `Access to fetch blocked by CORS policy`

**Solution:** Update `CORS_ORIGIN` in `.env` to match your frontend URL:
```env
CORS_ORIGIN=http://localhost:5173
```

### Validation Errors

If getting unexpected validation errors, check:
- SKU format is exactly `XXX-####`
- Price has max 2 decimal places
- `cost_price` < `price`
- `reorder_level` < `stock_quantity`
- Category exists in the categories table

---

## Development

### Reset Database

**Using npm script:**
```bash
npm run reset
```

**Using API:**
```bash
curl -X POST http://localhost:3001/api/reset
```

### Modify Seed Data

Edit `src/db/seed.js` to customize:
- Number of products (default: 1000)
- Categories list
- Number of suppliers (default: 50)
- Product generation logic
- Price ranges by category

After modifying, reset the database:
```bash
npm run reset
```

### Database Indexes

The following indexes are created for optimal query performance:
- `idx_product_name` - Product name lookups
- `idx_sku` - SKU searches
- `idx_category` - Category filtering
- `idx_status` - Status filtering
- `idx_price` - Price range queries
- `idx_stock` - Stock quantity filtering

### Logging

All operations are logged to console with timestamps:
```
[2024-01-15T10:30:00.000Z] [INFO] Server running on port 3001
[2024-01-15T10:30:15.123Z] [INFO] GET /api/products
[2024-01-15T10:30:20.456Z] [WARN] Validation errors for POST /api/products
[2024-01-15T10:30:25.789Z] [ERROR] Database error: SQLITE_CONSTRAINT
```

### Scripts

| Script | Command | Description |
|--------|---------|-------------|
| `npm start` | `node src/index.js` | Start server in production mode |
| `npm run dev` | `nodemon src/index.js` | Start with auto-reload (development) |
| `npm run seed` | `node src/db/seed.js` | Run database seeding manually |
| `npm run reset` | Reset script | Delete all data and re-seed |

---

## Architecture

```
backend/
├── data/                    # Database files (auto-generated)
│   └── products.db
├── src/
│   ├── db/
│   │   ├── database.js      # Database connection and schema
│   │   └── seed.js          # Data generation and seeding
│   ├── middleware/
│   │   ├── errorHandler.js  # Global error handler
│   │   └── validation.js    # Request validation rules
│   ├── routes/
│   │   ├── products.js      # Product CRUD endpoints
│   │   ├── categories.js    # Categories endpoints
│   │   └── suppliers.js     # Suppliers endpoints
│   ├── utils/
│   │   ├── delay.js         # Network delay simulator
│   │   └── errorSimulator.js # Random error generator
│   └── index.js             # Main server file
├── .env.example             # Environment variables template
├── .gitignore
├── package.json
└── README.md
```

---

## Technology Stack

- **Express.js** - Web framework
- **better-sqlite3** - SQLite database driver
- **express-validator** - Request validation
- **@faker-js/faker** - Realistic test data generation
- **cors** - Cross-origin resource sharing
- **dotenv** - Environment variable management
- **nodemon** - Development auto-reload

---

## License

MIT

---

## Support

For issues or questions, please check:
1. This README for common solutions
2. Console logs for detailed error messages
3. Validation error responses for field-specific issues

**Happy coding!** 🚀

