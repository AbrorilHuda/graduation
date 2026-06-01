"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ParticleBackground from "@/components/ParticleBackground";
import MemoryGallery from "@/components/MemoryGallery";

export default function MemoriesPage() {
  return (
    <div className="flex flex-col min-h-screen bg-void font-sans select-none overflow-x-hidden text-zinc-100">
      <Navbar />
      <header className="relative min-h-[45vh] flex items-center justify-center pt-32 pb-16 px-4 overflow-hidden cyber-grid">
        <ParticleBackground />

        {/* Glow Spheres */}
        <div className="absolute top-1/4 left-1/3 w-[35vw] h-[35vw] max-w-[350px] rounded-full bg-neon-purple/10 blur-[100px] -z-10 animate-float-slow" />
        <div className="absolute bottom-1/4 right-1/4 w-[30vw] h-[30vw] max-w-[300px] rounded-full bg-neon-blue/10 blur-[80px] -z-10 animate-float-medium" />

        <div className="relative z-10 max-w-4xl mx-auto text-center flex flex-col items-center">
          {/* Tagline Badge */}
          <div className="inline-flex items-center gap-1.5 bg-zinc-950/80 px-3.5 py-1.5 rounded-full border border-white/5 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-neon-purple shadow-sm shadow-neon-purple animate-pulse" />
            <span className="text-[10px] tracking-[0.25em] text-zinc-300 font-extrabold uppercase font-display">
              CLASS ARCHIVES
            </span>
          </div>

          {/* Large Title */}
          <h1 className="text-5xl sm:text-7xl font-display font-extrabold tracking-tight text-white leading-none">
            Shared Memories
          </h1>

          {/* Subtitle */}
          <p className="max-w-2xl text-sm sm:text-base leading-relaxed text-zinc-400 mt-4 font-sans">
            A digital archive chronicling our late-night compiler wars, lab practicals, and convocation smiles.
          </p>
        </div>
      </header>
      <main className="flex-grow py-12 px-4 max-w-7xl mx-auto w-full relative">
        <MemoryGallery />
      </main>
      <Footer />

    </div>
  );
}
