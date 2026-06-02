"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, Phone, X } from "lucide-react";
import Container from "./Container";
import Button from "./Button";
import Wordmark from "./Wordmark";
import { siteConfig } from "@/site.config";

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-navy border-b border-navy-light shadow-lg">
      <Container>
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Wordmark className="text-lg sm:text-xl" />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6" aria-label="Main navigation">
            {siteConfig.nav.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-white/80 hover:text-gold transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-3">
            <a
              href={siteConfig.phoneHref}
              className="inline-flex items-center gap-2 text-sm font-medium text-white/80 hover:text-gold transition-colors"
            >
              <Phone className="h-4 w-4" />
              {siteConfig.phone}
            </a>
            <Button href="/apply" variant="primary" size="sm">
              Get Listed
            </Button>
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden text-white hover:text-gold transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle navigation"
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </Container>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-navy-light bg-navy-dark">
          <Container>
            <nav className="py-4 flex flex-col gap-3" aria-label="Mobile navigation">
              {siteConfig.nav.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-base font-medium text-white/80 hover:text-gold transition-colors py-1"
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-2 flex flex-col gap-3">
                <a
                  href={siteConfig.phoneHref}
                  className="inline-flex items-center gap-2 text-base font-medium text-white/80 hover:text-gold transition-colors py-1"
                >
                  <Phone className="h-5 w-5" />
                  {siteConfig.phone}
                </a>
                <Button
                  href="/apply"
                  variant="primary"
                  size="md"
                  className="w-full"
                  onClick={() => setMobileOpen(false)}
                >
                  Get Listed
                </Button>
              </div>
            </nav>
          </Container>
        </div>
      )}
    </header>
  );
}
