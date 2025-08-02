/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import jwt from "jsonwebtoken";

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

// Function to load and filter exercises
const loadExercises = async (filterExercises: string[] | null) => {
  const filePath = path.join(
    process.cwd(),
    "src",
    "app",
    "data",
    "exercises.json"
  );
  const fileContent = await fs.readFile(filePath, "utf-8");
  const allExercises = JSON.parse(fileContent);

  // If no filter is applied, return all exercises
  if (!filterExercises || filterExercises.length === 0) {
    return allExercises;
  }

  // Filter exercises based on names provided
  return allExercises.filter((exercise: any) =>
    filterExercises.includes(exercise.name.toLowerCase())
  );
};

export async function POST(req: NextRequest) {
  try {
    // Verify authentication
    const authHeader = req.headers.get("authorization");
    if (!authHeader) {
      console.log("❌ No Authorization header");
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 403 }
      );
    }

    const decodedToken = verifyToken(authHeader);
    if (!decodedToken?.userId) {
      console.log("❌ Invalid token");
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 403 }
      );
    }

    const userId = decodedToken.userId;

    // Extract request body
    const { routineName, exercises, difficulty } = await req.json();
    if (!routineName || !exercises || exercises.length === 0) {
      return NextResponse.json(
        { error: "Missing workout data" },
        { status: 400 }
      );
    }

    // Load and filter exercises from JSON
    const filteredExercises = await loadExercises(
      exercises.map((e: string) => e.toLowerCase())
    );

    // Default difficulty settings
    const difficultyLevels = {
      beginner: { sets: 3, reps: 12, rest: "60s" },
      intermediate: { sets: 4, reps: 10, rest: "45s" },
      advanced: { sets: 5, reps: 8, rest: "30s" },
    } as const;

    type Difficulty = keyof typeof difficultyLevels;
    const validDifficulties: Difficulty[] = [
      "beginner",
      "intermediate",
      "advanced",
    ];

    // Validate difficulty level
    const selectedDifficulty: Difficulty = validDifficulties.includes(
      difficulty?.toLowerCase() as Difficulty
    )
      ? (difficulty.toLowerCase() as Difficulty)
      : "beginner";

    const workoutSettings = difficultyLevels[selectedDifficulty];

    // Build workout plan
    const generatedWorkout = filteredExercises.map((exercise: any) => ({
      exerciseName: exercise.name,
      sets: workoutSettings.sets,
      reps: workoutSettings.reps,
      rest: workoutSettings.rest,
    }));

    // Save to database

    const newRoutine = {
      userId,
      routineName,
      exercises: generatedWorkout,
    };


    return NextResponse.json(
      { message: "Workout created successfully", workout: newRoutine },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
