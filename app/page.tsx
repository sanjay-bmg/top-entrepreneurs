import Hero from "@/components/Hero";
import ValueProps from "@/components/ValueProps";
import DirectoryPreview from "@/components/DirectoryPreview";
import AwardsDinner from "@/components/AwardsDinner";
import Pricing from "@/components/Pricing";
import Faq from "@/components/Faq";
import AnnouncementBanner from "@/components/AnnouncementBanner";
import FinalCta from "@/components/FinalCta";
import { faqItems } from "@/content/faq";

export default function HomePage() {
  return (
    <>
      <Hero />
      <ValueProps />
      <DirectoryPreview />
      <AwardsDinner />
      <Pricing />
      <Faq items={faqItems} />
      <AnnouncementBanner />
      <FinalCta />
    </>
  );
}
