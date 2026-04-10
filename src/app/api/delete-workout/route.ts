import { NextResponse } from "next/server";
import { connectToDatabase } from "../../../lib/mongodb";
import jwt from "jsonwebtoken";

export async function DELETE(req: Request) {
  try {
    // Extract token from headers
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized: Missing token" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let decodedToken: any;

    try {
      decodedToken = jwt.verify(token, process.env.JWT_SECRET as string);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      return NextResponse.json({ error: "Unauthorized: Invalid token" }, { status: 403 });
    }

    if (!decodedToken || typeof decodedToken !== "object" || !decodedToken.userId) {
      return NextResponse.json({ error: "Unauthorized: Invalid token payload" }, { status: 403 });
    }

    const userId = decodedToken.userId;

    // Connect to MongoDB
    const db = await connectToDatabase();

    // Delete ALL workout plans for this user (deleteMany handles duplicates)
    const workoutResult = await db.collection("workoutPlans").deleteMany({ userId });
    console.log(`[DELETE] Deleted ${workoutResult.deletedCount} workout plan(s) for user ${userId}`);

    // Also delete the associated diet plan(s)
    const dietResult = await db.collection("dietPlans").deleteMany({ userId });
    console.log(`[DELETE] Deleted ${dietResult.deletedCount} diet plan(s) for user ${userId}`);

    return NextResponse.json({ 
      message: "Workout plan deleted successfully",
      deletedWorkouts: workoutResult.deletedCount,
      deletedDiets: dietResult.deletedCount
    });

  } catch (error) {
    console.error("Error deleting workout plan:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
