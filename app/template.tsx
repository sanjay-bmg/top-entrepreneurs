"use client";

import { motion } from "framer-motion";

/**
 * Wraps each route's page. Next.js re-mounts a template on every navigation,
 * so this gives a smooth fade/rise transition between pages. Header and Footer
 * live in layout.tsx and stay put.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
