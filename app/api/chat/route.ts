export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(req: Request) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      console.error("GEMINI_API_KEY is missing");

      return Response.json(
        { error: "Gemini API key is not configured." },
        { status: 500 }
      );
    }

    const body = await req.json();

    let message = "";

    // Format 1
    if (typeof body?.message === "string") {
      message = body.message;
    }

    // Format 2
    else if (typeof body?.prompt === "string") {
      message = body.prompt;
    }

    // Format 3 - AI SDK / modern chat format
    else if (Array.isArray(body?.messages)) {
      const lastMessage = body.messages[body.messages.length - 1];

      if (typeof lastMessage === "string") {
        message = lastMessage;
      }

      else if (typeof lastMessage?.content === "string") {
        message = lastMessage.content;
      }

      else if (Array.isArray(lastMessage?.parts)) {
        message = lastMessage.parts
          .filter(
            (part: any) =>
              part &&
              (part.type === "text" || typeof part.text === "string")
          )
          .map((part: any) => part.text || "")
          .join("\n");
      }
    }

    message = message.trim();

    if (!message) {
      console.error("Could not extract message from request:", body);

      return Response.json(
        { error: "Please enter a message." },
        { status: 400 }
      );
    }

    console.log("Sending message to Gemini:", message);

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
                text: `
You are the SK Designer portfolio website assistant.

Your job is to help website visitors with:
- SK Designer services
- Graphic design
- Logo design
- Branding
- Posters
- Flyers
- Social media designs
- Portfolio projects
- Starting a project
- Contacting SK

Be friendly, professional, concise and helpful.

If someone wants to contact SK, explain that they should use the contact section/form on the website.
Do not invent phone numbers, email addresses, prices, projects or services that are not provided.
                `.trim(),
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
            temperature: 0.7,
            maxOutputTokens: 500,
          },
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("Gemini API error:", data);

      return Response.json(
        {
          error:
            data?.error?.message ||
            "Gemini API request failed.",
        },
        { status: response.status }
      );
    }

    const reply = data?.candidates?.[0]?.content?.parts
      ?.map((part: any) => part?.text || "")
      .join("")
      .trim();

    if (!reply) {
      console.error("Gemini returned no text:", data);

      return Response.json(
        { error: "Gemini returned an empty response." },
        { status: 500 }
      );
    }

    return Response.json({
      reply,
      message: reply,
    });
  } catch (error) {
    console.error("CHAT API ERROR:", error);

    return Response.json(
      {
        error: "Unable to contact the AI service.",
      },
      { status: 500 }
    );
  }
}
