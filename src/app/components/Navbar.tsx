import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FaUserCircle } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar({ user }: { user: any }) {
  const [showProfile, setShowProfile] = useState(false);
  const [scrolled, setScrolled] = useState(false);
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

  //bg-gradient-to-br from-stone-900 via-black to-stone-900 backdrop-blur-2xl shadow-lg rounded-xl

  return (
    <nav
    className={`fixed w-full top-0 left-0 z-50 transition-all duration-300 ${
      scrolled
        ? "bg-transparent backdrop-blur-md rounded-xl"
        : "bg-gradient-to-br backdrop- shadow-lg rounded-xl"
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
      
      <div className="relative">
        <button
          onClick={() => setShowProfile(!showProfile)}
          className="focus:outline-none hover:text-stone-500 transition-all duration-200"
        >
          <FaUserCircle size={32} />
        </button>
        <AnimatePresence>
          {showProfile && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute right-0 mt-2 w-98 bg-transparent-700 bg-opacity-90 backdrop-blur-lg text-white rounded shadow-lg p-4 border border-gray-700"
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
    </nav>
  );
}
