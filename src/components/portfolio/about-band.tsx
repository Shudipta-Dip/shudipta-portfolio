import { BarChart3, Lightbulb, Megaphone } from "lucide-react";

import { profile } from "../../../content/profile";

const lenses = [
  { icon: Lightbulb, label: "Idea", tone: "aero-lens-sun" },
  { icon: Megaphone, label: "Story", tone: "aero-lens-aqua" },
  { icon: BarChart3, label: "Proof", tone: "aero-lens-lime" },
] as const;

export function AboutBand() {
  return (
    <section id="about" className="mx-auto max-w-6xl px-4 pb-4 sm:px-6">
      <div className="glass-panel grid gap-8 rounded-[2rem] px-6 py-8 sm:px-10 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <p className="text-xs font-semibold tracking-[0.22em] text-sky-deep uppercase">
            How I work
          </p>
          <h2 className="font-heading mt-2 text-3xl font-semibold tracking-tight">
            Craft, then receipts.
          </h2>
          <div className="mt-5 flex gap-3">
            {lenses.map(({ icon: Icon, label, tone }) => (
              <div key={label} className="text-center">
                <span className={`aero-icon-lens ${tone} mx-auto flex size-12 items-center justify-center`}>
                  <Icon className="size-5 text-white" strokeWidth={1.8} />
                </span>
                <span className="mt-1.5 block text-[0.65rem] font-bold tracking-wider text-muted-foreground uppercase">
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>
        <div className="space-y-4 text-base leading-relaxed text-muted-foreground">
          <p>{profile.summary}</p>
          <p>{profile.now}</p>
        </div>
      </div>
    </section>
  );
}
