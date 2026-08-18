import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowRight, FlaskConical, Search, ShieldCheck, Timer } from "lucide-react";
import { useState } from "react";

import { AffiliateButton } from "@/components/AffiliateButton";
import { AffiliateDisclaimer } from "@/components/AffiliateDisclaimer";
import { ProductCard } from "@/components/ProductCard";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { categoriesQuery, productsQuery } from "@/lib/catalog";

const TITLE = "The Shortlist — Expertly Tested & Recommended Gear";
const DESCRIPTION =
  "Independent, long-term product testing. We buy every product, live with it for months, and publish only the picks worth your money.";

export const Route = createFileRoute("/")({
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
  component: Home,
});

const TRUST = [
  {
    icon: FlaskConical,
    title: "We buy everything",
    body: "No loaners, no review units, no strings. Every product on this site was paid for with our own money.",
  },
  {
    icon: Timer,
    title: "Months, not minutes",
    body: "A pick only publishes after weeks of daily use — long enough for the flaws to show up.",
  },
  {
    icon: ShieldCheck,
    title: "Commission-blind picks",
    body: "Recommendations are chosen before affiliate rates are checked, and cons are always published.",
  },
];

const FAQ = [
  {
    q: "How do you make money?",
    a: "Through the Amazon Associates programme. As an Amazon Associate, I earn from qualifying purchases. If you buy through a link on this site, Amazon pays a small commission at no extra cost to you.",
  },
  {
    q: "Does a commission influence your recommendations?",
    a: "No. We pick winners from the test notes before anyone looks at commission rates, and we publish the drawbacks of every product we recommend — including our top picks.",
  },
  {
    q: "How do you test?",
    a: "Each category starts with a shortlist built from spec research and reader requests. We buy the finalists, use them side by side in normal daily conditions for at least four weeks, and keep long-term notes on failures.",
  },
  {
    q: "Are prices accurate?",
    a: "We do not list prices, because they change hourly. Instead we show a rough price band and send you to Amazon to see the current price.",
  },
];

function Home() {
  const { data: products } = useSuspenseQuery(productsQuery());
  const { data: categories } = useSuspenseQuery(categoriesQuery());
  const navigate = useNavigate();
  const [term, setTerm] = useState("");

  const featured = products.find((product) => product.is_featured) ?? products[0];
  const latest = products.filter((product) => product.id !== featured?.id).slice(0, 6);

  return (
    <div className="min-h-screen">
      <SiteHeader />

      <main>
        <section className="border-b bg-card">
          <div className="mx-auto max-w-6xl px-5 py-20 md:py-28">
            <p className="text-[11px] uppercase tracking-[0.2em] text-accent">
              Independent product testing
            </p>
            <h1 className="mt-5 max-w-3xl font-display text-4xl leading-[1.1] md:text-6xl">
              Expertly tested &amp; recommended gear — nothing else.
            </h1>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground">
              {DESCRIPTION}
            </p>

            <form
              role="search"
              onSubmit={(event) => {
                event.preventDefault();
                navigate({ to: "/products", search: { q: term.trim() || undefined } });
              }}
              className="mt-9 flex max-w-md items-center gap-2"
            >
              <label htmlFor="hero-search" className="sr-only">
                Search recommendations
              </label>
              <div className="relative flex-1">
                <Search
                  className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                  aria-hidden="true"
                />
                <input
                  id="hero-search"
                  value={term}
                  maxLength={80}
                  onChange={(event) => setTerm(event.target.value)}
                  placeholder="Search chairs, skillets, headphones…"
                  className="h-11 w-full rounded-md border bg-background pl-9 pr-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
              </div>
              <button
                type="submit"
                className="h-11 rounded-md bg-primary px-5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
              >
                Search
              </button>
            </form>
          </div>
        </section>

        {featured ? (
          <section className="mx-auto max-w-6xl px-5 py-20">
            <SectionHeading kicker="Editor's Choice" title="This month's featured pick" />
            <div className="mt-8 grid items-center gap-10 rounded-lg border bg-card p-6 shadow-[var(--shadow-card)] md:grid-cols-2 md:p-10">
              <Link
                to="/products/$slug"
                params={{ slug: featured.slug }}
                className="block overflow-hidden rounded-md bg-muted"
              >
                <img
                  src={featured.image_url}
                  alt={featured.title}
                  loading="lazy"
                  decoding="async"
                  className="aspect-[4/3] w-full object-cover"
                />
              </Link>
              <div>
                <span className="rounded-sm bg-accent px-2.5 py-1 text-[11px] font-semibold uppercase tracking-widest text-accent-foreground">
                  Editor's Choice
                </span>
                <h3 className="mt-5 font-display text-3xl leading-tight">
                  <Link to="/products/$slug" params={{ slug: featured.slug }}>
                    {featured.title}
                  </Link>
                </h3>
                <p className="mt-4 leading-relaxed text-muted-foreground">
                  {featured.short_description}
                </p>
                <div className="mt-7 flex flex-wrap items-center gap-3">
                  <AffiliateButton
                    href={featured.affiliate_url}
                    label="Check Price on Amazon"
                    size="lg"
                    className="w-auto"
                    productTitle={featured.title}
                  />
                  <Link
                    to="/products/$slug"
                    params={{ slug: featured.slug }}
                    className="inline-flex items-center gap-1.5 rounded-md border px-5 py-3.5 text-base font-medium transition-colors hover:bg-secondary"
                  >
                    Read the review
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                </div>
              </div>
            </div>
          </section>
        ) : null}

        <section className="border-y bg-card">
          <div className="mx-auto max-w-6xl px-5 py-20">
            <SectionHeading kicker="Categories" title="Browse by what you need" />
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  to="/products"
                  search={{ category: category.slug }}
                  className="group rounded-lg border bg-background p-6 transition-colors hover:border-accent"
                >
                  <p className="font-display text-xl">{category.name}</p>
                  <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                    {category.description}
                  </p>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-sm text-accent">
                    View picks
                    <ArrowRight
                      className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5"
                      aria-hidden="true"
                    />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-5 py-20">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <SectionHeading kicker="Latest" title="Recently tested" />
            <Link
              to="/products"
              className="inline-flex items-center gap-1.5 text-sm text-accent hover:underline"
            >
              See all picks
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
          </div>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {latest.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>

        <section className="border-y bg-card">
          <div className="mx-auto max-w-6xl px-5 py-20">
            <SectionHeading kicker="Trust" title="Why trust our reviews" />
            <div className="mt-8 grid gap-6 md:grid-cols-3">
              {TRUST.map(({ icon: Icon, title, body }) => (
                <div key={title} className="rounded-lg border bg-background p-6">
                  <Icon className="h-5 w-5 text-accent" aria-hidden="true" />
                  <h3 className="mt-4 font-display text-xl">{title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-3xl px-5 py-20">
          <SectionHeading kicker="FAQ" title="Disclosure &amp; methodology" />
          <Accordion type="single" collapsible className="mt-8">
            {FAQ.map((item) => (
              <AccordionItem key={item.q} value={item.q}>
                <AccordionTrigger className="text-left text-base">{item.q}</AccordionTrigger>
                <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
                  {item.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>
      </main>

      <SiteFooter />
      <AffiliateDisclaimer />
    </div>
  );
}

function SectionHeading({ kicker, title }: { kicker: string; title: string }) {
  return (
    <div>
      <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">{kicker}</p>
      <h2 className="mt-3 font-display text-3xl md:text-4xl">{title}</h2>
    </div>
  );
}
