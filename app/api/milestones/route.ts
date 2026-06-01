import { NextRequest } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-server";

export const dynamic = "force-dynamic";


// PUT /api/milestones — toggle milestone (admin only)
export async function PUT(request: NextRequest) {
  try {
    const { adminNim, targetNim, milestoneKey, value } = await request.json();

    if (!adminNim || !targetNim || !milestoneKey || value === undefined) {
      return Response.json({ error: "Parameter tidak lengkap." }, { status: 400 });
    }

    const validKeys = ["proposal", "seminar", "defense", "graduation"];
    if (!validKeys.includes(milestoneKey)) {
      return Response.json({ error: "Milestone key tidak valid." }, { status: 400 });
    }

    // Verifikasi adminNim adalah admin
    const { data: adminStudent, error: adminError } = await supabaseAdmin
      .from("students")
      .select("id, role")
      .eq("nim", adminNim)
      .single();

    if (adminError || !adminStudent || adminStudent.role !== "admin") {
      return Response.json({ error: "Akses ditolak. Hanya admin yang dapat mengubah milestone." }, { status: 403 });
    }

    // Cari target student
    const { data: targetStudent, error: targetError } = await supabaseAdmin
      .from("students")
      .select("id")
      .eq("nim", targetNim)
      .single();

    if (targetError || !targetStudent) {
      return Response.json({ error: "Target student tidak ditemukan." }, { status: 404 });
    }

    // Update milestone
    const { error: updateError } = await supabaseAdmin
      .from("milestones")
      .update({
        [milestoneKey]: value,
        updated_by: adminStudent.id,
      })
      .eq("student_id", targetStudent.id);

    if (updateError) {
      console.error("[/api/milestones] Update error:", updateError);
      return Response.json({ error: "Gagal update milestone." }, { status: 500 });
    }

    return Response.json({ success: true });
  } catch (err) {
    console.error("[/api/milestones] Error:", err);
    return Response.json({ error: "Terjadi kesalahan server." }, { status: 500 });
  }
}
