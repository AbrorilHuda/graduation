"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Sparkles, UserCheck } from "lucide-react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const isHome = pathname === "/";

  // Handle Navbar Background Glow on Scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const prefix = isHome ? "" : "/";

  return (
    <nav className={`fixed top-0 left-0 w-full z-40 transition-all duration-300 ${scrolled ? "glass-navbar py-3 shadow-lg shadow-black/30" : "bg-transparent py-5"
      }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Logo */}
        <a href="/" className="flex items-center gap-2 group">
          <span className="font-display font-extrabold text-lg tracking-wider bg-gradient-to-r from-white via-zinc-200 to-zinc-400 text-gradient">
            INFORMATICS '22
          </span>
        </a>

        {/* Nav Links */}
        <div className="hidden md:flex items-center gap-8 text-xs font-semibold tracking-widest text-zinc-400">
          <a href={`${prefix}#statistics`} className="hover:text-neon-cyan transition-colors font-display">STATISTICS</a>
          <a href="/directory" className={`hover:text-neon-cyan transition-colors font-display ${pathname === "/directory" ? "text-neon-cyan font-bold" : ""}`}>
            DIRECTORY
          </a>
          <a href="/memories" className={`hover:text-neon-cyan transition-colors font-display ${pathname === "/memories" ? "text-neon-cyan font-bold" : ""}`}>
            MEMORIES
          </a>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-4">
          <a
            href={isHome ? "/directory" : "/"}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold bg-zinc-900 border border-white/10 hover:border-neon-purple/40 hover:bg-zinc-950 transition-all text-zinc-200 hover:text-white shadow-lg"
          >
            <UserCheck size={13} className="text-neon-purple" />
            {isHome ? "GRADUATES REGISTRY" : "HOME VIEW"}
          </a>
        </div>
      </div>
    </nav>
  );
}
