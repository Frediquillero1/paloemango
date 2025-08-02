'use client'; // Enables client-side rendering

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useProductFilters } from '../../hooks/use-product-filters';

export const ProductSort = () => {
  const [filters, setFilters] = useProductFilters(); // Retrieve filters state and setter function

  return (
    <div className='flex items-center gap-2'>
      {/* Curated Sort Button */}
      <Button
        size={'sm'}
        className={cn(
          'rounded-full bg-white hover:bg-white',
          filters.sort !== 'curated' && // Highlight button when not selected
            'bg-transparent border-transparent hover:border-border hover:bg-transparent'
        )}
        variant={'secondary'}
        onClick={() => setFilters({ sort: 'curated' })} // Update the sort filter to "curated"
      >
        Curated
      </Button>

      {/* Trending Sort Button */}
      <Button
        size={'sm'}
        className={cn(
          'rounded-full bg-white hover:bg-white',
          filters.sort !== 'trending' && // Highlight button when not selected
            'bg-transparent border-transparent hover:border-border hover:bg-transparent'
        )}
        variant={'secondary'}
        onClick={() => setFilters({ sort: 'trending' })} // Update the sort filter to "trending"
      >
        Trending
      </Button>

      {/* Hot & New Sort Button */}
      <Button
        size={'sm'}
        className={cn(
          'rounded-full bg-white hover:bg-white',
          filters.sort !== 'hot_and_new' && // Highlight button when not selected
            'bg-transparent border-transparent hover:border-border hover:bg-transparent'
        )}
        variant={'secondary'}
        onClick={() => setFilters({ sort: 'hot_and_new' })} // Update the sort filter to "hot_and_new"
      >
        Hot & New
      </Button>
    </div>
  );
};
