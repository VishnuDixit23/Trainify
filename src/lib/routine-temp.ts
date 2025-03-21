import { Db } from "mongodb";
import { connectToDatabase } from "./mongodb"; // Ensure you're using the native driver

export interface Routine {
  userId: string;
  routineName: string;
  exercises: {
    exerciseName: string;
    sets: number;
    reps: number;
    weight?: number; // Optional for bodyweight exercises
  }[];
}

// Function to insert a routine into the database
export async function createRoutine(routine: Routine) {
  const db: Db = await connectToDatabase();
  const routinesCollection = db.collection("routines"); // Ensure this matches your DB collection name

  const result = await routinesCollection.insertOne(routine);
  return result;
}

// Function to find a routine by user ID
export async function getRoutineByUserId(userId: string) {
  const db: Db = await connectToDatabase();
  return db.collection("routines").findOne({ userId });
}

export async function deleteRoutineByUserId(userId: string) {
  try {
    const db = await connectToDatabase();
    const routinesCollection = db.collection("routines");

    const result = await routinesCollection.deleteOne({ userId });

    return result.deletedCount > 0; // Returns `true` if a document was deleted, otherwise `false`
  } catch (error) {
    console.error("🚨 Error deleting routine:", error);
    throw new Error("Failed to delete routine");
  }
}
