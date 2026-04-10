/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dumbbell,
  Trash2,
  Clock,
  AlertTriangle,
  Flame,
  ChevronDown,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  User,
  Activity,
  Target,
  Heart,
  Check,
  Zap,
  Trophy,
  Weight,
  Ruler,
  Calendar,
} from "lucide-react";
import AppShell from "../components/AppShell";
import LoadingSpinner from "../components/ui/LoadingSpinner";

/* ───────────── Step configuration ───────────── */
interface StepField {
  key: string;
  label: string;
  type: "number" | "select" | "text";
  placeholder?: string;
  options?: string[];
  icon: React.ReactNode;
  unit?: string;
}

interface Step {
  id: number;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  color: string;
  fields: StepField[];
}

const STEPS: Step[] = [
  {
    id: 1,
    title: "Your Profile",
    subtitle: "Tell us about your body measurements",
    icon: <User size={22} />,
    color: "from-blue-500 to-cyan-400",
    fields: [
      { key: "age", label: "Age", type: "number", placeholder: "e.g. 25", icon: <Calendar size={18} />, unit: "years" },
      { key: "height", label: "Height", type: "number", placeholder: "e.g. 175", icon: <Ruler size={18} />, unit: "cm" },
      { key: "weight", label: "Weight", type: "number", placeholder: "e.g. 70", icon: <Weight size={18} />, unit: "kg" },
      { key: "gender", label: "Gender", type: "select", options: ["Male", "Female", "Other"], icon: <User size={18} /> },
    ],
  },
  {
    id: 2,
    title: "Activity & Experience",
    subtitle: "How active are you currently?",
    icon: <Activity size={22} />,
    color: "from-emerald-500 to-green-400",
    fields: [
      { key: "activityLevel", label: "Activity Level", type: "select", options: ["Sedentary", "Lightly Active", "Moderately Active", "Very Active"], icon: <Activity size={18} /> },
      { key: "fitnessExperience", label: "Fitness Experience", type: "select", options: ["Beginner", "Intermediate", "Advanced"], icon: <Trophy size={18} /> },
      { key: "activityType", label: "Preferred Activity", type: "select", options: ["Strength Training", "Cardio", "Yoga", "Pilates"], icon: <Zap size={18} /> },
    ],
  },
  {
    id: 3,
    title: "Goals & Preferences",
    subtitle: "What do you want to achieve?",
    icon: <Target size={22} />,
    color: "from-amber-500 to-orange-400",
    fields: [
      { key: "goal", label: "Fitness Goal", type: "select", options: ["Lose Weight", "Gain Muscle", "Improve Stamina", "Maintain Fitness"], icon: <Target size={18} /> },
      { key: "equipment", label: "Available Equipment", type: "select", options: ["Full Gym Equipment", "Minimal Equipment", "No Equipment"], icon: <Dumbbell size={18} /> },
      { key: "programSpecificity", label: "Program Focus", type: "select", options: ["Strength Training", "Cardiovascular Health", "Flexibility and Mobility", "Rehabilitation"], icon: <Flame size={18} /> },
    ],
  },
  {
    id: 4,
    title: "Health & Diet",
    subtitle: "Any dietary preferences or conditions?",
    icon: <Heart size={22} />,
    color: "from-rose-500 to-pink-400",
    fields: [
      { key: "dietaryPreferences", label: "Dietary Preference", type: "select", options: ["Vegetarian", "Non-Vegetarian", "Vegan"], icon: <Heart size={18} /> },
      { key: "medicalConditions", label: "Medical Conditions", type: "text", placeholder: "e.g. None, back pain, asthma...", icon: <AlertTriangle size={18} /> },
    ],
  },
];

/* ───────────── Floating particles ───────────── */
const FloatingParticle = ({ delay, x, y, size }: { delay: number; x: number; y: number; size: number }) => (
  <motion.div
    className="absolute rounded-full bg-brand-500/10 pointer-events-none"
    style={{ width: size, height: size, left: `${x}%`, top: `${y}%` }}
    animate={{
      y: [0, -30, 0],
      opacity: [0.1, 0.3, 0.1],
      scale: [1, 1.2, 1],
    }}
    transition={{
      duration: 5 + Math.random() * 3,
      repeat: Infinity,
      delay,
      ease: "easeInOut",
    }}
  />
);

