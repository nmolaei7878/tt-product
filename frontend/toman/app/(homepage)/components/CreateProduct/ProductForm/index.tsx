'use client';

import { Button } from '@/components/ui/button';
import { DialogFooter } from '@/components/ui/dialog';
import ProductFormField from '../ProductFormField';

export default function ProductForm({
  onSubmit,
  isSubmitting,
  onCancel,
}: {
  onSubmit: () => void;
  isSubmitting: boolean;
  onCancel: () => void;
}) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <ProductFormField />

      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Creating...' : 'Create Product'}
        </Button>
      </DialogFooter>
    </form>
  );
}
