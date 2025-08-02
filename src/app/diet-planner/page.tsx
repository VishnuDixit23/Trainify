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
  const [, setUserData] = useState(null);
  const [dietPlan, setDietPlan] = useState<DietPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => setVisible(true);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  
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

      if (!userRes.ok) throw Error("Failed to fetch user data.");
      if (userRes.status === 404) {
        console.warn("No workout plan found for the user.");
        setUserData(null);
        setLoading(false); // Ensure loading is set to false
        return;
      }
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
    <div className="min-h-screen bg-gradient-to-br from-stone-900 via-black to-stone-800 backdrop-blur-2xl text-stone-400 p-6 w-full flex flex-col items-center">
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

   <div className="flex items-center justify-center w-full  min-h-screen bg-gradient-to-br from-stone-900 via-black to-stone-900 backdrop-blur-2xl px-9 ">
   <div className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20" style={{ backgroundImage: "url('/diet.jpg')" }}></div>
  {/* Dark Overlay */}
  <div className="absolute inset-0 w-full backdrop-blur-md rounded-xl bg-black/10"></div>

  <div className="relative w-full max-w-3xl bg-black/10 backdrop-blur-lg rounded-2xl p-10 shadow-2xl border border-white/20 
    transition-all duration-1000 ease-in-out transform scale-95 opacity-95 animate-fadeInUp hover:scale-105 hover:shadow-2xl">
    
    <h2 className="text-4xl font- text-white">
      To Get your personalized AI-powered dietary plan 
    </h2>
    <p className="mt-4 text-xl text-gray-300">
      Start by generating your detailed workout plan.
    </p>
    <button
      className="mt-6 px-8 py-3 text-lg font-semibold bg-stone-600  text-stone-300 rounded-lg hover:bg-stone-900 transition-all transform hover:scale-105 shadow-md"
      onClick={() => router.push('/workout-details')}
    >
      Create Workout Plan
    </button>
  </div>
</div>
       
      ) : dietPlan ? (
        <>

<div className="flex flex-col items-center space-y-9">
      {/* 🔹 Title & Description */}
      <div
        className={`text-center transition-all duration-500 ${
          visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
        }`}
      >
        <h1 className="text-4xl font-extrabold text-stone-300">{dietPlan.title}</h1>
        <p className="text-stone-300 mt-4 text-xl max-w-2xl mx-auto">{dietPlan.description}</p>
      </div>

      {/* 🔹 Macronutrient Breakdown */}
      <div
        className={`w-full max-w-5xl bg-black/50 text-xl border text-stone-400 border-gray-700 p-8 rounded-xl backdrop-blur-lg shadow-lg hover:scale-[1.02] transition-all duration-300 ${
          visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
        }`}
      >
        <h2 className="text-2xl font-semibold text-white mb-3">Macronutrient Breakdown</h2>
        <p>🔥 <span className="font-semibold text-orange-400">Calories:</span> {dietPlan.daily_caloric_intake}</p>
        <p>🥩 <span className="font-semibold text-red-400">Protein:</span> {dietPlan.macronutrients.protein}</p>
        <p>🍞 <span className="font-semibold text-yellow-400">Carbs:</span> {dietPlan.macronutrients.carbs}</p>
        <p>🥑 <span className="font-semibold text-green-400">Fats:</span> {dietPlan.macronutrients.fats}</p>
      </div>

      {/* 🔹 Pre & Post-Workout Meals */}
      <div className="w-full text-xl  max-w-5xl space-y-4">
        {["Pre-Workout Meal", "Post-Workout Meal"].map((mealType, index) => (
          <div
            key={index}
            className={`bg-black/50 border border-gray-700 p-8 rounded-xl backdrop-blur-lg shadow-lg hover:scale-[1.02] transition-all duration-300 ${
              visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
          >
            <h2 className="text-2xl font-semibold text-white">
              {mealType === "Pre-Workout Meal" ? "⚡" : "💪"} {mealType}
            </h2>
            <p className="text-gray-300">
              {mealType === "Pre-Workout Meal" ? dietPlan.pre_workout_meal : dietPlan.post_workout_meal}
            </p>
          </div>
        ))}
      </div>

      {/* 🔹 Meal Plan */}
      <div
        className={`w-full max-w-5xl text-xl bg-black/50 border border-gray-700 p-8 rounded-xl backdrop-blur-lg shadow-lg hover:scale-[1.02] transition-all duration-300 ${
          visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
        }`}
      >
        <h2 className="text-3xl font-semibold text-white mb-5">Meal Plan</h2>
        {dietPlan.meals.map((meal, index) => (
          <div key={index} className="mt-4">
            <h3 className="text-xm font-medium text-stone-100 underline mb-3">{meal.meal}</h3>
            <ul className="list-disc list-inside text-stone-300 space-y-1">
              {meal.items.map((food, i) => <li key={i}>{food}</li>)}
            </ul>
          </div>
        ))}
      </div>

      {/* 🔹 Important Considerations */}
      <div
        className={`w-full max-w-5xl text-xl bg-black/50 border border-gray-700 p-8 rounded-xl backdrop-blur-lg shadow-lg hover:scale-[1.02] transition-all duration-300 ${
          visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
        }`}
      >
        <h2 className="text-2xl font-semibold  text-stone-200 mb-3">Important Considerations</h2>
        <ul className="list-disc list-inside text-stone-300 space-y-2">
          {dietPlan.important_considerations.map((consideration, index) => (
            <li key={index}>
              <span className="font-bold">{consideration.title}:</span> {consideration.details}
            </li>
          ))}
        </ul>
      </div>
    </div>
          

          {/* 🔹 Buttons */}
          <div className="mt-8 flex justify-center space-x-4">
            <button
              onClick={() => router.push("/dashboard")}
              className="bg-stone-600 hover:bg-stone-800 px-6 py-3 rounded-lg font text-stone-300 shadow-lg"
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
