import { NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import { supabaseAdmin } from "@/lib/supabase-server";
import { computeStudentStatus } from "@/lib/student-utils";

export const dynamic = "force-dynamic";


export async function POST(request: NextRequest) {
  try {
    const { nim, name, password, specialization, avatar_url } = await request.json();

    // Validasi input
    if (!nim || !name || !password || !specialization) {
      return Response.json({ error: "Semua field wajib diisi." }, { status: 400 });
    }
    if (nim.trim().length < 10) {
      return Response.json({ error: "NIM tidak valid (minimal 10 digit)." }, { status: 400 });
    }
    if (name.trim().length < 3) {
      return Response.json({ error: "Nama minimal 3 karakter." }, { status: 400 });
    }
    if (password.length < 6) {
      return Response.json({ error: "Password minimal 6 karakter." }, { status: 400 });
    }
    if (!["Business Intelligence", "Smart Agriculture"].includes(specialization)) {
      return Response.json({ error: "Konsentrasi tidak valid." }, { status: 400 });
    }

    // Cek NIM sudah ada
    const { data: existing } = await supabaseAdmin
      .from("students")
      .select("id")
      .eq("nim", nim.trim())
      .single();

    if (existing) {
      return Response.json(
        { error: "NIM sudah terdaftar. Silakan login." },
        { status: 409 }
      );
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 12);

    // Insert student
    const { data: newStudent, error: insertError } = await supabaseAdmin
      .from("students")
      .insert({
        nim: nim.trim(),
        name: name.trim(),
        role: "student",
        specialization,
      })
      .select("id, nim, name, role, specialization")
      .single();

    if (insertError || !newStudent) {
      console.error("[/api/auth/register] Insert student error:", insertError);
      return Response.json({ error: "Gagal membuat akun. Coba lagi." }, { status: 500 });
    }

    // Insert milestones (semua false)
    await supabaseAdmin.from("milestones").insert({
      student_id: newStudent.id,
      proposal: false,
      seminar: false,
      defense: false,
      graduation: false,
    });

    // Insert profile dengan custom avatar_url atau default quote
    const finalAvatarUrl = avatar_url || `https://api.dicebear.com/8.x/bottts-neutral/svg?seed=${newStudent.nim}&backgroundColor=0a0a2e`;
    await supabaseAdmin.from("profiles").insert({
      student_id: newStudent.id,
      quote: "Perjalanan menuju S.Kom dimulai dari satu langkah pertama.",
      avatar_url: finalAvatarUrl,
    });


    // Insert password hash
    await supabaseAdmin.from("password_registry").insert({
      student_id: newStudent.id,
      password_hash: passwordHash,
    });

    // Build response data
    const milestones = { proposal: false, seminar: false, defense: false, graduation: false };
    const computed = computeStudentStatus(milestones);

    const studentData = {
      id: newStudent.id,
      nim: newStudent.nim,
      name: newStudent.name,
      role: newStudent.role,
      specialization: newStudent.specialization,
      quote: "Perjalanan menuju S.Kom dimulai dari satu langkah pertama.",
      avatar_url: finalAvatarUrl,
      image: finalAvatarUrl,
      milestones,
      ...computed,
    };

    return Response.json({ student: studentData }, { status: 201 });
  } catch (err) {
    console.error("[/api/auth/register] Error:", err);
    return Response.json({ error: "Terjadi kesalahan server." }, { status: 500 });
  }
}
