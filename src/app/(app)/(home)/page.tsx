import { DEFAULT_LIMIT } from '@/constants';
import { loadProductFilters } from '@/modules/products/search-params';
import { ProductListView } from '@/modules/products/ui/views/product-list-view';
import { getQueryClient, trpc } from '@/trpc/server';
import { HydrationBoundary, dehydrate } from '@tanstack/react-query';
import { SearchParams } from 'nuqs/server';

// HomeProps - Defines the route and query parameters passed to the home page
interface HomeProps {
  searchParams: Promise<SearchParams>; // URL query parameters (minPrice, maxPrice, etc.)
}

// Home - Server component for rendering the product listing page with query-based filtering
export default async function Home({ searchParams }: HomeProps) {
  const filters = await loadProductFilters(searchParams); // Parse filters from search params

  const queryClient = getQueryClient(); // Initialize a new query client

  // Prefetch products using infinite query based on category and filters
  void queryClient.prefetchInfiniteQuery(
    trpc.products.getMany.infiniteQueryOptions({
      ...filters, // Spread query filters (price range, etc.)
      limit: DEFAULT_LIMIT, // Define how many items to fetch per page
    })
  );

  return (
    // Wraps server-side data for hydration on client
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ProductListView />
    </HydrationBoundary>
  );
}
