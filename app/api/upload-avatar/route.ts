import { NextRequest } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-server";

export const dynamic = "force-dynamic";

const BUCKET = "avatars";

// POST /api/upload-avatar
// multipart/form-data: file (required), student_nim (required), old_path (optional)
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const studentNim = formData.get("student_nim") as string | null;
    const oldPath = formData.get("old_path") as string | null;

    if (!file || !studentNim) {
      return Response.json(
        { error: "Field 'file' dan 'student_nim' wajib ada." },
        { status: 400 }
      );
    }

    // Validasi tipe dan ukuran file
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!allowedTypes.includes(file.type)) {
      return Response.json(
        { error: "Format file tidak didukung. Gunakan JPG, PNG, WebP, atau GIF." },
        { status: 400 }
      );
    }
    if (file.size > 5 * 1024 * 1024) {
      return Response.json(
        { error: "Ukuran file terlalu besar (maks. 5MB)." },
        { status: 400 }
      );
    }

    // Hapus file lama dari bucket jika ada
    if (oldPath) {
      // oldPath berisi URL lengkap supabase storage, ekstrak path relatif
      const marker = `/object/public/${BUCKET}/`;
      const idx = oldPath.indexOf(marker);
      if (idx !== -1) {
        const relativePath = oldPath.substring(idx + marker.length);
        const { error: removeError } = await supabaseAdmin.storage
          .from(BUCKET)
          .remove([relativePath]);
        if (removeError) {
          // Log tapi lanjutkan — jangan block upload baru
          console.warn("[upload-avatar] Failed to remove old file:", removeError.message);
        }
      }
    }

    // Upload file baru dengan nama unik
    const ext = file.name.split(".").pop() || "jpg";
    const timestamp = Date.now();
    const filePath = `${studentNim}/${timestamp}.${ext}`;
    const arrayBuffer = await file.arrayBuffer();

    const { error: uploadError } = await supabaseAdmin.storage
      .from(BUCKET)
      .upload(filePath, arrayBuffer, {
        contentType: file.type,
        upsert: true,
      });

    if (uploadError) {
      console.error("[upload-avatar] Upload error:", uploadError.message);
      return Response.json(
        { error: "Gagal mengupload file ke penyimpanan.", detail: uploadError.message },
        { status: 500 }
      );
    }

    // Dapatkan URL public
    const { data: publicUrlData } = supabaseAdmin.storage
      .from(BUCKET)
      .getPublicUrl(filePath);

    const publicUrl = publicUrlData.publicUrl;

    return Response.json({ url: publicUrl });
  } catch (err: any) {
    console.error("[upload-avatar] Exception:", err);
    return Response.json(
      { error: "Terjadi kesalahan server.", detail: err?.message },
      { status: 500 }
    );
  }
}
