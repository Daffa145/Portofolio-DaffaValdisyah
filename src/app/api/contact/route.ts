import { NextResponse } from "next/server";
import { createMessage } from "@/lib/db-service";

export async function POST(req: Request) {
  try {
    const { name, email, subject, message } = await req.json();

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Nama, email, dan pesan wajib diisi" },
        { status: 400 }
      );
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Format email tidak valid" },
        { status: 400 }
      );
    }

    const saved = await createMessage({
      name,
      email,
      subject: subject || "Pertanyaan Proyek",
      message,
    });

    return NextResponse.json({
      success: true,
      message: "Pesan Anda berhasil dikirim! Saya akan segera merespons.",
      data: saved,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Gagal mengirim pesan" },
      { status: 500 }
    );
  }
}
