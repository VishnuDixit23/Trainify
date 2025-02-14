"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface Routine {
  _id: string;
  name: string;
  exercises: { name: string; sets: number; reps: number }[];
  isPreMade: boolean;
}

export default function RoutinesPage() {
  const [routines, setRoutines] = useState<Routine[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchRoutines = async () => {
      const res = await fetch("/api/routines/get-routine");
      const data = await res.json();
      setRoutines(data.routines);
    };
    fetchRoutines();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Workout Routines</h1>

      <button
        onClick={() => router.push("/routines/create")}
        className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
      >
        Create Custom Routine
      </button>

      {routines.length === 0 ? (
        <p>No routines found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {routines.map((routine) => (
            <div key={routine._id} className="border p-4 rounded-lg shadow">
              <h2 className="text-xl font-semibold">{routine.name}</h2>
              <ul>
                {routine.exercises.map((ex, index) => (
                  <li key={index}>{ex.name} - {ex.sets} sets x {ex.reps} reps</li>
                ))}
              </ul>
              {routine.isPreMade ? (
                <span className="text-sm text-gray-500">Pre-Made Routine</span>
              ) : (
                <button
                  onClick={async () => {
                    await fetch("/api/routines/delete-routine", {
                      method: "DELETE",
                      body: JSON.stringify({ routineId: routine._id }),
                    });
                    setRoutines(routines.filter(r => r._id !== routine._id));
                  }}
                  className="text-red-500 mt-2"
                >
                  Delete
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
