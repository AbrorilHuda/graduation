"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Lock,
  Eye,
  EyeOff,
  Sparkles,
  GraduationCap,
  ArrowRight,
} from "lucide-react";
import ParticleBackground from "@/components/ParticleBackground";
import { getStoredUser, loginUser } from "@/components/db";

export default function LoginPage() {
  const router = useRouter();
  const [nim, setNim] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const active = getStoredUser();
    if (active) router.push("/dashboard");
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 700));
    const user = loginUser(nim, password);
    if (user) {
      router.push("/dashboard");
    } else {
      setIsLoading(false);
      setErrorMsg("NIM atau password salah. Password default: password123");
    }
  };

  return (
    <div className="min-h-screen bg-[#030712] flex overflow-hidden font-sans">
      {/* ─── LEFT PANEL – Branding ─── */}
      <div className="hidden lg:flex lg:w-1/2 relative flex-col items-center justify-center p-12 overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 bg-gradient-to-br from-violet-950 via-[#0a0a1a] to-cyan-950" />
        <ParticleBackground />

        {/* Glow orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-violet-600/15 blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-72 h-72 rounded-full bg-cyan-500/10 blur-[100px]" />

        {/* Grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
            backgroundSize: "50px 50px",
          }}
        />

        <div className="relative z-10 text-center">
          <div className="inline-flex items-center gap-2 bg-white/5 px-4 py-1.5 rounded-full border border-white/10 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[10px] tracking-[0.3em] text-zinc-300 font-bold uppercase">
              Informatika &apos;22
            </span>
          </div>

          <h1 className="text-4xl xl:text-5xl font-extrabold text-white leading-tight tracking-tight mb-4">
            Yearbook <br />
            <span className="bg-gradient-to-r from-violet-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
              Digital Portal
            </span>
          </h1>

          <p className="text-sm text-zinc-400 leading-relaxed max-w-sm mx-auto mb-10">
            Kelola profil wisuda, pantau milestone akademik, dan abadikan
            momen terbaik perjalanan sarjanamu.
          </p>
        </div>

        {/* Bottom credit */}
        <p className="absolute bottom-6 text-[10px] text-zinc-600 tracking-widest">
          INFORMATIKA UNIVERSITAS MADURA — ANGKATAN 2022
        </p>
      </div>

      {/* ─── RIGHT PANEL – Form ─── */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-6 sm:p-10 relative">
        {/* Mobile bg */}
        <div className="absolute inset-0 bg-[#030712] lg:bg-transparent">
          <div className="absolute inset-0 lg:hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-violet-950/40 via-[#030712] to-[#030712]" />
          </div>
        </div>

        <div className="relative z-10 w-full max-w-md">
          {/* Mobile logo */}
          <div className="flex lg:hidden items-center gap-3 mb-10">
            <span className="text-sm font-bold text-white tracking-tight">
              Informatika 2022 <span className="text-violet-400">Portal</span>
            </span>
          </div>

          {/* Header */}
          <div className="mb-8">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight pt-2">
              Masuk ke Akunmu
            </h2>
            <p className="text-sm text-zinc-500 mt-1.5">
              Belum punya akun?{" "}
              <Link
                href="/register"
                className="text-violet-400 hover:text-violet-300 font-semibold transition-colors"
              >
                Daftar sekarang →
              </Link>
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* NIM */}
            <div className="space-y-2">
              <label className="text-[11px] tracking-[0.15em] text-zinc-400 font-bold uppercase">
                Nomor Induk Mahasiswa (NIM)
              </label>
              <div className="relative group">
                <input
                  type="text"
                  required
                  placeholder="Contoh: 220101032"
                  value={nim}
                  onChange={(e) => setNim(e.target.value)}
                  className="w-full bg-white/[0.04] text-sm text-white pl-4 pr-4 py-3.5 rounded-2xl border border-white/8 focus:border-violet-500/50 focus:outline-none focus:ring-2 focus:ring-violet-500/15 transition-all font-mono placeholder:text-zinc-600 hover:border-white/15"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label className="text-[11px] tracking-[0.15em] text-zinc-400 font-bold uppercase">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white/[0.04] text-sm text-white pl-4 pr-12 py-3.5 rounded-2xl border border-white/8 focus:border-violet-500/50 focus:outline-none focus:ring-2 focus:ring-violet-500/15 transition-all font-mono placeholder:text-zinc-600 hover:border-white/15"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Hint box */}
            <div className="flex items-start gap-3 bg-violet-500/5 border border-violet-500/15 rounded-2xl p-4">
              <Sparkles size={14} className="text-violet-400 mt-0.5 shrink-0 animate-pulse" />
              <p className="text-[11px] text-zinc-400 leading-relaxed">
                <span className="text-zinc-200 font-semibold">Password default:</span>{" "}
                <code className="text-cyan-400 font-mono bg-cyan-500/10 px-1.5 py-0.5 rounded-lg text-[10px]">
                  password123
                </code>{" "}
                — Untuk mahasiswa yang baru mendaftar, gunakan password yang dibuat saat registrasi.
              </p>
            </div>

            {/* Error */}
            {errorMsg && (
              <div className="flex items-center gap-2.5 bg-red-500/8 border border-red-500/20 rounded-2xl px-4 py-3">
                <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse shrink-0" />
                <p className="text-xs text-red-400 font-medium">{errorMsg}</p>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-500 hover:to-cyan-500 text-sm font-bold text-white shadow-xl shadow-violet-500/20 hover:shadow-violet-500/30 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed mt-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  Memverifikasi...
                </>
              ) : (
                <>
                  <Lock size={14} />
                  Masuk ke Portal
                  <ArrowRight size={14} />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-white/8" />
            <span className="text-[10px] text-zinc-600 tracking-widest font-bold uppercase">Atau</span>
            <div className="flex-1 h-px bg-white/8" />
          </div>

          {/* Register CTA */}
          <Link
            href="/register"
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.06] text-sm font-semibold text-zinc-300 hover:text-white transition-all"
          >
            <GraduationCap size={15} className="text-violet-400" />
            Daftar Akun
          </Link>

          {/* Back to home */}
          <p className="text-center text-[11px] text-zinc-600 mt-6">
            <Link href="/" className="hover:text-zinc-400 transition-colors">
              ← Kembali ke halaman utama
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
