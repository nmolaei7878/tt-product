'use client';

import { useRouter } from 'next/navigation';
import React from 'react';
import { ProductDto } from '../../query/product/types';

interface Props {
  product: ProductDto;
}

const ListTile: React.FC<Props> = ({ product }) => {
  const router = useRouter();

  function navigateToDetailPage() {
    router.push(`/${product.id}`);
  }

  return (
    <>
      <div
        onClick={navigateToDetailPage}
        className="w-44 h-44 relative group cursor-pointer mt-2"
      >
        <div className="hidden p-4 group-hover:block absolute bottom-0 left-0 w-full h-1/3 z-20 rounded-3xl bg-slate-500 opacity-70">
          <p className="text-sm text-white">{product.productName}</p>
        </div>
      </div>
    </>
  );
};

export default ListTile;
