export async function POST(req: Request) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return Response.json(
        { error: "GEMINI_API_KEY is not configured." },
        { status: 500 }
      );
    }

    const body = await req.json();

    console.log("CHAT BODY:", JSON.stringify(body));

    let message = "";

    if (typeof body.message === "string") {
      message = body.message;
    }

    if (!message && typeof body.prompt === "string") {
      message = body.prompt;
    }

    if (!message && typeof body.text === "string") {
      message = body.text;
    }

    if (!message && typeof body.input === "string") {
      message = body.input;
    }

    if (!message && typeof body.content === "string") {
      message = body.content;
    }

    if (!message && Array.isArray(body.messages)) {
      const last = body.messages[body.messages.length - 1];

      if (typeof last === "string") {
        message = last;
      } else if (last && typeof last.content === "string") {
        message = last.content;
      } else if (last && typeof last.text === "string") {
        message = last.text;
      }
    }

    message = message.trim();

    console.log("CHAT MESSAGE:", message);

    if (!message) {
      return Response.json(
        { error: "No message was received." },
        { status: 400 }
      );
    }

    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.7-flash:generateContent",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey,
        },
        body: JSON.stringify({
          systemInstruction: {
            parts: [
              {
                text:
                  "You are the SK Designer portfolio website AI assistant. " +
                  "Help visitors with SK Designer's services, portfolio, " +
                  "graphic design projects, design work, and contacting SK. " +
                  "Be friendly, professional, concise and helpful.",
              },
            ],
          },
          contents: [
            {
              role: "user",
              parts: [
                {
                  text: message,
                },
              ],
            },
          ],
          generationConfig: {
            maxOutputTokens: 500,
          },
        }),
      }
    );

    const data = await response.json();

    console.log("GEMINI STATUS:", response.status);

    if (!response.ok) {
      console.error("GEMINI ERROR:", JSON.stringify(data));

      return Response.json(
        {
          error:
            data?.error?.message ||
            "Gemini API request failed.",
        },
        { status: 500 }
      );
    }

    const reply =
      data?.candidates?.[0]?.content?.parts
        ?.map((part: any) => part?.text || "")
        .join("")
        .trim();

    if (!reply) {
      return Response.json(
        { error: "Gemini returned an empty response." },
        { status: 500 }
      );
    }

    return Response.json({
      reply,
      message: reply,
      response: reply,
      text: reply,
    });

  } catch (error: any) {
    console.error("CHAT ERROR:", error);

    return Response.json(
      {
        error:
          error?.message ||
          "Unable to contact the AI service.",
      },
      { status: 500 }
    );
  }
}
