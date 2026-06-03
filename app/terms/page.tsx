import type { Metadata } from "next";
import Container from "@/components/Container";
import { siteConfig } from "@/site.config";

export const metadata: Metadata = {
  title: `Terms of Service — ${siteConfig.name}`,
  description: `Terms of Service for ${siteConfig.name}.`,
};

export default function TermsPage() {
  return (
    <section className="bg-white py-20 lg:py-24">
      <Container>
        <div className="max-w-3xl mx-auto">
          <h1 className="font-display text-4xl font-bold text-navy mb-2">Terms of Service</h1>
          <p className="text-sm text-muted mb-10">Last updated: June 1, 2026</p>

          <Section title="1. Acceptance">
            <p>By using {siteConfig.name} or submitting an application, you agree to these Terms of Service. If you do not agree, please do not use the site.</p>
          </Section>

          <Section title="2. Eligibility">
            <p>Listings are available to U.S.-based businesses in good standing. By applying, you represent and warrant that your business meets this requirement and that you are authorized to act on its behalf.</p>
          </Section>

          <Section title="3. Listings">
            <ul>
              <li>Listings are sold on an annual basis and are scheduled to debut with the coordinated directory launch in 2027.</li>
              <li>Submission of an application does not guarantee approval. All applications are subject to review.</li>
              <li>Upon approval and payment, listing fees are earned and non-refundable.</li>
              <li>Payment secures placement in the directory and inclusion at launch.</li>
              <li>Listings remain active for the purchased term unless removed for violation of these Terms or applicable law.</li>
              <li>{siteConfig.name} reserves the right to approve, reject, or remove any listing at its sole discretion.</li>
            </ul>
          </Section>

          <Section title="4. Pricing and Billing">
            <ul>
              <li>Listing fees are as presented and agreed at the time of application, order, or approval.</li>
              <li>Payment is collected upon application approval. By submitting payment information, you authorize {siteConfig.name} to charge the applicable fees upon approval.</li>
              <li>All fees are earned upon approval and non-refundable.</li>
              <li>Pricing for future listing periods or renewals (if offered) may change at {siteConfig.name}&rsquo;s discretion with reasonable notice.</li>
            </ul>
          </Section>

          <Section title="5. Content and Assets">
            <p>By granting asset permission in your application, you authorize {siteConfig.name} to use your business&rsquo;s name, logo, photos, and publicly available information for listing and promotional purposes.</p>
            <p>You may revoke this authorization in writing; however, such revocation will apply prospectively only and will not require removal of materials already published or distributed.</p>
          </Section>

          <Section title="6. Awards and Recognition Dinner">
            <p>An active listing makes your business eligible for recognition at the Annual Awards &amp; Recognition Dinner. Event attendance is subject to capacity, scheduling, and logistics, and is not guaranteed.</p>
          </Section>

          <Section title="7. Prohibited Conduct">
            <p>You may not submit false or misleading information, impersonate another business or individual, or use this site for any unlawful purpose.</p>
          </Section>

          <Section title="8. Disclaimer">
            <p>{siteConfig.name} is a listing and recognition platform. We do not guarantee any specific volume of inquiries, leads, or business outcomes resulting from a listing.</p>
            <p>{siteConfig.name} does not endorse any listed business and does not create any professional, advisory, or agency relationship between users and any listed business.</p>
          </Section>

          <Section title="9. Limitation of Liability">
            <p>To the maximum extent permitted by law, {siteConfig.name} and its operators shall not be liable for any indirect, incidental, special, or consequential damages arising from the use of this site or any listing.</p>
            <p>In all cases, total liability shall not exceed the amount paid by the listing business for the applicable listing.</p>
          </Section>

          <Section title="10. Dispute Resolution">
            <p>Any dispute arising out of or relating to these Terms shall be resolved through binding arbitration administered by the American Arbitration Association (AAA) in accordance with its commercial arbitration rules.</p>
            <p>The parties agree to waive any right to participate in class actions or class-wide arbitration.</p>
          </Section>

          <Section title="11. Governing Law">
            <p>These Terms shall be governed by and construed in accordance with the laws of the State of Florida.</p>
            <p>Venue for any permitted legal action shall be exclusively in Palm Beach County, Florida.</p>
          </Section>

          <Section title="12. Changes">
            <p>We may update these Terms at any time. Continued use of the site following any changes constitutes your acceptance of the updated Terms.</p>
          </Section>

          <Section title="13. Contact">
            <p>
              <a href={`mailto:${siteConfig.salesEmail}`} className="text-gold hover:text-gold-dark transition-colors">{siteConfig.salesEmail}</a>
              <br />
              <a href={siteConfig.phoneHref} className="text-gold hover:text-gold-dark transition-colors">{siteConfig.phone}</a>
            </p>
          </Section>
        </div>
      </Container>
    </section>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-8">
      <h2 className="font-display text-xl font-bold text-navy mb-3">{title}</h2>
      <div className="text-muted leading-relaxed space-y-3 text-[15px]">{children}</div>
    </div>
  );
}
