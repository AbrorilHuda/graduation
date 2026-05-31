"use client";

import { useState } from "react";
import {
  Award,
  Search,
  Plus,
  Lock,
  Sparkles
} from "lucide-react";
import ParticleBackground from "@/components/ParticleBackground";
import ScratchCard from "@/components/ScratchCard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// Student Directory Mock Data
interface Student {
  nim: string;
  name: string;
  specialization: "Business Intelligence" | "Smart Agriculture";
  status: "Graduated" | "Defense Completed" | "Seminar Completed";
  title: string;
  quote: string;
  image: string;
  theme: string;
  glowClass: string;
  badgeClass: string;
  milestones: {
    proposal: boolean;
    seminar: boolean;
    defense: boolean;
    graduation: boolean;
  };
}

const graduatesData: Student[] = [
  {
    nim: "220101014",
    name: "Clara Dian Paramitha",
    specialization: "Business Intelligence",
    status: "Graduated",
    title: "S.Kom.",
    quote: "Analyzing data taught me how to find truth; four years of friendship taught me how to find joy.",
    image: "/images/student_1.png",
    theme: "from-purple-500 via-pink-500 to-indigo-600",
    glowClass: "glow-hover-gold",
    badgeClass: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    milestones: { proposal: true, seminar: true, defense: true, graduation: true }
  },
  {
    nim: "220101032",
    name: "Fahri Hamzah",
    specialization: "Smart Agriculture",
    status: "Defense Completed",
    title: "S.Kom. (Cand.)",
    quote: "Code that irrigation micro-sensor right, and you feed a village. We made every single loop count.",
    image: "/images/student_2.png",
    theme: "from-cyan-500 via-blue-500 to-indigo-600",
    glowClass: "glow-hover-blue",
    badgeClass: "bg-neon-blue/10 text-neon-blue border-neon-blue/20",
    milestones: { proposal: true, seminar: true, defense: true, graduation: false }
  },
  {
    nim: "220101048",
    name: "Gita Lestari",
    specialization: "Business Intelligence",
    status: "Seminar Completed",
    title: "S.Kom. (Cand.)",
    quote: "Behind every intelligence report is a testament of our collaborative lab nights.",
    image: "/images/student_3.png",
    theme: "from-fuchsia-500 to-pink-600",
    glowClass: "glow-hover-purple",
    badgeClass: "bg-neon-purple/10 text-neon-purple border-neon-purple/20",
    milestones: { proposal: true, seminar: true, defense: false, graduation: false }
  },
  {
    nim: "220101089",
    name: "Kevin Wijaya",
    specialization: "Smart Agriculture",
    status: "Graduated",
    title: "S.Kom.",
    quote: "From soil monitoring IoT nodes to the graduation stage, our growth was beautiful.",
    image: "/images/student_4.png",
    theme: "from-emerald-500 via-teal-500 to-cyan-500",
    glowClass: "glow-hover-gold",
    badgeClass: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    milestones: { proposal: true, seminar: true, defense: true, graduation: true }
  }
];

