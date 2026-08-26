import OpenAI from "openai";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { message } = await req.json();
    if (!message) return NextResponse.json({ reply: "Please enter a message." }, { status: 400 });

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ reply: "AI is not configured yet. Please add OPENAI_API_KEY to the deployment environment." });
    }

    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const response = await client.responses.create({
      model: process.env.OPENAI_MODEL || "gpt-5-mini",
      instructions: `You are the AI assistant for SK — I AM A DESIGNER, a professional creative portfolio. Skills: Graphic Design, Artificial Intelligence, Video Editing, Content Creation, Affiliate Marketing. Be concise, professional, helpful, and guide visitors toward relevant work or starting a project. Do not invent clients, prices, awards, projects, or credentials.`,
      input: message
    });

    return NextResponse.json({ reply: response.output_text });
  } catch {
    return NextResponse.json({ reply: "I’m temporarily unavailable. Please use the contact option instead." }, { status: 500 });
  }
}
