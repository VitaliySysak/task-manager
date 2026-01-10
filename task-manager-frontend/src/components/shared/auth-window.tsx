import React from 'react';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';
import { GlowButton } from '../ui/glow-button';

interface Props {
  className?: string;
}

export const AuthWindow: React.FC<Props> = ({ className }) => {
  return (
    <div
      className={cn(
        'flex justify-center items-center px-4 bg-primary h-96.25 sm:h-96.25 2xl:h-120.25 rounded-t-md',
        className,
      )}
    >
      <div className="text-secondary-dark/40 text-md sm:text-xl lg:text-2xl text-center">
        <p className="mb-4 sm:mb-2">To get started with your first task, please:</p>
        <div className="flex justify-center items-center gap-2">
          <span className="text-md sm:text-xl lg:text-2xl font-medium">Log in or register</span>
          <Link to="/auth">
            <GlowButton className="text-xs cursor-pointer">Go to Auth</GlowButton>
          </Link>
        </div>
      </div>
    </div>
  );
};
