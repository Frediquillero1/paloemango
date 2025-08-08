import { useCallback } from "react";
import { useShallow } from "zustand/react/shallow";
import { useCartStore } from "../store/use-cart-store";

// useCart - Hook for managing cart state scoped to a specific tenant
export const useCart = (tenantSlug: string) => {
  // Extract addProduct action from Zustand store
  const addProduct = useCartStore((state) => state.addProduct);

  // Extract removeProduct action from Zustand store
  const removeProduct = useCartStore((state) => state.removeProduct);

  // Extract clearCart action from Zustand store
  const clearCart = useCartStore((state) => state.clearCart);

  // Extract clearAllCarts action from Zustand store (affects all tenants)
  const clearAllCarts = useCartStore((state) => state.clearAllCarts);

  // Extract product IDs for the given tenant using shallow comparison to prevent unnecessary re-renders
  const productIds = useCartStore(
    useShallow((state) => state.tenantCarts[tenantSlug]?.productIds || [])
  );

  // toggleProduct - Add or remove a product from the cart depending on its presence
  const toggleProduct = useCallback(
    (productId: string) => {
      if (productIds.includes(productId)) {
        removeProduct(tenantSlug, productId); // If product already exists in cart, remove it
      } else {
        addProduct(tenantSlug, productId); // Otherwise, add the product to the cart
      }
    },
    [addProduct, removeProduct, productIds, tenantSlug] // Dependencies to ensure proper memoization
  );

  // isProductInCart - Returns true if the product is already in the tenant's cart
  const isProductInCart = useCallback(
    (productId: string) => productIds.includes(productId), // Check if product ID is present in the array
    [productIds] // Depend on productIds to track changes
  );

  // clearTenantCard - Clears all products from the current tenant’s cart
  const clearTenantCard = useCallback(() => {
    clearCart(tenantSlug); // Call clearCart scoped to current tenant
  }, [clearCart, tenantSlug]); // Dependencies include the action and tenant identifier

  // handleAddProduct - Adds a product to the current tenant’s cart
  const handleAddProduct = useCallback(
    (productId: string) => {
      addProduct(tenantSlug, productId); // Invoke addProduct scoped to current tenant
    },
    [addProduct, tenantSlug] // Dependencies include the action and tenant identifier
  );

  // handleRemoveProduct - Removes a product from the current tenant’s cart
  const handleRemoveProduct = useCallback(
    (productId: string) => {
      removeProduct(tenantSlug, productId); // Invoke removeProduct scoped to current tenant
    },
    [removeProduct, tenantSlug] // Dependencies include the action and tenant identifier
  );

  // Return all cart-related utilities and state for the specified tenant
  return {
    productIds, // Current list of product IDs in the tenant’s cart
    addProduct: handleAddProduct, // Scoped add function for the tenant
    removeProduct: handleRemoveProduct, // Scoped remove function for the tenant
    clearCart: clearTenantCard, // Scoped clear function for the tenant
    clearAllCarts, // Global clear function affecting all tenants
    toggleProduct, // Utility to toggle product presence in the cart
    isProductInCart, // Utility to check if a product exists in the cart
    totalItems: productIds.length, // Total number of items in the tenant’s cart
  };
};