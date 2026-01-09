import React from 'react';
import { useFormContext } from 'react-hook-form';

import { cn } from '@/lib/utils';

import { Input } from '../ui/input';

type Props = {
  className?: string;
  name: string;
  label: string;
} & React.InputHTMLAttributes<HTMLInputElement>;

export const FormInput: React.FC<Props> = ({ className, name, label, ...props }) => {
  const {
    formState: { errors },
    register,
    watch,
    setValue,
  } = useFormContext();
  const value = watch(name);
  const errorText = errors[name]?.message as string;
  const charCount = value?.length ?? 0;

  if (charCount > 50) {
    setValue(name, value.slice(0, 50), { shouldValidate: true });
  }

  return (
    <label className={cn('relative w-full text-gray-500 focus-within:text-primary', className)}>
      <div className="dark:bg-input/30 pt-2">
        {label && <p className="font-medium text-md ml-2">{label}</p>}
        <Input
          className={cn(
            'border-0 border-b-2 border-[#657786] rounded-none dark:bg-transparent pb-0 h-8',
            'focus-visible:border-b-2 focus-visible:ring-0 focus-visible:border-primary',
          )}
          {...register(name)}
          {...props}
        />
      </div>
      <div className="flex">
        {errorText && <p className="text-red-500">{errorText}</p>}
        <p className="ml-auto mr-2 text-[#657786] font-semibold">
          {charCount}
          /50
        </p>
      </div>
    </label>
  );
};
