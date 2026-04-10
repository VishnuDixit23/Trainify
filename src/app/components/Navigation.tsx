"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Zap } from "lucide-react";

interface NavigationProps {
  variant?: "landing" | "app";
  user?: { name: string; email: string } | null;
}

export default function Navigation({ variant = "landing", user }: NavigationProps) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    section?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  const navLinks =
    variant === "landing"
      ? [
          { label: "Features", action: () => handleNavClick("features") },
          { label: "How It Works", action: () => handleNavClick("how-it-works") },
          { label: "Testimonials", action: () => handleNavClick("testimonials") },
        ]
      : [
          { label: "Workouts", action: () => handleNavClick("our-services") },
          { label: "Diet Plans", action: () => handleNavClick("our-services") },
          { label: "Progress", action: () => handleNavClick("our-services") },
        ];

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "py-3 bg-surface-950/70 backdrop-blur-xl border-b border-white/5"
          : "py-5 bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <Link href={variant === "app" ? "/dashboard" : "/"} className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center shadow-lg shadow-brand-500/20 group-hover:shadow-brand-500/40 transition-shadow duration-300">
            <Zap size={18} className="text-black" />
          </div>
          <span className="text-xl font-bold text-white tracking-tight">
            Traini<span className="text-brand-400">fy</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <button
              key={link.label}
              onClick={link.action}
              className="px-4 py-2 text-sm font-medium text-surface-400 hover:text-white rounded-lg hover:bg-white/5 transition-all duration-200"
            >
              {link.label}
            </button>
          ))}
        </div>

        {/* Desktop Right Side */}
        <div className="hidden md:flex items-center gap-3">
          {variant === "landing" ? (
            <>
              <Link href="/login">
                <button className="btn-secondary px-5 py-2.5 rounded-xl text-sm font-medium text-surface-300">
                  Sign In
                </button>
              </Link>
              <Link href="/register">
                <button className="btn-glow px-5 py-2.5 rounded-xl text-sm font-semibold text-black">
                  Get Started
                </button>
              </Link>
            </>
          ) : user ? (
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-sm font-medium text-white">{user.name}</p>
                <p className="text-xs text-surface-400">{user.email}</p>
              </div>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-all"
              >
                Logout
              </button>
            </div>
          ) : null}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden p-2 rounded-lg text-surface-400 hover:text-white hover:bg-white/5 transition-all"
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute top-full left-4 right-4 mt-2 p-6 rounded-2xl glass shadow-2xl md:hidden"
          >
            <div className="flex flex-col gap-2 mb-4">
              {navLinks.map((link) => (
                <button
                  key={link.label}
                  onClick={link.action}
                  className="px-4 py-3 text-left text-sm font-medium text-surface-300 hover:text-white rounded-xl hover:bg-white/5 transition-all"
                >
                  {link.label}
                </button>
              ))}
            </div>
            <div className="border-t border-white/5 pt-4 flex flex-col gap-2">
              {variant === "landing" ? (
                <>
                  <Link href="/login" onClick={() => setMenuOpen(false)}>
                    <button className="w-full py-3 rounded-xl text-sm font-medium text-surface-300 btn-secondary">
                      Sign In
                    </button>
                  </Link>
                  <Link href="/register" onClick={() => setMenuOpen(false)}>
                    <button className="w-full py-3 rounded-xl text-sm font-semibold text-black btn-glow">
                      Get Started
                    </button>
                  </Link>
                </>
              ) : user ? (
                <button
                  onClick={handleLogout}
                  className="w-full py-3 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 transition-all"
                >
                  Logout
                </button>
              ) : null}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
