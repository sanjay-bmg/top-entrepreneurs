"use client";

import { useRouter } from "next/navigation";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useRef } from "react";
import { ChevronRight, ChevronLeft, Check, Plus, Trash2 } from "lucide-react";
import { applySchema, type ApplyFormData } from "@/lib/schema";
import { FormField, Input, Textarea, Select } from "./FormField";
import IndustryMultiSelect from "./IndustryMultiSelect";
import CityCombobox from "./CityCombobox";
import { getTrafficSource } from "./TrafficSourceTracker";
import PricingEstimate from "./PricingEstimate";
import Button from "./Button";
import { US_STATES } from "@/content/states";
import { siteConfig } from "@/site.config";

const STEPS = [
  { number: 1, label: "Business Details" },
  { number: 2, label: "Contact Info" },
  { number: 3, label: "Industries & Cities" },
  { number: 4, label: "Billing" },
] as const;

const STEP_FIELDS: Record<number, (keyof ApplyFormData)[]> = {
  1: ["businessName", "businessPhone", "assetPermission", "owners"],
  2: ["contactFirstName", "contactLastName", "email", "contactPhone", "awardShippingAddress", "awardShippingCity", "awardShippingState", "awardShippingZip"],
  3: ["locations", "industries"],
  4: ["cardNumber", "cardExpiry", "cardCvv", "cardName", "billingAddress", "billingCity", "billingState", "billingZip", "consentToTerms"],
};

const formatPhone = (val: string) => {
  const digits = val.replace(/\D/g, "");
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
};

const formatCC = (val: string) => {
  const digits = val.replace(/\D/g, "");
  return digits.replace(/(\d{4})(?=\d)/g, "$1 ");
};

const formatExpiry = (val: string) => {
  const digits = val.replace(/\D/g, "");
  if (digits.length >= 3) return `${digits.slice(0, 2)}/${digits.slice(2, 4)}`;
  return digits;
};

