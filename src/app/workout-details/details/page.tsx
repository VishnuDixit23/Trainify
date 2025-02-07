"use client";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

const WorkoutDetailsPage: React.FC = () => {
  const searchParams = useSearchParams();
  const initialWorkoutPlan = JSON.parse(searchParams.get("workoutPlan") || "{}");
  const [workoutPlan, setWorkoutPlan] = useState(initialWorkoutPlan);
  const [exerciseAlternatives, setExerciseAlternatives] = useState<{ [key: string]: string[] }>({});
  const [userId, setUserId] = useState<string | null>(null);
  const difficulties = ["Easy", "Medium", "Hard"];

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const decoded: any = jwtDecode(token);
          setUserId(decoded.userId);
        } catch (error) {
          console.error("Error decoding token:", error);
        }
      }
    }
  }, []);

  async function fetchAlternatives(exerciseName: string) {
    try {
      const response = await fetch("/api/exercise-alternatives", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ exercise: exerciseName }),
      });
      if (!response.ok) throw new Error("Failed to fetch alternatives");
      const data = await response.json();
      setExerciseAlternatives((prev) => ({ ...prev, [exerciseName]: data.alternatives }));
    } catch (error) {
      console.error("Error fetching alternatives:", error);
    }
  }

  const swapExercise = (dayIndex: number, exerciseIndex: number, newExercise: string) => {
    setWorkoutPlan((prevPlan: any) => {
      const updatedPlan = { ...prevPlan };
      updatedPlan.schedule[dayIndex].workouts[exerciseIndex].exercise = newExercise;
      fetchAlternatives(newExercise);
      return updatedPlan;
    });
  };

  const adjustDifficulty = (dayIndex: number, exerciseIndex: number, difficulty: string) => {
    setWorkoutPlan((prevPlan: any) => {
      const updatedPlan = { ...prevPlan };
      updatedPlan.schedule[dayIndex].workouts[exerciseIndex].difficulty = difficulty;
      return updatedPlan;
    });
  };

  return (
    <div className="min-h-screen bg-[#0f172a] flex flex-col items-center py-12 px-6 text-white">
      <div className="w-full max-w-4xl bg-[#1e293b] rounded-lg shadow-lg p-6">
        <h1 className="text-4xl font-extrabold text-center text-white mb-6">Your Workout Plan</h1>
        <div className="bg-[#334155] p-4 rounded-lg mb-6">
          <h2 className="text-2xl font-bold">{workoutPlan.title}</h2>
          <p className="text-gray-300">{workoutPlan.description}</p>
        </div>
        <div className="grid gap-4 md:grid-cols-1">    
          <div className="bg-[#475569] p-4  rounded-lg  ">
            <h3 className="font-bold text-lg ">Note : It's Important to Warm-up before the Workout & stretch & Cool-down after the Workout</h3>
          </div>
        </div>
        <div className="mt-6">
          <h2 className="text-2xl font-bold">Workout Schedule</h2>
          {Array.isArray(workoutPlan.schedule) ? (
            workoutPlan.schedule.map((day: any, dayIndex: number) => (
              <div key={dayIndex} className="bg-[#475569] p-4 rounded-lg mt-4">
                <h3 className="text-xl font-semibold text-white">{day.day}</h3>
                <ul className="mt-2">
                  {Array.isArray(day.workouts) ? (
                    day.workouts.map((workout: any, exerciseIndex: number) => (
                      <li key={exerciseIndex} className="flex justify-between items-center py-2 border-b border-gray-600">
                        <span>
                          {workout.exercise}: {workout.reps} reps, {workout.sets} sets
                        </span>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => fetchAlternatives(workout.exercise)}
                            className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                          >
                            Swap
                          </button>
                          {exerciseAlternatives[workout.exercise] && (
                            <select
                              onChange={(e) => swapExercise(dayIndex, exerciseIndex, e.target.value)}
                              className="border px-2 py-1 rounded-md bg-gray-800 text-white"
                            >
                              <option value="">Select Alternative</option>
                              {exerciseAlternatives[workout.exercise].map((alt) => (
                                <option key={alt} value={alt}>{alt}</option>
                              ))}
                            </select>
                          )}
                          <select
                            value={workout.difficulty || "Medium"}
                            onChange={(e) => adjustDifficulty(dayIndex, exerciseIndex, e.target.value)}
                            className="border px-2 py-1 rounded-md bg-gray-800 text-white"
                          >
                            {difficulties.map((level) => (
                              <option key={level} value={level}>{level}</option>
                            ))}
                          </select>
                        </div>
                      </li>
                    ))
                  ) : (
                    <p className="text-gray-400 italic">No workouts found for this day.</p>
                  )}
                </ul>
              </div>
            ))
          ) : (
            <p className="text-gray-400 mt-4">No workout plan available.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default WorkoutDetailsPage;
