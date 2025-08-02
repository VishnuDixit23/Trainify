/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FaUserCircle } from "react-icons/fa";
import { HiMenu, HiX } from "react-icons/hi";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar({ user }: { user: any }) {
  const [showProfile, setShowProfile] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    router.push("/");
  };

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
      <span className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-stone-400 to-stone-400 cursor-pointer">
        Trainify
      </span>

      {/* Desktop Menu */}
      <div className="hidden md:flex space-x-6">
        {["Workouts", "Diet Plans", "Progress"].map((item) => (
          <button
            key={item}
            className="text-lg font-medium text-stone-300 hover:text-stone-200 transition-all duration-200"
            onClick={() => handleNavClick("our-services")}
          >
            {item}
          </button>
        ))}
      </div>

      {/* Right Side Buttons (Profile + Hamburger for mobile) */}
      <div className="relative flex items-center space-x-3">
        <button
          onClick={() => setShowProfile(!showProfile)}
          className="hover:text-stone-300 transition-all duration-200"
        >
          <FaUserCircle size={30} />
        </button>

        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden focus:outline-none"
        >
          {menuOpen ? <HiX size={30} /> : <HiMenu size={30} />}
        </button>

        {/* Profile Dropdown (Shared for both mobile & desktop) */}
        <AnimatePresence>
          {showProfile && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute right-0 top-12 w-72 bg-transparent bg-opacity-80 backdrop-blur-lg text-white rounded shadow-lg p-4 border border-gray-700 z-50"
            >
              <p className="font-semibold text-stone-300">Hello, {user.name}</p>
              <p className="text-sm text-stone-400">{user.email}</p>
              <button
                onClick={handleLogout}
                className="mt-3 w-24 text-stone-700 bg-red-500 hover:bg-red-600 transition-all duration-200  py-2 rounded-full"
              >
                Logout
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Mobile Nav Links */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 w-full bg-black/40 backdrop-blur-md rounded-3xl px-6 py-8 flex flex-col space-y-4 px-4 py-2 md:hidden z-40"
          >
            {["Workouts", "Diet Plans", "Progress"].map((item) => (
              <button
                key={item}
                className="text-lg text-stone-300 hover:text-white"
                onClick={() => handleNavClick("our-services")}
              >
                {item}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
