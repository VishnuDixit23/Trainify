"use client";

import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { motion, AnimatePresence } from "framer-motion";
import exercisesDataRaw from "../data/exercises.json";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Search,
  Plus,
  X,
  Trash2,
  Save,
  CalendarCheck,
  Filter,
  Dumbbell,
  ChevronRight,
  Sparkles,
  Layers,
  GripVertical,
  Zap,
} from "lucide-react";
import AppShell from "../components/AppShell";
import LoadingSpinner from "../components/ui/LoadingSpinner";

/* ─── Types ─── */
interface Exercise {
  id: string;
  name: string;
  muscleGroup: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  images: string[];
  sets?: number;
  reps?: number;
  weight?: number;
  restTime?: number;
  notes?: string;
  day: string;
}

interface Routine {
  id: string;
  name: string;
  title: string;
  exercises: Exercise[];
}

const exercisesData: Exercise[] = exercisesDataRaw.map((exercise) => ({
  id: exercise.id,
  name: exercise.name,
  muscleGroup: exercise.primaryMuscles[0] || "General",
  difficulty: exercise.level as "Beginner" | "Intermediate" | "Advanced",
  images: exercise.images || [],
  sets: 3,
  reps: 10,
  weight: 0,
  restTime: 60,
  notes: "",
  day: "",
}));

const daysOfWeek = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const dayColors: Record<string, string> = {
  Monday: "from-blue-500 to-cyan-400",
  Tuesday: "from-violet-500 to-purple-400",
  Wednesday: "from-emerald-500 to-green-400",
  Thursday: "from-amber-500 to-orange-400",
  Friday: "from-rose-500 to-pink-400",
  Saturday: "from-sky-500 to-indigo-400",
  Sunday: "from-brand-500 to-brand-400",
};

const dayEmoji: Record<string, string> = {
  Monday: "💪",
  Tuesday: "🔥",
  Wednesday: "⚡",
  Thursday: "🏋️",
  Friday: "🎯",
  Saturday: "🚀",
  Sunday: "🧘",
};

const difficultyColors: Record<string, string> = {
  Beginner: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
  Intermediate: "text-amber-400 bg-amber-500/10 border-amber-500/20",
  Advanced: "text-rose-400 bg-rose-500/10 border-rose-500/20",
};

