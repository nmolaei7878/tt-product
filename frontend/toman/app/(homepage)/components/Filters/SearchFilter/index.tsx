'use client';
import { useAddSearchParam } from '@/_shared/hooks/useAddSearchParams';
import { useDebounce } from '@/_shared/hooks/useDebounce';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

const SearchFilter = () => {
  const searchParams = useSearchParams();
  const addSearchParam = useAddSearchParam();

  const initialValue = searchParams.get('search') || '';
  const [value, setValue] = useState(initialValue);
  const debouncedValue = useDebounce(value, 500);

  useEffect(() => {
    if (debouncedValue !== initialValue) {
      addSearchParam('search', debouncedValue);
    }
  }, [debouncedValue, addSearchParam, initialValue]);

  return (
    <input
      type="text"
      placeholder="Search product name or SKU"
      className="border rounded px-3 py-2 w-full"
      value={value}
      onChange={(e) => setValue(e.target.value)}
    />
  );
};

export default SearchFilter;
