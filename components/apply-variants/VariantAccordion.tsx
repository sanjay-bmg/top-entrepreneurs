"use client";

import { useForm, Controller, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Check, Pencil, Lock, ChevronDown, Plus, Trash2 } from "lucide-react";
import { applySchema, type ApplyFormData } from "@/lib/schema";
import { FormField, Input, Textarea, Select } from "@/components/FormField";
import IndustryMultiSelect from "@/components/IndustryMultiSelect";
import CityCombobox from "@/components/CityCombobox";
import PricingEstimate from "@/components/PricingEstimate";
import { calculateQuote, formatCurrency, PRICING } from "@/lib/pricing";
import Button from "@/components/Button";
import { US_STATES } from "@/content/states";
import {
  formatPhone,
  formatCC,
  formatExpiry,
  defaultApplyValues,
  useApplySubmit,
  useFeaturedAvailability,
} from "./shared";

const SECTIONS = [
  { number: 1, title: "Your Order" },
  { number: 2, title: "Payment" },
  { number: 3, title: "Business details (optional)" },
] as const;

const SECTION_FIELDS: Record<number, (keyof ApplyFormData)[]> = {
  1: ["businessName", "contactFirstName", "contactLastName", "email", "contactPhone", "locations", "industries"],
  2: ["cardNumber", "cardExpiry", "cardCvv", "cardName", "billingAddress", "billingCity", "billingState", "billingZip", "consentToTerms"],
};

