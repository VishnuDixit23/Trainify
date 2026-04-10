"use client";
export const dynamic = "force-dynamic";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

// This page is deprecated — redirect to the main workout-details page
// which now shows the plan directly without needing a separate sub-page.
export default function WorkoutDetailsRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/workout-details");
  }, [router]);

  return null;
}
