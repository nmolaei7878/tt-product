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

export default function ProductStatusSelect() {
  const { watch, setValue } = useFormContext();

  return (
    <div>
      <Label className="mb-3">Status</Label>

      <Select
        value={watch('status')}
        onValueChange={(v) =>
          setValue('status', v as any, { shouldValidate: true })
        }
      >
        <SelectTrigger>
          <SelectValue placeholder="Select status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Active">Active</SelectItem>
          <SelectItem value="Inactive">Inactive</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
