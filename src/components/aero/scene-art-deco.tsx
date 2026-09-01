import { CapSunburst } from "@/components/aero/cap-sunburst";

export function ArtDecoScene() {
  return (
    <div className="cap-scene pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden>
      <div className="cap-vault-base absolute inset-0" />
      <div className="cap-stone-tile absolute inset-0" />
      <div className="cap-grain-overlay absolute inset-0" />
      <div className="cap-column cap-column-left absolute inset-y-0 left-0" />
      <div className="cap-column cap-column-right absolute inset-y-0 right-0" />
      <CapSunburst />
      <div className="cap-vignette absolute inset-0" />
    </div>
  );
}