function StepIndicator({ current }: { current: number }) {
  return (
    <div className="flex items-center gap-0 mb-10">
      {STEPS.map((step, i) => {
        const done = step.number < current;
        const active = step.number === current;
        return (
          <div key={step.number} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center">
              <div
                className={`flex h-9 w-9 items-center justify-center rounded-full border-2 text-sm font-bold transition-colors
                  ${done ? "bg-gold border-gold text-white" : active ? "bg-navy border-navy text-white" : "bg-white border-cream-dark text-muted"}`}
              >
                {done ? <Check className="h-4 w-4" /> : step.number}
              </div>
              <span className={`mt-1.5 text-[10px] font-semibold uppercase tracking-wider whitespace-nowrap hidden sm:block
                ${active ? "text-navy" : done ? "text-gold" : "text-muted"}`}>
                {step.label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={`flex-1 h-0.5 mx-2 mt-[-14px] sm:mt-[-20px] transition-colors ${done ? "bg-gold" : "bg-cream-dark"}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}


export default function ApplyForm() {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [step, setStep] = useState(1);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    watch,
    trigger,
    formState: { errors, isSubmitting },
  } = useForm<ApplyFormData>({
    resolver: zodResolver(applySchema),
    defaultValues: {
      type: "apply",
      industries: [],
      assetPermission: undefined,
      owners: [],
      locations: [{ city: "", state: "" }],
    },
    mode: "onTouched",
  });

  const watchedIndustries = watch("industries");
  const watchedLocations = watch("locations");

  const { fields: ownerFields, append: appendOwner, remove: removeOwner } = useFieldArray({
    control,
    name: "owners",
  });

  const { fields: locationFields, append: appendLocation, remove: removeLocation } = useFieldArray({
    control,
    name: "locations",
  });


  async function goNext() {
    const valid = await trigger(STEP_FIELDS[step]);
    if (valid) {
      setStep((s) => s + 1);
      formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      setTimeout(() => {
        const firstErrorElement = document.querySelector('[aria-invalid="true"]');
        if (firstErrorElement) {
          firstErrorElement.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }, 50);
    }
  }

  function goBack() {
    setStep((s) => s - 1);
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  async function onSubmit(data: ApplyFormData) {
    setServerError(null);
    try {
      const payload: ApplyFormData = { ...data };
      const res = await fetch("/api/apply", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-traffic-source": getTrafficSource(),
          "x-landing-page": window.location.pathname,
        },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        setServerError(body.error ?? "Something went wrong. Please try again.");
        return;
      }
      router.push("/apply/thanks");
    } catch {
      setServerError("Network error. Please check your connection and try again.");
    }
    setTimeout(() => {
      const firstErrorElement = document.querySelector('[aria-invalid="true"]');
      if (firstErrorElement) {
        firstErrorElement.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }, 50);
  }

  const validLocations = watchedLocations?.filter((l) => l.city && l.state) ?? [];

  return (
    <form ref={formRef} onSubmit={handleSubmit(onSubmit)} noValidate>
      {/* Honeypot */}
      <input
        type="text"
        aria-hidden
        tabIndex={-1}
        className="absolute opacity-0 h-0 w-0 pointer-events-none"
        {...register("_honeypot")}
      />

      <StepIndicator current={step} />

      {/* Step 1: Business Details */}
      {step === 1 && (
        <div className="space-y-6">
          <div>
            <h2 className="font-display text-2xl font-bold text-navy mb-1">Business Details</h2>
            <p className="text-sm text-muted">Tell us about your business.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <FormField label="Business Name" required error={errors.businessName?.message} className="sm:col-span-2">
              <Input {...register("businessName")} error={errors.businessName?.message} placeholder="e.g. Halebrook Capital" />
            </FormField>

            <FormField label="Website" error={errors.website?.message} hint="Optional">
              <Input {...register("website")} error={errors.website?.message} type="url" placeholder="https://yourbusiness.com" />
            </FormField>

            <FormField label="Business Phone" required error={errors.businessPhone?.message}>
              <Input
                {...register("businessPhone")}
                onChange={(e) => {
                  e.target.value = formatPhone(e.target.value);
                  register("businessPhone").onChange(e);
                }}
                error={errors.businessPhone?.message}
                type="tel"
                placeholder="(555) 000-0000"
              />
            </FormField>
          </div>

          <div className="space-y-4">
            <div>
              <p className="text-sm font-semibold text-navy">Founders &amp; Owners to List</p>
              <p className="text-sm text-muted">Optional. Add the founders or owners you want recognized, or skip and we&apos;ll collect these details later.</p>
            </div>
            {ownerFields.map((field, index) => (
              <div key={field.id} className="p-4 rounded-xl border border-cream-dark bg-cream relative">
                <button
                  type="button"
                  onClick={() => removeOwner(index)}
                  className="absolute top-4 right-4 text-muted hover:text-red-500 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4 pr-8">
                  <FormField label="Name" required error={errors.owners?.[index]?.name?.message}>
                    <Input {...register(`owners.${index}.name` as const)} placeholder="e.g. Marcus Hale" error={errors.owners?.[index]?.name?.message} />
                  </FormField>
                  <FormField label="Title / Role" hint="Optional" error={errors.owners?.[index]?.title?.message}>
                    <Input {...register(`owners.${index}.title` as const)} placeholder="e.g. Founder & CEO" error={errors.owners?.[index]?.title?.message} />
                  </FormField>
                </div>
                <FormField label="Bio / Accolades" hint="Optional" error={errors.owners?.[index]?.description?.message}>
                  <Textarea {...register(`owners.${index}.description` as const)} placeholder="A few words about this person, their achievements, or what customers say about them..." rows={2} />
                </FormField>
              </div>
            ))}
            <button
              type="button"
              onClick={() => appendOwner({ name: "", title: "", description: "" })}
              className="inline-flex items-center gap-2 text-sm font-semibold text-gold hover:text-gold-dark transition-colors"
            >
              <Plus className="h-4 w-4" />
              Add Person
            </button>
          </div>

          <fieldset className="space-y-3">
            <legend className="text-sm font-semibold text-navy mb-2">
              Website Assets <span className="text-red-500 ml-0.5">*</span>
            </legend>
            <p className="text-sm text-muted -mt-1 mb-3">
              May we use photos, logos, and bio content from your website for your listing?
            </p>
            {errors.assetPermission?.message && (
              <p className="text-xs text-red-600">{errors.assetPermission.message}</p>
            )}
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
        </div>
      )}

      {/* Step 3: Industries & Cities */}
      {step === 3 && (
        <div className="space-y-6">
          <div>
            <h2 className="font-display text-2xl font-bold text-navy mb-1">Industries &amp; Cities</h2>
            <p className="text-sm text-muted">Where you operate and what you do.</p>
          </div>

          {/* Locations */}
          <div className="space-y-3">
            <p className="text-sm font-semibold text-navy">
              Cities <span className="text-red-500">*</span>
            </p>
            <p className="text-sm text-muted">
              Add every city where your business operates. Select state first, then type to search your city.
            </p>
            {(errors.locations as { message?: string } | undefined)?.message && (
              <p className="text-xs text-red-600">{(errors.locations as { message?: string }).message}</p>
            )}

            <div className="space-y-3">
              {locationFields.map((field, index) => {
                const stateVal = watchedLocations?.[index]?.state ?? "";

                return (
                  <div key={field.id} className="p-4 rounded-xl border border-cream-dark bg-cream">
                    <div className="flex items-start gap-3">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 flex-1">
                        <FormField label="State" required error={errors.locations?.[index]?.state?.message}>
                          <Select
                            {...register(`locations.${index}.state` as const)}
                            error={errors.locations?.[index]?.state?.message}
                          >
                            <option value="">Select a state</option>
                            {US_STATES.map((s) => (
                              <option key={s.abbr} value={s.abbr}>{s.name}</option>
                            ))}
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
                                }}
                                error={errors.locations?.[index]?.city?.message}
                              />
                            )}
                          />
                        </FormField>
                      </div>

                      {locationFields.length > 1 && (
                        <button
                          type="button"
                          onClick={() => {
                            removeLocation(index);
                          }}
                          className="mt-6 text-muted hover:text-red-500 transition-colors flex-shrink-0"
                          aria-label="Remove city"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <button
              type="button"
              onClick={() => appendLocation({ city: "", state: "" })}
              className="inline-flex items-center gap-2 text-sm font-semibold text-gold hover:text-gold-dark transition-colors"
            >
              <Plus className="h-4 w-4" />
              Add another city
            </button>
          </div>

          {/* Industries */}
          <div className="space-y-3">
            <p className="text-sm font-semibold text-navy">
              Industries <span className="text-red-500">*</span>
            </p>
            <p className="text-sm text-muted">
              Select every industry your business serves. We list you in all of them — just $289/yr per city.
            </p>
            <Controller
              name="industries"
              control={control}
              render={({ field }) => (
                <IndustryMultiSelect
                  value={field.value}
                  onChange={field.onChange}
                  error={errors.industries?.message}
                />
              )}
            />
          </div>

          <PricingEstimate
            industries={watchedIndustries ?? []}
            cities={validLocations}
          />
        </div>
      )}

      {/* Step 2: Contact Info */}
      {step === 2 && (
        <div className="space-y-6">
          <div>
            <h2 className="font-display text-2xl font-bold text-navy mb-1">Contact Information</h2>
            <p className="text-sm text-muted">Who should we reach out to about this application?</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <FormField label="First Name" required error={errors.contactFirstName?.message}>
              <Input {...register("contactFirstName")} error={errors.contactFirstName?.message} placeholder="Jane" />
            </FormField>

            <FormField label="Last Name" required error={errors.contactLastName?.message}>
              <Input {...register("contactLastName")} error={errors.contactLastName?.message} placeholder="Doe" />
            </FormField>

            <FormField label="Email Address" required error={errors.email?.message} className="sm:col-span-2">
              <Input {...register("email")} error={errors.email?.message} type="email" placeholder="jane@yourbusiness.com" />
            </FormField>

            <FormField label="Phone" required error={errors.contactPhone?.message}>
              <Input
                {...register("contactPhone")}
                onChange={(e) => {
                  e.target.value = formatPhone(e.target.value);
                  register("contactPhone").onChange(e);
                }}
                error={errors.contactPhone?.message}
                type="tel"
                placeholder="(555) 000-0000"
              />
            </FormField>

            <FormField label="Title / Role" error={errors.contactTitle?.message} hint="Optional">
              <Input {...register("contactTitle")} placeholder="e.g. Founder & CEO" />
            </FormField>
          </div>

          <FormField label="Notes" error={errors.notes?.message} hint="Optional">
            <Textarea {...register("notes")} placeholder="Any questions, special requests, or context for our team…" />
          </FormField>

          <div className="pt-4 border-t border-cream-dark">
            <h3 className="text-sm font-semibold text-navy mb-1">Complimentary Award Delivery</h3>
            <p className="text-xs text-muted mb-4">Where should we ship your complimentary custom recognition award?</p>

            <div className="space-y-5">
              <FormField label="Street Address" required error={errors.awardShippingAddress?.message}>
                <Input {...register("awardShippingAddress")} error={errors.awardShippingAddress?.message} placeholder="123 Main St, Suite 400" autoComplete="street-address" />
              </FormField>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <FormField label="City" required error={errors.awardShippingCity?.message} className="sm:col-span-1">
                  <Input {...register("awardShippingCity")} error={errors.awardShippingCity?.message} placeholder="Austin" autoComplete="address-level2" />
                </FormField>
                <FormField label="State" required error={errors.awardShippingState?.message}>
                  <Select {...register("awardShippingState")} error={errors.awardShippingState?.message} autoComplete="address-level1">
                    <option value="">State</option>
                    {US_STATES.map((s) => (
                      <option key={s.abbr} value={s.abbr}>{s.abbr}</option>
                    ))}
                  </Select>
                </FormField>
                <FormField label="ZIP Code" required error={errors.awardShippingZip?.message}>
                  <Input {...register("awardShippingZip")} error={errors.awardShippingZip?.message} placeholder="78701" maxLength={10} inputMode="numeric" autoComplete="postal-code" />
                </FormField>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Step 4: Billing Details */}
      {step === 4 && (
        <div className="space-y-6">
          <div>
            <h2 className="font-display text-2xl font-bold text-navy mb-1">Billing Details</h2>
            <p className="text-sm text-muted">Securely provide your payment information to complete your application.</p>
          </div>

          <div className="rounded-xl border border-cream-dark bg-cream p-4 text-sm text-muted leading-relaxed">
            Your listing goes live at the October 2026 directory launch.
          </div>

          <div className="space-y-5">
            <FormField label="Card Number" required error={errors.cardNumber?.message}>
              <Input
                {...register("cardNumber")}
                error={errors.cardNumber?.message}
                placeholder="1234 5678 9012 3456"
                maxLength={25}
                inputMode="numeric"
                autoComplete="cc-number"
                onChange={(e) => {
                  e.target.value = formatCC(e.target.value);
                  register("cardNumber").onChange(e);
                }}
              />
            </FormField>

            <div className="grid grid-cols-2 gap-5">
              <FormField label="Expiry" required error={errors.cardExpiry?.message} hint="MM/YY">
                <Input
                  {...register("cardExpiry")}
                  error={errors.cardExpiry?.message}
                  placeholder="MM/YY"
                  maxLength={5}
                  inputMode="numeric"
                  autoComplete="cc-exp"
                  onChange={(e) => {
                    e.target.value = formatExpiry(e.target.value);
                    register("cardExpiry").onChange(e);
                  }}
                />
              </FormField>

              <FormField label="CVV" required error={errors.cardCvv?.message}>
                <Input
                  {...register("cardCvv")}
                  error={errors.cardCvv?.message}
                  placeholder="123"
                  maxLength={4}
                  inputMode="numeric"
                  autoComplete="cc-csc"
                />
              </FormField>
            </div>

            <FormField label="Name on Card" required error={errors.cardName?.message}>
              <Input
                {...register("cardName")}
                error={errors.cardName?.message}
                placeholder="Jane Doe"
                autoComplete="cc-name"
              />
            </FormField>
          </div>

          <div className="pt-2 border-t border-cream-dark">
            <p className="text-xs font-semibold text-navy uppercase tracking-wider mb-4">Billing Address</p>
            <div className="space-y-5">
              <FormField label="Street Address" required error={errors.billingAddress?.message}>
                <Input
                  {...register("billingAddress")}
                  error={errors.billingAddress?.message}
                  placeholder="123 Main St, Suite 400"
                  autoComplete="billing street-address"
                />
              </FormField>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <FormField label="City" required error={errors.billingCity?.message} className="sm:col-span-1">
                  <Input {...register("billingCity")} error={errors.billingCity?.message} placeholder="Austin" autoComplete="billing address-level2" />
                </FormField>

                <FormField label="State" required error={errors.billingState?.message}>
                  <Select {...register("billingState")} error={errors.billingState?.message} autoComplete="billing address-level1">
                    <option value="">State</option>
                    {US_STATES.map((s) => (
                      <option key={s.abbr} value={s.abbr}>{s.abbr}</option>
                    ))}
                  </Select>
                </FormField>

                <FormField label="ZIP Code" required error={errors.billingZip?.message}>
                  <Input
                    {...register("billingZip")}
                    error={errors.billingZip?.message}
                    placeholder="78701"
                    maxLength={10}
                    inputMode="numeric"
                    autoComplete="billing postal-code"
                  />
                </FormField>
              </div>
            </div>
          </div>

          <div className="space-y-1 pt-2">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                {...register("consentToTerms")}
                className="mt-0.5 h-4 w-4 rounded accent-gold flex-shrink-0"
              />
              <span className="text-sm text-muted leading-snug">
                I agree to the{" "}
                <a href="/terms" target="_blank" className="text-gold hover:text-gold-dark underline">Terms of Service</a>{" "}
                and{" "}
                <a href="/privacy" target="_blank" className="text-gold hover:text-gold-dark underline">Privacy Policy</a>,
                consent to being contacted by the {siteConfig.name} team regarding my listing, and agree to receive marketing communications via email or SMS. Reply STOP to opt out at any time.
              </span>
            </label>
            {errors.consentToTerms && (
              <p className="text-xs text-red-600 pl-7">{errors.consentToTerms.message}</p>
            )}
          </div>

          {serverError && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700" role="alert">
              {serverError}
            </div>
          )}
        </div>
      )}

      {/* Navigation */}
      <div className={`flex mt-8 pt-6 border-t border-cream-dark ${step > 1 ? "justify-between" : "justify-end"}`}>
        {step > 1 && (
          <button
            type="button"
            onClick={goBack}
            className="inline-flex items-center gap-2 text-sm font-semibold text-muted hover:text-navy transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
            Back
          </button>
        )}

        {step < 4 ? (
          <button
            type="button"
            onClick={goNext}
            className="inline-flex items-center gap-2 rounded-xl bg-navy px-6 py-3 text-sm font-semibold text-white hover:bg-navy/90 transition-colors"
          >
            Continue
            <ChevronRight className="h-4 w-4" />
          </button>
        ) : (
          <Button
            type="submit"
            variant="primary"
            size="lg"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting…" : "Submit Application"}
          </Button>
        )}
      </div>
    </form>
  );
}
