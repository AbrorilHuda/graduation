import { supabaseAdmin } from "@/lib/supabase-server";
import { computeStudentStatus } from "@/lib/student-utils";

export const dynamic = "force-dynamic";


// GET /api/students — ambil semua students dengan milestones & profiles
export async function GET() {
  try {
    // Debug: log env check
    const hasUrl = !!process.env.NEXT_PUBLIC_SUPABASE_URL;
    const hasServiceKey = !!process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!hasUrl || !hasServiceKey) {
      console.error("[/api/students] Missing env vars:", { hasUrl, hasServiceKey });
      return Response.json(
        { error: `Supabase tidak terkonfigurasi (URL: ${hasUrl}, KEY: ${hasServiceKey})` },
        { status: 500 }
      );
    }

    const { data: students, error } = await supabaseAdmin
      .from("students")
      .select("id, nim, name, role, specialization")
      .order("name", { ascending: true });

    if (error) {
      console.error("[/api/students] Supabase error:", error);
      throw error;
    }

    if (!students || students.length === 0) {
      return Response.json({ students: [] });
    }

    // Fetch milestones dan profiles untuk semua students
    const studentIds = students.map((s) => s.id);

    const [{ data: milestones }, { data: profiles }] = await Promise.all([
      supabaseAdmin
        .from("milestones")
        .select("student_id, proposal, seminar, defense, graduation")
        .in("student_id", studentIds),
      supabaseAdmin
        .from("profiles")
        .select("student_id, quote, avatar_url")
        .in("student_id", studentIds),
    ]);

    const milestoneMap = new Map(
      (milestones ?? []).map((m) => [m.student_id, m])
    );
    const profileMap = new Map(
      (profiles ?? []).map((p) => [p.student_id, p])
    );

    const result = students.map((student) => {
      const ms = milestoneMap.get(student.id) ?? {
        proposal: false,
        seminar: false,
        defense: false,
        graduation: false,
      };
      const pr = profileMap.get(student.id);
      const computed = computeStudentStatus(ms);
      const avatarUrl =
        pr?.avatar_url ||
        `https://api.dicebear.com/8.x/bottts-neutral/svg?seed=${student.nim}&backgroundColor=0a0a2e`;

      return {
        id: student.id,
        nim: student.nim,
        name: student.name,
        role: student.role,
        specialization: student.specialization,
        quote: pr?.quote ?? "Perjalanan menuju S.Kom dimulai dari satu langkah pertama.",
        avatar_url: avatarUrl,
        image: avatarUrl,
        milestones: {
          proposal: ms.proposal,
          seminar: ms.seminar,
          defense: ms.defense,
          graduation: ms.graduation,
        },
        ...computed,
      };
    });

    return Response.json({ students: result });
  } catch (err: any) {
    console.error("[/api/students] Error:", err);
    return Response.json(
      { error: "Gagal mengambil data students.", detail: err?.message ?? String(err) },
      { status: 500 }
    );
  }
}
