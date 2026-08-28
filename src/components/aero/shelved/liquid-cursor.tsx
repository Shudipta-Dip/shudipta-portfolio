/**
 * Shelved liquid trail cursor — kept for easy restore.
 * To re-enable: swap BubbleCursor for LiquidCursor in src/app/layout.tsx
 */
"use client";

import { useEffect, useRef } from "react";

interface Point {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  radius: number;
  color: string;
}

const COLORS = [
  "#5ec8f0", // sky
  "#1aa4d1", // primary
  "#2ad4c9", // aqua
  "#48cae4", // water
  "#a8e063", // lime
  "#7ed957", // meadow
];

export function LiquidCursor() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointsRef = useRef<Point[]>([]);
  const mouseRef = useRef({ x: 0, y: 0, lastX: 0, lastY: 0, moved: false });
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", resize);
    resize();

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
      mouseRef.current.moved = true;
    };
    window.addEventListener("mousemove", handleMouseMove);

    const addPoint = (x: number, y: number) => {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 0.5;
      const color = COLORS[Math.floor(Math.random() * COLORS.length)];

      pointsRef.current.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 1,
        maxLife: 1,
        radius: Math.random() * 20 + 10,
        color,
      });
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (mouseRef.current.moved) {
        const dist = Math.hypot(
          mouseRef.current.x - mouseRef.current.lastX,
          mouseRef.current.y - mouseRef.current.lastY,
        );

        if (dist > 0) {
          const steps = Math.min(dist, 20);
          for (let i = 0; i < steps; i += 2) {
            const t = i / steps;
            const x =
              mouseRef.current.lastX + (mouseRef.current.x - mouseRef.current.lastX) * t;
            const y =
              mouseRef.current.lastY + (mouseRef.current.y - mouseRef.current.lastY) * t;
            if (Math.random() > 0.5) addPoint(x, y);
          }
        }

        mouseRef.current.lastX = mouseRef.current.x;
        mouseRef.current.lastY = mouseRef.current.y;
        mouseRef.current.moved = false;
      } else {
        mouseRef.current.lastX = mouseRef.current.x;
        mouseRef.current.lastY = mouseRef.current.y;
      }

      for (let i = pointsRef.current.length - 1; i >= 0; i--) {
        const p = pointsRef.current[i];

        p.life -= 0.01;
        p.x += p.vx;
        p.y += p.vy;
        p.radius *= 0.99;

        if (p.life <= 0 || p.radius < 0.5) {
          pointsRef.current.splice(i, 1);
          continue;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.life * 0.72;
        ctx.fill();
        ctx.globalAlpha = 1;
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999] overflow-hidden">
      <svg className="hidden" aria-hidden>
        <defs>
          <filter id="liquid-cursor-filter">
            <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7"
              result="goo"
            />
            <feComposite in="SourceGraphic" in2="goo" operator="atop" />
          </filter>
        </defs>
      </svg>

      <canvas
        ref={canvasRef}
        className="block h-full w-full"
        style={{ filter: "url(#liquid-cursor-filter)" }}
      />
    </div>
  );
}
