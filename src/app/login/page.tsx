"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import backgroundImage from "../components/jon-tyson-U8ekEkD1ytk-unsplash.jpg";
import { Moon, Sun } from "lucide-react";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const router = useRouter();

  // Load theme from localStorage
  useEffect(() => {
    const storedTheme = localStorage.getItem("theme");
    setDarkMode(storedTheme === "dark");
  }, []);

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode((prev) => {
      const newTheme = !prev;
      localStorage.setItem("theme", newTheme ? "dark" : "light");
      return newTheme;
    });
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); // Reset error message

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
    <div
      className={`relative flex min-h-screen items-center justify-center ${
        darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"
      }`}
      style={{
        backgroundImage: `linear-gradient(to bottom, rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.3)), url(${backgroundImage.src})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Dark Mode Toggle */}
      <button
        onClick={toggleDarkMode}
        className="absolute top-6 right-6 p-3 rounded-full bg-white/20 hover:bg-white/30 transition"
      >
        {darkMode ? <Sun className="text-yellow-400" /> : <Moon className="text-gray-800" />}
      </button>

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md bg-white/10 backdrop-blur-lg p-6 rounded-2xl shadow-xl border border-white/20">
        <h2 className="text-3xl font-bold text-center">Welcome Back</h2>
        {error && (
          <p className="text-red-400 text-sm text-center mt-2 animate-shake">{error}</p>
        )}

        <form onSubmit={handleLogin} className="mt-6">
        <div className="relative w-full">
         <input
          type="email"
           value={email}
           onChange={(e) => setEmail(e.target.value)}
            required
           className="w-full p-3 text-white text-lg bg-white/10 border border-white/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-300 focus:bg-white/20 transition-all"
           placeholder="Enter your email"
          />
         </div>


         <div className="relative w-full">
         <input
          type="password"
           value={password}
           onChange={(e) => setPassword(e.target.value)}
            required
           className="w-full p-3 text-white text-lg bg-white/10 border border-white/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-300 focus:bg-white/20 transition-all"
           placeholder="Enter your password"
          />
         </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg transition-transform transform hover:scale-105 mt-6"
          >
            Login
          </button>
        </form>

        <p className="text-center text-sm mt-4">
          New user?{" "}
          <button
            onClick={() => router.push("/register")}
            className="text-blue-400 hover:underline"
          >
            Register here
          </button>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
