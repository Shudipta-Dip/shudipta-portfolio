"use client";

import { Palette } from "lucide-react";
import { useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

import { useTheme } from "@/components/theme/theme-provider";
import { cn } from "@/lib/utils";
import { themeLabels, themes, type ThemeId } from "@/lib/theme";

type MenuPosition = {
  top: number;
  left: number;
  minWidth: number;
};

export function ThemeSwitcher({ className }: { className?: string }) {
  const { theme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [menuPosition, setMenuPosition] = useState<MenuPosition | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLUListElement>(null);
  const listboxId = useId();

  useEffect(() => {
    setMounted(true);
  }, []);

  const updateMenuPosition = () => {
    const root = rootRef.current;
    if (!root) return;

    const rect = root.getBoundingClientRect();
    setMenuPosition({
      top: rect.bottom + 6,
      left: rect.left,
      minWidth: Math.max(rect.width, 140),
    });
  };

  useLayoutEffect(() => {
    if (!open) return;
    updateMenuPosition();

    const onLayoutChange = () => updateMenuPosition();
    window.addEventListener("resize", onLayoutChange);
    window.addEventListener("scroll", onLayoutChange, true);
    return () => {
      window.removeEventListener("resize", onLayoutChange);
      window.removeEventListener("scroll", onLayoutChange, true);
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: MouseEvent) => {
      const target = event.target as Node;
      if (rootRef.current?.contains(target) || menuRef.current?.contains(target)) return;
      setOpen(false);
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const chooseTheme = (id: ThemeId) => {
    setTheme(id);
    setOpen(false);
  };

  const menu =
    open && menuPosition ? (
      <ul
        ref={menuRef}
        id={listboxId}
        role="listbox"
        aria-label="Website theme"
        style={{
          position: "fixed",
          top: menuPosition.top,
          left: menuPosition.left,
          minWidth: menuPosition.minWidth,
        }}
        className="theme-switcher-menu theme-switcher-menu-portal z-[200] origin-top-left p-1"
      >
        {themes.map((id) => {
          const selected = theme === id;
          return (
            <li key={id} role="presentation">
              <button
                type="button"
                role="option"
                aria-selected={selected}
                onClick={() => chooseTheme(id)}
                className={cn(
                  "theme-switcher-option flex w-full items-center rounded-md px-2.5 py-1.5 text-left text-[0.72rem] font-semibold transition-colors",
                  selected && "theme-switcher-option-active",
                )}
              >
                {themeLabels[id]}
              </button>
            </li>
          );
        })}
      </ul>
    ) : null;

  return (
    <>
      <div
        ref={rootRef}
        className={cn("theme-switcher-root relative", open && "theme-switcher-open", className)}
      >
        <button
          type="button"
          aria-label="Website theme"
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-controls={listboxId}
          onClick={() => setOpen((current) => !current)}
          className={cn(
            "theme-switcher chip-gel inline-flex h-8 shrink-0 cursor-pointer items-center rounded-full text-[0.72rem] font-semibold transition-[padding,gap] duration-200",
            open ? "gap-1.5 px-2.5" : "size-8 justify-center px-0",
          )}
        >
          <Palette className="size-3.5 shrink-0 opacity-80" strokeWidth={2} aria-hidden />
          <span className="theme-switcher-label font-semibold tracking-wide">theme</span>
        </button>
      </div>
      {mounted && menu ? createPortal(menu, document.body) : null}
    </>
  );
}
