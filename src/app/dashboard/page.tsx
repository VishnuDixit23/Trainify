"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Head from "next/head";
import BackgroundImage from "../assets/valery-sysoev-qMWEzISL1p0-unsplash.jpg";
import Background2Image from "../assets/sven-mieke-Lx_GDv7VA9M-unsplash.jpg";
import Background3Image from "../assets/brooke-lark-jUPOXXRNdcA-unsplash.jpg";
import Background4Image from "../assets/hester-qiang-95t94hZTESw-unsplash.jpg";
import getFitImage from "../assets/danielle-cerullo-CQfNt66ttZM-unsplash.jpg";
import wtImage from "../assets/daniel-apodaca-WdoQio6HPVA-unsplash.jpg";
import Link from "next/link";
import { CardContent } from "../components/card";
import { Button } from "../components/button";
import { Card } from "../components/card";
import Navbar from "../components/Navbar";

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }
  
      try {
        const res = await fetch("/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` }
        });
  
        if (res.ok) {
          const data = await res.json();
          console.log("Fetched user data:", data);
          setUser(data.user);
        } else {
          localStorage.removeItem("token");
          router.push("/login");
        }
      } catch (error) {
        console.error("Error fetching user:", error);
        router.push("/login");
      }
    };
  
    fetchUser();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };
  if (!user) return <div>Loading...</div>;

  return (
    <>
      <div
        className="bg-cover bg-center h-screen flex flex-col justify-between animate-fade-in"
        style={{
          backgroundImage: `url(${BackgroundImage.src})`,
          fontFamily: "'Questrial', sans-serif",
        }} 
      >
       {/* Navbar Component */}
      <Navbar user={user}
      />
        <div className="p-6">
            <h1 className="text-2xl font-semibold">
                    Welcome, {user.name}!
            </h1>
        </div>
  
   {/* Hero Section */}
   <div className="flex flex-col items-start justify-center h-full px-8 md:px-20 text-white rounded-lg animate-slide-up">
     <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6 hover:scale-105 transition-transform duration-300 rounded-lg">
       Your AI-Powered Fitness Companion
     </h1>
     <p className="text-lg md:text-xl max-w-xl mb-8 hover:opacity-90 transition-opacity duration-300">
       Trainify is your personalized workout partner, using AI to provide
       tailored workout plans, track your progress, and offer expert guidance.
       Start your fitness journey today!
     </p>
    
   <button 
   className="px-6 py-3 bg-stone-400 text-white bg-opacity-75 rounded-lg shadow-lg hover:bg-neutral-900 hover:scale-105 transition-all duration-300 animate-bounce"
    onClick={() => {
    const section = document.getElementById("our-services");
    section?.scrollIntoView({ behavior: "smooth" });
  }}
   >
     Get Started
   </button>
 
   </div>
 </div>
 <section
     id="testimonials"
     className="bg-neutral-900 py-12 animate-fade-in scroll-mt-12 rounded-lg"
   >
     <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
       <h2 className="text-3xl font-extrabold text-white text-center mb-8 animate-slide-up">
         Happy Trainify Users
       </h2>
       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
         {/* Testimonial 1 */}
         <div className="bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg hover:scale-105 transition-transform duration-300 group animate-zoom-in">
           <div className="flex items-center mb-4">
             <span className="text-[#8acbe9] text-xl transition-transform group-hover:scale-110">
               ★★★★★
             </span>
           </div>
           <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-[#8acbe9] transition-colors">
             Amazing Experience
           </h3>
           <p className="text-gray-300 mb-4 group-hover:text-white transition-colors">
             Trainify has transformed my fitness journey. I'm now more motivated
             and focused than ever before. It's like having a personal trainer in
             my pocket!
           </p>
           <p className="text-gray-500 text-sm group-hover:text-[#8acbe9] transition-colors">
             John Doe, NY
           </p>
         </div>
 
         {/* Testimonial 2 */}
         <div className="bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg hover:scale-105 transition-transform duration-300 group animate-zoom-in">
           <div className="flex items-center mb-4">
             <span className="text-[#8acbe9] text-xl transition-transform group-hover:scale-110">
               ★★★★★
             </span>
           </div>
           <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-[#8acbe9] transition-colors">
             Incredible Results
           </h3>
           <p className="text-gray-300 mb-4 group-hover:text-white transition-colors">
             I never thought achieving my fitness goals could be this enjoyable.
             Trainify has made it possible with its personalized approach and
             expert guidance.
           </p>
           <p className="text-gray-500 text-sm group-hover:text-[#8acbe9] transition-colors">
             Jane Smith, CA
           </p>
         </div>
 
         {/* Testimonial 3 */}
         <div className="bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg hover:scale-105 transition-transform duration-300 group animate-zoom-in">
           <div className="flex items-center mb-4">
             <span className="text-[#8acbe9] text-xl transition-transform group-hover:scale-110">
               ★★★★★
             </span>
           </div>
           <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-[#8acbe9] transition-colors">
             Life-Changing
           </h3>
           <p className="text-gray-300 mb-4 group-hover:text-white transition-colors">
             Trainify's AI-powered workouts have completely changed my
             perspective on fitness. I feel healthier, stronger, and more
             confident. Thank you, Trainify!
           </p>
           <p className="text-gray-500 text-sm group-hover:text-[#8acbe9] transition-colors">
             Adam Johnson, TX
           </p>
         </div>
 
         {/* Testimonial 4 */}
         <div className="bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg hover:scale-105 transition-transform duration-300 group animate-zoom-in">
           <div className="flex items-center mb-4">
             <span className="text-[#8acbe9] text-xl transition-transform group-hover:scale-110">
               ★★★★★
             </span>
           </div>
           <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-[#8acbe9] transition-colors">
             Highly Recommended
           </h3>
           <p className="text-gray-300 mb-4 group-hover:text-white transition-colors">
             I've recommended Trainify to all my friends and family. The results
             speak for themselves, and the personalized approach is truly
             remarkable.
           </p>
           <p className="text-gray-500 text-sm group-hover:text-[#8acbe9] transition-colors">
             Sarah Parker, FL
           </p>
         </div>
       </div>
     </div>
   </section>
 
 <section className="bg-neutral-900 py-12">
   <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
   <section id="our-services">
     <h2 className="text-4xl font-bold text-white mb-4">Our Services</h2>
     </section>
     <p className="text-lg text-gray-300 mb-8">Tailored for You</p>
     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
       {/* Service 1 */}
       <Link href="/workout-details">
       <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl hover:scale-105 transition-transform duration-300">
         <div
       
           style={{ backgroundImage: `url(${Background2Image.src})` }}
           className="w-full h-56 bg-cover bg-center group"
         ></div>
        
         <div className="p-4">
           <h3 className="text-xl font-semibold text-gray-800 group-hover:text-yellow-600 transition-colors">
             Designated Workouts
           </h3>
           <p className="text-gray-600 group-hover:text-gray-900 transition-colors">
             Tailored workouts designed to meet your personal fitness goals.
           </p>
         </div>
       </div>
       </Link>
     
       {/* Service 2 */}
       <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl hover:scale-105 transition-transform duration-300"
       onClick={() => router.push("/diet-planner")}>
         <div
           style={{ backgroundImage: `url(${Background3Image.src})` }}
           className="w-full h-56 bg-cover bg-center group"
         ></div>
         <div className="p-4">
           <h3 className="text-xl font-semibold text-gray-800 group-hover:text-yellow-600 transition-colors">
             Personalised Diets
           </h3>
           <p className="text-gray-600 group-hover:text-gray-900 transition-colors">
             Diet plans provided to you according to your needs.
           </p>
         </div>
       </div>
       {/* Service 3 */}
       <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl hover:scale-105 transition-transform duration-300">
         <div
           style={{ backgroundImage: `url(${Background4Image.src})` }}
           className="w-full h-56 bg-cover bg-center group"
         ></div>
         <div className="p-4">
           <h3 className="text-xl font-semibold text-gray-800 group-hover:text-yellow-600 transition-colors">
             Track Your Journey
           </h3>
           <p className="text-gray-600 group-hover:text-gray-900 transition-colors">
             The journey of a thousand miles begins with a single step.
           </p>
           <p className="text-gray-600 italic group-hover:text-gray-900 transition-colors">
             - Lao Tzu
           </p>
         </div>
       </div>
     </div>
   </div>
 </section>
 
 <div className="bg-neutral-900 min-h-screen flex flex-col justify-between">
   {/* Header Section */}
   <section className=" bg-neutral-900 flex flex-col md:flex-row items-center justify-between py-16 bg-[#1F2933]">
     {/* Image Section */}
     <div className="w-full md:w-1/2 animate-fadeInLeft relative">
       <div
         style={{
           backgroundImage: `url(${getFitImage.src})`,
         }}
         className="ml-20 w-5/6 h-[300px] md:h-[400px] bg-cover bg-center shadow-lg rounded-lg"
         aria-label="Gym Equipment"
       ></div>
     </div>
 
     {/* Text Section */}
     <div className="w-full md:w-1/2 px-8 animate-fadeInRight">
       <h1 className="text-4xl font-bold text-white mb-4">
         Discover Trainify Now
       </h1>
       <h2 className="text-6xl font-extrabold text-[#8acbe9] mb-6 animate-pulse">
         Get Fit
       </h2>
       <p className="text-lg text-gray-300 mb-8">
         Trainify – Your AI-Powered Fitness Companion. Personalized workout
         plans, progress tracking, and expert guidance, all tailored to your
         goals. Start your fitness journey today!
       </p>
       
     </div>
   </section>
 
 
   {/* Why Trainify Section */}
   <section
     className="  relative py-16 bg-cover bg-center animate-fadeIn fontFamily: 'Questrial', sans-serif"
     style={{
       backgroundImage: "url('/path-to-your-background-image.jpg')",
     }}
   >
     <div className="bg-neutral-900 bg-opacity-95 max-w-6xl mx-auto px-4 py-12 rounded-lg shadow-lg">
       <h2 className="text-4xl font-bold text-center text-white mb-12 animate-fadeInUp">
         Why Trainify
       </h2>
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
         {/* Animated Cards */}
         <div className="text-center bg-[#1F2933] hover:shadow-lg p-4 rounded-lg transition-transform transform hover:scale-105 animate-fadeInUp delay-100">
           <h3 className="text-2xl font-semibold text-[#8acbe9] mb-2">
             Personalized Approach
           </h3>
           <p className="text-gray-300">
             Trainify's AI provides a personalized approach to your fitness
             journey, ensuring that every workout plan is tailored to your
             specific goals and needs.
           </p>
         </div>
         <div className="text-center bg-[#1F2933] hover:shadow-lg p-4 rounded-lg transition-transform transform hover:scale-105 animate-fadeInUp delay-200">
           <h3 className="text-2xl font-semibold text-[#8acbe9] mb-2">
             Progress Tracking
           </h3>
           <p className="text-gray-300">
             Easily track your progress and milestones, allowing you to see the
             tangible results of your hard work and dedication.
           </p>
         </div>
         <div className="text-center bg-[#1F2933] hover:shadow-lg p-4 rounded-lg transition-transform transform hover:scale-105 animate-fadeInUp delay-300">
           <h3 className="text-2xl font-semibold text-[#8acbe9] mb-2">
             Expert Guidance
           </h3>
           <p className="text-gray-300">
             Our expert trainers and AI guidance are with you every step of the
             way, offering support and motivation to help you achieve optimal
             results.
           </p>
         </div>
         <div className="text-center bg-[#1F2933] hover:shadow-lg p-4 rounded-lg transition-transform transform hover:scale-105 animate-fadeInUp delay-400">
           <h3 className="text-2xl font-semibold text-[#8acbe9] mb-2">
             Community & Support
           </h3>
           <p className="text-gray-300">
             Join our community of fitness enthusiasts and receive unparalleled
             support, motivation, and expert advice to keep you on track towards
             your fitness goals.
           </p>
         </div>
       </div>
       <div className="flex justify-center mt-8 animate-fadeInUp delay-500">
        
       </div>
     </div>
   </section>
 
   {/* Footer Section */}
   <footer className="bg-neutral-900 py-12 fontFamily: 'Questrial', sans-serif">
   <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 text-center md:text-left">
     {/* Left Column */}
     <div className="mb-6 md:mb-0">
       <p className="text-xl font-bold text-white">✨ Trainify</p>
     </div>
 
     {/* Center Column */}
     <div className="mb-6 md:mb-0">
       <h4 className="text-lg font-semibold text-white mb-2">Legal</h4>
       <ul className="space-y-1">
         <li>
           <a href="#" className="text-gray-300 hover:text-green-400">
             Privacy Policy
           </a>
         </li>
         <li>
           <a href="#" className="text-gray-300 hover:text-green-400">
             Terms & Conditions
           </a>
         </li>
       </ul>
     </div>
 
     {/* Right Column */}
     <div className="text-center md:text-right">
       <h4 className="text-lg font-semibold text-white mb-2">
         Follow us for Updates
       </h4>
       <div className="flex justify-center md:justify-end space-x-4">
         <a href="#" className="text-white hover:text-green-400">
           <i className="fab fa-instagram"></i> Instagram
         </a>
         <a href="#" className="text-white hover:text-green-400">
           <i className="fab fa-facebook"></i> Facebook
         </a>
         <a href="#" className="text-white hover:text-green-400">
           <i className="fab fa-youtube"></i> YouTube
         </a>
         <a href="#" className="text-white hover:text-green-400">
           <i className="fab fa-tiktok"></i> TikTok
         </a>
       </div>
     </div>
   </div>
   <div className="text-center mt-8 text-gray-300 text-sm">
     © 2024 by Trainify. Powered and secured by Vishnu Dixit
   </div>
 </footer>
 </div>
 
     
     </>
   );
   
  }

  





