import Link from 'next/link';
import { Space_Grotesk } from 'next/font/google';
import { cn } from "@/lib/utils";

const font = Space_Grotesk({
  subsets: ['latin'],
  weight: ['700'],
});

export const Footer = () => {
  return (
    <footer className='flex border-t p-6 justify-center'>
      <div className='flex items-center gap-2'>
        <p
          className={cn(
            'text-shadow-neon text-sl tracking-tight',
            font.className
          )}
        >
          <Link href='/'>
          paloemango
          </Link> 
        </p>Inc | All Rights Reserved
      </div>
    </footer>
  );
};
 