"use client";
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {motion, useAnimation} from "framer-motion"
import { useInView } from "react-intersection-observer";


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
  const controls = useAnimation();
  const { ref, inView } = useInView({ threshold: 0.3 });

  useEffect(() => {
    if (inView) {
      controls.start({ scale: 1.05, opacity: 1 });
    } else {
      controls.start({ scale: 0.9, opacity: 0.7 });
    }
  }, [inView, controls]);

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
    <div className="min-h-screen bg-gradient-to-br from-stone-900 via-black to-stone-800 backdrop-blur-2xl text-white p-6">
    <h1 className="text-3xl font-extrabold mb-4">Track My Journey</h1>
    <h1 className="text-3xl items-center justify-center text-center p-6 font mb-8 font-bold">Your Today's Routine</h1>

    {loading ? (
      <motion.div
        className="min-h-screen flex items-center justify-center bg-black/80 backdrop-blur-md fixed inset-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col items-center gap-4">
          <motion.div
            className="w-16 h-16 border-t-4 border-stone-400 border-opacity-50 rounded-full animate-spin"
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          />
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
      <div className="flex flex-col items-center justify-center text-center p-8 bg-stone-800 shadow-lg rounded-2xl max-w-4xl mx-auto border border-stone-700">
        <h2 className="text-3xl font-semibold text-stone-300 mb-4">🎉 Rest Day! 🎉</h2>
        <p className="text-lg text-stone-300 mb-4">Enjoy your scheduled rest day! Recovery is key to progress. 😌</p>
        <button
          onClick={() => router.push("/dashboard")}
          className="bg-stone-800 hover:bg-stone-500 px-6 py-3 rounded-lg text-stone-200 transition-all duration-300"
        >
          ⬅ Back to Dashboard
        </button>
      </div>
    ) : (
      <div className="w-full flex flex-col items-center">
        <div className="w-[95vw] mx-auto overflow-x-auto bg-stone-900 border border-stone-700 p-6 rounded-xl backdrop-blur-lg shadow-lg">

<table className="w-full border border-stone-700 rounded-xl">
  <thead>
    <tr className="bg-stone-800 text-stone-300 font-medium">
      <th className="p-3 border-b border-stone-700 text-lg font-medium">Exercise</th>
      <th className="p-3 border-b border-stone-700 text-lg font-medium">Image</th>
      <th className="p-3 border-b border-stone-700 text-lg font-medium">Target</th>
      <th className="p-3 border-b border-stone-700 text-lg font-medium">Achieved</th>
      <th className="p-3 border-b border-stone-700 text-lg font-medium">Notes</th>
      <th className="p-3 border-b border-stone-700 text-lg font-medium">Completed</th>
    </tr>
  </thead>
  <tbody>
    {loggedExercises.map((exercise, index) => (
      <tr key={index} className={`hover:bg-stone-700 transition odd:bg-stone-800 even:bg-stone-900 ${exercise.completed ? "bg-green-700" : ""}`}>
        <td className="text-lg font-medium p-4 border text-stone-300">{exercise.exercise || "Unnamed Exercise"}</td>
        <td className="p-4 border">
          <img
            src={`/exercises/${exercise.exercise.replace(/\s+/g, '_')}/0.jpg`} 
            alt={"Soon"}
            className="w-16 h-16 object-cover rounded-lg shadow-md border border-stone-600"
          />
        </td>
        <td className="p-3 border text-lg text-stone-300">{exercise.sets} x ({exercise.reps})</td>
        <td className="p-3 border flex items-center gap-2">
          <input
            type="number"
            min="1"
            value={exercise.actualSets}
            onChange={(e) => updateExercise(index, "actualSets", Number(e.target.value))}
            className="bg-stone-800 text-stone-300 border border-stone-600 p-2 w-16 rounded-md text-lg"
          />
          x
          <input
            type="number"
            min="1"
            value={exercise.actualReps}
            onChange={(e) => updateExercise(index, "actualReps", Number(e.target.value))}
            className="bg-stone-800 text-stone-300 border border-stone-600 p-2 w-16 rounded-md text-lg"
          />
        </td>
        <td className="p-3 border">
          <input
            type="text"
            placeholder="Notes (optional)"
            value={exercise.notes}
            onChange={(e) => updateExercise(index, "notes", e.target.value)}
            className="bg-stone-800 text-stone-300 border border-stone-600 p-3 w-full rounded-md"
          />
        </td>
        <td className="p-4 border text-center">
          <input
            type="checkbox"
            checked={exercise.completed}
            onChange={() => markAsCompleted(index)}
            className="w-5 h-5 accent-stone-600 rounded-md shadow-sm"
          />
        </td>
      </tr>
    ))}
  </tbody>
</table>
</div>

        <ToastContainer />
        <button
          onClick={saveLog}
          className="mt-8 px-6 py-3 text-lg font-semibold text-white bg-stone-800 hover:bg-stone-700 
           rounded-xl shadow-md transition-all duration-300 transform hover:scale-105"
          >
          Submit Workout Log
        </button>
        <div className="mt-8 flex justify-center space-x-4">
          <button
            onClick={() => router.push("/dashboard")}
            className= "w-45 h-15 bg-stone-800 hover:bg-stone-600 px-6 py-3 rounded-md text-white font-bold"
          >
            ⬅ Back to Dashboard
          </button>
        </div>
      </div>
    )}
  </div>
   
  );
}
