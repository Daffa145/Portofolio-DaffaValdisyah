import { NextResponse } from "next/server";
import { getSession, signToken, setSessionCookie } from "@/lib/auth";
import { updateAdminCredentials } from "@/lib/db-service";

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { currentPassword, newPassword, newName, newEmail } = await req.json();
    if (!currentPassword) {
      return NextResponse.json({ error: "Password saat ini diperlukan" }, { status: 400 });
    }

    const result = await updateAdminCredentials(
      session.email,
      currentPassword,
      newPassword,
      newName,
      newEmail
    );

    if (result.user) {
      const token = await signToken(result.user);
      await setSessionCookie(token);
    }

    return NextResponse.json({
      success: true,
      message: "Kredensial berhasil diperbarui",
      user: result.user,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Gagal memperbarui kredensial" },
      { status: 400 }
    );
  }
}
