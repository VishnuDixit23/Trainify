/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { motion, AnimatePresence } from "framer-motion";
import {
  Check,
  X,
  Save,
  PartyPopper,
  StickyNote,
  Target,
  Activity,
  Trophy,
  Flame,
  Zap,
  TrendingUp,
  Clock,
  ChevronDown,
  ChevronUp,
  Dumbbell,
  Heart,
  Sparkles,
} from "lucide-react";
import AppShell from "../components/AppShell";
import LoadingSpinner from "../components/ui/LoadingSpinner";

/* ────── Circular Progress Ring ────── */
const ProgressRing = ({ progress, size = 120 }: { progress: number; size?: number }) => {
  const strokeWidth = 6;
  const r = (size - strokeWidth * 2) / 2;
  const circumference = 2 * Math.PI * r;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2} cy={size / 2} r={r}
          fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth={strokeWidth}
        />
        <motion.circle
          cx={size / 2} cy={size / 2} r={r}
          fill="none" stroke="url(#progressGrad)" strokeWidth={strokeWidth} strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
        />
        <defs>
          <linearGradient id="progressGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#c49628" />
            <stop offset="50%" stopColor="#22c55e" />
            <stop offset="100%" stopColor="#3b82f6" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span
          className="text-2xl font-bold text-white"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6 }}
        >
          {progress}%
        </motion.span>
        <span className="text-[10px] text-surface-500 uppercase tracking-wider">Done</span>
      </div>
    </div>
  );
};

/* ────── Motivational Quotes ────── */
const motivationalQuotes = [
  "The only bad workout is the one that didn't happen.",
  "Push harder than yesterday if you want a different tomorrow.",
  "Your body achieves what your mind believes.",
  "Sweat is fat crying. Keep going.",
  "Champions train, losers complain.",
  "Be stronger than your strongest excuse.",
];

