import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

// Fix: Correctly reference the file inside `src/app/data/`
const filePath = path.join(process.cwd(), "src", "app", "data", "exercises.json");

export async function POST(req: Request) {
  try {
    // Read the JSON file dynamically (ensures fresh data)
    const rawData = fs.readFileSync(filePath, "utf-8");
    const exercises = JSON.parse(rawData);

    const { exercise } = await req.json();

    // Find the requested exercise
    const matchedExercise = exercises.find(
      (ex: any) => ex.name.toLowerCase() === exercise.toLowerCase()
    );

    if (!matchedExercise) {
      return NextResponse.json({ error: "Exercise not found", alternatives: [] }, { status: 404 });
    }

    // Get alternative exercises from the same category
    const alternatives = exercises
      .filter((ex: any) => ex.category === matchedExercise.category && ex.name !== matchedExercise.name)
      .map((ex: any) => ex.name); // Only return names

    return NextResponse.json({ alternatives });
  } catch (error) {
    console.error("Error reading exercises.json:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
