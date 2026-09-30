import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getProfile, updateProfile } from "@/lib/db-service";

export async function GET() {
  const profile = await getProfile();
  return NextResponse.json({ profile });
}

export async function PUT(req: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const data = await req.json();
    const updated = await updateProfile(data);
    return NextResponse.json({ success: true, profile: updated });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Gagal memperbarui profil" },
      { status: 500 }
    );
  }
}
