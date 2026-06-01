"use client";

export { computeStudentStatus } from "@/lib/student-utils";
export type { StudentStatus, ComputedStudentStyle } from "@/lib/student-utils";

export interface Student {
  id?: string;
  nim: string;
  name: string;
  specialization: "Business Intelligence" | "Smart Agriculture";
  status: "Graduated" | "Defense Completed" | "Seminar Completed" | "Thesis In Progress";
  title: string;
  quote: string;
  image: string;
  avatar_url?: string | null;
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



export function getStoredUser(): Student | null {
  if (typeof window === "undefined") return null;
  const user = localStorage.getItem("active_user");
  if (!user) return null;
  try {
    return JSON.parse(user);
  } catch {
    return null;
  }
}

export function setStoredUser(student: Student) {
  if (typeof window !== "undefined") {
    localStorage.setItem("active_user", JSON.stringify(student));
  }
}

export function logoutUser() {
  if (typeof window !== "undefined") {
    localStorage.removeItem("active_user");
  }
}
export async function fetchAllStudents(): Promise<Student[]> {
  try {
    const res = await fetch("/api/students", { cache: "no-store" });
    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      console.error("[db] fetchAllStudents HTTP error:", res.status, errData);
      throw new Error(errData?.detail ?? errData?.error ?? `HTTP ${res.status}`);
    }
    const data = await res.json();
    return data.students ?? [];
  } catch (err) {
    console.error("[db] fetchAllStudents error:", err);
    return [];
  }
}

export async function fetchStudentById(id: string): Promise<Student | null> {
  try {
    const res = await fetch(`/api/students/${id}`, { cache: "no-store" });
    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      console.error("[db] fetchStudentById HTTP error:", res.status, errData);
      throw new Error(errData?.detail ?? errData?.error ?? `HTTP ${res.status}`);
    }
    const data = await res.json();
    return data.student ?? null;
  } catch (err) {
    console.error("[db] fetchStudentById error:", err);
    return null;
  }
}



export async function loginUser(
  nim: string,
  password: string
): Promise<{ student: Student | null; error?: string }> {
  try {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nim, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      return { student: null, error: data.error ?? "Login gagal." };
    }

    const student: Student = data.student;
    setStoredUser(student);
    return { student };
  } catch (err) {
    console.error("[db] loginUser error:", err);
    return { student: null, error: "Terjadi kesalahan jaringan. Coba lagi." };
  }
}


export interface RegisterData {
  nim: string;
  name: string;
  password: string;
  specialization: "Business Intelligence" | "Smart Agriculture";
  avatar_url?: string;
}

export async function registerUser(
  data: RegisterData
): Promise<{ success: boolean; error?: string; student?: Student }> {
  try {
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const json = await res.json();

    if (!res.ok) {
      return { success: false, error: json.error ?? "Pendaftaran gagal." };
    }

    const student: Student = json.student;
    setStoredUser(student);
    return { success: true, student };
  } catch (err) {
    console.error("[db] registerUser error:", err);
    return { success: false, error: "Terjadi kesalahan jaringan. Coba lagi." };
  }
}


export async function updateStudentProfile(
  nim: string,
  updates: { name?: string; quote?: string; specialization?: string; avatar_url?: string }
): Promise<{ success: boolean; error?: string }> {
  try {
    const res = await fetch(`/api/students/${nim}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    });

    const json = await res.json();
    if (!res.ok) return { success: false, error: json.error };
    return { success: true };
  } catch (err) {
    console.error("[db] updateStudentProfile error:", err);
    return { success: false, error: "Gagal menyimpan profil." };
  }
}


export async function updateMilestone(
  adminNim: string,
  targetNim: string,
  milestoneKey: "proposal" | "seminar" | "defense" | "graduation",
  value: boolean
): Promise<{ success: boolean; error?: string }> {
  try {
    const res = await fetch("/api/milestones", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ adminNim, targetNim, milestoneKey, value }),
    });

    const json = await res.json();
    if (!res.ok) return { success: false, error: json.error };
    return { success: true };
  } catch (err) {
    console.error("[db] updateMilestone error:", err);
    return { success: false, error: "Gagal update milestone." };
  }
}

/** @deprecated Gunakan fetchAllStudents() */
export function getStoredStudents(): Student[] {
  console.warn("[db] getStoredStudents() deprecated. Gunakan fetchAllStudents().");
  return [];
}

/** @deprecated Tidak dipakai lagi */
export function saveStoredStudents(_students: Student[]) {
  console.warn("[db] saveStoredStudents() deprecated. Data tersimpan ke Supabase.");
}
