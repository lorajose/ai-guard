"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

export default function Logo() {
  return (
    <Link href="/" className="inline-flex items-center gap-3">
      <motion.div
        initial={{ rotate: 0 }}
        whileHover={{ rotate: 3, scale: 1.03 }}
        transition={{ type: "spring", stiffness: 200, damping: 10 }}
        className="h-8 w-8"
      >
        <Image
          src="/logo-icon.svg"
          alt="AI Guard"
          width={32}
          height={32}
          priority
        />
      </motion.div>
      <motion.span
        initial={{ opacity: 0, x: -6 }}
        animate={{ opacity: 1, x: 0 }}
        className="text-white font-extrabold tracking-tight"
      >
        AI{" "}
        <span className="bg-gradient-to-r from-amber-300 to-orange-500 bg-clip-text text-transparent">
          Guard
        </span>
      </motion.span>
    </Link>
  );
}
