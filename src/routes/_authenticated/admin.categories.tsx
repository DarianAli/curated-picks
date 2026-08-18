import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";

import { supabase } from "@/integrations/supabase/client";
import { adminCategoriesQuery } from "@/lib/admin-data";
import { slugify } from "@/lib/catalog";
import { categorySchema } from "@/lib/product-schema";

export const Route = createFileRoute("/_authenticated/admin/categories")({
  component: AdminCategories,
});

function AdminCategories() {
  const queryClient = useQueryClient();
  const categories = useQuery(adminCategoriesQuery());
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState<string | null>(null);

  const invalidate = async () => {
    await queryClient.invalidateQueries({ queryKey: ["admin", "categories"] });
    await queryClient.invalidateQueries({ queryKey: ["categories"] });
  };

  const create = useMutation({
    mutationFn: async () => {
      const parsed = categorySchema.safeParse({
        name,
        slug: slugify(name),
        description: description.trim() ? description.trim() : null,
      });
      if (!parsed.success) throw new Error(parsed.error.issues[0]?.message ?? "Invalid input");
      const { error: insertError } = await supabase.from("categories").insert(parsed.data);
      if (insertError) throw new Error(insertError.message);
    },
    onSuccess: async () => {
      toast.success("Category created");
      setName("");
      setDescription("");
      setError(null);
      await invalidate();
    },
    onError: (mutationError: Error) => setError(mutationError.message),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error: deleteError } = await supabase.from("categories").delete().eq("id", id);
      if (deleteError) throw new Error(deleteError.message);
    },
    onSuccess: async () => {
      toast.success("Category deleted");
      await invalidate();
    },
    onError: (mutationError: Error) => toast.error(mutationError.message),
  });

  return (
    <div>
      <h1 className="font-display text-3xl">Categories</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Deleting a category leaves its products uncategorised.
      </p>

      <form
        onSubmit={(event) => {
          event.preventDefault();
          create.mutate();
        }}
        className="mt-8 space-y-4 rounded-lg border bg-card p-6"
        noValidate
      >
        <label className="block">
          <span className="text-sm font-medium">Name</span>
          <input
            value={name}
            maxLength={80}
            onChange={(event) => setName(event.target.value)}
            className="mt-1.5 w-full rounded-md border bg-background px-3 py-2.5 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium">Description</span>
          <textarea
            value={description}
            rows={2}
            maxLength={280}
            onChange={(event) => setDescription(event.target.value)}
            className="mt-1.5 w-full rounded-md border bg-background px-3 py-2.5 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        </label>
        {error ? <p className="text-xs text-destructive">{error}</p> : null}
        <button
          type="submit"
          disabled={create.isPending}
          className="rounded-md bg-accent px-4 py-2.5 text-sm font-medium text-accent-foreground transition-colors hover:bg-accent/90 disabled:opacity-60"
        >
          {create.isPending ? "Adding…" : "Add category"}
        </button>
      </form>

      <ul className="mt-8 divide-y rounded-lg border bg-card">
        {(categories.data ?? []).map((category) => (
          <li key={category.id} className="flex items-center gap-4 px-5 py-4">
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium">{category.name}</p>
              <p className="mt-0.5 truncate text-xs text-muted-foreground">
                /{category.slug}
                {category.description ? ` · ${category.description}` : ""}
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                if (window.confirm(`Delete "${category.name}"?`)) remove.mutate(category.id);
              }}
              className="text-sm text-muted-foreground transition-colors hover:text-destructive"
            >
              Delete
            </button>
          </li>
        ))}
        {categories.data?.length === 0 ? (
          <li className="px-5 py-6 text-sm text-muted-foreground">No categories yet.</li>
        ) : null}
      </ul>
    </div>
  );
}
