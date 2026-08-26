export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed",
    });
  }

  try {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      console.error("GEMINI_API_KEY is missing");

      return res.status(500).json({
        error: "Gemini API key is not configured.",
      });
    }

    // Read request body safely
    let body = req.body;

    if (typeof body === "string") {
      try {
        body = JSON.parse(body);
      } catch {
        body = {};
      }
    }

    body = body || {};

    console.log("CHAT BODY:", JSON.stringify(body));

    // Get the user's message from several common formats
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

    // Handle messages array
    if (!message && Array.isArray(body.messages)) {
      const last = body.messages[body.messages.length - 1];

      if (typeof last === "string") {
        message = last;
      }

      if (last && typeof last.content === "string") {
        message = last.content;
      }

      if (last && typeof last.text === "string") {
        message = last.text;
      }

      if (
        last &&
        Array.isArray(last.parts)
      ) {
        message = last.parts
          .map((part) => {
            if (typeof part === "string") return part;
            return part?.text || "";
          })
          .join(" ");
      }
    }

    // Handle content directly
    if (!message && typeof body.content === "string") {
      message = body.content;
    }

    message = String(message || "").trim();

    console.log("CHAT MESSAGE:", message);

    if (!message) {
      return res.status(400).json({
        error: "No message was received.",
      });
    }

    // Call Gemini
    const geminiResponse = await fetch(
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
                  "Help website visitors learn about SK Designer's services, " +
                  "portfolio, graphic design work, projects, and how to contact SK. " +
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

    const data = await geminiResponse.json();

    console.log(
      "GEMINI STATUS:",
      geminiResponse.status
    );

    if (!geminiResponse.ok) {
      console.error(
        "GEMINI ERROR:",
        JSON.stringify(data)
      );

      return res.status(500).json({
        error:
          data?.error?.message ||
          "Gemini API request failed.",
      });
    }

    const reply =
      data?.candidates?.[0]?.content?.parts
        ?.map((part) => part?.text || "")
        .join("")
        .trim();

    if (!reply) {
      console.error(
        "EMPTY GEMINI RESPONSE:",
        JSON.stringify(data)
      );

      return res.status(500).json({
        error: "Gemini returned an empty response.",
      });
    }

    // Return several compatible fields
    // so your existing frontend can use whichever it expects.
    return res.status(200).json({
      reply,
      message: reply,
      response: reply,
      text: reply,
    });

  } catch (error) {
    console.error(
      "CHAT SERVER ERROR:",
      error
    );

    return res.status(500).json({
      error:
        error?.message ||
        "Unable to contact the AI service.",
    });
  }
}
