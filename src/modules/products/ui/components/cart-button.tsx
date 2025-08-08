import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useCart } from '@/modules/checkout/hooks/use-cart';
import Link from 'next/link';

// CartButtonProps - Props for rendering the cart toggle button
interface CartButtonProps {
  tenantSlug: string; // Tenant identifier used to scope cart actions
  productId: string; // ID of the product to add or remove from the cart
  isPurchased?: boolean; // Whether the current user has already purchased the product
}

// CartButton - Renders a button that toggles the product in the cart
export const CartButton = ({
  tenantSlug,
  productId,
  isPurchased,
}: CartButtonProps) => {
  const cart = useCart(tenantSlug); // Access cart utilities scoped to the tenant

  // If the user has already purchased the product, render a "View in Library" button instead
  if (isPurchased) {
    return (
      <Button
        variant={'elevated'} // Styled as an elevated button
        asChild // Render the child as the actual button element
        className='flex-1 font-medium bg-white' // Full width, white background
      >
        {/* Navigate to the library page for this product */}
        <Link href={`${process.env.NEXT_PUBLIC_APP_URL}/library/${productId}`}>
          View in Library
        </Link>
      </Button>
    );
  }
  return (
    <Button
      variant={'elevated'} // Styled as an elevated button
      className={cn(
        'flex-1 bg-pink-400',
        cart.isProductInCart(productId) && 'bg-white'
      )} // Full width with pink background
      onClick={() => cart.toggleProduct(productId)} // Toggle product in cart (add if not present, remove if already in cart)
    >
      {/* Toggle label */}
      {cart.isProductInCart(productId) ? 'Remove from cart' : 'Add to cart'}
    </Button>
  );
};
