import { NextResponse } from "next/server";
import { connectToDatabase } from "../../../lib/mongodb";
import jwt from "jsonwebtoken";

export async function GET(req: Request) {
  try {
    // Extract token from headers
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { success: false, error: "Unauthorized: Missing token" },
        { status: 401 }
      );
    }

    const token = authHeader.split(" ")[1];
    let decodedToken: any;

    try {
      decodedToken = jwt.verify(token, process.env.JWT_SECRET as string);
    } catch (error) {
      return NextResponse.json(
        { success: false, error: "Unauthorized: Invalid token" },
        { status: 403 }
      );
    }

    if (!decodedToken?.userId) {
      return NextResponse.json(
        { success: false, error: "Unauthorized: Invalid token payload" },
        { status: 403 }
      );
    }

    const userId = decodedToken.userId;
    const  db  = await connectToDatabase();
    const collection = db.collection("workoutPlans");

    // Fetch the user's workout plan
    const workoutPlan = await collection.findOne({ userId });

    if (!workoutPlan) {
      // Return `null` for `data` if no plan exists
      return NextResponse.json(
        { success: true, data: null, message: "No workout plan found" },
        { status: 200 }
      );
    }

    // Directly return the plan as it is from the database
    return NextResponse.json(
      { success: true, data: workoutPlan },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching workout plan:", error);
    return NextResponse.json(
      { success: false, error: "Server error" },
      { status: 500 }
    );
  }
}