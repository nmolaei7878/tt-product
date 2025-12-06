'use client';

import { useAddSearchParam } from '@/_shared/hooks/useAddSearchParams';
import { useSearchParams } from 'next/navigation';
import { useMemo } from 'react';
import useFetchCategory from '../../query/get-category';
import { Category } from '../../query/get-category/types';

export default function CategoryList() {
  const { data: categories = [] } = useFetchCategory();
  const searchParams = useSearchParams();
  const addSearchParam = useAddSearchParam();

  const selectedCategory = useMemo(
    () => searchParams.get('category') || '',
    [searchParams]
  );

  const handleClick = (categoryName: string) => {
    addSearchParam('category', categoryName);
  };

  return (
    <div className="space-y-2 p-2 border rounded-lg">
      <h3 className="font-semibold mb-2">Categories</h3>

      <ul className="space-y-1">
        {categories.map((c: Category) => (
          <li key={c.id}>
            <button
              onClick={() => handleClick(c.name)}
              className={`
                w-full text-left px-3 py-2 rounded-md transition
                ${
                  selectedCategory === c.name
                    ? 'bg-blue-500 text-white'
                    : 'hover:bg-gray-100'
                }
              `}
            >
              {c.name}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
