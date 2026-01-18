import { Criticality } from "@/types";

// Dark Modern Vibrant Priority Colors
export function getCriticalityColor(criticality: Criticality): string {
  switch (criticality) {
    case "Pc":
      return "bg-[#FF3B5C]"; // Electric red
    case "P1":
      return "bg-[#FF5252]"; // Bright red
    case "P2":
      return "bg-[#FF6B4A]"; // Coral orange
    case "P3":
      return "bg-[#FFB84D]"; // Golden yellow
    case "P3c":
      return "bg-[#FCD34D]"; // Light yellow
    case "P4":
      return "bg-[#10B981]"; // Emerald green
    default:
      return "bg-slate-600";
  }
}

export function getCriticalityHex(criticality: Criticality): string {
  switch (criticality) {
    case "Pc":
      return "#FF3B5C";
    case "P1":
      return "#FF5252";
    case "P2":
      return "#FF6B4A";
    case "P3":
      return "#FFB84D";
    case "P3c":
      return "#FCD34D";
    case "P4":
      return "#10B981";
    default:
      return "#64748B";
  }
}

export function getCriticalityTextColor(criticality: Criticality): string {
  switch (criticality) {
    case "P3":
    case "P3c":
      return "text-gray-900"; // Dark text for yellow backgrounds
    default:
      return "text-white";
  }
}

// Glow effect for priority badges
export function getCriticalityGlow(criticality: Criticality): string {
  switch (criticality) {
    case "Pc":
      return "shadow-[0_0_10px_rgba(255,59,92,0.5)]";
    case "P1":
      return "shadow-[0_0_10px_rgba(255,82,82,0.5)]";
    case "P2":
      return "shadow-[0_0_10px_rgba(255,107,74,0.4)]";
    case "P3":
      return "shadow-[0_0_10px_rgba(255,184,77,0.4)]";
    case "P3c":
      return "shadow-[0_0_10px_rgba(252,211,77,0.4)]";
    case "P4":
      return "shadow-[0_0_10px_rgba(16,185,129,0.4)]";
    default:
      return "";
  }
}
