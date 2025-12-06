import axiosClient from '@/_shared/config/axios';
import { toErrorResponse } from '@/_shared/config/error';
import { useQuery } from '@tanstack/react-query';
import { Category, mapCategoryList } from './types';

export default function useFetchCategory() {
  return useQuery({
    queryKey: [`category`],
    queryFn: () => fetchCategory(),
  });
}

const fetchCategory = async (): Promise<Category[]> => {
  try {
    const res = await axiosClient.get('/api/categories');
    return mapCategoryList(res?.data);
  } catch (e) {
    throw toErrorResponse(e);
  }
};
