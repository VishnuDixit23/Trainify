"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Utensils,
  Flame,
  Beef,
  Wheat,
  Droplets,
  AlertTriangle,
  ArrowRight,
  Clock,
  Sparkles,
  ChevronDown,
  Apple,
  Coffee,
  Sun,
  Sunset,
  Moon,
  Cookie,
} from "lucide-react";
import AppShell from "../components/AppShell";
import LoadingSpinner from "../components/ui/LoadingSpinner";

/* ── Circular Macro Ring ── */
const MacroRing = ({ value, label, color, icon, delay = 0 }: { value: string; label: string; color: string; icon: React.ReactNode; delay?: number }) => {
  const numericVal = parseInt(value) || 0;
  const maxVal = label === "Calories" ? 4000 : 400;
  const pct = Math.min((numericVal / maxVal) * 100, 100);
  const r = 36;
  const circumference = 2 * Math.PI * r;
  const offset = circumference - (pct / 100) * circumference;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="glass rounded-2xl p-5 flex flex-col items-center relative overflow-hidden group hover:border-white/10 transition-all"
    >
      <div className={`absolute inset-0 bg-gradient-to-b ${color} opacity-[0.03] group-hover:opacity-[0.06] transition-opacity pointer-events-none`} />
      <div className="relative w-20 h-20 mb-3">
        <svg width={80} height={80} className="transform -rotate-90">
          <circle cx={40} cy={40} r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth={5} />
          <motion.circle
            cx={40} cy={40} r={r}
            fill="none" stroke="currentColor" strokeWidth={5} strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.2, ease: "easeOut", delay: delay + 0.3 }}
            className={color.replace("from-", "text-").split(" ")[0]}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          {icon}
        </div>
      </div>
      <p className="text-white font-bold text-lg">{value}</p>
      <p className="text-surface-500 text-[10px] uppercase tracking-wider mt-0.5">{label}</p>
    </motion.div>
  );
};

/* ── Meal Icon Picker ── */
const getMealIcon = (mealName: string) => {
  const lower = mealName.toLowerCase();
  if (lower.includes("breakfast")) return <Coffee size={18} className="text-amber-400" />;
  if (lower.includes("morning") || lower.includes("snack") && lower.includes("mid")) return <Apple size={18} className="text-green-400" />;
  if (lower.includes("lunch")) return <Sun size={18} className="text-orange-400" />;
  if (lower.includes("evening")) return <Sunset size={18} className="text-violet-400" />;
  if (lower.includes("dinner")) return <Moon size={18} className="text-blue-400" />;
  if (lower.includes("snack")) return <Cookie size={18} className="text-pink-400" />;
  return <Utensils size={18} className="text-brand-400" />;
};

const getMealGradient = (index: number) => {
  const gradients = [
    "from-amber-500/10 to-transparent",
    "from-green-500/10 to-transparent",
    "from-orange-500/10 to-transparent",
    "from-violet-500/10 to-transparent",
    "from-blue-500/10 to-transparent",
    "from-pink-500/10 to-transparent",
  ];
  return gradients[index % gradients.length];
};

const getMealAccent = (index: number) => {
  const accents = [
    "border-amber-500/20 hover:border-amber-500/40",
    "border-green-500/20 hover:border-green-500/40",
    "border-orange-500/20 hover:border-orange-500/40",
    "border-violet-500/20 hover:border-violet-500/40",
    "border-blue-500/20 hover:border-blue-500/40",
    "border-pink-500/20 hover:border-pink-500/40",
  ];
  return accents[index % accents.length];
};

