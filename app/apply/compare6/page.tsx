import type { Metadata } from "next";
import CompareShell from "@/components/apply-variants/CompareShell";
import { VARIANTS } from "@/components/apply-variants/variants";
import { siteConfig } from "@/site.config";

export const metadata: Metadata = {
  title: `${VARIANTS[5].name} (Form ${VARIANTS[5].tag}) — ${siteConfig.name}`,
  robots: { index: false, follow: false },
};

export default function Compare6Page() {
  return <CompareShell index={5} />;
}
