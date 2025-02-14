import { NextResponse } from "next/server";
import { connectToDatabase } from "../../../../lib/mongodb";
import Routine from "../../../../lib/routine";

export async function POST() {
  try {
    await connectToDatabase();

    const preMadeRoutines = [
      {
        name: "Beginner Full Body",
        exercises: [
          { name: "Squats", sets: 3, reps: 10 },
          { name: "Push-ups", sets: 3, reps: 12 },
          { name: "Dumbbell Rows", sets: 3, reps: 10 },
        ],
        isPreMade: true,
      },
      {
        name: "Upper Body Strength",
        exercises: [
          { name: "Bench Press", sets: 4, reps: 8 },
          { name: "Pull-ups", sets: 3, reps: 8 },
          { name: "Overhead Press", sets: 3, reps: 10 },
        ],
        isPreMade: true,
      },
    ];

    await Routine.insertMany(preMadeRoutines);
    return NextResponse.json({ message: "Pre-made routines added!" }, { status: 201 });

  } catch (error) {
    return NextResponse.json({ error: "Failed to add routines" }, { status: 500 });
  }
}
