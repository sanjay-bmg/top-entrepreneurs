import { clsx } from "clsx";
import { siteConfig } from "@/site.config";

/**
 * Text wordmark logo (brief: "logo = text of domain name").
 * Single-line "TOPENTREPRENEURS.com" — "TOP" is full size (matching the
 * TopLawFirms proportion), ".com" smaller. Size is driven by the parent
 * font-size via `className` (e.g. text-xl).
 */
export default function Wordmark({
  className,
  variant = "onDark",
}: {
  className?: string;
  variant?: "onDark" | "onLight";
}) {
  const { top, bottom, tld } = siteConfig.wordmark;
  const main = variant === "onDark" ? "text-white" : "text-navy";
  const tldTone = variant === "onDark" ? "text-white/55" : "text-muted";

  return (
    <span
      className={clsx(
        "font-display font-bold tracking-tight leading-none select-none whitespace-nowrap",
        className,
      )}
      aria-label={siteConfig.name}
    >
      <span className="text-gold">{top}</span>
      <span className={main}>{bottom}</span>
      <span className={clsx("font-normal text-[0.62em]", tldTone)}>{tld}</span>
    </span>
  );
}
