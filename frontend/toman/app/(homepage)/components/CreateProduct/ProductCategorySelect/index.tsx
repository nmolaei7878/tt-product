'use client';

import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useFormContext } from 'react-hook-form';

const categories = [
  'Electronics',
  'Clothing',
  'Food & Beverages',
  'Books',
  'Home & Garden',
  'Sports & Outdoors',
  'Toys & Games',
  'Beauty & Personal Care',
  'Automotive',
  'Office Supplies',
  'Pet Supplies',
  'Health & Wellness',
];

export default function ProductCategorySelect() {
  const { watch, setValue, formState } = useFormContext();
  const error = formState.errors.category?.message as string | undefined;

  return (
    <div>
      <Label>Category</Label>

      <Select
        value={watch('category')}
        onValueChange={(v) => setValue('category', v, { shouldValidate: true })}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select category" />
        </SelectTrigger>
        <SelectContent>
          {categories.map((c) => (
            <SelectItem key={c} value={c}>
              {c}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  );
}
