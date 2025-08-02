import { AppRouter } from "@/trpc/routers/_app";
import { inferRouterOutputs } from "@trpc/server";

// ProductsGetManyOutput - Inferred output type of the products.getMany procedure
export type ProductsGetManyOutput =
  inferRouterOutputs<AppRouter>["products"]["getMany"];