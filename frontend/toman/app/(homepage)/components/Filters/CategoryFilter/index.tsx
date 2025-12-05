'use client';
import { useAddSearchParam } from '@/_shared/hooks/useAddSearchParams';
import { useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';

interface Props {
  categories: string[];
}

const CategoryFilter: React.FC<Props> = ({ categories }) => {
  const searchParams = useSearchParams();
  const addSearchParam = useAddSearchParam();

  const initialValue = searchParams.get('category') || '';
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    if (value !== initialValue) addSearchParam('category', value);
  }, [value, addSearchParam, initialValue]);

  return (
    <select
      value={value}
      onChange={(e) => setValue(e.target.value)}
      className="border rounded px-3 py-2 w-full"
    >
      <option value="">All Categories</option>
      {categories.map((c) => (
        <option key={c} value={c}>
          {c}
        </option>
      ))}
    </select>
  );
};

export default CategoryFilter;
