"use client";

import { useState, useEffect } from "react";
import { ZoomIn, X, Calendar, MapPin, Tag } from "lucide-react";

interface Memory {
  id: string;
  title: string;
  category: string;
  date: string;
  location: string;
  src: string;
  caption: string;
  gridSpan: string;
}

const memories: Memory[] = [
  {
    id: "mem-1",
    title: "Late-Night Debugging Sessions",
    category: "Struggle",
    date: "October 14, 2023",
    location: "Informatics Lab C",
    src: "/images/memory_coding.png",
    caption: "Countless empty cups, heavy eyes, and stacking compiling errors. We survived the grueling practical labs together, one segmentation fault at a time.",
    gridSpan: "md:col-span-2 aspect-[16/9] md:aspect-auto",
  },
  {
    id: "mem-2",
    title: "First Light at Campus",
    category: "Friendship",
    date: "March 22, 2022",
    location: "Academic Square",
    src: "/images/memory_campus.png",
    caption: "Stepping onto the university grounds during our introductory week. A massive, unfamiliar cybercampus that soon became our home away from home.",
    gridSpan: "md:col-span-1 aspect-square md:aspect-auto",
  },
  {
    id: "mem-3",
    title: "Academic Thesis Seminars",
    category: "Academic",
    date: "November 08, 2024",
    location: "Conference Hall II",
    src: "/images/memory_seminar.png",
    caption: "Pitching and defending our complex system research projects in front of evaluation boards. The sweat, the charts, and the immense rush of academic approval.",
    gridSpan: "md:col-span-1 aspect-square md:aspect-auto",
  },
  {
    id: "mem-4",
    title: "We Made It: Graduation Day",
    category: "Graduation",
    date: "May 25, 2025",
    location: "Grand Convocation Dome",
    src: "/images/memory_graduation.png",
    caption: "Mortarboards raised high into the twilight air, tears of triumph in our eyes. The culmination of four years of friendship and digital innovation. S.Kom earned at last!",
    gridSpan: "md:col-span-2 aspect-[16/9] md:aspect-auto",
  },
  {
    id: "mem-5",
    title: "Code-Thon Ideation Sprint",
    category: "Struggle",
    date: "September 03, 2023",
    location: "Department Auditorium",
    src: "/images/memory_coding.png",
    caption: "A 48-hour continuous coding marathon. Speed-programming AI micro-sensors and microgrid load models under extreme pressure.",
    gridSpan: "md:col-span-1 aspect-square md:aspect-auto",
  },
  {
    id: "mem-6",
    title: "After-Hours Lab Debrief",
    category: "Friendship",
    date: "April 11, 2024",
    location: "Campus Lake Side",
    src: "/images/memory_campus.png",
    caption: "Discussing our data structures practical exams after high-stress reviews. Sharing simple coffees and laughing over compiler jokes.",
    gridSpan: "md:col-span-1 aspect-square md:aspect-auto",
  },
  {
    id: "mem-7",
    title: "Pre-Defence Review Drills",
    category: "Academic",
    date: "January 19, 2025",
    location: "Main Informatics Lobby",
    src: "/images/memory_seminar.png",
    caption: "Peer-reviewing our thesis slides. Helping each other structure mathematical formulations and LSTM metrics before the actual board convocation.",
    gridSpan: "md:col-span-1 aspect-square md:aspect-auto",
  },
  {
    id: "mem-8",
    title: "Convocation Reception Walk",
    category: "Graduation",
    date: "May 26, 2025",
    location: "University Grand Lawn",
    src: "/images/memory_graduation.png",
    caption: "Taking the final group photographs with families, holding our degree diplomas proudly under the morning sun. Proud S.Kom graduates.",
    gridSpan: "md:col-span-3 aspect-[21/9] md:h-[280px] md:aspect-auto",
  }
];

