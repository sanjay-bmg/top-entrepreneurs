import Link from "next/link";
import { Phone } from "lucide-react";
import Container from "./Container";
import Wordmark from "./Wordmark";
import { siteConfig } from "@/site.config";

export default function Footer() {
  return (
    <footer className="bg-navy-dark text-white/70">
      <Container>
        <div className="py-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href="/" className="inline-flex mb-5">
              <Wordmark className="text-lg" />
            </Link>
            <a
              href={siteConfig.phoneHref}
              className="inline-flex items-center gap-2.5 rounded-lg border border-gold/40 bg-gold/10 px-4 py-2.5 text-sm font-semibold text-gold hover:bg-gold/20 hover:border-gold/60 transition-colors"
            >
              <Phone className="h-4 w-4" />
              {siteConfig.phone}
            </a>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-xs font-semibold text-white uppercase tracking-widest mb-4">
              Company
            </h3>
            <ul className="space-y-2">
              {siteConfig.footer.company.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/60 hover:text-gold transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* For Entrepreneurs */}
          <div>
            <h3 className="text-xs font-semibold text-white uppercase tracking-widest mb-4 text-center">
              For Entrepreneurs
            </h3>
            <ul className="grid grid-cols-2 gap-x-6 gap-y-2 text-center">
              {siteConfig.footer.forMembers.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/60 hover:text-gold transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/40">
          <p>&copy; {new Date().getFullYear()} {siteConfig.name}. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="/privacy" className="hover:text-gold transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-gold transition-colors">Terms of Service</Link>
          </div>
        </div>
      </Container>
    </footer>
  );
}
