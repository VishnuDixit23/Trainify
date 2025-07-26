import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import jwt from "jsonwebtoken";
import { deleteRoutineByUserId } from "@/lib/routine";

interface DecodedToken {
  userId: string;
  iat?: number;
  exp?: number;
}

// Utility function to verify token
const verifyToken = (authHeader: string | null): DecodedToken | null => {
  if (!authHeader?.startsWith("Bearer ")) {
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

export async function DELETE(req: NextRequest) {
  console.log("➡️ [DELETE] /api/delete-user-routine - Request received");

  try {
    // 🔹 Extract & verify auth token
    const authHeader = req.headers.get("authorization");
    if (!authHeader) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 403 }
      );
    }

    const decodedToken = verifyToken(authHeader);
    if (!decodedToken?.userId) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 403 }
      );
    }

    const userId = decodedToken.userId;

    await connectToDatabase();
    console.log("✅ Database connected.");

    const isDeleted = await deleteRoutineByUserId(userId);

    if (!isDeleted) {
      console.warn(`⚠️ No routine found for user '${userId}' to delete.`);
      return NextResponse.json(
        { success: false, message: "No routine found" },
        { status: 404 }
      );
    }

    console.log(`✅ Routine deleted successfully for user '${userId}'.`);
    return NextResponse.json(
      { success: true, message: "Routine deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("🚨 Server Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
