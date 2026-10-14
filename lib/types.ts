export type Severity = "healthy" | "low" | "moderate" | "high";

export type BalconyDirection =
  | "North"
  | "South"
  | "East"
  | "West"
  | "North-East"
  | "North-West"
  | "South-East"
  | "South-West"
  | "Indoor (No Balcony)";

export interface PlantContext {
  id: string;
  name: string;
  city: string;
  floor: string;
  balconyDirection: BalconyDirection;
  plantType: string;
  autoDetectType: boolean;
}

export interface PlantAnalysis {
  plant_name: string;
  diagnosis: string;
  severity: Severity;
  remedy_steps: string[];
  todays_action: string;
  prevention_tip: string;
  environmental_insight?: string;
  location_summary?: {
    city: string;
    floor: string;
    balcony: string;
  };
}