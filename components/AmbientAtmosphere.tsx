'use client';

import React, { useEffect, useRef } from 'react';

interface AmbientAtmosphereProps {
  isTractorRevving?: boolean;
  era?: '90s' | '2000s' | 'truck';
}

interface DustParticle {
  x: number;
  y: number;
  radius: number;
  alpha: number;
  speedX: number;
  speedY: number;
  wobble: number;
  pulseSpeed?: number;
  color?: string;
  glowColor?: string;
}

interface PetalOrLeaf {
  x: number;
  y: number;
  size: number;
  speedY: number;
  speedX: number;
  rotation: number;
  rotSpeed: number;
  swing: number;
  swingSpeed: number;
  color: string;
  tintColor: string;
}

interface SmokeParticle {
  x: number;
  y: number;
  radius: number;
  alpha: number;
  speedX: number;
  speedY: number;
}

export default function AmbientAtmosphere({
  isTractorRevving = false,
  era = '90s',
}: AmbientAtmosphereProps): React.JSX.Element {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const smokeRef = useRef<SmokeParticle[]>([]);
  const isRevvingRef = useRef<boolean>(isTractorRevving);
  const eraRef = useRef<'90s' | '2000s' | 'truck'>(era);

  useEffect(() => {
    isRevvingRef.current = isTractorRevving;
  }, [isTractorRevving]);

  useEffect(() => {
    eraRef.current = era;
  }, [era]);

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

    const is2000s = era === '2000s';
    const isTruck = era === 'truck';

    // Particle Palette Setup
    const romanticGlowColors = [
      { fill: '255, 195, 215', glow: 'rgba(255, 150, 190, 0.6)' },
      { fill: '255, 220, 190', glow: 'rgba(255, 180, 140, 0.5)' },
      { fill: '255, 240, 245', glow: 'rgba(255, 190, 220, 0.6)' },
      { fill: '235, 180, 255', glow: 'rgba(215, 140, 255, 0.5)' },
    ];

    const truckGlowColors = [
      { fill: '255, 200, 110', glow: 'rgba(255, 160, 50, 0.6)' },
      { fill: '255, 140, 80', glow: 'rgba(255, 80, 40, 0.5)' },
      { fill: '255, 245, 220', glow: 'rgba(255, 220, 160, 0.5)' },
      { fill: '255, 100, 60', glow: 'rgba(255, 60, 30, 0.5)' },
    ];

    const romanticPetalColors = [
      { main: 'rgba(244, 114, 182, 0.65)', tint: 'rgba(251, 168, 203, 0.4)' },
      { main: 'rgba(251, 113, 133, 0.65)', tint: 'rgba(253, 164, 175, 0.4)' },
      { main: 'rgba(225, 29, 72, 0.5)', tint: 'rgba(244, 63, 94, 0.35)' },
      { main: 'rgba(249, 168, 212, 0.7)', tint: 'rgba(255, 228, 240, 0.5)' },
    ];

    const truckSparkColors = [
      { main: 'rgba(255, 190, 100, 0.65)', tint: 'rgba(255, 140, 60, 0.35)' },
      { main: 'rgba(255, 130, 70, 0.6)', tint: 'rgba(255, 90, 40, 0.3)' },
      { main: 'rgba(255, 230, 160, 0.7)', tint: 'rgba(255, 200, 120, 0.4)' },
    ];

    // Particles (Dust motes for 90s, Bokeh for 2000s, Highway Night Sparks for Truck)
    const dustCount = Math.min(width < 768 ? (is2000s || isTruck ? 30 : 25) : (is2000s || isTruck ? 60 : 50), 70);
    const dustParticles: DustParticle[] = [];
    for (let i = 0; i < dustCount; i++) {
      let palette: { fill: string; glow: string };
      if (isTruck) {
        palette = truckGlowColors[Math.floor(Math.random() * truckGlowColors.length)];
      } else if (is2000s) {
        palette = romanticGlowColors[Math.floor(Math.random() * romanticGlowColors.length)];
      } else {
        palette = { fill: '255, 245, 200', glow: 'rgba(255, 230, 150, 0.4)' };
      }

      dustParticles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: isTruck ? Math.random() * 1.8 + 0.6 : is2000s ? Math.random() * 2.0 + 0.8 : Math.random() * 1.5 + 0.6,
        alpha: Math.random() * 0.45 + 0.2,
        speedX: isTruck ? (Math.random() - 0.5) * 0.5 + 0.2 : is2000s ? (Math.random() - 0.5) * 0.4 + 0.15 : (Math.random() - 0.5) * 0.35 + 0.2,
        speedY: isTruck ? -(Math.random() * 0.4 + 0.1) : is2000s ? -(Math.random() * 0.35 + 0.1) : (Math.random() - 0.5) * 0.2 - 0.15,
        wobble: Math.random() * Math.PI * 2,
        pulseSpeed: Math.random() * 0.03 + 0.015,
        color: palette.fill,
        glowColor: palette.glow,
      });
    }

    // Floating Petals / Leaves / Sparks
    const elementCount = Math.min(width < 768 ? (is2000s ? 7 : isTruck ? 5 : 4) : (is2000s ? 14 : isTruck ? 8 : 8), 16);
    const floatingElements: PetalOrLeaf[] = [];
    for (let i = 0; i < elementCount; i++) {
      let petalCol: { main: string; tint: string };
      if (isTruck) {
        petalCol = truckSparkColors[Math.floor(Math.random() * truckSparkColors.length)];
      } else if (is2000s) {
        petalCol = romanticPetalColors[Math.floor(Math.random() * romanticPetalColors.length)];
      } else {
        petalCol = { main: 'rgba(165, 140, 75, 0.35)', tint: 'rgba(140, 120, 60, 0.2)' };
      }

      floatingElements.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: isTruck ? Math.random() * 4 + 2 : is2000s ? Math.random() * 7 + 5 : Math.random() * 6 + 4,
        speedY: isTruck ? -(Math.random() * 0.6 + 0.3) : is2000s ? Math.random() * 0.55 + 0.35 : Math.random() * 0.6 + 0.3,
        speedX: isTruck ? (Math.random() - 0.5) * 0.6 + 0.3 : is2000s ? Math.random() * 0.5 + 0.2 : Math.random() * 0.8 + 0.4,
        rotation: Math.random() * 360,
        rotSpeed: (Math.random() - 0.5) * 2,
        swing: Math.random() * Math.PI * 2,
        swingSpeed: Math.random() * 0.03 + 0.015,
        color: petalCol.main,
        tintColor: petalCol.tint,
      });
    }

    let lastSmokeTime = 0;

    const render = (time: number) => {
      ctx.clearRect(0, 0, width, height);

      // 1. Render Sparkles / Dust Particles
      for (const d of dustParticles) {
        d.x += d.speedX;
        d.y += d.speedY;
        d.wobble += d.pulseSpeed || 0.02;
        d.x += Math.sin(d.wobble) * 0.3;

        // Wrap around screen boundaries
        if (d.x > width + 10) d.x = -10;
        if (d.x < -10) d.x = width + 10;
        if (d.y > height + 10) d.y = -10;
        if (d.y < -10) d.y = height + 10;

        const dynamicAlpha = d.alpha + Math.sin(d.wobble) * 0.15;
        const clampedAlpha = Math.max(0.08, Math.min(0.85, dynamicAlpha));

        ctx.beginPath();
        ctx.arc(d.x, d.y, d.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${d.color || '255, 245, 200'}, ${clampedAlpha})`;
        ctx.shadowBlur = isTruck ? 6 : is2000s ? 7 : 4;
        ctx.shadowColor = d.glowColor || 'rgba(255, 230, 150, 0.4)';
        ctx.fill();
      }

      // Reset shadow for petals
      ctx.shadowBlur = 0;

      // 2. Render Petals / Sparks / Leaves
      for (const item of floatingElements) {
        item.y += item.speedY;
        item.swing += item.swingSpeed;
        item.x += Math.sin(item.swing) * 0.9 + item.speedX;
        item.rotation += item.rotSpeed;

        if (item.y > height + 25) {
          item.y = -25;
          item.x = Math.random() * width;
        }
        if (item.y < -25) {
          item.y = height + 25;
          item.x = Math.random() * width;
        }
        if (item.x > width + 25) {
          item.x = -25;
        }
        if (item.x < -25) {
          item.x = width + 25;
        }

        ctx.save();
        ctx.translate(item.x, item.y);
        ctx.rotate((item.rotation * Math.PI) / 180);

        if (isTruck) {
          // Highway Night Ember / Amber Spark
          ctx.beginPath();
          ctx.arc(0, 0, item.size, 0, Math.PI * 2);
          ctx.fillStyle = item.color;
          ctx.shadowBlur = 8;
          ctx.shadowColor = item.tintColor;
          ctx.fill();
        } else if (is2000s) {
          // Romantic Fluttering Rose Petal with 3D tumble effect
          const flipScale = Math.sin(item.swing * 1.5);
          ctx.scale(1, Math.max(0.2, Math.abs(flipScale)));

          ctx.beginPath();
          ctx.moveTo(0, -item.size);
          ctx.bezierCurveTo(
            item.size * 0.8,
            -item.size * 0.6,
            item.size * 0.9,
            item.size * 0.5,
            0,
            item.size
          );
          ctx.bezierCurveTo(
            -item.size * 0.9,
            item.size * 0.5,
            -item.size * 0.8,
            -item.size * 0.6,
            0,
            -item.size
          );
          ctx.fillStyle = item.color;
          ctx.fill();

          ctx.beginPath();
          ctx.ellipse(0, 0, item.size * 0.4, item.size * 0.6, 0, 0, Math.PI * 2);
          ctx.fillStyle = item.tintColor;
          ctx.fill();
        } else {
          // 90s Village Autumn Leaf
          ctx.beginPath();
          ctx.ellipse(0, 0, item.size, item.size * 0.45, 0, 0, Math.PI * 2);
          ctx.fillStyle = item.color;
          ctx.fill();
        }

        ctx.restore();
      }

      // 3. Tractor Rev Exhaust Smoke Particles (Only for 90s)
      if (era === '90s' && isRevvingRef.current && time - lastSmokeTime > 65) {
        lastSmokeTime = time;

        const isDesktop = width >= 640;
        let exhaustX: number;
        let exhaustY: number;

        if (isDesktop) {
          const imgAR = 2752 / 1536;
          const screenAR = width / height;
          const relX = 0.525;
          const relY = 0.355;

          if (screenAR > imgAR) {
            const renderedH = width / imgAR;
            const topOffset = (height - renderedH) / 2;
            exhaustX = width * relX;
            exhaustY = topOffset + renderedH * relY;
          } else {
            const renderedW = height * imgAR;
            const leftOffset = (width - renderedW) / 2;
            exhaustX = leftOffset + renderedW * relX;
            exhaustY = height * relY;
          }
        } else {
          const imgAR = 1536 / 2752;
          const screenAR = width / height;
          const relX = 0.575;
          const relY = 0.645;

          if (screenAR > imgAR) {
            const renderedH = width / imgAR;
            const topOffset = (height - renderedH) / 2;
            exhaustX = width * relX;
            exhaustY = topOffset + renderedH * relY;
          } else {
            const renderedW = height * imgAR;
            const leftOffset = (width - renderedW) / 2;
            exhaustX = leftOffset + renderedW * relX;
            exhaustY = height * relY;
          }
        }

        for (let i = 0; i < 3; i++) {
          smokeRef.current.push({
            x: exhaustX + (Math.random() - 0.5) * 8,
            y: exhaustY + (Math.random() - 0.5) * 6,
            radius: Math.random() * 8 + 6,
            alpha: 0.75,
            speedX: (Math.random() - 0.5) * 2.0 - 0.8,
            speedY: -(Math.random() * 3 + 2.5),
          });
        }
      }

      // Update & Draw Smoke
      if (smokeRef.current.length > 0) {
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
      }

      animFrame = requestAnimationFrame(render);
    };

    animFrame = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animFrame);
      window.removeEventListener('resize', handleResize);
    };
  }, [era]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-10 w-full h-full"
    />
  );
}
