"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import backgroundImage from '../components/ian-taylor-B5LGz92kaAM-unsplash.jpg'

const RegisterPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

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
      router.push("/login"); // Redirect to login page after registration
    } else {
      setError(data.message || "Registration failed.");
    }
  };

  return (
    <div
      className="flex items-center justify-center min-h-screen bg-cover bg-center"
      style={{
        backgroundImage: `url(${backgroundImage.src})`, // Replace with the actual background image path
      }}
    >
      <div className="bg-black/60 p-8 rounded-lg shadow-xl max-w-md w-full border border-gray-600">
        <h2 className="text-3xl font-semibold text-center text-white mb-6">
          Create Account
        </h2>
        {error && (
          <p className="text-red-500 text-sm text-center mb-4">{error}</p>
        )}
        <form onSubmit={handleRegister} className="space-y-5">
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full px-4 py-2 bg-gray-800 text-white placeholder-gray-400 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-2 bg-gray-800 text-white placeholder-gray-400 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-2 bg-gray-800 text-white placeholder-gray-400 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md shadow-md"
          >
            Register
          </button>
        </form>
        <p className="text-center text-sm text-white mt-6">
          Already have an account?{" "}
          <button
            onClick={() => router.push("/login")}
            className="text-blue-400 hover:underline"
          >
            Login here
          </button>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
