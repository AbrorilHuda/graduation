"use client";

export interface Student {
  nim: string;
  name: string;
  specialization: "Business Intelligence" | "Smart Agriculture";
  status: "Graduated" | "Defense Completed" | "Seminar Completed" | "Thesis In Progress";
  title: string;
  quote: string;
  image: string;
  theme: string;
  glowClass: string;
  badgeClass: string;
  milestones: {
    proposal: boolean;
    seminar: boolean;
    defense: boolean;
    graduation: boolean;
  };
  role?: "admin" | "student";
}

export const INITIAL_GRADUATES: Student[] = [
  {
    nim: "220101014",
    name: "Clara Dian Paramitha",
    specialization: "Business Intelligence",
    status: "Graduated",
    title: "S.Kom.",
    quote: "Analyzing data taught me how to find truth; four years of friendship taught me how to find joy.",
    image: "/images/student_1.png",
    theme: "from-purple-500 via-pink-500 to-indigo-600",
    glowClass: "glow-hover-gold",
    badgeClass: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    milestones: { proposal: true, seminar: true, defense: true, graduation: true },
    role: "admin"
  },
  {
    nim: "220101032",
    name: "Fahri Hamzah",
    specialization: "Smart Agriculture",
    status: "Defense Completed",
    title: "S.Kom. (Cand.)",
    quote: "Code that irrigation micro-sensor right, and you feed a village. We made every single loop count.",
    image: "/images/student_2.png",
    theme: "from-cyan-500 via-blue-500 to-indigo-600",
    glowClass: "glow-hover-blue",
    badgeClass: "bg-neon-blue/10 text-neon-blue border-neon-blue/20",
    milestones: { proposal: true, seminar: true, defense: true, graduation: false },
    role: "student"
  },
  {
    nim: "220101048",
    name: "Gita Lestari",
    specialization: "Business Intelligence",
    status: "Seminar Completed",
    title: "S.Kom. (Cand.)",
    quote: "Behind every intelligence report is a testament of our collaborative lab nights.",
    image: "/images/student_3.png",
    theme: "from-fuchsia-500 to-pink-600",
    glowClass: "glow-hover-purple",
    badgeClass: "bg-neon-purple/10 text-neon-purple border-neon-purple/20",
    milestones: { proposal: true, seminar: true, defense: false, graduation: false },
    role: "student"
  },
  {
    nim: "220101089",
    name: "Kevin Wijaya",
    specialization: "Smart Agriculture",
    status: "Graduated",
    title: "S.Kom.",
    quote: "From soil monitoring IoT nodes to the graduation stage, our growth was beautiful.",
    image: "/images/student_4.png",
    theme: "from-emerald-500 via-teal-500 to-cyan-500",
    glowClass: "glow-hover-gold",
    badgeClass: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    milestones: { proposal: true, seminar: true, defense: true, graduation: true },
    role: "student"
  }
];

// Helper to determine status and styles based on milestone checkboxes
export function computeStudentStatus(milestones: {
  proposal: boolean;
  seminar: boolean;
  defense: boolean;
  graduation: boolean;
}) {
  let status: Student["status"] = "Thesis In Progress";
  let title = "S.Kom. (Cand.)";
  let glowClass = "glow-hover-cyan";
  let badgeClass = "bg-neon-cyan/10 text-neon-cyan border-neon-cyan/20";
  let theme = "from-cyan-500 via-blue-500 to-indigo-600";

  if (milestones.proposal && milestones.seminar && milestones.defense && milestones.graduation) {
    status = "Graduated";
    title = "S.Kom.";
    glowClass = "glow-hover-gold";
    badgeClass = "bg-amber-500/10 text-amber-400 border-amber-500/20";
    theme = "from-purple-500 via-pink-500 to-indigo-600";
  } else if (milestones.proposal && milestones.seminar && milestones.defense) {
    status = "Defense Completed";
    glowClass = "glow-hover-blue";
    badgeClass = "bg-neon-blue/10 text-neon-blue border-neon-blue/20";
    theme = "from-cyan-500 via-blue-500 to-indigo-600";
  } else if (milestones.proposal && milestones.seminar) {
    status = "Seminar Completed";
    glowClass = "glow-hover-purple";
    badgeClass = "bg-neon-purple/10 text-neon-purple border-neon-purple/20";
    theme = "from-fuchsia-500 to-pink-600";
  } else {
    // default/thesis in progress
    status = "Thesis In Progress";
    glowClass = "glow-hover-cyan";
    badgeClass = "bg-neon-cyan/10 text-neon-cyan border-neon-cyan/20";
    theme = "from-emerald-500 via-teal-500 to-cyan-500";
  }

  return { status, title, glowClass, badgeClass, theme };
}