const DietPlanner = () => {
  type MacronutrientData = { protein: string; carbs: string; fats: string };
  type Meal = { meal: string; items: string[] };
  type ImportantConsideration = { title: string; details: string };
  type DietPlan = {
    title: string;
    description: string;
    daily_caloric_intake: string;
    macronutrients: MacronutrientData;
    pre_workout_meal: string;
    post_workout_meal: string;
    meals: Meal[];
    important_considerations: ImportantConsideration[];
  };

  const router = useRouter();
  const [, setUserData] = useState(null);
  const [dietPlan, setDietPlan] = useState<DietPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedMeal, setExpandedMeal] = useState<number | null>(0);

  const fetchDietPlan = async () => {
    setLoading(true);
    setError("");
    const token = localStorage.getItem("token");

    if (!token) {
      setError("No token found. Please log in.");
      setLoading(false);
      return;
    }

    try {
      const userRes = await fetch("/api/user-data", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (userRes.status === 404) {
        setUserData(null);
        setLoading(false);
        return;
      }
      if (!userRes.ok) throw new Error("Failed to fetch user data.");
      const userData = await userRes.json();
      setUserData(userData);

      const dietRes = await fetch("/api/generate-diet", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          age: userData.age,
          height: userData.height,
          weight: userData.weight,
          goal: userData.goal,
          activityLevel: userData.activityLevel,
          dietaryPreferences: userData.dietaryPreferences || [],
        }),
      });

      if (!dietRes.ok) throw new Error("Failed to generate diet plan.");
      const dietData = await dietRes.json();
      setDietPlan(dietData.dietPlan);
    } catch (err) {
      console.error("Error fetching diet plan:", err);
      setError("An error occurred while fetching the diet plan.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDietPlan();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) return <LoadingSpinner message="Generating Diet Plan..." />;

  return (
    <AppShell
      title="Smart Diet Planner"
      subtitle="AI-generated meal plan tailored to your fitness goals and dietary preferences."
    >
      {error ? (
        /* ═══════ Error / No Plan State ═══════ */
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-3xl p-8 sm:p-14 text-center max-w-2xl mx-auto relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-brand-500/[0.03] to-transparent pointer-events-none" />
          <div className="relative z-10">
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="w-20 h-20 rounded-3xl bg-gradient-to-br from-brand-400/20 to-brand-600/20 border border-brand-500/20 flex items-center justify-center mx-auto mb-8"
            >
              <Utensils size={32} className="text-brand-400" />
            </motion.div>
            <h2 className="text-2xl font-bold text-white mb-3">
              Generate a Workout Plan First
            </h2>
            <p className="text-surface-400 text-sm mb-8 max-w-md mx-auto">
              Your diet plan is generated based on your workout profile. Create a
              workout plan first, and we&apos;ll build a personalized nutrition
              guide for you.
            </p>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => router.push("/workout-details")}
              className="px-8 py-3.5 rounded-xl btn-glow text-black font-semibold text-sm inline-flex items-center gap-2"
            >
              Create Workout Plan
              <ArrowRight size={16} />
            </motion.button>
          </div>
        </motion.div>
      ) : dietPlan ? (
        /* ═══════ Diet Plan View — Premium Redesign ═══════ */
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="space-y-8"
        >
          {/* ── Hero Header ── */}
          <div className="relative glass rounded-3xl p-8 sm:p-10 overflow-hidden">
            <div className="absolute -top-20 -right-20 w-72 h-72 bg-gradient-to-br from-emerald-500/10 to-amber-500/5 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-tr from-brand-500/5 to-transparent rounded-full blur-2xl pointer-events-none" />

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="relative z-10 flex items-center gap-3 mb-4"
            >
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                <Utensils size={22} className="text-white" />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest text-emerald-400 font-semibold">Your Nutrition Plan</p>
                <h2 className="text-xl sm:text-2xl font-bold text-white leading-tight">
                  {dietPlan.title}
                </h2>
              </div>
            </motion.div>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="relative z-10 text-surface-400 text-sm leading-relaxed max-w-3xl"
            >
              {dietPlan.description}
            </motion.p>
          </div>

          {/* ── Macro Rings ── */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <MacroRing
              value={dietPlan?.daily_caloric_intake || "-"}
              label="Calories"
              color="from-orange-500"
              icon={<Flame size={20} className="text-orange-400" />}
              delay={0}
            />
            <MacroRing
              value={dietPlan?.macronutrients?.protein || "-"}
              label="Protein"
              color="from-red-500"
              icon={<Beef size={20} className="text-red-400" />}
              delay={0.08}
            />
            <MacroRing
              value={dietPlan?.macronutrients?.carbs || "-"}
              label="Carbs"
              color="from-amber-500"
              icon={<Wheat size={20} className="text-amber-400" />}
              delay={0.16}
            />
            <MacroRing
              value={dietPlan?.macronutrients?.fats || "-"}
              label="Fats"
              color="from-green-500"
              icon={<Droplets size={20} className="text-green-400" />}
              delay={0.24}
            />
          </div>

          {/* ── Pre/Post Workout Meals ── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { title: "⚡ Pre-Workout Fuel", data: dietPlan.pre_workout_meal, gradient: "from-amber-500/10 to-transparent", accent: "border-amber-500/20" },
              { title: "🔥 Post-Workout Recovery", data: dietPlan.post_workout_meal, gradient: "from-emerald-500/10 to-transparent", accent: "border-emerald-500/20" },
            ].map((section, idx) => (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * idx + 0.3 }}
                className={`glass rounded-2xl p-6 relative overflow-hidden border ${section.accent} transition-all`}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${section.gradient} pointer-events-none`} />
                <div className="relative z-10">
                  <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                    {section.title}
                  </h3>
                  <p className="text-xs text-surface-300 leading-relaxed">{section.data}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* ═══════ Daily Meal Plan — Accordion Cards ═══════ */}
          <div>
            <div className="flex items-center gap-2 mb-5">
              <Sparkles size={18} className="text-brand-400" />
              <h3 className="text-lg font-bold text-white">Daily Meal Plan</h3>
              <span className="text-xs text-surface-500 ml-auto">{dietPlan?.meals?.length || 0} meals</span>
            </div>

            <div className="space-y-3">
              {(dietPlan?.meals || []).map((mealData, index) => {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const m = mealData as any;
                const title = m?.meal || m?.name || m?.title || m?.type || `Meal ${index + 1}`;
                const rawItems = m?.items || m?.foods || m?.options || m?.food;
                const itemsList = Array.isArray(rawItems) ? rawItems : (typeof rawItems === "string" ? [rawItems] : []);
                const isExpanded = expandedMeal === index;

                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.06 }}
                    className={`glass rounded-2xl overflow-hidden transition-all border ${getMealAccent(index)}`}
                  >
                    {/* Meal Header */}
                    <button
                      onClick={() => setExpandedMeal(isExpanded ? null : index)}
                      className="w-full flex items-center gap-4 p-5 hover:bg-white/[0.01] transition-colors"
                    >
                      <div className="w-10 h-10 rounded-xl bg-white/[0.04] flex items-center justify-center shrink-0">
                        {getMealIcon(title)}
                      </div>
                      <div className="flex-1 text-left">
                        <p className="text-white font-bold text-sm">{title}</p>
                        <p className="text-surface-500 text-xs mt-0.5">
                          {itemsList.length} item{itemsList.length !== 1 ? "s" : ""}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-[10px] px-2.5 py-1 rounded-lg bg-white/5 text-surface-400 border border-white/10">
                          <Clock size={10} className="inline mr-1" />
                          Meal {index + 1}
                        </span>
                        <motion.div
                          animate={{ rotate: isExpanded ? 180 : 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <ChevronDown size={16} className="text-surface-500" />
                        </motion.div>
                      </div>
                    </button>

                    {/* Expanded items */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25 }}
                          className="overflow-hidden"
                        >
                          <div className={`px-5 pb-5 pt-2 border-t border-white/5 relative`}>
                            <div className={`absolute inset-0 bg-gradient-to-b ${getMealGradient(index)} pointer-events-none`} />
                            <div className="relative z-10 space-y-2">
                              {itemsList.length > 0 ? (
                                itemsList.map((food: string, i: number) => (
                                  <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.04 }}
                                    className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/5 group hover:border-white/10 transition-all"
                                  >
                                    <div className="w-6 h-6 rounded-md bg-white/[0.05] flex items-center justify-center shrink-0 mt-0.5">
                                      <span className="text-brand-400 text-[10px] font-bold">{i + 1}</span>
                                    </div>
                                    <p className="text-sm text-surface-300 group-hover:text-white transition-colors leading-relaxed">
                                      {food}
                                    </p>
                                  </motion.div>
                                ))
                              ) : (
                                <p className="text-sm text-surface-500 italic py-2">No specific items listed</p>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* ── Important Considerations ── */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="glass rounded-2xl p-6"
          >
            <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
              <AlertTriangle size={14} className="text-amber-400" />
              Important Considerations
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {(dietPlan?.important_considerations || []).map(
                (consideration, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 * index + 0.5 }}
                    className="p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:border-amber-500/20 transition-all group"
                  >
                    <p className="text-sm font-semibold text-white group-hover:text-amber-300 transition-colors">
                      {consideration?.title || "Note"}
                    </p>
                    <p className="text-xs text-surface-500 mt-1 leading-relaxed">
                      {consideration?.details || ""}
                    </p>
                  </motion.div>
                )
              )}
            </div>
          </motion.div>

          {/* Back button */}
          <div className="text-center pt-2 pb-4">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => router.push("/dashboard")}
              className="px-6 py-2.5 rounded-xl text-sm text-surface-400 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-all"
            >
              Back to Dashboard
            </motion.button>
          </div>
        </motion.div>
      ) : null}
    </AppShell>
  );
};

export default DietPlanner;
