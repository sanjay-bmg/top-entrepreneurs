import type { Metadata } from "next";
import CompareShell from "@/components/apply-variants/CompareShell";
import { VARIANTS } from "@/components/apply-variants/variants";
import { siteConfig } from "@/site.config";

export const metadata: Metadata = {
  title: `${VARIANTS[3].name} (Form ${VARIANTS[3].tag}) — ${siteConfig.name}`,
  robots: { index: false, follow: false },
};

export default function Compare4Page() {
  return <CompareShell index={3} />;
}
