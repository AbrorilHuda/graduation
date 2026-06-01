import { supabaseAdmin } from "@/lib/supabase-server";

export const dynamic = "force-dynamic";

export interface StatisticsResponse {
  total_students: number;
  seminar_completed: number;  // seminar === true
  semhas_completed: number;   // defense === true (semhas = sidang hasil)
  graduated: number;          // graduation === true
}

/**
 * GET /api/statistics
 * Menghitung total mahasiswa dan jumlah yang sudah melewati tiap milestone.
 */
export async function GET() {
  try {
    const hasUrl = !!process.env.NEXT_PUBLIC_SUPABASE_URL;
    const hasServiceKey = !!process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!hasUrl || !hasServiceKey) {
      return Response.json(
        { error: `Supabase tidak terkonfigurasi (URL: ${hasUrl}, KEY: ${hasServiceKey})` },
        { status: 500 }
      );
    }

    // Ambil semua students dari tabel (tanpa filter role)
    const { data: students, error: studentsError } = await supabaseAdmin
      .from("students")
      .select("id");

    if (studentsError) throw studentsError;

    const totalStudents = students?.length ?? 0;

    if (totalStudents === 0) {
      return Response.json({
        total_students: 0,
        seminar_completed: 0,
        semhas_completed: 0,
        graduated: 0,
      } satisfies StatisticsResponse);
    }

    const studentIds = students!.map((s) => s.id);

    // Ambil milestones untuk semua student tersebut
    const { data: milestones, error: milestonesError } = await supabaseAdmin
      .from("milestones")
      .select("student_id, seminar, defense, graduation")
      .in("student_id", studentIds);

    if (milestonesError) throw milestonesError;

    const ms = milestones ?? [];

    const seminarCompleted = ms.filter((m) => m.seminar === true).length;
    const semhasCompleted = ms.filter((m) => m.defense === true).length;
    const graduated = ms.filter((m) => m.graduation === true).length;

    return Response.json({
      total_students: totalStudents,
      seminar_completed: seminarCompleted,
      semhas_completed: semhasCompleted,
      graduated,
    } satisfies StatisticsResponse);
  } catch (err: any) {
    console.error("[/api/statistics] Error:", err);
    return Response.json(
      { error: "Gagal mengambil data statistik.", detail: err?.message ?? String(err) },
      { status: 500 }
    );
  }
}
