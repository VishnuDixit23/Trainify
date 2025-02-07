"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "../components/card";
import { Progress } from "../components/progress";
import { Button } from "../components/button";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const DietPlanner = () => {
  const router = useRouter();
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token"); // Ensure token is stored

      if (!token) {
        console.error("No token found, user might not be logged in.");
        return;
      }

      try {
        const res = await fetch("/api/user-data", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`, // Attach token
          },
        });

        if (!res.ok) {
          console.error("Error fetching user data:", res.status);
          return;
        }

        const data = await res.json();
        setUserData(data);
      } catch (error) {
        console.error("Fetch error:", error);
      }
    };

    fetchData();
  }, []);

  if (!userData) {
    return <div className="text-white text-center">Loading...</div>;
  }

  const { weight, height, age, activityLevel, goal, workoutPlan } = userData;

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-4xl font-bold text-center">Personalized Diet Plan</h1>
      <p className="text-center text-gray-400">Tailored to your fitness goals</p>

      <div className="mt-6 flex flex-col items-center">
        <div className="bg-gray-800 p-4 rounded-lg w-full max-w-3xl">
          <h2 className="text-xl font-semibold">Your Profile</h2>
          <p>Weight: {weight} kg</p>
          <p>Height: {height} cm</p>
          <p>Age: {age} years</p>
          <p>Activity Level: {activityLevel}</p>
          <p>Goal: {goal}</p>
        </div>
      </div>

      <div className="mt-8 flex justify-center">
        <Button variant="default" onClick={() => router.push("/dashboard")}>
          Back to Dashboard
        </Button>
      </div>
    </div>
  );
};

export default DietPlanner;