export function getStoredStudents(): Student[] {
  if (typeof window === "undefined") return INITIAL_GRADUATES;
  const stored = localStorage.getItem("graduates_registry");
  if (!stored) {
    localStorage.setItem("graduates_registry", JSON.stringify(INITIAL_GRADUATES));
    return INITIAL_GRADUATES;
  }
  try {
    return JSON.parse(stored);
  } catch (e) {
    return INITIAL_GRADUATES;
  }
}

export function saveStoredStudents(students: Student[]) {
  if (typeof window !== "undefined") {
    localStorage.setItem("graduates_registry", JSON.stringify(students));
  }
}

export function getStoredUser(): Student | null {
  if (typeof window === "undefined") return null;
  const user = localStorage.getItem("active_user");
  if (!user) return null;
  try {
    return JSON.parse(user);
  } catch (e) {
    return null;
  }
}

// Password registry — keyed by NIM, default "password123" for seed students
function getPasswordRegistry(): Record<string, string> {
  if (typeof window === "undefined") return {};
  const raw = localStorage.getItem("password_registry");
  if (!raw) return {};
  try { return JSON.parse(raw); } catch { return {}; }
}

function savePasswordRegistry(registry: Record<string, string>) {
  if (typeof window !== "undefined") {
    localStorage.setItem("password_registry", JSON.stringify(registry));
  }
}

export function loginUser(nim: string, password?: string): Student | null {
  const students = getStoredStudents();
  const found = students.find((s) => s.nim === nim);
  if (!found) return null;

  const registry = getPasswordRegistry();
  // If the user has a custom password, check against it; otherwise use default
  const expectedPassword = registry[nim] ?? "password123";
  if (password && password !== expectedPassword) return null;

  localStorage.setItem("active_user", JSON.stringify(found));
  return found;
}

export interface RegisterData {
  nim: string;
  name: string;
  password: string;
  specialization: "Business Intelligence" | "Smart Agriculture";
}

export function registerUser(data: RegisterData): { success: boolean; error?: string } {
  const students = getStoredStudents();

  if (students.find((s) => s.nim === data.nim)) {
    return { success: false, error: "NIM sudah terdaftar. Silakan login." };
  }
  if (data.nim.length < 6) {
    return { success: false, error: "NIM tidak valid (minimal 6 digit)." };
  }
  if (data.password.length < 6) {
    return { success: false, error: "Password minimal 6 karakter." };
  }

  const newStudent: Student = {
    nim: data.nim,
    name: data.name,
    specialization: data.specialization,
    status: "Thesis In Progress",
    title: "S.Kom. (Cand.)",
    quote: "Perjalanan menuju S.Kom dimulai dari satu langkah pertama.",
    image: `https://api.dicebear.com/8.x/bottts-neutral/svg?seed=${data.nim}&backgroundColor=0a0a2e`,
    theme: "from-emerald-500 via-teal-500 to-cyan-500",
    glowClass: "glow-hover-cyan",
    badgeClass: "bg-neon-cyan/10 text-neon-cyan border-neon-cyan/20",
    milestones: { proposal: false, seminar: false, defense: false, graduation: false },
    role: "student",
  };

  const updated = [...students, newStudent];
  saveStoredStudents(updated);

  // Save their custom password
  const registry = getPasswordRegistry();
  registry[data.nim] = data.password;
  savePasswordRegistry(registry);

  // Auto-login
  localStorage.setItem("active_user", JSON.stringify(newStudent));
  return { success: true };
}

export function logoutUser() {
  if (typeof window !== "undefined") {
    localStorage.removeItem("active_user");
  }
}
