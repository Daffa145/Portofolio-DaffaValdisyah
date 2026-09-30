import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { resetAllDataToDefault } from "@/lib/db-service";

export async function POST() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const data = await resetAllDataToDefault();
    return NextResponse.json({ success: true, message: "Data berhasil di-reset ke sample default", data });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "Gagal reset data" }, { status: 500 });
  }
}
