import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { cn } from '@/lib/utils';
import { selectTitleFilter, setTitleFilter } from '@/store/tasks/filters-slice';
import { Input } from '../ui/input';
import { Search } from 'lucide-react';

type Props = {
  className?: string;
};

export const Filter: React.FC<Props> = ({ className }) => {
  const dispatch = useDispatch();
  const titleFilter = useSelector(selectTitleFilter);

  return (
    <div
      className={cn(
        'flex w-full md:w-64 h-12 px-6 md:px-4 items-center justify-between bg-primary rounded-md',
        className,
      )}
    >
      <Input
        name="search"
        className="w-full h-8 border-none text-secondary-dark text-md lg:text-lg placeholder:translate-y-px"
        type="text"
        placeholder="Search"
        value={titleFilter}
        onChange={(even) => dispatch(setTitleFilter(even.target.value))}
      />
      <button type="button" className="cursor-pointer">
        <Search className="w-4 h-4 sm:w-6 sm:h-6 text-secondary-dark/80" />
      </button>
    </div>
  );
};
