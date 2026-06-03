export interface FaqItem {
  question: string;
  answer: string;
}

export const faqItems: FaqItem[] = [
  {
    question: "Who qualifies to be listed?",
    answer:
      "Any U.S.-based founder or business owner in good standing may apply. Every qualifying entrepreneur is accepted. If we need anything to finalize your listing, we'll reach out — otherwise your listing goes live at the coordinated 2027 directory launch.",
  },
  {
    question: "What does a listing cost?",
    answer:
      "$289 per city for your first industry. Additional industries are included free — add every category your business serves at no extra cost. Pricing is for the annual listing.",
  },
  {
    question: "When does my listing go live?",
    answer:
      "All listings debut together at the 2027 directory launch — a coordinated national reveal.",
  },
  {
    question: "Do I receive an award?",
    answer:
      "Yes. Every listed entrepreneur receives a custom Top Entrepreneurs recognition award, suitable for display in your office, storefront, or home.",
  },
  {
    question: "What is the Awards & Recognition Dinner?",
    answer:
      "An exclusive annual event where listed entrepreneurs are recognized before peers, investors, and community leaders. Every listing includes an invitation.",
  },
  {
    question: "How are businesses ranked?",
    answer:
      "Within each city and industry, businesses are ordered by verified client review rating.",
  },
  {
    question: "Can I cancel my listing?",
    answer:
      "Listings are annual. Once your listing is finalized, the listing fee is non-refundable. You may cancel auto-renewal at any time before the next annual cycle.",
  },
];

export const howItWorksFaqItems: FaqItem[] = [
  faqItems[0],
  faqItems[2],
  faqItems[4],
  faqItems[5],
];
