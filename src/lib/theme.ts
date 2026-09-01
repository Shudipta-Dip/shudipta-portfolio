export const themes = ["frutiger", "retrowave", "art-deco"] as const;

export type ThemeId = (typeof themes)[number];

export const THEME_STORAGE_KEY = "portfolio-theme";

export const DEFAULT_THEME: ThemeId = "frutiger";

export const themeLabels: Record<ThemeId, string> = {
  frutiger: "Frutiger Aero",
  retrowave: "Retrowave",
  "art-deco": "Art Deco",
};

export function isThemeId(value: string): value is ThemeId {
  return (themes as readonly string[]).includes(value);
}

export function applyThemeToDocument(theme: ThemeId) {
  const root = document.documentElement;
  if (theme === DEFAULT_THEME) {
    root.removeAttribute("data-theme");
  } else {
    root.setAttribute("data-theme", theme);
  }
}

export function readStoredTheme(): ThemeId {
  if (typeof window === "undefined") return DEFAULT_THEME;
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    if (stored && isThemeId(stored)) return stored;
  } catch {
    /* ignore */
  }
  return DEFAULT_THEME;
}
