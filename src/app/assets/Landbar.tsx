"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { HiMenu, HiX } from "react-icons/hi";
import { motion, AnimatePresence } from "framer-motion";

export default function LandingNavbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    section?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false); // close mobile menu
  };

  return (
    <nav
      className={`fixed w-full top-0 left-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-transparent backdrop-blur-md" : "bg-transparent"
      } text-white py-6 px-6 flex justify-between items-center`}
    >
      {/* Logo */}
      <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-stone-400 to-stone-400 cursor-pointer">
        Trainify
      </span>

      {/* Desktop Menu */}
      <div className="hidden md:flex space-x-12">
        {["Workouts", "Diet Plans", "Progress"].map((item) => (
          <button
            key={item}
            className="text-lg font-medium text-stone-300 hover:text-stone-200 transition-all duration-200"
            onClick={() => handleNavClick("our-services")}
          >
            {item}
          </button>
        ))}
        <Link href="/login">
          <button className="bg-gradient-to-br from-stone-600 via-stone-900 to-stone-700 backdrop-blur-2xl text-stone-100 px-6 py-3 rounded-lg font- shadow-md transition-all duration-300 transform hover:scale-105 hover:bg-stone-900 focus:ring-2 focus:ring-gray-600">
            Sign In
          </button>
        </Link>
        <Link href="/register">
          <button className="bg-gradient-to-br from-stone-900 via-black to-stone-800 backdrop-blur-2xl text-stone-100 px-6 py-3 rounded-lg font- shadow-md transition-all duration-300 transform hover:scale-105 hover:bg-stone-400 focus:ring-2 focus:ring-gray-900">
            Sign Up
          </button>
        </Link>
      </div>

      {/* Mobile Menu Icon */}
      <div className="md:hidden flex items-center">
        <button onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? (
            <HiX className="w-6 h-6 text-white" />
          ) : (
            <HiMenu className="w-6 h-6 text-white" />
          )}
        </button>
      </div>
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="absolute top-20 left-4 right-4 mx-auto w-[90%] bg-black/40 backdrop-blur-md rounded-3xl px-6 py-8 flex flex-col items-center space-y-6 text-white shadow-2xl ring-1 ring-white/10 z-50 transition-all"
          >
            <div className="flex flex-col items-center space-y-4 w-full">
              {["Workouts", "Diet Plans", "Progress"].map((item) => (
                <button
                  key={item}
                  className="text-base font-medium tracking-wide text-stone-300 hover:text-white transition duration-200"
                  onClick={() => {
                    const section = document.getElementById("our-services");
                    section?.scrollIntoView({ behavior: "smooth" });
                    setMenuOpen(false);
                  }}
                >
                  {item}
                </button>
              ))}
            </div>

            <div className="w-full flex flex-col gap-3 mt-4 px-4">
              <Link href="/login" onClick={() => setMenuOpen(false)}>
                <button className="w-full bg-gradient-to-br from-stone-600 via-stone-900 to-stone-700 backdrop-blur-2xl text-white py-3 rounded-xl font-semibold shadow-inner hover:scale-[1.02] hover:brightness-110 transition">
                  Sign In
                </button>
              </Link>
              <Link href="/register" onClick={() => setMenuOpen(false)}>
                <button className="w-full bg-gradient-to-br from-stone-900 via-black to-stone-800 backdrop-blur-2xl text-white py-3 rounded-xl font-semibold shadow-inner hover:scale-[1.02] hover:brightness-110 transition">
                  Sign Up
                </button>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
