'use client';
import { useEffect, useRef } from 'react';
import ListTile from './components/ListTile';
import { useFetchProductsInfinite } from './query/product';

export default function HomePage() {
  const { data, fetchNextPage, isFetchingNextPage, hasNextPage } =
    useFetchProductsInfinite({ limit: 20 });

  const loadMoreRef = useRef(null);

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

  return (
    <div className="p-4 space-y-4 max-w-md mx-auto">
      {products.map((p) => (
        <div key={p.id} className="rounded-2xl shadow-sm">
          <ListTile product={p} />
        </div>
      ))}

      <div ref={loadMoreRef} className="flex justify-center p-4">
        {isFetchingNextPage && (
          <span className="opacity-60 text-sm">Loading...</span>
        )}
        {!hasNextPage && (
          <span className="opacity-60 text-sm">No more products</span>
        )}
      </div>
    </div>
  );
}
