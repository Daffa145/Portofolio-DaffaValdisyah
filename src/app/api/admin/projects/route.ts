import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getProjects, saveProject, deleteProject } from "@/lib/db-service";

export async function GET() {
  const projects = await getProjects();
  return NextResponse.json({ projects });
}

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const data = await req.json();
    if (!data.title || !data.description) {
      return NextResponse.json({ error: "Judul dan deskripsi proyek wajib diisi" }, { status: 400 });
    }

    const slug =
      data.slug?.trim() ||
      data.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");

    const project = {
      id: data.id || "proj-" + Date.now(),
      title: data.title,
      slug,
      tagline: data.tagline || "",
      description: data.description,
      imageUrl: data.imageUrl || "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80",
      demoUrl: data.demoUrl || "",
      githubUrl: data.githubUrl || "",
      techStack: Array.isArray(data.techStack) ? data.techStack : (data.techStack ? data.techStack.split(",").map((s: string) => s.trim()) : []),
      category: data.category || "Fullstack",
      featured: Boolean(data.featured),
      isActive: data.isActive !== false,
      order: Number(data.order) || 0,
    };

    const saved = await saveProject(project);
    return NextResponse.json({ success: true, project: saved });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "Gagal menyimpan proyek" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "ID diperlukan" }, { status: 400 });

    await deleteProject(id);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "Gagal menghapus proyek" }, { status: 500 });
  }
}
