import { Footer } from '@/modules/home/ui/components/footer';
import { Navbar } from '@/modules/home/ui/components/navbar';
import {
  SearchFilters,
  SearchFiltersSkeleton,
} from '@/modules/home/ui/components/search-filters';
import { getQueryClient, trpc } from '@/trpc/server';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { Suspense } from 'react';

// LayoutProps - Props accepted by the Layout component
interface LayoutProps {
  children: React.ReactNode; // Main content to be rendered within the layout
}

// Layout - Defines the page structure with Navbar, filters content area, and Footer
const Layout = async ({ children }: LayoutProps) => {
  const queryClient = getQueryClient(); // Initialize a new React Query client for managing cached queries

  // Prefetch category data on the server using React Query and tRPC before hydration
  void queryClient.prefetchQuery(trpc.categories.getMany.queryOptions());

  return (
    <div className='flex flex-col min-h-screen'>
      {/* Top navigation bar */}
      <Navbar />

      {/* Wrap the SearchFilters with HydrationBoundary to hydrate server-side fetched data for React Query */}
      <HydrationBoundary state={dehydrate(queryClient)}>
        {/* Use Suspense to display a fallback skeleton while SearchFilters is loading */}
        <Suspense fallback={<SearchFiltersSkeleton />}>
          {/* Search filter input */}
          <SearchFilters />
        </Suspense>
      </HydrationBoundary>

      {/* Main content area */}
      <div className='flex-1 bg-[#F4F4F0]'>{children}</div>

      {/* Bottom footer */}
      <Footer />
    </div>
  );
};

export default Layout;
