"use client";

import { useState,useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { motion } from "framer-motion";
import exercisesDataRaw from "../data/exercises.json";

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
      const response = await fetch("/api/delete-user-routine", {
        method: "DELETE",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      if (response.ok) {
        alert("Routine deleted successfully!");
        setRoutine(null); // Reset routine state
      } else {
        alert("Failed to delete routine.");
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
      alert("Please enter a routine title.");
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
      alert("Please add exercises before saving.");
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
      alert("Routine saved successfully!");

      setRoutineTitle("");
      setSelectedExercises({});
    } catch (error) {
      console.error("Error saving routine:", error);
      alert("Failed to save routine. Please try again.");
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
  

  if (!existingRoutine) {
    return (
      <p className="text-center text-lg text-red-500">
        No routine found.
      </p>
    );
  }
  
  return (
    <div className="flex h-screen p-8 bg-gray-100 gap-8 text-stone-500">
      {/* Existing Routine Section */}
      <motion.div className="flex flex-col flex-1 bg-white p-8 rounded-2xl shadow-xl">
        <h2 className="text-3xl font-extrabold text-stone-500 mb-4">Existing Routine</h2>
        <p className="text-lg font-semibold">{existingRoutine?.title ?? ""}</p>
        <ul className="mt-4">
          {existingRoutine?.exercises?.map((ex) => (
            <li key={ex.id || ex.name} className="bg-white p-3 rounded-lg shadow-md border mb-2">
              <p className="font-medium text-lg">{ex.name}</p>
              <p className="text-sm text-gray-500">{ex.muscleGroup}</p>
              <p>{ex.sets} Sets - {ex.reps} Reps - {ex.weight} kg</p>
            </li>
          ))}
        </ul>
        <button
          onClick={handleDelete}
          className="mt-4 py-3 px-6 bg-red-400 text-stone-600 font-semibold rounded-lg shadow-md hover:bg-red-500 transform hover:scale-105 focus:outline-none"
          >
            Delete Routine
       
        </button>
      </motion.div>
  
      {/* Routine Builder */}
      <motion.div className="flex flex-col flex-1 bg-white p-8 rounded-2xl shadow-xl">
        <h2 className="text-3xl font-extrabold text-stone-500 mb-4">Create Routine</h2>
        <input
          type="text"
          placeholder="Workout Routine Title"
          value={routineTitle}
          onChange={(e) => setRoutineTitle(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        />
        <div className="flex gap-3 mt-4">
          {daysOfWeek.map((day) => (
            <button
              key={day}
              onClick={() => setCurrentDay(day)}
              className={`px-4 py-2 rounded-lg ${
                currentDay === day ? "bg-stone-500 text-white" : "bg-gray-200 text-gray-600"
              }`}
            >
              {day}
            </button>
          ))}
        </div>
        <div className="border rounded-lg p-4 min-h-[200px] bg-gray-50 mt-4 text-stone-500">
          {selectedExercises[currentDay]?.length ? (
            selectedExercises[currentDay].map((ex) => (
              <motion.div
                key={ex.id || ex.name}
                className="flex items-center justify-between bg-white p-3 rounded-lg shadow-md border"
              >
                <div className="flex items-center">
                  <img
                    src={`/exercises/${ex.id}/0.jpg`}
                    alt={ex.name}
                    className="w-14 h-14 rounded-lg object-cover mr-4"
                  />
                  <div>
                    <p className="font-medium text-lg">{ex.name}</p>
                    <p className="text-sm text-gray-500">{ex.muscleGroup}</p>
                    <input
                      type="number"
                      value={ex.sets}
                      onChange={(e) => updateExercise(currentDay, ex.id, "sets", Number(e.target.value))}
                      className="w-12 p-1 border rounded"
                    />{" "}
                    Sets
                    <input
                      type="number"
                      value={ex.reps}
                      onChange={(e) => updateExercise(currentDay, ex.id, "reps", Number(e.target.value))}
                      className="w-12 p-1 border rounded"
                    />{" "}
                    Reps
                    <input
                      type="number"
                      value={ex.weight}
                      onChange={(e) => updateExercise(currentDay, ex.id, "weight", Number(e.target.value))}
                      className="w-16 p-1 border rounded"
                    />{" "}
                    kg
                  </div>
                </div>
                <button
                  onClick={() => removeExercise(currentDay, ex.id)}
                  className="text-red-500 text-sm hover:underline"
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
          className="bg-stone-500 text-white px-5 py-3 mt-4 rounded-lg hover:bg-stone-700"
        >
          Save Routine
        </motion.button>
      </motion.div>
  
      {/* Exercise Library */}
      <motion.div className="w-1/3 bg-white p-8 rounded-2xl shadow-xl text-stone-500">
        <h3 className="text-2xl font-semibold text-stone-500 mb-4">Exercise Library</h3>
        <input
          type="text"
          placeholder="Search Exercises..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg mb-4"
        />
        <div className="flex gap-2 mb-4">
          <select
            value={muscleFilter}
            onChange={(e) => setMuscleFilter(e.target.value)}
            className="w-1/2 p-2 border border-gray-300 rounded-lg"
          >
            <option value="All">All Muscle Groups</option>
            {Array.from(new Set(exercisesData.map((ex) => ex.muscleGroup))).map((muscle) => (
              <option key={muscle} value={muscle}>
                {muscle}
              </option>
            ))}
          </select>
          <select
            value={difficultyFilter}
            onChange={(e) => setDifficultyFilter(e.target.value)}
            className="w-1/2 p-2 border border-gray-300 rounded-lg"
          >
            <option value="All">All Levels</option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>
        </div>
        <div className="h-96 overflow-y-auto border border-gray-200 rounded-lg p-4 bg-gray-50">
          {filteredExercises.map((exercise) => (
            <motion.div
              key={exercise.id}
              className="flex items-center justify-between p-3 bg-white rounded-lg shadow-md mb-2 border"
            >
              <div className="flex items-center">
                <img
                  src={`/exercises/${exercise.id}/0.jpg`}
                  alt={exercise.name}
                  className="w-12 h-12 rounded-lg object-cover mr-4"
                />
                <p className="font-medium text-lg">{exercise.name}</p>
              </div>
              <button
                className="text-stone-600 font-semibold hover:underline"
                onClick={() => addExercise(exercise)}
              >
                + Add
              </button>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
  
  
 
}
