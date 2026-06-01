import { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ filename: string }> }
) {
  try {
    const { filename } = await params;
    const apiUrl = process.env.API_URL;

    if (!filename) {
      return Response.json(
        { error: "Nama file tidak valid." },
        { status: 400 }
      );
    }

    const uniraImgUrl = `${apiUrl}/img/profil/mhs/${filename}`;
    const res = await fetch(uniraImgUrl, {
      cache: "no-store",
    });

    if (!res.ok) {
      console.error(`[api/mahasiswa/image] Image fetch failed: ${res.status}`);
      return Response.json(
        { error: "Gambar tidak ditemukan." },
        { status: 404 }
      );
    }

    const contentType = res.headers.get("content-type") || "image/jpeg";
    const blob = await res.blob();

    return new Response(blob, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=86400",
      },
    });
  } catch (err: any) {
    console.error("[api/mahasiswa/image] Exception:", err);
    return Response.json(
      { error: "Gagal memproses gambar." },
      { status: 500 }
    );
  }
}
