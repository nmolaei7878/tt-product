'use client';
import { useAddSearchParam } from '@/_shared/hooks/useAddSearchParams';
import { useDebounce } from '@/_shared/hooks/useDebounce';
import { useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';

interface Props {
  type: 'minPrice' | 'maxPrice';
}

const PriceRangeFilter: React.FC<Props> = ({ type }) => {
  const searchParams = useSearchParams();
  const addSearchParam = useAddSearchParam();

  const initialValue = searchParams.get(type) || '';
  const [value, setValue] = useState(initialValue);
  const debouncedValue = useDebounce(value, 500);

  useEffect(() => {
    if (debouncedValue !== initialValue) addSearchParam(type, debouncedValue);
  }, [debouncedValue, initialValue, type]);

  return (
    <input
      type="number"
      placeholder={type === 'minPrice' ? 'Min price' : 'Max price'}
      className="border rounded px-2 py-1 my-1 flex-1"
      value={value}
      onChange={(e) => setValue(e.target.value)}
    />
  );
};

export default PriceRangeFilter;
