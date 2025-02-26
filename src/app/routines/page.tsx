"use client";

import { useState,useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { motion , useAnimation } from "framer-motion";
import exercisesDataRaw from "../data/exercises.json";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useInView } from "react-intersection-observer";

// Define Exercise Type
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
  day:""
}));

export default function CreateRoutinePage() {
  const [routine, setRoutine] = useState<Routine | null>(null);
  const existingRoutine: Routine | null = routine;
  const [loading, setLoading] = useState(true);
  const [routineTitle, setRoutineTitle] = useState("");
  const [selectedExercises, setSelectedExercises] = useState<Record<string, Exercise[]>>({});
  const [searchTerm, setSearchTerm] = useState("");
  const [muscleFilter, setMuscleFilter] = useState("All");
  const [difficultyFilter, setDifficultyFilter] = useState("All");
  const [currentDay, setCurrentDay] = useState("Monday");  ///
  const [routineName, setRoutineName] = useState("");

  
  useEffect(() => {
    async function fetchRoutine() {
      setLoading(true);
      try {
        const response = await fetch("/api/routines/get-user-routine", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
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
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      if (response.ok) {
        toast.success("Routine deleted successfully!", {
      position: "top-right",
      autoClose: 3000,
    });
        setRoutine(null); // Reset routine state
      } else {
        toast.error("Failed to submit log. Try again.");
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
  };

  const removeExercise = (day: string, id: string) => {
    setSelectedExercises((prev) => {
      const updatedDay = prev[day]?.filter((ex) => ex.id !== id) || [];
      return updatedDay.length > 0 ? { ...prev, [day]: updatedDay } : { ...prev, [day]: [] };
    });
  };

  const updateExercise = (day: string, id: string, field: keyof Exercise, value: any) => {
    setSelectedExercises((prev) => ({
      ...prev,
      [day]: prev[day]?.map((ex) => (ex.id === id ? { ...ex, [field]: value } : ex)) || [],
    }));
  };

  const saveRoutine = async () => {
    console.log("saveRoutine function is running");

    if (!routineTitle.trim()) {
      toast.error("Please enter a routine title.");
      return;
    }

    const routineData = {
      routineName: routineTitle.trim(),
      exercises: Object.entries(selectedExercises)
          .flatMap(([day, exercises]) => 
              exercises.map(ex => ({ ...ex, day })) // Attach day key to each exercise
          ),
  };
  
    const filteredExercises = Object.values(selectedExercises).flat().filter((ex) => ex !== undefined);

    if (filteredExercises.length === 0) {
      toast.error("Please add exercises before saving.");
      return;
    }

    const newRoutine: Routine = {
      id: uuidv4(),
      name: routineTitle,
      exercises: filteredExercises,
      title: ""
    };

    console.log("Attempting to save Routine:", newRoutine);

    const yourToken = localStorage.getItem("token");

    
    try {
      const response = await fetch("/api/routines/create-routine", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${yourToken}`,
        },
        body: JSON.stringify(routineData),
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(`Failed to save routine: ${errorMessage}`);
      }

      console.log("Routine saved successfully!");
      toast.success("Routine saved successfully!", {
        position: "top-right",
        autoClose: 3000,
      });;

      setRoutineTitle("");
      setSelectedExercises({});
    } catch (error) {
      console.error("Error saving routine:", error);
      toast.error("Failed to save routine. Please try again.");
    }
  };
    
  const filteredExercises = exercisesData.filter((exercise) => {
    const matchesSearch = exercise.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesMuscle = muscleFilter === "All" || exercise.muscleGroup === muscleFilter;
    const matchesDifficulty =
      difficultyFilter === "All" ||
      exercise.difficulty.toLowerCase() === difficultyFilter.toLowerCase();
    return matchesSearch && matchesMuscle && matchesDifficulty;
  });

  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-900 text-stone-400 p-6 flex flex-col items-center">
        <motion.div
          className="min-h-screen flex items-center justify-center bg-black/80 backdrop-blur-md fixed inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex flex-col items-center gap-4">
            {/* Animated Loader Ring */}
            <motion.div
            
              className="w-16 h-16 border-t-4 border-stone-400 border-opacity-50 rounded-full animate-spin"
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
            />
  
            {/* Loading Text Animation */}
            <motion.p
              className="text-lg font-semibold text-stone-300 tracking-widest"
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
            >
              Loading Routines...
            </motion.p>
          </div>
        </motion.div>
      </div>
    );
  }
  return (
    <div className="flex flex-col min-h-screen p-8 bg-gradient-to-br from-stone-900 via-black to-stone-800 text-stone-300">
    {existingRoutine ? (
      <motion.div
        className="flex-1 bg-gradient-to-br from-stone-800 via-stone-900 to-black p-6 rounded-2xl shadow-lg w-full max-w-full mx-auto"
      >
        <h2 className="text-3xl font-bold text-stone-300 mb-6">Existing Routine</h2>
        <p className="text-lg font-semibold text-stone-400">{existingRoutine.title}</p>
  
        {/* Group exercises by day */}
        {Object.entries(
          existingRoutine.exercises.reduce<Record<string, Exercise[]>>((acc, ex) => {
            if (!acc[ex.day]) acc[ex.day] = [];
            acc[ex.day].push(ex);
            return acc;
          }, {})
        ).map(([day, exercises]: [string, Exercise[]]) => (
          <div key={day} className="mb-6">
            <h3 className="text-2xl font-semibold text-stone-300 mb-3">{day}</h3>
            
            {/* Grid layout for exercises */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 place-items-center">
       {exercises.map((ex: Exercise, index: number) => (
        <motion.div
      key={ex.id || index}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      whileHover={{ scale: 1.05, boxShadow: "0px 0px 12px rgba(255, 255, 255, 0.2)" }}
      className="bg-stone-700 p-4 rounded-xl border border-stone-600 shadow-md flex flex-col items-center text-center w-full max-w-sm"
    >
      <img
        src={`/exercises/${ex.id}/0.jpg`}
        alt={ex.name}
        className="w-full h-48 rounded-lg object-cover mb-3 border"
      />
      <p className="font-extrabold text-2xl text-stone-300">{ex.name}</p>
      <p className="text-stone-400">Muscle Group: {ex.muscleGroup}</p>
      <p className="text-sm text-stone-300">{ex.sets} Sets - {ex.reps} Reps - {ex.weight} kg</p>
    </motion.div>
  ))}
  </div>
  </div>
        ))}
  
        {/* Delete Button */}
        <div className="flex justify-center mt-8">
          <motion.button
            onClick={handleDelete}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
             className="mt-4 py-3 px-6 bg-red-400 text-stone-600 font-semibold rounded-lg shadow-md hover:bg-red-500 transform hover:scale-105 focus:outline-none"
          >
            Delete Routine
          </motion.button>
        </div>
      </motion.div>
    
   
    ) : (
      <>
       <div className="flex gap-8 p-6">
      <motion.div className="flex-1 bg-gradient-to-br from-stone-700 via-stone-800 to-black  p-8 rounded-2xl shadow-lg" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h2 className="text-3xl font-bold text-stone-300 mb-16">Create Routine</h2>
        <input
          type="text"
          placeholder="Workout Routine Title"
          value={routineTitle}
          onChange={(e) => setRoutineTitle(e.target.value)}
          className="w-full p-3  text-black border border-stone-800 rounded-lg focus:ring-2 focus:ring-stone-800"
        />
        <div className="flex gap-2 mt-6">
          {daysOfWeek.map((day) => (
            <button
              key={day}
              onClick={() => setCurrentDay(day)}
              className={`px-4 py-3 rounded-lg transition-all bg-gradient-to-br from-stone-300 via-stone-400 to-stone-500 hover:bg-stone-600 hover:text-white ${
                currentDay === day ? "bg-stone-600 text-white" : "bg-stone-200  text-gray-600"
              }`}
            >
              {day}
            </button>
          ))}
        </div>
        <div className="border rounded-lg p-6 min-h-[550px] bg-stone-50 mt-14 text-stone-500">
          {selectedExercises[currentDay]?.length ? (
            selectedExercises[currentDay].map((ex) => (
              <motion.div
                key={ex.id || ex.name}
                className="flex items-center justify-between font  md:p-6 space-y-3 bg-gradient-to-br from-stone-100 via-stone-200 to-stone-300 p-6 rounded-lg shadow-md border hover:shadow-xl transition-all mb-6"
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex items-center">
                  <img
                    src={`/exercises/${ex.id}/0.jpg`}
                    alt={ex.name}
                    className="w-22 h-20 rounded-lg object-cover mr-8"
                  />
                  <div>
                    <p className="font-extrabold text-lg">Exercise name:  {ex.name}</p>
                    <p className="text-xm text-gray-500">Muscle Group : {ex.muscleGroup}</p>
                    <div className="flex gap-2 mt-3">
                      <input
                        type="number"
                        value={ex.sets}
                        onChange={(e) => updateExercise(currentDay, ex.id, "sets", Number(e.target.value))}
                        className="w-10 p-1 border rounded"
                      />
                      Sets
                      <input
                        type="number"
                        value={ex.reps}
                        onChange={(e) => updateExercise(currentDay, ex.id, "reps", Number(e.target.value))}
                        className="w-11 p-1 border rounded"
                      />
                      Reps
                      <input
                        type="number"
                        value={ex.weight}
                        onChange={(e) => updateExercise(currentDay, ex.id, "weight", Number(e.target.value))}
                        className="w-12 p-1 border rounded"
                      />
                      kg
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => removeExercise(currentDay, ex.id)}
                  className="text-red-500 text-sm hover:underline hover:text-red-700"
                >
                  ✕ Remove
                </button>
              </motion.div>
            ))
          ) : (
            <p className="text-gray-500 text-center py-6 font-semibold">No Exercises Added</p>
          )}
        </div>
        <motion.button
          onClick={saveRoutine}
          className="bg-stone-400 text-black  px-5 py-3 mt-4 rounded-lg hover:bg-stone-700 hover:text-white transition-all"
          whileHover={{ scale: 1.05 }}
        >
          Save Routine
        </motion.button>
      </motion.div>

      {/* Exercise Library */}
      <motion.div className="w-1/3  bg-gradient-to-br from-stone-700 via-stone-800 to-black p-8 rounded-3xl shadow text-stone-500" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h3 className="text-2xl font-bold text-stone-300 mb-7">Exercise Library</h3>
        <input
          type="text"
          placeholder="Search Exercises..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-3 border border-gray-800 rounded-lg mb-8"
        />
        <div className="flex gap-4 mb-8">
          <select
            value={muscleFilter}
            onChange={(e) => setMuscleFilter(e.target.value)}
            className="w-1/2 p-3 space-y-2 border bg-stone-100 border-gray-300 rounded-lg"
          >
             <option value="All">All Muscle Groups</option>
              {Array.from(new Set(exercisesData.map((ex) => ex.muscleGroup))).map((muscle) => (
                <option key={muscle} value={muscle}>
                  {muscle}
                </option>
              ))}
            {/* Generate unique muscle groups */}
          </select>
          <select
            value={difficultyFilter}
            onChange={(e) => setDifficultyFilter(e.target.value)}
            className="w-1/2 p-3 space-y-2 border bg-stone-100 border-gray-300 rounded-lg"
          >
            <option value="All">All Levels</option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>
        </div>
        <div className="h-[600px] overflow-y-auto border border-stone-700 rounded-lg p-4 bg-stone-100">
          {filteredExercises.map((exercise) => (
            <motion.div
              key={exercise.id}
              className="flex items-center justify-between p-3 bg-stone-50 rounded-lg shadow-md mb-3 border hover:shadow-xl transition-all"
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-center">
                <img
                  src={`/exercises/${exercise.id}/0.jpg`}
                  alt={exercise.name}
                  className="w-22 h-20 rounded-lg object-cover mr-6"
                />
                <p className="font-semibold text-lg">{exercise.name}</p>
              </div>
              <button
                className="text-stone-600 font-semibold hover:underline hover:text-stone-900"
                onClick={() => addExercise(exercise)}
              >
                + Add
              </button>
            </motion.div>
          ))}
        </div>
      </motion.div>
      </div>
      </>
    )}
  </div>
  );
}
