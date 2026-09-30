import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import fs from "fs";
import path from "path";

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "File gambar tidak ditemukan" }, { status: 400 });
    }

    // Validate mime type
    const validMimes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/gif",
      "image/svg+xml",
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "text/plain",
    ];

    const isDocument =
      file.type === "application/pdf" ||
      file.type.includes("word") ||
      file.type.includes("officedocument") ||
      file.type === "text/plain" ||
      file.name.endsWith(".pdf") ||
      file.name.endsWith(".doc") ||
      file.name.endsWith(".docx");

    const isImage = file.type.startsWith("image/");

    if (!validMimes.includes(file.type) && !isDocument) {
      return NextResponse.json(
        { error: "Format file tidak didukung. Unggah file gambar (JPG, PNG, WebP) atau dokumen (PDF, DOCX)." },
        { status: 400 }
      );
    }

    // Limit size to 10MB
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: "Ukuran file maksimal 10MB" },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Ensure public/uploads folder exists
    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    // Create unique filename
    const extension = file.name.split(".").pop() || (isDocument ? "pdf" : "png");
    const cleanExt = extension.replace(/[^a-zA-Z0-9]/g, "").toLowerCase();
    const prefix = isDocument ? "doc" : "img";
    const filename = `${prefix}-${Date.now()}-${Math.random().toString(36).substring(2, 7)}.${cleanExt}`;
    const filePath = path.join(uploadsDir, filename);

    fs.writeFileSync(filePath, buffer);

    const publicUrl = `/uploads/${filename}`;

    return NextResponse.json({
      success: true,
      url: publicUrl,
      filename,
      originalName: file.name,
      fileType: isDocument ? "document" : "image",
    });
  } catch (error: any) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: error?.message || "Gagal mengunggah file" },
      { status: 500 }
    );
  }
}
