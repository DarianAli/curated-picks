import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";

import { supabase } from "@/integrations/supabase/client";
import { adminProductsQuery } from "@/lib/admin-data";

export const Route = createFileRoute("/_authenticated/admin/products/")({
  component: AdminProducts;
});

function AdminProducts() {
  return null;
}
