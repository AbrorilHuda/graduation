"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Sparkles,
  Lock,
  Unlock,
  LogOut,
  CheckCircle,
  Settings,
  Shield,
  User,
  Camera,
  BookOpen,
  Award,
  ChevronRight,
  RefreshCw,
  Plus,
  Loader2
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ParticleBackground from "@/components/ParticleBackground";
import {
  Student,
  getStoredUser,
  setStoredUser,
  logoutUser,
  computeStudentStatus,
  fetchAllStudents,
  updateStudentProfile,
  updateMilestone,
} from "@/lib/db";

// Cool 3D glowing virtual avatars that students can choose from as presets
const AVATAR_PRESETS = [
  { name: "Cyan Sparkle", url: "/images/student_2.png" },
];

export default function DashboardPage() {
  const router = useRouter();
  const [students, setStudents] = useState<Student[]>([]);
  const [currentUser, setCurrentUser] = useState<Student | null>(null);
  const [activeTab, setActiveTab] = useState<"profile" | "admin">("profile");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Edit fields for active student
  const [editName, setEditName] = useState("");
  const [editQuote, setEditQuote] = useState("");
  const [editSpecialization, setEditSpecialization] = useState<Student["specialization"]>("Business Intelligence");
  const [editImage, setEditImage] = useState("");
  const [customImageUrl, setCustomImageUrl] = useState("");
  const [feedbackMsg, setFeedbackMsg] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const initForm = (user: Student) => {
    setEditName(user.name);
    setEditQuote(user.quote);
    setEditSpecialization(user.specialization);
    setEditImage(user.image);
    const isPreset = AVATAR_PRESETS.some((preset) => preset.url === user.image);
    if (!isPreset && user.image.startsWith("http")) {
      setCustomImageUrl(user.image);
    } else {
      setCustomImageUrl("");
    }
  };

  // Load students & active user session
  const loadData = useCallback(async () => {
    const active = getStoredUser();
    if (!active) {
      router.push("/login");
      return;
    }

    setIsLoading(true);
    try {
      const loadedStudents = await fetchAllStudents();
      setStudents(loadedStudents);

      // Refresh current user data dari Supabase
      const latest = loadedStudents.find((s) => s.nim === active.nim);
      if (latest) {
        setCurrentUser(latest);
        setStoredUser(latest);
        initForm(latest);
        if (latest.role === "admin") {
          setActiveTab("admin");
        } else {
          setActiveTab("profile");
        }
      } else {
        // Student dihapus atau tidak ditemukan
        setCurrentUser(active);
        initForm(active);
      }
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Handle Secure Logout
  const handleLogout = () => {
    logoutUser();
    setCurrentUser(null);
    router.push("/login");
  };

  // Handle Saving Profile Info
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    const imgToSave = customImageUrl ? customImageUrl : editImage;

    setIsSaving(true);
    try {
      const { success, error } = await updateStudentProfile(currentUser.nim, {
        name: editName,
        quote: editQuote,
        specialization: editSpecialization,
        avatar_url: imgToSave,
      });

      if (!success) {
        setFeedbackMsg(`Gagal menyimpan: ${error}`);
        setTimeout(() => setFeedbackMsg(""), 3000);
        return;
      }

      // Refresh data dari server
      await loadData();
      setFeedbackMsg("Profile personalized successfully!");
      setTimeout(() => setFeedbackMsg(""), 3000);
    } finally {
      setIsSaving(false);
    }
  };

  // Handle Avatar File Upload → Supabase Storage
  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !currentUser) return;

    setUploadError("");
    setIsUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("student_nim", currentUser.nim);
      // Kirim URL lama agar server bisa menghapusnya dari bucket
      const oldUrl = currentUser.image;
      if (oldUrl && oldUrl.startsWith("http") && oldUrl.includes("/avatars/")) {
        fd.append("old_path", oldUrl);
      }

      const res = await fetch("/api/upload-avatar", { method: "POST", body: fd });
      const data = await res.json();

      if (!res.ok) {
        setUploadError(data.error ?? "Gagal mengupload foto.");
        return;
      }

      // Update state langsung — user bisa langsung melihat preview baru
      setEditImage(data.url);
      setCustomImageUrl("");
    } catch (err: any) {
      setUploadError("Koneksi gagal saat mengupload foto.");
    } finally {
      setIsUploading(false);
      // Reset file input agar pengguna bisa upload file yang sama lagi
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  // Admin Toggle Checklist Milestone Action
  const handleToggleMilestone = async (nim: string, milestoneKey: keyof Student["milestones"]) => {
    if (!currentUser) return;

    // Optimistic update — langsung update UI, lalu sync ke server
    const targetStudent = students.find((s) => s.nim === nim);
    if (!targetStudent) return;

    const newValue = !targetStudent.milestones[milestoneKey];
    const nextMilestones = { ...targetStudent.milestones, [milestoneKey]: newValue };
    const computed = computeStudentStatus(nextMilestones);

    const optimisticStudents = students.map((s) => {
      if (s.nim === nim) {
        return { ...s, milestones: nextMilestones, ...computed };
      }
      return s;
    });
    setStudents(optimisticStudents);

    // Sync ke server
    const { success, error } = await updateMilestone(
      currentUser.nim,
      nim,
      milestoneKey,
      newValue
    );

    if (!success) {
      console.error("[Dashboard] Toggle milestone failed:", error);
      // Revert jika gagal
      await loadData();
    } else if (currentUser.nim === nim) {
      // Update session jika admin toggle miliknya sendiri
      const updatedSelf = optimisticStudents.find((s) => s.nim === nim);
      if (updatedSelf) {
        setCurrentUser(updatedSelf);
        setStoredUser(updatedSelf);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen bg-void font-sans items-center justify-center">
        <Loader2 size={32} className="text-neon-purple animate-spin mb-3" />
        <p className="text-xs text-zinc-500 tracking-widest uppercase">Memuat data...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-void font-sans select-none overflow-x-hidden text-zinc-100">

      {/* STICKY NAVBAR */}
      <Navbar />

      {/* DYNAMIC HEADER */}
      <header className="relative min-h-[35vh] flex items-center justify-center pt-32 pb-12 px-4 overflow-hidden cyber-grid border-b border-white/5">
        <ParticleBackground />

        {/* Glow Spheres */}
        <div className="absolute top-1/4 left-1/3 w-[30vw] h-[30vw] max-w-[300px] rounded-full bg-neon-purple/10 blur-[90px] -z-10 animate-float-slow" />
        <div className="absolute bottom-1/4 right-1/4 w-[25vw] h-[25vw] max-w-[250px] rounded-full bg-neon-blue/10 blur-[80px] -z-10 animate-float-medium" />

        <div className="relative z-10 max-w-4xl mx-auto text-center flex flex-col items-center">
          <div className="inline-flex items-center gap-1.5 bg-zinc-950/80 px-3.5 py-1.5 rounded-full border border-white/5 mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-neon-purple shadow-sm shadow-neon-purple animate-pulse" />
            <span className="text-[10px] tracking-[0.25em] text-zinc-300 font-extrabold uppercase font-display">
              YEARBOOK CONTROLS
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-display font-extrabold tracking-tight text-white leading-none">
            Portal Dashboard
          </h1>

          <p className="text-xs sm:text-sm text-zinc-400 mt-3 max-w-lg leading-relaxed font-sans">
            {currentUser
              ? `Logged in as ${currentUser.name} • Customize graduation certificates and showcase details.`
              : "Authenticating session status..."}
          </p>
        </div>
      </header>

      {/* DASHBOARD WORKSPACE CONTAINER */}
      <main className="flex-grow py-12 px-4 max-w-7xl mx-auto w-full z-20">

        {currentUser && (
          /* SECURE LOGGED-IN PORTAL WORKSPACE */
          <div className="space-y-8 animate-fade-in">
            {/* LOGGED IN USER OVERVIEW ROW */}
            <div className="glass-panel border border-white/10 p-6 md:p-8 rounded-3xl shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden bg-gradient-to-r from-zinc-950 via-zinc-950 to-purple-950/20">
              <div className="flex flex-col sm:flex-row items-center gap-6">
                <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-white/10 shadow-lg relative bg-void/50 shrink-0">
                  <img src={currentUser.image} alt={currentUser.name} className="w-full h-full object-cover" />
                </div>
                <div className="text-center sm:text-left space-y-1">
                  <div className="flex flex-wrap justify-center sm:justify-start items-center gap-2">
                    <h2 className="text-xl md:text-2xl font-bold font-display text-white tracking-wide">
                      {currentUser.name}
                    </h2>
                    <span className={`text-[8px] font-display font-extrabold tracking-wider uppercase px-2 py-0.5 rounded-full border ${currentUser.badgeClass}`}>
                      {currentUser.status}
                    </span>
                    {currentUser.role === "admin" && (
                      <span className="text-[8px] tracking-wider uppercase font-bold px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                        ADMIN
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-zinc-400 font-mono">
                    Student ID (NIM): {currentUser.nim} • Track: {currentUser.specialization}
                  </p>
                  <p className="text-[10px] text-zinc-500 italic max-w-sm">
                    "{currentUser.quote}"
                  </p>
                </div>
              </div>

              {/* Top Controls (Tabs toggle / Logout) */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0 w-full md:w-auto">
                {currentUser.role === "admin" && (
                  <div className="flex bg-zinc-950/80 p-1.5 rounded-full border border-white/5 gap-1.5 w-fit self-center">
                    <button
                      onClick={() => setActiveTab("admin")}
                      className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[10px] font-bold tracking-wider uppercase transition-all duration-300 ${activeTab === "admin"
                        ? "bg-zinc-800 text-amber-400 border border-amber-500/30"
                        : "text-zinc-400 hover:text-zinc-100"
                        }`}
                    >
                      <Shield size={10} />
                      ADMIN WORKSPACE
                    </button>
                    <button
                      onClick={() => setActiveTab("profile")}
                      className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[10px] font-bold tracking-wider uppercase transition-all duration-300 ${activeTab === "profile"
                        ? "bg-zinc-800 text-neon-cyan border-neon-cyan/30"
                        : "text-zinc-400 hover:text-zinc-100"
                        }`}
                    >
                      <Settings size={10} />
                      EDIT MY PROFILE
                    </button>
                  </div>
                )}

                <button
                  onClick={handleLogout}
                  className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-full text-[10px] font-extrabold tracking-widest text-zinc-400 hover:text-red-400 hover:bg-red-500/5 hover:border-red-500/20 border border-white/5 transition-all font-display uppercase w-full sm:w-auto"
                >
                  <LogOut size={12} />
                  LOGOUT
                </button>
              </div>
            </div>

            {/* TAB CONTAINER WORKSPACE */}
            <div className="transition-all duration-500">

              {/* TAB 1: COHORT ADMINISTRATION (ADMIN ONLY) */}
              {currentUser.role === "admin" && activeTab === "admin" && (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h2 className="text-xl font-bold font-display text-white tracking-wide flex items-center gap-2">
                        <Award size={18} className="text-amber-400 animate-pulse" />
                        Classmate Graduation Administration Panel
                      </h2>
                      <p className="text-xs text-zinc-400 font-sans mt-0.5">
                        Manage cohort proposal reviews, seminar evaluations, and thesis defenses. Toggles automatically unlock scratch card degree banners in the directory.
                      </p>
                    </div>
                  </div>

                  <div className="glass-panel border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-zinc-950/90 text-[10px] text-zinc-400 font-extrabold tracking-widest uppercase border-b border-white/5">
                            <th className="p-4 pl-6">Student Info</th>
                            <th className="p-4 text-center">Proposal Review</th>
                            <th className="p-4 text-center">Seminar Result (SemPro)</th>
                            <th className="p-4 text-center">Thesis Defense (SemHas)</th>
                            <th className="p-4 text-center">Convocation (Graduated)</th>
                            <th className="p-4 pr-6 text-right">Computed Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5 text-xs">
                          {students.map((student) => (
                            <tr key={student.nim} className="hover:bg-white/[0.02] transition-colors group">
                              {/* Student Identity */}
                              <td className="p-4 pl-6">
                                <div className="flex items-center gap-3">
                                  <div className="w-9 h-9 rounded-full overflow-hidden border border-white/10 shrink-0 bg-void/50">
                                    <img src={student.image} alt={student.name} className="w-full h-full object-cover" />
                                  </div>
                                  <div>
                                    <h4 className="font-bold text-white group-hover:text-neon-cyan transition-colors">
                                      {student.name}
                                    </h4>
                                    <span className="text-[9px] text-zinc-500 font-mono">NIM {student.nim} • {student.specialization}</span>
                                  </div>
                                </div>
                              </td>

                              {/* Milestone 1: Proposal */}
                              <td className="p-4 text-center">
                                <label className="relative inline-flex items-center justify-center cursor-pointer">
                                  <input
                                    type="checkbox"
                                    checked={student.milestones.proposal}
                                    onChange={() => handleToggleMilestone(student.nim, "proposal")}
                                    className="sr-only peer"
                                  />
                                  <div className="w-9 h-5 bg-zinc-900 rounded-full border border-white/10 peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[3px] after:bg-zinc-400 peer-checked:after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-neon-cyan peer-checked:border-neon-cyan/20" />
                                </label>
                              </td>

                              {/* Milestone 2: Seminar */}
                              <td className="p-4 text-center">
                                <label className="relative inline-flex items-center justify-center cursor-pointer">
                                  <input
                                    type="checkbox"
                                    checked={student.milestones.seminar}
                                    onChange={() => handleToggleMilestone(student.nim, "seminar")}
                                    className="sr-only peer"
                                  />
                                  <div className="w-9 h-5 bg-zinc-900 rounded-full border border-white/10 peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[3px] after:bg-zinc-400 peer-checked:after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-neon-purple peer-checked:border-neon-purple/20" />
                                </label>
                              </td>

                              {/* Milestone 3: Defense */}
                              <td className="p-4 text-center">
                                <label className="relative inline-flex items-center justify-center cursor-pointer">
                                  <input
                                    type="checkbox"
                                    checked={student.milestones.defense}
                                    onChange={() => handleToggleMilestone(student.nim, "defense")}
                                    className="sr-only peer"
                                  />
                                  <div className="w-9 h-5 bg-zinc-900 rounded-full border border-white/10 peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[3px] after:bg-zinc-400 peer-checked:after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-neon-blue peer-checked:border-neon-blue/20" />
                                </label>
                              </td>

                              {/* Milestone 4: Graduation */}
                              <td className="p-4 text-center">
                                <label className="relative inline-flex items-center justify-center cursor-pointer">
                                  <input
                                    type="checkbox"
                                    checked={student.milestones.graduation}
                                    onChange={() => handleToggleMilestone(student.nim, "graduation")}
                                    className="sr-only peer"
                                  />
                                  <div className="w-9 h-5 bg-zinc-900 rounded-full border border-white/10 peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[3px] after:bg-zinc-400 peer-checked:after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-500 peer-checked:border-amber-500/20" />
                                </label>
                              </td>

                              {/* Computed status output column */}
                              <td className="p-4 pr-6 text-right font-display font-semibold uppercase tracking-wider text-[9px]">
                                <span className={`px-2 py-0.5 rounded border ${student.badgeClass}`}>
                                  {student.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: PROFILE SETTINGS */}
              {(currentUser.role !== "admin" || activeTab === "profile") && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                  {/* Left Column Form customizer */}
                  <form onSubmit={handleSaveProfile} className="lg:col-span-8 glass-panel border border-white/10 p-6 md:p-8 rounded-3xl shadow-2xl space-y-6">
                    <h2 className="text-xl font-bold font-display text-white tracking-wide flex items-center gap-2">
                      <Settings size={18} className="text-neon-cyan animate-spin-slow" />
                      Personalize Profile Details
                    </h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      {/* Name input */}
                      <div className="space-y-2">
                        <label className="text-[10px] tracking-wider text-zinc-400 uppercase font-bold">
                          Student Name
                        </label>
                        <input
                          type="text"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          required
                          className="w-full bg-zinc-950/80 text-xs text-zinc-200 px-4 py-3 rounded-xl border border-white/5 focus:border-neon-cyan/40 focus:outline-none transition-all"
                        />
                      </div>

                      {/* Specialization select */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <label className="text-[10px] tracking-wider text-zinc-400 uppercase font-bold">
                            Specialization Track
                          </label>
                          <span className="inline-flex items-center gap-1 text-[8px] bg-red-500/10 text-red-400 border border-red-500/20 px-2 py-0.5 rounded uppercase font-bold font-display">
                            🔒 Locked
                          </span>
                        </div>
                        <select
                          value={editSpecialization}
                          onChange={(e) => setEditSpecialization(e.target.value as any)}
                          disabled
                          className="w-full bg-zinc-950/80 text-xs text-zinc-200 px-4 py-3 rounded-xl border border-white/5 focus:border-neon-cyan/40 focus:outline-none transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                          <option value="Business Intelligence">Business Intelligence</option>
                          <option value="Smart Agriculture">Smart Agriculture</option>
                        </select>
                      </div>
                    </div>

                    {/* Quote text area */}
                    <div className="space-y-2">
                      <label className="text-[10px] tracking-wider text-zinc-400 uppercase font-bold block">
                        Academic Yearbook Quote (Max 160 Characters)
                      </label>
                      <textarea
                        value={editQuote}
                        onChange={(e) => setEditQuote(e.target.value)}
                        maxLength={160}
                        required
                        rows={3}
                        className="w-full bg-zinc-950/80 text-xs text-zinc-200 px-4 py-3.5 rounded-xl border border-white/5 focus:border-neon-cyan/40 focus:outline-none transition-all resize-none leading-relaxed"
                      />
                    </div>

                    {/* Profile Photo selector */}
                    <div className="space-y-4 pt-2">
                      <div>
                        <label className="text-[10px] tracking-wider text-zinc-400 uppercase font-bold block">
                          Profile Portrait Image Customization
                        </label>
                        <p className="text-[10px] text-zinc-500 font-sans mt-0.5">
                          Upload foto langsung ke cloud, pilih preset, atau masukkan URL gambar.
                        </p>
                      </div>

                      {/* Upload dari perangkat */}
                      <div className="space-y-2">
                        <label className="text-[9px] tracking-wider text-zinc-500 uppercase font-bold block">
                          Upload Foto Profil (JPG · PNG · WebP · maks 5 MB)
                        </label>

                        {/* Hidden file input */}
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/jpeg,image/png,image/webp,image/gif"
                          className="hidden"
                          id="avatar-file-input"
                          onChange={handleAvatarUpload}
                        />

                        <div className="flex items-center gap-3">
                          {/* Current preview thumbnail */}
                          <div className="relative w-14 h-14 rounded-xl overflow-hidden border border-white/10 shrink-0">
                            {(editImage || currentUser?.image) ? (
                              <img
                                src={editImage || currentUser?.image}
                                alt="Preview"
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full bg-zinc-800 flex items-center justify-center">
                                <User size={20} className="text-zinc-600" />
                              </div>
                            )}
                            {isUploading && (
                              <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                                <Loader2 size={16} className="animate-spin text-neon-cyan" />
                              </div>
                            )}
                          </div>

                          {/* Upload button */}
                          <label
                            htmlFor="avatar-file-input"
                            className={`cursor-pointer flex items-center gap-2 px-4 py-2.5 rounded-xl border text-xs font-bold tracking-wider uppercase transition-all
                              ${isUploading
                                ? "border-zinc-700 text-zinc-500 cursor-not-allowed"
                                : "border-neon-cyan/30 text-neon-cyan hover:bg-neon-cyan/10 hover:border-neon-cyan/60"
                              }`}
                          >
                            {isUploading ? (
                              <>
                                <Loader2 size={12} className="animate-spin" />
                                Mengupload...
                              </>
                            ) : (
                              <>
                                <Camera size={12} />
                                Pilih Foto
                              </>
                            )}
                          </label>

                          {/* Success indicator */}
                          {editImage && editImage.includes("/storage/v1/object/public/avatars/") && !isUploading && (
                            <span className="flex items-center gap-1 text-[10px] text-green-400 font-bold">
                              <CheckCircle size={11} />
                              Tersimpan di cloud
                            </span>
                          )}
                        </div>

                        {/* Error message */}
                        {uploadError && (
                          <p className="text-[10px] text-red-400 font-mono mt-1">{uploadError}</p>
                        )}
                      </div>

                      {/* Presets Grid */}
                      <div className="space-y-2">
                        <label className="text-[9px] tracking-wider text-zinc-500 uppercase font-bold block">
                          Atau pilih avatar preset
                        </label>
                        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                          {AVATAR_PRESETS.map((preset) => (
                            <div
                              key={preset.name}
                              onClick={() => {
                                setEditImage(preset.url);
                                setCustomImageUrl("");
                              }}
                              className={`group relative aspect-square rounded-xl overflow-hidden border cursor-pointer shrink-0 transition-all ${editImage === preset.url && !customImageUrl
                                ? "border-neon-cyan shadow-md shadow-neon-cyan/15 scale-105"
                                : "border-white/5 hover:border-white/20 hover:scale-102"
                                }`}
                            >
                              <img src={preset.url} alt={preset.name} className="w-full h-full object-cover" />
                              <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <span className="text-[8px] text-white font-bold tracking-widest uppercase">SELECT</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Custom image URL input */}
                      <div className="space-y-2">
                        <label className="text-[9px] tracking-wider text-zinc-500 uppercase font-bold block">
                          Atau masukkan URL gambar dari internet
                        </label>
                        <input
                          type="url"
                          placeholder="Paste a dynamic image URL (e.g. https://images.unsplash.com/...)"
                          value={customImageUrl}
                          onChange={(e) => {
                            setCustomImageUrl(e.target.value);
                            setEditImage(e.target.value);
                          }}
                          className="w-full bg-zinc-950/80 text-xs text-zinc-200 px-4 py-3 rounded-xl border border-white/5 focus:border-neon-cyan/40 focus:outline-none transition-all font-mono"
                        />
                      </div>
                    </div>

                    {/* Action buttons & feedback */}
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-white/5">
                      <div className="text-xs text-neon-cyan font-bold tracking-wider font-mono">
                        {feedbackMsg && (
                          <span className="flex items-center gap-1.5 animate-pulse">
                            <CheckCircle size={14} />
                            {feedbackMsg}
                          </span>
                        )}
                      </div>

                      <button
                        type="submit"
                        disabled={isSaving}
                        className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-neon-cyan to-neon-blue hover:from-neon-cyan hover:to-neon-purple text-xs font-extrabold tracking-widest text-white shadow-lg shadow-neon-cyan/25 transition-all font-display uppercase disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2 justify-center"
                      >
                        {isSaving ? (
                          <>
                            <Loader2 size={12} className="animate-spin" />
                            SAVING...
                          </>
                        ) : (
                          "SAVE PROFILE DETAILS"
                        )}
                      </button>
                    </div>
                  </form>

                  {/* Right Column Real-Time Preview Card */}
                  <div className="lg:col-span-4 space-y-4">
                    <span className="text-[10px] tracking-[0.25em] text-zinc-500 font-bold uppercase font-display block text-center">
                      REAL-TIME DIRECTORY PREVIEW
                    </span>

                    <div className={`p-6 rounded-2xl glass-panel flex flex-col justify-between min-h-[460px] border border-white/5 overflow-hidden transition-all duration-500 shadow-2xl relative ${currentUser.glowClass
                      }`}>
                      <div>
                        {/* Header with NIM and Status Progress Badge */}
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-mono text-zinc-500 font-semibold">NIM • {currentUser.nim}</span>
                          <span className={`text-[8px] font-display font-extrabold tracking-wider uppercase px-2.5 py-1 rounded-full border ${currentUser.badgeClass}`}>
                            {currentUser.status}
                          </span>
                        </div>

                        {/* Profile Photo */}
                        <div className="my-6 relative aspect-[4/3] rounded-xl overflow-hidden border border-white/5 bg-void/50">
                          <img
                            src={customImageUrl ? customImageUrl : editImage}
                            alt={editName}
                            className="w-full h-full object-cover transition-transform duration-700"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent opacity-85" />
                          <span className="absolute bottom-3 left-3 bg-zinc-950/90 text-zinc-300 text-[8px] font-bold tracking-widest uppercase border border-white/10 px-2 py-0.5 rounded-md">
                            {editSpecialization}
                          </span>
                        </div>

                        {/* Full Name & Title */}
                        <h3 className="text-lg font-bold font-display text-white tracking-wide">
                          {editName}, {currentUser.status === "Graduated" ? currentUser.title : "S.Kom. (Cand.)"}
                        </h3>

                        {/* Quote */}
                        <p className="text-xs text-zinc-400 mt-3.5 leading-relaxed italic border-l-2 border-neon-purple/30 pl-3 max-h-[80px] overflow-hidden text-ellipsis">
                          "{editQuote}"
                        </p>
                      </div>

                      {/* Dynamic stepper showing underlay reveal potential */}
                      <div className="mt-4 pt-4 border-t border-white/5 text-[9px] text-zinc-500 font-mono tracking-wider">
                        CERTIFIED DATABASE RECORD
                      </div>
                    </div>
                  </div>

                </div>
              )}

            </div>
          </div>
        )}

      </main>

      {/* FOOTER */}
      <Footer />

    </div>
  );
}
