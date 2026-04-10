"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  delay?: number;
  padding?: string;
}

export default function GlassCard({
  children,
  className = "",
  hover = true,
  delay = 0,
  padding = "p-6",
}: GlassCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
      whileHover={
        hover
          ? {
              y: -4,
              transition: { duration: 0.25 },
            }
          : undefined
      }
      className={`
        glass rounded-2xl ${padding}
        transition-all duration-300
        ${hover ? "hover:shadow-[0_8px_40px_-12px_rgba(181,130,30,0.1)] cursor-pointer" : ""}
        ${className}
      `}
    >
      {children}
    </motion.div>
  );
}
