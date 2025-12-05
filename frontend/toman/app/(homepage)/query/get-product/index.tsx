import axiosClient from '@/_shared/config/axios';
import { ErrorResponse, toErrorResponse } from '@/_shared/config/error';
import { useInfiniteQuery } from '@tanstack/react-query';
import {
  mapProductResponseDto,
  ProductPayload,
  ProductResponseDto,
} from './types';

const fetchProducts = async (
  payload: ProductPayload
): Promise<ProductResponseDto> => {
  try {
    const response = await axiosClient.get('/api/products', {
      params: payload,
    });
    return mapProductResponseDto(response);
  } catch (e) {
    throw toErrorResponse(e);
  }
};

export const useFetchProductsInfinite = (
  filters: Omit<ProductPayload, 'page'>
) => {
  return useInfiniteQuery<ProductResponseDto, ErrorResponse>({
    queryKey: ['products', JSON.stringify(filters)],
    initialPageParam: 1,
    queryFn: ({ pageParam = 1 }) =>
      fetchProducts({ ...filters, page: pageParam as number }),
    getNextPageParam: (last) => (last.hasMore ? last.page + 1 : undefined),
  });
};
