import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { useMemo } from "react";
import { z } from "zod";

import { AffiliateDisclaimer } from "@/components/AffiliateDisclaimer";
import { ProductCard, ProductCardSkeleton } from "@/components/ProductCard";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { categoriesQuery, productsQuery } from "@/lib/catalog";

const TITLE = "All Recommendations — The Shortlist";
const DESCRIPTION =
  "Every product we currently recommend, filterable by category and sortable by newest or featured picks.";

const searchSchema = z.object({
  q: z.string().trim().max(80).optional(),
  category: z
    .string()
    .trim()
    .regex(/^[a-z0-9-]+$/)
    .max(80)
    .optional(),
  sort: z.enum(["newest", "featured", "title"]).optional(),
  page: z.coerce.number().int().min(1).max(200).optional(),
});

const PAGE_SIZE = 9;

export const Route = createFileRoute("/products/")({
  validateSearch: searchSchema,
  loader: async ({ context }) => {
    await Promise.all([
      context.queryClient.ensureQueryData(productsQuery()),
      context.queryClient.ensureQueryData(categoriesQuery()),
    ]);
  },
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
    ],
  }),
  pendingComponent: CatalogPending,
  component: Catalog,
});

function CatalogPending() {
  return (
    <div className="mx-auto grid max-w-6xl gap-6 px-5 py-20 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <ProductCardSkeleton key={index} />
      ))}
    </div>
  );
}

function Catalog() {
  const search = Route.useSearch();
  const navigate = useNavigate({ from: Route.fullPath });
  const { data: products } = useSuspenseQuery(productsQuery());
  const { data: categories } = useSuspenseQuery(categoriesQuery());

  const q = search.q ?? "";
  const sort = search.sort ?? "newest";
  const page = search.page ?? 1;

  const filtered = useMemo(() => {
    const needle = q.toLowerCase();
    const list = products.filter((product) => {
      const matchesTerm =
        !needle ||
        product.title.toLowerCase().includes(needle) ||
        product.short_description.toLowerCase().includes(needle);
      const matchesCategory =
        !search.category || product.categories?.slug === search.category;
      return matchesTerm && matchesCategory;
    });

    return [...list].sort((a, b) => {
      if (sort === "featured") return Number(b.is_featured) - Number(a.is_featured);
      if (sort === "title") return a.title.localeCompare(b.title);
      return b.created_at.localeCompare(a.created_at);
    });
  }, [products, q, search.category, sort]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const visible = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const update = (next: Partial<z.infer<typeof searchSchema>>) =>
    navigate({ search: (prev) => ({ ...prev, page: undefined, ...next }) });

  return (
    <div className="min-h-screen">
      <SiteHeader />

      <main className="mx-auto max-w-6xl px-5 py-16">
        <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
          The catalogue
        </p>
        <h1 className="mt-3 font-display text-4xl md:text-5xl">All recommendations</h1>
        <p className="mt-4 max-w-xl leading-relaxed text-muted-foreground">{DESCRIPTION}</p>

        <div className="mt-10 flex flex-col gap-3 border-y py-5 md:flex-row md:items-center">
          <div className="relative flex-1">
            <label htmlFor="catalog-search" className="sr-only">
              Search products
            </label>
            <Search
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden="true"
            />
            <input
              id="catalog-search"
              value={q}
              maxLength={80}
              onChange={(event) => update({ q: event.target.value || undefined })}
              placeholder="Search recommendations…"
              className="h-11 w-full rounded-md border bg-card pl-9 pr-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>

          <Select
            value={search.category ?? "all"}
            onValueChange={(value) =>
              update({ category: value === "all" ? undefined : value })
            }
          >
            <SelectTrigger className="h-11 md:w-52" aria-label="Filter by category">
              <SelectValue placeholder="All categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.slug}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={sort} onValueChange={(value) => update({ sort: value as "newest" })}>
            <SelectTrigger className="h-11 md:w-44" aria-label="Sort products">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest first</SelectItem>
              <SelectItem value="featured">Featured first</SelectItem>
              <SelectItem value="title">A–Z</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <p className="mt-5 text-sm text-muted-foreground" aria-live="polite">
          {filtered.length} {filtered.length === 1 ? "pick" : "picks"}
        </p>

        {visible.length === 0 ? (
          <div className="mt-10 rounded-lg border bg-card px-6 py-16 text-center">
            <h2 className="font-display text-2xl">No matches yet</h2>
            <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
              Nothing in the catalogue fits that search. Try a broader term or clear the
              category filter.
            </p>
            <button
              type="button"
              onClick={() => navigate({ search: {} })}
              className="mt-6 rounded-md border px-4 py-2 text-sm transition-colors hover:bg-secondary"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {visible.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                badge={product.is_featured ? "Editor's Choice" : undefined}
              />
            ))}
          </div>
        )}

        {pageCount > 1 ? (
          <nav aria-label="Pagination" className="mt-12 flex items-center justify-center gap-2">
            {Array.from({ length: pageCount }).map((_, index) => {
              const value = index + 1;
              const active = value === currentPage;
              return (
                <button
                  key={value}
                  type="button"
                  aria-current={active ? "page" : undefined}
                  onClick={() => navigate({ search: (prev) => ({ ...prev, page: value }) })}
                  className={
                    active
                      ? "h-9 w-9 rounded-md bg-primary text-sm font-medium text-primary-foreground"
                      : "h-9 w-9 rounded-md border text-sm transition-colors hover:bg-secondary"
                  }
                >
                  {value}
                </button>
              );
            })}
          </nav>
        ) : null}
      </main>

      <SiteFooter />
      <AffiliateDisclaimer />
    </div>
  );
}