/* ───────────── Progress Ring ───────────── */
const ProgressRing = ({ progress, size = 60 }: { progress: number; size?: number }) => {
  const r = (size - 6) / 2;
  const circumference = 2 * Math.PI * r;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <svg width={size} height={size} className="transform -rotate-90">
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth={4} />
      <motion.circle
        cx={size / 2} cy={size / 2} r={r} fill="none"
        stroke="url(#goldGradient)" strokeWidth={4} strokeLinecap="round"
        strokeDasharray={circumference}
        initial={{ strokeDashoffset: circumference }}
        animate={{ strokeDashoffset: offset }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
      />
      <defs>
        <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#c49628" />
          <stop offset="100%" stopColor="#b5821e" />
        </linearGradient>
      </defs>
    </svg>
  );
};


/* ═══════════════ Main Component ═══════════════ */
const WorkoutDetailsPage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    age: "", height: "", weight: "", gender: "",
    activityLevel: "", fitnessExperience: "", goal: "",
    medicalConditions: "", dietaryPreferences: "",
    activityType: "", equipment: "", programSpecificity: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [existingPlan, setExistingPlan] = useState<any>(null);
  const [expandedDays, setExpandedDays] = useState<Set<number>>(new Set());
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [direction, setDirection] = useState(1); // 1 = forward, -1 = back

  useEffect(() => {
    const fetchWorkoutPlan = async () => {
      setLoading(true);
      try {
        const response = await fetch("/api/get-user-workout", {
          method: "GET",
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.data) {
            setExistingPlan(data.data);
            setExpandedDays(new Set([0, 1]));
          } else {
            setExistingPlan(null);
          }
        }
      } catch (err) {
        console.error("Error fetching workout plan:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchWorkoutPlan();
  }, []);

  const handleDeletePlan = async () => {
    setLoading(true);
    setError("");
    setConfirmDelete(false);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/delete-workout", {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) {
        throw new Error(`Failed to delete. Status: ${response.status}`);
      }
      setExistingPlan(null);
    } catch (err: any) {
      setError(err.message || "Failed to delete workout plan.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (key: string, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/get-workout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(formData),
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to generate workout plan. ${errorText}`);
      }
      const data = await response.json();
      setExistingPlan({ workoutPlan: data.workoutPlan });
      setExpandedDays(new Set([0, 1]));
    } catch (err: any) {
      setError(err.message || "Failed to generate workout plan.");
    } finally {
      setLoading(false);
    }
  };

  const toggleDay = (index: number) => {
    setExpandedDays((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  };

  const nextStep = useCallback(() => {
    if (currentStep < STEPS.length - 1) {
      setDirection(1);
      setCurrentStep((s) => s + 1);
    }
  }, [currentStep]);

  const prevStep = useCallback(() => {
    if (currentStep > 0) {
      setDirection(-1);
      setCurrentStep((s) => s - 1);
    }
  }, [currentStep]);

  const isStepComplete = (stepIndex: number) => {
    const step = STEPS[stepIndex];
    return step.fields.every((f) => {
      if (f.key === "medicalConditions") return true; // optional
      return (formData as any)[f.key]?.toString().trim() !== "";
    });
  };

  const allStepsComplete = STEPS.every((_, i) => isStepComplete(i));
  const progress = ((STEPS.filter((_, i) => isStepComplete(i)).length) / STEPS.length) * 100;

  const stepVariants = {
    enter: (dir: number) => ({ x: dir > 0 ? 80 : -80, opacity: 0, scale: 0.96 }),
    center: { x: 0, opacity: 1, scale: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? -80 : 80, opacity: 0, scale: 0.96 }),
  };

  if (loading) return <LoadingSpinner message="Loading Workout Plan..." />;

  return (
    <AppShell
      title="AI Workout Plans"
      subtitle="Generate a personalized workout plan powered by AI, tailored to your body and goals."
    >
      {existingPlan ? (
        /* ═══════ Existing Plan View — Premium Redesign ═══════ */
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="space-y-8"
        >
          {/* ── Hero Header with gradient ── */}
          <div className="relative glass rounded-3xl p-8 sm:p-10 overflow-hidden">
            <div className="absolute -top-20 -right-20 w-72 h-72 bg-gradient-to-br from-brand-500/10 to-amber-500/5 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-tr from-blue-500/5 to-transparent rounded-full blur-2xl pointer-events-none" />

            <div className="relative z-10 flex flex-col sm:flex-row items-start justify-between gap-6">
              <div className="flex-1">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center gap-3 mb-4"
                >
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center shadow-lg shadow-brand-500/20">
                    <Dumbbell size={22} className="text-black" />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-brand-400 font-semibold">Your Program</p>
                    <h2 className="text-xl sm:text-2xl font-bold text-white leading-tight">
                      {existingPlan.workoutPlan.title}
                    </h2>
                  </div>
                </motion.div>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="text-surface-400 text-sm leading-relaxed max-w-2xl"
                >
                  {existingPlan.workoutPlan.description}
                </motion.p>
              </div>

              {!confirmDelete ? (
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setConfirmDelete(true)}
                  className="shrink-0 flex items-center gap-2 px-4 py-2.5 text-sm text-red-400 hover:text-red-300 bg-red-500/10 hover:bg-red-500/15 border border-red-500/20 rounded-xl transition-all"
                >
                  <Trash2 size={14} />
                  Delete Plan
                </motion.button>
              ) : (
                <div className="shrink-0 flex items-center gap-2">
                  <button onClick={() => setConfirmDelete(false)} className="px-4 py-2 text-sm text-surface-400 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all">Cancel</button>
                  <button onClick={handleDeletePlan} className="flex items-center gap-2 px-4 py-2 text-sm text-white bg-red-600 hover:bg-red-500 rounded-xl transition-all animate-pulse"><Trash2 size={14} /> Confirm?</button>
                </div>
              )}
            </div>

            {/* Quick stats */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="relative z-10 grid grid-cols-3 gap-3 mt-8"
            >
              {[
                { label: "Training Days", value: existingPlan.workoutPlan.schedule?.filter((d: any) => !d.day?.toLowerCase().includes("rest")).length || 0, icon: <Flame size={16} />, color: "text-orange-400", bg: "bg-orange-500/10" },
                { label: "Rest Days", value: existingPlan.workoutPlan.schedule?.filter((d: any) => d.day?.toLowerCase().includes("rest")).length || 0, icon: <Clock size={16} />, color: "text-emerald-400", bg: "bg-emerald-500/10" },
                { label: "Total Exercises", value: existingPlan.workoutPlan.schedule?.reduce((acc: number, d: any) => acc + (d.workouts?.length || 0), 0) || 0, icon: <Zap size={16} />, color: "text-blue-400", bg: "bg-blue-500/10" },
              ].map((stat) => (
                <div key={stat.label} className="rounded-xl bg-white/[0.03] border border-white/5 p-4 text-center">
                  <div className={`${stat.color} ${stat.bg} w-9 h-9 rounded-xl flex items-center justify-center mx-auto mb-2`}>{stat.icon}</div>
                  <p className="text-white font-bold text-xl">{stat.value}</p>
                  <p className="text-surface-500 text-[10px] uppercase tracking-wider mt-0.5">{stat.label}</p>
                </div>
              ))}
            </motion.div>
          </div>

          {/* ── Warm-up & Cool-down — Horizontal cards ── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { title: "🔥 Warm-up Protocol", data: existingPlan.workoutPlan.warm_up, gradient: "from-orange-500/10 to-transparent" },
              { title: "🧊 Cool-down Protocol", data: existingPlan.workoutPlan.cool_down, gradient: "from-blue-500/10 to-transparent" },
            ].map((section, idx) => (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * idx + 0.4 }}
                className="glass rounded-2xl p-6 relative overflow-hidden"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${section.gradient} pointer-events-none`} />
                <div className="relative z-10">
                  <h3 className="text-sm font-bold text-white mb-3">{section.title}</h3>
                  {typeof section.data === "string" ? (
                    <p className="text-xs text-surface-300 leading-relaxed">{section.data}</p>
                  ) : Array.isArray(section.data) ? (
                    <ul className="space-y-1.5">
                      {section.data.map((item: any, i: number) => (
                        <li key={i} className="text-xs text-surface-300 flex gap-1.5">
                          <span className="text-brand-500 font-bold shrink-0">{i + 1}.</span>
                          <span><strong className="text-white">{item.exercise}</strong> — {item.duration}</span>
                        </li>
                      ))}
                    </ul>
                  ) : <p className="text-xs text-surface-500 italic">Not provided</p>}
                </div>
              </motion.div>
            ))}
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
              {existingPlan.workoutPlan.important_considerations?.map(
                (item: any, index: number) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 * index + 0.5 }}
                    className="p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:border-amber-500/20 transition-all group"
                  >
                    <p className="text-sm font-semibold text-white group-hover:text-amber-300 transition-colors">{item.title}</p>
                    <p className="text-xs text-surface-500 mt-1 leading-relaxed">{item.details}</p>
                  </motion.div>
                )
              )}
            </div>
          </motion.div>

          {/* ═══════ Workout Schedule — Premium Day Cards ═══════ */}
          <div>
            <div className="flex items-center gap-2 mb-5">
              <Sparkles size={18} className="text-brand-400" />
              <h3 className="text-lg font-bold text-white">Weekly Schedule</h3>
            </div>

            <div className="space-y-4">
              {existingPlan.workoutPlan.schedule.map(
                (day: any, dayIndex: number) => {
                  const isRest = day.day?.toLowerCase().includes("rest") || day.day?.toLowerCase().includes("recovery");
                  const isExpanded = expandedDays.has(dayIndex);
                  const exerciseCount = day.workouts?.length || 0;
                  const dayGradients = [
                    "from-blue-500", "from-emerald-500", "from-violet-500",
                    "from-amber-500", "from-rose-500", "from-sky-500", "from-brand-500"
                  ];
                  const gradientColor = dayGradients[dayIndex % dayGradients.length];

                  return (
                    <motion.div
                      key={dayIndex}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: dayIndex * 0.06 }}
                      className="glass rounded-2xl overflow-hidden"
                    >
                      {/* Day Header */}
                      <button
                        onClick={() => toggleDay(dayIndex)}
                        className="w-full flex items-center gap-4 p-5 hover:bg-white/[0.01] transition-colors"
                      >
                        {/* Colored accent bar */}
                        <div className={`w-1.5 h-12 rounded-full bg-gradient-to-b ${gradientColor} to-transparent shrink-0`} />

                        <div className="flex-1 text-left">
                          <p className="text-white font-bold text-sm">{day.day}</p>
                          <p className="text-surface-500 text-xs mt-0.5">
                            {isRest ? "Active Recovery & Mobility" : `${exerciseCount} exercises`}
                          </p>
                        </div>

                        <div className="flex items-center gap-3 shrink-0">
                          {!isRest && (
                            <span className={`text-[10px] px-2.5 py-1 rounded-lg bg-gradient-to-r ${gradientColor} to-transparent/10 text-white font-semibold`}>
                              {exerciseCount} moves
                            </span>
                          )}
                          {isRest && (
                            <span className="text-[10px] px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                              🧘 Rest
                            </span>
                          )}
                          <motion.div
                            animate={{ rotate: isExpanded ? 180 : 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            <ChevronDown size={16} className="text-surface-500" />
                          </motion.div>
                        </div>
                      </button>

                      {/* Exercises */}
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.25 }}
                            className="overflow-hidden"
                          >
                            <div className="px-5 pb-5 pt-1 border-t border-white/5 space-y-2">
                              {day.workouts?.map((workout: any, index: number) => (
                                <motion.div
                                  key={index}
                                  initial={{ opacity: 0, x: -15 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: index * 0.04 }}
                                  className="flex items-center gap-3 p-3.5 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all group"
                                >
                                  {/* Exercise number */}
                                  <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${gradientColor} to-transparent/20 flex items-center justify-center shrink-0`}>
                                    <span className="text-white text-xs font-bold">{index + 1}</span>
                                  </div>

                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-white truncate group-hover:text-brand-300 transition-colors">
                                      {workout.exercise}
                                    </p>
                                  </div>

                                  {/* Reps & Sets badges */}
                                  <div className="flex items-center gap-1.5 shrink-0">
                                    <span className="text-[10px] px-2 py-1 rounded-md bg-brand-500/10 text-brand-400 border border-brand-500/20 font-medium whitespace-nowrap">
                                      {workout.reps}
                                    </span>
                                    <span className="text-surface-600 text-[10px]">×</span>
                                    <span className="text-[10px] px-2 py-1 rounded-md bg-white/5 text-surface-300 border border-white/10 font-medium">
                                      {workout.sets} sets
                                    </span>
                                  </div>
                                </motion.div>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  );
                }
              )}
            </div>
          </div>
        </motion.div>
      ) : (
        /* ═══════════════════════════════════
           MULTI-STEP WIZARD FORM
           ═══════════════════════════════════ */
        <div className="relative">
          {/* Floating ambient particles */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <FloatingParticle delay={0} x={10} y={20} size={80} />
            <FloatingParticle delay={1.5} x={85} y={10} size={60} />
            <FloatingParticle delay={3} x={70} y={70} size={100} />
            <FloatingParticle delay={2} x={20} y={80} size={50} />
            <FloatingParticle delay={4} x={50} y={40} size={70} />
          </div>

          <div className="relative z-10 max-w-4xl mx-auto">
            {/* ── Top: Progress indicator ── */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-between mb-10"
            >
              {/* Step indicators */}
              <div className="flex items-center gap-3 flex-1">
                {STEPS.map((step, i) => (
                  <React.Fragment key={step.id}>
                    <button
                      onClick={() => { setDirection(i > currentStep ? 1 : -1); setCurrentStep(i); }}
                      className="relative group"
                    >
                      <motion.div
                        className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                          i === currentStep
                            ? "bg-gradient-to-br " + step.color + " shadow-lg shadow-brand-500/20"
                            : isStepComplete(i)
                            ? "bg-brand-500/20 border border-brand-500/30"
                            : "bg-white/5 border border-white/10"
                        }`}
                        whileHover={{ scale: 1.08 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {isStepComplete(i) && i !== currentStep ? (
                          <Check size={18} className="text-brand-400" />
                        ) : (
                          <span className={`text-sm font-bold ${i === currentStep ? "text-white" : "text-surface-400"}`}>
                            {step.id}
                          </span>
                        )}
                      </motion.div>

                      {/* Tooltip */}
                      <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                        <span className="text-xs text-surface-400">{step.title}</span>
                      </div>
                    </button>

                    {/* Connector line */}
                    {i < STEPS.length - 1 && (
                      <div className="flex-1 h-[2px] bg-white/5 rounded-full overflow-hidden hidden sm:block">
                        <motion.div
                          className="h-full bg-gradient-to-r from-brand-500 to-brand-400"
                          initial={{ width: "0%" }}
                          animate={{ width: isStepComplete(i) ? "100%" : "0%" }}
                          transition={{ duration: 0.4 }}
                        />
                      </div>
                    )}
                  </React.Fragment>
                ))}
              </div>

              {/* Circular progress */}
              <div className="relative ml-6 hidden sm:block">
                <ProgressRing progress={progress} />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xs font-bold text-brand-400">{Math.round(progress)}%</span>
                </div>
              </div>
            </motion.div>

            {/* ── Step Content Card ── */}
            <div className="relative overflow-hidden">
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={currentStep}
                  custom={direction}
                  variants={stepVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
                >
                  <div className="glass rounded-3xl p-8 sm:p-10 relative overflow-hidden">
                    {/* Decorative gradient blob */}
                    <div className={`absolute -top-20 -right-20 w-60 h-60 rounded-full bg-gradient-to-br ${STEPS[currentStep].color} opacity-[0.04] blur-3xl pointer-events-none`} />

                    {/* Step header */}
                    <div className="flex items-center gap-4 mb-8">
                      <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${STEPS[currentStep].color} flex items-center justify-center shadow-lg`}>
                        <span className="text-white">{STEPS[currentStep].icon}</span>
                      </div>
                      <div>
                        <h2 className="text-xl sm:text-2xl font-bold text-white">{STEPS[currentStep].title}</h2>
                        <p className="text-surface-400 text-sm mt-0.5">{STEPS[currentStep].subtitle}</p>
                      </div>
                    </div>

                    {/* Fields */}
                    <div className={`grid gap-6 ${STEPS[currentStep].fields.length >= 3 ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" : STEPS[currentStep].fields.length === 2 ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-1"}`}>
                      {STEPS[currentStep].fields.map((field, fIndex) => {
                        const value = (formData as any)[field.key] || "";
                        const isFilled = value.toString().trim() !== "";

                        return (
                          <motion.div
                            key={field.key}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: fIndex * 0.08, duration: 0.35 }}
                          >
                            <label className="block text-xs font-medium text-surface-400 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                              <span className={`${isFilled ? "text-brand-400" : "text-surface-500"} transition-colors`}>
                                {field.icon}
                              </span>
                              {field.label}
                              {isFilled && (
                                <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="ml-auto">
                                  <Check size={12} className="text-green-400" />
                                </motion.span>
                              )}
                            </label>

                            {field.type === "select" ? (
                              /* ── Visual Chip selector ── */
                              <div className="flex flex-wrap gap-2">
                                {field.options!.map((option) => (
                                  <motion.button
                                    key={option}
                                    type="button"
                                    onClick={() => handleChange(field.key, option)}
                                    className={`px-3.5 py-2 rounded-xl text-sm font-medium transition-all duration-200 border ${
                                      value === option
                                        ? "bg-brand-500/20 border-brand-500/40 text-brand-300 shadow-lg shadow-brand-500/10"
                                        : "bg-white/[0.03] border-white/10 text-surface-400 hover:bg-white/[0.06] hover:border-white/20 hover:text-white"
                                    }`}
                                    whileHover={{ scale: 1.03 }}
                                    whileTap={{ scale: 0.97 }}
                                  >
                                    {value === option && (
                                      <motion.span
                                        initial={{ width: 0, marginRight: 0 }}
                                        animate={{ width: "auto", marginRight: 6 }}
                                        className="inline-block overflow-hidden"
                                      >
                                        <Check size={12} className="text-brand-400" />
                                      </motion.span>
                                    )}
                                    {option}
                                  </motion.button>
                                ))}
                              </div>
                            ) : (
                              /* ── Text / Number input ── */
                              <div className="relative group">
                                <input
                                  type={field.type}
                                  value={value}
                                  onChange={(e) => handleChange(field.key, e.target.value)}
                                  placeholder={field.placeholder}
                                  className={`w-full px-4 py-3.5 rounded-xl bg-white/[0.03] border text-white placeholder-surface-600 text-sm transition-all duration-200 focus:outline-none ${
                                    isFilled
                                      ? "border-brand-500/30 bg-brand-500/[0.03]"
                                      : "border-white/10 focus:border-brand-500/40 focus:bg-white/[0.06]"
                                  }`}
                                />
                                {field.unit && (
                                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-surface-500 font-medium">
                                    {field.unit}
                                  </span>
                                )}
                              </div>
                            )}
                          </motion.div>
                        );
                      })}
                    </div>

                    {/* Error */}
                    {error && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-6 p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center"
                      >
                        {error}
                      </motion.div>
                    )}

                    {/* Navigation */}
                    <div className="flex items-center justify-between mt-10 pt-6 border-t border-white/5">
                      <button
                        type="button"
                        onClick={prevStep}
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                          currentStep === 0
                            ? "opacity-0 pointer-events-none"
                            : "text-surface-400 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10"
                        }`}
                      >
                        <ArrowLeft size={14} />
                        Back
                      </button>

                      {currentStep < STEPS.length - 1 ? (
                        <motion.button
                          type="button"
                          onClick={nextStep}
                          className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition-all ${
                            isStepComplete(currentStep)
                              ? "btn-glow text-black"
                              : "bg-white/5 text-surface-400 border border-white/10"
                          }`}
                          whileHover={isStepComplete(currentStep) ? { scale: 1.02 } : {}}
                          whileTap={isStepComplete(currentStep) ? { scale: 0.98 } : {}}
                        >
                          Continue
                          <ArrowRight size={14} />
                        </motion.button>
                      ) : (
                        <motion.button
                          type="button"
                          onClick={handleSubmit}
                          disabled={!allStepsComplete}
                          className={`flex items-center gap-2 px-8 py-3.5 rounded-xl text-sm font-semibold transition-all ${
                            allStepsComplete
                              ? "btn-glow text-black animate-pulse-glow"
                              : "bg-white/5 text-surface-500 border border-white/10 cursor-not-allowed"
                          }`}
                          whileHover={allStepsComplete ? { scale: 1.03 } : {}}
                          whileTap={allStepsComplete ? { scale: 0.97 } : {}}
                        >
                          <Sparkles size={16} />
                          Generate Workout Plan
                        </motion.button>
                      )}
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* ── Bottom: Quick summary ── */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="mt-8 glass rounded-2xl p-5"
            >
              <div className="flex items-center gap-3 mb-3">
                <Sparkles size={14} className="text-brand-400" />
                <span className="text-xs font-semibold text-surface-300 uppercase tracking-wider">Your Selections</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {Object.entries(formData).map(([key, val]) => {
                  if (!val) return null;
                  return (
                    <motion.span
                      key={key}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="px-3 py-1.5 rounded-lg bg-brand-500/10 border border-brand-500/20 text-brand-300 text-xs font-medium"
                    >
                      {val}
                    </motion.span>
                  );
                })}
                {Object.values(formData).every((v) => !v) && (
                  <span className="text-xs text-surface-500 italic">Start filling in your details above...</span>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AppShell>
  );
};

export default WorkoutDetailsPage;
