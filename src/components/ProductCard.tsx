import { Link } from "@tanstack/react-router";
import { Check, Minus } from "lucide-react";

import { AffiliateButton } from "@/components/AffiliateButton";
import type { Product } from "@/lib/catalog";
import { cn } from "@/lib/utils";

type Props = {
  product: Product;
  badge?: string;
  className?: string;
};

export function ProductCard({ product, badge, className }: Props) {
  return (
    <article
      className={cn(
        "group flex flex-col overflow-hidden rounded-lg border bg-card shadow-[var(--shadow-card)] transition-shadow hover:shadow-[var(--shadow-lift)]",
        className,
      )}
    >
      <Link
        to="/products/$slug"
        params={{ slug: product.slug }}
        className="relative block aspect-[4/3] overflow-hidden bg-muted"
      >
        <img
          src={product.image_url}
          alt={product.title}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        />
        {badge ? (
          <span className="absolute left-3 top-3 rounded-sm bg-accent px-2.5 py-1 text-[11px] font-semibold uppercase tracking-widest text-accent-foreground">
            {badge}
          </span>
        ) : null}
      </Link>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-center justify-between gap-3 text-[11px] uppercase tracking-widest text-muted-foreground">
          <span>{product.categories?.name ?? "Uncategorised"}</span>
          {product.price_indicator ? <span>{product.price_indicator}</span> : null}
        </div>

        <h3 className="font-display text-xl leading-snug">
          <Link
            to="/products/$slug"
            params={{ slug: product.slug }}
            className="hover:text-accent"
          >
            {product.title}
          </Link>
        </h3>

        <p className="text-sm leading-relaxed text-muted-foreground">
          {product.short_description}
        </p>

        {(product.pros.length > 0 || product.cons.length > 0) && (
          <ul className="mt-1 space-y-1.5 text-sm">
            {product.pros.slice(0, 2).map((pro) => (
              <li key={pro} className="flex gap-2">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden="true" />
                <span>{pro}</span>
              </li>
            ))}
            {product.cons.slice(0, 1).map((con) => (
              <li key={con} className="flex gap-2 text-muted-foreground">
                <Minus className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                <span>{con}</span>
              </li>
            ))}
          </ul>
        )}

        <div className="mt-auto pt-4">
          <AffiliateButton href={product.affiliate_url} productTitle={product.title} />
        </div>
      </div>
    </article>
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-lg border bg-card">
      <div className="aspect-[4/3] animate-pulse bg-muted" />
      <div className="space-y-3 p-5">
        <div className="h-3 w-24 animate-pulse rounded bg-muted" />
        <div className="h-5 w-3/4 animate-pulse rounded bg-muted" />
        <div className="h-4 w-full animate-pulse rounded bg-muted" />
        <div className="h-4 w-5/6 animate-pulse rounded bg-muted" />
        <div className="h-10 w-full animate-pulse rounded bg-muted" />
      </div>
    </div>
  );
}
