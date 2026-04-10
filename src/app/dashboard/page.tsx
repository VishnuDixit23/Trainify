/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Dumbbell,
  Utensils,
  TrendingUp,
  CalendarCheck,
  Zap,
  LogOut,
  ChevronRight,
  Flame,
  Clock,
  Sparkles,
} from "lucide-react";
import LoadingSpinner from "../components/ui/LoadingSpinner";

/* ─── Motivational Quotes ─── */
const quotes = [
  "The pain you feel today will be the strength you feel tomorrow.",
  "Success is what comes after you stop making excuses.",
  "Push harder than yesterday if you want a different tomorrow.",
  "Your body can stand almost anything. It's your mind you have to convince.",
  "Don't stop when you're tired. Stop when you're done.",
  "The only bad workout is the one that didn't happen.",
  "Discipline is choosing between what you want now and what you want most.",
];

/* ─── Quick Actions ─── */
const quickActions = [
  {
    title: "AI Workout Plans",
    description: "Get a personalized workout plan tailored to your goals.",
    icon: <Dumbbell size={28} />,
    href: "/workout-details",
    gradient: "from-amber-900/30 to-transparent",
    border: "border-brand-600/20",
    image: "/bglog3.jpg",
  },
  {
    title: "Diet Planner",
    description: "Plan your meals with AI-optimized macro-balanced nutrition.",
    icon: <Utensils size={28} />,
    href: "/diet-planner",
    gradient: "from-emerald-900/30 to-transparent",
    border: "border-emerald-600/20",
    image: "/diet.jpg",
  },
  {
    title: "Track Progress",
    description: "Log workouts and visualize your fitness journey.",
    icon: <TrendingUp size={28} />,
    href: "/TMJ",
    gradient: "from-blue-900/30 to-transparent",
    border: "border-blue-600/20",
    image: "/bglog4.jpg",
  },
  {
    title: "Custom Routines",
    description: "Build your own training split from 800+ exercises.",
    icon: <CalendarCheck size={28} />,
    href: "/routines",
    gradient: "from-purple-900/30 to-transparent",
    border: "border-purple-600/20",
    image: "/fitness.avif",
  },
];

/* ─── Stagger animation ─── */
const stagger = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

/* ═══════════════════════════════════════════
   DASHBOARD COMPONENT
   ═══════════════════════════════════════════ */
