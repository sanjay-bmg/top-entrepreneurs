"use client";

import { useForm, Controller, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Trash2, Zap } from "lucide-react";
import { applySchema, type ApplyFormData } from "@/lib/schema";
import { FormField, Input, Select } from "@/components/FormField";
import CityCombobox from "@/components/CityCombobox";
import { calculateQuote, formatCurrency, PRICING } from "@/lib/pricing";
import Button from "@/components/Button";
import { US_STATES } from "@/content/states";
import FeaturedCityPicker from "./FeaturedCityPicker";
import {
  formatPhone,
  formatCC,
  formatExpiry,
  defaultApplyValues,
  useApplySubmit,
  useFeaturedAvailability,
} from "./shared";

export default function VariantExpress() {
  const { submitApply, serverError } = useApplySubmit();

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ApplyFormData>({
    resolver: zodResolver(applySchema),
    defaultValues: { ...defaultApplyValues("express"), completeLater: true },
    mode: "onTouched",
  });

  const watchedLocations = watch("locations");
  const watchedFeatured = watch("featuredPlacement");
  const watchedExcluded = watch("excludedFeatured");

  const { takenCities, checkAvailability } = useFeaturedAvailability(watchedLocations, !!watchedFeatured);

  const { fields: locationFields, append: appendLocation, remove: removeLocation } = useFieldArray({
    control,
    name: "locations",
  });

  function toggleFeaturedSlot(key: string) {
    const current = watchedExcluded ?? [];
    setValue("excludedFeatured", current.includes(key) ? current.filter((k) => k !== key) : [...current, key]);
  }

  const validLocations = watchedLocations?.filter((l) => l.city && l.state) ?? [];
  const orderTotal = calculateQuote({
    industries: [],
    cities: validLocations,
    featured: !!watchedFeatured,
    excludedFeatured: [...new Set([...(watchedExcluded ?? []), ...takenCities])],
  }).total;

  async function onSubmit(data: ApplyFormData) {
    await submitApply(data, takenCities);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <input type="text" aria-hidden tabIndex={-1} className="absolute opacity-0 h-0 w-0 pointer-events-none" {...register("_honeypot")} />

      <div className="rounded-xl border border-cream-dark bg-white p-6 sm:p-8 space-y-6">
        {/* Intro */}
        <div className="flex items-start gap-3">
          <span className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-full bg-gold/10 text-gold flex-shrink-0">
            <Zap className="h-5 w-5" />
          </span>
          <div>
            <h3 className="font-display text-2xl font-bold text-navy">Reserve your spot in 60 seconds</h3>
            <p className="text-sm text-muted mt-1 leading-relaxed">
              Short on time? This is all we need to lock in your listing. Our team will email you to finish the details.
            </p>
          </div>
        </div>

        {/* Business name */}
        <FormField label="Business Name" required error={errors.businessName?.message}>
          <Input {...register("businessName")} error={errors.businessName?.message} placeholder="e.g. Halebrook Capital" />
        </FormField>

        {/* Name */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <FormField label="First Name" required error={errors.contactFirstName?.message}>
            <Input {...register("contactFirstName")} error={errors.contactFirstName?.message} placeholder="Jane" />
          </FormField>
          <FormField label="Last Name" required error={errors.contactLastName?.message}>
            <Input {...register("contactLastName")} error={errors.contactLastName?.message} placeholder="Doe" />
          </FormField>
        </div>

        {/* Contact */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
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

        {/* Top Spot */}
        <label className={`flex items-start gap-4 p-5 rounded-xl border-2 cursor-pointer transition-colors ${watchedFeatured ? "border-gold bg-gold/5" : "border-gold/40 bg-white hover:border-gold/70"}`}>
          <input type="checkbox" {...register("featuredPlacement")} className="mt-1 h-5 w-5 rounded accent-gold flex-shrink-0" />
          <div>
            <p className="font-display font-bold text-navy text-lg">Claim my city&apos;s Top Spot — +{formatCurrency(PRICING.featuredCity)}/city</p>
            <p className="text-sm text-muted mt-1 leading-relaxed">Only one business per city. Sold first-come.</p>
          </div>
        </label>

        {/* Per-city Top Spot picker */}
        {watchedFeatured && validLocations.length > 0 && (
          <FeaturedCityPicker
            cities={validLocations}
            excludedFeatured={watchedExcluded ?? []}
            takenCities={takenCities}
            onToggle={toggleFeaturedSlot}
          />
        )}

        {/* Live order total */}
        <div className="rounded-xl border border-gold/30 bg-navy/5 p-4">
          <div className="flex justify-between items-center">
            <span className="font-semibold text-navy">Order total</span>
            <span className="font-display text-2xl font-bold text-gold">{formatCurrency(orderTotal)}</span>
          </div>
          {watchedFeatured && takenCities.length > 0 && (
            <p className="text-xs text-muted mt-2">The Top Spot is already claimed in one or more of your cities — you won&apos;t be charged for those.</p>
          )}
        </div>

        {/* Payment */}
        <div className="pt-2 border-t border-cream-dark">
          <p className="text-xs font-semibold text-navy uppercase tracking-wider mb-4">Payment</p>
          <div className="space-y-5">
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
          </div>
        </div>

        {/* Billing */}
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

        {/* Consent */}
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

        {serverError && <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700" role="alert">{serverError}</div>}

        {/* Submit */}
        <Button type="submit" variant="primary" size="lg" disabled={isSubmitting} className="w-full">
          {isSubmitting ? "Submitting…" : "Place My Order →"}
        </Button>
      </div>
    </form>
  );
}
