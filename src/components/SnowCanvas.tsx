"use client";

import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  r: number;
  speed: number;
  drift: number;
  opacity: number;
  twinkleSpeed: number;
  twinkleOffset: number;
  type: "flake" | "spark" | "hex";
  rotation: number;
  rotSpeed: number;
}

export default function SnowCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particles = useRef<Particle[]>([]);
  const raf = useRef<number>(0);
  const t = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const COUNT = 90;

    const spawn = (): Particle => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 2.4 + 0.4,
      speed: Math.random() * 0.5 + 0.15,
      drift: (Math.random() - 0.5) * 0.3,
      opacity: Math.random() * 0.55 + 0.15,
      twinkleSpeed: Math.random() * 0.018 + 0.006,
      twinkleOffset: Math.random() * Math.PI * 2,
      type: (["flake", "flake", "flake", "spark", "hex"] as const)[
        Math.floor(Math.random() * 5)
      ],
      rotation: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.012,
    });

    particles.current = Array.from({ length: COUNT }, spawn);

    /* draw a 6-pointed snowflake */
    const drawFlake = (ctx: CanvasRenderingContext2D, r: number) => {
      for (let i = 0; i < 6; i++) {
        const a = (i / 6) * Math.PI * 2;
        ctx.moveTo(0, 0);
        ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r);
        // tiny side-arms
        const mid = r * 0.55;
        ctx.moveTo(Math.cos(a) * mid, Math.sin(a) * mid);
        ctx.lineTo(
          Math.cos(a) * mid + Math.cos(a + Math.PI / 3) * r * 0.28,
          Math.sin(a) * mid + Math.sin(a + Math.PI / 3) * r * 0.28
        );
        ctx.moveTo(Math.cos(a) * mid, Math.sin(a) * mid);
        ctx.lineTo(
          Math.cos(a) * mid + Math.cos(a - Math.PI / 3) * r * 0.28,
          Math.sin(a) * mid + Math.sin(a - Math.PI / 3) * r * 0.28
        );
      }
    };

    /* draw a 4-point spark / diamond */
    const drawSpark = (ctx: CanvasRenderingContext2D, r: number) => {
      ctx.moveTo(0, -r * 1.6);
      ctx.lineTo(r * 0.35, 0);
      ctx.lineTo(0, r * 1.6);
      ctx.lineTo(-r * 0.35, 0);
      ctx.closePath();
    };

    /* draw tiny hexagon outline */
    const drawHex = (ctx: CanvasRenderingContext2D, r: number) => {
      ctx.moveTo(r, 0);
      for (let i = 1; i <= 6; i++) {
        ctx.lineTo(
          Math.cos((i / 6) * Math.PI * 2) * r,
          Math.sin((i / 6) * Math.PI * 2) * r
        );
      }
    };

    const animate = () => {
      t.current += 1;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const p of particles.current) {
        p.y += p.speed;
        p.x += p.drift + Math.sin(t.current * 0.012 + p.twinkleOffset) * 0.18;
        p.rotation += p.rotSpeed;

        // wrap
        if (p.y > canvas.height + 10) { p.y = -10; p.x = Math.random() * canvas.width; }
        if (p.x > canvas.width + 10)  { p.x = -10; }
        if (p.x < -10)                { p.x = canvas.width + 10; }

        const twinkle = Math.sin(t.current * p.twinkleSpeed + p.twinkleOffset);
        const alpha = p.opacity * (0.7 + 0.3 * twinkle);
        const scale = 0.92 + 0.08 * twinkle;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.scale(scale, scale);
        ctx.globalAlpha = alpha;

        // cold blue-cyan-white palette
        const hue = 190 + Math.sin(p.twinkleOffset) * 25; // 165–215 → cyan-to-sky
        const sat = p.type === "spark" ? 60 : 40;
        const lit = p.type === "spark" ? 85 : 92;

        if (p.type === "spark") {
          // filled glowing diamond
          ctx.beginPath();
          drawSpark(ctx, p.r * 1.4);
          ctx.fillStyle = `hsl(${hue},${sat}%,${lit}%)`;
          ctx.shadowColor = `hsl(${hue},80%,90%)`;
          ctx.shadowBlur = p.r * 6;
          ctx.fill();
        } else if (p.type === "hex") {
          ctx.beginPath();
          drawHex(ctx, p.r * 2);
          ctx.strokeStyle = `hsl(${hue},${sat}%,${lit}%)`;
          ctx.lineWidth = 0.5;
          ctx.shadowColor = `hsl(${hue},70%,90%)`;
          ctx.shadowBlur = p.r * 4;
          ctx.stroke();
        } else {
          // snowflake
          ctx.beginPath();
          drawFlake(ctx, p.r * 2.8);
          ctx.strokeStyle = `hsl(${hue},${sat}%,${lit}%)`;
          ctx.lineWidth = 0.7;
          ctx.shadowColor = `hsl(${hue},70%,95%)`;
          ctx.shadowBlur = p.r * 5;
          ctx.stroke();
          // center dot
          ctx.beginPath();
          ctx.arc(0, 0, p.r * 0.5, 0, Math.PI * 2);
          ctx.fillStyle = `hsl(${hue},60%,96%)`;
          ctx.fill();
        }

        ctx.restore();
        ctx.globalAlpha = 1;
        ctx.shadowBlur = 0;
      }

      raf.current = requestAnimationFrame(animate);
    };

    raf.current = requestAnimationFrame(animate);
    return () => {
      cancelAnimationFrame(raf.current);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
}
