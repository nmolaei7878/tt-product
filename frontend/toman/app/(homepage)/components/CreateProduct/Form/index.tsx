'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useFormContext } from 'react-hook-form';

export default function Form({
  name,
  label,
  type = 'text',
  textarea = false,
  className,
}: {
  name: string;
  label: string;
  type?: string;
  textarea?: boolean;
  className?: string;
}) {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  const error = errors[name]?.message as string | undefined;

  return (
    <div className={className}>
      <Label>{label}</Label>

      {textarea ? (
        <Textarea {...register(name)} />
      ) : (
        <Input type={type} {...register(name)} />
      )}

      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  );
}
