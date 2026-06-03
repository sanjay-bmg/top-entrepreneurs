export interface FaqItem {
  question: string;
  answer: string;
}

export const faqItems: FaqItem[] = [
  {
    question: "Who qualifies to be listed?",
    answer:
      "Any U.S.-based founder or business owner in good standing may apply. Every qualifying entrepreneur is accepted. If we need anything to finalize your listing, we'll reach out — otherwise your listing goes live at the coordinated October 2026 directory launch.",
  },
  {
    question: "What does a listing cost?",
    answer:
      "$289/yr per city — covers all your recognition categories. Add as many as your business fits at no extra cost.",
  },
  {
    question: "When does my listing go live?",
    answer:
      "All listings debut together at the October 2026 directory launch — a coordinated national reveal.",
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
      "Within each city and category, businesses are ordered by verified client review rating.",
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
