'use client';

import React, { useEffect, useRef } from 'react';

interface AmbientAtmosphereProps {
  isTractorRevving: boolean;
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
  color: string;
}

interface Bird {
  x: number;
  y: number;
  speed: number;
  size: number;
  wing: number;
}

interface SmokePuff {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  alpha: number;
  speedY: number;
  speedX: number;
  growth: number;
}

export default function AmbientAtmosphere({ isTractorRevving }: AmbientAtmosphereProps): React.JSX.Element {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const smokeCanvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      if (smokeCanvasRef.current) {
        smokeCanvasRef.current.width = width;
        smokeCanvasRef.current.height = height;
      }
    };
    window.addEventListener('resize', handleResize);

    const dustParticles: DustParticle[] = [];
    for (let i = 0; i < 35; i++) {
      dustParticles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 2 + 0.6,
        alpha: Math.random() * 0.5 + 0.2,
        speedX: Math.random() * 0.35 + 0.1,
        speedY: (Math.random() - 0.5) * 0.2,
        wobble: Math.random() * Math.PI * 2
      });
    }

    const leaves: Leaf[] = [];
    for (let i = 0; i < 10; i++) {
      leaves.push({
        x: Math.random() * (width * 0.6),
        y: Math.random() * (height * 0.5),
        size: Math.random() * 6 + 5,
        speedY: Math.random() * 0.6 + 0.3,
        speedX: Math.random() * 0.5 + 0.2,
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.02,
        color: Math.random() > 0.4 ? 'rgba(92, 140, 42, 0.6)' : 'rgba(214, 160, 52, 0.6)'
      });
    }

    const birds: Bird[] = [
      { x: width * 0.7, y: height * 0.22, speed: 0.6, size: 4, wing: 0 },
      { x: width * 0.74, y: height * 0.24, speed: 0.55, size: 3.5, wing: 0.5 }
    ];

    let animId: number;
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw dust
      dustParticles.forEach(p => {
        p.x += p.speedX;
        p.y += Math.sin(p.wobble) * 0.25 + p.speedY;
        p.wobble += 0.02;

        if (p.x > width + 10) p.x = -10;
        if (p.y > height + 10) p.y = -10;
        if (p.y < -10) p.y = height + 10;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 235, 175, ${p.alpha})`;
        ctx.fill();
      });

      // Draw leaves
      leaves.forEach(l => {
        l.x += l.speedX;
        l.y += l.speedY;
        l.rotation += l.rotSpeed;

        if (l.y > height + 20 || l.x > width + 20) {
          l.x = Math.random() * (width * 0.4) - 50;
          l.y = -10;
        }

        ctx.save();
        ctx.translate(l.x, l.y);
        ctx.rotate(l.rotation);
        ctx.fillStyle = l.color;
        ctx.beginPath();
        ctx.ellipse(0, 0, l.size, l.size * 0.45, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      // Draw birds
      birds.forEach(b => {
        b.x -= b.speed;
        b.wing += 0.05;

        if (b.x < -40) {
          b.x = width + 50;
          b.y = Math.random() * (height * 0.25) + (height * 0.12);
        }

        const wingY = Math.sin(b.wing) * (b.size * 0.5);
        ctx.strokeStyle = 'rgba(40, 50, 35, 0.4)';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(b.x - b.size, b.y + wingY);
        ctx.quadraticCurveTo(b.x - b.size * 0.3, b.y - b.size * 0.6, b.x, b.y);
        ctx.quadraticCurveTo(b.x + b.size * 0.3, b.y - b.size * 0.6, b.x + b.size, b.y + wingY);
        ctx.stroke();
      });

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);
    };
  }, []);

  // Tractor smoke bursts
  useEffect(() => {
    if (!isTractorRevving || !smokeCanvasRef.current) return;
    const canvas = smokeCanvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const width = canvas.width = window.innerWidth;
    const height = canvas.height = window.innerHeight;

    const isMobile = width < 640;
    const exhaustX = isMobile ? width * 0.575 : width * 0.528;
    const exhaustY = isMobile ? height * 0.645 : height * 0.38;

    const smokePuffs: SmokePuff[] = [];
    for (let i = 0; i < 20; i++) {
      smokePuffs.push({
        x: exhaustX + (Math.random() - 0.5) * 8,
        y: exhaustY + (Math.random() - 0.5) * 8,
        radius: Math.random() * 8 + 6,
        maxRadius: Math.random() * 32 + 20,
        alpha: 0.65,
        speedY: -(Math.random() * 1.8 + 1.2),
        speedX: (Math.random() - 0.2) * 1.1,
        growth: Math.random() * 0.4 + 0.3
      });
    }

    let smokeAnimId: number;
    const renderSmoke = () => {
      ctx.clearRect(0, 0, width, height);

      for (let i = smokePuffs.length - 1; i >= 0; i--) {
        const p = smokePuffs[i];
        p.x += p.speedX;
        p.y += p.speedY;
        p.radius += p.growth;
        p.alpha -= 0.014;

        if (p.alpha <= 0 || p.radius >= p.maxRadius) {
          smokePuffs.splice(i, 1);
          continue;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(180, 175, 160, ${p.alpha})`;
        ctx.shadowBlur = 8;
        ctx.shadowColor = `rgba(140, 130, 110, ${p.alpha * 0.5})`;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      if (smokePuffs.length > 0) {
        smokeAnimId = requestAnimationFrame(renderSmoke);
      } else {
        ctx.clearRect(0, 0, width, height);
      }
    };

    renderSmoke();

    return () => {
      cancelAnimationFrame(smokeAnimId);
    };
  }, [isTractorRevving]);

  return (
    <>
      <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-10 w-full h-full" />
      <canvas ref={smokeCanvasRef} className="fixed inset-0 pointer-events-none z-20 w-full h-full" />
    </>
  );
}
