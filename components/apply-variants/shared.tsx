"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import type { DefaultValues } from "react-hook-form";
import { getTrafficSource } from "@/components/TrafficSourceTracker";
import type { ApplyFormData } from "@/lib/schema";

/* ---- Input formatters (shared by every variant) ---- */

export const formatPhone = (val: string) => {
  const digits = val.replace(/\D/g, "");
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
};

export const formatCC = (val: string) => {
  const digits = val.replace(/\D/g, "");
  return digits.replace(/(\d{4})(?=\d)/g, "$1 ");
};

export const formatExpiry = (val: string) => {
  const digits = val.replace(/\D/g, "");
  if (digits.length >= 3) return `${digits.slice(0, 2)}/${digits.slice(2, 4)}`;
  return digits;
};

/** Default form values shared by every bake-off variant. */
export function defaultApplyValues(variant: string): DefaultValues<ApplyFormData> {
  return {
    type: "apply",
    variant,
    completeLater: false,
    industries: [],
    owners: [],
    locations: [{ city: "", state: "" }],
    featuredPlacement: false,
    excludedFeatured: [],
    assetPermission: undefined,
  };
}

/** POST a completed application to the shared /api/apply endpoint. */
export function useApplySubmit() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);

  const submitApply = useCallback(
    async (data: ApplyFormData, takenCities: string[] = []): Promise<boolean> => {
      setServerError(null);
      try {
        // Never charge for a Top Spot that's already claimed — treat taken
        // cities as opted out.
        const excludedFeatured = data.featuredPlacement
          ? [...new Set([...(data.excludedFeatured ?? []), ...takenCities])]
          : [];
        const res = await fetch("/api/apply", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-traffic-source": getTrafficSource(),
            "x-landing-page": window.location.pathname,
          },
          body: JSON.stringify({ ...data, excludedFeatured }),
        });
        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          setServerError(body.error ?? "Something went wrong. Please try again.");
          return false;
        }
        router.push(data.completeLater ? "/apply/thanks?pending=1" : "/apply/thanks");
        return true;
      } catch {
        setServerError("Network error. Please check your connection and try again.");
        return false;
      }
    },
    [router],
  );

  return { submitApply, serverError, setServerError };
}

/** Look up which of the given cities already have their single Top Spot claimed. */
export function useFeaturedAvailability(
  locations: { city: string; state: string }[] | undefined,
  enabled: boolean,
) {
  const [takenCities, setTakenCities] = useState<string[]>([]);

  const checkAvailability = useCallback(async (city: string, state: string) => {
    if (!city || !state) return;
    try {
      const params = new URLSearchParams({ city, state });
      const res = await fetch(`/api/cities/availability?${params}`);
      const data = await res.json();
      const key = `${city}|${state}`;
      setTakenCities((prev) => {
        const without = prev.filter((k) => k !== key);
        return data.featuredTaken ? [...without, key] : without;
      });
    } catch {
      // Fail open — never block the form on an availability check.
    }
  }, []);

  const locationsKey = (locations ?? []).map((l) => `${l.city}|${l.state}`).join(",");

  useEffect(() => {
    if (!enabled) {
      setTakenCities([]);
      return;
    }
    (locations ?? []).forEach((loc) => {
      if (loc.city && loc.state) checkAvailability(loc.city, loc.state);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, locationsKey]);

  return { takenCities, checkAvailability };
}
