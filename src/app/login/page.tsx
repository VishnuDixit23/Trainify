"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Moon, Sun, Eye, EyeOff } from "lucide-react";
import { motion } from "framer-motion";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme");
    setDarkMode(storedTheme === "dark");
    if (storedTheme === "dark") {
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleDarkMode = () => {
    setDarkMode((prev) => {
      const newTheme = !prev;
      localStorage.setItem("theme", newTheme ? "dark" : "light");
      document.documentElement.classList.toggle("dark", newTheme);
      return newTheme;
    });
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (res.ok) {
      localStorage.setItem("token", data.accessToken);
      router.push("/dashboard");
    } else {
      setError(data.message || "Login failed. Please try again.");
    }
  };

  return (
    <motion.div
  className="flex flex-col md:flex-row h-screen w-full bg-gray-100 dark:bg-gray-900"
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  exit={{ opacity: 0 }}
  transition={{ duration: 0.5 }}
>
  {/* Left Side */}
  <div className="w-full md:w-1/2 flex flex-col justify-center items-center bg-white dark:bg-gradient-to-br from-stone-300 to-stone-500 p-8 md:p-12 text-center">
    <h1 className="text-4xl md:text-5xl font-extrabold text-black dark:text-white leading-tight">
      TRAINIFY <span className="text-stone-800">POWERED BY</span> AN AI TRAINER.
    </h1>
    <p className="mt-4 text-base md:text-lg text-stone-800 dark:text-stone-800">
      "Don't wait for motivation, create it with consistent action."
    </p>
    <Link
      href="/register"
      className="mt-6 text-black dark:text-white font-semibold underline hover:text-stone-500 dark:hover:text-stone-300 transition-all"
    >
      Create an account →
    </Link>
  </div>

  {/* Dark Mode Toggle */}
  <button
    onClick={toggleDarkMode}
    className="absolute top-4 right-4 p-2 md:p-3 rounded-full bg-white/20 hover:bg-white/30 transition z-50"
  >
    {darkMode ? <Sun className="text-yellow-400" /> : <Moon className="text-gray-800 dark:text-white" />}
  </button>

  {/* Right Side - Background & Login Form */}
  <div className="relative w-full h-full md:w-1/2">
  <Image
  src="/bglog4.jpg"
  alt="Gym Background"
  fill
  priority
  sizes="100vw"
  className="object-cover"
/>


    <div className="relative flex justify-center items-center h-full backdrop-blur-sm px-4 py-8 md:px-0">
      <motion.div
        className="bg-white dark:bg-gradient-to-br from-stone-700 via-black to-stone-900 bg-opacity-80 backdrop-blur-md p-6 md:p-8 rounded-2xl shadow-lg max-w-md w-full"
        initial={{ y: 20, opacity: 0, scale: 0.95 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      >
        <h2 className="text-lg md:text-xl font-semibold text-gray-800 dark:text-white text-center">
          Login to your account
        </h2>
        {error && <p className="text-red-500 text-sm text-center mt-3">{error}</p>}
        <form onSubmit={handleLogin} className="mt-4 space-y-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 border rounded-lg text-gray-800 dark:text-black bg-gray-50 dark:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-stone-500"
            placeholder="Email Address"
            required
          />

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 pr-10 border rounded-lg text-gray-800 dark:text-black bg-gray-50 dark:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-stone-500"
              placeholder="Password"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 text-gray-500 dark:text-gray-400"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <button
            type="submit"
            className="w-full p-3 mt-2 text-black bg-stone-500 rounded-lg hover:bg-stone-800 hover:text-white transition-all"
          >
            Login
          </button>
        </form>
        <p className="text-center text-sm mt-4 text-gray-900 dark:text-gray-300">
          Forgot password?{" "}
          <Link href="/forgot-password" className="text-stone-500 dark:text-stone-400 hover:underline">
            Reset here
          </Link>
        </p>
      </motion.div>
    </div>
  </div>
</motion.div>

  );
};

export default LoginPage;
