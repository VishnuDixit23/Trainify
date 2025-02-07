import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    // Parse the request body
    const body = await req.json();
    const { prompt } = body;

    // Validate prompt
    if (!prompt || prompt.trim() === "") {
      return NextResponse.json(
        { error: "Prompt cannot be empty." },
        { status: 400 }
      );
    }

    // Validate API key
    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "API key is missing or not configured." },
        { status: 500 }
      );
    }

    // Define API endpoint
    const endpoint = `https://generativelanguage.googleapis.com/v1beta2/models/chat-bison-001:generateMessage`;

    // Prepare request body for the API
    const requestBody = {
      prompt: {
        messages: [
          {
            author: "user",
            content: prompt, // Use the user-provided prompt
          },
        ],
      },
    };

    // Make the API request
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`, // Include API key in the Authorization header
      },
      body: JSON.stringify(requestBody), // Send the actual request body
    });

    // Handle API errors
    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        {
          error:
            errorData.error?.message || "Failed to fetch response from Gemini.",
        },
        { status: response.status }
      );
    }

    // Parse API response
    const data = await response.json();
    const reply = data.candidates?.[0]?.content || "Sorry, I couldn't generate a response.";

    // Return the response
    return NextResponse.json({ reply });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "An error occurred while processing your request." },
      { status: 500 }
    );
  }
}
