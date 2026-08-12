'use client';

import React, { useEffect, useRef } from 'react';

interface AmbientAtmosphereProps {
  isTractorRevving?: boolean;
  era?: '90s' | '2000s' | 'truck' | 'dhurandhar' | 'longdrive' | 'lofi' | 'phonk';
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
  const eraRef = useRef<'90s' | '2000s' | 'truck' | 'dhurandhar' | 'longdrive' | 'lofi' | 'phonk'>(era);

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
    const isDhurandhar = era === 'dhurandhar';
    const isLongDrive = era === 'longdrive';
    const isLofi = era === 'lofi';
    const isPhonk = era === 'phonk';

    // Particle Palette Setup
    const romanticGlowColors = [
      { fill: '255, 195, 215', glow: 'rgba(255, 150, 190, 0.6)' },
      { fill: '255, 220, 190', glow: 'rgba(255, 180, 140, 0.5)' },
      { fill: '255, 240, 245', glow: 'rgba(255, 190, 220, 0.6)' },
      { fill: '235, 180, 255', glow: 'rgba(215, 140, 255, 0.5)' },
    ];

    const lofiGlowColors = [
      { fill: '192, 132, 252', glow: 'rgba(192, 132, 252, 0.7)' },
      { fill: '244, 114, 182', glow: 'rgba(244, 114, 182, 0.6)' },
      { fill: '216, 180, 254', glow: 'rgba(216, 180, 254, 0.6)' },
      { fill: '251, 207, 232', glow: 'rgba(251, 207, 232, 0.5)' },
    ];

    const phonkGlowColors = [
      { fill: '239, 68, 68', glow: 'rgba(239, 68, 68, 0.8)' },
      { fill: '244, 63, 94', glow: 'rgba(244, 63, 94, 0.75)' },
      { fill: '168, 85, 247', glow: 'rgba(168, 85, 247, 0.7)' },
      { fill: '255, 255, 255', glow: 'rgba(255, 255, 255, 0.6)' },
    ];

    const truckGlowColors = [
      { fill: '255, 200, 110', glow: 'rgba(255, 160, 50, 0.6)' },
      { fill: '255, 140, 80', glow: 'rgba(255, 80, 40, 0.5)' },
      { fill: '255, 245, 220', glow: 'rgba(255, 220, 160, 0.5)' },
      { fill: '255, 100, 60', glow: 'rgba(255, 60, 30, 0.5)' },
    ];

    const dhurandharGlowColors = [
      { fill: '255, 130, 30', glow: 'rgba(249, 115, 22, 0.7)' },
      { fill: '255, 80, 20', glow: 'rgba(239, 68, 68, 0.6)' },
      { fill: '255, 215, 80', glow: 'rgba(234, 179, 8, 0.6)' },
      { fill: '255, 245, 200', glow: 'rgba(255, 200, 100, 0.5)' },
    ];

    const longDriveGlowColors = [
      { fill: '56, 189, 248', glow: 'rgba(56, 189, 248, 0.7)' },
      { fill: '96, 165, 250', glow: 'rgba(96, 165, 250, 0.6)' },
      { fill: '192, 132, 252', glow: 'rgba(192, 132, 252, 0.6)' },
      { fill: '224, 242, 254', glow: 'rgba(224, 242, 254, 0.5)' },
    ];

    const romanticPetalColors = [
      { main: 'rgba(244, 114, 182, 0.65)', tint: 'rgba(251, 168, 203, 0.4)' },
      { main: 'rgba(251, 113, 133, 0.65)', tint: 'rgba(253, 164, 175, 0.4)' },
      { main: 'rgba(225, 29, 72, 0.5)', tint: 'rgba(244, 63, 94, 0.35)' },
      { main: 'rgba(249, 168, 212, 0.7)', tint: 'rgba(255, 228, 240, 0.5)' },
    ];

    const lofiPetalColors = [
      { main: 'rgba(216, 180, 254, 0.7)', tint: 'rgba(192, 132, 252, 0.45)' },
      { main: 'rgba(244, 114, 182, 0.65)', tint: 'rgba(251, 113, 133, 0.4)' },
      { main: 'rgba(232, 121, 249, 0.6)', tint: 'rgba(168, 85, 247, 0.35)' },
    ];

    const phonkDriftColors = [
      { main: 'rgba(239, 68, 68, 0.85)', tint: 'rgba(220, 38, 38, 0.5)' },
      { main: 'rgba(244, 63, 94, 0.8)', tint: 'rgba(225, 29, 72, 0.45)' },
      { main: 'rgba(168, 85, 247, 0.75)', tint: 'rgba(147, 51, 234, 0.4)' },
    ];

