'use client';
import { useAddSearchParam } from '@/_shared/hooks/useAddSearchParams';
import { useDebounce } from '@/_shared/hooks/useDebounce';
import { useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';

interface Props {
  type: 'minStock' | 'maxStock';
}

const StockRangeFilter: React.FC<Props> = ({ type }) => {
  const searchParams = useSearchParams();
  const addSearchParam = useAddSearchParam();

  const initialValue = searchParams.get(type) || '';
  const [value, setValue] = useState(initialValue);
  const debouncedValue = useDebounce(value, 500);

  useEffect(() => {
    if (debouncedValue !== initialValue) addSearchParam(type, debouncedValue);
  }, [debouncedValue, addSearchParam, initialValue, type]);

  return (
    <input
      type="number"
      placeholder={type === 'minStock' ? 'Min stock' : 'Max stock'}
      className="border rounded px-2 py-1 my-1 flex-1"
      value={value}
      onChange={(e) => setValue(e.target.value)}
    />
  );
};

export default StockRangeFilter;
