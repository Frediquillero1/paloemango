import type { CollectionConfig } from "payload";

// Tenants - Collection configuration for storing tenant/store details
export const Tenants: CollectionConfig = {
  // slug - Used as the API endpoint path (e.g., /api/tenants)
  slug: "tenants",

  // admin - Admin panel configuration
  admin: {
    useAsTitle: "slug", // Display the slug field as the document title in admin UI
  },

  // fields - Defines the schema/structure of the tenants collection
  fields: [
    // name - The display name of the store (e.g., "John Doe's Store")
    {
      name: "name", // Field name
      type: "text", // Text input field
      required: true, // Must be provided
      label: "Store Name", // Custom label shown in admin UI
      admin: {
        description: "The name of the store (e.g., Fredi's Store)", // Help text
      },
    },

    // slug - Unique subdomain used to identify the tenant (e.g., [slug].paloemango.com)
    {
      name: "slug", // Field name
      type: "text", // Text input field
      index: true, // Add database index for search performance
      required: true, // Must be provided
      unique: true, // Must be unique across all tenants
      admin: {
        description: "The subdomain of the store (e.g., [slug].paloemango.com)", // Help text
      },
    },

    // image - Upload field for tenant/store branding image
    {
      name: "image", // Field name
      type: "upload", // File upload input
      relationTo: "media", // Points to the media collection
    },

    // stripeAccountId - Stripe account identifier (read-only)
    {
      name: "stripeAccountId", // Field name
      type: "text", // Text input field
      required: true, // Must be provided
      admin: {
        readOnly: true, // Cannot be modified from the admin UI
      },
    },

    // stripeDetailsSubmitted - Checkbox to indicate whether Stripe setup is complete
    {
      name: "stripeDetailsSubmitted", // Field name
      type: "checkbox", // Boolean toggle input
      admin: {
        readOnly: true, // Cannot be edited manually
        description:
          "You cannot create products until you’ve submitted your Stripe details.", // Help text
      },
    },
  ],
};