export default function MemoryGallery({ limit }: { limit?: number }) {
  const [activeMemory, setActiveMemory] = useState<Memory | null>(null);

  // Close lightbox on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setActiveMemory(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const displayedMemories = limit ? memories.slice(0, limit) : memories;

  return (
    <div className="w-full">
      {/* Asymmetric Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:auto-rows-[280px]" id="memory-grid">
        {displayedMemories.map((m) => (
          <div
            key={m.id}
            onClick={() => setActiveMemory(m)}
            className={`group relative overflow-hidden rounded-2xl glass-panel border border-white/5 cursor-zoom-in transition-all duration-500 hover:border-neon-purple/40 ${m.gridSpan}`}
            style={{
              boxShadow: "0 4px 30px rgba(0, 0, 0, 0.4)",
            }}
          >
            {/* Dark gradient overlay bottom */}
            <div className="absolute inset-0 bg-gradient-to-t from-void via-void/40 to-transparent z-10 opacity-80 group-hover:opacity-90 transition-opacity duration-300" />
            
            {/* Visual Indicators */}
            <div className="absolute top-4 right-4 z-20 bg-void/80 backdrop-blur-md p-2 rounded-full border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <ZoomIn size={16} className="text-neon-cyan" />
            </div>
 
            {/* Photo background */}
            <img
              src={m.src}
              alt={m.title}
              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              loading="lazy"
            />
 
            {/* Text Overlay */}
            <div className="absolute bottom-0 inset-x-0 p-5 md:p-6 z-20 flex flex-col justify-end translate-y-1 group-hover:translate-y-0 transition-transform duration-300">
              <div className="flex items-center gap-2 mb-2">
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold tracking-wider font-display uppercase border ${
                  m.category === "Struggle" ? "bg-red-500/10 text-red-400 border-red-500/20" :
                  m.category === "Friendship" ? "bg-neon-cyan/10 text-neon-cyan border-neon-cyan/20" :
                  m.category === "Academic" ? "bg-neon-purple/10 text-neon-purple border-neon-purple/20" :
                  "bg-amber-500/10 text-amber-400 border-amber-500/20"
                }`}>
                  {m.category}
                </span>
                <span className="text-[10px] text-zinc-400 flex items-center gap-1">
                  <Calendar size={10} />
                  {m.date}
                </span>
              </div>
              <h3 className="text-lg font-bold font-display text-white tracking-wide group-hover:text-neon-cyan transition-colors">
                {m.title}
              </h3>
              <p className="text-xs text-zinc-400 mt-1 line-clamp-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                {m.caption}
              </p>
            </div>
          </div>
        ))}
      </div>
 
      {/* Cinematic Modal Lightbox Overlay */}
      {activeMemory && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-void/90 backdrop-blur-xl animate-fade-in"
          onClick={() => setActiveMemory(null)}
          id="memory-lightbox-overlay"
        >
          {/* Modal Container */}
          <div
            className="relative w-full max-w-4xl rounded-3xl overflow-hidden glass-panel border border-white/10 flex flex-col md:flex-row shadow-2xl animate-scale-up"
            style={{
              boxShadow: "0 0 50px rgba(168, 85, 247, 0.15)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setActiveMemory(null)}
              className="absolute top-4 right-4 z-40 bg-void/80 hover:bg-zinc-900 border border-white/10 p-2.5 rounded-full text-zinc-300 hover:text-white transition-colors shadow-lg"
              aria-label="Close dialog"
              id="btn-lightbox-close"
            >
              <X size={16} />
            </button>
 
            {/* Left side: Cinematic Photo */}
            <div className="relative w-full md:w-3/5 aspect-video md:aspect-auto md:min-h-[460px]">
              <img
                src={activeMemory.src}
                alt={activeMemory.title}
                className="w-full h-full object-cover"
              />
              {/* Vertical soft black card edge overlay */}
              <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-void to-transparent hidden md:block" />
            </div>
 
            {/* Right side: Detailed captions */}
            <div className="w-full md:w-2/5 p-6 md:p-8 flex flex-col justify-between bg-void/90">
              <div className="space-y-6">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold tracking-wider font-display uppercase border ${
                      activeMemory.category === "Struggle" ? "bg-red-500/10 text-red-400 border-red-500/20" :
                      activeMemory.category === "Friendship" ? "bg-neon-cyan/10 text-neon-cyan border-neon-cyan/20" :
                      activeMemory.category === "Academic" ? "bg-neon-purple/10 text-neon-purple border-neon-purple/20" :
                      "bg-amber-500/10 text-amber-400 border-amber-500/20"
                    }`}>
                      {activeMemory.category}
                    </span>
                  </div>
                  <h2 className="text-xl md:text-2xl font-bold font-display text-white tracking-wide leading-tight">
                    {activeMemory.title}
                  </h2>
                </div>
 
                <p className="text-sm text-zinc-300 leading-relaxed font-sans">
                  {activeMemory.caption}
                </p>
 
                <div className="border-t border-white/5 pt-5 space-y-3 text-xs text-zinc-400">
                  <div className="flex items-center gap-2.5">
                    <Calendar size={14} className="text-neon-purple" />
                    <span>Captured on: <strong className="text-zinc-200">{activeMemory.date}</strong></span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <MapPin size={14} className="text-neon-cyan" />
                    <span>Location: <strong className="text-zinc-200">{activeMemory.location}</strong></span>
                  </div>
                </div>
              </div>
 
              <div className="border-t border-white/5 pt-6 mt-6 md:mt-0 flex items-center justify-between text-[11px] text-zinc-500">
                <span>INFORMATICS CLASS OF 2022</span>
                <span className="flex items-center gap-1">
                  <Tag size={10} />
                  MEMORIAL ARCHIVE
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
