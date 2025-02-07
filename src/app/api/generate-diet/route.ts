import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { connectToDatabase } from "../../../lib/mongodb";
import jwt from "jsonwebtoken";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY as string);

export async function POST(req: Request) {
  try {
    // 🔹 Extract token from header
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
      dietaryPreferences,
      allergies,
      preferredMealCount,
    } = await req.json();

    if (!age || !height || !weight || !goal) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // ✅ Connect to MongoDB
    const db = await connectToDatabase();
    const collection = db.collection("dietPlans");

    // ✅ **Check if user already has a diet plan**
    const existingPlan = await collection.findOne({ userId });

    if (existingPlan) {
      return NextResponse.json(
        { error: "You already have a diet plan. Delete it before generating a new one.", existingPlan },
        { status: 400 }
      );
    }

    // ✅ **Generate AI diet plan**
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
      Generate a **personalized 7-day diet plan** in strict **JSON format** for a ${age}-year-old aiming for **${goal}**.
      User Details:
      - Age: ${age}
      - Height: ${height} cm
      - Weight: ${weight} kg
      - Activity Level: ${activityLevel}
      - Dietary Preferences: ${dietaryPreferences || "None"}
      - Allergies: ${allergies || "None"}
      - Preferred Meals per Day: ${preferredMealCount || 5}

      The JSON should include:
      - **title**: A catchy name for the diet plan
      - **description**: A short overview of the meal plan
      - **daily_caloric_intake**: Total recommended daily calories
      - **macronutrients**: Breakdown of protein, carbs, fats in grams
      - **pre_workout_meal**: Suggested pre-workout meal for energy
      - **post_workout_meal**: Suggested post-workout meal for recovery
      - **meals**: A list of meals for **Breakfast, Lunch, Dinner, Snacks**
      - **important_considerations**: Any notes on hydration, timing, or nutritional advice

      **Strict JSON Format Example**:
      {
        "title": "Muscle Gain High-Protein Diet",
        "description": "A structured 7-day meal plan tailored for muscle growth.",
        "daily_caloric_intake": "2800 kcal",
        "macronutrients": { "protein": "180g", "carbs": "300g", "fats": "70g" },
        "pre_workout_meal": "Oatmeal with banana & peanut butter",
        "post_workout_meal": "Chicken breast, rice, and steamed broccoli",
        "meals": [
          { "meal": "Breakfast", "items": ["Scrambled eggs", "Oatmeal", "Avocado toast"] },
          { "meal": "Lunch", "items": ["Grilled salmon", "Quinoa", "Steamed spinach"] },
          { "meal": "Dinner", "items": ["Chicken breast", "Sweet potatoes", "Asparagus"] },
          { "meal": "Snack 1", "items": ["Protein shake", "Almonds"] },
          { "meal": "Snack 2", "items": ["Greek yogurt", "Berries"] }
        ],
        "important_considerations": [{ "title": "Hydration", "details": "Drink at least 3 liters of water daily" }]
      }
      
      🔹 **Respond ONLY in valid JSON format** with no extra text.
    `;

    const result = await model.generateContent(prompt);

    if (!result?.response?.candidates?.[0]?.content?.parts?.[0]?.text) {
      return NextResponse.json({ error: "AI response error" }, { status: 500 });
    }

    let responseText = result.response.candidates[0].content.parts[0].text;
    responseText = responseText.replace(/```json|```/g, "").trim();

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
      userId: decodedToken.userId,
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

  } catch (error) {
    console.error("Error generating diet plan:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
