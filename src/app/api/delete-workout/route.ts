import { NextResponse } from "next/server";
import { connectToDatabase } from "../../../lib/mongodb";
import jwt from "jsonwebtoken";

export async function DELETE(req: Request) {
  try {
    // 🔹 Extract token from headers
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized: Missing token" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1]; // Extract token
    let decodedToken: any;

    try {
      decodedToken = jwt.verify(token, process.env.JWT_SECRET as string); // Decode JWT
    } catch (error) {
      return NextResponse.json({ error: "Unauthorized: Invalid token" }, { status: 403 });
    }

    if (!decodedToken || typeof decodedToken !== "object" || !decodedToken.userId) {
      return NextResponse.json({ error: "Unauthorized: Invalid token payload" }, { status: 403 });
    }

    const userId = decodedToken.userId;

    // ✅ Connect to MongoDB
    const  db  = await connectToDatabase();
    const collection = db.collection("workoutPlans");

    // ✅ Check if the user has a workout plan
    const existingPlan = await collection.findOne({ userId });

    if (!existingPlan) {
      return NextResponse.json({ error: "No workout plan found to delete" }, { status: 404 });
    }

    // ✅ Delete the workout plan
    await collection.deleteOne({ userId });

    return NextResponse.json({ message: "Workout plan deleted successfully" });

  } catch (error) {
    console.error("Error deleting workout plan:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
