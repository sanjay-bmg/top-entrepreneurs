import { z } from "zod";
import { allIndustries } from "@/content/industries";

const phoneField = z
  .string()
  .min(10, "Enter a valid phone number")
  .regex(/^[\d\s\(\)\-\+\.]+$/, "Enter a valid phone number");

export const applySchema = z
  .object({
    type: z.literal("apply").default("apply"),

    // Which comparison form produced this submission (bake-off attribution)
    variant: z.string().optional(),
    // True when the applicant placed the order but deferred the profile
    // details for Support to collect later.
    completeLater: z.boolean().default(false),

    // --- Order: business identity ---
    businessName: z.string().min(2, "Business name is required"),
    website: z.string().optional(),

    // --- Order: contact (who Support follows up with) ---
    contactFirstName: z.string().min(1, "First name is required"),
    contactLastName: z.string().min(1, "Last name is required"),
    email: z.string().email("Enter a valid email address"),
    contactPhone: phoneField,
    contactTitle: z.string().optional(),

    // --- Order: what they're buying (drives the price) ---
    locations: z
      .array(
        z.object({
          city: z.string().min(2, "City is required"),
          state: z.string().length(2, "Select a state"),
        }),
      )
      .min(1, "Add at least one city"),
    featuredPlacement: z.boolean().default(false),
    excludedFeatured: z.array(z.string()).default([]),

    // --- Payment: always required (this is the order) ---
    cardNumber: z.string().regex(/^[\d\s]{13,25}$/, "Enter a valid card number"),
    cardExpiry: z.string().regex(/^(0[1-9]|1[0-2])\/\d{2}$/, "Enter expiry as MM/YY"),
    cardCvv: z.string().regex(/^\d{3,4}$/, "Enter a valid CVV"),
    cardName: z.string().min(2, "Name on card is required"),
    billingAddress: z.string().min(5, "Billing address is required"),
    billingCity: z.string().min(2, "Billing city is required"),
    billingState: z.string().length(2, "Select a state"),
    billingZip: z.string().regex(/^\d{5}(-\d{4})?$/, "Enter a valid ZIP code"),
    consentToTerms: z.literal(true, {
      errorMap: () => ({ message: "You must agree to the terms to continue" }),
    }),

    // --- Details: collected now, or deferred when completeLater is true ---
    businessPhone: z.string().optional(),
    industries: z.array(z.string()).default([]),
    owners: z
      .array(
        z.object({
          name: z.string().min(1, "Name is required"),
          title: z.string().optional(),
          description: z.string().max(500, "Description too long").optional(),
        }),
      )
      .optional(),
    assetPermission: z.enum(["grant", "support"]).optional(),
    awardShippingAddress: z.string().optional(),
    awardShippingCity: z.string().optional(),
    awardShippingState: z.string().optional(),
    awardShippingZip: z.string().optional(),
    notes: z.string().max(1000).optional(),

    _honeypot: z.string().max(0, "Bot detected").optional(),
  })
  .superRefine((data, ctx) => {
    // Any categories provided must be valid, in either flow.
    if ((data.industries ?? []).some((a) => !allIndustries.includes(a))) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["industries"], message: "Invalid category" });
    }

    // Deferred details are validated when Support collects them, not now.
    if (data.completeLater) return;

    if (!data.industries || data.industries.length < 1) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["industries"], message: "Select at least one category" });
    }
    if (!data.businessPhone || data.businessPhone.replace(/\D/g, "").length < 10) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["businessPhone"], message: "Enter a valid phone number" });
    }
    if (!data.assetPermission) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["assetPermission"], message: "Please select an option" });
    }
    if (!data.awardShippingAddress || data.awardShippingAddress.length < 5) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["awardShippingAddress"], message: "Shipping address is required" });
    }
    if (!data.awardShippingCity || data.awardShippingCity.length < 2) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["awardShippingCity"], message: "City is required" });
    }
    if (!data.awardShippingState || data.awardShippingState.length !== 2) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["awardShippingState"], message: "Select a state" });
    }
    if (!data.awardShippingZip || !/^\d{5}(-\d{4})?$/.test(data.awardShippingZip)) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["awardShippingZip"], message: "Enter a valid ZIP code" });
    }
  });

export const contactSchema = z.object({
  type: z.literal("contact").default("contact"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Enter a valid email address"),
  phone: z
    .string()
    .min(10, "Enter a valid phone number")
    .regex(/^[\d\s\(\)\-\+\.]+$/, "Enter a valid phone number"),
  message: z.string().min(10, "Message must be at least 10 characters"),
  consentToContact: z.literal(true, { errorMap: () => ({ message: "Please confirm your consent to continue" }) }),
  _honeypot: z.string().max(0, "Bot detected").optional(),
});

export type ApplyFormData = z.infer<typeof applySchema>;
export type ContactFormData = z.infer<typeof contactSchema>;
