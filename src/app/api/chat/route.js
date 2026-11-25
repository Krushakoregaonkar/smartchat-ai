
import Groq from "groq-sdk";
import { NextResponse } from "next/server";

const SYSTEM_PROMPT = `
You are SmartChat AI, a friendly and intelligent
general-purpose AI assistant.

Your responsibilities:
1. Answer questions on different topics.
2. Explain programming concepts clearly.
3. Help students with educational questions.
4. Provide accurate and useful information.
5. Write emails, summaries and creative content.
6. Use headings, bullet points and examples.
7. Be polite, clear and professional.
8. Admit when you are unsure about something.

Adapt your explanations to the user's level.
`;

export async function POST(request) {
  try {
    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "Groq API key is missing. Check .env.local." },
        { status: 500 }
      );
    }

    const { messages } = await request.json();

    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: "Please provide a valid message." },
        { status: 400 }
      );
    }

    const validMessages = messages
      .filter(
        (msg) =>
          ["user", "assistant"].includes(msg.role) &&
          typeof msg.content === "string" &&
          msg.content.trim()
      )
      .slice(-20)
      .map((msg) => ({
        role: msg.role,
        content: msg.content.slice(0, 10000),
      }));

    if (
      validMessages.length === 0 ||
      validMessages[validMessages.length - 1].role !== "user"
    ) {
      return NextResponse.json(
        { error: "A valid user message is required." },
        { status: 400 }
      );
    }

    const groq = new Groq({ apiKey });

    const completion = await groq.chat.completions.create({
      model: "openai/gpt-oss-20b",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        ...validMessages,
      ],
      temperature: 0.7,
      max_completion_tokens: 2048,
    });

    const reply = completion.choices[0]?.message?.content;

    if (!reply) {
      throw new Error("Empty AI response.");
    }

    return NextResponse.json({ reply });

  } catch (error) {
    console.error("Chat API Error:", error);

    return NextResponse.json(
      {
        error:
          error.status === 429
            ? "Too many requests. Please try again later."
            : "Something went wrong. Please try again.",
      },
      { status: error.status === 429 ? 429 : 500 }
    );
  }
}
