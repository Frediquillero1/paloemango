import { DEFAULT_LIMIT } from '@/constants';
import { Category, Media } from '@/payload-types';
import { baseProcedure, createTRPCRouter } from '@/trpc/init';
import { Sort, Where } from 'payload';
import { z } from 'zod';
import { sortValues } from '../search-params';

// productsRouter - Defines product-related API procedures
export const productsRouter = createTRPCRouter({
  // getMany - Fetches products filtered by a category or subcategory
  getMany: baseProcedure
    .input(
      z.object({
        cursor: z.number().default(1), // The page number or cursor for pagination, defaults to 1
        limit: z.number().default(DEFAULT_LIMIT), // The number of products to fetch, defaults to the defined DEFAULT_LIMIT
        category: z.string().nullable().optional(), // Optional category or subcategory slug
        minPrice: z.string().nullable().optional(), // Optional minimum price filter
        maxPrice: z.string().nullable().optional(), // Optional maximum price filter
        tags: z.array(z.string()).nullable().optional(), // Optional list of tag names for filtering
        sort: z.enum(sortValues).nullable().optional(), // Optional sort mode for product ordering
      })
    )
    .query(async ({ ctx, input }) => {
      // Initialize an empty 'where' filter for the product query
      const where: Where = {};
      let sort: Sort = '-createdAt'; // Default sort: newest first

      // Set sort to '-createdAt' if curated mode is selected
      if (input.sort === 'curated') {
        sort = '-createdAt';
      }

      // Set sort to '+createdAt' if hot and new mode is selected
      if (input.sort === 'hot_and_new') {
        sort = '+createdAt';
      }

      // Set sort to '-createdAt' if trending mode is selected
      if (input.sort === 'trending') {
        sort = '-createdAt';
      }

      // Initialize price filter object if any price filters are provided
      if (input.minPrice || input.maxPrice) {
        where.price = {};
      }

      // Add minimum price filter if provided
      if (input.minPrice) {
        where.price = {
          ...where.price,
          greater_than_equal: input.minPrice,
        };
      }

      // Add maximum price filter if provided
      if (input.maxPrice) {
        where.price = {
          ...where.price,
          less_than_equal: input.maxPrice,
        };
      }

      // If a category slug is provided in the input
      if (input.category) {
        // Query Payload CMS to find the category with the provided slug
        const categoriesData = await ctx.db.find({
          collection: 'categories', // Look in the categories collection
          limit: 1, // Only expect one matching category
          depth: 1, // Include subcategories up to one level deep
          pagination: false, // Return all matches (no pagination)
          where: {
            slug: {
              equals: input.category, // Match category by slug
            },
          },
        });

        // Map the returned categories and flatten the subcategories field
        const formattedData = categoriesData.docs.map((doc) => ({
          ...doc, // Spread main category fields
          subcategories: (doc.subcategories?.docs ?? []).map((doc) => ({
            ...(doc as Category), // Ensure type casting to Category
          })),
        }));

        // Initialize array to hold subcategory slugs
        const subcategoriesSlugs: string[] = [];

        // Extract the parent category from the formatted result
        const parentCategory = formattedData[0];

        // If a valid category was found
        if (parentCategory) {
          // Push all subcategory slugs into the array
          subcategoriesSlugs.push(
            ...parentCategory.subcategories.map(
              (subcategory) => subcategory.slug
            )
          );

          // Add category and subcategory slugs to the product query
          where['category.slug'] = {
            in: [parentCategory.slug, ...subcategoriesSlugs],
          };
        }
      }

      // Add tag filters if one or more tags are selected
      if (input.tags && input.tags.length > 0) {
        where['tags.name'] = {
          in: input.tags, // Match any product that has one of the selected tag names
        };
      }

      // Query the products collection using the constructed filter
      const data = await ctx.db.find({
        collection: 'products', // Query the products collection
        depth: 1, // Include relational fields (like images, category, etc.)
        where, // Apply the category filter (if any)
        sort,
        page: input.cursor, // Set the pagination cursor
        limit: input.limit, // Limit the number of results
      });

      // Return the final product list
      return {
        ...data, // Spread all pagination and meta fields (like totalDocs, limit, etc.)
        docs: data.docs.map((doc) => ({
          ...doc, // Spread product fields
          image: doc.image as Media | null, // Ensure product image is typed as Media or null
        })),
      };
    }),
});