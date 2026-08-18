import { Info, X } from "lucide-react";
import { useState } from "react";

import { AMAZON_DISCLOSURE } from "@/components/SiteFooter";

export function AffiliateDisclaimer() {
  const [dismissed, setDismissed] = useState(false);
  if (dismissed) return null;

  return (
    <aside
      aria-label="Affiliate disclosure"
      className="fixed inset-x-3 bottom-3 z-50 mx-auto flex max-w-3xl items-start gap-3 rounded-lg border bg-card/95 px-4 py-3 shadow-[var(--shadow-lift)] backdrop-blur"
    >
      <Info className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden="true" />
      <p className="flex-1 text-xs leading-relaxed text-muted-foreground">
        <span className="font-medium text-foreground">Affiliate disclosure:</span>{" "}
        {AMAZON_DISCLOSURE} This never affects which products we recommend.
      </p>
      <button
        type="button"
        onClick={() => setDismissed(true)}
        aria-label="Dismiss affiliate disclosure"
        className="rounded p-1 text-muted-foreground transition-colors hover:text-foreground"
      >
        <X className="h-4 w-4" aria-hidden="true" />
      </button>
    </aside>
  );
}
