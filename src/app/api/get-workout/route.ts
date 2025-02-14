import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { connectToDatabase } from "../../../lib/mongodb";
import jwt from "jsonwebtoken";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY as string);

export async function POST(req: Request) {
  try {
    // 🔹 Extract token from headers
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized: Missing token" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1]; // Extract token
    let decodedToken: any;

    try {
      decodedToken = jwt.verify(token, process.env.JWT_SECRET as string); // Decode JWT
    } catch (error) {
      return NextResponse.json({ error: "Unauthorized: Invalid token" }, { status: 403 });
    }

    if (!decodedToken || typeof decodedToken !== "object" || !decodedToken.userId) {
      return NextResponse.json({ error: "Unauthorized: Invalid token payload" }, { status: 403 });
    }

    const {
      age,
      height,
      weight,
      goal,
      userId = decodedToken.userId,
      activityLevel,
      fitnessExperience,
      medicalConditions,
      dietaryPreferences,
      activityType,
      equipment,
      programSpecificity,
    } = await req.json();

    if (!age || !height || !weight || !goal) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // ✅ Connect to MongoDB
    const db  = await connectToDatabase();
    const collection = db.collection("workoutPlans");

    // ✅ **Check if user already has a workout plan**
    const existingPlan = await collection.findOne({ userId });

    if (existingPlan) {
      return NextResponse.json(
        { error: "You already have a workout plan. Delete it before generating a new one.", existingPlan },
        { status: 400 }
      );
    }

    // ✅ **Generate AI workout plan**
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `
      Generate a detailed 7-day workout plan in valid JSON format for a ${age}-year-old aiming for ${goal}.
      The JSON should include:
      - title
      - description
      - important_considerations
      - warm_up
      - cool_down
      - schedule (7 days)
      
      Example:
      {
        "title": "Personalized Workout Plan",
        "description": "A structured plan tailored to fitness goals.",
        "important_considerations": [{"title": "Diet", "details": "High protein intake recommended"}],
        "warm_up": "5 min jogging",
        "cool_down": "Stretching exercises",
        "schedule": [
          { "day": "Day 1", "workouts": [ { "exercise": "Squats", "reps": "12", "sets": "3" } ] }
        ]
      }
        
      Respond in strict JSON format.
    `;

    const result = await model.generateContent(prompt);

    if (!result?.response?.candidates?.[0]?.content?.parts?.[0]?.text) {
      return NextResponse.json({ error: "AI response error" }, { status: 500 });
    }

    let responseText = result.response.candidates[0].content.parts[0].text;
    responseText = responseText.replace(/```json|```/g, "").trim();
    console.log("Raw AI Response:", responseText);


    let aiGeneratedPlan;
    try {
      aiGeneratedPlan = JSON.parse(responseText);
    } catch (error) {
      return NextResponse.json({ error: "Invalid AI response format" }, { status: 500 });
    }

    if (!aiGeneratedPlan.schedule || !Array.isArray(aiGeneratedPlan.schedule)) {
      return NextResponse.json({ error: "Invalid AI workout plan" }, { status: 500 });
    }

    const workoutPlan = {
      title: aiGeneratedPlan.title || "Your Personalized Workout Plan",
      description: aiGeneratedPlan.description || `Workout plan for a ${age}-year-old targeting ${goal}.`,
      important_considerations: aiGeneratedPlan.important_considerations || [],
      warm_up: aiGeneratedPlan.warm_up || "Light cardio and stretching.",
      cool_down: aiGeneratedPlan.cool_down || "Stretching and relaxation.",
      schedule: aiGeneratedPlan.schedule,
    };

    // ✅ **Save the new workout plan**
    const savedPlan = await collection.insertOne({
      userId : decodedToken.userId,
      age,
      height,
      weight,
      goal,
      activityLevel,
      fitnessExperience,
      medicalConditions,
      dietaryPreferences,
      activityType,
      equipment,
      programSpecificity,
      workoutPlan,
      createdAt: new Date(),
    });

    return NextResponse.json({ workoutPlan, dbId: savedPlan.insertedId });

  } catch (error) {
    console.error("Error generating workout plan:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}