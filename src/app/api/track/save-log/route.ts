import { NextResponse } from "next/server";
import { connectToDatabase } from "../../../../lib/mongodb";
import loggedWorkout from "@/lib/loggedWorkout";
import jwt from "jsonwebtoken";

export async function POST(req: Request) {
  try {
    // Parse request body
    const body = await req.json();
    const { exercises, date } = body; // Exercises logged by the user

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

    // Connect to MongoDB
    const db = await connectToDatabase();
    const userId = decodedToken.userId;

    if (!exercises || !Array.isArray(exercises)) {
      return NextResponse.json({ success: false, error: "Invalid workout data" }, { status: 400 });
    }

    const today = date || new Date().toISOString().split("T")[0]; // Default to today's date

    // Check if a log already exists for today
    const existingLog = await db.collection("loggedWorkouts").findOne({ userId, date: today });
    if (existingLog) {
      // Update existing log
      await db.collection("loggedWorkouts").updateOne(
        { userId, date: today },
        { $set: { exercises } }
      );
    } else {
      // Insert new log
      await db.collection("loggedWorkouts").insertOne({
        userId,
        date: today,
        exercises,
      });
    }

    return NextResponse.json({ success: true, message: "Workout logged successfully!" });
  } catch (error) {
    console.error("Error saving workout log:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
