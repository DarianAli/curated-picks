import { createFileRoute } from "@tanstack/react-router";

import { AMAZON_DISCLOSURE, SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";

const TITLE = "Privacy Policy — The Shortlist";
const DESCRIPTION =
  "What data this site collects, how affiliate links work, and how to contact us about your information.";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
    ],
  }),
  component: Privacy,
});

function Privacy() {
  return (
    <div className="min-h-screen">
      <SiteHeader />

      <main className="mx-auto max-w-3xl px-5 py-16">
        <h1 className="font-display text-4xl">Privacy policy</h1>
        <div className="mt-8 space-y-8 leading-relaxed text-muted-foreground">
          <section>
            <h2 className="font-display text-2xl text-foreground">Affiliate links</h2>
            <p className="mt-3">
              {AMAZON_DISCLOSURE} When you click an outbound product link, Amazon may set cookies
              to attribute the visit. Those cookies are governed by Amazon's own privacy notice,
              not ours. All outbound links open in a new tab and carry{" "}
              <code className="rounded bg-secondary px-1.5 py-0.5 text-xs text-foreground">
                nofollow noopener noreferrer
              </code>{" "}
              attributes.
            </p>
          </section>
          <section>
            <h2 className="font-display text-2xl text-foreground">What we collect</h2>
            <p className="mt-3">
              We do not require an account to read the site, and we do not collect names, email
              addresses or payment details from readers. Editor accounts exist only for staff who
              publish reviews.
            </p>
          </section>
          <section>
            <h2 className="font-display text-2xl text-foreground">Analytics</h2>
            <p className="mt-3">
              We use aggregate, non-identifying page metrics to understand which reviews are
              useful. We do not sell or share reader data with third parties.
            </p>
          </section>
          <section>
            <h2 className="font-display text-2xl text-foreground">Contact</h2>
            <p className="mt-3">
              Questions about this policy or a correction to a review can be sent to
              editors@theshortlist.example.
            </p>
          </section>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
