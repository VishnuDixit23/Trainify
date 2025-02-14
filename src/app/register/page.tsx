"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

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
      router.push("/login");
    } else {
      setError(data.message || "Registration failed.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-6">
      <div className="w-full max-w-5xl bg-white shadow-xl rounded-2xl overflow-hidden flex flex-col md:flex-row m-6">
        {/* Left Section (Form) */}
        <div className="w-full md:w-1/2 p-10 flex flex-col justify-center">
          <h2 className="text-3xl font-bold text-gray-800 text-center">Create an account</h2>
          <p className="text-gray-500 text-center mt-2">It's easy! Just take a minute and provide your details.</p>
          {error && <p className="text-red-500 text-sm text-center mt-2">{error}</p>}
          <form onSubmit={handleRegister} className="mt-6 space-y-4">
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full p-3 border rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-stone-500 bg-gray-50"
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-3 border rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-stone-500 bg-gray-50"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-3 border rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-stone-500 bg-gray-50"
            />
            <button
              type="submit"
              className="w-full p-3 bg-stone-500 text-white rounded-lg hover:bg-stone-800 transition"
            >
              Create Account
            </button>
          </form>
          <p className="text-center text-sm text-gray-600 mt-4">
            Already have an account? 
            <button
              onClick={() => router.push("/login")}
              className="text-stone-500 hover:underline ml-1"
            >
              Login
            </button>
          </p>
        </div>

        {/* Right Section (Image) */}
        <div className="w-full md:w-1/2 relative hidden md:block">
          <Image 
            src="/bgregjpg.jpg"
            alt="Gym Background"
            layout="fill"
            objectFit="cover"
          />
          <div className="absolute bottom-6 left-6 text-stone-200 text-lg font-semibold">
            <p>"The pain of discipline is temporary, but the results of consistency are forever."</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
