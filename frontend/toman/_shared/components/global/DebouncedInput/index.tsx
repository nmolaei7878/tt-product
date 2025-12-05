import React, { useState, useEffect } from 'react';
import { useDebounce } from 'use-debounce';

type DebouncedInputProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  delay?: number;
};

export const DebouncedInput: React.FC<DebouncedInputProps> = ({
  value,
  onChange,
  placeholder = '',
  delay = 250,
}) => {
  const [inputValue, setInputValue] = useState(value);

  const [debouncedValue] = useDebounce(inputValue, delay);

  useEffect(() => {
    onChange(debouncedValue);
  }, [debouncedValue]);

  return (
    <input
      className="bg-black p-4 m-2"
      type="text"
      value={inputValue}
      onChange={(e) => setInputValue(e.target.value)}
      placeholder={placeholder}
    />
  );
};
