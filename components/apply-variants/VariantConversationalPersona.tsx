"use client";

import { useForm, Controller, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { ArrowRight, ArrowLeft, Plus, Trash2, Sparkles, ShieldCheck } from "lucide-react";
import { applySchema, type ApplyFormData } from "@/lib/schema";
import { FormField, Input, Textarea, Select } from "@/components/FormField";
import IndustryMultiSelect from "@/components/IndustryMultiSelect";
import CityCombobox from "@/components/CityCombobox";
import { calculateQuote, formatCurrency, PRICING } from "@/lib/pricing";
import Button from "@/components/Button";
import { US_STATES } from "@/content/states";
import { siteConfig } from "@/site.config";
import FeaturedCityPicker from "./FeaturedCityPicker";
import {
  formatPhone,
  formatCC,
  formatExpiry,
  defaultApplyValues,
  useApplySubmit,
  useFeaturedAvailability,
} from "./shared";

const GUIDE_NAME = "Maya";

interface Screen {
  id: string;
  fields: (keyof ApplyFormData)[];
  render: () => React.ReactNode;
}

export default function VariantConversationalPersona() {
  const [screen, setScreen] = useState(0);
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
    defaultValues: defaultApplyValues("conversational-persona"),
    mode: "onTouched",
  });

  const watchedIndustries = watch("industries");
  const watchedLocations = watch("locations");
  const watchedFeatured = watch("featuredPlacement");
  const watchedExcluded = watch("excludedFeatured");

  const { takenCities, checkAvailability } = useFeaturedAvailability(watchedLocations, !!watchedFeatured);

  const { fields: locationFields, append: appendLocation, remove: removeLocation } = useFieldArray({ control, name: "locations" });

  const validLocations = watchedLocations?.filter((l) => l.city && l.state) ?? [];
  const orderTotal = calculateQuote({
    industries: watchedIndustries ?? [],
    cities: validLocations,
    featured: watchedFeatured ?? false,
    excludedFeatured: [...new Set([...(watchedExcluded ?? []), ...takenCities])],
  }).total;

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

  function toggleFeaturedSlot(key: string) {
    const current = watchedExcluded ?? [];
    setValue("excludedFeatured", current.includes(key) ? current.filter((k) => k !== key) : [...current, key]);
  }

  const screens: Screen[] = [
    {
      id: "businessName",
      fields: ["businessName"],
      render: () => (
        <FormField label="Business Name" required error={errors.businessName?.message}>
          <Input {...register("businessName")} error={errors.businessName?.message} placeholder="e.g. Halebrook Capital" />
        </FormField>
      ),
    },
    {
      id: "name",
      fields: ["contactFirstName", "contactLastName"],
      render: () => (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <FormField label="First Name" required error={errors.contactFirstName?.message}>
            <Input {...register("contactFirstName")} error={errors.contactFirstName?.message} placeholder="Jane" />
          </FormField>
          <FormField label="Last Name" required error={errors.contactLastName?.message}>
            <Input {...register("contactLastName")} error={errors.contactLastName?.message} placeholder="Doe" />
          </FormField>
        </div>
      ),
    },
    {
      id: "email",
      fields: ["email"],
      render: () => (
        <FormField label="Email Address" required error={errors.email?.message}>
          <Input {...register("email")} error={errors.email?.message} type="email" placeholder="jane@yourbusiness.com" />
        </FormField>
      ),
    },
    {
      id: "phone",
      fields: ["contactPhone"],
      render: () => (
        <FormField label="Phone" required error={errors.contactPhone?.message}>
          <Input
            {...register("contactPhone")}
            onChange={(e) => { e.target.value = formatPhone(e.target.value); register("contactPhone").onChange(e); }}
            error={errors.contactPhone?.message}
            type="tel"
            placeholder="(555) 000-0000"
          />
        </FormField>
      ),
    },
    {
      id: "locations",
      fields: ["locations"],
      render: () => (
        <div className="space-y-3">
          <p className="text-sm text-muted">Select state first, then type to search your city.</p>
          {(errors.locations as { message?: string } | undefined)?.message && (
            <p className="text-xs text-red-600">{(errors.locations as { message?: string }).message}</p>
          )}
          {locationFields.map((field, index) => {
            const stateVal = watchedLocations?.[index]?.state ?? "";
            return (
              <div key={field.id} className="p-4 rounded-2xl border border-cream-dark bg-cream">
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
      ),
    },
    {
      id: "industries",
      fields: ["industries"],
      render: () => (
        <div className="space-y-3">
          <p className="text-sm text-muted">Select every category your business fits — all included at ${PRICING.primaryIndustry}/yr per city.</p>
          <Controller
            name="industries"
            control={control}
            render={({ field }) => <IndustryMultiSelect value={field.value ?? []} onChange={field.onChange} error={errors.industries?.message} />}
          />
        </div>
      ),
    },
    {
      id: "featured",
      fields: [],
      render: () => (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setValue("featuredPlacement", true)}
              aria-pressed={!!watchedFeatured}
              className={`flex flex-col items-start gap-2 p-6 rounded-2xl border-2 text-left transition-colors ${watchedFeatured ? "border-gold bg-gold/5" : "border-gold/40 bg-white hover:border-gold/70"}`}
            >
              <span className="inline-flex items-center gap-2 font-display font-bold text-navy text-lg">
                <Sparkles className="h-5 w-5 text-gold" /> Yes, give me the Top Spot
              </span>
              <span className="text-gold font-bold text-base">+{formatCurrency(PRICING.featuredCity)}/city</span>
              <span className="text-sm text-muted leading-relaxed">Claim the single top spot in your city before someone else does — only one business per city.</span>
            </button>
            <button
              type="button"
              onClick={() => setValue("featuredPlacement", false)}
              aria-pressed={!watchedFeatured}
              className={`flex flex-col items-start gap-2 p-6 rounded-2xl border-2 text-left transition-colors ${!watchedFeatured ? "border-navy bg-navy/5" : "border-cream-dark bg-white hover:border-navy/40"}`}
            >
              <span className="font-display font-bold text-navy text-lg">No thanks, standard listing</span>
              <span className="text-sm text-muted leading-relaxed">Keep the standard annual listing in every category you chose.</span>
            </button>
          </div>

          {watchedFeatured && validLocations.length > 0 && (
            <FeaturedCityPicker
              cities={validLocations}
              excludedFeatured={watchedExcluded ?? []}
              takenCities={takenCities}
              onToggle={toggleFeaturedSlot}
            />
          )}

          <div className="rounded-2xl border border-gold/30 bg-navy/5 p-4 flex justify-between items-center">
            <span className="font-semibold text-navy">Running total</span>
            <span className="font-display text-2xl font-bold text-gold">{formatCurrency(orderTotal)}</span>
          </div>
        </div>
      ),
    },
    {
      id: "payment",
      fields: ["cardNumber", "cardExpiry", "cardCvv", "cardName", "billingAddress", "billingCity", "billingState", "billingZip", "consentToTerms"],
      render: () => (
        <div className="space-y-6">
          <div className="rounded-2xl border border-gold/30 bg-navy/5 p-4 flex justify-between items-center">
            <span className="font-semibold text-navy">Order total</span>
            <span className="font-display text-2xl font-bold text-gold">{formatCurrency(orderTotal)}</span>
          </div>

          <div className="flex items-start gap-2.5 rounded-2xl border border-gold/30 bg-gold/5 p-4 text-sm text-navy">
            <ShieldCheck className="h-5 w-5 text-gold flex-shrink-0 mt-0.5" />
            <span className="leading-relaxed">Your card&apos;s encrypted end-to-end — I&apos;ve got you. We never store your full card number.</span>
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
        </div>
      ),
    },
    {
      id: "decision",
      fields: [],
      render: () => (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => setScreen(9)}
            className="flex flex-col items-start gap-2 p-6 rounded-2xl border-2 border-gold bg-gold/5 text-left transition-colors hover:bg-gold/10"
          >
            <span className="font-display font-bold text-navy text-lg">Finish now</span>
            <span className="text-sm text-muted leading-relaxed">Add your business details and award shipping in a couple of minutes — I&apos;ll walk you through it.</span>
            <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-gold mt-1">Continue <ArrowRight className="h-4 w-4" /></span>
          </button>
          <button
            type="button"
            onClick={completeLater}
            disabled={isSubmitting}
            className="flex flex-col items-start gap-2 p-6 rounded-2xl border-2 border-cream-dark bg-white text-left transition-colors hover:border-navy/40 disabled:opacity-50"
          >
            <span className="font-display font-bold text-navy text-lg">I&apos;ll do it later</span>
            <span className="text-sm text-muted leading-relaxed">We&apos;ll email you a link, or our team will collect the rest for you.</span>
            <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted mt-1">{isSubmitting ? "Submitting…" : "Submit & finish later"}</span>
          </button>
        </div>
      ),
    },
    {
      id: "details",
      fields: [],
      render: () => (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <FormField label="Business Phone" required error={errors.businessPhone?.message}>
              <Input {...register("businessPhone")} onChange={(e) => { e.target.value = formatPhone(e.target.value); register("businessPhone").onChange(e); }} error={errors.businessPhone?.message} type="tel" placeholder="(555) 000-0000" />
            </FormField>
            <FormField label="Website" hint="Optional" error={errors.website?.message}>
              <Input {...register("website")} error={errors.website?.message} type="url" placeholder="https://yourbusiness.com" />
            </FormField>
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
        </div>
      ),
    },
  ];

  // Maya speaks each step in her own voice, with the question heading underneath.
  const SCRIPT: { persona: string; heading: string; helper?: string }[] = [
    { persona: "Love it — let's get you listed.", heading: "What's your business called?", helper: "We'll use this on your listing." },
    { persona: "Nice to meet you!", heading: "And your name?", helper: "So I know who to follow up with." },
    { persona: "Perfect — almost done with the basics.", heading: "Where should I send your confirmation?", helper: "I'll email your order details here." },
    { persona: "Just in case I need to reach you.", heading: "Best phone number for you?", helper: "Only used if I need to confirm something." },
    { persona: "Now the fun part — your markets.", heading: "Which cities do you operate in?", helper: "Add every city you want a listing in." },
    { persona: "Tell me what you do.", heading: "Which categories fit your business?" },
    { persona: "Want to stand out?", heading: "Want the Top Spot in your city?" },
    { persona: "Your card's encrypted end-to-end — I've got you.", heading: "Let's lock it in.", helper: "Secure your spot — your listing goes live at the October 2026 launch." },
    { persona: "Great, almost there 🎉", heading: "Your order's in! Finish your listing now, or later?" },
    { persona: "Last bit, I promise 🤝", heading: "A few details finish your listing.", helper: "Or have my team collect them for you." },
  ];

  const currentScreen = screens[screen];
  const { persona, heading, helper } = SCRIPT[screen];
  const isDecision = currentScreen.id === "decision";
  const isDetails = currentScreen.id === "details";

  async function goNext() {
    const valid = await trigger(currentScreen.fields);
    if (valid) setScreen((s) => s + 1);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLFormElement>) {
    // Single-input screens advance on Enter; leave grouped/decision screens alone.
    if (e.key !== "Enter") return;
    if (currentScreen.fields.length !== 1) return;
    if (e.target instanceof HTMLTextAreaElement) return;
    e.preventDefault();
    goNext();
  }

  return (
    <form onSubmit={(e) => e.preventDefault()} onKeyDown={handleKeyDown} noValidate>
      <input type="text" aria-hidden tabIndex={-1} className="absolute opacity-0 h-0 w-0 pointer-events-none" {...register("_honeypot")} />

      {/* Persona header — Maya with a soft progress cue */}
      <div className="flex items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gold text-navy font-display text-lg font-bold shadow-sm" aria-hidden>
            👋
          </div>
          <div className="leading-tight">
            <p className="font-display text-sm font-bold text-navy">{GUIDE_NAME} · your listing guide</p>
            <p className="text-xs text-muted">from {siteConfig.name}</p>
          </div>
        </div>
        <p className="hidden sm:block text-[11px] font-semibold uppercase tracking-wider text-muted whitespace-nowrap">
          {GUIDE_NAME} is helping you · step {screen + 1} of {screens.length}
        </p>
      </div>

      {/* Soft dot progress row (gentle, not a harsh bar) */}
      <div className="flex items-center gap-1.5 mb-8" aria-hidden>
        {screens.map((s, i) => (
          <span
            key={s.id}
            className={`h-2 rounded-full transition-all duration-300 ${
              i === screen ? "w-6 bg-gold" : i < screen ? "w-2 bg-gold/60" : "w-2 bg-cream-dark"
            }`}
          />
        ))}
      </div>

      <div className="min-h-[440px] flex flex-col">
        <div className="mb-8">
          <p className="text-sm font-semibold text-gold mb-2">{persona}</p>
          <h3 className="font-display text-2xl sm:text-3xl font-bold text-navy leading-tight">{heading}</h3>
          {helper && <p className="text-sm text-muted mt-2">{helper}</p>}
        </div>

        <div className="flex-1">{currentScreen.render()}</div>
      </div>

      {serverError && <div className="mt-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700" role="alert">{serverError}</div>}

      {/* Navigation */}
      <div className={`flex mt-8 pt-6 border-t border-cream-dark items-center gap-3 ${screen > 0 && !isDecision ? "justify-between" : "justify-end"}`}>
        {screen > 0 && !isDecision && (
          <button type="button" onClick={() => setScreen((s) => s - 1)} className="inline-flex items-center gap-2 text-sm font-semibold text-muted hover:text-navy transition-colors">
            <ArrowLeft className="h-4 w-4" /> Back
          </button>
        )}

        {isDetails ? (
          <div className="flex items-center gap-4">
            <button type="button" onClick={completeLater} disabled={isSubmitting} className="text-sm font-semibold text-muted hover:text-navy transition-colors disabled:opacity-50">
              I&apos;ll finish later
            </button>
            <Button type="button" variant="primary" size="lg" disabled={isSubmitting} onClick={finishNow}>
              {isSubmitting ? "Submitting…" : "Finish & Submit"}
            </Button>
          </div>
        ) : !isDecision ? (
          <button type="button" onClick={goNext} className="inline-flex items-center gap-2 rounded-xl bg-navy px-6 py-3 text-sm font-semibold text-white hover:bg-navy/90 transition-colors">
            {screen === 7 ? "Place order" : "Next"} <ArrowRight className="h-4 w-4" />
          </button>
        ) : null}
      </div>
    </form>
  );
}
