import mongoose from "mongoose";

const LoggedWorkoutSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  date: { type: String, required: true }, // Store in YYYY-MM-DD format
  exercises: [
    {
      exercise: { type: String, required: true },
      reps: { type: Number },
      sets: { type: Number },
      duration: { type: String },
      intensity: { type: String },
      rest: { type: String },
    },
  ],
});

export default mongoose.models.LoggedWorkout || mongoose.model("LoggedWorkout", LoggedWorkoutSchema);
