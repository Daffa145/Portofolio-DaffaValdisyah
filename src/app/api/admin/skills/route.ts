import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getSkills, saveSkill, deleteSkill } from "@/lib/db-service";

export async function GET() {
  const skills = await getSkills();
  return NextResponse.json({ skills });
}

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const data = await req.json();
    if (!data.name || !data.category) {
      return NextResponse.json({ error: "Nama skill dan kategori wajib diisi" }, { status: 400 });
    }
    const skill = {
      id: data.id || "sk-" + Date.now(),
      name: data.name,
      category: data.category,
      icon: data.icon || "Code2",
      level: Number(data.level) || 85,
      featured: Boolean(data.featured),
      isActive: data.isActive !== false,
      order: Number(data.order) || 0,
    };
    const saved = await saveSkill(skill);
    return NextResponse.json({ success: true, skill: saved });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "Gagal menyimpan skill" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "ID diperlukan" }, { status: 400 });

    await deleteSkill(id);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "Gagal menghapus skill" }, { status: 500 });
  }
}
