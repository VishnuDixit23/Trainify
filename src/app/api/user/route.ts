import { NextResponse, NextRequest } from "next/server";
import { MongoClient, Db, Collection } from "mongodb";
import jwt from "jsonwebtoken";

const uri = process.env.MONGODB_URI as string;
const client = new MongoClient(uri);

interface User {
  userId: string;
  name: string;
  email: string;
  height?: number;
  weight?: number;
  age?: number;
  createdAt?: Date;
}

// Function to connect to the database
async function connectToDatabase(): Promise<{ db: Db; usersCollection: Collection<User> }> {
  await client.connect();
  const db = client.db("workout-plan");
  const usersCollection = db.collection<User>("users");
  return { db, usersCollection };
}

// Function to validate and decode JWT
function validateToken(req: NextRequest): { userId: string; name?: string; email: string } | null {
  const authHeader = req.headers.get("Authorization");
  if (!authHeader) return null;

  const token = authHeader.split(" ")[1]; // Expecting "Bearer <token>"
  if (!token) return null;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { userId: string; name?: string; email: string };
    return decoded;
  } catch (err) {
    console.error("Invalid token:", err);
    return null;
  }
}

// 🔹 GET User Data (Fetch the authenticated user's data)
export async function GET(req: NextRequest) {
  try {
    const decodedToken = validateToken(req);
    if (!decodedToken) {
      return NextResponse.json({ error: "User not authenticated" }, { status: 401 });
    }

    const { userId } = decodedToken;
    const { usersCollection } = await connectToDatabase();

    // Fetch user using userId (stored as a string in DB)
    const userData = await usersCollection.findOne({ userId });

    if (!userData) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json(userData);
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json({ error: "Failed to fetch user data" }, { status: 500 });
  }
}

// 🔹 POST User Data (Create or Update user-specific data)
export async function POST(req: NextRequest) {
  try {
    const decodedToken = validateToken(req);
    if (!decodedToken) {
      return NextResponse.json({ error: "User not authenticated" }, { status: 401 });
    }

    const { userId, email, name } = decodedToken;
    const body = await req.json();
    const { usersCollection } = await connectToDatabase();

    const userData: User = {
      userId,
      name: body.name || name || "User",  // Ensure name is stored
      email,
      height: body.height,
      weight: body.weight,
      age: body.age,
      createdAt: new Date(),
    };

    await usersCollection.updateOne(
      { userId },
      { $set: userData },
      { upsert: true }
    );

    return NextResponse.json({ message: "User data saved successfully" });
  } catch (error) {
    console.error("Error saving user:", error);
    return NextResponse.json({ error: "Failed to save user" }, { status: 500 });
  }
}
