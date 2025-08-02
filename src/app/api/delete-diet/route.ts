import { NextResponse } from "next/server";
import { connectToDatabase } from "../../../lib/mongodb";
import jwt from "jsonwebtoken";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { ObjectId } from "mongodb";

export async function DELETE(req: Request) {
  try {
    // 🔹 Extract token from headers
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized: Missing token" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1]; // Extract token
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let decodedToken: any;

    try {
      decodedToken = jwt.verify(token, process.env.JWT_SECRET as string); // Decode JWT
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      return NextResponse.json({ error: "Unauthorized: Invalid token" }, { status: 403 });
    }

    if (!decodedToken || typeof decodedToken !== "object" || !decodedToken.userId) {
      return NextResponse.json({ error: "Unauthorized: Invalid token payload" }, { status: 403 });
    }

    const userId = decodedToken.userId;

    // ✅ Connect to MongoDB
    const db = await connectToDatabase();
    const collection = db.collection("dietPlans");

    // ✅ Check if the user has a diet plan
    const existingPlan = await collection.findOne({ userId });

    if (!existingPlan) {
      return NextResponse.json({ error: "No diet plan found to delete" }, { status: 404 });
    }

    // ✅ Delete the diet plan
    await collection.deleteOne({ userId });

    return NextResponse.json({ message: "Diet plan deleted successfully" });

  } catch (error) {
    console.error("Error deleting diet plan:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
