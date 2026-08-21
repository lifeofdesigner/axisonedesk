// Tailwind needs to see full literal class names to generate them — no
// dynamic `bg-${color}` interpolation, so every known color is spelled out.
export const categoryColorOptions = [
  { value: "chart-1", label: "Blue" },
  { value: "chart-2", label: "Orange" },
  { value: "chart-3", label: "Green" },
  { value: "chart-4", label: "Amber" },
  { value: "chart-5", label: "Pink" },
] as const;

const swatchClasses: Record<string, string> = {
  "chart-1": "bg-chart-1",
  "chart-2": "bg-chart-2",
  "chart-3": "bg-chart-3",
  "chart-4": "bg-chart-4",
  "chart-5": "bg-chart-5",
};

const textClasses: Record<string, string> = {
  "chart-1": "text-chart-1",
  "chart-2": "text-chart-2",
  "chart-3": "text-chart-3",
  "chart-4": "text-chart-4",
  "chart-5": "text-chart-5",
};

const softBgClasses: Record<string, string> = {
  "chart-1": "bg-chart-1/10",
  "chart-2": "bg-chart-2/10",
  "chart-3": "bg-chart-3/10",
  "chart-4": "bg-chart-4/10",
  "chart-5": "bg-chart-5/10",
};

export function categorySwatchClass(color: string) {
  return swatchClasses[color] ?? swatchClasses["chart-1"];
}

export function categoryTextClass(color: string) {
  return textClasses[color] ?? textClasses["chart-1"];
}

export function categorySoftBgClass(color: string) {
  return softBgClasses[color] ?? softBgClasses["chart-1"];
}
