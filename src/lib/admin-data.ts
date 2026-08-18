import { queryOptions } from "@tanstack/react-query";

import { supabase } from "@/integrations/supabase/client";
import type { Category, Product } from "@/lib/catalog";

const PRODUCT_COLUMNS =
  "id,title,slug,short_description,description,image_url,affiliate_url,category_id,pros,cons,price_indicator,is_featured,is_published,seo_title,seo_description,created_at,categories(id,name,slug)";

export const adminProductsQuery = () =>
  queryOptions({
    queryKey: ["admin", "products"],
    queryFn: async (): Promise<Product[]> => {
      const { data, error } = await supabase
        .from("products")
        .select(PRODUCT_COLUMNS)
        .order("created_at", { ascending: false });
      if (error) throw new Error(error.message);
      return (data ?? []) as unknown as Product[];
    },
  });

export const adminCategoriesQuery = () =>
  queryOptions({
    queryKey: ["admin", "categories"],
    queryFn: async (): Promise<Category[]> => {
      const { data, error } = await supabase
        .from("categories")
        .select("id,name,slug,description")
        .order("name");
      if (error) throw new Error(error.message);
      return (data ?? []) as Category[];
    },
  });

export const adminProductQuery = (id: string) =>
  queryOptions({
    queryKey: ["admin", "product", id],
    queryFn: async (): Promise<Product | null> => {
      const { data, error } = await supabase
        .from("products")
        .select(PRODUCT_COLUMNS)
        .eq("id", id)
        .maybeSingle();
      if (error) throw new Error(error.message);
      return (data as unknown as Product) ?? null;
    },
  });
