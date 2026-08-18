import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";

import { adminCategoriesQuery, adminProductsQuery } from "@/lib/admin-data";

export const Route = createFileRoute("/_authenticated/admin/")({
  component: AdminOverview,
});

function AdminOverview() {
  const products = useQuery(adminProductsQuery());
  const categories = useQuery(adminCategoriesQuery());

  const stats = [
    { label: "Total products", value: products.data?.length ?? 0 },
    {
      label: "Published",
      value: products.data?.filter((product) => product.is_published).length ?? 0,
    },
    {
      label: "Featured",
      value: products.data?.filter((product) => product.is_featured).length ?? 0,
    },
    { label: "Categories", value: categories.data?.length ?? 0 },
  ];

  return (
    <div>
      <h1 className="font-display text-3xl">Overview</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        A quick snapshot of the catalogue.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-lg border bg-card p-5">
            <p className="text-[11px] uppercase tracking-widest text-muted-foreground">
              {stat.label}
            </p>
            <p className="mt-3 font-display text-3xl">
              {products.isLoading || categories.isLoading ? "—" : stat.value}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-10 flex flex-wrap gap-3">
        <Link
          to="/admin/products/new"
          className="rounded-md bg-accent px-4 py-2.5 text-sm font-medium text-accent-foreground transition-colors hover:bg-accent/90"
        >
          Add a product
        </Link>
        <Link
          to="/admin/products"
          className="rounded-md border px-4 py-2.5 text-sm transition-colors hover:bg-secondary"
        >
          Manage products
        </Link>
        <Link
          to="/admin/categories"
          className="rounded-md border px-4 py-2.5 text-sm transition-colors hover:bg-secondary"
        >
          Manage categories
        </Link>
      </div>

      <section className="mt-12">
        <h2 className="font-display text-xl">Recently added</h2>
        <ul className="mt-4 divide-y rounded-lg border bg-card">
          {(products.data ?? []).slice(0, 5).map((product) => (
            <li key={product.id} className="flex items-center gap-4 px-5 py-3">
              <img
                src={product.image_url}
                alt=""
                loading="lazy"
                className="h-10 w-10 rounded object-cover"
              />
              <span className="min-w-0 flex-1 truncate text-sm">{product.title}</span>
              <Link
                to="/admin/products/$id"
                params={{ id: product.id }}
                className="text-sm text-accent hover:underline"
              >
                Edit
              </Link>
            </li>
          ))}
          {products.data?.length === 0 ? (
            <li className="px-5 py-6 text-sm text-muted-foreground">No products yet.</li>
          ) : null}
        </ul>
      </section>
    </div>
  );
}
