"use client";

import { useEffect, useState } from "react";
import {
  Award,
  Search,
  Plus,
  Lock,
  Sparkles
} from "lucide-react";
import ParticleBackground from "@/components/ParticleBackground";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Student, fetchAllStudents } from "@/lib/db";
import Link from "next/link";

export default function DirectoryPage() {
  const [graduates, setGraduates] = useState<Student[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<"All" | "Business Intelligence" | "Smart Agriculture">("All");
  const [activeStatus, setActiveStatus] = useState<"All" | "Seminar Completed" | "Defense Completed" | "Graduated" | "Thesis In Progress">("All");
  const [claimStatus, setClaimStatus] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Load graduates dynamically from Supabase
  useEffect(() => {
    fetchAllStudents().then((data) => {
      setGraduates(data);
      setIsLoading(false);
    });
  }, []);

  // Multi-dimensional Filter Directory Logic
  const filteredGraduates = graduates.filter((grad) => {
    const matchesSearch =
      grad.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      grad.nim.includes(searchQuery);

    const matchesFilter = activeFilter === "All" || grad.specialization === activeFilter;
    const matchesStatus = activeStatus === "All" || grad.status === activeStatus;

    return matchesSearch && matchesFilter && matchesStatus;
  });

  return (
    <div className="flex flex-col min-h-screen bg-void font-sans select-none overflow-x-hidden text-zinc-100">

      {/* 1. STICKY NAVBAR */}
      <Navbar />

      {/* 2. THE GRADUATES HERO BANNER (Compact) */}
      <header className="relative min-h-[45vh] flex items-center justify-center pt-32 pb-16 px-4 overflow-hidden cyber-grid">
        <ParticleBackground />

        {/* Glow Spheres */}
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

      {/* 3. SEARCH & FILTER COMMAND STATION */}
      <section className="relative py-12 px-4 max-w-7xl mx-auto w-full z-20 space-y-8">

        {/* Large, Futuristic Search Box */}
        <div className="glass-panel border border-white/10 p-2 rounded-2xl shadow-2xl relative">
          <div className="absolute inset-0 bg-gradient-to-r from-neon-purple/5 to-neon-cyan/5 rounded-2xl pointer-events-none" />
          <div className="relative flex items-center">
            <Search size={20} className="absolute left-6 text-zinc-400 animate-pulse shrink-0" />
            <input
              type="text"
              placeholder="Search classmates by name, credentials, or NIM (e.g. clara, 220101)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-zinc-950/40 text-base text-zinc-200 pl-16 pr-6 py-4 rounded-xl border-none focus:outline-none transition-all focus:ring-0 placeholder:text-zinc-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-4 text-xs font-bold tracking-widest text-zinc-500 hover:text-neon-cyan uppercase px-3 py-1.5 rounded-lg bg-zinc-950/60 border border-white/5 hover:border-neon-cyan/20 transition-all font-display shrink-0"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Filter Command Bar */}
        <div className="glass-panel border border-white/10 p-6 md:p-8 rounded-3xl shadow-2xl flex flex-col md:flex-row items-stretch md:items-center justify-between gap-8 relative overflow-hidden bg-gradient-to-b from-zinc-950/60 to-zinc-950/20">

          <div className="absolute top-0 left-0 w-24 h-[1px] bg-gradient-to-r from-neon-purple to-transparent" />
          <div className="absolute bottom-0 right-0 w-24 h-[1px] bg-gradient-to-l from-neon-cyan to-transparent" />

          {/* Group 1: Specialization Selection */}
          <div className="space-y-3 flex-1">
            <span className="text-[10px] text-zinc-400 tracking-[0.2em] uppercase font-extrabold font-display block">
              Specialization Focus Tracks
            </span>
            <div className="flex flex-wrap gap-2.5">
              {["All", "Business Intelligence", "Smart Agriculture"].map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter as any)}
                  className={`px-4 py-2.5 rounded-xl text-[10px] font-extrabold tracking-widest uppercase transition-all duration-300 border font-display cursor-pointer ${activeFilter === filter
                    ? "bg-zinc-800 text-neon-cyan border-neon-cyan/40 shadow-[0_0_15px_rgba(34,211,238,0.2)] scale-102"
                    : "text-zinc-400 hover:text-zinc-200 border-white/5 hover:border-white/15"
                    }`}
                >
                  {filter === "All" ? "All Tracks" : filter}
                </button>
              ))}
            </div>
          </div>

          {/* Spacer divider for Desktop */}
          <div className="hidden md:block self-stretch w-[1px] bg-white/5" />

          {/* Group 2: Graduation Milestone Statuses */}
          <div className="space-y-3 flex-1 md:pl-6">
            <span className="text-[10px] text-zinc-400 tracking-[0.2em] uppercase font-extrabold font-display block">
              Graduation Certification Statuses
            </span>
            <div className="flex flex-wrap gap-2.5">
              {[
                { name: "All Statuses", value: "All" },
                { name: "In Progress", value: "Thesis In Progress" },
                { name: "Seminar Results", value: "Seminar Completed" },
                { name: "Defense", value: "Defense Completed" },
                { name: "Graduated", value: "Graduated" }
              ].map((status) => (
                <button
                  key={status.value}
                  onClick={() => setActiveStatus(status.value as any)}
                  className={`px-4 py-2.5 rounded-xl text-[10px] font-extrabold tracking-widest uppercase transition-all duration-300 border font-display cursor-pointer ${activeStatus === status.value
                    ? status.value === "Graduated"
                      ? "bg-zinc-800 text-amber-400 border-amber-500/40 shadow-[0_0_15px_rgba(245,158,11,0.2)] scale-102"
                      : status.value === "Defense Completed"
                        ? "bg-zinc-800 text-neon-blue border-neon-blue/40 shadow-[0_0_15px_rgba(6,182,212,0.2)] scale-102"
                        : status.value === "Seminar Completed"
                          ? "bg-zinc-800 text-neon-purple border-neon-purple/40 shadow-[0_0_15px_rgba(168,85,247,0.2)] scale-102"
                          : "bg-zinc-800 text-neon-cyan border-neon-cyan/40 shadow-[0_0_15px_rgba(34,211,238,0.2)] scale-102"
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

      {/* 5. GRADUATES REGISTRY GRID */}
      <section className="py-12 px-4 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8" id="student-directory-grid">
          {isLoading
            ? // Loading skeleton cards
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="relative p-6 rounded-2xl glass-panel flex flex-col justify-between min-h-[500px] border border-white/5 overflow-hidden animate-pulse">
                <div className="flex justify-between">
                  <div className="h-3 w-24 bg-zinc-800 rounded" />
                  <div className="h-3 w-20 bg-zinc-800 rounded" />
                </div>
                <div className="my-6 aspect-[4/3] rounded-xl bg-zinc-800/60" />
                <div className="space-y-2">
                  <div className="h-4 w-3/4 bg-zinc-800 rounded" />
                  <div className="h-3 w-full bg-zinc-800 rounded" />
                  <div className="h-3 w-4/5 bg-zinc-800 rounded" />
                </div>
                <div className="mt-6 pt-5 border-t border-white/5 grid grid-cols-4 gap-2">
                  {Array.from({ length: 4 }).map((_, j) => (
                    <div key={j} className="flex flex-col items-center gap-1">
                      <div className="w-6 h-6 rounded-full bg-zinc-800" />
                      <div className="h-2 w-8 bg-zinc-800 rounded" />
                    </div>
                  ))}
                </div>
              </div>
            ))
            : filteredGraduates.map((grad) => (
              <a
                key={grad.id || grad.nim}
                href={`/directory/${grad.id}`}
                className={`group relative p-6 rounded-2xl glass-panel flex flex-col justify-between min-h-[500px] border border-white/5 overflow-hidden cursor-pointer block ${grad.glowClass}`}
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
                    {grad.name}{grad.title ? `, ${grad.title}` : ""}
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
                      {grad.milestones.proposal ? (
                        <span className="text-neon-cyan bg-neon-cyan/5 border border-neon-cyan/20 w-6 h-6 rounded-full flex items-center justify-center text-xs mb-1 shadow-sm shadow-neon-cyan/5">✔</span>
                      ) : (
                        <span className="text-zinc-500 bg-zinc-950 border border-white/5 w-6 h-6 rounded-full flex items-center justify-center text-xs mb-1 animate-pulse">⏳</span>
                      )}
                      <span className="text-[9px] text-zinc-400">Proposal</span>
                    </div>
                    <div className="flex flex-col items-center">
                      {grad.milestones.seminar ? (
                        <span className="text-neon-purple bg-neon-purple/5 border border-neon-purple/20 w-6 h-6 rounded-full flex items-center justify-center text-xs mb-1 shadow-sm shadow-neon-purple/5">✔</span>
                      ) : (
                        <span className="text-zinc-500 bg-zinc-950 border border-white/5 w-6 h-6 rounded-full flex items-center justify-center text-xs mb-1 animate-pulse">⏳</span>
                      )}
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
              </a>
            ))
          }

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
                <Link href="/register">REGISTRATION OPEN VIA IT PORTAL</Link>
              </div>
            )}
          </div>
        </div>
      </section>
      <Footer />

    </div>
  );
}
