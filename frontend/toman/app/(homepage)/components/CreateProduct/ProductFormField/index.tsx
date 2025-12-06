'use client';

import Form from '../Form';
import ProductCategorySelect from '../ProductCategorySelect';
import ProductStatusSelect from '../ProductStatusSelect';

export default function ProductFormField() {
  return (
    <div className="grid grid-cols-2 gap-4">
      <Form name="product_name" label="Product Name" />
      <Form name="sku" label="SKU" />

      <ProductCategorySelect />
      <ProductStatusSelect />

      <Form name="price" label="Price" type="number" />

      <Form name="stock_quantity" label="Stock Quantity" type="number" />

      <Form
        name="description"
        label="Description"
        textarea
        className="col-span-2"
      />
    </div>
  );
}
