import { DEFAULT_LIMIT } from '@/constants';
import { loadProductFilters } from '@/modules/products/search-params';
import { ProductListView } from '@/modules/products/ui/views/product-list-view';
import { getQueryClient, trpc } from '@/trpc/server';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import type { SearchParams } from 'nuqs/server';

// Force dynamic rendering for this page
export const dynamic = 'force-dynamic';

// PageProps - Defines the route and query parameters passed to the category page
interface Props {
  params: Promise<{ category: string }>; // Dynamic segment from the route (category slug)
  searchParams: Promise<SearchParams>; // URL query params (minPrice, maxPrice, etc.)
}

// Page - Displays product list for a selected category
const Page = async ({ params, searchParams }: Props) => {
  const { category } = await params; // Extract category from dynamic route parameters
  const filters = await loadProductFilters(searchParams); // Parse filters from search params

  const queryClient = getQueryClient(); // Initialize a new query client
  // Prefetch products using infinite query based on category and filters
  void queryClient.prefetchInfiniteQuery(trpc.products.getMany.infiniteQueryOptions({
      ...filters, // Spread query filters (price range, etc.)
      category, // Category slug used to filter products
      limit: DEFAULT_LIMIT, // Define how many items to fetch per page
    }));

  return (
    // Wraps server-side data for hydration on client
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ProductListView category={category} />
    </HydrationBoundary>
  );
};

export default Page;