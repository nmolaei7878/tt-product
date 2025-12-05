export interface ProductPayload {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  status?: string[];
  minPrice?: number;
  maxPrice?: number;
  minStock?: number;
  maxStock?: number;
}

export interface ProductDto {
  id: number;
  productName: string;
  sku: string;
  category: string;
  description?: string;
  price: number;
  costPrice?: number;
  stockQuantity: number;
  reorderLevel?: number;
  status: string;
  tags?: string[];
  supplier?: string;
  notes?: string;
  lastUpdated: string;
  createdAt: string;
}

export interface ProductResponseDto {
  data: ProductDto[];
  total: number;
  hasMore: boolean;
  page: number;
  limit: number;
}

function mapProduct(raw: any): ProductDto {
  return {
    id: raw.id,
    productName: raw.product_name,
    sku: raw.sku,
    category: raw.category,
    description: raw.description,
    price: raw.price,
    costPrice: raw.cost_price,
    stockQuantity: raw.stock_quantity,
    reorderLevel: raw.reorder_level,
    status: raw.status,
    tags: raw.tags,
    supplier: raw.supplier,
    notes: raw.notes,
    lastUpdated: raw.last_updated,
    createdAt: raw.created_at,
  };
}

export function mapProductResponseDto(response: any): ProductResponseDto {
  return {
    data: Array.isArray(response.data.data)
      ? response.data.data.map(mapProduct)
      : [],
    hasMore: response.hasMore,
    limit: response.limit,
    page: response.page,
    total: response.total,
  };
}
