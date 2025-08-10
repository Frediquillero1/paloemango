import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import { headers as getHeaders } from "next/headers";
import { loginSchema, registerSchema } from "../schemas";
import { generateAuthCookie } from "../utils";

// authRouter - Defines auth-related API procedures
export const authRouter = createTRPCRouter({
  // session - Returns the current session from Payload CMS based on request headers
  session: baseProcedure.query(async ({ ctx }) => {
    const headers = await getHeaders(); // Get headers from the request

    const session = await ctx.db.auth({ headers }); // Payload CMS auth using headers

    return session; // Returns user and permissions from Payload
  }),

  // register - Creates a new user in the Payload CMS "users" collection
  register: baseProcedure
    .input(registerSchema) // Validate the input using the register schema
    .mutation(async ({ input, ctx }) => {
      // Check if a user with the same username already exists
      const existingData = await ctx.db.find({
        collection: "users",
        limit: 1,
        where: {
          username: {
            equals: input.username,
          },
        },
      });

      // Extract the first matching user from the result set (if any)
      const existingUser = existingData.docs[0];

      // If the username is already taken, throw an error
      if (existingUser) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Username already taken",
        });
      }

      // Create a new tenant for the user
      const tenant = await ctx.db.create({
        collection: "tenants",
        data: {
          name: input.username, // Use username for tenant name
          slug: input.username, // Use username for slug to match subdomain
          stripeAccountId: "test", // Stub value for Stripe ID (adjust in production)
        },
      });

      // Create a new user record in the Payload CMS database
      await ctx.db.create({
        collection: "users",
        data: {
          email: input.email,
          username: input.username,
          password: input.password,
          tenants: [
            {
              tenant: tenant.id, // Link the created tenant to the user
            },
          ],
        },
      });

      // Attempt to log in using Payload's login method
      const data = await ctx.db.login({
        collection: "users", // The collection from which the user is being authenticated
        data: {
          email: input.email, // User's email address for authentication
          password: input.password, // User's password for authentication
        },
      });

      // If login failed or no token is returned, throw an error
      if (!data.token) {
        throw new TRPCError({
          code: "UNAUTHORIZED", // Error code indicating authentication failure
          message: "Failed to login", // Error message indicating login failure
        });
      }

      // Generate and store the auth cookie in the user's browser
      await generateAuthCookie({
        prefix: ctx.db.config.cookiePrefix, // Prefix helps identify the token source
        value: data.token, // The JWT or session token returned from the login response
      });

      return data; // Return session data with user info and the authentication token
    }),

  // login - Authenticates a user and sets an auth cookie using Payload CMS
  login: baseProcedure
    .input(loginSchema) // Validate the input using the login schema
    .mutation(async ({ input, ctx }) => {
      // Attempt to log in using Payload's login method
      const data = await ctx.db.login({
        collection: "users",
        data: {
          email: input.email,
          password: input.password,
        },
      });

      // If login failed or no token is returned, throw an error
      if (!data.token) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Failed to login",
        });
      }

      // Generate and store the auth cookie in the user's browser
      await generateAuthCookie({
        prefix: ctx.db.config.cookiePrefix, // Prefix helps identify the token source
        value: data.token, // The JWT or session token returned from the login response
      });

      return data; // Return session data with user info and token
    }),
});