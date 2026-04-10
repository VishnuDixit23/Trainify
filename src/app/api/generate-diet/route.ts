/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import Groq from "groq-sdk";
import { connectToDatabase } from "../../../lib/mongodb";
import { authenticateRequest, isAuthenticated, rateLimit, withErrorHandling } from "../../../lib/api-middleware";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(req: Request) {
  // ✅ Rate limit: max 5 diet generations per minute
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
      userId = auth.userId,
      activityLevel,
      dietaryPreferences,
      allergies,
      preferredMealCount,
    } = await req.json();



    // ✅ Connect to MongoDB
    const db = await connectToDatabase();
    const collection = db.collection("dietPlans");

    // ✅ **Check if user already has a diet plan**
    const existingPlan = await collection.findOne({ userId });

    // ✅ **If existing plan found, return it immediately (no regeneration)**
    if (existingPlan && existingPlan.dietPlan) {
      return NextResponse.json({ dietPlan: existingPlan.dietPlan, cached: true });
    }

    // ✅ **Generate AI diet plan using GROQ — Elite Nutritionist Prompt**
    const systemPrompt = `You are Dr. Nourish — a world-class sports nutritionist who has been the lead dietician for Olympic training centers and has authored 3 bestselling nutrition books. You hold dual certifications from the International Society of Sports Nutrition (ISSN) and Precision Nutrition (PN Level 2).

YOUR RULES (follow strictly):
1. Calculate the client's approximate TDEE based on their stats and activity level. Show your work in the description.
2. Every meal MUST include specific portions in grams/cups/tbsp (no vague amounts like "some" or "a serving").
3. The macronutrient split must be scientifically justified for the client's specific goal (e.g., high protein for muscle gain, moderate deficit for fat loss).
4. STRICTLY respect dietary preferences. If vegetarian, NEVER include meat/fish/eggs unless explicitly stated they eat eggs. If vegan, NO animal products whatsoever.
5. Include culturally relevant food options. For Indian clients, use items like dal, paneer, roti, dosa, idli, poha, rajma, chole, etc. alongside global options.
6. Pre/post workout meals must include specific timing recommendations (e.g., "30-45 minutes before training").
7. Include at least 5 meals: Breakfast, Mid-Morning Snack, Lunch, Evening Snack, Dinner.
8. Each meal must have 3-5 specific food items with exact portions.
9. Important considerations must include: hydration protocol, supplement recommendations (if appropriate), and meal prep tips.
10. The title must sound like a premium nutrition program (e.g., "The Metabolic Ignition Protocol", "Clean Fuel Blueprint", "The Anabolic Kitchen Plan").
11. Never suggest harmful or extreme diets. Focus on sustainable, evidence-based nutrition.`;

    const userPrompt = `Create a personalized daily nutrition menu for this client. Output ONLY valid JSON, no markdown.

CLIENT PROFILE:
• Age: ${age} years old
• Height: ${height}cm | Weight: ${weight}kg | BMI: ${(weight / ((height/100) ** 2)).toFixed(1)}
• Primary Goal: ${goal}
• Activity Level: ${activityLevel || 'Moderately Active'}
• Dietary Preferences: ${dietaryPreferences || 'No restrictions'} — STRICTLY follow this. Zero exceptions.
• Allergies: ${allergies || 'None'} — Completely exclude these ingredients.
• Meals per Day: ${preferredMealCount || 5}

JSON SCHEMA (follow exactly):
{
  "title": "Premium nutrition program name",
  "description": "2-3 motivating sentences referencing the client's stats, calculated TDEE, and why this plan fits their goal",
  "daily_caloric_intake": "Exact number like 2800 kcal",
  "macronutrients": {"protein": "180g", "carbs": "300g", "fats": "70g"},
  "pre_workout_meal": "Specific meal with portions and timing (e.g., 30-45 min before training: ...)",
  "post_workout_meal": "Specific recovery meal with portions and timing (e.g., within 30 min post-training: ...)",
  "meals": [
    {"meal": "Breakfast", "items": ["Food item with exact portion in grams", "Item 2", "Item 3"]},
    {"meal": "Mid-Morning Snack", "items": ["Item 1", "Item 2"]},
    {"meal": "Lunch", "items": ["Item 1", "Item 2", "Item 3"]},
    {"meal": "Evening Snack", "items": ["Item 1", "Item 2"]},
    {"meal": "Dinner", "items": ["Item 1", "Item 2", "Item 3"]}
  ],
  "important_considerations": [
    {"title": "Topic", "details": "Specific, actionable advice"}
  ]
}

IMPORTANT: Generate exactly ${preferredMealCount || 5} meals. Each meal must have 3-5 food items with specific portions.`;

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

    let aiGeneratedPlan;
    try {
      aiGeneratedPlan = JSON.parse(responseText);
    } catch (error) {
      return NextResponse.json({ error: "Invalid AI response format" }, { status: 500 });
    }

    if (!aiGeneratedPlan.meals || !Array.isArray(aiGeneratedPlan.meals)) {
      return NextResponse.json({ error: "Invalid AI diet plan format" }, { status: 500 });
    }

    const dietPlan = {
      title: aiGeneratedPlan.title || "Your Personalized Diet Plan",
      description: aiGeneratedPlan.description || `Diet plan for a ${age}-year-old targeting ${goal}.`,
      daily_caloric_intake: aiGeneratedPlan.daily_caloric_intake || "Unknown",
      macronutrients: aiGeneratedPlan.macronutrients || { protein: "N/A", carbs: "N/A", fats: "N/A" },
      pre_workout_meal: aiGeneratedPlan.pre_workout_meal || "N/A",
      post_workout_meal: aiGeneratedPlan.post_workout_meal || "N/A",
      meals: aiGeneratedPlan.meals,
      important_considerations: aiGeneratedPlan.important_considerations || [],
    };

    // ✅ **Save the new diet plan**
    const savedPlan = await collection.insertOne({
      userId: auth.userId,
      age,
      height,
      weight,
      goal,
      activityLevel,
      dietaryPreferences,
      allergies,
      preferredMealCount,
      dietPlan,
      createdAt: new Date(),
    });

    return NextResponse.json({ dietPlan, dbId: savedPlan.insertedId });
  }, "generate-diet");
}
