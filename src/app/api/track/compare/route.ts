import { NextResponse } from "next/server";
import { connectToDatabase } from "../../../../lib/mongodb";
import jwt from "jsonwebtoken";



export async function GET(req: Request) {
    
    try {
      const authHeader = req.headers.get("authorization");
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return NextResponse.json(
          { success: false, error: "Unauthorized: Missing token" },
          { status: 401 }
        );
      }
  
      const token = authHeader.split(" ")[1];
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET as string) as { userId: string };
  
      if (!decodedToken?.userId) {
        return NextResponse.json(
          { success: false, error: "Unauthorized: Invalid token payload" },
          { status: 403 }
        );
      }
  
      const db = await connectToDatabase();
      const userId = decodedToken.userId;
      const today = new Date().toISOString().split("T")[0];
  
      // Fetch the logged workout
      const loggedWorkout = await db.collection("workoutLogs").findOne({ userId, date: today });
  
      if (!loggedWorkout) {
        return NextResponse.json({ message: "No workout log found for today" }, { status: 404 });
      }
  
      // Compare logged vs planned workouts
      const plannedExercises = loggedWorkout.plannedExercises;
      const loggedExercises = loggedWorkout.loggedExercises;
  
      let completedAll = true;
      // Define the structure of an exercise object
interface Exercise {
    exercise: string;
    reps?: number;
    sets?: number;
    duration?: string;
    intensity?: string;
    rest?: string;
  }
  
  // Ensure TypeScript knows what types we're dealing with
  let comparisonResults = plannedExercises.map((planned: Exercise) => {
    const match = loggedExercises.find((logged: Exercise) => logged.exercise === planned.exercise);
  
    if (!match) {
      completedAll = false;
      return {
        exercise: planned.exercise,
        status: "Missed",
      };
    }
  
    const isComplete =
      (match.reps && planned.reps && match.reps >= planned.reps) &&
      (match.sets && planned.sets && match.sets >= planned.sets);
  
    if (!isComplete) completedAll = false;
  
    return {
      exercise: planned.exercise,
      status: isComplete ? "Completed" : "Incomplete",
      planned,
      logged: match,
    };
  });
  
   return NextResponse.json({
        success: true,
        completedAll,
        comparisonResults,
      });
    } catch (error) {
      console.error("Error comparing workout log:", error);
      return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
  }
  