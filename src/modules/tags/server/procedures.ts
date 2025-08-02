import { DEFAULT_LIMIT } from "@/constants";
import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import z from "zod";

// tagsRouter - Defines tag-related API procedures
export const tagsRouter = createTRPCRouter({
  getMany: baseProcedure
    .input(
      z.object({
        cursor: z.number().default(1), // Page number to fetch
        limit: z.number().default(DEFAULT_LIMIT), // Number of results per page
      }),
    )
    .query(async ({ ctx, input }) => {
      // Query the tags collection with pagination
      const data = await ctx.db.find({
        collection: "tags", // Query the tags collection
        page: input.cursor, // Page number
        limit: input.limit, // Items per page
    });

      // Return the resulting tag list
      return data;
    }),
});