export default function DirectoryPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<"All" | "Business Intelligence" | "Smart Agriculture">("All");
  const [activeStatus, setActiveStatus] = useState<"All" | "Seminar Completed" | "Defense Completed" | "Graduated">("All");
  const [claimStatus, setClaimStatus] = useState(false);

  // Multi-dimensional Filter Directory Logic
  const filteredGraduates = graduatesData.filter((grad) => {
    const matchesSearch =
      grad.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      grad.nim.includes(searchQuery);

    const matchesFilter = activeFilter === "All" || grad.specialization === activeFilter;
    const matchesStatus = activeStatus === "All" || grad.status === activeStatus;

    return matchesSearch && matchesFilter && matchesStatus;
  });

  return (
    <div className="flex flex-col min-h-screen bg-void font-sans select-none overflow-x-hidden text-zinc-100">
      <Navbar />

      <header className="relative min-h-[45vh] flex items-center justify-center pt-32 pb-16 px-4 overflow-hidden cyber-grid">
        <ParticleBackground />

        <div className="absolute top-1/4 left-1/3 w-[35vw] h-[35vw] max-w-[350px] rounded-full bg-neon-purple/10 blur-[100px] -z-10 animate-float-slow" />
        <div className="absolute bottom-1/4 right-1/4 w-[30vw] h-[30vw] max-w-[300px] rounded-full bg-neon-blue/10 blur-[80px] -z-10 animate-float-medium" />

        <div className="relative z-10 max-w-4xl mx-auto text-center flex flex-col items-center">
          {/* Tagline Badge */}
          <div className="inline-flex items-center gap-1.5 bg-zinc-950/80 px-3.5 py-1.5 rounded-full border border-white/5 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-neon-cyan shadow-sm shadow-neon-cyan animate-pulse" />
            <span className="text-[10px] tracking-[0.25em] text-zinc-300 font-extrabold uppercase font-display">
              GRADUATES REGISTER
            </span>
          </div>

          {/* Large Title */}
          <h1 className="text-5xl sm:text-7xl font-display font-extrabold tracking-tight text-white leading-none">
            The Graduates
          </h1>

          {/* Subtitle */}
          <p className="max-w-2xl text-sm sm:text-base leading-relaxed text-zinc-400 mt-4 font-sans">
            Explore the students, memories, and academic journeys of Informatics 2022.
          </p>
        </div>
      </header>

      {/*SEARCH & FILTER */}
      <section className="relative py-8 px-4 max-w-7xl mx-auto w-full z-20">
        <div className="p-6 rounded-2xl glass-panel border border-white/10 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-6 shadow-2xl">
          {/* Search Input */}
          <div className="relative flex-1 max-w-full lg:max-w-md">
            <input
              type="text"
              placeholder="Search graduates by name or NIM..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-zinc-950/80 text-sm text-zinc-200 pl-11 pr-4 py-3 rounded-xl border border-white/5 focus:border-neon-cyan/40 focus:outline-none transition-all focus:ring-1 focus:ring-neon-cyan/20 focus:shadow-[0_0_20px_rgba(34,211,238,0.15)]"
            />
            <Search size={16} className="absolute left-4 top-4 text-zinc-500" />
          </div>

          {/* Filters Container */}
          <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-6">
            {/* Specialization Filter */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] text-zinc-500 tracking-wider uppercase font-bold mr-1">
                Specialization:
              </span>
              {["All", "Business Intelligence", "Smart Agriculture"].map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter as any)}
                  className={`px-3.5 py-2 rounded-xl text-[10px] font-bold tracking-wider uppercase transition-all duration-300 border ${activeFilter === filter
                    ? "bg-zinc-800 text-neon-cyan border-neon-cyan/40 shadow-[0_0_12px_rgba(34,211,238,0.2)]"
                    : "text-zinc-400 hover:text-zinc-200 border-white/5 hover:border-white/15"
                    }`}
                >
                  {filter === "All" ? "All Tracks" : filter}
                </button>
              ))}
            </div>

            {/* Status Filter */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] text-zinc-500 tracking-wider uppercase font-bold mr-1">
                Status:
              </span>
              {[
                { name: "All Statuses", value: "All" },
                { name: "Seminar Results", value: "Seminar Completed" },
                { name: "SemHas", value: "SemHas Completed" },
                { name: "Graduated", value: "Graduated" }
              ].map((status) => (
                <button
                  key={status.value}
                  onClick={() => setActiveStatus(status.value as any)}
                  className={`px-3.5 py-2 rounded-xl text-[10px] font-bold tracking-wider uppercase transition-all duration-300 border ${activeStatus === status.value
                    ? status.value === "Graduated"
                      ? "bg-zinc-800 text-amber-400 border-amber-500/40 shadow-[0_0_12px_rgba(245,158,11,0.2)]"
                      : status.value === "Defense Completed"
                        ? "bg-zinc-800 text-neon-blue border-neon-blue/40 shadow-[0_0_12px_rgba(6,182,212,0.2)]"
                        : "bg-zinc-800 text-neon-purple border-neon-purple/40 shadow-[0_0_12px_rgba(168,85,247,0.2)]"
                    : "text-zinc-400 hover:text-zinc-200 border-white/5 hover:border-white/15"
                    }`}
                >
                  {status.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 px-4 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8" id="student-directory-grid">
          {filteredGraduates.map((grad) => (
            <div
              key={grad.nim}
              className={`group relative p-6 rounded-2xl glass-panel flex flex-col justify-between min-h-[500px] border border-white/5 overflow-hidden ${grad.glowClass}`}
            >
              <div>
                {/* Header with NIM and Status Progress Badge */}
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-zinc-500 font-semibold">NIM • {grad.nim}</span>
                  <span className={`text-[8px] font-display font-extrabold tracking-wider uppercase px-2.5 py-1 rounded-full border ${grad.badgeClass}`}>
                    {grad.status}
                  </span>
                </div>

                {/* Profile Photo with image zoom and layout */}
                <div className="my-6 relative aspect-[4/3] rounded-xl overflow-hidden border border-white/5 bg-void/50">
                  <img
                    src={grad.image}
                    alt={grad.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent opacity-85" />
                  <span className="absolute bottom-3 left-3 bg-zinc-950/90 text-zinc-300 text-[8px] font-bold tracking-widest uppercase border border-white/10 px-2 py-0.5 rounded-md">
                    {grad.specialization}
                  </span>
                </div>

                {/* Full Name & Title */}
                <h3 className="text-lg font-bold font-display text-white tracking-wide group-hover:text-neon-cyan transition-colors">
                  {grad.name}, {grad.status === "Graduated" ? grad.title : "S.Kom. (Cand.)"}
                </h3>

                {/* Quote */}
                <p className="text-xs text-zinc-400 mt-3.5 leading-relaxed italic border-l-2 border-neon-purple/30 pl-3">
                  "{grad.quote}"
                </p>
              </div>

              {/* Progress Checklist / Milestones */}
              <div className="mt-6 pt-5 border-t border-white/5">
                <span className="text-[8px] tracking-[0.25em] text-zinc-500 font-bold uppercase font-display block mb-3">
                  GRADUATION PROGRESS
                </span>
                <div className="grid grid-cols-4 gap-2 text-center text-[10px] font-semibold">
                  <div className="flex flex-col items-center">
                    <span className="text-neon-cyan bg-neon-cyan/5 border border-neon-cyan/20 w-6 h-6 rounded-full flex items-center justify-center text-xs mb-1">✔</span>
                    <span className="text-[9px] text-zinc-400">Proposal</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="text-neon-purple bg-neon-purple/5 border border-neon-purple/20 w-6 h-6 rounded-full flex items-center justify-center text-xs mb-1">✔</span>
                    <span className="text-[9px] text-zinc-400">SemPro</span>
                  </div>
                  <div className="flex flex-col items-center">
                    {grad.milestones.defense ? (
                      <span className="text-neon-blue bg-neon-blue/5 border border-neon-blue/20 w-6 h-6 rounded-full flex items-center justify-center text-xs mb-1">✔</span>
                    ) : (
                      <span className="text-zinc-500 bg-zinc-950 border border-white/5 w-6 h-6 rounded-full flex items-center justify-center text-xs mb-1 animate-pulse">⏳</span>
                    )}
                    <span className="text-[9px] text-zinc-400">SemHas</span>
                  </div>
                  <div className="flex flex-col items-center">
                    {grad.milestones.graduation ? (
                      <span className="text-amber-400 bg-amber-500/5 border border-amber-500/20 w-6 h-6 rounded-full flex items-center justify-center text-xs mb-1 shadow-md shadow-amber-500/10">✔</span>
                    ) : (
                      <span className="text-zinc-600 bg-zinc-950 border border-white/5 w-6 h-6 rounded-full flex items-center justify-center text-xs mb-1">🔒</span>
                    )}
                    <span className="text-[9px] text-zinc-400">Graduated</span>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Claim Profile Empty State Card */}
          <div
            onClick={() => setClaimStatus(true)}
            className="group relative p-8 rounded-2xl border-2 border-dashed border-white/10 hover:border-neon-cyan/40 bg-zinc-950/10 hover:bg-zinc-950/20 cursor-pointer flex flex-col items-center justify-center text-center min-h-[500px] transition-all duration-500"
            id="empty-state-claim-profile"
          >
            <div className="bg-neon-cyan/5 border border-neon-cyan/20 group-hover:border-neon-cyan/50 p-4 rounded-full text-neon-cyan mb-4 transition-all">
              <Plus size={24} className="group-hover:rotate-90 transition-transform duration-500" />
            </div>
            <h3 className="text-xl font-bold font-display text-white tracking-wide">
              Claim Your Graduate Profile
            </h3>
            <p className="text-xs text-zinc-400 mt-2 max-w-xs leading-relaxed">
              Are you a member of the Informatics 2022 cohort? Add your graduation status, thesis system focus, and nostalgic memory to the digital yearbook archive.
            </p>
            {claimStatus && (
              <div className="mt-6 px-4 py-2 rounded-xl bg-neon-cyan/10 border border-neon-cyan/20 text-neon-cyan text-[10px] font-bold tracking-wider animate-pulse">
                REGISTRATION OPEN VIA IT PORTAL
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 6. GRADUATION SCRATCH CARD PREVIEW */}
      <section className="relative py-24 px-4 bg-zinc-950/40 border-t border-b border-white/5" id="scratch-preview">
        <div className="absolute inset-0 bg-gradient-to-b from-void/0 via-neon-purple/5 to-void/0 pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Details Column */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-1 bg-neon-purple/10 border border-neon-purple/20 px-3 py-1 rounded-full text-neon-purple text-[10px] tracking-widest font-extrabold uppercase font-display">
              <Sparkles size={11} className="animate-spin-slow" />
              Interactive Title Reveal
            </div>

            <h2 className="text-3xl md:text-5xl font-display font-extrabold tracking-tight text-white leading-tight">
              Scratch to Reveal Your Degree Title.
            </h2>

            <p className="text-sm text-zinc-400 leading-relaxed font-sans">
              A digital graduation portal exclusive. Informatics students can scratch away the cryptographic metallic overlay of their yearbook card to officially reveal their degree title under the seal of the department board.
            </p>

            <ul className="space-y-3.5 text-xs text-zinc-300">
              <li className="flex items-start gap-2.5">
                <span className="bg-neon-cyan/20 text-neon-cyan p-1 rounded-full text-[10px] font-bold">✔</span>
                <span>Reflects approved Seminar Results and Thesis Defense status.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="bg-neon-cyan/20 text-neon-cyan p-1 rounded-full text-[10px] font-bold">✔</span>
                <span>Unlocks the prestigious "S.Kom." signature and digital graduation card.</span>
              </li>
            </ul>

            <div className="p-4 rounded-xl glass-panel bg-void/50 border border-yellow-500/10 flex items-center gap-3">
              <div className="bg-yellow-500/10 p-2.5 rounded-lg text-yellow-500 border border-yellow-500/20">
                <Lock size={15} />
              </div>
              <p className="text-[11px] text-zinc-400 leading-relaxed">
                <strong className="text-zinc-200 block">Status Constraint Alert:</strong>
                Your title remains securely locked beneath the cryptographic silver barrier until all milestones in your academic checklist are certified.
              </p>
            </div>
          </div>

          {/* Interactive Scratch Card Component */}
          <div className="lg:col-span-6 flex justify-center">
            <ScratchCard />
          </div>
        </div>
      </section>

      {/* 7. FOOTER */}
      <Footer />

    </div>
  );
}
