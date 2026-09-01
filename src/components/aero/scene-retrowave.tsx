import { RetrowaveHorizonGrid } from "@/components/aero/retrowave-horizon-grid";

export function RetrowaveScene() {
  return (
    <div className="rw-scene pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden>
      <div className="rw-starfield absolute inset-0" />
      <div className="rw-sunset-wrap absolute inset-x-0 bottom-[38%] flex justify-center">
        <div className="rw-sunset">
          <div className="rw-sunset-scanlines absolute inset-0" />
        </div>
      </div>
      <div className="rw-horizon-glow absolute inset-x-0 bottom-[38%] h-px" />
      <div className="rw-horizon-grid-stage absolute inset-x-0 top-[62%] bottom-0">
        <RetrowaveHorizonGrid className="rw-horizon-grid block h-full w-full" />
      </div>
      <div className="rw-vignette absolute inset-0" />
    </div>
  );
}
