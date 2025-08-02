'use client';

import { cn } from '@/lib/utils';
import { ChevronDownIcon, ChevronRightIcon } from 'lucide-react';
import { useState } from 'react';
import { useProductFilters } from '../../hooks/use-product-filters';
import { PriceFilter } from './price-filter';
import { TagsFilter } from './tags-filter';

// ProductFilterProps - Props for the collapsible ProductFilter section
interface ProductFilterProps {
  title: string;
  className?: string;
  children: React.ReactNode;
}

const ProductFilter = ({ title, className, children }: ProductFilterProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const Icon = isOpen ? ChevronDownIcon : ChevronRightIcon;

  return (
    <div className={cn('p-4 border-b flex flex-col gap-2', className)}>
      <div
        onClick={() => setIsOpen((current) => !current)}
        className='flex items-center justify-between cursor-pointer'
      >
        <p className='font-medium'>{title}</p>
        <Icon className='size-5' />
      </div>

      {/* Render filter content only when expanded */}
      {isOpen && children}
    </div>
  );
};

export const ProductFilters = () => {
  const [filters, setFilters] = useProductFilters();

  // hasAnyFilters - Determines if any active filters are set (ignores 'sort')
  const hasAnyFilters = Object.entries(filters).some(([key, value]) => {
    if (key === "sort") return false; // Skip 'sort' when checking for active filters

    if (Array.isArray(value)) {
      return value.length > 0; // Array filter (e.g. tags) is active if not empty
    }

    if (typeof value === 'string') {
      return value !== ''; // String filter (e.g. minPrice, maxPrice) is active if not empty
    }

    return value !== null; // Fallback for other types: active if not null
  });

// onClear - Reset all filter values to empty
  const onClear = () => {
    setFilters({
      minPrice: '',
      maxPrice: '',
      tags: [],
    });
  };

// onChange - Update a single filter value by key
const onChange = (key: keyof typeof filters, value: unknown) => {
    setFilters({ ...filters, [key]: value });
  };

  return (
    <div className='border rounded-md bg-white'>
      <div className='p-4 border-b flex items-center justify-between'>
        <p className='font-medium'>Filters</p>
        {hasAnyFilters && (
          <button
            className='underline cursor-pointer'
            onClick={() => onClear()}
            type='button'
          >
            Clear
          </button>
        )}
      </div>
      <ProductFilter
        title='Price'
      >
        <PriceFilter
          minPrice={filters.minPrice}
          maxPrice={filters.maxPrice}
          onMinPriceChange={(value) => onChange('minPrice', value)}
          onMaxPriceChange={(value) => onChange('maxPrice', value)}
        />
      </ProductFilter>
      <ProductFilter
        title='Tags'
        className='border-b-0'
      >
        <TagsFilter
          value={filters.tags}
          onChange={(value) => onChange('tags', value)}
        />
      </ProductFilter>
    </div>
  );
};
