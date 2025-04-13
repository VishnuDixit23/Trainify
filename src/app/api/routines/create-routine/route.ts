import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import jwt from "jsonwebtoken";
import { createRoutine, getRoutineByUserId } from "../../../../lib/Routine"; // Use new functions

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

export async function POST(req: NextRequest) {
  console.log("➡️ [POST] /api/create-routine - Request received");

  try {
    if (!process.env.JWT_SECRET) {
      console.error("🚨 Environment Variable JWT_SECRET is not set.");
      return NextResponse.json(
        { success: false, error: "Server configuration error" },
        { status: 500 }
      );
    }

    // 🔹 Extract & verify auth token
    const authHeader =
      req.headers.get("Authorization") || req.headers.get("authorization");
    if (!authHeader) {
      console.warn("❌ No Authorization header provided.");
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 403 }
      );
    }

    const decodedToken = verifyToken(authHeader);
    if (!decodedToken?.userId) {
      console.warn("❌ Invalid or expired JWT token.");
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 403 }
      );
    }

    const db = await connectToDatabase();
    console.log("✅ Database connected.");

    // 🔹 Extract request data
    const { routineName, exercises } = await req.json();
    console.log("📥 Received Data:", { routineName, exercises });

    if (!routineName || !Array.isArray(exercises) || exercises.length === 0) {
      console.warn("❌ Invalid routine data: Missing name or exercises.");
      return NextResponse.json(
        { error: "Invalid routine data" },
        { status: 400 }
      );
    }

    const userId = decodedToken.userId;

    // 🔹 Check if routine already exists
    const existingRoutine = await getRoutineByUserId(userId);
    if (existingRoutine) {
      console.warn(
        `⚠️ Routine '${routineName}' already exists for user '${userId}'.`
      );
      return NextResponse.json(
        { error: "Routine with this name already exists" },
        { status: 409 }
      );
    }

    // 🔹 Create & save routine
    const newRoutine = { userId, routineName, exercises };
    const result = await createRoutine(newRoutine);

    console.log(
      `✅ Routine '${routineName}' created successfully for user '${userId}'.`
    );
    return NextResponse.json(
      { message: "Routine created successfully", routine: result },
      { status: 201 }
    );
  } catch (error) {
    console.error("🚨 Server Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
