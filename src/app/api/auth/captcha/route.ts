import { NextResponse } from "next/server";
import { generateVisualCaptcha } from "@/lib/captcha";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const captcha = generateVisualCaptcha();
    return NextResponse.json(captcha);
  } catch {
    return NextResponse.json({ error: "Gagal membuat captcha" }, { status: 500 });
  }
}
