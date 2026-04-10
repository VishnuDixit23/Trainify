/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

/**
 * Shared authentication middleware for API routes.
 * Extracts and verifies JWT from the Authorization header.
 * Returns { userId, decodedToken } on success.
 * Returns a NextResponse error on failure.
 */
export function authenticateRequest(req: Request):
  | { userId: string; decodedToken: any }
  | NextResponse {
  const authHeader = req.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return NextResponse.json(
      { error: "Unauthorized: Missing token" },
      { status: 401 }
    );
  }

  const token = authHeader.split(" ")[1];
  let decodedToken: any;

  try {
    decodedToken = jwt.verify(token, process.env.JWT_SECRET as string);
  } catch {
    return NextResponse.json(
      { error: "Unauthorized: Invalid or expired token" },
      { status: 403 }
    );
  }

  if (
    !decodedToken ||
    typeof decodedToken !== "object" ||
    !decodedToken.userId
  ) {
    return NextResponse.json(
      { error: "Unauthorized: Invalid token payload" },
      { status: 403 }
    );
  }

  return { userId: decodedToken.userId, decodedToken };
}

/**
 * Type guard: checks if the result is an authenticated response (not an error).
 */
export function isAuthenticated(
  result: { userId: string; decodedToken: any } | NextResponse
): result is { userId: string; decodedToken: any } {
  return !(result instanceof NextResponse);
}

/**
 * Simple in-memory rate limiter for API routes.
 * Tracks requests per IP within a sliding window.
 */
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

export function rateLimit(
  req: Request,
  { maxRequests = 10, windowMs = 60_000 }: { maxRequests?: number; windowMs?: number } = {}
): NextResponse | null {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown";

  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + windowMs });
    return null; // allowed
  }

  if (entry.count >= maxRequests) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { status: 429 }
    );
  }

  entry.count++;
  return null; // allowed
}

/**
 * Wraps an API handler with consistent error handling.
 * Catches unhandled exceptions and returns a clean 500 response.
 */
export async function withErrorHandling(
  handler: () => Promise<NextResponse>,
  context: string = "API"
): Promise<NextResponse> {
  try {
    return await handler();
  } catch (error) {
    console.error(`[${context}] Unhandled error:`, error);
    return NextResponse.json(
      { error: "An unexpected server error occurred. Please try again." },
      { status: 500 }
    );
  }
}
