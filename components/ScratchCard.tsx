"use client";

import { useEffect, useRef, useState } from "react";
import { Sparkles, Lock, Unlock, RefreshCw, Maximize2, Minimize2 } from "lucide-react";

interface ScratchCardProps {
  studentName?: string;
  isLockedInitially?: boolean;
}

export default function ScratchCard({ studentName = "MAHASISWA", isLockedInitially = false }: ScratchCardProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isScratched, setIsScratched] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isLocked, setIsLocked] = useState(isLockedInitially);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [confetti, setConfetti] = useState<{ id: number; x: number; y: number; color: string; size: number; vy: number; vx: number }[]>([]);

  // Sync state with props
  useEffect(() => {
    setIsLocked(isLockedInitially);
  }, [isLockedInitially]);

  // Handle dynamic canvas re-draw when full screen toggles
  useEffect(() => {
    const timer = setTimeout(() => {
      initCanvas();
    }, 150);
    return () => clearTimeout(timer);
  }, [isFullscreen]);

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

    const width = canvas.width = containerRef.current?.clientWidth || (isFullscreen ? 580 : 320);
    const height = canvas.height = containerRef.current?.clientHeight || (isFullscreen ? 320 : 200);

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
    ctx.font = isFullscreen 
      ? "bold 26px 'Outfit', sans-serif" 
      : "bold 15px 'Outfit', sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("INFORMATICS CLASS OF 2022", width / 2, isFullscreen ? height / 2 - 30 : height / 2 - 15);

    ctx.fillStyle = "rgba(255, 255, 255, 0.6)";
    ctx.font = isFullscreen 
      ? "18px 'Plus Jakarta Sans', sans-serif" 
      : "12px 'Plus Jakarta Sans', sans-serif";
    ctx.fillText("SCRATCH TO REVEAL TITLE", width / 2, isFullscreen ? height / 2 + 15 : height / 2 + 10);

    // Draw Lock Icon
    ctx.fillStyle = "rgba(34, 211, 238, 0.8)";
    ctx.font = isFullscreen ? "28px serif" : "18px serif";
    ctx.fillText("🔒", width / 2, isFullscreen ? height / 2 + 55 : height / 2 + 35);
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
    ctx.arc(x, y, isFullscreen ? 38 : 22, 0, Math.PI * 2);
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
    const width = containerRef.current?.clientWidth || 320;
    const height = containerRef.current?.clientHeight || 200;

    const newConfetti = Array.from({ length: 45 }).map((_, i) => ({
      id: i,
      x: width / 2 + (Math.random() - 0.5) * 60,
      y: height / 2 + (Math.random() - 0.5) * 40,
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
          .filter((c) => c.y < 450) // Remove out of view
      );
      frameId = requestAnimationFrame(updateConfetti);
    };

    frameId = requestAnimationFrame(updateConfetti);
    return () => cancelAnimationFrame(frameId);
  }, [confetti]);

  return (
    <div className={isFullscreen
      ? "fixed inset-0 z-50 flex flex-col items-center justify-center bg-void/95 backdrop-blur-3xl p-6 text-zinc-100 animate-fade-in"
      : "flex flex-col items-center gap-6 w-full max-w-md mx-auto"
    } id="scratch-card-container">

      {/* Immersive Background components inside fullscreen */}
      {isFullscreen && (
        <>
          <div className="absolute top-1/4 left-1/4 w-[45vw] h-[45vw] rounded-full bg-neon-purple/10 blur-[120px] pointer-events-none -z-10" />
          <div className="absolute bottom-1/4 right-1/4 w-[40vw] h-[40vw] rounded-full bg-neon-blue/10 blur-[100px] pointer-events-none -z-10" />

          <div className="relative z-10 mb-6 text-center space-y-2 max-w-md">
            <span className="text-[10px] tracking-[0.25em] text-neon-cyan font-bold uppercase font-display block">
              IMMERSIVE YEARBOOK MODE
            </span>
            <h2 className="text-xl md:text-2xl font-bold font-display text-white tracking-wide">
              Degree title reveal for {studentName}
            </h2>
          </div>
        </>
      )}

      {/* Control Switch (Only in normal view) */}
      {!isFullscreen && (
        <div className="flex bg-zinc-950/80 p-1.5 rounded-full border border-white/5 gap-2 w-fit">
          <button
            onClick={() => setIsLocked(false)}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider transition-all duration-300 ${!isLocked
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
            className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider transition-all duration-300 ${isLocked
                ? "bg-zinc-800 text-zinc-100 border border-zinc-700"
                : "text-zinc-400 hover:text-zinc-100"
              }`}
            id="btn-scratch-card-locked"
          >
            <Lock size={13} />
            LOCKED STATE
          </button>
        </div>
      )}

      {/* Realistic Card Mockup */}
      <div
        ref={containerRef}
        className={`relative w-full rounded-2xl overflow-hidden glass-panel border border-white/10 select-none shadow-2xl transition-all duration-500 ${isFullscreen
            ? "max-w-2xl h-[300px] md:h-[350px] rounded-3xl"
            : "h-[200px]"
          }`}
        style={{
          boxShadow: isScratched
            ? "0 25px 50px -12px rgba(245, 158, 11, 0.25), 0 0 40px rgba(168, 85, 247, 0.15)"
            : "0 20px 40px -15px rgba(0, 0, 0, 0.7)",
        }}
      >
        {/* UNDERLAY: Golden Graduation Title Banner */}
        <div className={`absolute inset-0 bg-gradient-to-br from-zinc-950 via-purple-950/30 to-amber-950/40 flex flex-col items-center justify-center text-center select-none ${
          isFullscreen ? "p-10 md:p-12" : "p-6"
        }`}>
          {/* Subtle gold grid overlay */}
          <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#f59e0b_1px,transparent_1px),linear-gradient(to_bottom,#f59e0b_1px,transparent_1px)] bg-[size:30px_30px]" />

          <div className="relative z-10 flex flex-col items-center animate-fade-in duration-700">
            <div className={`flex items-center justify-center bg-amber-500/10 rounded-full border border-amber-500/30 shadow-lg shadow-amber-500/10 ${
              isFullscreen ? "p-4 mb-4" : "p-2.5 mb-2.5"
            }`}>
              <Sparkles className={`text-amber-400 animate-pulse ${
                isFullscreen ? "w-8 h-8" : "w-5 h-5"
              }`} />
            </div>
            <span className={`font-semibold uppercase font-display ${
              isFullscreen 
                ? "text-xs md:text-sm tracking-[0.35em] text-amber-400 mb-2" 
                : "text-[10px] tracking-[0.25em] text-amber-500/70 mb-1"
            }`}>
              ACADEMIC DEGREE EARNED
            </span>
            <h3 className={`font-bold font-display tracking-wide bg-gradient-to-r from-amber-200 via-amber-400 to-yellow-200 text-gradient gold-glow ${
              isFullscreen 
                ? "text-2xl md:text-4xl lg:text-5xl mb-3" 
                : "text-lg md:text-xl mb-1"
            }`}>
              {studentName}, S.Kom 🎓
            </h3>
            <p className={`text-zinc-400 font-sans ${
              isFullscreen 
                ? "text-sm md:text-base max-w-[480px] mt-1.5" 
                : "text-[11px] max-w-[280px]"
            }`}>
              Bachelor of Computer Science • Informatics Class of 2022
            </p>
          </div>
        </div>

        {/* LOCKED STATE COVER: Faded blur barrier with instruction */}
        {isLocked && (
          <div className={`absolute inset-0 bg-void/90 backdrop-blur-md flex flex-col items-center justify-center text-center z-30 border border-red-500/20 ${
            isFullscreen ? "p-10" : "p-6"
          }`}>
            <div className={`bg-red-500/10 rounded-full border border-red-500/20 text-red-400 animate-pulse ${
              isFullscreen ? "p-5 mb-5" : "p-3 mb-3"
            }`}>
              <Lock size={isFullscreen ? 32 : 20} />
            </div>
            <h4 className={`font-semibold tracking-wider text-zinc-100 font-display ${
              isFullscreen ? "text-lg md:text-xl" : "text-sm"
            }`}>
              CARD COVER LOCKED
            </h4>
            <p className={`text-zinc-400 mt-1.5 ${
              isFullscreen 
                ? "text-xs md:text-sm max-w-[360px]" 
                : "text-[11px] max-w-[260px]"
            }`}>
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
            className={`absolute inset-0 z-20 w-full h-full cursor-crosshair transition-opacity duration-700 ${isScratched ? "opacity-0 pointer-events-none" : "opacity-100"
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
        <div className="flex items-center justify-between w-full px-2 text-xs font-semibold tracking-wider relative z-10">
          <div className="text-zinc-400 flex items-center gap-1.5">
            <span>SCRATCH PROGRESS:</span>
            <span className={isScratched ? "text-amber-400 font-bold" : "text-neon-cyan font-mono"}>
              {isScratched ? "100% COMPLETED!" : `${progress}%`}
            </span>
          </div>

          <div className="flex items-center gap-4">
            {(isScratched || progress > 0) && (
              <button
                onClick={initCanvas}
                className="flex items-center gap-1 text-zinc-400 hover:text-neon-cyan transition-colors"
                id="btn-scratch-card-reset"
              >
                <RefreshCw size={12} />
                RESET
              </button>
            )}

            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="flex items-center gap-1 text-zinc-400 hover:text-neon-cyan transition-colors font-semibold"
              id="btn-scratch-card-fullscreen"
            >
              {isFullscreen ? <Minimize2 size={12} className="text-neon-purple" /> : <Maximize2 size={12} className="text-neon-cyan" />}
              {isFullscreen ? "EXIT" : "FULLSCREEN"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
