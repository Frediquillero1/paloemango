import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// cn - Utility to merge and deduplicate Tailwind class names
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs)); // Merge class values and resolve Tailwind conflicts
}

// generateTenantURL - Constructs a full URL or path to a tenant's site based on environment
export function generateTenantURL(tenantSlug: string) {
  // Check if the environment is development
  const isDevelopment = process.env.NODE_ENV === "development";
  // Check if subdomain routing is enabled
  const isSubdomainRoutingEnabled =
    process.env.NEXT_PUBLIC_ENABLE_SUBDOMAIN_ROUTING === "true";
  // If the environment is development or subdomain routing is not enabled, return a local path using the base app URL and the tenant route
  if (isDevelopment || !isSubdomainRoutingEnabled) {
    return `${process.env.NEXT_PUBLIC_APP_URL}/tenants/${tenantSlug}`;
  }

  // In production, generate a subdomain-based URL (e.g., https://tenant.example.com)
  const protocol = "https"; // Assume HTTPS in production

  const domain = process.env.NEXT_PUBLIC_ROOT_DOMAIN!; // Root domain for production (e.g., example.com)

  return `${protocol}://${tenantSlug}.${domain}`; // Construct full URL with subdomain
}

// formatCurrency - Formats a number or string as USD currency with no decimal places
export function formatCurrency(value: number | string) {
  return new Intl.NumberFormat("en-US", {
    style: "currency", // Format output as currency
    currency: "USD", // Use US Dollars
    maximumFractionDigits: 0, // Round to whole number
  }).format(Number(value)); // Convert value to number and apply formatting
}