export default function CreateRoutinePage() {
  const [routine, setRoutine] = useState<Routine | null>(null);
  const existingRoutine: Routine | null = routine;
  const [loading, setLoading] = useState(true);
  const [routineTitle, setRoutineTitle] = useState("");
  const [selectedExercises, setSelectedExercises] = useState<
    Record<string, Exercise[]>
  >({});
  const [searchTerm, setSearchTerm] = useState("");
  const [muscleFilter, setMuscleFilter] = useState("All");
  const [difficultyFilter, setDifficultyFilter] = useState("All");
  const [currentDay, setCurrentDay] = useState("Monday");
  const [showLibrary, setShowLibrary] = useState(false);

  useEffect(() => {
    async function fetchRoutine() {
      setLoading(true);
      try {
        const response = await fetch("/api/routines/get-user-routine", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setRoutine(data);
        } else {
          setRoutine(null);
        }
      } catch (error) {
        console.error("Error fetching routine:", error);
      }
      setLoading(false);
    }
    fetchRoutine();
  }, []);

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete your routine?")) return;

    try {
      const response = await fetch("/api/routines/delete-routine", {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.ok) {
        toast.success("Routine deleted successfully!");
        setRoutine(null);
      } else {
        toast.error("Failed to delete routine.");
      }
    } catch (error) {
      console.error("Error deleting routine:", error);
    }
  };

  const addExercise = (exercise: Exercise) => {
    const newExercise: Exercise = {
      ...exercise,
      sets: 3,
      reps: 10,
      weight: 0,
      restTime: 60,
      notes: "",
    };
    setSelectedExercises((prev) => ({
      ...prev,
      [currentDay]: [...(prev[currentDay] || []), newExercise],
    }));
    toast.success(`Added ${exercise.name} to ${currentDay}`, { autoClose: 1500 });
  };

  const removeExercise = (day: string, id: string) => {
    setSelectedExercises((prev) => {
      const updatedDay = prev[day]?.filter((ex) => ex.id !== id) || [];
      return { ...prev, [day]: updatedDay };
    });
  };

  const updateExercise = (
    day: string,
    id: string,
    field: keyof Exercise,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    value: any
  ) => {
    setSelectedExercises((prev) => ({
      ...prev,
      [day]:
        prev[day]?.map((ex) =>
          ex.id === id ? { ...ex, [field]: value } : ex
        ) || [],
    }));
  };

  const saveRoutine = async () => {
    if (!routineTitle.trim()) {
      toast.error("Please enter a routine title.");
      return;
    }

    const routineData = {
      routineName: routineTitle.trim(),
      exercises: Object.entries(selectedExercises).flatMap(([day, exercises]) =>
        exercises.map((ex) => ({ ...ex, day }))
      ),
    };

    const filteredExercises = Object.values(selectedExercises)
      .flat()
      .filter((ex) => ex !== undefined);

    if (filteredExercises.length === 0) {
      toast.error("Please add exercises before saving.");
      return;
    }

    const newRoutine: Routine = {
      id: uuidv4(),
      name: routineTitle,
      exercises: filteredExercises,
      title: "",
    };

    try {
      const response = await fetch("/api/routines/create-routine", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(routineData),
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(`Failed to save routine: ${errorMessage}`);
      }

      toast.success("Routine saved successfully!");
      setRoutine(newRoutine);
      setRoutineTitle("");
      setSelectedExercises({});
    } catch (error) {
      console.error("Error saving routine:", error);
      toast.error("Failed to save routine. Please try again.");
    }
  };

  const filteredExercises = exercisesData.filter((exercise) => {
    const matchesSearch = exercise.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesMuscle =
      muscleFilter === "All" || exercise.muscleGroup === muscleFilter;
    const matchesDifficulty =
      difficultyFilter === "All" ||
      exercise.difficulty.toLowerCase() === difficultyFilter.toLowerCase();
    return matchesSearch && matchesMuscle && matchesDifficulty;
  });

  const totalExercises = Object.values(selectedExercises).flat().length;
  const daysWithExercises = Object.keys(selectedExercises).filter(
    (d) => (selectedExercises[d]?.length || 0) > 0
  ).length;

  if (loading) return <LoadingSpinner message="Loading Routines..." />;

  return (
    <AppShell
      title="Custom Routines"
      subtitle="Build your own weekly training split from 800+ exercises."
    >
      <ToastContainer theme="dark" />

      {existingRoutine ? (
        /* ═══════ Existing Routine View ═══════ */
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="glass rounded-2xl p-6 sm:p-8 flex items-start justify-between flex-wrap gap-4">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <CalendarCheck size={20} className="text-brand-400" />
                {existingRoutine.title || existingRoutine.name || "My Routine"}
              </h2>
              <p className="text-surface-400 text-sm mt-1">
                Your saved weekly training split
              </p>
            </div>
            <button
              onClick={handleDelete}
              className="flex items-center gap-2 px-4 py-2 text-sm text-red-400 hover:text-red-300 bg-red-500/10 hover:bg-red-500/15 border border-red-500/20 rounded-xl transition-all"
            >
              <Trash2 size={14} />
              Delete Routine
            </button>
          </div>

          {Object.entries(
            existingRoutine.exercises.reduce<Record<string, Exercise[]>>(
              (acc, ex) => {
                if (!acc[ex.day]) acc[ex.day] = [];
                acc[ex.day].push(ex);
                return acc;
              },
              {}
            )
          ).map(([day, exercises]) => (
            <div key={day}>
              <h3 className="text-sm font-semibold text-brand-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                <span>{dayEmoji[day] || "📋"}</span>
                {day}
                <span className="text-surface-500 normal-case font-normal">
                  · {exercises.length} exercises
                </span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {exercises.map((ex, index) => (
                  <motion.div
                    key={ex.id || index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="glass rounded-xl overflow-hidden group hover:border-brand-500/20 transition-all"
                  >
                    <img
                      src={`/exercises/${ex.id}/0.jpg`}
                      alt={ex.name}
                      className="w-full h-36 object-cover opacity-60 group-hover:opacity-80 transition-opacity"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = "none";
                      }}
                    />
                    <div className="p-4">
                      <p className="text-sm font-semibold text-white truncate">
                        {ex.name}
                      </p>
                      <p className="text-xs text-surface-500 mt-0.5">
                        {ex.muscleGroup}
                      </p>
                      <p className="text-xs text-surface-400 mt-2">
                        {ex.sets} sets · {ex.reps} reps · {ex.weight} kg
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
        </motion.div>
      ) : (
        /* ═══════ Create Routine — Premium Redesign ═══════ */
        <div className="relative">
          {/* Ambient decoration */}
          <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-brand-500/[0.03] rounded-full blur-[120px] pointer-events-none" />

          <div className="relative z-10 space-y-6">
            {/* ── Hero Stats Bar ── */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-2 sm:grid-cols-4 gap-3"
            >
              {[
                { label: "Title", value: routineTitle || "Untitled", icon: <Sparkles size={16} />, color: "text-brand-400" },
                { label: "Exercises", value: totalExercises.toString(), icon: <Dumbbell size={16} />, color: "text-blue-400" },
                { label: "Active Days", value: `${daysWithExercises}/7`, icon: <CalendarCheck size={16} />, color: "text-emerald-400" },
                { label: "Current Day", value: currentDay, icon: <Zap size={16} />, color: "text-amber-400" },
              ].map((stat) => (
                <div key={stat.label} className="glass rounded-xl p-4 text-center">
                  <div className={`${stat.color} flex justify-center mb-1.5`}>{stat.icon}</div>
                  <p className="text-white font-bold text-sm truncate">{stat.value}</p>
                  <p className="text-surface-500 text-[10px] uppercase tracking-wider mt-0.5">{stat.label}</p>
                </div>
              ))}
            </motion.div>

            {/* ── Title Input with flair ── */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="glass rounded-2xl p-6 relative overflow-hidden"
            >
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-gradient-to-br from-brand-500/10 to-transparent rounded-full blur-2xl pointer-events-none" />
              <label className="block text-xs font-medium text-surface-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                <Layers size={14} className="text-brand-400" />
                Routine Name
              </label>
              <input
                type="text"
                placeholder="e.g., Push Pull Legs, 5-Day Upper/Lower"
                value={routineTitle}
                onChange={(e) => setRoutineTitle(e.target.value)}
                className="w-full px-5 py-3.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-base placeholder-surface-600 focus:outline-none focus:border-brand-500/40 focus:bg-white/[0.06] transition-all"
              />
            </motion.div>

            {/* ── Day Selector — Visual Cards ── */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.15 }}
            >
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-medium text-surface-400 uppercase tracking-wider">Select Day</p>
                <button
                  onClick={() => setShowLibrary(!showLibrary)}
                  className="flex items-center gap-1.5 text-xs text-brand-400 hover:text-brand-300 transition-colors lg:hidden"
                >
                  <Filter size={12} />
                  {showLibrary ? "Hide" : "Show"} Library
                </button>
              </div>
              <div className="grid grid-cols-7 gap-2">
                {daysOfWeek.map((day) => {
                  const count = selectedExercises[day]?.length || 0;
                  const isActive = currentDay === day;

                  return (
                    <motion.button
                      key={day}
                      onClick={() => setCurrentDay(day)}
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.96 }}
                      className={`relative p-3 rounded-xl text-center transition-all duration-200 border ${
                        isActive
                          ? `bg-gradient-to-br ${dayColors[day]} border-transparent shadow-lg`
                          : count > 0
                          ? "bg-white/[0.04] border-brand-500/20 hover:bg-white/[0.07]"
                          : "bg-white/[0.02] border-white/5 hover:bg-white/[0.05]"
                      }`}
                    >
                      <span className="text-lg block mb-0.5">{dayEmoji[day]}</span>
                      <span className={`text-[10px] font-bold block ${isActive ? "text-white" : "text-surface-400"}`}>
                        {day.slice(0, 3).toUpperCase()}
                      </span>
                      {count > 0 && (
                        <motion.span
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className={`absolute -top-1 -right-1 w-5 h-5 rounded-full text-[9px] font-bold flex items-center justify-center ${
                            isActive ? "bg-white text-black" : "bg-brand-500/30 text-brand-300"
                          }`}
                        >
                          {count}
                        </motion.span>
                      )}
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>

            <div className="flex flex-col lg:flex-row gap-6">
              {/* ── Left: Current Day's Exercises ── */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="flex-1"
              >
                <div className="glass rounded-2xl p-6 min-h-[300px]">
                  <div className="flex items-center justify-between mb-5">
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      <span>{dayEmoji[currentDay]}</span>
                      {currentDay}&apos;s Plan
                    </h3>
                    <span className="text-xs text-surface-500">
                      {selectedExercises[currentDay]?.length || 0} exercises
                    </span>
                  </div>

                  <AnimatePresence mode="popLayout">
                    {selectedExercises[currentDay]?.length ? (
                      <div className="space-y-3">
                        {selectedExercises[currentDay].map((ex, idx) => (
                          <motion.div
                            key={ex.id + idx}
                            layout
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20, scale: 0.95 }}
                            transition={{ delay: idx * 0.03 }}
                            className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/5 hover:border-brand-500/20 transition-all group"
                          >
                            <div className="shrink-0 text-surface-700 group-hover:text-surface-500 transition-colors">
                              <GripVertical size={14} />
                            </div>
                            <img
                              src={`/exercises/${ex.id}/0.jpg`}
                              alt={ex.name}
                              className="w-12 h-12 rounded-lg object-cover border border-white/10"
                              onError={(e) => {
                                (e.target as HTMLImageElement).style.display = "none";
                              }}
                            />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-white truncate">
                                {ex.name}
                              </p>
                              <p className="text-[10px] text-surface-500 capitalize">
                                {ex.muscleGroup} · {ex.difficulty}
                              </p>
                              <div className="flex items-center gap-2 mt-1.5">
                                {[
                                  { label: "Sets", field: "sets" as keyof Exercise, value: ex.sets },
                                  { label: "Reps", field: "reps" as keyof Exercise, value: ex.reps },
                                  { label: "kg", field: "weight" as keyof Exercise, value: ex.weight },
                                ].map((inp) => (
                                  <div key={inp.label} className="flex items-center gap-1">
                                    <input
                                      type="number"
                                      value={inp.value}
                                      onChange={(e) =>
                                        updateExercise(
                                          currentDay,
                                          ex.id,
                                          inp.field,
                                          Number(e.target.value)
                                        )
                                      }
                                      className="w-11 px-1 py-0.5 rounded-md bg-white/5 border border-white/10 text-white text-[11px] text-center focus:outline-none focus:border-brand-500/40"
                                    />
                                    <span className="text-[9px] text-surface-600">{inp.label}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                            <button
                              onClick={() => removeExercise(currentDay, ex.id)}
                              className="text-surface-600 hover:text-red-400 transition-colors shrink-0 opacity-0 group-hover:opacity-100"
                            >
                              <X size={16} />
                            </button>
                          </motion.div>
                        ))}
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-[280px] text-center">
                        <motion.div
                          animate={{ y: [0, -8, 0] }}
                          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                          className="w-16 h-16 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center justify-center mb-4"
                        >
                          <Dumbbell size={24} className="text-surface-600" />
                        </motion.div>
                        <p className="text-surface-500 text-sm font-medium">No exercises yet</p>
                        <p className="text-surface-600 text-xs mt-1">
                          Pick exercises from the library to add here
                        </p>
                        <button
                          onClick={() => setShowLibrary(true)}
                          className="mt-4 text-xs text-brand-400 hover:text-brand-300 flex items-center gap-1 transition-colors lg:hidden"
                        >
                          Open Exercise Library <ChevronRight size={12} />
                        </button>
                      </div>
                    )}
                  </AnimatePresence>
                </div>

                {/* ── Save Button ── */}
                <motion.button
                  onClick={saveRoutine}
                  disabled={totalExercises === 0 || !routineTitle.trim()}
                  whileHover={totalExercises > 0 && routineTitle.trim() ? { scale: 1.01 } : {}}
                  whileTap={totalExercises > 0 && routineTitle.trim() ? { scale: 0.99 } : {}}
                  className={`mt-5 w-full py-3.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all ${
                    totalExercises > 0 && routineTitle.trim()
                      ? "btn-glow text-black animate-pulse-glow"
                      : "bg-white/5 text-surface-500 border border-white/10 cursor-not-allowed"
                  }`}
                >
                  <Save size={16} />
                  Save Routine
                  {totalExercises > 0 && (
                    <span className="ml-1 px-2 py-0.5 rounded-lg bg-black/20 text-[10px] font-bold">
                      {totalExercises} exercises
                    </span>
                  )}
                </motion.button>
              </motion.div>

              {/* ── Right: Exercise Library ── */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.25 }}
                className={`w-full lg:w-[380px] glass rounded-2xl p-5 ${
                  showLibrary ? "block" : "hidden lg:block"
                }`}
              >
                <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
                  <Filter size={14} className="text-brand-400" />
                  Exercise Library
                  <span className="text-xs text-surface-500 font-normal ml-auto">
                    {filteredExercises.length} found
                  </span>
                </h3>

                {/* Search */}
                <div className="relative mb-3">
                  <Search
                    size={14}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-600"
                  />
                  <input
                    type="text"
                    placeholder="Search exercises..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-surface-600 text-sm focus:outline-none focus:border-brand-500/40"
                  />
                </div>

                {/* Filters */}
                <div className="flex gap-2 mb-4">
                  <select
                    value={muscleFilter}
                    onChange={(e) => setMuscleFilter(e.target.value)}
                    className="flex-1 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-surface-300 text-xs focus:outline-none focus:border-brand-500/40 appearance-none"
                  >
                    <option value="All" className="bg-surface-900">All Muscles</option>
                    {Array.from(new Set(exercisesData.map((ex) => ex.muscleGroup))).map((muscle) => (
                      <option key={muscle} value={muscle} className="bg-surface-900">{muscle}</option>
                    ))}
                  </select>
                  <select
                    value={difficultyFilter}
                    onChange={(e) => setDifficultyFilter(e.target.value)}
                    className="flex-1 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-surface-300 text-xs focus:outline-none focus:border-brand-500/40 appearance-none"
                  >
                    <option value="All" className="bg-surface-900">All Levels</option>
                    <option value="Beginner" className="bg-surface-900">Beginner</option>
                    <option value="Intermediate" className="bg-surface-900">Intermediate</option>
                    <option value="Advanced" className="bg-surface-900">Advanced</option>
                  </select>
                </div>

                {/* Exercise List */}
                <div className="h-[300px] overflow-y-auto space-y-2 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent pr-1">
                  {filteredExercises.slice(0, 50).map((exercise, i) => (
                    <motion.div
                      key={exercise.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.02 }}
                      className="flex items-center gap-3 p-2.5 rounded-xl bg-white/[0.02] border border-white/5 hover:border-brand-500/20 transition-all group cursor-pointer"
                      onClick={() => addExercise(exercise)}
                    >
                      <img
                        src={`/exercises/${exercise.id}/0.jpg`}
                        alt={exercise.name}
                        className="w-12 h-12 rounded-lg object-cover border border-white/10 group-hover:border-brand-500/30 transition-colors"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = "none";
                        }}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-surface-300 group-hover:text-white truncate transition-colors">
                          {exercise.name}
                        </p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[10px] text-surface-600">
                            {exercise.muscleGroup}
                          </span>
                          <span className={`text-[9px] px-1.5 py-0.5 rounded-md border ${difficultyColors[exercise.difficulty]}`}>
                            {exercise.difficulty}
                          </span>
                        </div>
                      </div>
                      <div className="text-brand-500 opacity-0 group-hover:opacity-100 transition-all shrink-0 w-7 h-7 rounded-lg bg-brand-500/10 flex items-center justify-center">
                        <Plus size={14} />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
}
