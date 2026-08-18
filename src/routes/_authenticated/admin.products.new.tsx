import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";

import { ProductForm } from "@/components/admin/ProductForm";
import { supabase } from "@/integrations/supabase/client";
import { adminCategoriesQuery } from "@/lib/admin-data";
import type { ProductFormValues } from "@/lib/product-schema";

export const Route = createFileRoute("/_authenticated/admin/products/new")({
  component: NewProduct,
});

function NewProduct() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const categories = useQuery(adminCategoriesQuery());

  const create = useMutation({
    mutationFn: async (values: ProductFormValues) => {
      const { error } = await supabase.from("products").insert(values);
      if (error) throw new Error(error.message);
    },
    onSuccess: async () => {
      toast.success("Product created");
      await queryClient.invalidateQueries({ queryKey: ["admin", "products"] });
      await queryClient.invalidateQueries({ queryKey: ["products"] });
      navigate({ to: "/admin/products" });
    },
    onError: (error: Error) => toast.error(error.message),
  });

  return (
    <div>
      <h1 className="font-display text-3xl">Add a product</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Drafts stay hidden from readers until you publish them.
      </p>
      <div className="mt-8">
        <ProductForm
          categories={categories.data ?? []}
          pending={create.isPending}
          onSubmit={(values) => create.mutate(values)}
        />
      </div>
    </div>
  );
}
