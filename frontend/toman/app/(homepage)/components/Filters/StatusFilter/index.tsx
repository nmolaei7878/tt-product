'use client';
import { useAddSearchParam } from '@/_shared/hooks/useAddSearchParams';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';

export type StatusType = 'Active' | 'Inactive' | 'Discontinued';
const STATUS_OPTIONS: StatusType[] = ['Active', 'Inactive', 'Discontinued'];

const StatusFilter = () => {
  const searchParams = useSearchParams();
  const addSearchParam = useAddSearchParam();

  const initialStatus = (searchParams.get('status') || '')
    .split(',')
    .filter((s) => STATUS_OPTIONS.includes(s as StatusType)) as StatusType[];

  const [selected, setSelected] = useState<StatusType[]>(initialStatus);

  const toggleStatus = (s: StatusType) => {
    const newSelected = selected.includes(s)
      ? selected.filter((x) => x !== s)
      : [...selected, s];
    setSelected(newSelected);
    addSearchParam('status', newSelected.join(','));
  };

  return (
    <div className="flex gap-2 flex-wrap">
      {STATUS_OPTIONS.map((s) => (
        <label key={s} className="flex items-center gap-1">
          <input
            type="checkbox"
            checked={selected.includes(s)}
            onChange={() => toggleStatus(s)}
          />
          {s}
        </label>
      ))}
    </div>
  );
};

export default StatusFilter;
