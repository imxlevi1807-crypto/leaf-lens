import { NextResponse } from "next/server";
import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY || "" });

export async function POST(req: Request) {
  try {
    const { question, plantContext, chatHistory } = await req.json();

    if (!question || !question.trim()) {
      return NextResponse.json({ error: "No question provided" }, { status: 400 });
    }

    const systemPrompt = `You are "LeafLens Chat," an expert yet accessible gardening mentor helping an apartment balcony gardener in India.
Current Plant: ${plantContext?.plant_name || "Balcony plant"}.
Current Diagnosis: ${plantContext?.diagnosis || "Foliage check"}.
Location Context: ${plantContext?.location_summary?.balcony || ""} balcony, ${plantContext?.location_summary?.floor || ""} floor, ${plantContext?.location_summary?.city || ""}.

GUIDELINES:
- Keep answers concise (2 to 4 sentences).
- Use the "Name it, then translate it" principle: explain any botanical term simply.
- Keep remedies practical using everyday items (neem, haldi, buttermilk, proper drainage).
- Maintain a warm, encouraging mentor tone.`;

    const messages: any[] = [{ role: "system", content: systemPrompt }];

    if (Array.isArray(chatHistory)) {
      for (const msg of chatHistory) {
        messages.push({
          role: msg.role === "user" ? "user" : "assistant",
          content: msg.text,
        });
      }
    }

    messages.push({ role: "user", content: question });

    const completion = await groq.chat.completions.create({
      model: "openai/gpt-oss-120b",
      messages,
      temperature: 0.4,
      max_tokens: 300,
    });

    const reply = completion.choices[0]?.message?.content || "Check soil drainage and mist lightly.";

    return NextResponse.json({ reply });
  } catch (error: any) {
    console.error("Groq Chat API error:", error);
    return NextResponse.json(
      { error: "Could not answer right now. Please try again." },
      { status: 500 }
    );
  }
}