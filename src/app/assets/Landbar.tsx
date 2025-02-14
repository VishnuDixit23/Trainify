
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LandingNavbar() {
  const [scrolled, setScrolled] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed w-full top-0 left-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-stone-900 shadow-lg" : "bg-gradient-to-r from bg-transparent-100 to-stone-700"
      } text-white py-4 px-6 flex justify-between items-center shadow-md`}
    >
      <span className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-stone-400 to-stone-400 cursor-pointer">
        Trainify
      </span>
      
      <div className="flex space-x-6">
        {["Workouts", "Diet Plans", "Progress"].map((item) => (
          <button
            key={item}
            className="text-lg font-medium stone-400 hover:text-stone-500 transition-all duration-200"
            onClick={() => {
              const section = document.getElementById("our-services");
              section?.scrollIntoView({ behavior: "smooth" });
            }}
          >
            {item}
          </button>
        ))}
      </div>
      
      <div className="flex justify-center space-x-4">
  <Link href="/login">
    <button className="bg-stone-600 text-stone-100 px-6 py-3 rounded-lg font-semibold shadow-md transition-all duration-300 transform hover:scale-105 hover:bg-stone-900 focus:ring-2 focus:ring-gray-600">
      Sign In
    </button>
  </Link>
  <Link href="/register">
    <button className="bg-stone-800 text-stone-100 px-6 py-3 rounded-lg font-semibold shadow-md transition-all duration-300 transform hover:scale-105 hover:bg-stone-400 focus:ring-2 focus:ring-gray-900">
      Sign Up
    </button>
  </Link>
</div>

    </nav>
  );
}
