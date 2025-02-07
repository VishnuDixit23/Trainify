import Link from 'next/link';
import backgroundImage from '../app/components/hannes-egler-a9zeXX25lC8-unsplash.jpg';
import background2Image from '../app/components/clark-tibbs-oqStl2L5oxI-unsplash.jpg';

export default function Home() {
  return (
    <main className="relative flex items-center justify-center h-screen bg-gray-900 overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center brightness-90" 
        style={{ backgroundImage: `url(${background2Image.src})` }}
      />
      
      {/* Content Card */}
      <div className="relative z-10 p-10 bg-white/5 backdrop-blur-md rounded-2xl shadow-2xl text-center max-w-lg border border-white/10">
        <h1 className="text-4xl font-extrabold text-white mb-4 drop-shadow-lg animate-fadeIn">Welcome to Trainify</h1>
        <p className="text-lg text-gray-300 mb-6">Your AI-powered fitness companion</p>
        
        {/* Buttons */}
        <div className="flex justify-center space-x-4">
          <Link href="/login">
            <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold shadow-lg transition-transform transform hover:scale-105 focus:ring-2 focus:ring-blue-300">
              Sign In
            </button>
          </Link>
          <Link href="/register">
            <button className="bg-gray-300 hover:bg-gray-400 text-black px-6 py-3 rounded-lg font-semibold shadow-lg transition-transform transform hover:scale-105 focus:ring-2 focus:ring-gray-500">
              Sign Up
            </button>
          </Link>
        </div>
      </div>
    </main>
  );
}
