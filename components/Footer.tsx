"use client";

import { usePathname } from "next/navigation";
import { Sparkles, Heart, ArrowUpRight } from "lucide-react";

export default function Footer() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const prefix = isHome ? "" : "/";

  return (
    <footer className="mt-auto bg-zinc-950/70 border-t border-white/5 py-12 px-4">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Brand & Signature */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left gap-2">
          <div className="flex items-center gap-2">
            <span className="font-display font-extrabold text-sm tracking-widest text-white">
              INFORMATICS UNIRA 2022
            </span>
          </div>
          <p className="text-[10px] text-zinc-500 font-sans tracking-wide">
            Built with memories by Informatics UNIRA 2022 <Heart size={8} className="inline text-red-500 animate-pulse fill-red-500" /> • Class of 2022
          </p>
        </div>

        {/* Quick Links */}
        <div className="flex items-center gap-6 text-[10px] font-bold tracking-wider text-zinc-400">
          <a href={`${prefix}#statistics`} className="hover:text-neon-cyan transition-colors font-display">STATISTICS</a>
          <a href="/directory" className={`hover:text-neon-cyan transition-colors font-display ${pathname === "/directory" ? "text-neon-cyan font-bold" : ""}`}>
            DIRECTORY
          </a>
          <a href="/memories" className={`hover:text-neon-cyan transition-colors font-display ${pathname === "/memories" ? "text-neon-cyan font-bold" : ""}`}>
            MEMORIES
          </a>
        </div>

        {/* Socials / External links */}
        <div className="flex items-center gap-4">
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-zinc-500 hover:text-white transition-colors border border-white/5 p-2 rounded-full hover:bg-zinc-900 flex items-center justify-center"
            aria-label="Repository"
            id="footer-github-link"
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
              <path d="M9 18c-4.51 2-5-2-7-2" />
            </svg>
          </a>
          <a
            href="#"
            className="text-zinc-500 hover:text-white transition-colors border border-white/5 p-2 rounded-full hover:bg-zinc-900 flex items-center gap-1 text-[10px] font-bold font-display"
            id="footer-portal-link"
          >
            PORTAL
            <ArrowUpRight size={10} className="text-neon-cyan" />
          </a>
        </div>
      </div>
    </footer>
  );
}
