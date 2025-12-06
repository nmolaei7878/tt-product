'use client';

import useFetchCategory from '@/app/(homepage)/query/get-category';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useFormContext } from 'react-hook-form';

export default function ProductCategorySelect() {
  const { watch, setValue, formState } = useFormContext();
  const error = formState.errors.category?.message as string | undefined;
  const { data, isLoading } = useFetchCategory();
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
          {isLoading ? (
            <div>Loading...</div>
          ) : (
            <>
              {data &&
                data?.map((category) => (
                  <SelectItem key={category.id} value={category.name}>
                    {category.name}
                  </SelectItem>
                ))}
            </>
          )}
        </SelectContent>
      </Select>

      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  );
}
