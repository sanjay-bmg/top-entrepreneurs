"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { clsx } from "clsx";
import Container from "./Container";
import type { FaqItem } from "@/content/faq";

interface FaqProps {
  items: FaqItem[];
  title?: string;
  subtitle?: string;
  light?: boolean;
}

function FaqAccordionItem({
  item,
  isOpen,
  onToggle,
  light,
}: {
  item: FaqItem;
  isOpen: boolean;
  onToggle: () => void;
  light?: boolean;
}) {
  return (
    <div
      className={clsx(
        "border rounded-xl overflow-hidden transition-all",
        light
          ? "border-cream-dark bg-white"
          : "border-white/10 bg-navy-light/30",
      )}
    >
      <button
        className={clsx(
          "w-full flex items-center justify-between gap-4 px-6 py-5 text-left font-medium transition-colors",
          light
            ? "text-navy hover:bg-cream"
            : "text-white hover:bg-white/5",
        )}
        onClick={onToggle}
        aria-expanded={isOpen}
      >
        <span className="text-base leading-snug">{item.question}</span>
        <ChevronDown
          className={clsx(
            "h-5 w-5 flex-shrink-0 transition-transform duration-200",
            light ? "text-gold" : "text-gold",
            isOpen && "rotate-180",
          )}
        />
      </button>

      <div
        className={clsx(
          "overflow-hidden transition-all duration-200",
          isOpen ? "max-h-96" : "max-h-0",
        )}
      >
        <p
          className={clsx(
            "px-6 pb-5 text-sm leading-relaxed",
            light ? "text-muted" : "text-white/60",
          )}
        >
          {item.answer}
        </p>
      </div>
    </div>
  );
}

export default function Faq({
  items,
  title = "Frequently Asked Questions",
  subtitle,
  light = true,
}: FaqProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className={clsx("py-20 lg:py-24", light ? "bg-cream" : "bg-navy")}>
      <Container>
        <div className="text-center mb-12">
          <h2
            className={clsx(
              "font-display text-3xl sm:text-4xl font-bold mb-4",
              light ? "text-navy" : "text-white",
            )}
          >
            {title}
          </h2>
          <div className="w-12 h-0.5 bg-gold mx-auto mb-5" />
          {subtitle && (
            <p className={clsx("max-w-xl mx-auto text-lg leading-relaxed", light ? "text-muted" : "text-white/60")}>
              {subtitle}
            </p>
          )}
        </div>

        <div className="max-w-3xl mx-auto space-y-3">
          {items.map((item, index) => (
            <FaqAccordionItem
              key={index}
              item={item}
              isOpen={openIndex === index}
              onToggle={() => setOpenIndex(openIndex === index ? null : index)}
              light={light}
            />
          ))}
        </div>
      </Container>
    </section>
  );
}
