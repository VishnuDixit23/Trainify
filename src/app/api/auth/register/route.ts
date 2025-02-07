import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { connectToDatabase } from "../../../../lib/mongodb"; // ✅ Correct import

export async function POST(req: NextRequest) {
  try {
    const { name, email, password } = await req.json();
    if (!name || !email || !password) {
      return NextResponse.json({ message: "Name, email, and password are required" }, { status: 400 });
    }

    const { db } = await connectToDatabase(); // ✅ Get db instance
    const existingUser = await db.collection("users").findOne({ email });
    if (existingUser) {
      return NextResponse.json({ message: "User already exists" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await db.collection("users").insertOne({ name, email, password: hashedPassword });

    const token = jwt.sign(
      { userId: newUser.insertedId, name, email }, // ✅ Include name in JWT
      process.env.JWT_SECRET!,
      { expiresIn: "7d" }
    );

    return NextResponse.json({ token }, { status: 201 });
  } catch (error) {
    console.error("Register Error:", error);
    return NextResponse.json(
      { 
        message: "Server Error", 
        error: error instanceof Error ? error.message : "Unknown Error" 
      }, 
      { status: 500 }
    );
  }
}
