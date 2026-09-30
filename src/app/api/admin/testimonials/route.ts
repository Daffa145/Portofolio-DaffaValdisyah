import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getTestimonials, saveTestimonial, deleteTestimonial } from "@/lib/db-service";

export async function GET() {
  const testimonials = await getTestimonials();
  return NextResponse.json({ testimonials });
}

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const data = await req.json();
    if (!data.name || !data.content) {
      return NextResponse.json({ error: "Nama dan isi testimoni wajib diisi" }, { status: 400 });
    }

    const testi = {
      id: data.id || "testi-" + Date.now(),
      name: data.name,
      role: data.role || "Client / Colleague",
      company: data.company || "",
      avatarUrl: data.avatarUrl || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80",
      content: data.content,
      rating: Number(data.rating) || 5,
      isActive: data.isActive !== false,
      order: Number(data.order) || 0,
    };

    const saved = await saveTestimonial(testi);
    return NextResponse.json({ success: true, testimonial: saved });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "Gagal menyimpan testimoni" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "ID diperlukan" }, { status: 400 });

    await deleteTestimonial(id);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "Gagal menghapus testimoni" }, { status: 500 });
  }
}
