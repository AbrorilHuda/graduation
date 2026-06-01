export interface StudentRow {
  id: string;
  nim: string;
  name: string;
  role: "student" | "admin";
  specialization: "Business Intelligence" | "Smart Agriculture";
  created_at: string;
  updated_at: string;
}

export interface MilestoneRow {
  id: string;
  student_id: string;
  proposal: boolean;
  seminar: boolean;
  defense: boolean;
  graduation: boolean;
  updated_at: string;
  updated_by: string | null;
}

export interface ProfileRow {
  id: string;
  student_id: string;
  quote: string;
  avatar_url: string | null;
  avatar_cloudinary_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface MemoryRow {
  id: string;
  title: string;
  caption: string | null;
  category: "Struggle" | "Friendship" | "Academic" | "Graduation" | "Lainnya";
  event_date: string | null;
  location: string | null;
  cloudinary_url: string;
  cloudinary_id: string;
  grid_span: string | null;
  uploaded_by: string | null;
  is_featured: boolean;
  created_at: string;
}

// ─── Computed / UI Types ────────────────────────────────────────

export type StudentStatus =
  | "Graduated"
  | "Defense Completed"
  | "Seminar Completed"
  | "Thesis In Progress";

/**
 * Tipe gabungan yang dipakai komponen UI — hasil join students + milestones + profiles.
 * Kompatibel dengan interface Student lama di db.ts.
 */
export interface StudentWithDetails {
  // from students
  id: string;
  nim: string;
  name: string;
  role: "student" | "admin";
  specialization: "Business Intelligence" | "Smart Agriculture";
  // from profiles
  quote: string;
  avatar_url: string | null;
  // from milestones
  milestones: {
    proposal: boolean;
    seminar: boolean;
    defense: boolean;
    graduation: boolean;
  };
  // computed client-side
  status: StudentStatus;
  title: string;
  image: string;        // alias dari avatar_url atau fallback
  theme: string;
  glowClass: string;
  badgeClass: string;
}
