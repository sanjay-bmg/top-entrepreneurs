"use client";

import { useState, useRef, useEffect, useId } from "react";
import { getCitiesForState } from "@/content/cities";
import { ChevronDown, X } from "lucide-react";

interface Props {
  state: string;
  value: string;
  onChange: (city: string) => void;
  error?: string;
  placeholder?: string;
}

export default function CityCombobox({ state, value, onChange, error, placeholder = "Type to search…" }: Props) {
  const [query, setQuery] = useState(value);
  const [open, setOpen] = useState(false);
  const id = useId();
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const cities = state ? getCitiesForState(state) : [];
  const filtered = query.length >= 1
    ? cities.filter(c => c.toLowerCase().startsWith(query.toLowerCase())).slice(0, 50)
    : cities.slice(0, 50);

  // Sync external value changes (e.g. reset)
  useEffect(() => {
    setQuery(value);
  }, [value]);

  // Clear city when state changes
  useEffect(() => {
    setQuery("");
    onChange("");
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  // Close on outside click
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        // If the user typed something but didn't select, revert to last valid value
        if (query !== value) setQuery(value);
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [query, value]);

  function select(city: string) {
    onChange(city);
    setQuery(city);
    setOpen(false);
  }

  function clear() {
    onChange("");
    setQuery("");
    inputRef.current?.focus();
  }

  const disabled = !state;

  return (
    <div ref={containerRef} className="relative">
      <div className={`flex items-center rounded-lg border bg-white px-3 py-2 gap-2 transition-colors ${
        error
          ? "border-red-400 ring-1 ring-red-400"
          : open
          ? "border-gold ring-1 ring-gold"
          : "border-cream-dark"
      } ${disabled ? "opacity-50 cursor-not-allowed bg-cream" : ""}`}>
        <input
          ref={inputRef}
          id={id}
          type="text"
          role="combobox"
          aria-expanded={open}
          aria-autocomplete="list"
          aria-controls={`${id}-listbox`}
          value={query}
          disabled={disabled}
          placeholder={disabled ? "Select a state first" : placeholder}
          className="flex-1 bg-transparent text-sm text-navy placeholder:text-muted outline-none disabled:cursor-not-allowed"
          onChange={e => {
            setQuery(e.target.value);
            onChange(""); // clear confirmed value while typing
            setOpen(true);
          }}
          onFocus={() => { if (!disabled) setOpen(true); }}
          onKeyDown={e => {
            if (e.key === "Escape") { setOpen(false); setQuery(value); }
            if (e.key === "Enter" && filtered.length > 0) { e.preventDefault(); select(filtered[0]); }
          }}
        />
        {value && (
          <button type="button" onClick={clear} className="text-muted hover:text-navy transition-colors" tabIndex={-1}>
            <X className="h-3.5 w-3.5" />
          </button>
        )}
        <ChevronDown className={`h-4 w-4 text-muted flex-shrink-0 transition-transform ${open ? "rotate-180" : ""}`} />
      </div>

      {open && !disabled && filtered.length > 0 && (
        <ul
          id={`${id}-listbox`}
          role="listbox"
          className="absolute z-50 mt-1 w-full max-h-56 overflow-auto rounded-lg border border-cream-dark bg-white shadow-lg py-1"
        >
          {filtered.map(city => (
            <li
              key={city}
              role="option"
              aria-selected={city === value}
              onMouseDown={e => { e.preventDefault(); select(city); }}
              className={`px-3 py-2 text-sm cursor-pointer transition-colors ${
                city === value
                  ? "bg-gold/10 text-navy font-medium"
                  : "text-navy hover:bg-cream"
              }`}
            >
              {city}
            </li>
          ))}
        </ul>
      )}

      {open && !disabled && filtered.length === 0 && query.length >= 1 && (
        <div className="absolute z-50 mt-1 w-full rounded-lg border border-cream-dark bg-white shadow-lg py-3 px-3 text-sm text-muted">
          No cities found for &ldquo;{query}&rdquo;
        </div>
      )}
    </div>
  );
}
