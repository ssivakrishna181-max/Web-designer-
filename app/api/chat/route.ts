import OpenAI from "openai";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    if (!message || typeof message !== "string") {
      return NextResponse.json(
        { reply: "Please enter a message." },
        { status: 400 }
      );
    }

    if (!process.env.OPENAI_API_KEY) {
      console.error("OPENAI_API_KEY is missing.");
      return NextResponse.json(
        { reply: "AI service is not configured yet." },
        { status: 500 }
      );
    }

    const client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const response = await client.responses.create({
      model: process.env.OPENAI_MODEL || "gpt-5.4-mini",
      instructions: `
You are the SK Designer portfolio AI assistant.

You represent SK Designer, a professional graphic designer.

Help visitors with:
- Graphic design services
- Logo design
- Poster and flyer design
- Social media design
- Branding
- Portfolio projects
- Starting a design project
- General questions about SK Designer

Be friendly, professional, concise, and helpful.
If a visitor wants to start a project, encourage them to use the contact option on the portfolio.

Do not invent personal information, clients, prices, awards, or projects that are not provided.
      `,
      input: message,
    });

    return NextResponse.json({
      reply:
        response.output_text ||
        "I'm sorry, I couldn't generate a response right now.",
    });
  } catch (error) {
    console.error("OpenAI chat error:", error);

    return NextResponse.json(
      {
        reply:
          "I'm temporarily unavailable. Please try again in a moment.",
      },
      { status: 500 }
    );
  }
}
