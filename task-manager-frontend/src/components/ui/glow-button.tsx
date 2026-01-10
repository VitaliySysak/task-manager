import React from 'react';

import { cn } from '@/lib/utils';

type Props = {
  className?: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export const GlowButton: React.FC<React.PropsWithChildren<Props>> = ({ className, children, ...props }) => {
  return (
    <button type="button" className={cn('p-0.75 relative rounded-2xl text-white', className)} {...props}>
      <div className="absolute inset-0 bg-linear-to-r from-indigo-500 to-purple-500 rounded-2xl" />
      <div className="px-4 sm:px-8 py-2 bg-black rounded-2xl relative group transition duration-200 hover:bg-transparent ">
        {children}
      </div>
    </button>
  );
};
