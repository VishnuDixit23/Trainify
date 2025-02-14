import { NextResponse } from "next/server";
import { connectToDatabase } from "../../../../lib/mongodb";
import jwt from "jsonwebtoken";

export async function GET(req: Request) {
  try {
    // Check Authorization Header
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { success: false, error: "Unauthorized: Missing token" },
        { status: 401 }
      );
    }

    // Extract and Verify Token
    const token = authHeader.split(" ")[1];
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET as string) as { userId: string };

    if (!decodedToken?.userId) {
      return NextResponse.json(
        { success: false, error: "Unauthorized: Invalid token payload" },
        { status: 403 }
      );
    }

    // Connect to Database
    const db = await connectToDatabase();
    const userId = decodedToken.userId;

    // Fetch User's Workout Plan
    const userPlan = await db.collection("workoutPlans").findOne({ userId });
    if (!userPlan) {
      return NextResponse.json({ message: "No workout plan found for user" }, { status: 404 });
    }

    const { createdAt, workoutPlan } = userPlan;
    if (!workoutPlan?.schedule || workoutPlan.schedule.length === 0) {
      return NextResponse.json({ message: "Workout plan schedule is empty" }, { status: 404 });
    }

    // Calculate the Current Day
    const createdDate = new Date(createdAt.$date || createdAt); // Handle MongoDB's $date format
    const today = new Date();
    const dayDifference = Math.floor((today.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24));

    // Determine the corresponding "Day X" (loop back if exceeding plan length)
    const currentDayIndex = dayDifference % workoutPlan.schedule.length; // Use modulo to loop back
    const todayWorkouts = workoutPlan.schedule[currentDayIndex];

    return NextResponse.json({ day: todayWorkouts });
  } catch (error) {
    console.error("Error in GET handler:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
