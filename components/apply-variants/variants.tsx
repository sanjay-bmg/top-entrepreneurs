import type { ComponentType } from "react";
import VariantWizard from "./VariantWizard";
import VariantExpress from "./VariantExpress";
import VariantOnePage from "./VariantOnePage";
import VariantConversational from "./VariantConversational";
import VariantAccordion from "./VariantAccordion";
import VariantConversationalChat from "./VariantConversationalChat";
import VariantConversationalMinimal from "./VariantConversationalMinimal";
import VariantConversationalPersona from "./VariantConversationalPersona";

export interface VariantMeta {
  slug: string; // route under /apply — e.g. "compare1"
  tag: string; // A–E
  name: string;
  blurb: string;
  wide: boolean; // needs the wider container (sticky summary rail)
  Component: ComponentType;
}

/** The five bake-off forms, in order. Each renders on its own /apply/compareN page. */
export const VARIANTS: VariantMeta[] = [
  {
    slug: "compare1",
    tag: "A",
    name: "Guided Wizard",
    blurb:
      "Order-first, stepped flow with a progress bar: Order → Payment → Details. The escape hatch to finish details later lives on the last step.",
    wide: false,
    Component: VariantWizard,
  },
  {
    slug: "compare2",
    tag: "B",
    name: "Express",
    blurb:
      "One short screen — the bare minimum plus the card. Profile details are deferred to Support entirely. The fastest possible path to a placed order.",
    wide: false,
    Component: VariantExpress,
  },
  {
    slug: "compare3",
    tag: "C",
    name: "Single Page",
    blurb:
      "Everything visible on one scroll with a sticky order-summary rail. A 'collect details later' checkbox dims the optional section. The see-it-all play.",
    wide: true,
    Component: VariantOnePage,
  },
  {
    slug: "compare4",
    tag: "D",
    name: "Conversational",
    blurb:
      "One question at a time, Typeform-style, with a progress bar. Asks for the order + card, then offers to finish the listing now or later.",
    wide: false,
    Component: VariantConversational,
  },
  {
    slug: "compare5",
    tag: "E",
    name: "Accordion Checkout",
    blurb:
      "Stripe/Shopify-style: each section collapses to a one-line summary as you complete it, then opens the next. Details section is optional.",
    wide: false,
    Component: VariantAccordion,
  },
  {
    slug: "compare6",
    tag: "D2",
    name: "Conversational · Chat",
    blurb:
      "Messenger style — the guide asks one thing at a time in a conversation thread, and your answers appear as sent bubbles.",
    wide: false,
    Component: VariantConversationalChat,
  },
  {
    slug: "compare7",
    tag: "D3",
    name: "Conversational · Minimal",
    blurb:
      "The purest Typeform: huge type, one question, lots of whitespace, Enter-to-advance, and choices that auto-advance. Calm and focused.",
    wide: false,
    Component: VariantConversationalMinimal,
  },
  {
    slug: "compare8",
    tag: "D4",
    name: "Conversational · Persona",
    blurb:
      "A friendly named guide (Maya) walks you through with warm, encouraging microcopy and a reassurance at the payment step.",
    wide: false,
    Component: VariantConversationalPersona,
  },
];
