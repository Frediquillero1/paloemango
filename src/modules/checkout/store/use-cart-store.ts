import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

// TenantCart - Represents a single tenant’s cart with a list of product IDs
interface TenantCart {
  productIds: string[]; // Array of product IDs added to the tenant's cart
}

// CartState - Defines the state structure and all available cart actions
interface CartState {
  tenantCarts: Record<string, TenantCart>; // A map of tenant slugs to their respective carts

  // Action to add a product to a tenant's cart
  addProduct: (tenantSlug: string, productId: string) => void;

  // Action to remove a product from a tenant's cart
  removeProduct: (tenantSlug: string, productId: string) => void;

  // Action to clear all products from a specific tenant's cart
  clearCart: (tenantSlug: string) => void;

  // Action to remove all carts across all tenants
  clearAllCarts: () => void;
}

// useCartStore - Zustand store for managing multi-tenant shopping carts
export const useCartStore = create<CartState>()(
  persist(
    // Apply persistence middleware to store data in localStorage
    (set) => ({
      tenantCarts: {}, // Initial state: no tenant carts exist yet

      // addProduct - Adds a product to a specific tenant's cart
      addProduct: (tenantSlug, productId) =>
        set((state) => ({
          tenantCarts: {
            ...state.tenantCarts, // Preserve other tenant carts
            [tenantSlug]: {
              productIds: [
                ...(state.tenantCarts[tenantSlug]?.productIds || []), // Get existing products or initialize
                productId, // Add the new product ID
              ],
            },
          },
        })),

      // removeProduct - Removes a product from a tenant’s cart by filtering it out
      removeProduct: (tenantSlug, productId) =>
        set((state) => ({
          tenantCarts: {
            ...state.tenantCarts, // Preserve other tenant carts
            [tenantSlug]: {
              productIds:
                state.tenantCarts[tenantSlug]?.productIds.filter(
                  (id) => id !== productId // Remove the matching product
                ) || [], // If no cart exists yet, return empty array
            },
          },
        })),

      // clearCart - Empties all products from a specific tenant’s cart
      clearCart: (tenantSlug) =>
        set((state) => ({
          tenantCarts: {
            ...state.tenantCarts, // Preserve other tenant carts
            [tenantSlug]: {
              productIds: [], // Empty the cart
            },
          },
        })),

      // clearAllCarts - Wipes all tenant carts from the store
      clearAllCarts: () => set({ tenantCarts: {} }),
    }),
    {
      name: "paloemango-cart", // Key used in localStorage to persist this store
      storage: createJSONStorage(() => localStorage), // Store data in browser’s localStorage
    }
  )
);