"use client";

import { useState, useMemo } from "react";
import { Search, X } from "lucide-react";
import { clsx } from "clsx";
import { industryGroups } from "@/content/industries";

interface IndustryMultiSelectProps {
  value: string[];
  onChange: (industries: string[]) => void;
  error?: string;
}

export default function IndustryMultiSelect({
  value,
  onChange,
  error,
}: IndustryMultiSelectProps) {
  const [query, setQuery] = useState("");

  const filteredGroups = useMemo(() => {
    if (!query.trim()) return industryGroups;
    const q = query.toLowerCase();
    return industryGroups.filter(
      (g) =>
        g.category.toLowerCase().includes(q) ||
        g.includes.some((s) => s.toLowerCase().includes(q)),
    );
  }, [query]);

  function toggle(category: string) {
    if (value.includes(category)) {
      onChange(value.filter((a) => a !== category));
    } else {
      onChange([...value, category]);
    }
  }

  function remove(category: string) {
    onChange(value.filter((a) => a !== category));
  }

  return (
    <div className="flex flex-col gap-2">
      {/* Selected chips */}
      {value.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {value.map((category, i) => (
            <span
              key={category}
              className={clsx(
                "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium",
                i === 0
                  ? "bg-gold text-white"
                  : "bg-navy/10 text-navy border border-navy/20",
              )}
            >
              {i === 0 && <span className="opacity-70">Primary</span>}
              {category}
              <button
                type="button"
                onClick={() => remove(category)}
                className="hover:opacity-70 transition-opacity"
                aria-label={`Remove ${category}`}
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Search input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted pointer-events-none" />
        <input
          type="text"
          placeholder="Search categories…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className={clsx(
            "w-full rounded-lg border bg-white pl-10 pr-4 py-3 text-sm placeholder-muted/60 transition-colors focus:outline-none focus:ring-2 focus:ring-gold focus:border-gold",
            error ? "border-red-400" : "border-cream-dark hover:border-gold/50",
          )}
        />
      </div>

      {/* Scrollable list */}
      <div
        className={clsx(
          "rounded-lg border max-h-64 overflow-y-auto",
          error ? "border-red-400" : "border-cream-dark",
        )}
      >
        {filteredGroups.length === 0 && (
          <p className="px-4 py-3 text-sm text-muted text-center">
            No categories match your search.
          </p>
        )}
        {filteredGroups.map((group) => {
          const selected = value.includes(group.category);
          const index = value.indexOf(group.category);
          return (
            <label
              key={group.category}
              className={clsx(
                "flex items-start gap-3 px-4 py-3 cursor-pointer transition-colors border-b border-cream-dark last:border-b-0",
                selected ? "bg-gold/5" : "hover:bg-cream",
              )}
            >
              <input
                type="checkbox"
                checked={selected}
                onChange={() => toggle(group.category)}
                className="mt-0.5 h-4 w-4 rounded border-cream-dark accent-gold flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span
                    className={clsx(
                      "text-sm font-medium",
                      selected ? "text-navy" : "text-dark",
                    )}
                  >
                    {group.category}
                  </span>
                  {selected && index === 0 && (
                    <span className="text-[10px] font-semibold text-gold uppercase">
                      Primary
                    </span>
                  )}
                </div>
                <p className="text-[10px] text-muted mt-0.5 leading-relaxed">
                  {group.includes.slice(0, 5).join(", ")}
                  {group.includes.length > 5 && <span> &amp; more</span>}
                </p>
              </div>
            </label>
          );
        })}
      </div>

      {error && (
        <p className="text-xs text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
