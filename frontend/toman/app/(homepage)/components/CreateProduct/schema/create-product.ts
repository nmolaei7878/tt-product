import { z } from 'zod';

export const createProductSchema = z.object({
  product_name: z.string().min(1, 'Product name is required'),
  sku: z.string().min(1, 'SKU is required'),
  category: z.string().min(1, 'Category is required'),

  price: z.preprocess((v) => Number(v), z.number().min(0.01)),
  stock_quantity: z.preprocess((v) => Number(v), z.number().min(0)),

  status: z.enum(['Active', 'Inactive']),
  description: z.string().optional(),
  costPrice: z.number().optional(),
  reorder_level: z.number().optional(),
  supplier: z.string().optional(),
  notes: z.string().optional(),
});

export type CreateProductFormValues = z.infer<typeof createProductSchema>;
