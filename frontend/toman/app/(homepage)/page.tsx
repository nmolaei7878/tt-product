'use client';
import { useEffect, useRef } from 'react';
import { toast } from 'sonner';
import CategoryList from './components/CategoryList';
import CreateProductDialog from './components/CreateProduct';
import Filters from './components/Filters';
import ListTile from './components/ListTile';
import { useProductFilters } from './hooks/useProductFilters';
import { useFetchProductsInfinite } from './query/get-product';

export default function HomePage() {
  const filters = useProductFilters();
  const { data, fetchNextPage, isFetchingNextPage, hasNextPage, error } =
    useFetchProductsInfinite({ ...filters, limit: 20 });

  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!loadMoreRef.current) return;

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    });

    observer.observe(loadMoreRef.current);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const products = data?.pages.flatMap((p) => p.data) || [];

  if (error) {
    toast.error(error.data.error ?? 'Error Occured');
  }

  return (
    <div className="flex gap-4 p-10 m-auto w-full">
      <div className="flex-1 w-full space-y-4">
        <Filters />

        <div className="grid grid-cols-2 gap-2">
          {products.map((p) => (
            <div key={p.id}>
              <ListTile product={p} />
            </div>
          ))}
        </div>

        <div ref={loadMoreRef} className="flex justify-center p-4">
          {isFetchingNextPage && <span>Loading...</span>}
          {!hasNextPage && <span>No more products</span>}
        </div>
      </div>

      {/* RIGHT SIDE – CATEGORIES */}
      <div className="w-64">
        <CategoryList />
        <CreateProductDialog />
      </div>
    </div>
  );
}
