import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getEducations, saveEducation, deleteEducation } from "@/lib/db-service";

export async function GET() {
  const educations = await getEducations();
  return NextResponse.json({ educations });
}

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const data = await req.json();
    if (!data.title || !data.institution) {
      return NextResponse.json({ error: "Gelar/Sertifikasi dan Institusi wajib diisi" }, { status: 400 });
    }

    const edu = {
      id: data.id || "edu-" + Date.now(),
      title: data.title,
      institution: data.institution,
      year: data.year || "2023",
      description: data.description || "",
      isActive: data.isActive !== false,
      order: Number(data.order) || 0,
    };

    const saved = await saveEducation(edu);
    return NextResponse.json({ success: true, education: saved });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "Gagal menyimpan pendidikan/sertifikasi" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "ID diperlukan" }, { status: 400 });

    await deleteEducation(id);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "Gagal menghapus item" }, { status: 500 });
  }
}
