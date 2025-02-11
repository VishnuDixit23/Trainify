"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

const WorkoutDetailsPage: React.FC = () => {
  const router = useRouter();

  const [formData, setFormData] = useState({
    age: "",
    height: "",
    weight: "",
    gender: "",
    activityLevel: "",
    fitnessExperience: "",
    goal: "",
    medicalConditions: "",
    dietaryPreferences: "",
    activityType: "",
    equipment: "",
    programSpecificity: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [existingPlan, setExistingPlan] = useState<any>(null);

  useEffect(() => {
    const fetchWorkoutPlan = async () => {
      setLoading(true);
      try {
        const response = await fetch("/api/get-user-workout", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          if (data.success && data.data) {
            setExistingPlan(data.data);
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

    try {
      const response = await fetch("/api/delete-workout", {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to delete workout plan. ${errorText}`);
      }

      setExistingPlan(null);
    } catch (err: any) {
      setError(err.message || "Failed to delete workout plan. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
        throw new Error(`Failed to fetch or save workout plan. ${errorText}`);
      }

      const data = await response.json();
      const workoutPlan = data.workoutPlan;

      router.push(
        `/workout-details/details?workoutPlan=${encodeURIComponent(
          JSON.stringify(workoutPlan)
        )}`
      );
    } catch (err: any) {
      setError(err.message || "Failed to generate workout plan. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const dropdownOptions: { [key: string]: string[] } = {
    gender: ["Male", "Female", "Other"],
    activityLevel: ["Sedentary", "Lightly Active", "Moderately Active", "Very Active"],
    fitnessExperience: ["Beginner", "Intermediate", "Advanced"],
    goal: ["Lose Weight", "Gain Muscle", "Improve Stamina", "Maintain Fitness"],
    activityType: ["Strength Training", "Cardio", "Yoga", "Pilates"],
    equipment: ["Full Gym Equipment", "Minimal Equipment", "No Equipment"],
    programSpecificity: [
      "Strength Training",
      "Cardiovascular Health",
      "Flexibility and Mobility",
      "Rehabilitation",
    ],
  };

  if (loading) {
    return (
      <motion.div
        className="min-h-screen flex items-center justify-center text-white"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        Loading...
      </motion.div>
    );
  }

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-[#1e1e2e] via-[#111827] to-[#1e1e2e] flex flex-col items-center py-12 px-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {existingPlan ? (
        <motion.div
          className="w-full max-w-3xl bg-[#2a2a40] rounded-3xl shadow-2xl p-8 text-left border border-gray-700 text-white"
          initial={{ y: -50 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-semibold mb-4">Your Existing Workout Plan</h2>
          <div className="space-y-6">
            <div className="p-4 bg-gray-800 rounded-lg">
              <h3 className="text-2xl font-bold">{existingPlan.workoutPlan.title}</h3>
              <p className="text-gray-300">{existingPlan.workoutPlan.description}</p>
            </div>

            <div className="p-4 bg-gray-800 rounded-lg">
              <h3 className="text-xl font-semibold mb-2">Important Considerations</h3>
              <ul className="list-disc ml-5 text-gray-300">
                {existingPlan.workoutPlan.important_considerations.map((item: any, index: number) => (
                  <li key={index}>
                    <strong>{item.title}: </strong>
                    {item.details}
                  </li>
                ))}
              </ul>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-gray-800 rounded-lg">
                <h3 className="text-xl font-semibold">Warm-up</h3>
                <p className="text-gray-300">{existingPlan.workoutPlan.warm_up}</p>
              </div>
              <div className="p-4 bg-gray-800 rounded-lg">
                <h3 className="text-xl font-semibold">Cool-down</h3>
                <p className="text-gray-300">{existingPlan.workoutPlan.cool_down}</p>
              </div>
            </div>

            <div className="p-4 bg-gray-800 rounded-lg">
              <h3 className="text-xl font-semibold mb-2">Workout Schedule</h3>
              <div className="space-y-4">
                {existingPlan.workoutPlan.schedule.map((day: any, dayIndex: number) => (
                  <div key={dayIndex} className="p-4 bg-gray-700 rounded-lg">
                    <h4 className="text-lg font-semibold">{day.day}</h4>
                    {Array.isArray(day.workouts) ? (
                      <ul className="list-disc ml-5 text-gray-300">
                        {day.workouts.map((workout: any, workoutIndex: number) => (
                          <li key={workoutIndex} className="flex items-center space-x-4">
                          
                            <span>
                              <strong>{workout.exercise}</strong> - {workout.reps} reps, {workout.sets} sets
                            </span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-gray-300">Rest Day</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <button
            onClick={handleDeletePlan}
            className="mt-4 py-3 px-6 bg-red-500 text-white font-semibold rounded-lg shadow-md hover:bg-red-600 transform hover:scale-105 focus:outline-none"
          >
            Delete Workout Plan
          </button>
        </motion.div>
      ) : (
        <motion.form
          onSubmit={handleSubmit}
          className="w-full max-w-3xl bg-[#1e1e2e] p-10 rounded-3xl shadow-2xl border border-gray-700 grid grid-cols-1 gap-6"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-semibold text-white text-center mb-6">Enter Your Details</h2>

          {Object.keys(formData).map((field) => {
            if (dropdownOptions[field]) {
              return (
                <select
                  key={field}
                  id={field}
                  value={(formData as any)[field]}
                  onChange={handleChange}
                  className="p-3 rounded-md bg-gray-800 text-white"
                >
                  <option value="">Select {field.replace(/([A-Z])/g, " $1")}</option>
                  {dropdownOptions[field].map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              );
            }
            return (
              <input
                key={field}
                id={field}
                value={(formData as any)[field]}
                onChange={handleChange}
                placeholder={field.replace(/([A-Z])/g, " $1")}
                className="p-3 rounded-md bg-gray-800 text-white"
              />
            );
          })}

          <button
            type="submit"
            className="py-3 px-6 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 transform hover:scale-105 focus:outline-none"
          >
            Generate Workout Plan
          </button>
        </motion.form>
      )}

      {error && <p className="mt-4 text-red-500">{error}</p>}
    </motion.div>
  );
};

export default WorkoutDetailsPage;
