import mongoose, { Schema, Document } from "mongoose";

interface Exercise {
  name: string;
  sets: number;
  reps: number;
}

export interface IRoutine extends Document {
  userId?: string; // Optional, for user-created routines
  name: string;
  exercises: Exercise[];
  isPreMade: boolean; // Distinguish between pre-made and user-created routines
}

const RoutineSchema = new Schema<IRoutine>({
  userId: { type: String, required: false }, // Required only for user routines
  name: { type: String, required: true },
  exercises: [
    {
      name: { type: String, required: true },
      sets: { type: Number, required: true },
      reps: { type: Number, required: true },
    },
  ],
  isPreMade: { type: Boolean, required: true, default: false },
});

const Routine = mongoose.models.Routine || mongoose.model<IRoutine>("Routine", RoutineSchema);
export default Routine;
