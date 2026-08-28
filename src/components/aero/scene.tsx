export function AeroScene() {
  return (
    <div className="sky-meadow pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="caustics absolute inset-0 opacity-70" />
      <div className="hills absolute inset-x-0 bottom-0 h-[28vh] opacity-90" />
      <div className="aero-sun-flare pointer-events-none absolute top-[-5rem] right-[6%] size-[26rem]">
        <div className="aero-sun-core absolute inset-[18%] rounded-full" />
        <div className="aero-lens-streak absolute top-1/2 left-[-140%] h-[3px] w-[280%] -translate-y-1/2" />
        <div className="aero-lens-cross absolute inset-[22%]" />
        <div className="aero-lens-bokeh aero-lens-bokeh-a absolute top-[38%] left-[8%] size-10 rounded-full" />
        <div className="aero-lens-bokeh aero-lens-bokeh-b absolute top-[62%] right-[12%] size-7 rounded-full" />
        <div className="aero-lens-bokeh aero-lens-bokeh-c absolute top-[22%] right-[28%] size-5 rounded-full" />
      </div>
      <div className="animate-drift absolute top-[12%] left-[10%] h-14 w-40 rounded-full bg-white/40 blur-md" />
      <div className="animate-drift absolute top-[9%] right-[30%] h-12 w-36 rounded-full bg-white/35 blur-md [animation-delay:2.2s]" />
      <div className="aero-leaf absolute -top-7 -left-8 h-32 w-52 -rotate-12" />
      <div className="water-pool absolute inset-x-0 bottom-0 h-[34vh] opacity-90" />
      <div className="water-ripples absolute inset-x-0 bottom-0 h-[22vh] opacity-60" />
    </div>
  );
}
