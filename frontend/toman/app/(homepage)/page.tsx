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
    <div className="flex w-full max-w-[1400px] mx-auto gap-6 p-6 h-[calc(100vh-2rem)]">
      <div className="w-64  sticky top-6 h-fit">
        <Filters />
      </div>

      <div className="flex-1 overflow-y-auto space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
          {products.map((p) => (
            <ListTile key={p.id} product={p} />
          ))}
        </div>

        <div ref={loadMoreRef} className="flex justify-center p-4">
          {isFetchingNextPage && <span>Loading...</span>}
          {!hasNextPage && <span>No more products</span>}
        </div>
      </div>

      <div className="w-64 sticky top-6 space-y-4 h-fit">
        <CategoryList />
        <CreateProductDialog />
      </div>
    </div>
  );
}
