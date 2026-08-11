'use client';

import React, { useEffect, useRef } from 'react';

interface AmbientAtmosphereProps {
  isTractorRevving?: boolean;
}

interface DustParticle {
  x: number;
  y: number;
  radius: number;
  alpha: number;
  speedX: number;
  speedY: number;
  wobble: number;
}

interface Leaf {
  x: number;
  y: number;
  size: number;
  speedY: number;
  speedX: number;
  rotation: number;
  rotSpeed: number;
}

interface SmokeParticle {
  x: number;
  y: number;
  radius: number;
  alpha: number;
  speedX: number;
  speedY: number;
}

export default function AmbientAtmosphere({ isTractorRevving = false }: AmbientAtmosphereProps): React.JSX.Element {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const smokeRef = useRef<SmokeParticle[]>([]);
  const isRevvingRef = useRef<boolean>(isTractorRevving);

  useEffect(() => {
    isRevvingRef.current = isTractorRevving;
  }, [isTractorRevving]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animFrame: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Dust particles
    const dustCount = Math.min(width < 768 ? 25 : 55, 60);
    const dustParticles: DustParticle[] = [];
    for (let i = 0; i < dustCount; i++) {
      dustParticles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 1.5 + 0.6,
        alpha: Math.random() * 0.4 + 0.15,
        speedX: (Math.random() - 0.5) * 0.35 + 0.2,
        speedY: (Math.random() - 0.5) * 0.2 - 0.15,
        wobble: Math.random() * Math.PI * 2,
      });
    }

    // Leaves / Petals
    const leafCount = Math.min(width < 768 ? 4 : 8, 10);
    const leaves: Leaf[] = [];
    for (let i = 0; i < leafCount; i++) {
      leaves.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 6 + 4,
        speedY: Math.random() * 0.6 + 0.3,
        speedX: Math.random() * 0.8 + 0.4,
        rotation: Math.random() * 360,
        rotSpeed: (Math.random() - 0.5) * 2,
      });
    }

    let lastSmokeTime = 0;

    const render = (time: number) => {
      ctx.clearRect(0, 0, width, height);

      // Render Dust Particles (Sunlight Dust motes)
      for (const d of dustParticles) {
        d.x += d.speedX;
        d.y += d.speedY;
        d.wobble += 0.02;
        d.x += Math.sin(d.wobble) * 0.25;

        if (d.x > width + 10) d.x = -10;
        if (d.x < -10) d.x = width + 10;
        if (d.y > height + 10) d.y = -10;
        if (d.y < -10) d.y = height + 10;

        ctx.beginPath();
        ctx.arc(d.x, d.y, d.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 245, 200, ${d.alpha})`;
        ctx.shadowBlur = 4;
        ctx.shadowColor = 'rgba(255, 230, 150, 0.4)';
        ctx.fill();
      }

      // Render Floating Leaves / Petals
      for (const leaf of leaves) {
        leaf.y += leaf.speedY;
        leaf.x += Math.sin(leaf.y * 0.01) * 0.8 + leaf.speedX;
        leaf.rotation += leaf.rotSpeed;

        if (leaf.y > height + 20) {
          leaf.y = -20;
          leaf.x = Math.random() * width;
        }
        if (leaf.x > width + 20) {
          leaf.x = -20;
        }

        ctx.save();
        ctx.translate(leaf.x, leaf.y);
        ctx.rotate((leaf.rotation * Math.PI) / 180);
        ctx.beginPath();
        ctx.ellipse(0, 0, leaf.size, leaf.size * 0.45, 0, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(165, 140, 75, 0.35)';
        ctx.fill();
        ctx.restore();
      }

      // Tractor Rev Exhaust Smoke Particles
      if (isRevvingRef.current && time - lastSmokeTime > 70) {
        lastSmokeTime = time;
        // Exhaust pipe position on desktop vs mobile
        const exhaustX = width > 768 ? width * 0.36 : width * 0.48;
        const exhaustY = width > 768 ? height * 0.52 : height * 0.58;

        for (let i = 0; i < 3; i++) {
          smokeRef.current.push({
            x: exhaustX + (Math.random() - 0.5) * 12,
            y: exhaustY + (Math.random() - 0.5) * 8,
            radius: Math.random() * 8 + 6,
            alpha: 0.75,
            speedX: (Math.random() - 0.5) * 2.5 - 1.5,
            speedY: -(Math.random() * 3 + 2.5),
          });
        }
      }

      // Update & Draw Smoke
      for (let i = smokeRef.current.length - 1; i >= 0; i--) {
        const s = smokeRef.current[i];
        s.x += s.speedX;
        s.y += s.speedY;
        s.radius += 0.85;
        s.alpha -= 0.016;

        if (s.alpha <= 0) {
          smokeRef.current.splice(i, 1);
          continue;
        }

        ctx.beginPath();
        ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(80, 80, 80, ${s.alpha * 0.45})`;
        ctx.shadowBlur = 10;
        ctx.shadowColor = `rgba(40, 40, 40, ${s.alpha * 0.3})`;
        ctx.fill();
      }

      animFrame = requestAnimationFrame(render);
    };

    animFrame = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animFrame);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-10 w-full h-full"
    />
  );
}
