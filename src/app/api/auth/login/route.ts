import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { connectToDatabase } from "@/lib/mongodb";

const SECRET_KEY = process.env.JWT_SECRET!;
const REFRESH_SECRET = process.env.REFRESH_SECRET!; // Secret for refresh token

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    // Validate request payload
    if (!email || !password) {
      return NextResponse.json({ message: "Email and password are required" }, { status: 400 });
    }

    // Connect to the database and find the user
    const  db  = await connectToDatabase();
    const user = await db.collection("users").findOne({ email });

    if (!user) {
      return NextResponse.json({ message: "Invalid email or password" }, { status: 401 });
    }

    // Validate password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json({ message: "Invalid email or password" }, { status: 401 });
    }

    // Generate short-lived access token
    const accessToken = jwt.sign(
      { 
        userId: user._id.toString(), 
        name: user.name,
        email: user.email,
      },
      SECRET_KEY,
      { expiresIn: "15m" }
    );

    // Generate long-lived refresh token
    const refreshToken = jwt.sign(
      { userId: user._id },
      REFRESH_SECRET,
      { expiresIn: "7d" }
    );

    // Save the refresh token in the database (optional, for enhanced security)
    await db.collection("refreshTokens").updateOne(
      { userId: user._id },
      { $set: { refreshToken } },
      { upsert: true }
    );

    // Set the refresh token in a secure, HttpOnly cookie
    const response = NextResponse.json({
      accessToken,
      user: { id: user._id, name: user.name, email: user.email },
    });
    response.cookies.set("refresh_token", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return response;
  } catch (error) {
    console.error("Login Error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
