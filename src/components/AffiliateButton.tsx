import { ExternalLink } from "lucide-react";

import { cn } from "@/lib/utils";

type Props = {
  href: string;
  label?: string;
  size?: "sm" | "lg";
  className?: string;
  productTitle?: string;
};

export function AffiliateButton({
  href,
  label = "Check Price on Amazon",
  size = "sm",
  className,
  productTitle,
}: Props) {
  return (
    <a
      href={href}
      target="_blank"
      rel="nofollow noopener noreferrer"
      aria-label={productTitle ? `${label} — ${productTitle} (opens in a new tab)` : undefined}
      className={cn(
        "inline-flex w-full items-center justify-center gap-2 rounded-md bg-accent font-medium text-accent-foreground transition-colors hover:bg-accent/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        size === "lg" ? "px-6 py-3.5 text-base" : "px-4 py-2.5 text-sm",
        className,
      )}
    >
      {label}
      <ExternalLink className="h-4 w-4" aria-hidden="true" />
    </a>
  );
}
