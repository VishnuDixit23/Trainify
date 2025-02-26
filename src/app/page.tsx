"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from 'next/link';
import backgroundImage from '../app/components/hannes-egler-a9zeXX25lC8-unsplash.jpg';
import background2Image from '../app/components/clark-tibbs-oqStl2L5oxI-unsplash.jpg';
import Landbar from "../app/assets/Landbar";
import BackgroundImage from "../app/assets/valery-sysoev-qMWEzISL1p0-unsplash.jpg"
import Background2Image from "../app/assets/sven-mieke-Lx_GDv7VA9M-unsplash.jpg";
import Background3Image from "../app/assets/brooke-lark-jUPOXXRNdcA-unsplash.jpg";
import Background4Image from "../app/assets/hester-qiang-95t94hZTESw-unsplash.jpg";
import getFitImage from "../app/assets/danielle-cerullo-CQfNt66ttZM-unsplash.jpg";
import Background5Image from "../../src/app/assets/service4jpg.jpg"
import { Instagram, Facebook, Youtube, Twitter, Send } from "lucide-react";


export default function Home() {
  const router = useRouter();
  return (

    <>
    <div
      className="bg-cover bg-center h-screen flex flex-col justify-between animate-fade-in"
      style={{
        backgroundImage: `url(${BackgroundImage.src})`,
        fontFamily: "'Questrial', sans-serif",
      }} 
    >
      
     <Landbar/>


 {/* Hero Section */}
 <div className="flex flex-col items-start justify-center h-full px-8 md:px-20 text-white rounded-lg animate-slide-up">
   <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6 hover:scale-105 transition-transform duration-300 rounded-lg">
     Your AI-Powered Fitness Companion
   </h1>
   <p className="text-lg md:text-xl max-w-xl mb-8 hover:opacity-90 transition-opacity duration-300">
     Trainify is your personalized workout partner, using AI to provide
     tailored workout plans,Personalise Diets, track your progress, and offer expert guidance.
     Start your fitness journey today!
   </p>
  
 <button 
 className="px-6 py-3 bg-gradient-to-br from-stone-700 to-stone-800 backdrop-blur-3xl  text-stone-200  bg-opacity-75 rounded-lg shadow-lg hover:bg-neutral-900 hover:scale-105 transition-all duration-300 "
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
         <div className="bg-gradient-to-br from-stone-900 via-black to-stone-800 backdrop-blur-2xl p-6 rounded-lg shadow-md hover:shadow-lg hover:scale-105 transition-transform duration-300 group animate-zoom-in">
           <div className="flex items-center mb-4">
             <span className="text-[#c2dae6] text-xl transition-transform group-hover:scale-110">
               ★★★★★
             </span>
           </div>
           <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-[#d3cb61bb] transition-colors">
             Amazing Experience
           </h3>
           <p className="text-gray-300 mb-4 group-hover:text-white transition-colors">
             Trainify has transformed my fitness journey. I'm now more motivated
             and focused than ever before. It's like having a personal trainer in
             my pocket!
           </p>
           <p className="text-gray-400 text-sm group-hover:text-[#d3cb61bb] transition-colors">
             John Doe, NY
           </p>
         </div>
 
         {/* Testimonial 2 */}
         <div className="bg-gradient-to-br from-stone-900 via-black to-stone-800 backdrop-blur-2xl p-6 rounded-lg shadow-md hover:shadow-lg hover:scale-105 transition-transform duration-300 group animate-zoom-in">
           <div className="flex items-center mb-4">
             <span className="text-[#c2dae6] text-xl transition-transform group-hover:scale-110">
               ★★★★★
             </span>
           </div>
           <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-[#d3cb61bb] transition-colors">
             Incredible Results
           </h3>
           <p className="text-gray-300 mb-4 group-hover:text-white transition-colors">
             I never thought achieving my fitness goals could be this enjoyable.
             Trainify has made it possible with its personalized approach and
             expert guidance.
           </p>
           <p className="text-gray-400 text-sm group-hover:text-[#d3cb61bb] transition-colors">
             Jane Smith, CA
           </p>
         </div>
 
         {/* Testimonial 3 */}
         <div className="bg-gradient-to-br from-stone-900 via-black to-stone-800 backdrop-blur-2xl p-6 rounded-lg shadow-md hover:shadow-lg hover:scale-105 transition-transform duration-300 group animate-zoom-in">
           <div className="flex items-center mb-4">
             <span className="text-[#c2dae6] text-xl transition-transform group-hover:scale-110">
               ★★★★★
             </span>
           </div>
           <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-[#d3cb61bb] transition-colors">
             Life-Changing
           </h3>
           <p className="text-gray-300 mb-4 group-hover:text-white transition-colors">
             Trainify's AI-powered workouts have completely changed my
             perspective on fitness. I feel healthier, stronger, and more
             confident. Thank you, Trainify!
           </p>
           <p className="text-gray-400 text-sm group-hover:text-[#d3cb61bb] transition-colors">
             Adam Johnson, TX
           </p>
         </div>
 
         {/* Testimonial 4 */}
         <div className="bg-gradient-to-br from-stone-900 via-black to-stone-800 backdrop-blur-2xl p-6 rounded-lg shadow-md hover:shadow-lg hover:scale-105 transition-transform duration-300 group animate-zoom-in">
           <div className="flex items-center mb-4">
             <span className="text-[#c2dae6] text-xl transition-transform group-hover:scale-110">
               ★★★★★
             </span>
           </div>
           <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-[#d3cb61bb] transition-colors">
             Highly Recommended
           </h3>
           <p className="text-gray-300 mb-4 group-hover:text-white transition-colors">
             I've recommended Trainify to all my friends and family. The results
             speak for themselves, and the personalized approach is truly
             remarkable.
           </p>
           <p className="text-gray-400 text-sm group-hover:text-[#d3cb61bb] transition-colors">
             Sarah Parker, FL
           </p>
         </div>
       </div>
        
     </div>
   </section>

   <section className="bg-neutral-900 py-16">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
    <section id="our-services">
      <h2 className="text-4xl font-bold text-white mb-4 animate-fadeInUp">Our Services</h2>
    </section>
    <p className="text-lg text-gray-300 mb-10 animate-fadeInUp delay-100">Tailored for You</p>

    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
      {/* Service 1 */}
      <Link href="/login">
        <div className="relative bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all transform hover:scale-105 duration-300 group h-full flex flex-col">
          <div
            style={{ backgroundImage: `url(${Background2Image.src})` }}
            className="w-full h-56 bg-cover bg-center group-hover:scale-110 transition-transform duration-500"
          ></div>
          <div className=" absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="p-6 text-center relative z-10">
            <h3 className="text-xl font-semibold text-white group-hover:text-stone-600 transition-colors duration-300">
              Designated Workouts
            </h3>
            <p className="text-gray-300 group-hover:text-gray-100 transition-colors">
              Tailored workouts designed to meet your personal fitness goals.
            </p>
          </div>
        </div>
      </Link>

      {/* Service 2 */}
      <div
        className="relative bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all transform hover:scale-105 duration-300 group cursor-pointer h-full flex flex-col"
        onClick={() => router.push("/login")}
      >
        <div
          style={{ backgroundImage: `url(${Background3Image.src})` }}
          className="w-full h-56 bg-cover bg-center group-hover:scale-110 transition-transform duration-500"
        ></div>
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <div className="p-6 text-center relative z-10">
          <h3 className="text-xl font-semibold text-white group-hover:text-green-400 transition-colors duration-300">
            Personalised Diets
          </h3>
          <p className="text-gray-300 group-hover:text-gray-100 transition-colors">
            Diet plans provided to you according to your needs.
          </p>
        </div>
      </div>

      {/* Service 3 */}
      <div
        className="relative bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all transform hover:scale-105 duration-300 group cursor-pointer h-full flex flex-col"
        onClick={() => router.push("/login")}
      >
        <div
          style={{ backgroundImage: `url(${Background4Image.src})` }}
          className="w-full h-56 bg-cover bg-center group-hover:scale-110 transition-transform duration-500"
        ></div>
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <div className="p-6 text-center relative z-10">
          <h3 className="text-xl font-semibold text-white group-hover:text-blue-400 transition-colors duration-300">
            Track Your Journey
          </h3>
          <p className="text-gray-300 group-hover:text-gray-100 transition-colors">
            The journey of a thousand miles begins with a single step.
          </p>
          <p className="text-gray-400 italic group-hover:text-gray-200 transition-colors">
            - Lao Tzu
          </p>
        </div>
      </div>

      {/* Service 4 */}
      <div
        className=" relative bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all transform hover:scale-105 duration-300 group cursor-pointer h-full flex flex-col"
        onClick={() => router.push("/login")}
      >
        <div
          style={{ backgroundImage: `url(${Background5Image.src})` }}
          className="w-full h-56 bg-cover bg-center group-hover:scale-110 transition-transform duration-500"
        ></div>
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <div className="p-6 text-center relative z-10">
          <h3 className="text-xl font-semibold text-white group-hover:text-stone-700 transition-colors duration-300">
            Make Your Own Routine
          </h3>
          <p className="text-gray-300 group-hover:text-gray-100 transition-colors">
            Popular workout plans designed by experts.
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
       <h2 className="text-6xl font-extrabold text-stone-500 mb-6 ">
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
   >
     <div className="bg-neutral-900 bg-opacity-95 max-w-6xl mx-auto px-4 py-12 rounded-lg shadow-lg">
       <h2 className="text-4xl font-bold text-center text-white mb-12 animate-fadeInUp">
         Why Trainify
       </h2>
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
         {/* Animated Cards */}
         <div className="text-center bg-gradient-to-br from-stone-700 via-stone-900 to-stone-800 backdrop-blur-2xl hover:shadow-lg p-4 rounded-lg transition-transform transform hover:scale-105 animate-fadeInUp delay-100">
           <h3 className="text-2xl font-semibold text-stone-400 mb-2">
             Personalized Approach
           </h3>
           <p className="text-gray-300">
             Trainify's AI provides a personalized approach to your fitness
             journey, ensuring that every workout plan is tailored to your
             specific goals and needs.
           </p>
         </div>
         <div className="text-center bg-gradient-to-br from-stone-700 via-stone-900 to-stone-800 backdrop-blur-2xl hover:shadow-lg p-4 rounded-lg transition-transform transform hover:scale-105 animate-fadeInUp delay-200">
           <h3 className="text-2xl font-semibold text-stone-400 mb-2">
             Progress Tracking
           </h3>
           <p className="text-gray-300">
             Easily track your progress and milestones, allowing you to see the
             tangible results of your hard work and dedication.
           </p>
         </div>
         <div className="text-center bg-gradient-to-br from-stone-700 via-stone-900 to-stone-800 backdrop-blur-2xl hover:shadow-lg p-4 rounded-lg transition-transform transform hover:scale-105 animate-fadeInUp delay-300">
           <h3 className="text-2xl font-semibold text-stone-400 mb-2">
             Expert Guidance
           </h3>
           <p className="text-gray-300">
             Our expert trainers and AI guidance are with you every step of the
             way, offering support and motivation to help you achieve optimal
             results.
           </p>
         </div>
         <div className="text-center bg-gradient-to-br from-stone-700 via-stone-900 to-stone-800 backdrop-blur-2xl hover:shadow-lg p-4 rounded-lg transition-transform transform hover:scale-105 animate-fadeInUp delay-400">
           <h3 className="text-2xl font-semibold text-stone-400 mb-2">
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
  <footer className="bg-gradient-to-b from-neutral-900 to-black text-white py-12 border-t border-gray-800">
  <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-10">
    
    {/* Branding & About */}
    <div className="flex flex-col space-y-3">
      <h3 className="text-3xl font-extrabold tracking-wide text-stone-400">Trainify</h3>
      <p className="text-gray-400 text-sm leading-relaxed">
        Elevate your fitness with AI-powered guidance. Personalized plans, expert workouts, and seamless tracking.
      </p>
    </div>

    {/* Navigation */}
    <div className="flex flex-col space-y-3">
      <h4 className="text-lg font-semibold text-white">Quick Links</h4>
      <ul className="space-y-2 text-gray-400 text-sm">
        <li>
          <a href="#" className="hover:text-stone-300 transition-colors">Home</a>
        </li>
        <li>
          <a href="#" className="hover:text-stone-300 transition-colors">Workout Plans</a>
        </li>
        <li>
          <a href="#" className="hover:text-stone-300 transition-colors">Diet Plans</a>
        </li>
        <li>
          <a href="#" className="hover:text-stone-300 transition-colors">Privacy Policy</a>
        </li>
        <li>
          <a href="#" className="hover:text-stone-300 transition-colors">Terms & Conditions</a>
        </li>
      </ul>
    </div>

    {/* Social Media & Newsletter */}
    <div className="flex flex-col space-y-4 text-center md:text-left">
      <h4 className="text-lg font-semibold text-white">Follow Us</h4>
      <div className="flex justify-center md:justify-start space-x-4">
      <a href="#" className="text-gray-400 hover:text-yellow-400 transition-colors">
    <Instagram size={20} />
  </a>
  <a href="#" className="text-gray-400 hover:text-yellow-400 transition-colors">
    <Facebook size={20} />
  </a>
  <a href="#" className="text-gray-400 hover:text-yellow-400 transition-colors">
    <Youtube size={20} />
  </a>
  <a href="#" className="text-gray-400 hover:text-yellow-400 transition-colors">
    <Twitter size={20} />
  </a>

      </div>
      
      {/* Newsletter */}
      <h4 className="text-lg font-semibold text-white">Stay Updated</h4>
      <div className="flex items-center bg-stone-800 px-4 py-2 rounded-lg">
        <input
          type="email"
          placeholder="Enter your email"
          className="bg-transparent text-gray-300 text-sm outline-none flex-1"
        />
        <button className="text-yellow-400 hover:text-yellow-500">
          <i className="fas fa-paper-plane"></i>
        </button>
      </div>
    </div>
  </div>

  {/* Bottom Section */}
  <div className="mt-9 text-center text-gray-400 text-sm border-t border-gray-800 pt-3">
    © 2025 Trainify. Powered and secured by Vishnu Dixit.
  </div>
</footer>

 
</div>
   </>
  );
}
