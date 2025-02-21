"use server";

import { NextResponse } from "next/server";
import { getWgerWorkouts } from "@/app/actions/wgerAuth"; // Import function

export async function GET() {
    try {
        const workouts = await getWgerWorkouts(); // Fetch workouts from WGER API
        return NextResponse.json({ success: true, workouts });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