export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();
  const [quote] = useState(() => quotes[Math.floor(Math.random() * quotes.length)]);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }

      try {
        const res = await fetch("/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.ok) {
          const data = await res.json();
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
    router.push("/");
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  if (!user) return <LoadingSpinner message="Loading Dashboard..." />;

  return (
    <div className="min-h-screen bg-[#050505] relative">
      {/* Background pattern */}
      <div className="fixed inset-0 grid-pattern opacity-15 pointer-events-none" />

      {/* ═══════ Top Navbar ═══════ */}
      <nav className="sticky top-0 z-50 bg-[#050505]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* Logo */}
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center">
              <Zap size={18} className="text-black" />
            </div>
            <span className="text-lg font-bold text-white">
              Traini<span className="text-brand-400">fy</span>
            </span>
          </Link>

          {/* Nav Links */}
          <div className="hidden md:flex items-center gap-1">
            {[
              { label: "Workouts", href: "/workout-details" },
              { label: "Diet", href: "/diet-planner" },
              { label: "Progress", href: "/TMJ" },
              { label: "Routines", href: "/routines" },
            ].map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="px-4 py-2 text-sm font-medium text-surface-400 hover:text-white rounded-lg hover:bg-white/5 transition-all duration-200"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* User + Logout */}
          <div className="flex items-center gap-4">
            <div className="hidden sm:block text-right">
              <p className="text-sm font-medium text-white">{user.name}</p>
              <p className="text-xs text-surface-500">{user.email}</p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-3 py-2 text-sm text-surface-400 hover:text-red-400 hover:bg-red-500/5 rounded-lg transition-all"
            >
              <LogOut size={16} />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </nav>

      {/* ═══════ Main Content ═══════ */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* ───── Welcome Banner ───── */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative overflow-hidden rounded-2xl glass p-8 sm:p-10 mb-8"
        >
          {/* Subtle gold gradient decoration */}
          <div className="absolute -top-20 -right-20 w-60 h-60 bg-brand-500/[0.04] rounded-full blur-[80px] pointer-events-none" />

          <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1">
                {getGreeting()},{" "}
                <span className="gradient-text">{user.name?.split(" ")[0]}</span>
              </h1>
              <p className="text-surface-400 text-sm sm:text-base max-w-lg italic">
                &ldquo;{quote}&rdquo;
              </p>
            </div>

            {/* Quick Stats */}
            <div className="flex items-center gap-6">
              <div className="text-center">
                <div className="flex items-center gap-1 text-brand-400">
                  <Flame size={18} />
                  <span className="text-xl font-bold text-white">0</span>
                </div>
                <p className="text-xs text-surface-500 mt-0.5">Day Streak</p>
              </div>
              <div className="text-center">
                <div className="flex items-center gap-1 text-brand-400">
                  <Clock size={18} />
                  <span className="text-xl font-bold text-white">—</span>
                </div>
                <p className="text-xs text-surface-500 mt-0.5">Last Workout</p>
              </div>
            </div>
          </div>
        </motion.section>

        {/* ───── Quick Actions Grid ───── */}
        <motion.section
          variants={stagger}
          initial="hidden"
          animate="show"
          className="mb-8"
        >
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Sparkles size={18} className="text-brand-400" />
            Quick Actions
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action) => (
              <motion.div key={action.title} variants={fadeUp}>
                <Link href={action.href}>
                  <div
                    className={`group relative h-[220px] rounded-2xl overflow-hidden border ${action.border} hover:border-brand-500/30 transition-all duration-300 cursor-pointer`}
                  >
                    {/* Background image */}
                    <Image
                      src={action.image}
                      alt={action.title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="object-cover opacity-30 group-hover:opacity-40 group-hover:scale-110 transition-all duration-700"
                    />

                    {/* Gradient overlay */}
                    <div className={`absolute inset-0 bg-gradient-to-t ${action.gradient}`} />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent" />

                    {/* Content */}
                    <div className="relative z-10 h-full flex flex-col justify-end p-5">
                      <div className="text-brand-400 mb-3 group-hover:scale-110 transition-transform duration-300 origin-left">
                        {action.icon}
                      </div>
                      <h3 className="text-lg font-semibold text-white mb-1">
                        {action.title}
                      </h3>
                      <p className="text-surface-400 text-sm leading-relaxed">
                        {action.description}
                      </p>
                      <div className="mt-3 flex items-center gap-1 text-brand-400 text-xs font-medium opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                        Open <ChevronRight size={14} />
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* ───── Tips / Getting Started Section ───── */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="glass rounded-2xl p-6 sm:p-8"
        >
          <h2 className="text-lg font-semibold text-white mb-4">
            Getting Started
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              {
                step: "01",
                title: "Generate a Workout",
                desc: "Go to Workout Plans and let AI create a personalized plan for you.",
                href: "/workout-details",
              },
              {
                step: "02",
                title: "Plan Your Diet",
                desc: "Get a macro-balanced meal plan tailored to your fitness goals.",
                href: "/diet-planner",
              },
              {
                step: "03",
                title: "Track Your Progress",
                desc: "Log your workouts daily and visualize your transformation.",
                href: "/TMJ",
              },
            ].map((item) => (
              <Link key={item.step} href={item.href}>
                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:border-brand-500/20 hover:bg-white/[0.04] transition-all duration-200 cursor-pointer h-full">
                  <span className="text-brand-400 text-xs font-bold">
                    STEP {item.step}
                  </span>
                  <h3 className="text-white font-medium mt-1 mb-1">
                    {item.title}
                  </h3>
                  <p className="text-surface-500 text-sm leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </motion.section>
      </main>
    </div>
  );
}
