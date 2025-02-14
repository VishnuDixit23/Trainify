"use client";
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {motion} from "framer-motion"


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

  // Fetch workout plan
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
        console.log("Raw API Response:", text);
        const data = JSON.parse(text);
        console.log("Data Day:", data.day, "Type:", typeof data.day); // Debugging

if (String(data.day.day).includes("Rest")) { // Access the correct property
    setIsRestDay(true);
    setLoggedExercises([]); // Ensure workout list is empty
} else if (Array.isArray(data.day.workouts)) {
    const initializedWorkouts = data.day.workouts.map((exercise: Workout) => ({
        ...exercise,
        actualSets: exercise.actualSets ?? exercise.sets,
        actualReps: exercise.actualReps ?? exercise.reps,
        notes: exercise.notes ?? "",
        completed: exercise.completed ?? false,
    }));
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

  
  // Update exercise in state
  const updateExercise = (index: number, field: keyof Workout, value: string | number | boolean) => {
    setLoggedExercises((prev) =>
      prev.map((ex, i) => (i === index ? { ...ex, [field]: value } : ex))
    );
  };

  // Mark an exercise as completed
  const markAsCompleted = (index: number) => {
    setLoggedExercises((prev) =>
      prev.map((ex, i) => (i === index ? { ...ex, completed: !ex.completed } : ex))
    );
  };

  // Submit workout log
  // Submit workout log
const saveLog = async () => {
  const token = localStorage.getItem("token");
  if (!token) {
    alert("Authentication required.");
    return;
  }

  // Ensure the correct payload format
  const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
  const payload = {
    exercises: loggedExercises.map(ex => ({
      ...ex,
      actualSets: Number(ex.actualSets),
      actualReps: Number(ex.actualReps),
    })),
    date: today, // Include date as expected by backend
  };

  try {
    console.log("Submitting Log:", JSON.stringify(payload, null, 2));

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
      throw new Error(`Error submitting log! Status: ${res.status}, Response: ${errorText}`);
    }

   
    toast.success("Workout log submitted successfully!", {
      position: "top-right",
      autoClose: 3000,
    });
  } catch (error) {
    console.error("Error:", error);
    toast.error("Failed to submit log. Try again.");
  }
};


  return (
    <div className="min-h-screen bg-stone-800 text-white p-6">
  <h1 className="text-3xl font-extrabold mb-4">Track My Journey</h1>
  <h1 className="text-3xl items-center justify-center text-center p-6 font mb-4">Your Today's Routine</h1>

  {loading ? (
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
          Loading...
        </motion.p>
      </div>
    </motion.div>
  ) : isRestDay ? (
    // Display this if it's a rest day
    <div className="flex flex-col items-center justify-center text-center p-8 bg-stone-800 shadow-lg rounded-2xl max-w-4xl mx-auto border border-stone-700">
  <h2 className="text-3xl font-semibold text-stone-300 mb-4">🎉 Rest Day! 🎉</h2>
  <p className="text-lg text-stone-300 mb-4">
    You've been working hard! Today is a <span className="font-bold text-stone-100">scheduled rest day</span>.  
    Rest and recovery are just as important as your workouts. Take it easy! 😌
  </p>
  <p className="text-md text-stone-400 mb-6">
    Consider light stretching, a short walk, or meditation to keep your body relaxed.  
    If you're feeling sore, try foam rolling or a warm bath.
  </p>
  <button
    onClick={() => router.push("/dashboard")}
    className="bg-stone-600 hover:bg-stone-500 px-6 py-3 rounded-lg text-stone-200 transition-all duration-300"
  >
    ⬅ Back to Dashboard
  </button>
</div>

  ) : (
    // Display this if it's a workout day
    <div className="overflow-x-auto">
      <table className="w-full border border-gray-700">
        <thead>
          <tr className="bg-stone-800">
            <th className="p-2 border">Exercise</th>
            <th className="p-2 border">Sets/Reps</th>
            <th className="p-2 border">Actual</th>
            <th className="p-2 border">Notes</th>
            <th className="p-2 border">Completed</th>
          </tr>
        </thead>
        <tbody>
          {loggedExercises.map((exercise, index) => (
            <tr key={index} className={exercise.completed ? "bg-green-700" : ""}>
              <td className="p-2 border">{exercise.exercise || "Unnamed Exercise"}</td>
              <td className="p-2 border">{exercise.sets} x {exercise.reps}</td>
              <td className="p-2 border">
                <input
                  type="number"
                  min="1"
                  value={exercise.actualSets}
                  onChange={(e) => updateExercise(index, "actualSets", Number(e.target.value))}
                  className="bg-gray-700 text-white p-1 w-16"
                />
                x
                <input
                  type="number"
                  min="1"
                  value={exercise.actualReps}
                  onChange={(e) => updateExercise(index, "actualReps", Number(e.target.value))}
                  className="bg-gray-700 text-white p-1 w-16"
                />
              </td>
              <td className="p-2 border">
                <input
                  type="text"
                  placeholder="Notes (optional)"
                  value={exercise.notes}
                  onChange={(e) => updateExercise(index, "notes", e.target.value)}
                  className="bg-gray-700 text-white p-1 w-full"
                />
              </td>
              <td className="p-2 border">
                <input
                  type="checkbox"
                  checked={exercise.completed}
                  onChange={() => markAsCompleted(index)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <ToastContainer />
      <button
        onClick={saveLog}
        className="mt-4 bg-stone-600 hover:bg-stone-700 text-white px-4 py-2 rounded"
      >
        Submit Workout Log
      </button>
      <div className="mt-8 flex justify-center space-x-4">
        <button
          onClick={() => router.push("/dashboard")}
          className="bg-stone-600 hover:bg-stone-700 px-6 py-3 rounded-md text-white"
        >
          ⬅ Back to Dashboard
        </button>
      </div>
    </div>
  )}
</div>

    
  );
}
