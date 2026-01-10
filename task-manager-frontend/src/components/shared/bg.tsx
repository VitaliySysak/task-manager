import React from 'react';
import { cn } from '@/lib/utils';

interface Props {
  className?: string;
}

export const Bg: React.FC<Props> = ({ className }) => {
  return (
    <div className={cn('select-none', className)}>
      <img
        className="w-full hidden sm:hidden md:hidden lg:block"
        src="/images/bg-desktop-dark.webp"
        fetchPriority="high"
        alt="hero"
      />
      <img
        className="w-full sm:block md:block lg:hidden"
        src="/images/bg-mobile-dark.webp"
        fetchPriority="high"
        alt="hero"
      />
    </div>
  );
};
