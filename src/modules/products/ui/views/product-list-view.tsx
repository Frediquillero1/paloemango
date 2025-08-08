import { Suspense } from 'react';
import { ProductFilters } from '../components/product-filters';
import { ProductList, ProductListSkeleton } from '../components/product-list';
import { ProductSort } from '../components/product-sort';

// ProductListViewProps - Props for the product list view container
interface ProductListViewProps {
  category?: string; // Optional product category or subcategory to filter by
}

// ProductListView - Layout for rendering filters, sort controls, and a product grid
export const ProductListView = ({ category }: ProductListViewProps) => {
  return (
    <div className='px-4 lg:px-12 py-8 flex flex-col gap-4'>
      {/* Header row with title and sorting options */}
      <div className='flex flex-col lg:flex-row lg:items-center gap-y-2 lg:gap-y-0 justify-between'>
        <p className='text-2xl font-medium'>Curated for you</p>
        {/* Dropdown for changing sort order */}
        <ProductSort />
      </div>

      {/* Grid layout for filters sidebar and product list */}
      <div className='grid grid-cols-1 lg:grid-cols-6 xl:grid-cols-8 gap-y-6 gap-x-12'>
        {/* Filters sidebar (takes 2 columns on large screens) */}
        <div className='lg:col-span-2 xl:col-span-2'>
          <ProductFilters />
        </div>

        {/* Product list (spans remaining columns on large screens) */}
        <div className='lg:col-span-4 xl:col-span-6'>
          {/* Defer loading of product list using Suspense */}
          <Suspense fallback={<ProductListSkeleton />}>
            {/* Display filtered products */}
            <ProductList category={category} />
          </Suspense>
        </div>
      </div>
    </div>
  );
};
