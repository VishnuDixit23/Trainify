import { NextResponse, NextRequest } from "next/server";
import jwt from "jsonwebtoken";

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get("Authorization");
    console.log("Authorization header received:", authHeader);

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      console.error("No token or invalid format.");
      return NextResponse.json(
        { error: "Unauthorized: No token provided" },
        { status: 401 }
      );
    }

    const token = authHeader.split(" ")[1];
    console.log("Token received:", token);

    const secretKey = process.env.JWT_SECRET;
    if (!secretKey) {
      console.error("JWT_SECRET is missing in environment variables.");
      return NextResponse.json(
        { error: "Server error: Missing JWT secret" },
        { status: 500 }
      );
    }

    const decoded = jwt.verify(token, secretKey) as { userId: string; email: string };
    console.log("Decoded user data:", decoded);

    return NextResponse.json({ user: decoded }, { status: 200 });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Error in /api/auth/me:", error.message);

    if (error.name === "TokenExpiredError") {
      return NextResponse.json(
        { error: "Unauthorized: Token has expired" },
        { status: 401 }
      );
    } else if (error.name === "JsonWebTokenError") {
      return NextResponse.json(
        { error: "Unauthorized: Invalid token" },
        { status: 401 }
      );
    } else {
      return NextResponse.json(
        { error: "Server error: Unexpected issue occurred" },
        { status: 500 }
      );
    }
  }
}
