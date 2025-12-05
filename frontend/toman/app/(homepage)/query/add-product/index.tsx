import axiosClient from '@/_shared/config/axios';
import { ErrorResponse, toErrorResponse } from '@/_shared/config/error';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AddProductPayload } from './types';

export const addProduct = async (
  payload: AddProductPayload
): Promise<boolean> => {
  try {
    const response = await axiosClient.post('/api/products', {
      product_name: payload.product_name,
      sku: payload.sku,
      category: payload.category,
      description: payload.description,
      price: payload.price,
      cost_price: payload.cost_price,
      stock_quantity: payload.stock_quantity,
      reorder_level: payload.reorder_level,
      status: payload.status,
      tags: payload.tags,
      supplier: payload.supplier,
      notes: payload.notes,
    });

    return response.data;
  } catch (e) {
    throw toErrorResponse(e);
  }
};

export const useCreateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation<boolean, ErrorResponse, AddProductPayload>({
    mutationFn: addProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
};
