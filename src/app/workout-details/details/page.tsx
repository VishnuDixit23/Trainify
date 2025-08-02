/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import router from "next/router";
import { motion } from "framer-motion";

const WorkoutDetailsPage: React.FC = () => {
  const searchParams = useSearchParams();
  const initialWorkoutPlan = JSON.parse(searchParams.get("workoutPlan") || "{}");
  const [workoutPlan] = useState(initialWorkoutPlan);
  const [, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded: any = jwtDecode(token);
        setUserId(decoded.userId);
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
  }, []);

  return (
    <motion.div
      className="flex flex-col min-h-screen p-8 bg-gradient-to-br from-stone-900 via-black to-stone-800 text-stone-300"
      initial={{ y: -50 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-3xl font-semibold mb-4">Your Workout Plan</h2>

      <div className="space-y-6">
        <motion.div
          className="p-8 bg-black/50 border border-stone-700 rounded-xl backdrop-blur-lg shadow-lg transition-all duration-500 hover:scale-[1.02]"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h3 className="text-3xl font-extrabold text-white tracking-wide">
            {workoutPlan.title}
          </h3>
          <p className="text-stone-300 text-xl mt-2 font-light">
            {workoutPlan.description}
          </p>
        </motion.div>

        {/* Warm-up & Cool-down */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <motion.div
            className="p-6 bg-black/50 border border-stone-700 rounded-xl backdrop-blur-lg shadow-lg transition-all duration-500 hover:scale-[1.02]"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h3 className="text-2xl font-semibold text-white tracking-wide">
              Warm-up
            </h3>
            {Array.isArray(workoutPlan.warm_up) ? (
              <ul className="text-stone-300 mt-3 space-y-4">
                {workoutPlan.warm_up.map((warmup: any, index: number) => (
                  <li
                    key={index}
                    className="hover:text-white text-xl transition-colors duration-200"
                  >
                    <strong>{warmup.exercise}</strong>: {warmup.duration}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-400 mt-2">Not Provided</p>
            )}
          </motion.div>

          <motion.div
            className="p-6 bg-black/50 border border-stone-700 rounded-xl backdrop-blur-lg shadow-lg transition-all duration-500 hover:scale-[1.02]"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h3 className="text-2xl text-white font-semibold tracking-wide">
              Cool-down
            </h3>
            {Array.isArray(workoutPlan.cool_down) ? (
              <ul className="text-stone-300 mt-3 space-y-4">
                {workoutPlan.cool_down.map((cooldown: any, index: number) => (
                  <li
                    key={index}
                    className="hover:text-white text-xl transition-colors duration-200"
                  >
                    <strong>{cooldown.exercise}</strong>: {cooldown.duration}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-400 mt-2">Not Provided</p>
            )}
          </motion.div>
        </div>

        {/* Schedule */}
        <motion.div
          className="p-8 bg-gradient-to-br from-stone-900 via-black to-stone-800 rounded-xl shadow-2xl border border-stone-700 transition-all duration-500"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h3 className="text-3xl text-white font-extrabold mb-6 tracking-wide">
            Workout Schedule
          </h3>
          <div className="space-y-6">
            {Array.isArray(workoutPlan.schedule) ? (
              workoutPlan.schedule.map((day: any, dayIndex: number) => (
                <motion.div
                  key={dayIndex}
                  className="p-6 bg-black/50 border border-stone-300 rounded-xl backdrop-blur-lg shadow-lg transition-all duration-300 hover:scale-[1.02] hover:bg-black/70"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <h4 className="text-2xl text-white font-bold">{day.day}</h4>
                  {Array.isArray(day.workouts) ? (
                    day.workouts.map((workout: any, index: number) => (
                      <div
                        key={index}
                        className="text-stone-300 text-xl mt-4 hover:text-white transition-colors duration-200"
                      >
                        <strong className="font-bold text-2xl mr-4">
                          {workout.exercise}:
                        </strong>{" "}
                        {workout.reps} reps × {workout.sets} sets
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-400 italic mt-2">
                      No workouts found.
                    </p>
                  )}
                </motion.div>
              ))
            ) : (
              <p className="text-gray-400">No workout plan available.</p>
            )}
          </div>
        </motion.div>
      </div>

      {/* Back Button */}
      <motion.button
        onClick={() => router.push("/dashboard")}
        className="mt-8 w-1/5 py-3 px-6 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 transform hover:scale-105 focus:outline-none"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        🔙 Back to Dashboard
      </motion.button>
    </motion.div>
  );
};

export default WorkoutDetailsPage;
