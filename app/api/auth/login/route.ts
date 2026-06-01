import { NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import { supabaseAdmin } from "@/lib/supabase-server";
import { computeStudentStatus } from "@/lib/student-utils";

export const dynamic = "force-dynamic";


export async function POST(request: NextRequest) {
  try {
    const { nim, password } = await request.json();

    if (!nim || !password) {
      return Response.json(
        { error: "NIM dan password wajib diisi." },
        { status: 400 }
      );
    }

    // 1. Cari student berdasarkan NIM
    const { data: student, error: studentError } = await supabaseAdmin
      .from("students")
      .select("id, nim, name, role, specialization")
      .eq("nim", nim.trim())
      .single();

    if (studentError || !student) {
      return Response.json(
        { error: "NIM atau password salah." },
        { status: 401 }
      );
    }

    // 2. Cek password hash
    const { data: pwRow, error: pwError } = await supabaseAdmin
      .from("password_registry")
      .select("password_hash")
      .eq("student_id", student.id)
      .single();

    if (pwError || !pwRow) {
      return Response.json(
        { error: "NIM atau password salah." },
        { status: 401 }
      );
    }

    const isValid = await bcrypt.compare(password, pwRow.password_hash);
    if (!isValid) {
      return Response.json(
        { error: "NIM atau password salah." },
        { status: 401 }
      );
    }

    // 3. Ambil milestones dan profile
    const { data: milestone } = await supabaseAdmin
      .from("milestones")
      .select("proposal, seminar, defense, graduation")
      .eq("student_id", student.id)
      .single();

    const { data: profile } = await supabaseAdmin
      .from("profiles")
      .select("quote, avatar_url")
      .eq("student_id", student.id)
      .single();

    const milestones = milestone ?? {
      proposal: false,
      seminar: false,
      defense: false,
      graduation: false,
    };

    const computed = computeStudentStatus(milestones);
    const avatarUrl =
      profile?.avatar_url ||
      `https://api.dicebear.com/8.x/bottts-neutral/svg?seed=${student.nim}&backgroundColor=0a0a2e`;

    const studentData = {
      id: student.id,
      nim: student.nim,
      name: student.name,
      role: student.role,
      specialization: student.specialization,
      quote: profile?.quote ?? "Perjalanan menuju S.Kom dimulai dari satu langkah pertama.",
      avatar_url: avatarUrl,
      image: avatarUrl,
      milestones,
      ...computed,
    };

    return Response.json({ student: studentData });
  } catch (err) {
    console.error("[/api/auth/login] Error:", err);
    return Response.json({ error: "Terjadi kesalahan server." }, { status: 500 });
  }
}
