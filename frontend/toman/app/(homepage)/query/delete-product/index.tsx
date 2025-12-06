import axiosClient from '@/_shared/config/axios';
import { ErrorResponse, toErrorResponse } from '@/_shared/config/error';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const deleteProduct = async (id: number): Promise<void> => {
  try {
    await axiosClient.delete(`/api/products/${id}`);
  } catch (e) {
    throw toErrorResponse(e);
  }
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();
  return useMutation<void, ErrorResponse, number>({
    mutationFn: deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
};
