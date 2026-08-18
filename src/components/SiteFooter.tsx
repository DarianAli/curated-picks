import { Link } from "@tanstack/react-router";

export const AMAZON_DISCLOSURE =
  "As an Amazon Associate, I earn from qualifying purchases.";

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t bg-card">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 md:grid-cols-3">
        <div>
          <p className="font-display text-lg">
            The Shortlist<span className="text-accent">.</span>
          </p>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted-foreground">
            Independent, long-form product testing. We buy what we test, keep it for months,
            and only recommend the small number of things that survive.
          </p>
        </div>

        <nav aria-label="Footer" className="text-sm">
          <p className="mb-3 text-[11px] uppercase tracking-widest text-muted-foreground">
            Browse
          </p>
          <ul className="space-y-2">
            <li>
              <Link to="/products" className="text-muted-foreground hover:text-foreground">
                All picks
              </Link>
            </li>
            <li>
              <Link to="/about" className="text-muted-foreground hover:text-foreground">
                Our method
              </Link>
            </li>
            <li>
              <Link to="/privacy" className="text-muted-foreground hover:text-foreground">
                Privacy policy
              </Link>
            </li>
            <li>
              <Link to="/admin/login" className="text-muted-foreground hover:text-foreground">
                Editor login
              </Link>
            </li>
          </ul>
        </nav>

        <div className="text-sm">
          <p className="mb-3 text-[11px] uppercase tracking-widest text-muted-foreground">
            Affiliate disclosure
          </p>
          <p className="leading-relaxed text-muted-foreground">
            {AMAZON_DISCLOSURE} Our recommendations are made independently of any commission,
            and prices are always checked on Amazon at the moment you click through.
          </p>
        </div>
      </div>

      <div className="border-t">
        <div className="mx-auto max-w-6xl px-5 py-6 text-xs text-muted-foreground">
          © {new Date().getFullYear()} The Shortlist. {AMAZON_DISCLOSURE}
        </div>
      </div>
    </footer>
  );
}
