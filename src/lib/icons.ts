import type { LucideIcon } from "lucide-react";
import {
  AppWindow,
  Brain,
  ChartColumn,
  Clapperboard,
  CodeXml,
  Compass,
  LayoutDashboard,
  Megaphone,
  Newspaper,
  Palette,
  PenTool,
  Rocket,
  Scissors,
  Search,
  SearchCheck,
  Type,
} from "lucide-react";

import type { Category, ContributionIconName } from "../../content/projects";

export const contributionIcons: Record<ContributionIconName, LucideIcon> = {
  "pen-tool": PenTool,
  palette: Palette,
  type: Type,
  compass: Compass,
  clapperboard: Clapperboard,
  scissors: Scissors,
  megaphone: Megaphone,
  newspaper: Newspaper,
  "app-window": AppWindow,
  "code-2": CodeXml,
  brain: Brain,
  "layout-dashboard": LayoutDashboard,
  search: Search,
  "search-check": SearchCheck,
  rocket: Rocket,
};

export const categoryIcons: Record<Category, LucideIcon> = {
  design: Palette,
  reels: Clapperboard,
  product: AppWindow,
  data: ChartColumn,
};
