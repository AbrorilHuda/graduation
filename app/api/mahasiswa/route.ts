import { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const nim = searchParams.get("nim");
    const apiUrl = process.env.API_URL;

    if (!nim) {
      return Response.json(
        { error: "Parameter NIM wajib disertakan." },
        { status: 400 }
      );
    }

    if (nim.length < 10) {
      return Response.json(
        { error: "NIM tidak valid (minimal 10 digit)." },
        { status: 400 }
      );
    }

    // Validasi NIM wajib angkatan 2022
    if (!nim.startsWith("2022")) {
      return Response.json(
        { error: "Pendaftaran ini dikhususkan untuk angkatan 2022." },
        { status: 403 }
      );
    }

    const uniraApiUrl = `${apiUrl}/v1/mahasiswa?filter[nim]=${nim}`;
    const res = await fetch(uniraApiUrl, {
      headers: {
        "Accept": "application/json",
      },
      cache: "no-store",
    });

    if (!res.ok) {
      console.error(`[api/mahasiswa] UNIRA API HTTP error: ${res.status}`);
      return Response.json(
        { error: "Gagal mengambil data dari server akademik." },
        { status: res.status }
      );
    }

    const json = await res.json();
    const studentData = json.data?.[0];

    if (!studentData) {
      return Response.json(
        { error: "Mahasiswa tidak ditemukan di sistem UNIRA." },
        { status: 404 }
      );
    }

    const attrs = studentData.attributes || {};
    let imageFilename = "";

    if (attrs.thumbnail) {
      // Ambil nama file dari path e.g. "img/profil/mhs/abc.jpg" -> "abc.jpg"
      const parts = attrs.thumbnail.split("/");
      imageFilename = parts[parts.length - 1];
    }

    // Filter output sesuai spesifikasi
    const filteredResult = {
      id: studentData.id,
      image: imageFilename ? `/api/mahasiswa/${imageFilename}` : "",
      status: attrs.status,
      nama: attrs.nama,
      peminatan: attrs.peminatan,
    };

    return Response.json(filteredResult);
  } catch (err: any) {
    console.error("[api/mahasiswa] Exception:", err);
    return Response.json(
      { error: "Terjadi kesalahan server saat memproses data.", detail: err?.message },
      { status: 500 }
    );
  }
}
