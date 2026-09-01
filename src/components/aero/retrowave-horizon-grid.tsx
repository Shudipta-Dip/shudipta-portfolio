"use client";

import { useEffect, useRef } from "react";

type RetrowaveHorizonGridProps = {
  className?: string;
};

function hexToRgb(hex: string) {
  const match = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return match
    ? {
        r: Number.parseInt(match[1], 16),
        g: Number.parseInt(match[2], 16),
        b: Number.parseInt(match[3], 16),
      }
    : { r: 0, g: 240, b: 255 };
}

export function RetrowaveHorizonGrid({ className }: RetrowaveHorizonGridProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef(0);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    // A static CSS grid is used on touch-first devices. A permanent canvas
    // animation competes with scrolling and video decoding on mobile GPUs.
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    let reducedMotion = motionQuery.matches;

    let width = 0;
    let height = 0;
    let dpr = 1;
    let offset = 0;
    let lastFrameTime = 0;
    let pendingWidth = 0;
    let pendingHeight = 0;
    let sizeDirty = true;

    const cyan = hexToRgb("#00f0ff");
    const magenta = hexToRgb("#ff2d95");

    const applyPendingSize = () => {
      if (!sizeDirty) return;
      if (pendingWidth < 1 || pendingHeight < 1) return;

      const nextWidth = Math.floor(pendingWidth);
      const nextHeight = Math.floor(pendingHeight);
      const nextDpr = Math.min(window.devicePixelRatio || 1, 2);
      const nextCanvasWidth = Math.floor(nextWidth * nextDpr);
      const nextCanvasHeight = Math.floor(nextHeight * nextDpr);

      if (
        nextWidth === width &&
        nextHeight === height &&
        nextDpr === dpr &&
        canvas.width === nextCanvasWidth &&
        canvas.height === nextCanvasHeight
      ) {
        sizeDirty = false;
        return;
      }

      width = nextWidth;
      height = nextHeight;
      dpr = nextDpr;
      canvas.width = nextCanvasWidth;
      canvas.height = nextCanvasHeight;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      sizeDirty = false;
    };

    const queueSize = (nextWidth: number, nextHeight: number) => {
      if (nextWidth < 1 || nextHeight < 1) return;
      pendingWidth = nextWidth;
      pendingHeight = nextHeight;
      sizeDirty = true;
    };

    const drawFrame = (deltaMs: number) => {
      applyPendingSize();
      if (!width || !height) return;

      const isMobile = width < 640;
      const cellWidth = Math.max(56, Math.min(108, width / (isMobile ? 7 : 10)));
      const cellDepth = Math.max(42, cellWidth * 0.66);
      const numCellsWide = Math.ceil(width / cellWidth) + 8;
      const numCellsDeep = isMobile ? 16 : 20;
      const speedPxPerSec = reducedMotion ? 0 : isMobile ? 34 : 28;
      const useShadow = !isMobile;

      const cameraX = 0;
      const cameraY = 56;
      const cameraZ = 340;
      const focalLength = Math.min(480, width * 0.88);
      const horizonY = height * 0.015;

      const project3DTo2D = (x: number, y: number, z: number) => {
        const relX = x - cameraX;
        const relY = y - cameraY;
        const relZ = z - cameraZ;
        if (relZ <= 8) return null;

        const scale = focalLength / relZ;
        return {
          x: width / 2 + relX * scale,
          y: horizonY - relY * scale,
          z: relZ,
        };
      };

      const drawCell = (x: number, z: number, zOffset: number, colIndex: number) => {
        const actualZ = z - zOffset;
        if (actualZ < -cellDepth || actualZ > numCellsDeep * cellDepth) return;

        const topLeft = project3DTo2D(x - cellWidth / 2, 0, actualZ);
        const topRight = project3DTo2D(x + cellWidth / 2, 0, actualZ);
        const bottomLeft = project3DTo2D(x - cellWidth / 2, 0, actualZ + cellDepth);
        const bottomRight = project3DTo2D(x + cellWidth / 2, 0, actualZ + cellDepth);

        if (!topLeft || !topRight || !bottomLeft || !bottomRight) return;
        if (actualZ < 0) return;

        const maxZ = numCellsDeep * cellDepth;
        const distanceFactor = Math.min(1, actualZ / maxZ);
        const alpha = Math.max(0.1, 0.42 - distanceFactor * 0.32);
        const lineWidth = Math.max(0.65, 1.6 * (1 - distanceFactor * 0.5));

        const rgb = colIndex % 2 === 0 ? cyan : magenta;
        const lineAlpha = colIndex % 2 === 0 ? alpha : alpha * 0.72;

        ctx.lineWidth = lineWidth;
        ctx.strokeStyle = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${lineAlpha})`;
        if (useShadow) {
          ctx.shadowBlur = Math.max(0, 5 * (1 - distanceFactor));
          ctx.shadowColor = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${lineAlpha * 0.45})`;
        } else {
          ctx.shadowBlur = 0;
        }

        ctx.beginPath();
        ctx.moveTo(bottomLeft.x, bottomLeft.y);
        ctx.lineTo(bottomRight.x, bottomRight.y);
        ctx.lineTo(topRight.x, topRight.y);
        ctx.lineTo(topLeft.x, topLeft.y);
        ctx.closePath();
        ctx.stroke();
        ctx.shadowBlur = 0;
      };

      ctx.clearRect(0, 0, width, height);

      const horizonMask = ctx.createLinearGradient(0, 0, 0, height * 0.2);
      horizonMask.addColorStop(0, "rgba(6, 8, 18, 0.94)");
      horizonMask.addColorStop(0.5, "rgba(6, 8, 18, 0.45)");
      horizonMask.addColorStop(1, "rgba(6, 8, 18, 0)");
      ctx.fillStyle = horizonMask;
      ctx.fillRect(0, 0, width, height * 0.2);

      offset += speedPxPerSec * (deltaMs / 1000);
      if (offset >= cellDepth) offset -= cellDepth;

      const halfWide = Math.floor(numCellsWide / 2);
      for (let row = -3; row < numCellsDeep + 4; row++) {
        const z = row * cellDepth;
        for (let col = -halfWide; col <= halfWide; col++) {
          drawCell(col * cellWidth, z, offset, col);
        }
      }

      const bottomFade = ctx.createLinearGradient(0, height * 0.5, 0, height);
      bottomFade.addColorStop(0, "rgba(0, 0, 0, 0)");
      bottomFade.addColorStop(1, "rgba(0, 0, 0, 0.55)");
      ctx.fillStyle = bottomFade;
      ctx.fillRect(0, height * 0.5, width, height * 0.5);
    };

    const loop = (now: number) => {
      if (!lastFrameTime) lastFrameTime = now;
      const deltaMs = Math.min(48, now - lastFrameTime);
      lastFrameTime = now;

      drawFrame(deltaMs);

      if (!reducedMotion && !document.hidden) {
        rafRef.current = requestAnimationFrame(loop);
      } else {
        rafRef.current = 0;
      }
    };

    const startLoop = () => {
      cancelAnimationFrame(rafRef.current);
      lastFrameTime = 0;
      if (reducedMotion) {
        drawFrame(0);
      } else if (!document.hidden) {
        rafRef.current = requestAnimationFrame(loop);
      }
    };

    const onMotionChange = (event: MediaQueryListEvent) => {
      reducedMotion = event.matches;
      startLoop();
    };

    const measureContainer = () => {
      queueSize(container.clientWidth, container.clientHeight);
    };

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;
      queueSize(entry.contentRect.width, entry.contentRect.height);
    });

    let kicked = false;

    const kickLoopOnce = () => {
      if (kicked || reducedMotion) return;
      kicked = true;
      startLoop();
    };

    const onVisibilityChange = () => {
      if (document.hidden) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = 0;
      } else {
        startLoop();
      }
    };

    motionQuery.addEventListener("change", onMotionChange);
    observer.observe(container);
    window.addEventListener("resize", measureContainer);
    window.addEventListener("touchstart", kickLoopOnce, { passive: true });
    window.addEventListener("pointerdown", kickLoopOnce, { passive: true });
    document.addEventListener("visibilitychange", onVisibilityChange);

    measureContainer();
    startLoop();

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measureContainer);
      window.removeEventListener("touchstart", kickLoopOnce);
      window.removeEventListener("pointerdown", kickLoopOnce);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      motionQuery.removeEventListener("change", onMotionChange);
      cancelAnimationFrame(rafRef.current);
      rafRef.current = 0;
    };
  }, []);

  return (
    <div ref={containerRef} className={className}>
      <canvas ref={canvasRef} className="block h-full w-full" aria-hidden />
    </div>
  );
}
