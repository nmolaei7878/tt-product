'use client';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';

export function useAddSearchParam() {
  const router = useRouter();
  const searchParams = useSearchParams();

  return useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams?.toString());
      if (value) params.set(key, value);
      else params.delete(key);
      router.replace(`?${params.toString()}`, { scroll: false });
    },
    [router, searchParams]
  );
}
