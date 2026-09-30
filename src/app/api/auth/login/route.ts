import { NextResponse } from "next/server";
import { authenticateAdmin } from "@/lib/db-service";
import { signToken, setSessionCookie, removeSessionCookie, getSession } from "@/lib/auth";
import { verifyCaptchaToken, checkRateLimit, recordFailedAttempt, resetRateLimit } from "@/lib/captcha";

export async function POST(req: Request) {
  try {
    // Extract Client IP for rate-limiting
    const forwardedFor = req.headers.get("x-forwarded-for");
    const clientIp = forwardedFor ? forwardedFor.split(",")[0].trim() : "127.0.0.1";

    // 1. Check Rate Limiter (Anti-Brute Force Protection)
    const rateCheck = checkRateLimit(clientIp);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        {
          error: `Terlalu banyak percobaan login gagal. Demi keamanan, silakan tunggu ${rateCheck.retryAfterSeconds} detik lagi.`,
          locked: true,
          retryAfter: rateCheck.retryAfterSeconds,
        },
        { status: 429 }
      );
    }

    const body = await req.json();
    const { email, password, captchaInput, captchaToken, honeypot } = body;

    // 2. Honeypot check (Automated spam bots fill hidden inputs)
    if (honeypot) {
      recordFailedAttempt(clientIp);
      return NextResponse.json(
        { error: "Aktivitas bot terdeteksi. Akses ditolak." },
        { status: 403 }
      );
    }

    // 3. Captcha Validation
    if (!captchaInput || !captchaToken) {
      return NextResponse.json(
        { error: "Kode Captcha wajib diisi untuk verifikasi keamanan." },
        { status: 400 }
      );
    }

    const captchaVerification = verifyCaptchaToken(captchaInput, captchaToken);
    if (!captchaVerification.valid) {
      recordFailedAttempt(clientIp);
      return NextResponse.json(
        { error: captchaVerification.error || "Kode Captcha tidak cocok." },
        { status: 400 }
      );
    }

    // 4. Validate Credentials
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email dan kata sandi wajib diisi." },
        { status: 400 }
      );
    }

    const admin = await authenticateAdmin(email, password);
    if (!admin) {
      recordFailedAttempt(clientIp);
      return NextResponse.json(
        { error: "Email/username atau kata sandi tidak valid." },
        { status: 401 }
      );
    }

    // 5. Success - Reset Rate Limits & Set Session
    resetRateLimit(clientIp);

    const token = await signToken(admin);
    await setSessionCookie(token);

    return NextResponse.json({
      success: true,
      user: {
        id: admin.userId,
        email: admin.email,
        name: admin.name,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Terjadi kesalahan server saat login." },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  await removeSessionCookie();
  return NextResponse.json({ success: true, message: "Logged out" });
}

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ user: null });
  }
  return NextResponse.json({ user: session });
}
