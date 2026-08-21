import {
  Coffee,
  Croissant,
  CupSoda,
  Droplet,
  Milk,
  Package,
  type LucideIcon,
} from "lucide-react";

export const categoryIconRegistry: Record<string, LucideIcon> = {
  Coffee,
  Croissant,
  CupSoda,
  Droplet,
  Milk,
  Package,
};

export const categoryIconOptions = Object.keys(categoryIconRegistry);

export function resolveCategoryIcon(name: string): LucideIcon {
  return categoryIconRegistry[name] ?? Package;
}
