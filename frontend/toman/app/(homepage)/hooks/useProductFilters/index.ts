'use client';
import { useSearchParams } from 'next/navigation';
import { StatusType } from '../../components/Filters/StatusFilter';
import { ProductPayload } from '../../query/product/types';

export const useProductFilters = (): ProductPayload => {
  const searchParams = useSearchParams();

  return {
    search: searchParams.get('search') || undefined,
    status: searchParams.get('status')?.split(',').filter(Boolean) as
      | StatusType[]
      | undefined,
    category: searchParams.get('category') || undefined,
    minPrice: Number(searchParams.get('minPrice')) || undefined,
    maxPrice: Number(searchParams.get('maxPrice')) || undefined,
    minStock: Number(searchParams.get('minStock')) || undefined,
    maxStock: Number(searchParams.get('maxStock')) || undefined,
  };
};
