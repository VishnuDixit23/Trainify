"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import {
  Zap,
  Dumbbell,
  Utensils,
  TrendingUp,
  CalendarCheck,
  LogOut,
  ArrowLeft,
  LayoutDashboard,
} from "lucide-react";

const navLinks = [
  { label: "Dashboard", href: "/dashboard", icon: <LayoutDashboard size={16} /> },
  { label: "Workouts", href: "/workout-details", icon: <Dumbbell size={16} /> },
  { label: "Diet", href: "/diet-planner", icon: <Utensils size={16} /> },
  { label: "Progress", href: "/TMJ", icon: <TrendingUp size={16} /> },
  { label: "Routines", href: "/routines", icon: <CalendarCheck size={16} /> },
];

interface AppShellProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

export default function AppShell({ children, title, subtitle }: AppShellProps) {
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-[#050505] relative">
      <div className="fixed inset-0 grid-pattern opacity-15 pointer-events-none" />

      {/* ═══════ Top Navbar ═══════ */}
      <nav className="sticky top-0 z-50 bg-[#050505]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-3.5 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center">
              <Zap size={18} className="text-black" />
            </div>
            <span className="text-lg font-bold text-white">
              Traini<span className="text-brand-400">fy</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className={`flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200
                  ${
                    pathname === link.href || pathname.startsWith(link.href + "/")
                      ? "text-brand-400 bg-brand-500/10"
                      : "text-surface-400 hover:text-white hover:bg-white/5"
                  }`}
              >
                {link.icon}
                {link.label}
              </Link>
            ))}
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-3 py-2 text-sm text-surface-400 hover:text-red-400 hover:bg-red-500/5 rounded-lg transition-all"
          >
            <LogOut size={16} />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </nav>

      {/* ═══════ Page Header ═══════ */}
      <header className="max-w-7xl mx-auto px-6 pt-6 pb-4">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-1.5 text-sm text-surface-500 hover:text-white transition-colors mb-3"
        >
          <ArrowLeft size={14} />
          Back
        </button>
        <h1 className="text-2xl sm:text-3xl font-bold text-white">{title}</h1>
        {subtitle && (
          <p className="text-surface-400 text-sm mt-1">{subtitle}</p>
        )}
      </header>

      {/* ═══════ Main Content ═══════ */}
      <main className="max-w-7xl mx-auto px-6 pb-12">{children}</main>
    </div>
  );
}
