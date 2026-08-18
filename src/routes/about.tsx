import { createFileRoute } from "@tanstack/react-router";

import { AffiliateDisclaimer } from "@/components/AffiliateDisclaimer";
import { AMAZON_DISCLOSURE, SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";

const TITLE = "Our Testing Method — The Shortlist";
const DESCRIPTION =
  "How we shortlist, buy, test and re-test products, and exactly how affiliate commissions fit into the process.";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
    ],
  }),
  component: About,
});

const STEPS = [
  {
    title: "1. Shortlist",
    body: "We start from reader requests and spec research, then narrow a category down to three to six realistic finalists. Anything with a pattern of long-term failure reports is cut before we spend money.",
  },
  {
    title: "2. Buy",
    body: "We purchase every finalist at retail price. We do not accept review units, sponsorships, or manufacturer-supplied samples, because returning a product changes how you treat it.",
  },
  {
    title: "3. Live with it",
    body: "Each finalist gets at least four weeks of ordinary daily use by more than one tester. We keep dated notes, including the boring ones about cleaning, storage and noise.",
  },
  {
    title: "4. Re-test",
    body: "Winners stay in rotation after publishing. If a pick degrades — a coating flakes, a hinge loosens, firmware regresses — we update or pull the recommendation.",
  },
];

function About() {
  return (
    <div className="min-h-screen">
      <SiteHeader />

      <main className="mx-auto max-w-3xl px-5 py-16">
        <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
          Our method
        </p>
        <h1 className="mt-3 font-display text-4xl md:text-5xl">
          How a product earns a place here
        </h1>
        <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
          Most product recommendations online are rewritten spec sheets. Ours are notes from
          living with things. That is slower and more expensive, and it is the entire point.
        </p>

        <div className="mt-14 space-y-10">
          {STEPS.map((step) => (
            <section key={step.title} className="border-t pt-8">
              <h2 className="font-display text-2xl">{step.title}</h2>
              <p className="mt-3 leading-relaxed text-muted-foreground">{step.body}</p>
            </section>
          ))}
        </div>

        <section className="mt-14 rounded-lg border bg-card p-6">
          <h2 className="font-display text-2xl">How we make money</h2>
          <p className="mt-3 leading-relaxed text-muted-foreground">
            {AMAZON_DISCLOSURE} Links to Amazon on this site are affiliate links, which means we
            receive a small commission if you buy — at no additional cost to you. Winners are
            chosen from test notes before commission rates are ever looked at, and every
            recommendation lists its drawbacks.
          </p>
        </section>
      </main>

      <SiteFooter />
      <AffiliateDisclaimer />
    </div>
  );
}
