import { NextResponse } from "next/server";
import axios from "axios";

export async function GET() {
    try {
        const API_KEY = process.env.WGER_API_KEY;
        if (!API_KEY) throw new Error("Missing WGER API Key!");

        const response = await axios.get("https://wger.de/api/v2/workout/", {
            headers: {
                Authorization: `Token ${API_KEY}`, // Use secure API key
            },
        });

        return NextResponse.json({ success: true, workouts: response.data });
    } catch (error: any) {
        console.error("WGER API Error:", error.response?.data || error.message);
        return NextResponse.json({ success: false, error: "Failed to fetch WGER workouts." }, { status: 500 });
    }
}
