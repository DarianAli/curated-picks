import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";

export type Category = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
};

export type Product = {
  id: string;
  title: string;
  slug: string;
  short_description: string;
  description: string;
  image_url: string;
  affiliate_url: string;
  category_id: string | null;
  pros: string[];
  cons: string[];
  price_indicator: string | null;
  is_featured: boolean;
  is_published: boolean;
  seo_title: string | null;
  seo_description: string | null;
  created_at: string;
  categories?: Pick<Category, "id" | "name" | "slug"> | null;
};

const PRODUCT_COLUMNS =
  "id,title,slug,short_description,description,image_url,affiliate_url,category_id,pros,cons,price_indicator,is_featured,is_published,seo_title,seo_description,created_at,categories(id,name,slug)";

function publicClient() {
  return createClient(
    process.env["SUPABASE_URL"]!,
    process.env["SUPABASE_PUBLISHABLE_KEY"]!,
    { auth: { persistSession: false, autoRefreshToken: false } },
  );
}

export const listCategories = createServerFn({ method: "GET" }).handler(
  async (): Promise<Category[]> => {
    const { data, error } = await publicClient()
      .from("categories")
      .select("id,name,slug,description")
      .order("name", { ascending: true });
    if (error) throw new Error(error.message);
    return (data ?? []) as Category[];
  },
);

export const listProducts = createServerFn({ method: "GET" }).handler(
  async (): Promise<Product[]> => {
    const { data, error } = await publicClient()
      .from("products")
      .select(PRODUCT_COLUMNS)
      .eq("is_published", true)
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return (data ?? []) as unknown as Product[];
  },
);

export const getProductBySlug = createServerFn({ method: "GET" })
  .inputValidator((data: unknown) => z.object({ slug: z.string().min(1) }).parse(data))
  .handler(async ({ data }): Promise<Product | null> => {
    const { data: row, error } = await publicClient()
      .from("products")
      .select(PRODUCT_COLUMNS)
      .eq("slug", data.slug)
      .eq("is_published", true)
      .maybeSingle();
    if (error) throw new Error(error.message);
    return (row as unknown as Product) ?? null;
  });
