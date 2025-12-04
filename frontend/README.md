# Senior Frontend Developer Assignment

## Product Catalog Management System

## Overview

Build a Product Catalog Management System with advanced filtering, infinite scroll pagination, and form handling capabilities. This assignment evaluates your ability to handle performance optimization and user experience design.


## Backend Setup

We've provided a ready-to-use backend API.

```bash
cd backend
npm install
npm start
```

### API Endpoints

**Base URL:** `http://localhost:3001/api` (with 1000 pre-seeded products)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/products` | Get paginated products with filters |
| POST | `/products` | Create new product |
| DELETE | `/products/:id` | Delete product |
| GET | `/categories` | Get all categories |
| GET | `/suppliers` | Get all suppliers (supports `?search=`) |

### GET /products - Query Parameters

- `page`, `limit` - Pagination
- `search` - Search in product name and SKU
- `category` - Filter by category
- `status` - Filter by status (multiple allowed)
- `minPrice`, `maxPrice` - Price range
- `minStock`, `maxStock` - Stock range

**Response:**
```json
{
  "data": [...],
  "total": 1000,
  "hasMore": true,
  "page": 1,
  "limit": 20
}
```

### Product Schema

```typescript
{
  id: number;                    // Auto-generated
  product_name: string;          // Required, min 3 chars
  sku: string;                   // Required, unique, format: XXX-####
  category: string;              // Required
  description?: string;          // Optional, max 500 chars
  price: number;                 // Required, 0.01 - 999999.99
  cost_price?: number;           // Optional, must be < price
  stock_quantity: number;        // Required, integer >= 0
  reorder_level?: number;        // Optional, must be < stock_quantity
  status: string;                // 'Active' | 'Inactive' | 'Discontinued'
  tags?: string[];               // Optional array
  supplier?: string;             // Optional
  notes?: string;                // Optional
  last_updated: string;          // Auto-generated
  created_at: string;            // Auto-generated
}
```

All validations are enforced by the backend. Invalid requests return `400` with error details.



## Your Task

Build a frontend application that allows users to:

1. **View and browse** the product catalog with infinite scroll
2. **Search and filter** products using multiple criteria with URL persistence
3. **Create** products with proper validation
4. **Delete** products with confirmation

### Core Requirements

- Product listing table with infinite scroll (load 20 items per scroll)
- Search functionality (debounced, cancellable)
- Multiple filters working together:
  - Text search (product name, SKU)
  - Category
  - Status
  - Price range
  - Stock range
  - Date range
- Filter state persists in URL (shareable links)
- Product creation form with validation
- Delete confirmation
- Proper error handling and loading states
- Responsive design

### Technical Expectations

- Clean, maintainable code architecture
- Performance optimization for large datasets
- Good user experience with appropriate feedback
- TypeScript preferred but not required



## Deliverables

1. **Source Code** - Well-organized project with README
2. **Documentation** - Setup instructions, technology choices, trade-offs
3. **Working Application** - Deployed or with local setup instructions



## Technology Stack

**Required:**
- React (with hooks)
- TypeScript

**Your choice:**
- UI libraries
- Styling approach
- Build tools



## Final notes

Share your completed solution via GitHub repository with [**Ali Abbasi**](https://github.com/alieabbasi).

If you have any questions about the assignment or encounter issues with the backend setup, please reach out to us at **a.abbasi@toman.ir**.

**Good luck! We're excited to see your solution.**