/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import Groq from "groq-sdk";
import { connectToDatabase } from "../../../lib/mongodb";
import { authenticateRequest, isAuthenticated, rateLimit, withErrorHandling } from "../../../lib/api-middleware";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(req: Request) {
  // ✅ Rate limit: max 5 workout generations per minute
  const rateLimitResult = rateLimit(req, { maxRequests: 5, windowMs: 60_000 });
  if (rateLimitResult) return rateLimitResult;

  return withErrorHandling(async () => {
    // ✅ Authenticate
    const auth = authenticateRequest(req);
    if (!isAuthenticated(auth)) return auth;

    const {
      age,
      height,
      weight,
      goal,
      gender,
      userId = auth.userId,
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

    // ✅ **Generate AI workout plan using GROQ — Elite Master Prompt**
    const systemPrompt = `You are Coach Atlas — a world-renowned strength & conditioning coach who has trained Olympic athletes, UFC fighters, and Hollywood actors. You hold a PhD in Exercise Physiology from Stanford and are CSCS, NSCA-CPT, and Precision Nutrition Level 2 certified.

YOUR RULES (follow these strictly):
1. NEVER use generic, boring exercises like "Crunches", "Sit-ups", or "Basic Pushups" unless the user is a complete beginner with no equipment.
2. Every workout day MUST have 5-8 exercises minimum. Rest days must include 3-4 active recovery movements.
3. For each exercise, include specific tempo notation (e.g., "3-1-2-0" = 3s eccentric, 1s pause, 2s concentric, 0s pause at top) when appropriate for the experience level.
4. Include RPE (Rate of Perceived Exertion) targets for each exercise (scale 1-10).
5. Use MODERN exercise science terminology: compound supersets, mechanical drop sets, tempo training, unilateral work, mind-muscle connection cues.
6. Structure training days with intelligent muscle group splits (not random exercises thrown together).
7. Name each training day with an engaging, motivational title (e.g., "Day 1 — Iron Foundation: Posterior Chain Dominance").
8. Include at least 2 "important_considerations" covering nutrition timing, sleep, hydration, or injury prevention — all specific to the user's profile.
9. The warm-up must be a SPECIFIC 5-movement dynamic protocol, not "5 min jogging".
10. The cool-down must include specific stretches with hold times.
11. Your plan title must sound like a premium fitness program name (e.g., "The Apex Hypertrophy Protocol", "Project Shred: 7-Day Blueprint", "Iron Symmetry Program").
12. Your description must directly reference the user's stats and goals, sounding like a personal letter from a high-end coach.`;

    const userPrompt = `Generate a 7-day workout plan for this client. Output ONLY valid JSON, no markdown.

CLIENT PROFILE:
• Age: ${age} years old
• Height: ${height}cm | Weight: ${weight}kg | BMI: ${(weight / ((height/100) ** 2)).toFixed(1)}
• Gender: ${gender || 'Not specified'}
• Primary Goal: ${goal}
• Activity Level: ${activityLevel || 'Moderately Active'}
• Experience: ${fitnessExperience || 'Intermediate'}
• Preferred Training Style: ${activityType || 'Strength Training'}
• Equipment Access: ${equipment || 'Full Gym'}
• Medical Conditions: ${medicalConditions || 'None reported'}
• Dietary Style: ${dietaryPreferences || 'No restrictions'}
• Program Focus: ${programSpecificity || 'General Fitness'}

JSON SCHEMA (follow exactly):
{
  "title": "Premium program name",
  "description": "2-3 personalized sentences addressing the client directly, referencing their specific stats and goals",
  "important_considerations": [
    {"title": "Topic", "details": "Specific, actionable advice tailored to this client's profile"}
  ],
  "warm_up": "Detailed 5-movement dynamic warm-up protocol with specific exercises",
  "cool_down": "Specific cool-down with stretches and hold durations",
  "schedule": [
    {
      "day": "Day 1 — Engaging Title: Muscle Focus",
      "workouts": [
        {"exercise": "Exercise Name (with technique cue)", "reps": "8-12 (RPE 8, Tempo 3-1-2-0)", "sets": "4"}
      ]
    }
  ]
}

IMPORTANT: Include exactly 7 days. Each training day must have 5-8 exercises. Rest/recovery days must have 3-4 active recovery movements with mobility work.`;

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.7,
      max_tokens: 4096,
      response_format: { type: "json_object" },
    });

    const responseText = chatCompletion.choices[0]?.message?.content || "{}";
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
      userId: auth.userId,
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
  }, "get-workout");
}