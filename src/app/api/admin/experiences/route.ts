import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getExperiences, saveExperience, deleteExperience } from "@/lib/db-service";

export async function GET() {
  const experiences = await getExperiences();
  return NextResponse.json({ experiences });
}

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const data = await req.json();
    if (!data.role || !data.company) {
      return NextResponse.json({ error: "Posisi dan Nama Perusahaan wajib diisi" }, { status: 400 });
    }

    const exp = {
      id: data.id || "exp-" + Date.now(),
      role: data.role,
      company: data.company,
      location: data.location || "Remote",
      type: data.type || "Full-time",
      startDate: data.startDate || "2023",
      endDate: data.endDate || "Present",
      isCurrent: Boolean(data.isCurrent),
      isActive: data.isActive !== false,
      description: data.description || "",
      technologies: Array.isArray(data.technologies) ? data.technologies : (data.technologies ? data.technologies.split(",").map((s: string) => s.trim()) : []),
      order: Number(data.order) || 0,
    };

    const saved = await saveExperience(exp);
    return NextResponse.json({ success: true, experience: saved });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "Gagal menyimpan pengalaman" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "ID diperlukan" }, { status: 400 });

    await deleteExperience(id);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "Gagal menghapus pengalaman" }, { status: 500 });
  }
}
