import { NextRequest } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-server";
import { computeStudentStatus } from "@/lib/student-utils";

export const dynamic = "force-dynamic";


// GET /api/students/[nim]
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ nim: string }> }
) {
  try {
    const { nim } = await params;
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(nim);

    const query = supabaseAdmin
      .from("students")
      .select("id, nim, name, role, specialization");

    if (isUuid) {
      query.eq("id", nim);
    } else {
      query.eq("nim", nim);
    }

    const { data: student, error } = await query.single();

    if (error || !student) {
      return Response.json({ error: "Student tidak ditemukan." }, { status: 404 });
    }

    const [{ data: ms }, { data: pr }] = await Promise.all([
      supabaseAdmin
        .from("milestones")
        .select("proposal, seminar, defense, graduation")
        .eq("student_id", student.id)
        .single(),
      supabaseAdmin
        .from("profiles")
        .select("quote, avatar_url")
        .eq("student_id", student.id)
        .single(),
    ]);

    const milestones = ms ?? { proposal: false, seminar: false, defense: false, graduation: false };
    const computed = computeStudentStatus(milestones);
    const avatarUrl =
      pr?.avatar_url ||
      `https://api.dicebear.com/8.x/bottts-neutral/svg?seed=${student.nim}&backgroundColor=0a0a2e`;

    return Response.json({
      student: {
        id: student.id,
        nim: student.nim,
        name: student.name,
        role: student.role,
        specialization: student.specialization,
        quote: pr?.quote ?? "Perjalanan menuju S.Kom dimulai dari satu langkah pertama.",
        avatar_url: avatarUrl,
        image: avatarUrl,
        milestones,
        ...computed,
      },
    });
  } catch (err) {
    console.error("[/api/students/[nim]] GET Error:", err);
    return Response.json({ error: "Terjadi kesalahan server." }, { status: 500 });
  }
}

// PUT /api/students/[nim] — update profile (name, quote, avatar_url, specialization)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ nim: string }> }
) {
  try {
    const { nim } = await params;
    const body = await request.json();
    const { name, quote, specialization, avatar_url } = body;

    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(nim);

    // Cari student
    const query = supabaseAdmin.from("students").select("id");
    if (isUuid) {
      query.eq("id", nim);
    } else {
      query.eq("nim", nim);
    }

    const { data: student, error: findError } = await query.single();

    if (findError || !student) {
      return Response.json({ error: "Student tidak ditemukan." }, { status: 404 });
    }

    // Update students table (name, specialization)
    if (name || specialization) {
      const updates: Record<string, string> = {};
      if (name) updates.name = name.trim();
      if (specialization) updates.specialization = specialization;

      await supabaseAdmin
        .from("students")
        .update(updates)
        .eq("id", student.id);
    }

    // Update profiles table (quote, avatar_url)
    if (quote !== undefined || avatar_url !== undefined) {
      const profileUpdates: Record<string, string> = {};
      if (quote !== undefined) profileUpdates.quote = quote;
      if (avatar_url !== undefined) profileUpdates.avatar_url = avatar_url;

      await supabaseAdmin
        .from("profiles")
        .update(profileUpdates)
        .eq("student_id", student.id);
    }

    return Response.json({ success: true });
  } catch (err) {
    console.error("[/api/students/[nim]] PUT Error:", err);
    return Response.json({ error: "Terjadi kesalahan server." }, { status: 500 });
  }
}
