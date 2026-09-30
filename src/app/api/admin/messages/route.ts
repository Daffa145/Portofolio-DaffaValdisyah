import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getMessages, markMessageRead, deleteMessage } from "@/lib/db-service";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const messages = await getMessages();
  return NextResponse.json({ messages });
}

export async function PATCH(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { id, isRead } = await req.json();
    if (!id) return NextResponse.json({ error: "ID pesan diperlukan" }, { status: 400 });

    await markMessageRead(id, isRead);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "Gagal memperbarui status pesan" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "ID pesan diperlukan" }, { status: 400 });

    await deleteMessage(id);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "Gagal menghapus pesan" }, { status: 500 });
  }
}
