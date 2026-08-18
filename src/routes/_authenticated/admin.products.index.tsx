import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";

import { supabase } from "@/integrations/supabase/client";
import { adminProductsQuery } from "@/lib/admin-data";

export const Route = createFileRoute("/_authenticated/admin/products/")({
  component: AdminProducts,
});

function AdminProducts() {
  const queryClient = useQueryClient();
  const products = useQuery(adminProductsQuery());
  const [search, setSearch] = useState("");

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("products").delete().eq("id", id);
      if (error) throw new Error(error.message);
    },
    onSuccess: async () => {
      toast.success("Product deleted");
      await queryClient.invalidateQueries({ queryKey: ["admin", "products"] });
      await queryClient.invalidateQueries({ queryKey: ["products"] });
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const togglePublished = useMutation({
    mutationFn: async ({ id, value }: { id: string; value: boolean }) => {
      const { error } = await supabase
        .from("products")
        .update({ is_published: value })
        .eq("id", id);
      if (error) throw new Error(error.message);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["admin", "products"] });
      await queryClient.invalidateQueries({ queryKey: ["products"] });
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const term = search.trim().toLowerCase();
  const rows = (products.data ?? []).filter((product) =>
    term ? product.title.toLowerCase().includes(term) : true,
  );

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl">Products</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {products.data?.length ?? 0} in the catalogue.
          </p>
        </div>
        <Link
          to="/admin/products/new"
          className="rounded-md bg-accent px-4 py-2.5 text-sm font-medium text-accent-foreground transition-colors hover:bg-accent/90"
        >
          Add a product
        </Link>
      </div>

      <label className="mt-6 block">
        <span className="sr-only">Search products</span>
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search by title…"
          maxLength={120}
          className="w-full max-w-sm rounded-md border bg-background px-3 py-2.5 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
      </label>

      <div className="mt-6 overflow-hidden rounded-lg border bg-card">
        {products.isLoading ? (
          <p className="px-5 py-8 text-sm text-muted-foreground">Loading…</p>
        ) : rows.length === 0 ? (
          <p className="px-5 py-8 text-sm text-muted-foreground">No products found.</p>
        ) : (
          <ul className="divide-y">
            {rows.map((product) => (
              <li key={product.id} className="flex flex-wrap items-center gap-4 px-5 py-4">
                <img
                  src={product.image_url}
                  alt=""
                  loading="lazy"
                  className="h-12 w-12 rounded object-cover"
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{product.title}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {product.categories?.name ?? "Uncategorised"}
                    {product.is_featured ? " · Featured" : ""}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    togglePublished.mutate({ id: product.id, value: !product.is_published })
                  }
                  className="rounded-full border px-3 py-1 text-xs transition-colors hover:bg-secondary"
                >
                  {product.is_published ? "Published" : "Draft"}
                </button>
                <Link
                  to="/admin/products/$id"
                  params={{ id: product.id }}
                  className="text-sm text-accent hover:underline"
                >
                  Edit
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm(`Delete "${product.title}"? This cannot be undone.`)) {
                      remove.mutate(product.id);
                    }
                  }}
                  className="text-sm text-muted-foreground transition-colors hover:text-destructive"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
