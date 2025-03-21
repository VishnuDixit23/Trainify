import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import jwt from "jsonwebtoken";
import { createRoutine, getRoutineByUserId, deleteRoutineByUserId } from "@/lib/Routine"; // ✅ Use named imports


interface DecodedToken {
  userId: string;
  iat?: number;
  exp?: number;
}

// Utility function to verify token
const verifyToken = (authHeader: string | null): DecodedToken | null => {
  if (!authHeader?.startsWith("Bearer ")) {
    console.error("🚨 No Bearer token found in Authorization header.");
    return null;
  }

  const token = authHeader.split(" ")[1];

  if (!process.env.JWT_SECRET) {
    console.error("🚨 Missing JWT_SECRET in environment variables.");
    return null;
  }

  try {
    return jwt.verify(token, process.env.JWT_SECRET) as DecodedToken;
  } catch (error) {
    console.error("🚨 JWT Verification Error:", error);
    return null;
  }
};

export async function PUT(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader) {
      console.log("❌ No Authorization header");
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 403 });
    }

    const decodedToken = verifyToken(authHeader);
    if (!decodedToken?.userId) {
      console.log("❌ Invalid token");
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 403 });
    }

    await connectToDatabase();
    const userId = decodedToken.userId;
    const { routineId, routineName, exercises } = await req.json();

    if (!routineId || !routineName || !exercises) {
      return NextResponse.json({ error: "Missing routine data" }, { status: 400 });
    }

    // Find and update the routine
    const updatedRoutine = await routineId.findOneAndUpdate(
      { _id: routineId, userId }, // Ensure the routine belongs to the user
      { routineName, exercises },
      { new: true }
    );

    if (!updatedRoutine) {
      return NextResponse.json({ error: "Routine not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Routine updated successfully", routine: updatedRoutine }, { status: 200 });
  } catch (error) {
    console.error("🚨 Server Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}