import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import jwt from "jsonwebtoken";
import { getRoutineByUserId } from "@/lib/Routine";
import exercisesData from "../../../data/exercises.json"; // Load exercises from JSON

interface DecodedToken {
  userId: string;
  iat?: number;
  exp?: number;
}

// Utility function to verify token
const verifyToken = (authHeader: string | null): DecodedToken | null => {
  if (!authHeader?.startsWith("Bearer ")) return null;

  const token = authHeader.split(" ")[1];
  if (!process.env.JWT_SECRET) return null;

  try {
    return jwt.verify(token, process.env.JWT_SECRET) as DecodedToken;
  } catch {
    return null;
  }
};

export async function GET(req: NextRequest) {
  console.log("➡️ [GET] /api/get-user-routine - Request received");

  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 403 }
      );
    }

    const decodedToken = verifyToken(authHeader);
    if (!decodedToken?.userId) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 403 }
      );
    }

    await connectToDatabase();
    console.log("✅ Database connected.");

    const userId = decodedToken.userId;
    const routine = await getRoutineByUserId(userId);

    if (!routine) {
      return NextResponse.json(
        { message: "No routine found", hasRoutine: false },
        { status: 404 }
      );
    }

    const enrichedExercises = routine.exercises.map(
      (exercise: { exerciseName: string }) => {
        const foundExercise = exercisesData.find(
          (ex) => ex.name === exercise.exerciseName
        );
        return foundExercise
          ? { ...exercise, details: foundExercise }
          : exercise;
      }
    );

    return NextResponse.json(
      { hasRoutine: true, ...routine, exercises: enrichedExercises },
      { status: 200 }
    );
  } catch (error) {
    console.error("🚨 Server Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
