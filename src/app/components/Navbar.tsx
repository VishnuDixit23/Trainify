import { useState } from "react";
import { useRouter } from "next/navigation";
import { FaUserCircle } from "react-icons/fa";

export default function Navbar({ user }: { user: any }) {
  const [showProfile, setShowProfile] = useState(false);
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("user"); // Remove user data
    router.push("/login"); // Redirect to login
  };

  return (
    <nav className="flex justify-between items-center p-6 bg-gray-900 text-white shadow-md">
      <span className="text-2xl font-semibold">Trainify</span>
      <div className="relative">
        <button onClick={() => setShowProfile(!showProfile)} className="focus:outline-none">
          <FaUserCircle size={30} />
        </button>
        {showProfile && (
          <div className="absolute right-0 mt-2 w-48 bg-white text-black rounded shadow-lg p-4">
            <p className="font-semibold">Hello, {user.name} 👋</p>
            <p className="text-sm text-gray-600">{user.email}</p>
            <button onClick={handleLogout} className="mt-3 w-full bg-red-500 text-white py-2 rounded">
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
