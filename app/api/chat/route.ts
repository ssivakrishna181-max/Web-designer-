import { NextRequest, NextResponse } from "next/server";

const GEMINI_MODEL = "gemini-2.5-flash";

export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      console.error("GEMINI_API_KEY is missing");
      return NextResponse.json(
        { error: "Gemini API key is not configured." },
        { status: 500 }
      );
    }

    const body = await request.json();
    const messages = Array.isArray(body?.messages) ? body.messages : [];

    if (messages.length === 0) {
      return NextResponse.json(
        { error: "No messages were provided." },
        { status: 400 }
      );
    }

    const contents = messages
      .filter((message: any) => message?.role !== "system")
      .map((message: any) => {
        const role = message?.role === "assistant" ? "model" : "user";

        let text = "";

        if (typeof message?.content === "string") {
          text = message.content;
        } else if (Array.isArray(message?.content)) {
          text = message.content
            .map((item: any) => {
              if (typeof item === "string") return item;
              return item?.text || "";
            })
            .join("\n");
        }

        return {
          role,
          parts: [{ text }],
        };
      })
      .filter((message: any) => message.parts[0].text.trim());

    const systemMessage = messages.find(
      (message: any) => message?.role === "system"
    );

    const requestBody: any = {
      contents,
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 500,
      },
    };

    if (systemMessage) {
      const systemText =
        typeof systemMessage.content === "string"
          ? systemMessage.content
          : "";

      if (systemText.trim()) {
        requestBody.systemInstruction = {
          parts: [{ text: systemText }],
        };
      }
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey,
        },
        body: JSON.stringify(requestBody),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("Gemini API error:", data);

      return NextResponse.json(
        {
          error: "Gemini API request failed.",
          details: data?.error?.message || "Unknown Gemini API error",
        },
        { status: response.status }
      );
    }

    const reply =
      data?.candidates?.[0]?.content?.parts
        ?.map((part: any) => part?.text || "")
        .join("") || "";

    if (!reply) {
      return NextResponse.json(
        { error: "Gemini returned an empty response." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: reply,
      reply,
    });
  } catch (error) {
    console.error("Chat API error:", error);

    return NextResponse.json(
      {
        error: "Something went wrong while processing the chat request.",
      },
      { status: 500 }
    );
  }
}
