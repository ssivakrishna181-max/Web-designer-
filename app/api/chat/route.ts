export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed",
    });
  }

  try {
    // Get Gemini API key from Vercel Environment Variables
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      console.error("GEMINI_API_KEY is missing");
      return res.status(500).json({
        error: "Gemini API key is not configured",
      });
    }

    // Read the request body
    const body = req.body || {};

    // Accept common message formats
    let message = "";

    if (typeof body.message === "string") {
      message = body.message;
    } else if (typeof body.prompt === "string") {
      message = body.prompt;
    } else if (Array.isArray(body.messages)) {
      const lastMessage = body.messages[body.messages.length - 1];

      if (typeof lastMessage === "string") {
        message = lastMessage;
      } else if (lastMessage && typeof lastMessage.content === "string") {
        message = lastMessage.content;
      }
    }

    message = message.trim();

    if (!message) {
      return res.status(400).json({
        error: "Please enter a message.",
      });
    }

    // Call Gemini
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
                  "You are the SK portfolio website AI assistant. " +
                  "Help visitors with SK Designer's services, portfolio, " +
                  "projects, design work, and contacting SK. " +
                  "Be friendly, professional, concise, and helpful.",
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

    // Gemini returned an error
    if (!response.ok) {
      console.error("Gemini API error:", data);

      return res.status(response.status).json({
        error:
          data?.error?.message ||
          "Gemini API request failed.",
      });
    }

    // Extract Gemini response
    const reply =
      data?.candidates?.[0]?.content?.parts
        ?.map((part) => part.text || "")
        .join("")
        .trim();

    if (!reply) {
      console.error("No Gemini response:", data);

      return res.status(500).json({
        error: "Gemini returned an empty response.",
      });
    }

    // Send response back to website
    return res.status(200).json({
      reply: reply,
      message: reply,
    });
  } catch (error) {
    console.error("Chat API error:", error);

    return res.status(500).json({
      error: "Unable to contact the AI service.",
    });
  }
}
