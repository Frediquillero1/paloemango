import { tenantsArrayField } from "@payloadcms/plugin-multi-tenant/fields";
import type { CollectionConfig } from "payload";

// Create default tenant array field configuration
const defaultTenantArrayField = tenantsArrayField({
  tenantsArrayFieldName: "tenants", // Name of the array field storing tenant data
  tenantsCollectionSlug: "tenants", // Slug of the tenants collection
  tenantsArrayTenantFieldName: "tenant", // Field name used within each array item to reference a tenant

  // NOTE: All access rules are set to true for testing purposes
  arrayFieldAccess: {
    read: () => true, // Allow reading tenant array
    create: () => true, // Allow creating tenant array items
    update: () => true, // Allow updating tenant array items
  },
  tenantFieldAccess: {
    read: () => true, // Allow reading individual tenant field
    create: () => true, // Allow creating tenant field
    update: () => true, // Allow updating tenant field
  },
});

// Users - Collection configuration for managing application users
export const Users: CollectionConfig = {
  // slug - Used as the API endpoint path (e.g., /api/users)
  slug: "users",

  // admin - Admin panel configuration
  admin: {
    useAsTitle: "email", // Display the email field as the document title in admin UI
  },

  auth: true, // Enables authentication for this collection

  // fields - Defines the schema/structure of the users collection
  fields: [
    // Email added by default
    // Add more fields as needed

    // username - Unique username for the user account
    {
      name: "username", // Field name
      type: "text", // Text input field
      required: true, // Must be provided
      unique: true, // Must be unique across all users
    },

    // roles - User roles used for permissions and access control
    {
      name: "roles", // Field name
      type: "select", // Select field with multiple role options
      hasMany: true, // Allows selecting multiple roles
      defaultValue: ["user"], // Default role assigned to new users
      options: ["super-admin", "user"], // Available role options
      admin: {
        position: "sidebar", // Display in the admin sidebar
      },
    },

    // tenants - Multi-tenant field linking user to specific tenants
    {
      ...defaultTenantArrayField, // Spread default tenant array field config from plugin
      admin: {
        ...(defaultTenantArrayField.admin || {}),
        position: "sidebar", // Display in the sidebar for quick access in the admin panel
      },
    },
  ],
};