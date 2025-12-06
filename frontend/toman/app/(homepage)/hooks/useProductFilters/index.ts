'use client';
import { useSearchParams } from 'next/navigation';
import { useMemo } from 'react';
import { StatusType } from '../../components/Filters/StatusFilter';
import { ProductPayload } from '../../query/get-product/types';

export const useProductFilters = (): ProductPayload => {
  const searchParams = useSearchParams();

  return useMemo(() => {
    const statusRaw = searchParams.get('status');

    return {
      search: searchParams.get('search') || undefined,
      status: statusRaw
        ? (statusRaw.split(',').filter(Boolean) as StatusType[])
        : undefined,
      category: searchParams.get('category') || undefined,
      minPrice: searchParams.get('minPrice')
        ? Number(searchParams.get('minPrice'))
        : undefined,
      maxPrice: searchParams.get('maxPrice')
        ? Number(searchParams.get('maxPrice'))
        : undefined,
      minStock: searchParams.get('minStock')
        ? Number(searchParams.get('minStock'))
        : undefined,
      maxStock: searchParams.get('maxStock')
        ? Number(searchParams.get('maxStock'))
        : undefined,
    };
  }, [searchParams]);
};
