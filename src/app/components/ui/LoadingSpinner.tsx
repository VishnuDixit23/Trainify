"use client";

import { motion } from "framer-motion";

interface LoadingSpinnerProps {
  message?: string;
  fullScreen?: boolean;
}

export default function LoadingSpinner({
  message = "Loading...",
  fullScreen = true,
}: LoadingSpinnerProps) {
  const content = (
    <div className="flex flex-col items-center gap-6">
      {/* Animated ring */}
      <div className="relative w-16 h-16">
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-brand-500/20"
          style={{ borderTopColor: "rgb(181 130 30)" }}
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
        />
        <motion.div
          className="absolute inset-1 rounded-full border-2 border-transparent"
          style={{ borderBottomColor: "rgb(196 150 40 / 0.5)" }}
          animate={{ rotate: -360 }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
        />
        <div className="absolute inset-3 rounded-full bg-brand-500/10 animate-pulse-glow" />
      </div>

      {/* Text */}
      <motion.p
        className="text-sm font-medium tracking-widest uppercase text-surface-400"
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
      >
        {message}
      </motion.p>
    </div>
  );

  if (fullScreen) {
    return (
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-surface-950/90 backdrop-blur-md"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        {content}
      </motion.div>
    );
  }

  return (
    <div className="flex items-center justify-center py-20">{content}</div>
  );
}
