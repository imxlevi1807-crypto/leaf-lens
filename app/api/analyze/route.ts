import { NextResponse } from "next/server";
import Groq from "groq-sdk";
import type { PlantAnalysis, Severity } from "@/lib/types";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY || "" });
const VISION_MODEL = "qwen/qwen3.8-27b";

async function getWeatherData(city: string) {
  const fallback = {
    temperature: "32°C",
    humidity: "60%",
    windSpeed: "12 km/h",
    rainPrediction: "No rain predicted",
  };

  const apiKey = process.env.WEATHER_API_KEY;
  if (!apiKey || !city || city === "Unknown City") return fallback;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);

    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
        city
      )}&appid=${apiKey}&units=metric`,
      { signal: controller.signal }
    );
    clearTimeout(timeoutId);

    if (!res.ok) return fallback;

    const data = await res.json();
    const temp = Math.round(data.main?.temp ?? 28);
    const humidity = data.main?.humidity ?? 55;
    const windSpeedKmh = Math.round((data.wind?.speed ?? 0) * 3.6);
    const rain = data.rain ? `${data.rain["1h"] || "Light"} mm rain` : "No rain currently";
    const description = data.weather?.[0]?.description || "";

    return {
      temperature: `${temp}°C`,
      humidity: `${humidity}%`,
      windSpeed: `${windSpeedKmh} km/h`,
      rainPrediction: `${description} (${rain})`,
    };
  } catch {
    return fallback;
  }
}

function normalizeSeverity(rawSeverity: string): Severity {
  const s = (rawSeverity || "").toLowerCase();
  if (s.includes("severe") || s.includes("high")) return "high";
  if (s.includes("moderate") || s.includes("medium")) return "moderate";
  if (s.includes("mild") || s.includes("low")) return "low";
  if (s.includes("healthy")) return "healthy";
  return "moderate";
}

export async function POST(req: Request) {
  try {
    const form = await req.formData();
    const image = form.get("image");
    const city = String(form.get("city") || "Delhi").trim();
    const floor = String(form.get("floor") || "Low-rise (1-4)").trim();
    const balcony = String(form.get("balcony_direction") || "East").trim();
    const autoDetect = form.get("auto_detect") === "true";
    const userType = String(form.get("plant_type") || "").trim();

    if (!(image instanceof File)) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 });
    }

    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json(
        { error: "GROQ_API_KEY is missing in your .env.local file" },
        { status: 500 }
      );
    }

    const weather = await getWeatherData(city);

    const arrayBuffer = await image.arrayBuffer();
    const base64Image = Buffer.from(arrayBuffer).toString("base64");
    const mimeType = image.type || "image/jpeg";
    const dataUrl = `data:${mimeType};base64,${base64Image}`;

    const systemPrompt = `You are "LeafLens," a rigorous botanical diagnostic AI for urban Indian balcony gardens.

CRITICAL IDENTIFICATION PROTOCOL (REAL-WORLD PHOTOS):
1. PLANT VERIFICATION FIRST:
   Check if the photo contains live plant foliage, stems, flowers, or fruit.
   If this is an inanimate object (ID card, paper, furniture, person, electronics, pet), return strictly:
   {
     "is_plant": false,
     "error_message": "This does not appear to be a plant. Please upload a clear photo of a plant leaf."
   }

// Update this section in app/api/analyze/route.ts:

2. BROAD BOTANICAL IDENTIFICATION:
   Do NOT assume every plant is an ornamental indoor potted houseplant. 
   Analyze the foliage structure (e.g. basal rosette, serrated/toothed oblanceolate leaves, compound leaflets) to identify:
   - Wild urban flora, wall-crack plants & common weeds (e.g. Erigeron/Conyza fleabane, Parthenium, Sonchus sowthistle, Blumea, Peperomia pellucida, Tridax procumbens).
   - Balcony vegetables, herbs & ornamentals (Tomato, Tulsi, Chili, Money Plant, Ferns).
   - If the plant is an opportunistic wild weed or spontaneous seedling, explicitly identify it as such (e.g. "Hairy Fleabane (Erigeron bonariensis) - wild seedling") rather than guessing an ornamental houseplant.
   
   * IF THE USER PROVIDED A PLANT TYPE ("${userType}"):
     Trust the user's identification unless the photo is unquestionably a different species. Confirm their identification as the primary name.
   
   * IF AUTO-DETECTING:
     Identify the common cultivated Indian house/balcony plant genus and species (e.g. Tulsi / Holy Basil, Money Plant / Epipremnum aureum, Ficus elastica, Snake Plant / Sansevieria trifasciata, Monstera deliciosa, Syngonium, Peace Lily, Jade Plant, Curry Leaf / Murraya koenigii, Tomato, Hibiscus, Rose).
     Output the most established common name followed by its botanical binomial in parentheses.