export default function TrackMyJourney() {
  const router = useRouter();

  interface Workout {
    exercise: string;
    sets: number;
    reps: number;
    actualSets?: number;
    actualReps?: number;
    notes?: string;
    completed?: boolean;
  }

  const [loggedExercises, setLoggedExercises] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);
  const [isRestDay, setIsRestDay] = useState(false);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);
  const [showConfetti, setShowConfetti] = useState(false);

  const quote = motivationalQuotes[Math.floor(new Date().getDate() % motivationalQuotes.length)];

  useEffect(() => {
    async function fetchWorkouts() {
      const token = localStorage.getItem("token");
      if (!token) {
        console.warn("No token found! Skipping API call.");
        setLoading(false);
        return;
      }

      try {
        const res = await fetch("/api/track/fetch-plan", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }

        const text = await res.text();
        const data = JSON.parse(text);

        if (String(data.day.day).includes("Rest")) {
          setIsRestDay(true);
          setLoggedExercises([]);
        } else if (Array.isArray(data.day.workouts)) {
          const initializedWorkouts = data.day.workouts.map(
            (exercise: Workout) => ({
              ...exercise,
              actualSets: exercise.actualSets ?? exercise.sets,
              actualReps: exercise.actualReps ?? exercise.reps,
              notes: exercise.notes ?? "",
              completed: exercise.completed ?? false,
            })
          );
          setIsRestDay(false);
          setLoggedExercises(initializedWorkouts);
        } else {
          console.error("Unexpected response format:", data);
        }
      } catch (error) {
        console.error("Error fetching workouts:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchWorkouts();
  }, []);

  const updateExercise = (
    index: number,
    field: keyof Workout,
    value: string | number | boolean
  ) => {
    setLoggedExercises((prev) =>
      prev.map((ex, i) => (i === index ? { ...ex, [field]: value } : ex))
    );
  };

  const markAsCompleted = (index: number) => {
    setLoggedExercises((prev) =>
      prev.map((ex, i) =>
        i === index ? { ...ex, completed: !ex.completed } : ex
      )
    );
  };

  const saveLog = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Authentication required.");
      return;
    }

    const today = new Date().toISOString().split("T")[0];
    const payload = {
      exercises: loggedExercises.map((ex) => ({
        ...ex,
        actualSets: Number(ex.actualSets),
        actualReps: Number(ex.actualReps),
      })),
      date: today,
    };

    try {
      const res = await fetch("/api/track/save-log", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Error submitting log! ${errorText}`);
      }

      toast.success("Workout log submitted successfully!", {
        position: "top-right",
        autoClose: 3000,
      });

      if (progressPercent === 100) {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 3000);
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to submit log. Try again.");
    }
  };

  const completedCount = loggedExercises.filter((ex) => ex.completed).length;
  const totalCount = loggedExercises.length;
  const progressPercent =
    totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  if (loading)
    return <LoadingSpinner message="Loading Today's Workout..." />;

  return (
    <AppShell
      title="Track My Journey"
      subtitle="Log your daily workout progress and stay consistent."
    >
      <ToastContainer theme="dark" />

      {isRestDay ? (
        /* ═══════ Rest Day — Premium ═══════ */
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-lg mx-auto"
        >
          <div className="glass rounded-3xl p-10 sm:p-14 text-center relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/[0.03] via-transparent to-blue-500/[0.03] pointer-events-none" />
            <div className="absolute top-6 right-6 text-6xl opacity-10 pointer-events-none">🧘</div>

            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="w-20 h-20 rounded-3xl bg-gradient-to-br from-emerald-500/20 to-blue-500/20 border border-emerald-500/20 flex items-center justify-center mx-auto mb-8"
            >
              <PartyPopper size={32} className="text-emerald-400" />
            </motion.div>

            <h2 className="text-3xl font-bold text-white mb-3">
              It&apos;s Rest Day!
            </h2>
            <p className="text-surface-400 text-sm mb-3 max-w-sm mx-auto">
              Recovery is key to progress. Your muscles grow during rest — you&apos;ve earned this.
            </p>
            <p className="text-surface-500 text-xs italic mb-8 max-w-sm mx-auto">
              &ldquo;{quote}&rdquo;
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={() => router.push("/dashboard")}
                className="px-6 py-2.5 rounded-xl text-sm text-surface-400 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-all"
              >
                Back to Dashboard
              </button>
              <button
                onClick={() => router.push("/routines")}
                className="px-6 py-2.5 rounded-xl text-sm btn-glow text-black font-semibold"
              >
                📋 View Routines
              </button>
            </div>
          </div>
        </motion.div>
      ) : (
        /* ═══════ Workout Tracking — Premium ═══════ */
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* ── Hero Progress Section ── */}
          <div className="glass rounded-3xl p-6 sm:p-8 relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute -top-20 -right-20 w-60 h-60 bg-gradient-to-br from-brand-500/[0.05] to-transparent rounded-full blur-3xl pointer-events-none" />

            <div className="flex flex-col sm:flex-row items-center gap-6">
              {/* Progress Ring */}
              <div className="shrink-0">
                <ProgressRing progress={progressPercent} />
              </div>

              {/* Stats Grid */}
              <div className="flex-1 w-full">
                <div className="flex items-center gap-2 mb-1">
                  <Activity size={16} className="text-brand-400" />
                  <h3 className="text-lg font-bold text-white">Today&apos;s Progress</h3>
                </div>
                <p className="text-surface-500 text-xs italic mb-4">&ldquo;{quote}&rdquo;</p>

                <div className="grid grid-cols-3 gap-3">
                  {[
                    {
                      label: "Completed",
                      value: completedCount,
                      icon: <Check size={14} />,
                      color: "text-emerald-400",
                      bg: "bg-emerald-500/10",
                    },
                    {
                      label: "Remaining",
                      value: totalCount - completedCount,
                      icon: <Clock size={14} />,
                      color: "text-amber-400",
                      bg: "bg-amber-500/10",
                    },
                    {
                      label: "Total",
                      value: totalCount,
                      icon: <Dumbbell size={14} />,
                      color: "text-blue-400",
                      bg: "bg-blue-500/10",
                    },
                  ].map((stat) => (
                    <div
                      key={stat.label}
                      className="rounded-xl bg-white/[0.03] border border-white/5 p-3 text-center"
                    >
                      <div className={`${stat.color} ${stat.bg} w-8 h-8 rounded-lg flex items-center justify-center mx-auto mb-1.5`}>
                        {stat.icon}
                      </div>
                      <p className="text-white font-bold text-lg">{stat.value}</p>
                      <p className="text-surface-500 text-[10px] uppercase tracking-wider">{stat.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Linear progress bar */}
            <div className="mt-6">
              <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{
                    background: `linear-gradient(90deg, #c49628, ${
                      progressPercent >= 100 ? "#22c55e" : progressPercent > 50 ? "#3b82f6" : "#c49628"
                    })`
                  }}
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercent}%` }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                />
              </div>
            </div>
          </div>

          {/* ── Exercise Cards ── */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-surface-300 uppercase tracking-wider flex items-center gap-2">
                <Sparkles size={14} className="text-brand-400" />
                Exercises
              </h3>
              <span className="text-xs text-surface-500">
                {completedCount}/{totalCount} done
              </span>
            </div>

            {loggedExercises.map((exercise, index) => {
              const isExpanded = expandedIndex === index;
              const setsMatch = exercise.actualSets === exercise.sets;
              const repsMatch = exercise.actualReps === exercise.reps;
              const exceeded = (exercise.actualSets || 0) > exercise.sets || (exercise.actualReps || 0) > exercise.reps;

              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.06 }}
                  className={`glass rounded-2xl overflow-hidden transition-all duration-300 ${
                    exercise.completed
                      ? "border-emerald-500/20 bg-emerald-500/[0.02]"
                      : ""
                  }`}
                >
                  {/* ── Collapsed Header ── */}
                  <button
                    onClick={() => setExpandedIndex(isExpanded ? null : index)}
                    className="w-full flex items-center gap-4 p-4 sm:p-5 hover:bg-white/[0.01] transition-colors text-left"
                  >
                    {/* Completion checkbox */}
                    <motion.div
                      whileTap={{ scale: 0.85 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        markAsCompleted(index);
                      }}
                      className={`shrink-0 w-10 h-10 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
                        exercise.completed
                          ? "bg-gradient-to-br from-emerald-500 to-green-400 shadow-lg shadow-emerald-500/20"
                          : "bg-white/5 border border-white/10 hover:border-emerald-500/30"
                      }`}
                    >
                      {exercise.completed ? (
                        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                          <Check size={18} className="text-white" />
                        </motion.div>
                      ) : (
                        <span className="text-surface-600 text-sm font-bold">{index + 1}</span>
                      )}
                    </motion.div>

                    {/* Exercise info */}
                    <div className="flex-1 min-w-0">
                      <h4 className={`font-semibold text-sm truncate transition-colors ${
                        exercise.completed ? "text-emerald-300 line-through" : "text-white"
                      }`}>
                        {exercise.exercise || "Unnamed Exercise"}
                      </h4>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-xs text-surface-500 flex items-center gap-1">
                          <Target size={10} />
                          {exercise.sets}×{exercise.reps}
                        </span>
                        {exercise.completed && (
                          <span className="text-[10px] px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            ✓ Done
                          </span>
                        )}
                        {exceeded && exercise.completed && (
                          <span className="text-[10px] px-2 py-0.5 rounded-md bg-brand-500/10 text-brand-400 border border-brand-500/20 flex items-center gap-0.5">
                            <TrendingUp size={8} /> Exceeded!
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Expand icon */}
                    <div className="shrink-0 text-surface-500">
                      {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </div>
                  </button>

                  {/* ── Expanded Details ── */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="overflow-hidden"
                      >
                        <div className="px-4 sm:px-5 pb-5 pt-1 border-t border-white/5">
                          {/* Target vs Achieved */}
                          <div className="grid grid-cols-2 gap-4 mt-3">
                            <div className="rounded-xl bg-white/[0.02] border border-white/5 p-4">
                              <p className="text-[10px] uppercase tracking-wider text-surface-500 mb-2.5 flex items-center gap-1.5">
                                <Target size={10} className="text-surface-400" />
                                Target
                              </p>
                              <div className="flex items-baseline gap-1">
                                <span className="text-2xl font-bold text-white">{exercise.sets}</span>
                                <span className="text-surface-500 text-xs">sets</span>
                                <span className="text-surface-600 text-xs mx-1">×</span>
                                <span className="text-2xl font-bold text-white">{exercise.reps}</span>
                                <span className="text-surface-500 text-xs">reps</span>
                              </div>
                            </div>

                            <div className={`rounded-xl border p-4 ${
                              exercise.completed
                                ? exceeded
                                  ? "bg-brand-500/[0.03] border-brand-500/20"
                                  : "bg-emerald-500/[0.03] border-emerald-500/20"
                                : "bg-white/[0.02] border-white/5"
                            }`}>
                              <p className="text-[10px] uppercase tracking-wider text-surface-500 mb-2.5 flex items-center gap-1.5">
                                <Flame size={10} className="text-brand-400" />
                                Achieved
                              </p>
                              <div className="flex items-center gap-2">
                                <input
                                  type="number"
                                  min="0"
                                  value={exercise.actualSets}
                                  onChange={(e) =>
                                    updateExercise(index, "actualSets", Number(e.target.value))
                                  }
                                  className="w-16 px-2 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-base font-bold focus:outline-none focus:border-brand-500/40 text-center"
                                />
                                <span className="text-surface-600 text-sm">×</span>
                                <input
                                  type="number"
                                  min="0"
                                  value={exercise.actualReps}
                                  onChange={(e) =>
                                    updateExercise(index, "actualReps", Number(e.target.value))
                                  }
                                  className="w-16 px-2 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-base font-bold focus:outline-none focus:border-brand-500/40 text-center"
                                />
                              </div>
                            </div>
                          </div>

                          {/* Notes field */}
                          <div className="mt-4">
                            <label className="text-[10px] uppercase tracking-wider text-surface-500 mb-1.5 flex items-center gap-1.5">
                              <StickyNote size={10} />
                              Notes
                            </label>
                            <input
                              type="text"
                              placeholder="How did it feel? Any observations..."
                              value={exercise.notes}
                              onChange={(e) =>
                                updateExercise(index, "notes", e.target.value)
                              }
                              className="w-full px-4 py-2.5 bg-white/[0.03] border border-white/5 rounded-xl text-surface-300 text-xs placeholder-surface-600 focus:outline-none focus:border-brand-500/30 transition-colors"
                            />
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>

          {/* ── Submit Button ── */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-center pt-4 pb-2"
          >
            <motion.button
              onClick={saveLog}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`px-10 py-4 rounded-2xl font-semibold text-sm inline-flex items-center gap-2.5 transition-all ${
                progressPercent === 100
                  ? "btn-glow text-black animate-pulse-glow text-base"
                  : "btn-glow text-black"
              }`}
            >
              {progressPercent === 100 ? (
                <>
                  <Trophy size={18} />
                  Complete Workout! 🎉
                </>
              ) : (
                <>
                  <Save size={16} />
                  Submit Workout Log
                </>
              )}
            </motion.button>

            {progressPercent < 100 && progressPercent > 0 && (
              <p className="text-surface-500 text-xs mt-3">
                {totalCount - completedCount} exercise{totalCount - completedCount !== 1 ? "s" : ""} remaining — keep pushing!
              </p>
            )}
          </motion.div>
        </motion.div>
      )}
    </AppShell>
  );
}