    const truckSparkColors = [
      { main: 'rgba(255, 190, 100, 0.65)', tint: 'rgba(255, 140, 60, 0.35)' },
      { main: 'rgba(255, 130, 70, 0.6)', tint: 'rgba(255, 90, 40, 0.3)' },
      { main: 'rgba(255, 230, 160, 0.7)', tint: 'rgba(255, 200, 120, 0.4)' },
    ];

    const dhurandharEmberColors = [
      { main: 'rgba(255, 110, 20, 0.8)', tint: 'rgba(249, 115, 22, 0.5)' },
      { main: 'rgba(239, 68, 68, 0.75)', tint: 'rgba(220, 38, 38, 0.45)' },
      { main: 'rgba(251, 191, 36, 0.85)', tint: 'rgba(245, 158, 11, 0.5)' },
    ];

    const longDriveStreakColors = [
      { main: 'rgba(56, 189, 248, 0.75)', tint: 'rgba(14, 165, 233, 0.45)' },
      { main: 'rgba(129, 140, 248, 0.7)', tint: 'rgba(99, 102, 241, 0.4)' },
      { main: 'rgba(192, 132, 252, 0.65)', tint: 'rgba(168, 85, 247, 0.35)' },
    ];

    // Particles
    const dustCount = Math.min(width < 768 ? 35 : (isPhonk ? 65 : isLofi ? 55 : isLongDrive ? 60 : isDhurandhar ? 65 : 55), 80);
    const dustParticles: DustParticle[] = [];
    for (let i = 0; i < dustCount; i++) {
      let palette: { fill: string; glow: string };
      if (isPhonk) {
        palette = phonkGlowColors[Math.floor(Math.random() * phonkGlowColors.length)];
      } else if (isLofi) {
        palette = lofiGlowColors[Math.floor(Math.random() * lofiGlowColors.length)];
      } else if (isLongDrive) {
        palette = longDriveGlowColors[Math.floor(Math.random() * longDriveGlowColors.length)];
      } else if (isDhurandhar) {
        palette = dhurandharGlowColors[Math.floor(Math.random() * dhurandharGlowColors.length)];
      } else if (isTruck) {
        palette = truckGlowColors[Math.floor(Math.random() * truckGlowColors.length)];
      } else if (is2000s) {
        palette = romanticGlowColors[Math.floor(Math.random() * romanticGlowColors.length)];
      } else {
        palette = { fill: '255, 245, 200', glow: 'rgba(255, 230, 150, 0.4)' };
      }

      dustParticles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: isPhonk ? Math.random() * 2.5 + 0.8 : isLofi ? Math.random() * 2.2 + 0.8 : isLongDrive ? Math.random() * 2.0 + 0.7 : isDhurandhar ? Math.random() * 2.2 + 0.8 : isTruck ? Math.random() * 1.8 + 0.6 : is2000s ? Math.random() * 2.0 + 0.8 : Math.random() * 1.5 + 0.6,
        alpha: Math.random() * 0.5 + 0.2,
        speedX: isPhonk ? (Math.random() - 0.5) * 1.2 + 0.4 : isLofi ? (Math.random() - 0.5) * 0.4 + 0.15 : isLongDrive ? (Math.random() - 0.5) * 0.6 + 0.2 : isDhurandhar ? (Math.random() - 0.5) * 0.7 + 0.1 : isTruck ? (Math.random() - 0.5) * 0.5 + 0.2 : is2000s ? (Math.random() - 0.5) * 0.4 + 0.15 : (Math.random() - 0.5) * 0.35 + 0.2,
        speedY: isPhonk ? (Math.random() - 0.5) * 0.8 : isLofi ? -(Math.random() * 0.35 + 0.1) : isLongDrive ? -(Math.random() * 0.4 + 0.1) : isDhurandhar ? -(Math.random() * 0.7 + 0.3) : isTruck ? -(Math.random() * 0.4 + 0.1) : is2000s ? -(Math.random() * 0.35 + 0.1) : (Math.random() - 0.5) * 0.2 - 0.15,
        wobble: Math.random() * Math.PI * 2,
        pulseSpeed: Math.random() * 0.05 + 0.03,
        color: palette.fill,
        glowColor: palette.glow,
      });
    }

    // Floating Petals / Sparks / Action Embers / Road Streaks / Drift Sparks
    const elementCount = Math.min(width < 768 ? (isPhonk ? 12 : isLofi ? 8 : isLongDrive ? 8 : isDhurandhar ? 8 : is2000s ? 7 : 5) : (isPhonk ? 18 : isLofi ? 14 : isLongDrive ? 14 : isDhurandhar ? 16 : is2000s ? 14 : 8), 20);
    const floatingElements: PetalOrLeaf[] = [];
    for (let i = 0; i < elementCount; i++) {
      let petalCol: { main: string; tint: string };
      if (isPhonk) {
        petalCol = phonkDriftColors[Math.floor(Math.random() * phonkDriftColors.length)];
      } else if (isLofi) {
        petalCol = lofiPetalColors[Math.floor(Math.random() * lofiPetalColors.length)];
      } else if (isLongDrive) {
        petalCol = longDriveStreakColors[Math.floor(Math.random() * longDriveStreakColors.length)];
      } else if (isDhurandhar) {
        petalCol = dhurandharEmberColors[Math.floor(Math.random() * dhurandharEmberColors.length)];
      } else if (isTruck) {
        petalCol = truckSparkColors[Math.floor(Math.random() * truckSparkColors.length)];
      } else if (is2000s) {
        petalCol = romanticPetalColors[Math.floor(Math.random() * romanticPetalColors.length)];
      } else {
        petalCol = { main: 'rgba(165, 140, 75, 0.35)', tint: 'rgba(140, 120, 60, 0.2)' };
      }

      floatingElements.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: isPhonk ? Math.random() * 5 + 2 : isLofi ? Math.random() * 6 + 4 : isLongDrive ? Math.random() * 4 + 2 : isDhurandhar ? Math.random() * 4 + 2 : isTruck ? Math.random() * 4 + 2 : is2000s ? Math.random() * 7 + 5 : Math.random() * 6 + 4,
        speedY: isPhonk ? (Math.random() - 0.5) * 1.5 : isLofi ? Math.random() * 0.45 + 0.25 : isLongDrive ? -(Math.random() * 0.5 + 0.2) : isDhurandhar ? -(Math.random() * 0.9 + 0.4) : isTruck ? -(Math.random() * 0.6 + 0.3) : is2000s ? Math.random() * 0.55 + 0.35 : Math.random() * 0.6 + 0.3,
        speedX: isPhonk ? (Math.random() - 0.5) * 2.2 + 0.8 : isLofi ? Math.random() * 0.4 + 0.2 : isLongDrive ? (Math.random() - 0.5) * 0.8 + 0.3 : isDhurandhar ? (Math.random() - 0.5) * 0.8 + 0.2 : isTruck ? (Math.random() - 0.5) * 0.6 + 0.3 : is2000s ? Math.random() * 0.5 + 0.2 : Math.random() * 0.8 + 0.4,
        rotation: Math.random() * 360,
        rotSpeed: (Math.random() - 0.5) * 4.0,
        swing: Math.random() * Math.PI * 2,
        swingSpeed: Math.random() * 0.05 + 0.03,
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
        d.x += Math.sin(d.wobble) * 0.45;

        // Wrap around screen boundaries
        if (d.x > width + 10) d.x = -10;
        if (d.x < -10) d.x = width + 10;
        if (d.y > height + 10) d.y = -10;
        if (d.y < -10) d.y = height + 10;

        const dynamicAlpha = d.alpha + Math.sin(d.wobble) * 0.18;
        const clampedAlpha = Math.max(0.08, Math.min(0.9, dynamicAlpha));

        ctx.beginPath();
        ctx.arc(d.x, d.y, d.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${d.color || '255, 245, 200'}, ${clampedAlpha})`;
        ctx.shadowBlur = isPhonk ? 10 : isLofi ? 9 : isLongDrive ? 8 : isDhurandhar ? 8 : isTruck ? 6 : is2000s ? 7 : 4;
        ctx.shadowColor = d.glowColor || 'rgba(255, 230, 150, 0.4)';
        ctx.fill();
      }

      // Reset shadow
      ctx.shadowBlur = 0;

      // 2. Render Petals / Sparks / Leaves / Embers / Road Streaks / Phonk Sparks
      for (const item of floatingElements) {
        item.y += item.speedY;
        item.swing += item.swingSpeed;
        item.x += Math.sin(item.swing) * 1.2 + item.speedX;
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

        if (isPhonk) {
          // Neon Drift Spark / Electric Flare
          ctx.beginPath();
          ctx.ellipse(0, 0, item.size * 2.2, item.size * 0.5, 0, 0, Math.PI * 2);
          ctx.fillStyle = item.color;
          ctx.shadowBlur = 12;
          ctx.shadowColor = item.tintColor;
          ctx.fill();
        } else if (isLongDrive) {
          // Night Road Light Streak
          ctx.beginPath();
          ctx.ellipse(0, 0, item.size * 1.6, item.size * 0.6, 0, 0, Math.PI * 2);
          ctx.fillStyle = item.color;
          ctx.shadowBlur = 10;
          ctx.shadowColor = item.tintColor;
          ctx.fill();
        } else if (isDhurandhar || isTruck) {
          // Action Ember / Spark
          ctx.beginPath();
          ctx.arc(0, 0, item.size, 0, Math.PI * 2);
          ctx.fillStyle = item.color;
          ctx.shadowBlur = isDhurandhar ? 10 : 8;
          ctx.shadowColor = item.tintColor;
          ctx.fill();
        } else if (is2000s || isLofi) {
          // Romantic Fluttering Rose / Lavender Petal
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
