"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Moon, Sun } from "lucide-react";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme");
    setDarkMode(storedTheme === "dark");
  }, []);

  const toggleDarkMode = () => {
    setDarkMode((prev) => {
      const newTheme = !prev;
      localStorage.setItem("theme", newTheme ? "dark" : "light");
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
    <div className="flex h-screen w-full bg-gray-100">
      {/* Left Side */}
      <div className="w-1/2 flex flex-col justify-center items-center bg-white p-12">
        <h1 className="text-5xl font-extrabold text-black">
          TRAINIFY <span className="text-stone-400">POWERED BY</span> AN AI TRAINER.
        </h1>
        <p className="mt-4 text-lg text-gray-600">"Don't wait for motivation, create it with consistent action."</p>
        <Link href="/register" className="mt-6 text-black font-semibold underline hover:text-stone-500 transition-all">
          Create an account →
        </Link>
      </div>

      {/* Dark Mode Toggle */}
      <button
        onClick={toggleDarkMode}
        className="absolute top-6 right-6 p-3 rounded-full bg-white/20 hover:bg-white/30 transition"
      >
        {darkMode ? <Sun className="text-yellow-400" /> : <Moon className="text-gray-800" />}
      </button>

      {/* Right Side - Background & Login Form */}
      <div className="w-1/2 relative">
        <Image
          src="/bglog4.jpg"
          layout="fill"
          objectFit="cover"
          className="absolute inset-0"
          alt="Gym Background"
        />
        <div className="relative flex justify-center items-center h-full">
          <div className="bg-white bg-opacity-80 backdrop-blur-md p-8 rounded-2xl shadow-lg max-w-md w-full">
            <h2 className="text-xl font-semibold text-gray-800 text-center">Login to your account</h2>
            {error && <p className="text-red-500 text-sm text-center mt-3">{error}</p>}
            <form onSubmit={handleLogin} className="mt-4 space-y-4">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 border rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-stone-400 bg-gray-50"
                placeholder="Email Address"
                required
              />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 border rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-stone-400 bg-gray-50"
                placeholder="Password"
                required
              />

              {/* Login Button */}
              <button
                type="submit"
                className="w-full p-3 mt-2 text-white bg-stone-500 rounded-lg hover:bg-stone-900 transition-all"
              >
                Login
              </button>
            </form>

            {/* Forgot Password */}
            <p className="text-center text-sm mt-4 text-gray-900">
              Forgot password?{" "}
              <Link href="/forgot-password" className="text-stone-500 hover:underline">
                Reset here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
