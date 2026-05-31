"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  GraduationCap,
  UserPlus,
  Eye,
  EyeOff,
  ArrowRight,
  CheckCircle2,
  BookOpen,
  Leaf,
  BarChart3,
  AlertCircle,
} from "lucide-react";
import ParticleBackground from "@/components/ParticleBackground";
import { registerUser } from "@/components/db";

const SPECIALIZATIONS = [
  {
    id: "Business Intelligence",
    label: "Business Intelligence",
    desc: "Analitik data & sistem informasi bisnis",
    icon: BarChart3,
    color: "from-violet-500 to-pink-500",
    glow: "violet",
  },
  {
    id: "Smart Agriculture",
    label: "Smart Agriculture",
    desc: "IoT pertanian & teknologi hijau",
    icon: Leaf,
    color: "from-emerald-500 to-cyan-500",
    glow: "cyan",
  },
] as const;

type Step = 1 | 2 | 3;

export default function RegisterPage() {
  const router = useRouter();

  // Step state
  const [step, setStep] = useState<Step>(1);

  // Form fields
  const [nim, setNim] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [specialization, setSpecialization] = useState<
    "Business Intelligence" | "Smart Agriculture" | ""
  >("");

  // UI state
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // ── Validation per step ──
  const validateStep1 = () => {
    if (!nim.trim() || nim.trim().length < 6)
      return "NIM harus minimal 6 digit.";
    if (!name.trim() || name.trim().length < 3)
      return "Nama lengkap minimal 3 karakter.";
    return null;
  };

  const validateStep2 = () => {
    if (!specialization) return "Pilih salah satu konsentrasi.";
    return null;
  };

  const validateStep3 = () => {
    if (password.length < 6) return "Password minimal 6 karakter.";
    if (password !== confirmPassword) return "Password tidak cocok.";
    return null;
  };

  const goNext = () => {
    setErrorMsg("");
    const err =
      step === 1 ? validateStep1() : step === 2 ? validateStep2() : null;
    if (err) return setErrorMsg(err);
    setStep((s) => (s + 1) as Step);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    const err = validateStep3();
    if (err) return setErrorMsg(err);

    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 800));

    const result = registerUser({
      nim: nim.trim(),
      name: name.trim(),
      password,
      specialization: specialization as
        | "Business Intelligence"
        | "Smart Agriculture",
    });

    if (result.success) {
      setSuccess(true);
      setTimeout(() => router.push("/dashboard"), 2200);
    } else {
      setIsLoading(false);
      setErrorMsg(result.error ?? "Pendaftaran gagal.");
    }
  };

  // ── Step indicator ──
  const StepDot = ({ n }: { n: number }) => (
    <div className="flex flex-col items-center gap-1">
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-500 ${step > n
          ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/30"
          : step === n
            ? "bg-gradient-to-br from-violet-600 to-cyan-500 text-white shadow-lg shadow-violet-500/30"
            : "bg-white/5 text-zinc-600 border border-white/10"
          }`}
      >
        {step > n ? <CheckCircle2 size={14} /> : n}
      </div>
      <span
        className={`text-[9px] tracking-widest uppercase font-bold ${step >= n ? "text-zinc-300" : "text-zinc-600"
          }`}
      >
        {n === 1 ? "Identitas" : n === 2 ? "Konsentrasi" : "Keamanan"}
      </span>
    </div>
  );

  // ── Success state ──
  if (success) {
    return (
      <div className="min-h-screen bg-[#030712] flex items-center justify-center font-sans">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-950/40 via-[#030712] to-violet-950/30" />
        <div className="relative z-10 text-center px-6">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-emerald-500 to-cyan-500 mb-6 shadow-2xl shadow-emerald-500/30 animate-bounce">
            <CheckCircle2 size={36} className="text-white" />
          </div>
          <h2 className="text-2xl font-extrabold text-white mb-2">
            Berhasil Mendaftar! 🎉
          </h2>
          <p className="text-sm text-zinc-400 mb-4">
            Selamat datang di Yearbook Informatika &apos;22.
            <br />
            Mengarahkan ke dashboard...
          </p>
          <div className="w-6 h-6 rounded-full border-2 border-emerald-400 border-t-transparent animate-spin mx-auto" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#030712] flex overflow-hidden font-sans">
      {/* ─── LEFT PANEL ─── */}
      <div className="hidden lg:flex lg:w-5/12 relative flex-col items-center justify-center p-12 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-950 via-[#0a0a1a] to-violet-950" />
        <ParticleBackground />
        <div className="absolute top-1/4 right-1/4 w-80 h-80 rounded-full bg-cyan-600/10 blur-[100px]" />
        <div className="absolute bottom-1/4 left-1/4 w-60 h-60 rounded-full bg-violet-500/10 blur-[80px]" />
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
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-[10px] tracking-[0.3em] text-zinc-300 font-bold uppercase">
              Pendaftaran
            </span>
          </div>

          <h1 className="text-4xl xl:text-5xl font-extrabold text-white leading-tight tracking-tight mb-4">
            Pendaftaran Akun<br />
            <span className="bg-gradient-to-r from-cyan-400 via-violet-400 to-pink-400 bg-clip-text text-transparent">
              Angkatan &apos;22
            </span>
          </h1>
          <p className="text-sm text-zinc-400 leading-relaxed max-w-sm mx-auto mb-10">
            Daftarkan dirimu dan mulai mengelola profilemu
          </p>
        </div>

        <p className="absolute bottom-6 text-[10px] text-zinc-600 tracking-widest">
          INFORMATIKA UNIVERSITAS — ANGKATAN 2022
        </p>
      </div>

      {/* ─── RIGHT PANEL – Form ─── */}
      <div className="w-full lg:w-7/12 flex flex-col items-center justify-center p-6 sm:p-10 relative">
        <div className="absolute inset-0 bg-[#030712]">
          <div className="absolute inset-0 lg:hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-cyan-950/30 via-[#030712] to-[#030712]" />
          </div>
        </div>

        <div className="relative z-10 w-full max-w-lg">
          {/* Mobile logo */}
          <div className="flex lg:hidden items-center gap-3 mb-8">
            <div className="flex items-center justify-center w-10 h-10 rounded-2xl bg-gradient-to-br from-cyan-500 to-violet-600 shadow-lg shadow-cyan-500/20">
              <GraduationCap size={18} className="text-white" />
            </div>
            <span className="text-sm font-bold text-white tracking-tight">
              Yearbook <span className="text-cyan-400">Portal</span>
            </span>
          </div>

          {/* Header */}
          <div className="mb-8">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Daftar Akun Baru
            </h2>
            <p className="text-sm text-zinc-500 mt-1.5">
              Sudah punya akun?{" "}
              <Link
                href="/login"
                className="text-cyan-400 hover:text-cyan-300 font-semibold transition-colors"
              >
                Masuk sekarang →
              </Link>
            </p>
          </div>

          {/* Step indicator */}
          <div className="flex items-center justify-between mb-8 relative">
            {/* Progress line */}
            <div className="absolute top-4 left-0 right-0 h-px bg-white/8 mx-4" />
            <div
              className="absolute top-4 left-4 h-px bg-gradient-to-r from-violet-500 to-cyan-500 transition-all duration-700"
              style={{ width: `${((step - 1) / 2) * (100 - 8)}%` }}
            />
            <StepDot n={1} />
            <StepDot n={2} />
            <StepDot n={3} />
          </div>

          {/* ─ STEP 1: Identity ─ */}
          {step === 1 && (
            <div className="space-y-5 animate-fade-in">
              <div className="space-y-2">
                <label className="text-[11px] tracking-[0.15em] text-zinc-400 font-bold uppercase">
                  Nomor Induk Mahasiswa (NIM)
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: 220101099"
                  value={nim}
                  onChange={(e) => setNim(e.target.value)}
                  className="w-full bg-white/[0.04] text-sm text-white pl-4 pr-4 py-3.5 rounded-2xl border border-white/8 focus:border-cyan-500/50 focus:outline-none focus:ring-2 focus:ring-cyan-500/15 transition-all font-mono placeholder:text-zinc-600 hover:border-white/15"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[11px] tracking-[0.15em] text-zinc-400 font-bold uppercase">
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  required
                  placeholder="Nama sesuai KTP / dokumen akademik"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-white/[0.04] text-sm text-white pl-4 pr-4 py-3.5 rounded-2xl border border-white/8 focus:border-cyan-500/50 focus:outline-none focus:ring-2 focus:ring-cyan-500/15 transition-all placeholder:text-zinc-600 hover:border-white/15"
                />
              </div>

              {errorMsg && <ErrorBox msg={errorMsg} />}

              <button
                onClick={goNext}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-cyan-600 to-violet-600 hover:from-cyan-500 hover:to-violet-500 text-sm font-bold text-white shadow-xl shadow-cyan-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
              >
                Lanjut ke Konsentrasi
                <ArrowRight size={15} />
              </button>
            </div>
          )}

          {/* ─ STEP 2: Specialization ─ */}
          {step === 2 && (
            <div className="space-y-5 animate-fade-in">
              <p className="text-xs text-zinc-400 leading-relaxed">
                Pilih konsentrasi program studi kamu di Informatika &apos;22:
              </p>

              <div className="grid gap-4">
                {SPECIALIZATIONS.map((spec) => {
                  const Icon = spec.icon;
                  const selected = specialization === spec.id;
                  return (
                    <button
                      key={spec.id}
                      type="button"
                      onClick={() =>
                        setSpecialization(
                          spec.id as
                          | "Business Intelligence"
                          | "Smart Agriculture"
                        )
                      }
                      className={`group w-full text-left flex items-start gap-4 p-5 rounded-2xl border transition-all duration-300 cursor-pointer ${selected
                        ? `bg-gradient-to-br ${spec.color} bg-opacity-10 border-white/30 shadow-xl`
                        : "bg-white/[0.03] border-white/8 hover:bg-white/[0.06] hover:border-white/15"
                        }`}
                    >
                      <div
                        className={`p-2.5 rounded-xl shrink-0 transition-all ${selected
                          ? `bg-white/20 text-white`
                          : "bg-white/5 text-zinc-400 group-hover:text-zinc-200"
                          }`}
                      >
                        <Icon size={20} />
                      </div>
                      <div className="flex-1">
                        <p
                          className={`text-sm font-bold mb-1 transition-colors ${selected ? "text-white" : "text-zinc-300"
                            }`}
                        >
                          {spec.label}
                        </p>
                        <p
                          className={`text-[11px] transition-colors ${selected ? "text-white/70" : "text-zinc-500"
                            }`}
                        >
                          {spec.desc}
                        </p>
                      </div>
                      {selected && (
                        <CheckCircle2
                          size={18}
                          className="text-white shrink-0 mt-0.5"
                        />
                      )}
                    </button>
                  );
                })}
              </div>

              {errorMsg && <ErrorBox msg={errorMsg} />}

              <div className="flex gap-3">
                <button
                  onClick={() => { setStep(1); setErrorMsg(""); }}
                  className="flex-1 py-3.5 rounded-2xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.06] text-sm font-semibold text-zinc-400 hover:text-white transition-all cursor-pointer"
                >
                  ← Kembali
                </button>
                <button
                  onClick={goNext}
                  className="flex-[2] py-3.5 rounded-2xl bg-gradient-to-r from-violet-600 to-pink-600 hover:from-violet-500 hover:to-pink-500 text-sm font-bold text-white shadow-xl shadow-violet-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  Lanjut ke Password
                  <ArrowRight size={15} />
                </button>
              </div>
            </div>
          )}

          {/* ─ STEP 3: Password ─ */}
          {step === 3 && (
            <form onSubmit={handleRegister} className="space-y-5 animate-fade-in">
              {/* Summary card */}
              <div className="flex items-center gap-3 bg-white/[0.04] border border-white/8 rounded-2xl p-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-cyan-500 flex items-center justify-center shrink-0">
                  <GraduationCap size={18} className="text-white" />
                </div>
                <div>
                  <p className="text-sm font-bold text-white">{name}</p>
                  <p className="text-[10px] text-zinc-500 font-mono">
                    NIM {nim} · {specialization}
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[11px] tracking-[0.15em] text-zinc-400 font-bold uppercase">
                  Buat Password
                </label>
                <div className="relative">
                  <input
                    type={showPass ? "text" : "password"}
                    required
                    placeholder="Minimal 6 karakter"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-white/[0.04] text-sm text-white pl-4 pr-12 py-3.5 rounded-2xl border border-white/8 focus:border-violet-500/50 focus:outline-none focus:ring-2 focus:ring-violet-500/15 transition-all font-mono placeholder:text-zinc-600 hover:border-white/15"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors"
                  >
                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[11px] tracking-[0.15em] text-zinc-400 font-bold uppercase">
                  Konfirmasi Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirm ? "text" : "password"}
                    required
                    placeholder="Ulangi password di atas"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={`w-full bg-white/[0.04] text-sm text-white pl-4 pr-12 py-3.5 rounded-2xl border transition-all font-mono placeholder:text-zinc-600 focus:outline-none focus:ring-2 ${confirmPassword && confirmPassword !== password
                      ? "border-red-500/40 focus:ring-red-500/15"
                      : confirmPassword && confirmPassword === password
                        ? "border-emerald-500/40 focus:ring-emerald-500/15"
                        : "border-white/8 hover:border-white/15 focus:border-violet-500/50 focus:ring-violet-500/15"
                      }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors"
                  >
                    {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                  {confirmPassword && confirmPassword === password && (
                    <CheckCircle2
                      size={14}
                      className="absolute right-10 top-1/2 -translate-y-1/2 text-emerald-400"
                    />
                  )}
                </div>
              </div>

              {/* Strength hint */}
              {password && (
                <div className="flex items-center gap-2">
                  {[...Array(4)].map((_, i) => (
                    <div
                      key={i}
                      className={`flex-1 h-1 rounded-full transition-all duration-300 ${i < Math.min(Math.floor(password.length / 3), 4)
                        ? password.length < 6
                          ? "bg-red-500"
                          : password.length < 10
                            ? "bg-amber-500"
                            : "bg-emerald-500"
                        : "bg-white/10"
                        }`}
                    />
                  ))}
                  <span className="text-[10px] text-zinc-500 shrink-0 w-14 text-right">
                    {password.length < 6
                      ? "Lemah"
                      : password.length < 10
                        ? "Sedang"
                        : "Kuat"}
                  </span>
                </div>
              )}

              {errorMsg && <ErrorBox msg={errorMsg} />}

              <div className="flex gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => { setStep(2); setErrorMsg(""); }}
                  className="flex-1 py-3.5 rounded-2xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.06] text-sm font-semibold text-zinc-400 hover:text-white transition-all cursor-pointer"
                >
                  ← Kembali
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-[2] py-3.5 rounded-2xl bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-500 hover:to-cyan-500 text-sm font-bold text-white shadow-xl shadow-violet-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                      Mendaftar...
                    </>
                  ) : (
                    <>
                      <UserPlus size={14} />
                      Daftar Sekarang
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* Back to home */}
          <p className="text-center text-[11px] text-zinc-600 mt-8">
            <Link href="/" className="hover:text-zinc-400 transition-colors">
              ← Kembali ke halaman utama
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

function ErrorBox({ msg }: { msg: string }) {
  return (
    <div className="flex items-start gap-2.5 bg-red-500/8 border border-red-500/20 rounded-2xl px-4 py-3">
      <AlertCircle size={14} className="text-red-400 mt-0.5 shrink-0" />
      <p className="text-xs text-red-400 font-medium">{msg}</p>
    </div>
  );
}
