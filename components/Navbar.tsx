"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Sparkles, UserCheck, Menu, X, ShieldAlert } from "lucide-react";
import { getStoredUser } from "@/components/db";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [activeUser, setActiveUser] = useState<any>(null);
  const pathname = usePathname();
  const isHome = pathname === "/";

  // Handle Navbar Background Glow on Scroll & Session load
  useEffect(() => {
    setActiveUser(getStoredUser());

    const handleScroll = () => {
      if (window.scrollY > 40) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [pathname]);

  const prefix = isHome ? "" : "/";

  return (
    <nav className={`fixed top-0 left-0 w-full z-40 transition-all duration-300 ${scrolled || isOpen ? "glass-navbar py-3 shadow-lg shadow-black/30" : "bg-transparent py-5"
      }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-12">
          {/* Logo */}
          <a href="/" className="flex items-center gap-2 group">
            <span className="font-display font-extrabold text-lg tracking-wider bg-gradient-to-r from-white via-zinc-200 to-zinc-400 text-gradient">
              INFORMATICS '22
            </span>
          </a>

          {/* Nav Links (Desktop) */}
          <div className="hidden md:flex items-center gap-8 text-xs font-semibold tracking-widest text-zinc-400">
            <a href="/" className="hover:text-neon-cyan transition-colors font-display">HOME</a>
            <a href="/directory" className={`hover:text-neon-cyan transition-colors font-display ${pathname === "/directory" ? "text-neon-cyan font-bold" : ""}`}>
              DIRECTORY
            </a>
            <a href="/memories" className={`hover:text-neon-cyan transition-colors font-display ${pathname === "/memories" ? "text-neon-cyan font-bold" : ""}`}>
              MEMORIES
            </a>
          </div>

          {/* Right Actions (Desktop) */}
          <div className="hidden md:flex items-center gap-4">
            {activeUser ? (
              <a
                href="/dashboard"
                className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold bg-zinc-950 border border-neon-purple/35 hover:border-neon-cyan/40 hover:bg-zinc-900 transition-all text-neon-purple hover:text-neon-cyan shadow-lg shadow-neon-purple/5"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse animate-duration-1000" />
                {activeUser.name.split(" ")[0].toUpperCase()}
              </a>
            ) : (
              <a
                href="/login"
                className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold bg-zinc-900 border border-white/10 hover:border-neon-purple/40 hover:bg-zinc-950 transition-all text-zinc-200 hover:text-white shadow-lg"
              >
                <UserCheck size={13} className="text-neon-purple" />
                COHORT PORTAL
              </a>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2.5 rounded-xl bg-zinc-950/80 border border-white/10 text-zinc-400 hover:text-white transition-all focus:outline-none shadow-md"
              aria-label="Toggle navigation menu"
            >
              {isOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      <div className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? "max-h-[360px] opacity-100 mt-3 border-t border-white/5" : "max-h-0 opacity-0 pointer-events-none"
        }`}>
        <div className="px-6 py-5 flex flex-col gap-4 bg-zinc-950/95 backdrop-blur-2xl">
          <a
            href={`${prefix}#statistics`}
            onClick={() => setIsOpen(false)}
            className="text-xs font-bold tracking-widest text-zinc-400 hover:text-neon-cyan py-2 transition-colors border-b border-white/5"
          >
            STATISTICS
          </a>
          <a
            href="/directory"
            onClick={() => setIsOpen(false)}
            className={`text-xs font-bold tracking-widest py-2 transition-colors border-b border-white/5 ${pathname === "/directory" ? "text-neon-cyan font-bold" : "text-zinc-400 hover:text-neon-cyan"
              }`}
          >
            DIRECTORY {pathname === "/directory" ? "•" : ""}
          </a>
          <a
            href="/memories"
            onClick={() => setIsOpen(false)}
            className={`text-xs font-bold tracking-widest py-2 transition-colors border-b border-white/5 ${pathname === "/memories" ? "text-neon-cyan font-bold" : "text-zinc-400 hover:text-neon-cyan"
              }`}
          >
            MEMORIES {pathname === "/memories" ? "•" : ""}
          </a>
          <a
            href={activeUser ? "/dashboard" : "/login"}
            onClick={() => setIsOpen(false)}
            className={`text-xs font-bold tracking-widest py-2 transition-colors border-b border-white/5 ${pathname === "/dashboard" || pathname === "/login" ? "text-neon-cyan font-bold" : "text-zinc-400 hover:text-neon-cyan"
              }`}
          >
            PORTAL {pathname === "/dashboard" || pathname === "/login" ? "•" : ""}
          </a>

          {activeUser ? (
            <a
              href="/dashboard"
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-center gap-1.5 px-4 py-3 rounded-xl text-xs font-bold bg-zinc-950 border border-neon-purple/35 transition-all text-neon-purple shadow-lg mt-2 uppercase font-display"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              {activeUser.name.split(" ")[0].toUpperCase()} DASHBOARD
            </a>
          ) : (
            <a
              href="/login"
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-center gap-1.5 px-4 py-3 rounded-xl text-xs font-bold bg-zinc-900 border border-white/5 hover:bg-zinc-950 transition-all text-zinc-200 shadow-lg mt-2"
            >
              <UserCheck size={13} className="text-neon-purple" />
              COHORT PORTAL
            </a>
          )}
        </div>
      </div>
    </nav>
  );
}
