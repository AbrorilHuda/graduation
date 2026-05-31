"use client";

import { use, useEffect, useState } from "react";
import { ArrowLeft, Lock } from "lucide-react";
import ParticleBackground from "@/components/ParticleBackground";
import ScratchCard from "@/components/ScratchCard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Student, getStoredStudents } from "@/components/db";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function StudentDetailPage({ params }: PageProps) {
  const { id } = use(params);
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const list = getStoredStudents();
    const found = list.find((g) => g.nim === id);
    if (found) {
      setStudent(found);
    }
    setLoading(false);
  }, [id]);

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-void font-sans select-none overflow-x-hidden text-zinc-100">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="w-8 h-8 rounded-full border-2 border-neon-cyan border-t-transparent animate-spin" />
        </div>
        <Footer />
      </div>
    );
  }

  if (!student) {
    return (
      <div className="flex flex-col min-h-screen bg-void font-sans select-none overflow-x-hidden text-zinc-100">
        <Navbar />
        <div className="flex-grow flex flex-col items-center justify-center pt-24 px-4 text-center">
          <Lock size={40} className="text-zinc-600 mb-4 animate-pulse" />
          <h1 className="text-2xl font-bold font-display text-white">Profile Not Claimed Yet</h1>
          <p className="text-xs text-zinc-400 mt-2 max-w-sm leading-relaxed">
            This student record has not been configured in the yearbook digital vault database.
          </p>
          <a
            href="/directory"
            className="flex items-center gap-1.5 px-5 py-2.5 rounded-full text-xs font-bold bg-zinc-900 border border-white/5 text-zinc-300 hover:text-white mt-6 transition-all"
          >
            <ArrowLeft size={13} />
            BACK TO DIRECTORY
          </a>
        </div>
        <Footer />
      </div>
    );
  }

  const isGraduated = student.status === "Graduated";

  return (
    <div className="flex flex-col min-h-screen bg-void font-sans select-none overflow-x-hidden text-zinc-100">
      
      {/* 1. NAVBAR */}
      <Navbar />

      {/* 2. DYNAMIC STARDUST PORTRAIT BANNER */}
      <header className="relative min-h-[40vh] flex items-center justify-center pt-32 pb-12 px-4 overflow-hidden cyber-grid">
        <ParticleBackground />
        
        {/* Glow Spheres */}
        <div className="absolute top-1/4 left-1/3 w-[35vw] h-[35vw] max-w-[350px] rounded-full bg-neon-purple/10 blur-[100px] -z-10 animate-float-slow" />
        <div className="absolute bottom-1/4 right-1/4 w-[30vw] h-[30vw] max-w-[300px] rounded-full bg-neon-blue/10 blur-[80px] -z-10 animate-float-medium" />

        <div className="relative z-10 max-w-4xl mx-auto text-center flex flex-col items-center">
          <div className="inline-flex items-center gap-1.5 bg-zinc-950/80 px-3.5 py-1.5 rounded-full border border-white/5 mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-neon-cyan shadow-sm shadow-neon-cyan animate-pulse" />
            <span className="text-[10px] tracking-[0.25em] text-zinc-300 font-extrabold uppercase font-display">
              MEMORIAL VAULT
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-display font-extrabold tracking-tight text-white leading-none">
            {student.name}
          </h1>

          <p className="text-xs text-zinc-400 mt-3 font-mono tracking-widest uppercase">
            NIM {student.nim} • {student.specialization}
          </p>
        </div>
      </header>

      {/* 3. DETAILS & SCRATCH SECTION */}
      <main className="flex-grow py-12 px-4 max-w-6xl mx-auto w-full z-20">
        <div className="relative rounded-3xl overflow-hidden glass-panel border border-white/10 flex flex-col lg:flex-row shadow-2xl">
          
          {/* Back Action */}
          <a
            href="/directory"
            className="absolute top-6 left-6 z-40 bg-zinc-950/90 hover:bg-zinc-900 border border-white/10 p-2.5 rounded-full text-zinc-300 hover:text-white transition-colors shadow-lg flex items-center justify-center"
            aria-label="Back to graduates"
          >
            <ArrowLeft size={16} />
          </a>

          {/* Left Column: Student Academic profile */}
          <div className="w-full lg:w-1/2 p-6 md:p-10 flex flex-col justify-between">
            <div className="space-y-8 pt-8">
              {/* Photo & Name */}
              <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-white/5">
                <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-white/10 bg-void/50 shadow-lg shrink-0">
                  <img
                    src={student.image}
                    alt={student.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="text-center sm:text-left">
                  <span className={`inline-block text-[8px] font-display font-extrabold tracking-wider uppercase px-2.5 py-1 rounded-full border ${student.badgeClass}`}>
                    {student.status}
                  </span>
                  <h2 className="text-xl md:text-2xl font-bold font-display text-white mt-2 leading-tight">
                    {student.name}, {isGraduated ? student.title : "S.Kom. (Cand.)"}
                  </h2>
                </div>
              </div>

              {/* Quote */}
              <div className="bg-zinc-950/60 p-5 rounded-2xl border border-white/5 italic text-zinc-300 font-sans leading-relaxed text-xs">
                "{student.quote}"
              </div>

              {/* Progress Milestones */}
              <div className="space-y-4">
                <span className="text-[9px] tracking-widest text-zinc-500 font-bold uppercase font-display block">
                  ACADEMIC PROGRESS CHECKLIST
                </span>
                <div className="grid grid-cols-4 gap-2 text-center text-[10px] font-semibold">
                  <div className="flex flex-col items-center">
                    <span className="text-neon-cyan bg-neon-cyan/5 border border-neon-cyan/20 w-7 h-7 rounded-full flex items-center justify-center text-xs mb-1.5 shadow-sm shadow-neon-cyan/5">✔</span>
                    <span className="text-[9px] text-zinc-400">Proposal</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="text-neon-purple bg-neon-purple/5 border border-neon-purple/20 w-7 h-7 rounded-full flex items-center justify-center text-xs mb-1.5 shadow-sm shadow-neon-purple/5">✔</span>
                    <span className="text-[9px] text-zinc-400">SemPro</span>
                  </div>
                  <div className="flex flex-col items-center">
                    {student.milestones.defense ? (
                      <span className="text-neon-blue bg-neon-blue/5 border border-neon-blue/20 w-7 h-7 rounded-full flex items-center justify-center text-xs mb-1.5 shadow-sm shadow-neon-blue/5">✔</span>
                    ) : (
                      <span className="text-zinc-500 bg-zinc-950 border border-white/5 w-7 h-7 rounded-full flex items-center justify-center text-xs mb-1.5 animate-pulse">⏳</span>
                    )}
                    <span className="text-[9px] text-zinc-400">SemHas</span>
                  </div>
                  <div className="flex flex-col items-center">
                    {student.milestones.graduation ? (
                      <span className="text-amber-400 bg-amber-500/5 border border-amber-500/20 w-7 h-7 rounded-full flex items-center justify-center text-xs mb-1.5 shadow-md shadow-amber-500/10">✔</span>
                    ) : (
                      <span className="text-zinc-600 bg-zinc-950 border border-white/5 w-7 h-7 rounded-full flex items-center justify-center text-xs mb-1.5">🔒</span>
                    )}
                    <span className="text-[9px] text-zinc-400">Graduated</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-white/5 pt-5 mt-8 text-[10px] text-zinc-500 tracking-wider font-semibold font-display">
              INFORMATICS UNIRA 2022 • SECURE DATABASE VAULT
            </div>
          </div>

          {/* Right Column: Personalized Scratch Card */}
          <div className="w-full lg:w-1/2 p-6 md:p-10 bg-zinc-950/40 border-t lg:border-t-0 lg:border-l border-white/5 flex flex-col items-center justify-center gap-6">
            <span className="text-[9px] tracking-widest text-zinc-500 font-bold uppercase block text-center font-display mb-1">
              DEGREE TITLE REVEAL CARD
            </span>
            
            <ScratchCard 
              studentName={student.name} 
              isLockedInitially={!isGraduated} 
            />
            
            <p className="text-[10px] text-zinc-400 text-center max-w-[280px] leading-relaxed">
              {isGraduated 
                ? "Friction-scratch the silver holographic surface above to officially claim and reveal your Bachelor S.Kom designation!"
                : "This card is cryptographically locked. S.Kom degree overlays require complete SemHas & convocation certification."}
            </p>
          </div>

        </div>
      </main>

      {/* 4. FOOTER */}
      <Footer />

    </div>
  );
}
