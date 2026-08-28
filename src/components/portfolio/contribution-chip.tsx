import { Building2, CalendarDays, Layers3 } from "lucide-react";

import { cn } from "@/lib/utils";

const intakeChipTones = [
  "aero-chip-cyan",
  "aero-chip-lime",
  "aero-chip-aqua",
  "aero-chip-sun",
  "aero-chip-meadow",
  "aero-chip-sky",
  "aero-chip-deep",
] as const;

function toneForLabel(label: string) {
  let hash = 0;
  for (const char of label.toLowerCase()) {
    hash = (hash + char.charCodeAt(0)) % intakeChipTones.length;
  }
  return intakeChipTones[hash];
}

export function IntakeChipRow({ labels }: { labels: string[] }) {
  if (!labels.length) return null;

  return (
    <div className="flex flex-wrap gap-1.5">
      {labels.map((label, index) => (
        <span
          key={`${label}-${index}`}
          className={cn("aero-intake-chip", toneForLabel(label))}
        >
          {label}
        </span>
      ))}
    </div>
  );
}

export function MetaChipRow({
  contentType,
  organization,
  year,
}: {
  contentType?: string;
  organization?: string;
  year?: string;
}) {
  const items = [
    contentType
      ? { kind: "type" as const, label: contentType, icon: Layers3, className: "aero-meta-chip-type" }
      : null,
    organization
      ? { kind: "org" as const, label: organization.toUpperCase(), icon: Building2, className: "aero-meta-chip-org" }
      : null,
    year
      ? { kind: "year" as const, label: year, icon: CalendarDays, className: "aero-meta-chip-year" }
      : null,
  ].filter((item): item is NonNullable<typeof item> => item !== null);

  if (!items.length) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <span key={item.kind} className={cn("aero-meta-chip", item.className)}>
            <span className="aero-meta-chip-icon">
              <Icon strokeWidth={2.2} />
            </span>
            {item.label}
          </span>
        );
      })}
    </div>
  );
}
