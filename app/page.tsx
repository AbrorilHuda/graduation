"use client";

import { useState, useEffect } from "react";
import {
  Users,
  Award,
  BookOpen,
  TrendingUp,
  ChevronRight,
  Sparkles,
  Heart,
  UserCheck,
  Calendar,
  Lock,
  ArrowUpRight
} from "lucide-react";
import ParticleBackground from "@/components/ParticleBackground";
import ScratchCard from "@/components/ScratchCard";
import MemoryGallery from "@/components/MemoryGallery";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";


export default function Home() {
  const [activeTimeline, setActiveTimeline] = useState(3); // 2025 as default active

  const milestones = [
    { year: "2022", title: "First Day", desc: "120 eager minds met for the first time in Algorithms 101, initiating our collective digital path.", tag: "Enrolled" },
    { year: "2023", title: "Endless Lab Nights", desc: "operating systems practicals, database engineering, and caffeine-fueled database designs.", tag: "Struggle" },
    { year: "2024", title: "Research & Seminars", desc: "Formulating smart systems, research proposals, and defending our results under faculty board scrutiny.", tag: "Seminar" },
    { year: "2025", title: "Graduation Day", desc: "Walking across the convocation stage, throwing caps in the air, entering the tech workforce as S.Kom.", tag: "Graduated" }
  ];

  const quotes = [
    { text: "Every syntax error was a lesson, every compilation success was a shared celebration. Informatics '22 was a family of core creators.", author: "Abroril Huda", role: "Developer" },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-void font-sans select-none overflow-x-hidden text-zinc-100">

      {/* 1. STICKY NAVBAR */}
      <Navbar />

      {/* 2. HERO SECTION */}
      <header className="relative min-h-[92vh] flex items-center justify-center pt-24 pb-16 px-4 overflow-hidden cyber-grid" id="hero">
        <ParticleBackground />

        {/* Glow Spheres */}
        <div className="absolute top-1/4 left-1/4 w-[40vw] h-[40vw] max-w-[400px] rounded-full bg-neon-purple/10 blur-[100px] animate-float-slow -z-10" />
        <div className="absolute bottom-1/4 right-1/4 w-[35vw] h-[35vw] max-w-[350px] rounded-full bg-neon-blue/10 blur-[80px] animate-float-medium -z-10" />

        <div className="relative z-10 max-w-4xl mx-auto text-center flex flex-col items-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-1.5 bg-zinc-950/80 px-3.5 py-1.5 rounded-full border border-white/5 mb-6 animate-pulse">
            <span className="w-1.5 h-1.5 rounded-full bg-neon-cyan shadow-sm shadow-neon-cyan" />
            <span className="text-[10px] tracking-[0.25em] text-zinc-300 font-extrabold uppercase font-display">
              OFFICIAL DIGITAL ARCHIVE
            </span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-6xl md:text-[5.5rem] font-display font-extrabold tracking-tight leading-[1.05] text-white">
            The Class of 2022.<br />
            <span className="bg-gradient-to-r from-neon-purple via-neon-indigo to-neon-cyan text-gradient text-glow-purple">
              A Journey Defined
            </span><br className="hidden sm:inline" />
            {" "}by Innovation.
          </h1>

          {/* Subheading */}
          <p className="max-w-2xl text-sm sm:text-lg leading-relaxed text-zinc-400 mt-8 font-sans">
            Step into the official graduation digital yearbook for the Informatics Class of 2022.
            Relive the late-night compiler wars, project defenses, lifelong bonds, and the final
            academic achievements that earned us our S.Kom degrees.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center gap-4 mt-10">
            <a
              href="/directory"
              className="w-full sm:w-auto px-8 py-3.5 rounded-full text-xs font-bold uppercase tracking-wider text-black bg-white hover:bg-zinc-200 transition-all shadow-xl shadow-white/5 flex items-center justify-center gap-1.5"
              id="cta-enter-yearbook"
            >
              Enter The Yearbook
              <ChevronRight size={14} />
            </a>
            <a
              href="#memories"
              className="w-full sm:w-auto px-8 py-3.5 rounded-full text-xs font-bold uppercase tracking-wider text-zinc-300 bg-zinc-950/80 border border-white/10 hover:border-neon-purple/50 hover:bg-zinc-950 transition-all flex items-center justify-center gap-1.5"
              id="cta-view-memories"
            >
              View Memories
            </a>
          </div>
        </div>
      </header>

      {/* 3. STATISTICS SECTION */}
      <section className="relative py-24 px-4 bg-zinc-950/40 border-t border-b border-white/5" id="statistics">
        {/* Glow accent */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70%] h-[150px] bg-neon-indigo/5 blur-[120px] -z-10 pointer-events-none" />

        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center max-w-xl mx-auto mb-16">
            <h2 className="text-2xl md:text-3xl font-display font-bold text-white tracking-wide">
              Academic Milestones Achieved
            </h2>
            <p className="text-xs text-zinc-400 mt-2 font-sans">
              Real-time directory statistics documenting the academic completion progress.
            </p>
          </div>

          {/* Card Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6" id="stats-grid">
            {[
              { label: "Total Students Enrolled", val: "120", desc: "Cohort Strength", icon: Users, color: "text-neon-cyan" },
              { label: "Seminar Results Completed", val: "100%", desc: "Research Approved", icon: BookOpen, color: "text-neon-purple" },
              { label: "Thesis Defense Completed", val: "94 / 120", desc: "Approved Systems", icon: TrendingUp, color: "text-neon-indigo" },
              { label: "Graduated Students", val: "88", desc: "S.Kom Degrees Issued", icon: Award, color: "text-amber-400" },
            ].map((stat, idx) => (
              <div
                key={idx}
                className="group relative p-6 rounded-2xl glass-panel glass-panel-hover flex flex-col justify-between h-[160px] overflow-hidden"
              >
                {/* Subtle corner light */}
                <div className="absolute top-0 right-0 w-16 h-16 bg-white/5 rounded-bl-full pointer-events-none transition-opacity duration-300 group-hover:bg-white/10" />

                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider font-display max-w-[130px] leading-tight">
                    {stat.label}
                  </span>
                  <stat.icon size={16} className={`${stat.color} opacity-75 group-hover:scale-110 transition-transform`} />
                </div>

                <div>
                  <div className="text-3xl font-display font-extrabold text-white tracking-wide">
                    {stat.val}
                  </div>
                  <span className="text-[10px] text-zinc-500 mt-0.5 block">
                    {stat.desc}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* 5. GRADUATION SCRATCH CARD SHOWCASE */}
      <section className="relative py-24 px-4 bg-zinc-950/40 border-t border-b border-white/5" id="graduation">
        <div className="absolute inset-0 bg-gradient-to-b from-void/0 via-neon-purple/5 to-void/0 pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Details column */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-1 bg-neon-purple/10 border border-neon-purple/20 px-3 py-1 rounded-full text-neon-purple text-[10px] tracking-widest font-extrabold uppercase font-display">
              <Sparkles size={11} className="animate-spin-slow" />
              Interactive Title Reveal
            </div>

            <h2 className="text-3xl md:text-5xl font-display font-extrabold tracking-tight text-white leading-tight">
              Unlock Your Academic Degree Title.
            </h2>

            <p className="text-sm text-zinc-400 leading-relaxed font-sans">
              To symbolize the culmination of late-night coding efforts, we've designed an interactive
              graduation portal feature. Candidates scratch away the metallic cover of their memorial card
              to reveal their official degree designation under the seal of the Informatics department.
            </p>

            <ul className="space-y-3.5 text-xs text-zinc-300">
              <li className="flex items-start gap-2.5">
                <span className="bg-neon-cyan/20 text-neon-cyan p-1 rounded-full text-[10px] font-bold">✔</span>
                <span>Requires approved Seminar Results status on university servers.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="bg-neon-cyan/20 text-neon-cyan p-1 rounded-full text-[10px] font-bold">✔</span>
                <span>Unveils custom crypto-backed signature certifying "S.Kom" graduation.</span>
              </li>
            </ul>

            <div className="p-4 rounded-xl glass-panel bg-void/50 border border-yellow-500/10 flex items-center gap-3">
              <div className="bg-yellow-500/10 p-2.5 rounded-lg text-yellow-500 border border-yellow-500/20">
                <Lock size={15} />
              </div>
              <p className="text-[11px] text-zinc-400 leading-relaxed">
                <strong className="text-zinc-200 block">Status Constraint Alert:</strong>
                Graduation titles remain hidden beneath the cryptographic silver overlay until the final grades are certified.
              </p>
            </div>
          </div>

          {/* Interactive scratch card mock column */}
          <div className="lg:col-span-6 flex justify-center">
            <ScratchCard />
          </div>
        </div>
      </section>

      {/* 6. MEMORIES GALLERY */}
      <section className="py-24 px-4 max-w-7xl mx-auto" id="memories">
        <div className="text-center max-w-xl mx-auto mb-16">
          <h2 className="text-3xl font-display font-bold text-white tracking-wide">
            Campus Memories Gallery
          </h2>
          <p className="text-xs text-zinc-400 mt-2 font-sans">
            A visual repository chronicling our campus moments, practical labs, and the final graduation smiles.
          </p>
        </div>

        <MemoryGallery limit={4} />

        {/* Explore All CTA link */}
        <div className="flex justify-center mt-12">
          <a
            href="/memories"
            className="flex items-center gap-1.5 px-6 py-3 rounded-full text-xs font-bold bg-zinc-950/80 border border-white/5 hover:border-neon-purple/40 hover:bg-zinc-950 text-zinc-300 hover:text-white transition-all shadow-lg"
          >
            Explore All Memories
            <ArrowUpRight size={14} className="text-neon-cyan animate-pulse" />
          </a>
        </div>
      </section>

      {/* 7. JOURNEY TIMELINE */}
      <section className="relative py-24 px-4 bg-zinc-950/20 border-t border-white/5" id="timeline">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center max-w-xl mx-auto mb-16">
            <h2 className="text-3xl font-display font-bold text-white tracking-wide">
              The Journey Timeline
            </h2>
            <p className="text-xs text-zinc-400 mt-2 font-sans">
              Relive the year-by-year academic progression of Informatics Class of 2022.
            </p>
          </div>

          {/* Timeline Track */}
          <div className="relative pt-6 pb-12 overflow-x-auto select-none" id="timeline-scroll-container">
            {/* Background glowing line */}
            <div className="absolute top-[48px] left-[5%] right-[5%] h-1.5 bg-zinc-900 border-t border-b border-white/5 -z-10" />
            <div
              className="absolute top-[48px] left-[5%] h-1.5 bg-gradient-to-r from-neon-purple via-neon-indigo to-neon-cyan transition-all duration-700 -z-10"
              style={{ width: `${activeTimeline * 30}%` }}
            />

            <div className="min-w-[800px] flex justify-between px-6">
              {milestones.map((m, idx) => (
                <div
                  key={idx}
                  onClick={() => setActiveTimeline(idx)}
                  className="flex flex-col items-center text-center w-[200px] cursor-pointer group"
                >
                  {/* Glowing Node Button */}
                  <button
                    className={`w-[36px] h-[36px] rounded-full flex items-center justify-center transition-all duration-500 border ${activeTimeline === idx
                      ? "bg-void border-neon-cyan text-neon-cyan shadow-lg shadow-neon-cyan/20 scale-110"
                      : "bg-zinc-950 hover:bg-zinc-900 border-white/10 text-zinc-400 hover:text-white"
                      }`}
                  >
                    <div className={`w-2.5 h-2.5 rounded-full transition-colors ${activeTimeline === idx ? "bg-neon-cyan" : "bg-zinc-700 group-hover:bg-zinc-400"
                      }`} />
                  </button>

                  {/* Year Tag */}
                  <span className={`text-sm font-display font-extrabold tracking-wide mt-4 transition-colors ${activeTimeline === idx ? "text-neon-cyan" : "text-zinc-500 group-hover:text-zinc-300"
                    }`}>
                    {m.year}
                  </span>

                  {/* Title */}
                  <h4 className={`text-xs font-bold font-display mt-2 tracking-wider uppercase transition-colors ${activeTimeline === idx ? "text-white" : "text-zinc-400"
                    }`}>
                    {m.title}
                  </h4>

                  {/* Description Box */}
                  <div className={`mt-5 p-4 rounded-xl glass-panel text-left text-[11px] leading-relaxed transition-all duration-500 ${activeTimeline === idx
                    ? "opacity-100 translate-y-0 border-neon-purple/40 scale-100"
                    : "opacity-40 translate-y-2 border-white/5 pointer-events-none group-hover:opacity-60"
                    }`}
                    style={{
                      boxShadow: activeTimeline === idx ? "0 10px 20px -10px rgba(168, 85, 247, 0.2)" : "none"
                    }}
                  >
                    <div className="flex justify-between items-center mb-1.5">
                      <span className={`text-[8px] font-bold uppercase tracking-widest ${activeTimeline === idx ? "text-neon-purple" : "text-zinc-500"
                        }`}>
                        {m.tag}
                      </span>
                      <Calendar size={10} className="text-zinc-600" />
                    </div>
                    <p className="text-zinc-400">
                      {m.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 8. QUOTES SECTION */}
      <section className="py-24 px-4 max-w-4xl mx-auto" id="quotes">
        <div className="relative glass-panel rounded-3xl p-8 md:p-12 border border-white/5 overflow-hidden text-center shadow-2xl">
          {/* Subtle neon drop */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-1 bg-gradient-to-r from-neon-purple to-neon-cyan blur-sm" />

          <span className="text-6xl md:text-7xl font-display font-black text-neon-purple/20 select-none block leading-none h-12">
            “
          </span>

          {/* Quotes Slider */}
          <div className="min-h-[120px] flex items-center justify-center">
            <p className="text-base md:text-lg italic text-zinc-200 leading-relaxed font-sans max-w-2xl">
              {quotes[activeTimeline % quotes.length].text}
            </p>
          </div>

          <div className="mt-8 border-t border-white/5 pt-6 flex flex-col items-center gap-1.5">
            <span className="text-sm font-bold font-display tracking-wider text-white">
              {quotes[activeTimeline % quotes.length].author}
            </span>
            <span className="text-[10px] tracking-widest text-zinc-500 font-extrabold uppercase font-display">
              {quotes[activeTimeline % quotes.length].role}
            </span>
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center gap-2 mt-6">
            {quotes.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveTimeline(i)}
                className={`w-2 h-2 rounded-full transition-all ${activeTimeline % quotes.length === i ? "bg-neon-cyan w-4" : "bg-zinc-700 hover:bg-zinc-500"
                  }`}
                aria-label={`Slide ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 9. FOOTER */}
      <Footer />

    </div>
  );
}
