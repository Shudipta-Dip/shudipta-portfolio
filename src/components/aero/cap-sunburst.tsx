"use client";

import { useEffect, useMemo, useState, type CSSProperties } from "react";

type SunburstRay = {
  id: number;
  angle: number;
  delay: string;
  duration: string;
  minOpacity: string;
  peakOpacity: string;
};

function buildRays(count: number, lite: boolean): SunburstRay[] {
  const fanStart = -78;
  const fanSpan = 156;

  return Array.from({ length: count }, (_, i) => {
    const angle = fanStart + (fanSpan / (count - 1)) * i + (lite ? 0 : (Math.random() - 0.5) * 1.4);
    const delay = lite ? "0s" : `${(Math.random() * 10).toFixed(2)}s`;
    const duration = lite ? "0s" : `${(3.6 + Math.random() * 5.8).toFixed(2)}s`;
    const minOpacity = lite ? "0.68" : (0.22 + Math.random() * 0.28).toFixed(2);
    const peakOpacity = lite ? "0.68" : (0.55 + Math.random() * 0.38).toFixed(2);

    return {
      id: i,
      angle,
      delay,
      duration,
      minOpacity,
      peakOpacity,
    };
  });
}

export function CapSunburst() {
  const [liteScene, setLiteScene] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(pointer: coarse), (max-width: 639px)");
    const update = () => setLiteScene(query.matches);

    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  const rays = useMemo(
    () => buildRays(liteScene ? 12 : 24, liteScene),
    [liteScene],
  );

  return (
    <div className="cap-sunburst absolute inset-0">
      {rays.map((ray) => (
        <span
          key={ray.id}
          className={liteScene ? "cap-sunburst-ray cap-sunburst-ray-static absolute inset-0" : "cap-sunburst-ray absolute inset-0"}
          style={
            {
              "--ray-angle": `${ray.angle}deg`,
              "--ray-delay": ray.delay,
              "--ray-duration": ray.duration,
              "--ray-min": ray.minOpacity,
              "--ray-peak": ray.peakOpacity,
            } as CSSProperties
          }
        />
      ))}
    </div>
  );
}
