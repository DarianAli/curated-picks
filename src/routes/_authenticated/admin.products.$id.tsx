import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";

import { ProductForm } from "@/components/admin/ProductForm";
import { supabase } from "@/integrations/supabase/client";
import { adminCategoriesQuery, adminProductQuery } from "@/lib/admin-data";
import type { ProductFormValues } from "@/lib/product-schema";

export const Route = createFileRoute("/_authenticated/admin/products/$id")({
  component: EditProduct,
});

function EditProduct() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const categories = useQuery(adminCategoriesQuery());
  const product = useQuery(adminProductQuery(id));

  const update = useMutation({
    mutationFn: async (values: ProductFormValues) => {
      const { error } = await supabase.from("products").update(values).eq("id", id);
      if (error) throw new Error(error.message);
    },
    onSuccess: async () => {
      toast.success("Changes saved");
      await queryClient.invalidateQueries({ queryKey: ["admin"] });
      await queryClient.invalidateQueries({ queryKey: ["products"] });
      navigate({ to: "/admin/products" });
    },
    onError: (error: Error) => toast.error(error.message),
  });

  if (product.isLoading) {
    return <p className="text-sm text-muted-foreground">Loading…</p>;
  }

  if (!product.data) {
    return <p className="text-sm text-muted-foreground">That product no longer exists.</p>;
  }

  return (
    <div>
      <h1 className="font-display text-3xl">Edit product</h1>
      <p className="mt-2 text-sm text-muted-foreground">{product.data.title}</p>
      <div className="mt-8">
        <ProductForm
          categories={categories.data ?? []}
          product={product.data}
          pending={update.isPending}
          onSubmit={(values) => update.mutate(values)}
        />
      </div>
    </div>
  );
}
