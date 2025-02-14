"use client";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import router from "next/router";

const WorkoutDetailsPage: React.FC = () => {
  const searchParams = useSearchParams();
  const initialWorkoutPlan = JSON.parse(searchParams.get("workoutPlan") || "{}");
  const [workoutPlan, setWorkoutPlan] = useState(initialWorkoutPlan);
  const [userId, setUserId] = useState<string | null>(null);

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
        <div className="mt-8 flex justify-center space-x-4">
            <button
              onClick={() => router.push("/dashboard")}
              className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-semibold text-white shadow-lg"
            >
              🔙 Back to Dashboard
            </button>
          </div>
      </div>
    </div>
  );
};

export default WorkoutDetailsPage;
