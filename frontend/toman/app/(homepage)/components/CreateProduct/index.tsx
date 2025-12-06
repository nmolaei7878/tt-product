'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { useCreateProduct } from '../../query/add-product';

const createProductSchema = z.object({
  product_name: z.string().min(1, 'Product name is required'),
  sku: z.string().min(1, 'SKU is required'),
  category: z.string().min(1, 'Category is required'),

  price: z.preprocess(
    (val) => Number(val),
    z.number().min(0, 'Price must be a number')
  ),
  stock_quantity: z.preprocess(
    (val) => Number(val),
    z.number().min(0, 'Stock quantity must be a number')
  ),

  status: z.enum(['Active', 'Inactive']),
  description: z.string().optional(),
  costPrice: z.number().optional(),
  reorder_level: z.number().optional(),
  supplier: z.string().optional(),
  notes: z.string().optional(),
});

type CreateProductFormValues = z.infer<typeof createProductSchema>;

export default function CreateProductDialog() {
  const [open, setOpen] = useState(false);

  const form = useForm<z.infer<typeof createProductSchema>>({
    resolver: zodResolver(createProductSchema) as any,
    defaultValues: { status: 'Active' },
  });

  const createMutation = useCreateProduct();

  const onSubmit = (values: CreateProductFormValues) => {
    createMutation.mutate(values, {
      onSuccess: () => {
        toast.success('Product created successfully');
        form.reset();
        setOpen(false);
      },
      onError: (error: any) => {
        const backendErrors = error?.data?.errors;

        if (backendErrors) {
          backendErrors.forEach((e: { field: string; message: string }) => {
            form.setError(e.field as keyof CreateProductFormValues, {
              type: 'server',
              message: e.message,
            });
          });
          return;
        }

        toast.error('Failed to create product');
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full mt-3 px-3">Create Product</Button>
      </DialogTrigger>

      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create New Product</DialogTitle>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Product Name</Label>
              <Input {...form.register('product_name')} />
              {form.formState.errors.product_name && (
                <p className="text-red-500 text-sm">
                  {form.formState.errors.product_name.message}
                </p>
              )}
            </div>

            <div>
              <Label>SKU</Label>
              <Input {...form.register('sku')} />
              {form.formState.errors.sku && (
                <p className="text-red-500 text-sm">
                  {form.formState.errors.sku.message}
                </p>
              )}
            </div>

            <div>
              <Label>Category</Label>
              <Select
                onValueChange={(v) =>
                  form.setValue('category', v, { shouldValidate: true })
                }
                value={form.watch('category')}
                defaultValue=""
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Electronics">Electronics</SelectItem>
                  <SelectItem value="Clothing">Clothing</SelectItem>
                  <SelectItem value="Food & Beverages">
                    Food & Beverages
                  </SelectItem>
                  <SelectItem value="Books">Books</SelectItem>
                  <SelectItem value="Home & Garden">Home & Garden</SelectItem>
                  <SelectItem value="Sports & Outdoors">
                    Sports & Outdoors
                  </SelectItem>
                  <SelectItem value="Toys & Games">Toys & Games</SelectItem>
                  <SelectItem value="Beauty & Personal Care">
                    Beauty & Personal Care
                  </SelectItem>
                  <SelectItem value="Automotive">Automotive</SelectItem>
                  <SelectItem value="Office Supplies">
                    Office Supplies
                  </SelectItem>
                  <SelectItem value="Pet Supplies">Pet Supplies</SelectItem>
                  <SelectItem value="Health & Wellness">
                    Health & Wellness
                  </SelectItem>
                </SelectContent>
              </Select>
              {form.formState.errors.category && (
                <p className="text-red-500 text-sm">
                  {form.formState.errors.category.message}
                </p>
              )}
            </div>

            <div>
              <Label>Status</Label>
              <Select
                value={form.watch('status')}
                onValueChange={(v) =>
                  form.setValue('status', v as 'Active' | 'Inactive', {
                    shouldValidate: true,
                  })
                }
                defaultValue="Active"
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Price</Label>
              <Input type="number" {...form.register('price')} />

              {form.formState.errors.price && (
                <p className="text-red-500 text-sm">
                  {form.formState.errors.price.message}
                </p>
              )}
            </div>

            <div>
              <Label>Stock Quantity</Label>
              <Input type="number" {...form.register('stock_quantity')} />

              {form.formState.errors.stock_quantity && (
                <p className="text-red-500 text-sm">
                  {form.formState.errors.stock_quantity.message}
                </p>
              )}
            </div>
            <div className="col-span-2">
              <Label>Description</Label>
              <Textarea {...form.register('description')} />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={createMutation.isPending}>
              {createMutation.isPending ? 'Creating...' : 'Create Product'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
