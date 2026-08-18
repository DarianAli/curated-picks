import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Check, ChevronRight, X } from "lucide-react";

import { AffiliateButton } from "@/components/AffiliateButton";
import { AffiliateDisclaimer } from "@/components/AffiliateDisclaimer";
import { ProductCard } from "@/components/ProductCard";
import { AMAZON_DISCLOSURE, SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { productQuery, productsQuery } from "@/lib/catalog";

export const Route = createFileRoute("/products/$slug")({
  loader: async ({ context, params }) => {
    const [product] = await Promise.all([
      context.queryClient.ensureQueryData(productQuery(params.slug)),
      context.queryClient.ensureQueryData(productsQuery()),
    ]);
    if (!product) throw notFound();
    return { product };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [
          { title: "Unavailable — The Shortlist" },
          { name: "robots", content: "noindex" },
        ],
      };
    }
    const { product } = loaderData;
    const title = product.seo_title ?? `${product.title} Review — The Shortlist`;
    const description = product.seo_description ?? product.short_description;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:image", content: product.image_url },
        { name: "twitter:image", content: product.image_url },
      ],
    };
  },
  notFoundComponent: ProductNotFound,
  errorComponent: ProductError,
  component: ProductDetail,
});

function ProductNotFound() {
  return (
    <Shell>
      <h1 className="font-display text-3xl">We couldn't find that pick</h1>
      <p className="mt-3 text-muted-foreground">
        It may have been unpublished. Browse the full catalogue instead.
      </p>
      <Link to="/products" className="mt-6 inline-block text-accent hover:underline">
        View all recommendations
      </Link>
    </Shell>
  );
}

function ProductError() {
  return (
    <Shell>
      <h1 className="font-display text-3xl">This review didn't load</h1>
      <p className="mt-3 text-muted-foreground">Please refresh, or try the catalogue.</p>
      <Link to="/products" className="mt-6 inline-block text-accent hover:underline">
        View all recommendations
      </Link>
    </Shell>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto max-w-3xl px-5 py-24 text-center">{children}</main>
      <SiteFooter />
    </div>
  );
}

function ProductDetail() {
  const { slug } = Route.useParams();
  const { data: product } = useSuspenseQuery(productQuery(slug));
  const { data: all } = useSuspenseQuery(productsQuery());

  if (!product) return <ProductNotFound />;

  const related = all
    .filter(
      (item) => item.id !== product.id && item.categories?.slug === product.categories?.slug,
    )
    .slice(0, 3);

  return (
    <div className="min-h-screen">
      <SiteHeader />

      <main className="mx-auto max-w-6xl px-5 py-10">
        <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground">
          <ol className="flex flex-wrap items-center gap-1.5">
            <li>
              <Link to="/" className="hover:text-foreground">
                Home
              </Link>
            </li>
            <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
            {product.categories ? (
              <>
                <li>
                  <Link
                    to="/products"
                    search={{ category: product.categories.slug }}
                    className="hover:text-foreground"
                  >
                    {product.categories.name}
                  </Link>
                </li>
                <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
              </>
            ) : null}
            <li aria-current="page" className="text-foreground">
              {product.title}
            </li>
          </ol>
        </nav>

        <div className="mt-8 grid gap-10 md:grid-cols-2 md:gap-14">
          <div className="overflow-hidden rounded-lg border bg-card">
            <img
              src={product.image_url}
              alt={product.title}
              loading="eager"
              decoding="async"
              className="aspect-square w-full object-cover"
            />
          </div>

          <div>
            <div className="flex items-center gap-3 text-[11px] uppercase tracking-widest text-muted-foreground">
              <span>{product.categories?.name ?? "Uncategorised"}</span>
              {product.price_indicator ? (
                <>
                  <span aria-hidden="true">·</span>
                  <span>{product.price_indicator}</span>
                </>
              ) : null}
            </div>

            <h1 className="mt-4 font-display text-4xl leading-tight md:text-5xl">
              {product.title}
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
              {product.short_description}
            </p>

            <div className="mt-8">
              <AffiliateButton
                href={product.affiliate_url}
                label="Check Price on Amazon"
                size="lg"
                productTitle={product.title}
              />
              <p className="mt-3 text-xs text-muted-foreground">{AMAZON_DISCLOSURE}</p>
            </div>

            <div className="mt-10 grid gap-6 sm:grid-cols-2">
              <div className="rounded-lg border bg-card p-5">
                <h2 className="text-sm font-semibold uppercase tracking-widest text-accent">
                  What we liked
                </h2>
                <ul className="mt-4 space-y-2.5 text-sm">
                  {product.pros.map((pro) => (
                    <li key={pro} className="flex gap-2">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden="true" />
                      <span>{pro}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-lg border bg-card p-5">
                <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
                  What we didn't
                </h2>
                <ul className="mt-4 space-y-2.5 text-sm">
                  {product.cons.map((con) => (
                    <li key={con} className="flex gap-2 text-muted-foreground">
                      <X className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                      <span>{con}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        <section className="mx-auto mt-20 max-w-3xl">
          <h2 className="font-display text-3xl">The full review</h2>
          <div className="mt-6 space-y-5 text-[17px] leading-[1.75] text-foreground/90">
            {product.description.split(/\n{2,}/).map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
          <div className="mt-10">
            <AffiliateButton
              href={product.affiliate_url}
              label="View Recommendation on Amazon"
              size="lg"
              className="w-auto"
              productTitle={product.title}
            />
          </div>
        </section>

        {related.length > 0 ? (
          <section className="mt-24">
            <h2 className="font-display text-3xl">Related recommendations</h2>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((item) => (
                <ProductCard key={item.id} product={item} />
              ))}
            </div>
          </section>
        ) : null}
      </main>

      <SiteFooter />
      <AffiliateDisclaimer />
    </div>
  );
}
