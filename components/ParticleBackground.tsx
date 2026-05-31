"use client";

import { useEffect, useRef } from "react";

export default function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const activeCanvas = canvas;

    const ctx = activeCanvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Particle[] = [];
    const mouse = { x: null as number | null, y: null as number | null, radius: 150 };

    // Set canvas dimensions with robust container client height fallbacks
    const resizeCanvas = () => {
      const parentWidth = activeCanvas.parentElement?.clientWidth;
      const parentHeight = activeCanvas.parentElement?.clientHeight;
      
      activeCanvas.width = parentWidth && parentWidth > 0 ? parentWidth : window.innerWidth;
      activeCanvas.height = parentHeight && parentHeight > 0 ? parentHeight : window.innerHeight;
      
      initParticles();
    };

    class Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      color: string;

      constructor() {
        this.x = Math.random() * activeCanvas.width;
        this.y = Math.random() * activeCanvas.height;
        // Drift speed
        this.vx = (Math.random() - 0.5) * 0.35;
        this.vy = (Math.random() - 0.5) * 0.35;
        this.size = Math.random() * 2.5 + 1.2;
        
        // High visibility custom glowing colors matching Informatics '22 palette
        const colors = [
          "rgba(168, 85, 247, 0.65)", // Glowing Purple
          "rgba(99, 102, 241, 0.65)",  // Glowing Indigo
          "rgba(34, 211, 238, 0.55)"   // Glowing Cyan
        ];
        this.color = colors[Math.floor(Math.random() * colors.length)];
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        // Bounce back from boundaries
        if (this.x < 0 || this.x > activeCanvas.width) this.vx = -this.vx;
        if (this.y < 0 || this.y > activeCanvas.height) this.vy = -this.vy;

        // Mouse interaction: push away slightly
        if (mouse.x !== null && mouse.y !== null) {
          const dx = this.x - mouse.x;
          const dy = this.y - mouse.y;
          const dist = Math.hypot(dx, dy);
          if (dist < mouse.radius) {
            const force = (mouse.radius - dist) / mouse.radius;
            this.x += (dx / dist) * force * 1.5;
            this.y += (dy / dist) * force * 1.5;
          }
        }
      }

      draw() {
        if (!ctx) return;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
      }
    }

    const initParticles = () => {
      particles = [];
      const count = Math.min(85, Math.floor((activeCanvas.width * activeCanvas.height) / 18000));
      for (let i = 0; i < count; i++) {
        particles.push(new Particle());
      }
    };

    const drawConnections = () => {
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.hypot(dx, dy);

          if (dist < 120) {
            const alpha = (1 - dist / 120) * 0.3; // Increased visibility alpha
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(99, 102, 241, ${alpha})`;
            ctx.lineWidth = 0.65;
            ctx.stroke();
          }
        }
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, activeCanvas.width, activeCanvas.height);
      
      particles.forEach((p) => {
        p.update();
        p.draw();
      });

      drawConnections();
      animationFrameId = requestAnimationFrame(animate);
    };

    // Listeners
    const handleMouseMove = (e: MouseEvent) => {
      const rect = activeCanvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };

    const handleMouseLeave = () => {
      mouse.x = null;
      mouse.y = null;
    };

    window.addEventListener("resize", resizeCanvas);
    activeCanvas.parentElement?.addEventListener("mousemove", handleMouseMove);
    activeCanvas.parentElement?.addEventListener("mouseleave", handleMouseLeave);

    resizeCanvas();
    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      activeCanvas.parentElement?.removeEventListener("mousemove", handleMouseMove);
      activeCanvas.parentElement?.removeEventListener("mouseleave", handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-0 mix-blend-screen opacity-80"
      aria-hidden="true"
    />
  );
}
