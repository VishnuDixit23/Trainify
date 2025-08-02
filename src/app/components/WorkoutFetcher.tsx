/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import axios from "axios";

export default function WorkoutFetcher() {
    const [workouts, setWorkouts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function fetchWorkouts() {
            try {
                const response = await axios.get("/api/wger-workouts"); // New API route
                setWorkouts(response.data.workouts.results); // WGER API returns workouts inside "results"
            } catch (err: any) {
                setError("Failed to load workouts.");
                console.error("Workout Fetch Error:", err.message);
            } finally {
                setLoading(false);
            }
        }
        fetchWorkouts();
    }, []);

    if (loading) return <p>Loading workouts...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div>
            <h2>WGER Workouts</h2>
            <ul>
                {workouts.map((workout: any, index: number) => (
                    <li key={index}>{workout.name || `Workout #${index + 1}`}</li>
                ))}
            </ul>
        </div>
    );
}
