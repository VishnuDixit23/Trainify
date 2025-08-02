/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { connectToDatabase } from "../../../lib/mongodb";
import loggedWorkout from "@/lib/loggedWorkout";
import jwt from "jsonwebtoken";

export async function POST(req: Request) {
  try {
    // Authorization Check
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ success: false, error: "Unauthorized: Missing token" }, { status: 401 });
    }

    // Verify JWT
    const token = authHeader.split(" ")[1];
    let decodedToken: any;
    try {
      decodedToken = jwt.verify(token, process.env.JWT_SECRET as string);
    } catch (error) {
      return NextResponse.json({ success: false, error: "Unauthorized: Invalid token" }, { status: 403 });
    }

    // Parse Request Body
    const { date, exercises } = await req.json();
    if (!date || !exercises || !Array.isArray(exercises) || exercises.length === 0) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
    }

    // Connect to MongoDB
    await connectToDatabase();
    const userId = decodedToken.userId;

    // Check if there's an existing log for this user on this date
    const existingLog = await loggedWorkout.findOne({ userId, date });

    if (existingLog) {
      // If log exists, append new exercises instead of overwriting
      existingLog.exercises.push(...exercises);
      await existingLog.save();
    } else {
      // If no log exists, create a new entry
      await loggedWorkout.create({ userId, date, exercises });
    }

    return NextResponse.json({ success: true, message: "Workout logged successfully!" });
  } catch (error) {
    console.error("Error in log-workout route:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
