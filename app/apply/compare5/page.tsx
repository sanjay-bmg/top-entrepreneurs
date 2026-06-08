import type { Metadata } from "next";
import CompareShell from "@/components/apply-variants/CompareShell";
import { VARIANTS } from "@/components/apply-variants/variants";
import { siteConfig } from "@/site.config";

export const metadata: Metadata = {
  title: `${VARIANTS[4].name} (Form ${VARIANTS[4].tag}) — ${siteConfig.name}`,
  robots: { index: false, follow: false },
};

export default function Compare5Page() {
  return <CompareShell index={4} />;
}