export default function VariantAccordion() {
  const [open, setOpen] = useState(1);
  const [done, setDone] = useState<Set<number>>(new Set());
  const { submitApply, serverError } = useApplySubmit();

  const {
    register,
    handleSubmit,
    control,
    watch,
    trigger,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ApplyFormData>({
    resolver: zodResolver(applySchema),
    defaultValues: defaultApplyValues("accordion"),
    mode: "onTouched",
  });

  const watchedIndustries = watch("industries");
  const watchedLocations = watch("locations");
  const watchedFeatured = watch("featuredPlacement");
  const watchedExcluded = watch("excludedFeatured");

  const { takenCities, checkAvailability } = useFeaturedAvailability(watchedLocations, !!watchedFeatured);

  const { fields: ownerFields, append: appendOwner, remove: removeOwner } = useFieldArray({ control, name: "owners" });
  const { fields: locationFields, append: appendLocation, remove: removeLocation } = useFieldArray({ control, name: "locations" });

  function toggleFeaturedSlot(key: string) {
    const current = watchedExcluded ?? [];
    setValue("excludedFeatured", current.includes(key) ? current.filter((k) => k !== key) : [...current, key]);
  }

  const validLocations = watch("locations")?.filter((l) => l.city && l.state) ?? [];
  const total = calculateQuote({
    industries: watchedIndustries ?? [],
    cities: validLocations,
    featured: watchedFeatured ?? false,
    excludedFeatured: [...new Set([...(watchedExcluded ?? []), ...takenCities])],
  }).total;

  async function advance(section: number) {
    const fields = SECTION_FIELDS[section];
    const valid = fields ? await trigger(fields) : true;
    if (!valid) return;
    setDone((prev) => new Set(prev).add(section));
    setOpen(section + 1);
  }

  async function onSubmit(data: ApplyFormData) {
    await submitApply(data, takenCities);
  }

  function finishNow() {
    setValue("completeLater", false);
    handleSubmit(onSubmit)();
  }

  function completeLater() {
    setValue("completeLater", true);
    handleSubmit(onSubmit)();
  }

  const cardLast4 = String(watch("cardNumber") ?? "").replace(/\D/g, "").slice(-4);

  const summaries: Record<number, string> = {
    1: `${watch("businessName") || "Your business"} · ${validLocations.length} cit${validLocations.length === 1 ? "y" : "ies"} · ${(watchedIndustries ?? []).length} categor${(watchedIndustries ?? []).length === 1 ? "y" : "ies"}`,
    2: `Card ending ${cardLast4 || "••••"} · ${formatCurrency(total)}`,
  };

  function SectionHeader({ number, title }: { number: number; title: string }) {
    const isDone = done.has(number);
    const isOpen = open === number;
    const locked = !isDone && !isOpen;

    return (
      <button
        type="button"
        onClick={() => isDone && setOpen(number)}
        disabled={locked}
        aria-expanded={isOpen}
        className={`flex w-full items-center gap-4 px-5 py-4 text-left transition-colors ${
          locked ? "cursor-default" : "cursor-pointer"
        } ${isOpen ? "bg-white" : isDone ? "bg-cream hover:bg-cream-dark/40" : "bg-cream"}`}
      >
        <span
          className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full border-2 text-sm font-bold transition-colors ${
            isDone ? "border-gold bg-gold text-white" : isOpen ? "border-navy bg-navy text-white" : "border-cream-dark bg-white text-muted"
          }`}
        >
          {isDone ? <Check className="h-4 w-4" /> : locked ? <Lock className="h-3.5 w-3.5" /> : number}
        </span>

        <span className="min-w-0 flex-1">
          <span className={`block font-display text-lg font-bold ${locked ? "text-muted" : "text-navy"}`}>{title}</span>
          {isDone && !isOpen && summaries[number] && (
            <span className="mt-0.5 block truncate text-sm text-muted">{summaries[number]}</span>
          )}
        </span>

        {isDone && !isOpen ? (
          <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-gold transition-colors hover:text-gold-dark">
            <Pencil className="h-3.5 w-3.5" /> Edit
          </span>
        ) : !locked ? (
          <ChevronDown className={`h-5 w-5 flex-shrink-0 text-muted transition-transform ${isOpen ? "rotate-180" : ""}`} />
        ) : (
          <Lock className="h-4 w-4 flex-shrink-0 text-muted" />
        )}
      </button>
    );
  }

  return (
    <form onSubmit={(e) => e.preventDefault()} noValidate>
      <input type="text" aria-hidden tabIndex={-1} className="absolute opacity-0 h-0 w-0 pointer-events-none" {...register("_honeypot")} />

      <div className="space-y-4">
        {SECTIONS.map((section) => {
          const isOpen = open === section.number;
          return (
            <div
              key={section.number}
              className={`overflow-hidden rounded-xl border transition-colors ${isOpen ? "border-gold/40 shadow-sm" : "border-cream-dark"}`}
            >
              <SectionHeader number={section.number} title={section.title} />

              <div
                className={`grid transition-all duration-300 ease-in-out ${isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}
              >
                <div className="overflow-hidden">
                  {/* Section 1 — Your Order */}
                  {section.number === 1 && (
                    <div className="space-y-6 border-t border-cream-dark px-5 pb-6 pt-6">
                      <p className="-mt-2 text-sm text-muted">The essentials we need to reserve your listing.</p>

                      <FormField label="Business Name" required error={errors.businessName?.message}>
                        <Input {...register("businessName")} error={errors.businessName?.message} placeholder="e.g. Halebrook Capital" />
                      </FormField>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <FormField label="First Name" required error={errors.contactFirstName?.message}>
                          <Input {...register("contactFirstName")} error={errors.contactFirstName?.message} placeholder="Jane" />
                        </FormField>
                        <FormField label="Last Name" required error={errors.contactLastName?.message}>
                          <Input {...register("contactLastName")} error={errors.contactLastName?.message} placeholder="Doe" />
                        </FormField>
                        <FormField label="Email Address" required error={errors.email?.message}>
                          <Input {...register("email")} error={errors.email?.message} type="email" placeholder="jane@yourbusiness.com" />
                        </FormField>
                        <FormField label="Phone" required error={errors.contactPhone?.message}>
                          <Input
                            {...register("contactPhone")}
                            onChange={(e) => { e.target.value = formatPhone(e.target.value); register("contactPhone").onChange(e); }}
                            error={errors.contactPhone?.message}
                            type="tel"
                            placeholder="(555) 000-0000"
                          />
                        </FormField>
                      </div>

                      {/* Cities */}
                      <div className="space-y-3">
                        <p className="text-sm font-semibold text-navy">Cities <span className="text-red-500">*</span></p>
                        <p className="text-sm text-muted">Select state first, then type to search your city.</p>
                        {(errors.locations as { message?: string } | undefined)?.message && (
                          <p className="text-xs text-red-600">{(errors.locations as { message?: string }).message}</p>
                        )}
                        {locationFields.map((field, index) => {
                          const stateVal = watchedLocations?.[index]?.state ?? "";
                          return (
                            <div key={field.id} className="p-4 rounded-xl border border-cream-dark bg-cream">
                              <div className="flex items-start gap-3">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 flex-1">
                                  <FormField label="State" required error={errors.locations?.[index]?.state?.message}>
                                    <Select {...register(`locations.${index}.state` as const)} error={errors.locations?.[index]?.state?.message}>
                                      <option value="">Select a state</option>
                                      {US_STATES.map((s) => <option key={s.abbr} value={s.abbr}>{s.name}</option>)}
                                    </Select>
                                  </FormField>
                                  <FormField label="City" required error={errors.locations?.[index]?.city?.message}>
                                    <Controller
                                      name={`locations.${index}.city` as const}
                                      control={control}
                                      render={({ field: cityField }) => (
                                        <CityCombobox
                                          state={stateVal}
                                          value={cityField.value}
                                          onChange={(city) => {
                                            cityField.onChange(city);
                                            if (city && stateVal && watchedFeatured) checkAvailability(city, stateVal);
                                          }}
                                          error={errors.locations?.[index]?.city?.message}
                                        />
                                      )}
                                    />
                                  </FormField>
                                </div>
                                {locationFields.length > 1 && (
                                  <button type="button" onClick={() => removeLocation(index)} className="mt-6 text-muted hover:text-red-500 transition-colors flex-shrink-0" aria-label="Remove city">
                                    <Trash2 className="h-4 w-4" />
                                  </button>
                                )}
                              </div>
                            </div>
                          );
                        })}
                        <button type="button" onClick={() => appendLocation({ city: "", state: "" })} className="inline-flex items-center gap-2 text-sm font-semibold text-gold hover:text-gold-dark transition-colors">
                          <Plus className="h-4 w-4" /> Add another city
                        </button>
                      </div>

                      {/* Categories */}
                      <div className="space-y-3">
                        <p className="text-sm font-semibold text-navy">Recognition Categories <span className="text-red-500">*</span></p>
                        <p className="text-sm text-muted">Select every category your business fits — all included at ${PRICING.primaryIndustry}/yr per city.</p>
                        <Controller
                          name="industries"
                          control={control}
                          render={({ field }) => <IndustryMultiSelect value={field.value ?? []} onChange={field.onChange} error={errors.industries?.message} />}
                        />
                      </div>

                      {/* Top Spot */}
                      <label className={`flex items-start gap-4 p-5 rounded-xl border-2 cursor-pointer transition-colors ${watchedFeatured ? "border-gold bg-gold/5" : "border-gold/40 bg-white hover:border-gold/70"}`}>
                        <input type="checkbox" {...register("featuredPlacement")} className="mt-1 h-5 w-5 rounded accent-gold flex-shrink-0" />
                        <div>
                          <p className="font-display font-bold text-navy text-lg">Add the Top Spot</p>
                          <p className="text-gold font-bold text-base mt-0.5">+{formatCurrency(PRICING.featuredCity)} per city — only one business per city</p>
                          <p className="text-sm text-muted mt-2 leading-relaxed">Claim the single top spot in your city before someone else does. Pick which cities below.</p>
                        </div>
                      </label>

                      <PricingEstimate
                        industries={watchedIndustries ?? []}
                        cities={validLocations}
                        featured={watchedFeatured ?? false}
                        excludedFeatured={watchedExcluded ?? []}
                        takenCities={takenCities}
                        onToggleFeatured={toggleFeaturedSlot}
                      />

                      <div className="flex justify-end pt-2">
                        <button type="button" onClick={() => advance(1)} className="inline-flex items-center gap-2 rounded-xl bg-navy px-6 py-3 text-sm font-semibold text-white hover:bg-navy/90 transition-colors">
                          Continue to payment
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Section 2 — Payment */}
                  {section.number === 2 && (
                    <div className="space-y-6 border-t border-cream-dark px-5 pb-6 pt-6">
                      <p className="-mt-2 text-sm text-muted">Secure your spot — your listing goes live at the October 2026 launch.</p>

                      <div className="rounded-xl border border-gold/30 bg-navy/5 p-4 flex justify-between items-center">
                        <span className="font-semibold text-navy">Order total</span>
                        <span className="font-display text-2xl font-bold text-gold">{formatCurrency(total)}</span>
                      </div>

                      <FormField label="Card Number" required error={errors.cardNumber?.message}>
                        <Input {...register("cardNumber")} error={errors.cardNumber?.message} placeholder="1234 5678 9012 3456" maxLength={25} inputMode="numeric" autoComplete="cc-number"
                          onChange={(e) => { e.target.value = formatCC(e.target.value); register("cardNumber").onChange(e); }} />
                      </FormField>

                      <div className="grid grid-cols-2 gap-5">
                        <FormField label="Expiry" required error={errors.cardExpiry?.message} hint="MM/YY">
                          <Input {...register("cardExpiry")} error={errors.cardExpiry?.message} placeholder="MM/YY" maxLength={5} inputMode="numeric" autoComplete="cc-exp"
                            onChange={(e) => { e.target.value = formatExpiry(e.target.value); register("cardExpiry").onChange(e); }} />
                        </FormField>
                        <FormField label="CVV" required error={errors.cardCvv?.message}>
                          <Input {...register("cardCvv")} error={errors.cardCvv?.message} placeholder="123" maxLength={4} inputMode="numeric" autoComplete="cc-csc" />
                        </FormField>
                      </div>

                      <FormField label="Name on Card" required error={errors.cardName?.message}>
                        <Input {...register("cardName")} error={errors.cardName?.message} placeholder="Jane Doe" autoComplete="cc-name" />
                      </FormField>

                      <div className="pt-2 border-t border-cream-dark">
                        <p className="text-xs font-semibold text-navy uppercase tracking-wider mb-4">Billing Address</p>
                        <div className="space-y-5">
                          <FormField label="Street Address" required error={errors.billingAddress?.message}>
                            <Input {...register("billingAddress")} error={errors.billingAddress?.message} placeholder="123 Main St, Suite 400" autoComplete="billing street-address" />
                          </FormField>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                            <FormField label="City" required error={errors.billingCity?.message}>
                              <Input {...register("billingCity")} error={errors.billingCity?.message} placeholder="Austin" autoComplete="billing address-level2" />
                            </FormField>
                            <FormField label="State" required error={errors.billingState?.message}>
                              <Select {...register("billingState")} error={errors.billingState?.message} autoComplete="billing address-level1">
                                <option value="">State</option>
                                {US_STATES.map((s) => <option key={s.abbr} value={s.abbr}>{s.abbr}</option>)}
                              </Select>
                            </FormField>
                            <FormField label="ZIP Code" required error={errors.billingZip?.message}>
                              <Input {...register("billingZip")} error={errors.billingZip?.message} placeholder="78701" maxLength={10} inputMode="numeric" autoComplete="billing postal-code" />
                            </FormField>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-1 pt-2">
                        <label className="flex items-start gap-3 cursor-pointer">
                          <input type="checkbox" {...register("consentToTerms")} className="mt-0.5 h-4 w-4 rounded accent-gold flex-shrink-0" />
                          <span className="text-sm text-muted leading-snug">
                            I agree to the <a href="/terms" target="_blank" className="text-gold hover:text-gold-dark underline">Terms of Service</a> and{" "}
                            <a href="/privacy" target="_blank" className="text-gold hover:text-gold-dark underline">Privacy Policy</a>, consent to being contacted about my listing, and agree to receive marketing communications via email or SMS. Reply STOP to opt out at any time.
                          </span>
                        </label>
                        {errors.consentToTerms && <p className="text-xs text-red-600 pl-7">{errors.consentToTerms.message}</p>}
                      </div>

                      <div className="flex justify-end pt-2">
                        <button type="button" onClick={() => advance(2)} className="inline-flex items-center gap-2 rounded-xl bg-navy px-6 py-3 text-sm font-semibold text-white hover:bg-navy/90 transition-colors">
                          Continue to details
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Section 3 — Business details (optional) */}
                  {section.number === 3 && (
                    <div className="space-y-6 border-t border-cream-dark px-5 pb-6 pt-6">
                      <div className="-mt-2 rounded-xl border border-gold/30 bg-gold/5 p-4">
                        <p className="text-sm text-muted">Your order is set — these finish your listing.</p>
                      </div>

                      <FormField label="Business Phone" required error={errors.businessPhone?.message}>
                        <Input {...register("businessPhone")} onChange={(e) => { e.target.value = formatPhone(e.target.value); register("businessPhone").onChange(e); }} error={errors.businessPhone?.message} type="tel" placeholder="(555) 000-0000" />
                      </FormField>

                      <FormField label="Website" hint="Optional" error={errors.website?.message}>
                        <Input {...register("website")} error={errors.website?.message} type="url" placeholder="https://yourbusiness.com" />
                      </FormField>

                      {/* Owners */}
                      <div className="space-y-4">
                        <div>
                          <p className="text-sm font-semibold text-navy">Founders &amp; Owners to List</p>
                          <p className="text-sm text-muted">Optional. Add the founders or owners you want recognized.</p>
                        </div>
                        {ownerFields.map((field, index) => (
                          <div key={field.id} className="p-4 rounded-xl border border-cream-dark bg-cream relative">
                            <button type="button" onClick={() => removeOwner(index)} className="absolute top-4 right-4 text-muted hover:text-red-500 transition-colors">
                              <Trash2 className="h-4 w-4" />
                            </button>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4 pr-8">
                              <FormField label="Name" required error={errors.owners?.[index]?.name?.message}>
                                <Input {...register(`owners.${index}.name` as const)} placeholder="e.g. Marcus Hale" error={errors.owners?.[index]?.name?.message} />
                              </FormField>
                              <FormField label="Title / Role" hint="Optional">
                                <Input {...register(`owners.${index}.title` as const)} placeholder="e.g. Founder & CEO" />
                              </FormField>
                            </div>
                            <FormField label="Bio / Accolades" hint="Optional">
                              <Textarea {...register(`owners.${index}.description` as const)} placeholder="A few words about this person…" rows={2} />
                            </FormField>
                          </div>
                        ))}
                        <button type="button" onClick={() => appendOwner({ name: "", title: "", description: "" })} className="inline-flex items-center gap-2 text-sm font-semibold text-gold hover:text-gold-dark transition-colors">
                          <Plus className="h-4 w-4" /> Add Person
                        </button>
                      </div>

                      {/* Asset permission */}
                      <fieldset className="space-y-3">
                        <legend className="text-sm font-semibold text-navy mb-2">Website Assets <span className="text-red-500 ml-0.5">*</span></legend>
                        <p className="text-sm text-muted -mt-1 mb-3">May we use photos, logos, and bio content from your website for your listing?</p>
                        {errors.assetPermission?.message && <p className="text-xs text-red-600">{errors.assetPermission.message}</p>}
                        <label className="flex items-start gap-3 p-4 rounded-xl border border-cream-dark bg-cream cursor-pointer hover:border-gold/50 transition-colors has-[:checked]:border-gold has-[:checked]:bg-gold/5">
                          <input type="radio" value="grant" {...register("assetPermission")} className="mt-0.5 accent-gold" />
                          <div>
                            <p className="font-semibold text-navy text-sm">Yes, you may use our website assets</p>
                            <p className="text-xs text-muted mt-0.5">We&apos;ll pull your logo, photos, and team bios automatically.</p>
                          </div>
                        </label>
                        <label className="flex items-start gap-3 p-4 rounded-xl border border-cream-dark bg-cream cursor-pointer hover:border-gold/50 transition-colors has-[:checked]:border-gold has-[:checked]:bg-gold/5">
                          <input type="radio" value="support" {...register("assetPermission")} className="mt-0.5 accent-gold" />
                          <div>
                            <p className="font-semibold text-navy text-sm">Please have your team contact us</p>
                            <p className="text-xs text-muted mt-0.5">Our support team will reach out to coordinate your listing assets.</p>
                          </div>
                        </label>
                      </fieldset>

                      {/* Award shipping */}
                      <div className="pt-2 border-t border-cream-dark">
                        <h4 className="text-sm font-semibold text-navy mb-1">Complimentary Award Delivery</h4>
                        <p className="text-xs text-muted mb-4">Where should we ship your complimentary custom recognition award?</p>
                        <div className="space-y-5">
                          <FormField label="Street Address" required error={errors.awardShippingAddress?.message}>
                            <Input {...register("awardShippingAddress")} error={errors.awardShippingAddress?.message} placeholder="123 Main St, Suite 400" autoComplete="street-address" />
                          </FormField>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                            <FormField label="City" required error={errors.awardShippingCity?.message}>
                              <Input {...register("awardShippingCity")} error={errors.awardShippingCity?.message} placeholder="Austin" autoComplete="address-level2" />
                            </FormField>
                            <FormField label="State" required error={errors.awardShippingState?.message}>
                              <Select {...register("awardShippingState")} error={errors.awardShippingState?.message} autoComplete="address-level1">
                                <option value="">State</option>
                                {US_STATES.map((s) => <option key={s.abbr} value={s.abbr}>{s.abbr}</option>)}
                              </Select>
                            </FormField>
                            <FormField label="ZIP Code" required error={errors.awardShippingZip?.message}>
                              <Input {...register("awardShippingZip")} error={errors.awardShippingZip?.message} placeholder="78701" maxLength={10} inputMode="numeric" autoComplete="postal-code" />
                            </FormField>
                          </div>
                        </div>
                      </div>

                      <FormField label="Notes" hint="Optional" error={errors.notes?.message}>
                        <Textarea {...register("notes")} placeholder="Any questions, special requests, or context for our team…" />
                      </FormField>

                      <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-end gap-4 pt-2">
                        <button type="button" onClick={completeLater} disabled={isSubmitting} className="text-sm font-semibold text-muted hover:text-navy transition-colors disabled:opacity-50">
                          I&apos;ll complete this later
                        </button>
                        <Button type="button" variant="primary" size="lg" disabled={isSubmitting} onClick={finishNow}>
                          {isSubmitting ? "Submitting…" : "Finish & Submit"}
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {serverError && <div className="mt-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700" role="alert">{serverError}</div>}
    </form>
  );
}
