import { DEFAULT_LIMIT } from '@/constants';
import { loadProductFilters } from '@/modules/products/search-params';
import { ProductListSkeleton } from '@/modules/products/ui/components/product-list';
import { ProductListView } from '@/modules/products/ui/views/product-list-view';
import { getQueryClient, trpc } from '@/trpc/server';
import { HydrationBoundary, dehydrate } from '@tanstack/react-query';
import { SearchParams } from 'nuqs/server';
import { Suspense } from 'react';

// PageProps - Defines the shape of the route parameters passed to this page
interface Props {
  params: Promise<{
    subcategory: string; // Subcategory from the route
  }>;
  searchParams: Promise<SearchParams>; // URL query params (minPrice, maxPrice, etc.)
}

// Force dynamic rendering for this page
export const dynamic = 'force-dynamic';

// Page - Displays content based on the selected subcategory
const Page = async ({ params, searchParams }: Props) => {
  const { subcategory } = await params; // Await the resolved params
  const filters = await loadProductFilters(searchParams); // Parse filters from search params

  const queryClient = getQueryClient(); // Create a query client instance

  // Prefetch paginated product data using subcategory and filters
  void queryClient.prefetchInfiniteQuery(
    trpc.products.getMany.infiniteQueryOptions({
      ...filters, // Spread filter parameters (minPrice, maxPrice, etc.)
      category: subcategory, // Treat subcategory as the category filter
      limit: DEFAULT_LIMIT, // Use default pagination limit
    })
  );

  return (
    // Wrap server-side data in HydrationBoundary for client hydration
    <HydrationBoundary state={dehydrate(queryClient)}>
      {/* Show skeleton fallback while loading data */}
      <Suspense fallback={<ProductListSkeleton />}>
        <ProductListView category={subcategory} />
      </Suspense>
    </HydrationBoundary>
  );
};

export default Page;
