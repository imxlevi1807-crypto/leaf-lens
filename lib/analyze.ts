import type { PlantAnalysis, PlantContext } from "./types";

export async function analyzePlant(file: File, context: PlantContext): Promise<PlantAnalysis> {
  const formData = new FormData();
  formData.append("image", file);
  formData.append("plant_name", context.name || "Plant");
  formData.append("city", context.city || "Delhi");
  formData.append("floor", context.floor || "Low-rise (1-4)");
  formData.append("balcony_direction", context.balconyDirection || "East");
  formData.append("auto_detect", String(context.autoDetectType));
  formData.append("plant_type", context.autoDetectType ? "" : context.plantType);

  // Abort if request exceeds 15 seconds
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 15000);

  try {
    const res = await fetch("/api/analyze", {
      method: "POST",
      body: formData,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.error || "Analysis failed. Please try again.");
    }

    return res.json();
  } catch (err: any) {
    clearTimeout(timeoutId);
    if (err.name === "AbortError") {
      throw new Error("Scan timed out after 15s. Please check your connection and tap scan again.");
    }
    throw err;
  }
}