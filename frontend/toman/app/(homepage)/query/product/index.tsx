import axiosClient from '@/_shared/config/axios';
import { toErrorResponse } from '@/_shared/config/error';
import { useInfiniteQuery } from '@tanstack/react-query';
import { ProductPayload, ProductResponseDto } from './types';

const fetchProducts = async (
  payload: ProductPayload
): Promise<ProductResponseDto> => {
  try {
    const res = await axiosClient.get('/api/products', { params: payload });
    return res.data;
  } catch (e) {
    throw toErrorResponse(e);
  }
};

export const useFetchProductsInfinite = (
  filters: Omit<ProductPayload, 'page'>
) => {
  return useInfiniteQuery({
    queryKey: ['products', filters],
    initialPageParam: 1,
    queryFn: ({ pageParam = 1 }) =>
      fetchProducts({ ...filters, page: pageParam }),
    getNextPageParam: (last) => (last.hasMore ? last.page + 1 : undefined),
  });
};
