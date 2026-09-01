import { notFound } from "next/navigation";

import { CapSunburst } from "@/components/aero/cap-sunburst";

import { Button } from "@/components/ui/button";

import { ArtDecoStyleGuideShell } from "./art-deco-style-guide-shell";

export const metadata = {
  title: "Art Deco — Style Guide",
  robots: { index: false, follow: false },
};

const swatches = [
  { name: "Gold", hex: "#d4af37" },
  { name: "Gold bright", hex: "#f1c970" },
  { name: "Gold dark", hex: "#8c7348" },
  { name: "Charcoal deep", hex: "#050507" },
  { name: "Charcoal panel", hex: "#0a0e14" },
  { name: "Ivory", hex: "#f2e6cf" },
] as const;

export default function ArtDecoStyleGuidePage() {
  if (process.env.NODE_ENV !== "development") {
    notFound();
  }

  return (
    <ArtDecoStyleGuideShell>
      <main className="relative z-10 mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <header className="mb-10 text-center">
        <p className="cap-specimen-label">{`{ CAPITOLINI DEV }`}</p>
        <h1 className="font-heading mt-2 text-3xl font-semibold tracking-[0.08em] sm:text-4xl">
          Art Deco Style Guide
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Localhost only — tokens, typography, and component specimens.
        </p>
      </header>

      <div className="space-y-8">
        <section className="cap-panel">
          <p className="cap-specimen-label">{`{ TYPOGRAPHY }`}</p>
          <div className="space-y-6">
            <div>
              <p className="board-hero-eyebrow text-xs">Poiret One · Eyebrow</p>
              <p
                className="mt-2 text-2xl font-black tracking-[0.06em] sm:text-3xl"
                style={{ fontFamily: "var(--font-ad-display), Cinzel Decorative, serif" }}
              >
                Cinzel Decorative Display
              </p>
            </div>
            <div>
              <h2 className="font-heading text-xl font-semibold tracking-[0.08em]">
                Cinzel Heading — Museum Inscription
              </h2>
              <p className="mt-2 max-w-prose text-base leading-relaxed text-muted-foreground">
                Poiret One body copy for editorial UI labels and supporting text across the vault
                interface.
              </p>
            </div>
            <p className="board-hero-name text-center">Pinyon Script Hero</p>
          </div>
        </section>

        <section className="cap-panel">
          <p className="cap-specimen-label">{`{ COLOR SWATCHES }`}</p>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {swatches.map((swatch) => (
              <div
                key={swatch.hex}
                className="overflow-hidden rounded-sm border border-[rgb(212_175_55/0.35)]"
              >
                <div className="h-14" style={{ backgroundColor: swatch.hex }} />
                <div className="bg-[rgb(10_14_20/0.92)] px-2 py-1.5 text-xs">
                  <span className="font-medium">{swatch.name}</span>
                  <span className="ml-2 text-muted-foreground">{swatch.hex}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="cap-panel">
          <p className="cap-specimen-label">{`{ BUTTONS }`}</p>
          <div className="flex flex-wrap items-center gap-3">
            <button type="button" className="cap-ghost-btn">
              {`{ GHOST CTA }`}
            </button>
            <Button className="gel-surface">Filled gold</Button>
          </div>
        </section>

        <section className="cap-panel">
          <p className="cap-specimen-label">{`{ CHIPS & PANELS }`}</p>
          <div className="flex flex-wrap gap-2">
            <span className="chip-gel inline-flex px-3 py-1.5 text-xs font-medium">
              Chip specimen
            </span>
            <span className="aero-meta-chip inline-flex px-3 py-1.5 text-xs">Meta chip</span>
          </div>
        </section>

        <section className="cap-panel overflow-hidden">
          <p className="cap-specimen-label">{`{ SCENE SAMPLES }`}</p>
          <div className="relative h-40 overflow-hidden border border-[rgb(212_175_55/0.35)]">
            <div className="cap-vault-base absolute inset-0" />
            <div className="cap-stone-tile absolute inset-0" />
            <div className="cap-column cap-column-left absolute inset-y-0 left-0" />
            <div className="cap-column cap-column-right absolute inset-y-0 right-0" />
            <CapSunburst />
          </div>
        </section>
      </div>
    </main>
    </ArtDecoStyleGuideShell>
  );
}