3. "NAME IT, THEN TRANSLATE IT" DIAGNOSIS:
   - Provide the specific pathological or physiological diagnosis (e.g. "Sun Scorch / Photo-oxidation", "Overwatering-induced Root Hypoxia", "Cercospora Leaf Spot", "Spider Mite Infestation").
   - Follow immediately with a plain, simple explanation of what is physically happening.
   - Explain why this occurs on a ${floor} balcony facing ${balcony} in ${city} (Current weather: ${weather.temperature}, ${weather.humidity} humidity, ${weather.windSpeed} wind).

4. PRACTICAL ORGANIC REMEDIES:
   - Kitchen / local nursery items only (neem oil spray with exact ratios, haldi/turmeric paste for cuts/fungus, buttermilk spray, watering adjustments).

OUTPUT STRICTLY IN JSON FORMAT:
{
  "is_plant": true,
  "plant_name": "Common Name (Botanical Latin Name)",
  "diagnosis": "Technical name followed immediately by everyday explanation.",
  "severity": "Mild | Moderate | Severe | Healthy",
  "why_this_happened": "Clear explanation connecting floor wind or balcony sun.",
  "remedy_steps": [
    "Step 1: Specific actionable step",
    "Step 2: Adjustment"
  ],
  "todays_action": "One specific task to do today based on current weather.",
  "prevention_tip": "Long term prevention habit.",
  "personalized_insight": "Balcony microclimate tip."
}`;

    const userPrompt = `Inspect this real-world photo. Is it a plant? If not, return is_plant: false. If yes, identify the species reliably and diagnose it.
User specified plant type: ${autoDetect || !userType ? "Auto-detect" : userType}.
Balcony context: ${balcony} direction, ${floor} level, ${city}. Current weather: ${weather.temperature}, ${weather.humidity} humidity, ${weather.windSpeed} wind.`;

    const completion = await groq.chat.completions.create({
      model: VISION_MODEL,
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        {
          role: "user",
          content: [
            { type: "text", text: userPrompt },
            {
              type: "image_url",
              image_url: { url: dataUrl },
            },
          ],
        },
      ],
      response_format: { type: "json_object" },
      temperature: 0.0, // 0.0 locks deterministic identification across varied angles
    });

    const rawResponseText = completion.choices[0]?.message?.content || "";

    let parsedAI: any;
    try {
      parsedAI = JSON.parse(rawResponseText);
    } catch {
      const cleaned = rawResponseText.replace(/```json|```/g, "").trim();
      parsedAI = JSON.parse(cleaned);
    }

    const isNotPlant =
      parsedAI.is_plant === false ||
      parsedAI.not_a_plant === true ||
      Boolean(parsedAI.error_message) ||
      /not a plant|document|card|identity|identification|aadhaar|license|receipt|person|vehicle|paper/i.test(
        String(parsedAI.plant_name || "")
      );

    if (isNotPlant) {
      return NextResponse.json(
        {
          error:
            parsedAI.error_message ||
            "This does not appear to be a plant. Please upload a clear photo of a plant leaf.",
        },
        { status: 400 }
      );
    }

    const finalResponse: PlantAnalysis = {
      plant_name: parsedAI.plant_name || (autoDetect ? "Identified Plant" : userType || "Balcony Plant"),
      diagnosis: parsedAI.diagnosis || "Foliage inspection complete.",
      severity: normalizeSeverity(parsedAI.severity),
      remedy_steps:
        Array.isArray(parsedAI.remedy_steps) && parsedAI.remedy_steps.length > 0
          ? parsedAI.remedy_steps
          : ["Check soil drainage holes.", "Maintain consistent watering."],
      todays_action: parsedAI.todays_action || "Check topsoil moisture before watering today.",
      prevention_tip: parsedAI.prevention_tip || "Position away from extreme direct sun rays.",
      environmental_insight: parsedAI.why_this_happened || parsedAI.personalized_insight || "",
      location_summary: {
        city: city || "Delhi",
        floor: floor || "Low-rise (1-4)",
        balcony: balcony || "East",
      },
    };

    return NextResponse.json(finalResponse);
  } catch (error: any) {
    console.error("Groq vision analysis error:", error);
    return NextResponse.json(
      { error: error?.message || "Analysis failed. Please try again." },
      { status: 500 }
    );
  }
}