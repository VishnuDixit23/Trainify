"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {motion} from 'framer-motion';

const DietPlanner = () => {
  type MacronutrientData = {
    protein: string;
    carbs: string;
    fats: string;
  };

  type Meal = {
    meal: string;
    items: string[];
  };

  type ImportantConsideration = {
    title: string;
    details: string;
  };

  type DietPlan = {
    title: string;
    description: string;
    daily_caloric_intake: string;
    macronutrients: MacronutrientData;
    pre_workout_meal: string;
    post_workout_meal: string;
    meals: Meal[];
    important_considerations: ImportantConsideration[];
  };

  const router = useRouter();
  const [userData, setUserData] = useState(null);
  const [dietPlan, setDietPlan] = useState<DietPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchDietPlan = async () => {
    setLoading(true);
    setError("");
    const token = localStorage.getItem("token");

    if (!token) {
      setError("No token found. Please log in.");
      setLoading(false);
      return;
    }

    try {
      const userRes = await fetch("/api/user-data", {
        method: "GET",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      });

      if (!userRes.ok) throw new Error("Failed to fetch user data.");
      const userData = await userRes.json();
      setUserData(userData);

      const dietRes = await fetch("/api/generate-diet", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          age: userData.age,
          height: userData.height,
          weight: userData.weight,
          goal: userData.goal,
          activityLevel: userData.activityLevel,
          dietaryPreferences: userData.dietaryPreferences || [],
        }),
      });

      if (!dietRes.ok) throw new Error("Failed to generate diet plan.");
      const dietData = await dietRes.json();

      setDietPlan(dietData.dietPlan);
    } catch (err) {
      console.error("Error fetching diet plan:", err);
      setError("An error occurred while fetching the diet plan.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDietPlan();
  }, []);

  return (
    <div className="min-h-screen bg-stone-900 text-stone-400 p-6 flex flex-col items-center">
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
                  Loading Dietary Plan...
                </motion.p>
              </div>
            </motion.div>
       
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : dietPlan ? (
        <>
          {/* 🔹 Title & Description */}
          <h1 className="text-4xl font-bold text-center">{dietPlan.title}</h1>
          <p className="text-center text-gray-400 mt-2 max-w-2xl">{dietPlan.description}</p>

          {/* 🔹 Macronutrient Breakdown */}
          <div className="mt-6 w-full max-w-3xl bg-stone-700 p-6 rounded-lg shadow-md border border-gray-100">
            <h2 className="text-xl font text-white mb-3">Macronutrient Breakdown</h2>
            <p>🔥 <span className="font-semibold text-orange-400">Calories:</span> {dietPlan.daily_caloric_intake}</p>
            <p>🥩 <span className="font-semibold text-red-400">Protein:</span> {dietPlan.macronutrients.protein}</p>
            <p>🍞 <span className="font-semibold text-yellow-400">Carbs:</span> {dietPlan.macronutrients.carbs}</p>
            <p>🥑 <span className="font-semibold text-green-400">Fats:</span> {dietPlan.macronutrients.fats}</p>
          </div>

          {/* 🔹 Pre & Post-Workout Meals */}
          <div className="mt-6 w-full max-w-3xl">
            <div className="bg-stone-700 p-4 rounded-lg mb-3 shadow-md border border-gray-100">
              <h2 className="text-lg font text-white">⚡ Pre-Workout Meal</h2>
              <p className="text-gray-300">{dietPlan.pre_workout_meal}</p>
            </div>
            <div className="bg-stone-700 p-4 rounded-lg shadow-md  border border-gray-100 ">
              <h2 className="text-lg font-semibold text-white">💪 Post-Workout Meal</h2>
              <p className="text-gray-300">{dietPlan.post_workout_meal}</p>
            </div>
          </div>

          {/* 🔹 Meal Plan */}
          <div className="mt-6 w-full max-w-3xl bg-stone-700 p-6 rounded-lg shadow-md border border-gray-100">
            <h2 className="text-xl font text-white mb-3">Meal Plan</h2>
            {dietPlan.meals.map((meal, index) => (
              <div key={index} className="mt-4">
                <h3 className="text-lg font-medium text-white underline">{meal.meal}</h3>
                <ul className="list-disc list-inside text-gray-300">
                  {meal.items.map((food, i) => <li key={i}>{food}</li>)}
                </ul>
              </div>
            ))}
          </div>

          {/* 🔹 Important Considerations */}
          <div className="mt-6 w-full max-w-3xl bg-stone-700 p-6 rounded-lg shadow-md border border-gray-100">
            <h2 className="text-xl font text-white mb-3">Important Considerations</h2>
            <ul className="list-disc list-inside text-gray-300">
              {dietPlan.important_considerations.map((consideration, index) => (
                <li key={index}>
                  <span className="font-bold">{consideration.title}:</span> {consideration.details}
                </li>
              ))}
            </ul>
          </div>

          {/* 🔹 Buttons */}
          <div className="mt-8 flex justify-center space-x-4">
            <button
              onClick={() => router.push("/dashboard")}
              className="bg-stone-600 hover:bg-stone-800 px-6 py-3 rounded-lg font text-stone-200 shadow-lg"
            >
               Back to Dashboard
            </button>
          </div>
        </>
      ) : null}
    </div>
  );
};

export default DietPlanner;
