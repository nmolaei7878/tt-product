import axiosClient from '@/_shared/config/axios';
import { ErrorResponse, toErrorResponse } from '@/_shared/config/error';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AddProductPayload } from './types';

export const addProduct = async (
  payload: AddProductPayload
): Promise<boolean> => {
  try {
    const response = await axiosClient.post('/api/products', { ...payload });
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
