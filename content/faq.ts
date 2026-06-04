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
      "$289/yr per city — covers all your recognition categories, with as many as your business fits at no extra cost. The Top Spot, an optional premium placement, is +$689/yr for each city you want it in.",
  },
  {
    question: "What is the Top Spot?",
    answer:
      "The Top Spot is the single premium placement above every other business on a city's page, marked with a Top Spot badge. Only one business can hold it per city, and it's sold first-come. You choose which of your cities to claim it in — +$689/yr per city, on top of your listing.",
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
      "Within each city and category, businesses are ordered by verified client review rating. The Top Spot holder, if any, is placed above the ranked listings.",
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
