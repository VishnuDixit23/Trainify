import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import jwt from "jsonwebtoken";

export async function GET(req: Request) {
  try {
    // Extract and validate Authorization header
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ success: false, error: "Unauthorized: Missing token" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];

    // Verify JWT token
    let decodedToken: any;
    try {
      decodedToken = jwt.verify(token, process.env.JWT_SECRET as string);
    } catch (error) {
      return NextResponse.json({ success: false, error: "Unauthorized: Invalid token" }, { status: 403 });
    }

    if (!decodedToken?.userId) {
      return NextResponse.json({ success: false, error: "Unauthorized: Invalid token payload" }, { status: 403 });
    }

    const userId = decodedToken.userId; // Keep as string since MongoDB stores it as string
    console.log("Decoded userId:", userId);

    // Connect to DB
    const db = await connectToDatabase();

    // Fetch workout plan using userId as string (not ObjectId)
    const workoutPlan = await db.collection("workoutPlans").findOne({ userId });

    if (!workoutPlan) {
      console.error("Workout plan not found for userId:", userId);
      return NextResponse.json({ error: "No workout plan found for this user" }, { status: 404 });
    }

    console.log("Fetched workout plan:", workoutPlan);

    return NextResponse.json(workoutPlan, { status: 200 });
  } catch (error) {
    console.error("Server error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
