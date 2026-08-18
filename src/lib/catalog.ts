import { queryOptions } from "@tanstack/react-query";

import {
  getProductBySlug,
  listCategories,
  listProducts,
  type Category,
  type Product,
} from "./catalog.functions";

export type { Category, Product };

export const categoriesQuery = () =>
  queryOptions({
    queryKey: ["categories"],
    queryFn: () => listCategories(),
    staleTime: 5 * 60 * 1000,
  });

export const productsQuery = () =>
  queryOptions({
    queryKey: ["products"],
    queryFn: () => listProducts(),
    staleTime: 60 * 1000,
  });

export const productQuery = (slug: string) =>
  queryOptions({
    queryKey: ["product", slug],
    queryFn: () => getProductBySlug({ data: { slug } }),
    staleTime: 60 * 1000,
  });

export function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}
