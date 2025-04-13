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
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(true);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
      setError(
        err.message || "Failed to delete workout plan. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
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
      setError(
        err.message || "Failed to generate workout plan. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const dropdownOptions: { [key: string]: string[] } = {
    gender: ["Male", "Female", "Other"],
    activityLevel: [
      "Sedentary",
      "Lightly Active",
      "Moderately Active",
      "Very Active",
    ],
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
    dietaryPreferences: ["Vegetarian", "Non-Vegetarian", "Vegan"],
  };

  if (loading) {
    return (
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
            Loading Workout Plan...
          </motion.p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="min-h-screen relative bg-gradient-to-br from-stone-900 via-black to-stone-800 backdrop-blur-2xl flex flex-col items-center py-12 px-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {existingPlan ? (
        <motion.div
          className="flex flex-col min-h-screen p-8 bg-gradient-to-br from-stone-900 via-black to-stone-800 text-stone-300"
          initial={{ y: -50 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-semibold mb-4">
            Your Existing Workout Plan
          </h2>
          <div className="space-y-6">
            <div
              className={`p-8 bg-black/50 border border-stone-700 rounded-xl backdrop-blur-lg shadow-lg transition-all duration-500 hover:scale-[1.02] ${
                visible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-6"
              }`}
            >
              <h3 className="text-3xl font-extrabold text-white tracking-wide">
                {existingPlan.workoutPlan.title}
              </h3>
              <p className="text-stone-300 text-xl mt-2 font-light">
                - {existingPlan.workoutPlan.description}
              </p>
            </div>
            <div
              className={`p-8 bg-black/50 border border-stone-700 rounded-xl backdrop-blur-lg shadow-lg transition-all duration-500 hover:scale-[1.02] ${
                visible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-6"
              }`}
            >
              <h3 className="text-2xl text-white font-semibold mb-3">
                Important Considerations
              </h3>
              <ul className="list-disc ml-5 text-stone-300 text-xl space-y-4">
                {existingPlan.workoutPlan.important_considerations.map(
                  (item: any, index: number) => (
                    <li
                      key={index}
                      className="hover:text-white  transition-colors duration-200"
                    >
                      <strong>{item.title}: </strong>
                      {item.details}
                    </li>
                  )
                )}
              </ul>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div
                className={`p-6 bg-black/50 border border-stone-700 rounded-xl backdrop-blur-lg shadow-lg transition-all duration-500 hover:scale-[1.02] ${
                  visible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-6"
                }`}
              >
                <h3 className="text-2xl font-semibold text-white tracking-wide">
                  Warm-up
                </h3>

                {Array.isArray(existingPlan.workoutPlan.warm_up) ? (
                  <ul className="text-stone-300 mt-3 space-y-4">
                    {existingPlan.workoutPlan.warm_up.map(
                      (warmup: any, index: number) => (
                        <li
                          key={index}
                          className="hover:text-white text-xl transition-colors duration-200"
                        >
                          <strong>{warmup.exercise}</strong>: {warmup.duration}
                          {warmup.example && (
                            <span className="italic text-xm text-stone-400">
                              {" "}
                              Example: {warmup.example}
                            </span>
                          )}
                        </li>
                      )
                    )}
                  </ul>
                ) : (
                  <p className="text-gray-400 mt-2">Not Provided</p>
                )}
              </div>
              <div
                className={`p-6 bg-black/50 border border-stone-700 rounded-xl backdrop-blur-lg shadow-lg transition-all duration-500 hover:scale-[1.02] ${
                  visible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-6"
                }`}
              >
                <h3 className="text-2xl text-white font-semibold tracking-wide">
                  Cool-down
                </h3>

                {Array.isArray(existingPlan.workoutPlan.cool_down) ? (
                  <ul className="text-stone-300 mt-3 space-y-4">
                    {existingPlan.workoutPlan.cool_down.map(
                      (cooldown: any, index: number) => (
                        <li
                          key={index}
                          className="hover:text-white text-xl transition-colors duration-200"
                        >
                          <strong>{cooldown.exercise}</strong>:{" "}
                          {cooldown.duration}
                          {cooldown.example && (
                            <span className="italic text-xm text-stone-400">
                              {" "}
                              Example: {cooldown.example}
                            </span>
                          )}
                        </li>
                      )
                    )}
                  </ul>
                ) : (
                  <p className="text-gray-400 mt-2">Not Provided</p>
                )}
              </div>
            </div>
            <div
              className={`p-8 bg-gradient-to-br from-stone-900 via-black to-stone-800 rounded-xl shadow-2xl border border-stone-700 transition-all duration-500 ${
                visible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-10"
              }`}
            >
              <h3 className="text-3xl text-white font-extrabold mb-6 tracking-wide">
                Workout Schedule
              </h3>

              <div className="space-y-6">
                {existingPlan.workoutPlan.schedule.map(
                  (day: any, dayIndex: number) => (
                    <div
                      key={dayIndex}
                      className="p-6 bg-black/50 border border-stone-300 rounded-xl backdrop-blur-lg shadow-lg transition-all duration-300 hover:scale-[1.02] hover:bg-black/70"
                    >
                      <h4 className="text-2xl text-white font-bold">
                        {day.day}
                      </h4>
                      {day.workouts.map((workout: any, index: number) => (
                        <div
                          key={index}
                          className="text-stone-300 text-xl mt-4"
                        >
                          <p className="hover:text-white transition-colors duration-200">
                            <strong className=" font-bold text-2xl mr-4">
                              {workout.exercise} :
                            </strong>{" "}
                            ({workout.reps}) reps × {workout.sets} sets
                          </p>
                        </div>
                      ))}
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
          <button
            onClick={handleDeletePlan}
            className="mt-8 w-full sm:w-1/2 md:w-1/3 lg:w-1/5 py-3 px-6 bg-red-400 text-stone-600 font-semibold rounded-lg shadow-md hover:bg-red-500 transform hover:scale-105 transition-all duration-300 focus:outline-none"
          >
            Delete Workout Plan
          </button>
        </motion.div>
      ) : (
        <motion.form
          onSubmit={handleSubmit}
          className="w-full max-w-5xl bg-[#121212] p-10 rounded-3xl shadow-2xl border border-gray-900 grid grid-cols-1 gap-6 transition-all transform hover:scale-[1.02] backdrop-blur-lg bg-opacity-80"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-4xl font-semibold text-gray-100 text-center mb-6 tracking-wide drop-shadow-lg">
            Enter Your Details
          </h2>
          <p className="text-gray-300 text-center text-lg max-w-3xl mx-auto mb-6">
            Provide your details, and our AI-powered system will generate a
            personalized workout plan tailored to your goals, fitness level, and
            preferences.
          </p>

          {Object.keys(formData).map((field) => {
            if (dropdownOptions[field]) {
              return (
                <select
                  key={field}
                  id={field}
                  value={(formData as any)[field]}
                  onChange={handleChange}
                  className="p-3 rounded-md bg-[#222] text-gray-200 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-stone-500 transition transform hover:scale-105 hover:shadow-lg"
                >
                  <option value="" className="text-gray-400">
                    Select {field.replace(/([A-Z])/g, " $1")}
                  </option>
                  {dropdownOptions[field].map((option) => (
                    <option
                      key={option}
                      value={option}
                      className="text-gray-200"
                    >
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
                className="p-3 rounded-md bg-[#222] text-gray-200 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-stone-500 transition transform hover:scale-105 hover:shadow-lg focus:shadow-stone-500"
              />
            );
          })}

          <motion.button
            type="submit"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="w-full py-3 px-6 bg-gradient-to-r from-stone-500 to-stone-700 text-white font-semibold rounded-xl shadow-md hover:shadow-stone-500/50 transform focus:outline-none transition-all"
          >
            Generate Workout Plan
          </motion.button>
        </motion.form>
      )}
      {error && <p className="mt-4 text-red-500">{error}</p>}
    </motion.div>
  );
};
export default WorkoutDetailsPage;
