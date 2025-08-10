import { Toaster } from '@/components/ui/sonner';
import { TRPCReactProvider } from '@/trpc/client';
import type { Metadata } from 'next';
import { DM_Sans } from 'next/font/google';
import { NuqsAdapter } from 'nuqs/adapters/next/app';
import './globals.css';

const dmSans = DM_Sans({
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Paloemango Your Marketplace, Your Rules.',
  description: 'Launch and manage unlimited stores in one powerful system. Customize each shop, streamline operations, and grow your business without limits.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode; // Content passed from each route
}>) {
  return (
    <html lang='en'>
      <body suppressHydrationWarning className={`${dmSans.className} antialiased`}>
        {/* Enables URL state syncing for filters and other query params */}
        <NuqsAdapter>
          {/* Wrap all content in tRPC provider for API access */}
          <TRPCReactProvider>
            {children}
            {/* Global toast notifications */}
            <Toaster />
          </TRPCReactProvider>
        </NuqsAdapter>
      </body>
    </html>
  );
}
