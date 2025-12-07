"use client";
import { motion } from "framer-motion";
import Link from "next/link";

export default function ShinyButton({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
      <Link
        href={href}
        className="relative inline-flex items-center justify-center rounded-xl px-6 py-3 font-semibold text-white bg-black overflow-hidden"
      >
        <span className="absolute inset-0 -translate-x-full bg-white/20 [mask-image:linear-gradient(90deg,transparent,white,transparent)] animate-[shimmer_2s_infinite]" />
        <span className="relative">{children}</span>
      </Link>
    </motion.div>
  );
}
