import { Router, type IRouter } from "express";
import OpenAI from "openai";
import { loadVendors } from "../lib/excel-loader.js";

const router: IRouter = Router();

const openai = new OpenAI({
  baseURL: process.env["AI_INTEGRATIONS_OPENAI_BASE_URL"],
  apiKey: process.env["AI_INTEGRATIONS_OPENAI_API_KEY"],
});

function buildSystemPrompt(): string {
  const allVendors = loadVendors();

  const cityCounts: Record<string, number> = {};
  const categoryCounts: Record<string, number> = {};
  const cityCategories: Record<string, Set<string>> = {};

  for (const v of allVendors) {
    const city = v.city?.trim() || "Other";
    const cat = v.category?.trim().toUpperCase() || "OTHER";
    cityCounts[city] = (cityCounts[city] ?? 0) + 1;
    categoryCounts[cat] = (categoryCounts[cat] ?? 0) + 1;
    if (!cityCategories[city]) cityCategories[city] = new Set();
    cityCategories[city].add(cat);
  }

  const topCities = Object.entries(cityCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 15)
    .map(([city, count]) => {
      const cats = [...(cityCategories[city] ?? [])].slice(0, 5).join(", ");
      return `  - ${city}: ${count} vendors (${cats})`;
    })
    .join("\n");

  const topCategories = Object.entries(categoryCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 12)
    .map(([cat, count]) => `  - ${cat}: ${count} vendors`)
    .join("\n");

  return `You are the AI Wedding Assistant for "Book My Squad" (BMS) — India's premium wedding & event planning marketplace. You are warm, culturally fluent in Indian wedding traditions, knowledgeable, and always helpful.

## Platform Data (live counts)
Total vendors: ${allVendors.length}

Top cities:
${topCities}

Vendor categories:
${topCategories}

## Wedding Planning Expertise

For guest counts, suggest vendor packages:
- Under 100 guests (intimate): 1 photographer, 1 makeup artist, 1 caterer, 1 decorator, optional DJ
- 100–300 guests (mid-size): 2 photographers, 1–2 makeup artists, full catering team, decorator, DJ + sound & light, anchor, planner recommended
- 300–500 guests (grand): Full planner essential, 2–3 photographers + videographer, large catering team, elaborate decor, entertainment team, transport coordinator
- 500+ guests (mega wedding): Senior wedding planner mandatory, multi-team photography, dedicated sound & light production, full hospitality management

Indian wedding budget tiers (approximate all-in):
- Budget: ₹5–15 lakhs — focus on 1 venue, essential vendors only
- Mid-range: ₹15–50 lakhs — premium vendors, good coverage
- Premium: ₹50L–2 crore — luxury vendors, full-service planning
- Ultra luxury: ₹2 crore+ — destination, palace venues, celebrity services

Cultural expertise:
- Hindu weddings: Mehendi → Haldi → Sangeet → Baraat → Vidaai ceremonies, 3–5 day affairs
- Muslim weddings: Nikah, Walima, separate men/women arrangements often needed
- Sikh weddings: Anand Karaj at Gurudwara, Kirtan instead of DJ
- South Indian weddings: Early morning ceremonies, classical music preferred, vegetarian catering
- Punjabi weddings: Multi-day, Bhangra mandatory, lavish catering, high energy
- Gujarati weddings: Garba night, Mameru ceremony, large community gatherings
- Bengali weddings: Dodhi mangal, Sindur daan, live orchestra preferred, fish dishes essential

## Key Platform Features
- Book vendors online with ₹2,000 refundable advance
- Quick enquiry form on every vendor profile
- Shortlist and compare vendors
- Verified vendor badges (KYC approved)
- Admin-managed bookings with status tracking
- City-specific landing pages: /vendors/mumbai, /vendors/delhi, /vendors/jaipur, etc.

## Response Rules
- Keep replies concise: 3–5 sentences max for simple questions, structured lists for complex ones
- Always refer users to the vendor directory (/vendors), venue pages (/venues), or city pages for specific searches
- If asked about a specific city, mention the vendor count if you know it
- Be culturally sensitive — use terms like "shaadi", "vivah", "baraat" naturally
- If asked non-wedding topics, redirect warmly: "I'm best at helping with your wedding journey! For that I'd suggest…"
- Never make up vendor names or guarantees — direct users to browse and enquire
- Use ₹ for prices, not dollars
- Contact for urgent help: +91 8796318282`;
}

let cachedSystemPrompt: string | null = null;
let promptBuiltAt = 0;

function getSystemPrompt(): string {
  const now = Date.now();
  if (!cachedSystemPrompt || now - promptBuiltAt > 5 * 60 * 1000) {
    cachedSystemPrompt = buildSystemPrompt();
    promptBuiltAt = now;
  }
  return cachedSystemPrompt;
}

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
    .map(m => ({ role: m.role as "user" | "assistant", content: m.content.slice(0, 2000) }));

  if (sanitized.length === 0) {
    res.status(400).json({ error: "No valid messages provided" });
    return;
  }

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-5.1",
      max_completion_tokens: 512,
      messages: [
        { role: "system", content: getSystemPrompt() },
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
