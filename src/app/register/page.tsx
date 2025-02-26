"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Moon, Sun } from "lucide-react";
import { motion } from "framer-motion";

const RegisterPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
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

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await res.json();
    if (res.ok) {
      router.push("/login");
    } else {
      setError(data.message || "Registration failed.");
    }
  };

  return (

    <motion.div
  className="flex justify-center items-center min-h-screen bg-gradient-to-br from-stone-100 to-stone-300 p-6"
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  exit={{ opacity: 0 }}
  transition={{ duration: 0.5 }}
>
  <motion.div
    className="w-full max-w-5xl bg-white shadow-xl rounded-2xl overflow-hidden flex flex-col md:flex-row m-6"
    initial={{ scale: 0.9, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    transition={{ duration: 0.6, ease: "easeOut" }}
    whileHover={{ scale: 1.02, boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.1)" }}
  >
    {/* Form Section */}
    <div className="w-full md:w-1/2 p-10 flex flex-col justify-center bg-gradient-to-br from-stone-700 via-black to-stone-900 bg-opacity-80 backdrop-blur-md">
      <h2 className="text-3xl font-bold text-gray-200 text-center">Create an account</h2>
      <p className="text-gray-300 text-center mt-2">It's easy! Just take a minute and provide your details.</p>
      {error && <p className="text-red-500 text-sm text-center mt-2">{error}</p>}

      <motion.form
        onSubmit={handleRegister}
        className="mt-6 space-y-4"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      >
        <motion.input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full p-3 border rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-stone-500 bg-gray-50"
          whileFocus={{ scale: 1.02, borderColor: "stone-700" }}
        />
        <motion.input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full p-3 border rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-stone-500 bg-gray-50"
          whileFocus={{ scale: 1.02, borderColor: "stone-700" }}
        />
        <motion.input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full p-3 border rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-stone-500 bg-gray-50"
          whileFocus={{ scale: 1.02, borderColor: "" }}
        />
        <motion.button
          type="submit"
          className="w-full p-3 bg-stone-500 text-black rounded-lg hover:bg-stone-800 hover:text-white transition"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Create Account
        </motion.button>
      </motion.form>

      <p className="text-center text-sm text-gray-200 mt-6">
        Already have an account?
        <button
          onClick={() => router.push("/login")}
          className="text-stone-400 hover:underline ml-1"
        >
          Login
        </button>
      </p>
    </div>

    {/* Image Section with Animation */}
    <motion.div
      className="w-full md:w-1/2 relative hidden md:block overflow-hidden"
      initial={{ opacity: 0, scale: 1.2 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <Image
        src="/bgregjpg.jpg"
        alt="Gym Background"
        layout="fill"
        objectFit="cover"
        className="transform scale-105 transition-all duration-500 hover:scale-110"
      />
      <div className="absolute bottom-6 left-6 text-stone-200 text-lg font-light bg-black bg-opacity-50 p-3 rounded-md">
        <motion.p initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }}>
          "The pain of discipline is temporary, but the results of consistency are forever."
        </motion.p>
      </div>
    </motion.div>
  </motion.div>
</motion.div>


  );
};

export default RegisterPage;
