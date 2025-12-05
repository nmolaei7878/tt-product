import axiosClient from '@/_shared/config/axios';
import { toErrorResponse } from '@/_shared/config/error';
import { useInfiniteQuery } from '@tanstack/react-query';
import {
  mapProductResponseDto,
  ProductPayload,
  ProductResponseDto,
} from './types';

export async function fetchProducts(
  payload: ProductPayload
): Promise<ProductResponseDto> {
  try {
    const res = await axiosClient.get('/api/products', {
      params: { ...payload },
    });

    return mapProductResponseDto(res.data);
  } catch (e) {
    throw toErrorResponse(e);
  }
}

export function useFetchProductsInfinite(
  payload: Omit<ProductPayload, 'page'>
) {
  return useInfiniteQuery({
    queryKey: ['products', payload],
    initialPageParam: 1,

    queryFn: async ({ pageParam }) => {
      return fetchProducts({
        ...payload,
        page: pageParam,
      });
    },

    getNextPageParam: (lastPage) =>
      lastPage.hasMore ? lastPage.page + 1 : undefined,
  });
}
