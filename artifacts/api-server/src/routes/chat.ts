import { Router, type IRouter } from "express";
import OpenAI from "openai";

const router: IRouter = Router();

const openai = new OpenAI({
  baseURL: process.env["AI_INTEGRATIONS_OPENAI_BASE_URL"],
  apiKey: process.env["AI_INTEGRATIONS_OPENAI_API_KEY"],
});

const SYSTEM_PROMPT = `You are a helpful wedding planning assistant for "Book My Squad" (BMS), India's premium event planning marketplace. Keep replies to 2-3 sentences.

Key facts: 436+ venues, 255+ vendors (photographers, makeup, catering, decorator, DJ, entertainment, planners), 24+ cities (Mumbai, Delhi, Jaipur, Udaipur, Goa, Bangalore, Hyderabad). Contact: +91 8796318282. Free basic listing for vendors.

Be warm, culturally aware of Indian weddings, and direct users to /venues or /vendors pages to explore. If asked non-wedding topics, redirect politely.`;

router.post("/chat", async (req, res) => {
  const { messages } = req.body as {
    messages?: { role: string; content: string }[];
  };

  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    res.status(400).json({ error: "Messages array is required" });
    return;
  }

  const validRoles = ["user", "assistant"];
  const sanitized = messages
    .filter(m => validRoles.includes(m.role) && typeof m.content === "string" && m.content.trim())
    .slice(-20)
    .map(m => ({ role: m.role as "user" | "assistant", content: m.content }));

  if (sanitized.length === 0) {
    res.status(400).json({ error: "No valid messages provided" });
    return;
  }

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-5.2",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        ...sanitized,
      ],
    });

    const reply = completion.choices[0]?.message?.content || "I'm here to help with your wedding planning! Please try again.";
    req.log.info({ userId: (req.session as unknown as Record<string, unknown>)["userId"] }, "Chat message processed");
    res.json({ reply });
  } catch (err) {
    req.log.error({ err }, "Chat completion error");
    res.status(500).json({ error: "Chat service temporarily unavailable. Please call +91 8796318282." });
  }
});

export default router;
