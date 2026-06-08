import type { Metadata } from "next";
import CompareShell from "@/components/apply-variants/CompareShell";
import { VARIANTS } from "@/components/apply-variants/variants";
import { siteConfig } from "@/site.config";

export const metadata: Metadata = {
  title: `${VARIANTS[1].name} (Form ${VARIANTS[1].tag}) — ${siteConfig.name}`,
  robots: { index: false, follow: false },
};

export default function Compare2Page() {
  return <CompareShell index={1} />;
}
