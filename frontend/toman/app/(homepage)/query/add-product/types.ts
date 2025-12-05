export interface AddProductPayload {
  product_name: string;
  sku: string;
  category: string;
  description?: string;
  price: number;
  cost_price?: number;
  stock_quantity: number;
  reorder_level?: number;
  status: string;
  tags?: string[];
  supplier?: string;
  notes?: string;
}
