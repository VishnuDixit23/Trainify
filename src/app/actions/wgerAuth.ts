"use server";

import axios from "axios";

export async function getWgerWorkouts() {
    try {
        const API_KEY = process.env.WGER_API_KEY; // Get API Key from .env.local
        if (!API_KEY) throw new Error("Missing WGER API Key!");

        const response = await axios.get("https://wger.de/api/v2/workout/", {
            headers: {
                Authorization: `Token ${API_KEY}`, // Use the API key securely
            },
        });

        return response.data; // Return workout data
    } catch (error: any) {
        console.error("WGER API Error:", error.response?.data || error.message);
        throw new Error("Failed to fetch workouts from WGER.");
    }
}
