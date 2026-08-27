export function AeroScene() {
  return (
    <div className="sky-meadow pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="caustics absolute inset-0 opacity-70" />
      <div className="hills absolute inset-x-0 bottom-0 h-[28vh] opacity-90" />
      <div className="pointer-events-none absolute top-[-6rem] right-[8%] size-[22rem] rounded-full bg-[radial-gradient(circle_at_45%_45%,#fffce8_0%,#ffe27a_28%,#ffd36a_40%,transparent_62%)] opacity-80 blur-[2px]" />
      <div className="animate-drift absolute top-[12%] left-[10%] h-14 w-40 rounded-full bg-white/40 blur-md" />
      <div className="animate-drift absolute top-[9%] right-[30%] h-12 w-36 rounded-full bg-white/35 blur-md [animation-delay:2.2s]" />
      <div className="aero-leaf absolute -top-7 -left-8 h-32 w-52 -rotate-12" />
      <div className="water-ripples absolute inset-x-0 bottom-0 h-[20vh] opacity-55" />
    </div>
  );
}
