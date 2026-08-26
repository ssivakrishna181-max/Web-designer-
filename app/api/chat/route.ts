const MODEL = "gemini-3.7-flash";

export async function POST(req: Request) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      console.error("GEMINI_API_KEY is missing");

      return Response.json(
        {
          error: "AI is not configured on the server.",
        },
        { status: 500 }
      );
    }

    const body = await req.json();

    let message = "";

    if (typeof body?.message === "string") {
      message = body.message;
    } else if (typeof body?.prompt === "string") {
      message = body.prompt;
    } else if (typeof body?.text === "string") {
      message = body.text;
    } else if (Array.isArray(body?.messages)) {
      const last = body.messages[body.messages.length - 1];

      if (typeof last === "string") {
        message = last;
      } else if (typeof last?.content === "string") {
        message = last.content;
      } else if (typeof last?.text === "string") {
        message = last.text;
      }
    }

    message = message.trim();

    if (!message) {
      return Response.json(
        {
          error: "Please enter a message.",
        },
        { status: 400 }
      );
    }

    const geminiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`,
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
- SK Designer's services
- Graphic design
- Branding
- Logo design
- Posters
- Flyers
- Social media designs
- Portfolio projects
- Starting a project
- Contacting SK

Be professional, friendly and concise.

If a visitor asks how to contact SK and the website does not provide a confirmed contact method, say that they can use the website's contact section rather than inventing contact information.
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

    const data = await geminiResponse.json();

    console.log("Gemini status:", geminiResponse.status);

    if (!geminiResponse.ok) {
      console.error(
        "Gemini API error:",
        JSON.stringify(data)
      );

      return Response.json(
        {
          error:
            data?.error?.message ||
            "Gemini API request failed.",
        },
        { status: 500 }
      );
    }

    const reply = data?.candidates?.[0]?.content?.parts
      ?.map((part: { text?: string }) => part.text || "")
      .join("")
      .trim();

    if (!reply) {
      console.error(
        "Gemini returned no text:",
        JSON.stringify(data)
      );

      return Response.json(
        {
          error: "The AI returned an empty response.",
        },
        { status: 500 }
      );
    }

    return Response.json({
      reply,
    });

  } catch (error) {
    console.error("CHAT ROUTE ERROR:", error);

    return Response.json(
      {
        error: "Unable to contact the AI service.",
      },
      { status: 500 }
    );
  }
}
