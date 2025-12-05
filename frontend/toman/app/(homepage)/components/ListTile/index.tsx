'use client';

import React from 'react';
import { ProductDto } from '../../query/product/types';

interface Props {
  product: ProductDto;
}

const ListTile: React.FC<Props> = ({ product }) => {
  const statusColor =
    product.status === 'Active'
      ? 'bg-green-100 text-green-700 border border-green-300'
      : 'bg-red-100 text-red-700 border border-red-300';

  return (
    <div className="rounded-2xl shadow-sm border border-neutral-200 bg-white overflow-hidden">
      <div className="p-4 space-y-3">
        <div className="flex justify-between items-start">
          <p className="font-semibold text-xl text-black">
            {product.productName}
          </p>

          <span className={`text-sm px-2 py-1 rounded-lg ${statusColor}`}>
            {product.status}
          </span>
        </div>

        <div className="text-sm grid grid-cols-2 gap-y-1 text-black">
          <div className="opacity-60">SKU:</div>
          <div className="font-medium">{product.sku}</div>

          <div className="opacity-60">Category:</div>
          <div className="font-medium">{product.category}</div>
        </div>

        {product.description && (
          <p className="text-sm text-black line-clamp-2">
            {product.description}
          </p>
        )}

        <div className="grid grid-cols-2 gap-3 pt-2 text-black">
          <div className="p-3 bg-blue-50 rounded-xl border border-blue-200 flex flex-col">
            <span className="text-xs">Price</span>
            <span className="text-base font-semibold text-blue-700">
              ${product.price}
            </span>
          </div>

          <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 flex flex-col">
            <span className="text-xs">Cost Price</span>
            <span className="text-base font-semibold text-amber-700">
              ${product.costPrice}
            </span>
          </div>

          <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 flex flex-col col-span-2">
            <span className="text-xs">Stock Quantity</span>
            <span className="text-base font-semibold text-emerald-700">
              {product.stockQuantity}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListTile;
