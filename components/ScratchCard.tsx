"use client";

import { useEffect, useRef, useState } from "react";
import { Sparkles, Lock, Unlock, RefreshCw } from "lucide-react";

export default function ScratchCard() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isScratched, setIsScratched] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isLocked, setIsLocked] = useState(false); // Can be toggled for showcase purposes
  const [confetti, setConfetti] = useState<{ id: number; x: number; y: number; color: string; size: number; vy: number; vx: number }[]>([]);

  // Initialize Canvas Cover
  const initCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Reset states
    setIsScratched(false);
    setProgress(0);
    setConfetti([]);

    const width = canvas.width = containerRef.current?.clientWidth || 320;
    const height = canvas.height = 200;

    // Draw Matte Holographic Metallic background
    const grad = ctx.createLinearGradient(0, 0, width, height);
    grad.addColorStop(0, "#1e1b4b"); // Very deep indigo
    grad.addColorStop(0.3, "#312e81");
    grad.addColorStop(0.5, "#4c1d95"); // Deep purple
    grad.addColorStop(0.7, "#1e1b4b");
    grad.addColorStop(1, "#030712"); // Dark zinc

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    // Overlay delicate digital network grid
    ctx.strokeStyle = "rgba(99, 102, 241, 0.25)";
    ctx.lineWidth = 1;
    for (let i = 0; i < width; i += 20) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, height);
      ctx.stroke();
    }
    for (let j = 0; j < height; j += 20) {
      ctx.beginPath();
      ctx.moveTo(0, j);
      ctx.lineTo(width, j);
      ctx.stroke();
    }

    // Add glowing diagonal accent line
    const accentGrad = ctx.createLinearGradient(0, 0, width, 0);
    accentGrad.addColorStop(0, "rgba(6, 182, 212, 0)");
    accentGrad.addColorStop(0.5, "rgba(34, 211, 238, 0.4)");
    accentGrad.addColorStop(1, "rgba(168, 85, 247, 0)");
    ctx.fillStyle = accentGrad;
    ctx.fillRect(0, height / 2 - 20, width, 40);

    // Render Text
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 15px 'Outfit', sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("INFORMATICS CLASS OF 2022", width / 2, height / 2 - 15);

    ctx.fillStyle = "rgba(255, 255, 255, 0.6)";
    ctx.font = "12px 'Plus Jakarta Sans', sans-serif";
    ctx.fillText("SCRATCH TO REVEAL TITLE", width / 2, height / 2 + 10);

    // Draw Lock Icon
    ctx.fillStyle = "rgba(34, 211, 238, 0.8)";
    ctx.font = "18px serif";
    ctx.fillText("🔒", width / 2, height / 2 + 35);
  };

  useEffect(() => {
    if (!isLocked) {
      initCanvas();
    }
  }, [isLocked]);

  // Scratch Action
  const getCoordinates = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    
    // Check if Touch Event
    if ("touches" in e) {
      if (e.touches.length === 0) return { x: 0, y: 0 };
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top,
      };
    } else {
      return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    }
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing || isScratched || isLocked) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const { x, y } = getCoordinates(e);

    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    ctx.arc(x, y, 22, 0, Math.PI * 2);
    ctx.fill();

    // Throttle calculation slightly
    if (Math.random() < 0.15) {
      checkScratchPercentage();
    }
  };

  const checkScratchPercentage = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imgData.data;
    let transparentCount = 0;

    // Sample every 4th pixel for performance
    for (let i = 0; i < pixels.length; i += 16) {
      if (pixels[i + 3] === 0) {
        transparentCount++;
      }
    }

    const totalSamples = pixels.length / 16;
    const percent = (transparentCount / totalSamples) * 100;
    setProgress(Math.min(100, Math.round(percent)));

    if (percent > 55) {
      setIsScratched(true);
      triggerConfetti();
    }
  };

  const triggerConfetti = () => {
    const colors = ["#f59e0b", "#fbbf24", "#ffffff", "#a855f7", "#22d3ee"];
    const newConfetti = Array.from({ length: 45 }).map((_, i) => ({
      id: i,
      x: 160 + (Math.random() - 0.5) * 60,
      y: 100 + (Math.random() - 0.5) * 40,
      color: colors[Math.floor(Math.random() * colors.length)],
      size: Math.random() * 5 + 3,
      vy: -(Math.random() * 4 + 3),
      vx: (Math.random() - 0.5) * 6,
    }));
    setConfetti(newConfetti);
  };

  // Animate Confetti
  useEffect(() => {
    if (confetti.length === 0) return;
    let frameId: number;

    const updateConfetti = () => {
      setConfetti((prev) =>
        prev
          .map((c) => ({
            ...c,
            x: c.x + c.vx,
            y: c.y + c.vy,
            vy: c.vy + 0.12, // Faint gravity
          }))
          .filter((c) => c.y < 350) // Remove out of view
      );
      frameId = requestAnimationFrame(updateConfetti);
    };

    frameId = requestAnimationFrame(updateConfetti);
    return () => cancelAnimationFrame(frameId);
  }, [confetti]);

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-md mx-auto" id="scratch-card-container">
      {/* Control Switch */}
      <div className="flex bg-zinc-950/80 p-1.5 rounded-full border border-white/5 gap-2 w-fit">
        <button
          onClick={() => setIsLocked(false)}
          className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider transition-all duration-300 ${
            !isLocked
              ? "bg-gradient-to-r from-neon-purple to-neon-indigo text-white shadow-md shadow-neon-purple/20"
              : "text-zinc-400 hover:text-zinc-100"
          }`}
          id="btn-scratch-card-unlocked"
        >
          <Unlock size={13} />
          UNLOCKED PREVIEW
        </button>
        <button
          onClick={() => setIsLocked(true)}
          className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider transition-all duration-300 ${
            isLocked
              ? "bg-zinc-800 text-zinc-100 border border-zinc-700"
              : "text-zinc-400 hover:text-zinc-100"
          }`}
          id="btn-scratch-card-locked"
        >
          <Lock size={13} />
          LOCKED STATE
        </button>
      </div>

      {/* Realistic Card Mockup */}
      <div
        ref={containerRef}
        className="relative w-full h-[200px] rounded-2xl overflow-hidden glass-panel border border-white/10 select-none shadow-2xl"
        style={{
          boxShadow: isScratched
            ? "0 25px 50px -12px rgba(245, 158, 11, 0.25), 0 0 40px rgba(168, 85, 247, 0.15)"
            : "0 20px 40px -15px rgba(0, 0, 0, 0.7)",
        }}
      >
        {/* UNDERLAY: Golden Graduation Title Banner */}
        <div className="absolute inset-0 bg-gradient-to-br from-zinc-950 via-purple-950/30 to-amber-950/40 flex flex-col items-center justify-center p-6 text-center select-none">
          {/* Subtle gold grid overlay */}
          <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#f59e0b_1px,transparent_1px),linear-gradient(to_bottom,#f59e0b_1px,transparent_1px)] bg-[size:30px_30px]" />
          
          <div className="relative z-10 flex flex-col items-center animate-fade-in duration-700">
            <div className="flex items-center justify-center bg-amber-500/10 p-2.5 rounded-full border border-amber-500/30 mb-2.5 shadow-lg shadow-amber-500/10">
              <Sparkles className="text-amber-400 w-5 h-5 animate-pulse" />
            </div>
            <span className="text-[10px] tracking-[0.25em] text-amber-500/70 font-semibold uppercase mb-1 font-display">
              ACADEMIC DEGREE EARNED
            </span>
            <h3 className="text-2xl font-bold font-display tracking-wide bg-gradient-to-r from-amber-200 via-amber-400 to-yellow-200 text-gradient gold-glow mb-1">
              Congratulations, S.Kom 🎓
            </h3>
            <p className="text-[11px] text-zinc-400 max-w-[280px] font-sans">
              Bachelor of Computer Science • Informatics Class of 2022
            </p>
          </div>
        </div>

        {/* LOCKED STATE COVER: Faded blur barrier with instruction */}
        {isLocked && (
          <div className="absolute inset-0 bg-void/90 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center z-30 border border-red-500/20">
            <div className="bg-red-500/10 p-3 rounded-full border border-red-500/20 mb-3 text-red-400 animate-pulse">
              <Lock size={20} />
            </div>
            <h4 className="text-sm font-semibold tracking-wider text-zinc-100 font-display">
              CARD COVER LOCKED
            </h4>
            <p className="text-[11px] text-zinc-400 max-w-[260px] mt-1.5">
              Fulfill Seminar Results & Thesis Defense to unlock your digital graduation title.
            </p>
          </div>
        )}

        {/* CANVAS OVERLAY: Interactive Scratch Surface */}
        {!isLocked && (
          <canvas
            ref={canvasRef}
            onMouseDown={() => setIsDrawing(true)}
            onMouseMove={draw}
            onMouseUp={() => setIsDrawing(false)}
            onMouseLeave={() => setIsDrawing(false)}
            onTouchStart={() => setIsDrawing(true)}
            onTouchMove={draw}
            onTouchEnd={() => setIsDrawing(false)}
            className={`absolute inset-0 z-20 w-full h-full cursor-crosshair transition-opacity duration-700 ${
              isScratched ? "opacity-0 pointer-events-none" : "opacity-100"
            }`}
          />
        )}

        {/* Confetti Particles layer */}
        {confetti.map((c) => (
          <div
            key={c.id}
            className="absolute z-25 rounded-full pointer-events-none"
            style={{
              left: c.x,
              top: c.y,
              width: c.size,
              height: c.size,
              backgroundColor: c.color,
              boxShadow: `0 0 10px ${c.color}`,
            }}
          />
        ))}
      </div>

      {/* Progress & Reset Actions */}
      {!isLocked && (
        <div className="flex items-center justify-between w-full px-2 text-xs font-semibold tracking-wider">
          <div className="text-zinc-400 flex items-center gap-1.5">
            <span>SCRATCH PROGRESS:</span>
            <span className={isScratched ? "text-amber-400 font-bold" : "text-neon-cyan font-mono"}>
              {isScratched ? "100% COMPLETED!" : `${progress}%`}
            </span>
          </div>

          {(isScratched || progress > 0) && (
            <button
              onClick={initCanvas}
              className="flex items-center gap-1 text-zinc-400 hover:text-neon-cyan transition-colors"
              id="btn-scratch-card-reset"
            >
              <RefreshCw size={12} className="animate-hover" />
              RESET
            </button>
          )}
        </div>
      )}
    </div>
  );
}
