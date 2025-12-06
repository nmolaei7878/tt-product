'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { useCreateProduct } from '../../query/add-product';
import ProductForm from './ProductForm';
import {
  CreateProductFormValues,
  createProductSchema,
} from './schema/create-product';

export default function CreateProductDialog() {
  const [open, setOpen] = useState(false);

  const form = useForm<CreateProductFormValues>({
    resolver: zodResolver(createProductSchema) as any,
    defaultValues: { status: 'Active' },
  });

  const createProduct = useCreateProduct();

  const onSubmit = (values: CreateProductFormValues) => {
    createProduct.mutate(values, {
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
        <FormProvider {...form}>
          <ProductForm
            onSubmit={form.handleSubmit(onSubmit)}
            isSubmitting={createProduct.isPending}
            onCancel={() => setOpen(false)}
          />
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}
