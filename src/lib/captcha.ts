import crypto from "crypto";

const SECRET_KEY = process.env.JWT_SECRET || "portfolio-super-secure-key-2026-neon-supabase";
const EXPIRATION_TIME_MS = 2 * 60 * 1000; // 2 minutes

// Used nonces cache to prevent replay attacks
const usedNonces = new Set<string>();

// Rate limiting & brute-force tracker: Map<IP, { attempts: number, lockUntil: number, lastAttempt: number }>
const rateLimitMap = new Map<string, { attempts: number; lockUntil: number; lastAttempt: number }>();

// Cleanup stale nonces and rate limits every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [ip, data] of rateLimitMap.entries()) {
    if (now - data.lastAttempt > 10 * 60 * 1000) {
      rateLimitMap.delete(ip);
    }
  }
  if (usedNonces.size > 5000) {
    usedNonces.clear();
  }
}, 5 * 60 * 1000);

export interface CaptchaResult {
  svg: string;
  token: string;
}

// Generate random alphanumeric text without confusing chars
function generateRandomText(length: number = 5): string {
  const chars = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ"; // No 0, O, 1, I, L
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// Create a cryptographically signed HMAC token for the captcha answer
function createSignedToken(text: string): { token: string; nonce: string } {
  const nonce = crypto.randomUUID();
  const exp = Date.now() + EXPIRATION_TIME_MS;
  const hash = crypto
    .createHmac("sha256", SECRET_KEY)
    .update(`${text.toUpperCase()}:${exp}:${nonce}`)
    .digest("hex");

  const payload = Buffer.from(JSON.stringify({ hash, exp, nonce })).toString("base64url");
  return { token: payload, nonce };
}

// Generate server-side distorted visual SVG Captcha with noise and gradients
export function generateVisualCaptcha(): CaptchaResult {
  const text = generateRandomText(5);
  const { token } = createSignedToken(text);

  const width = 160;
  const height = 50;

  // Generate random noise lines
  let lines = "";
  for (let i = 0; i < 6; i++) {
    const x1 = Math.floor(Math.random() * width);
    const y1 = Math.floor(Math.random() * height);
    const x2 = Math.floor(Math.random() * width);
    const y2 = Math.floor(Math.random() * height);
    const stroke = `rgba(${Math.floor(Math.random() * 100 + 100)}, ${Math.floor(
      Math.random() * 150 + 100
    )}, ${Math.floor(Math.random() * 255)}, 0.45)`;
    lines += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${stroke}" stroke-width="${Math.floor(
      Math.random() * 2 + 1
    )}" />`;
  }

  // Generate random noise circles
  let circles = "";
  for (let i = 0; i < 25; i++) {
    const cx = Math.floor(Math.random() * width);
    const cy = Math.floor(Math.random() * height);
    const r = Math.floor(Math.random() * 2.5 + 1);
    const fill = `rgba(${Math.floor(Math.random() * 100 + 100)}, ${Math.floor(
      Math.random() * 150 + 100
    )}, ${Math.floor(Math.random() * 255)}, 0.3)`;
    circles += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${fill}" />`;
  }

  // Render distorted characters
  let textElements = "";
  const charSpacing = width / (text.length + 1);

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const x = Math.floor(charSpacing * (i + 0.6) + (Math.random() * 4 - 2));
    const y = Math.floor(height / 2 + 8 + (Math.random() * 6 - 3));
    const rotate = Math.floor(Math.random() * 40 - 20);
    const fontSize = Math.floor(Math.random() * 6 + 24);

    const colors = ["#38bdf8", "#818cf8", "#34d399", "#a78bfa", "#f472b6", "#38bdf8"];
    const color = colors[i % colors.length];

    textElements += `
      <text 
        x="${x}" 
        y="${y}" 
        font-family="monospace, Courier, sans-serif" 
        font-size="${fontSize}" 
        font-weight="bold" 
        fill="${color}" 
        transform="rotate(${rotate}, ${x}, ${y})"
        letter-spacing="2"
      >${char}</text>
    `;
  }

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" style="background: #090d16; border-radius: 12px; border: 1px solid #1e293b; user-select: none;">
      <defs>
        <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#090d16" />
          <stop offset="50%" stop-color="#0f172a" />
          <stop offset="100%" stop-color="#090d16" />
        </linearGradient>
      </defs>
      <rect width="${width}" height="${height}" fill="url(#bgGrad)" rx="12" />
      ${lines}
      ${circles}
      ${textElements}
    </svg>
  `.trim();

  return { svg, token };
}

// Verify Captcha Response
export function verifyCaptchaToken(userInput: string, token: string): { valid: boolean; error?: string } {
  if (!userInput || !token) {
    return { valid: false, error: "Kode Captcha wajib diisi." };
  }

  try {
    const decoded = JSON.parse(Buffer.from(token, "base64url").toString("utf-8"));
    const { hash, exp, nonce } = decoded;

    if (!hash || !exp || !nonce) {
      return { valid: false, error: "Token Captcha tidak valid." };
    }

    // Check expiration
    if (Date.now() > exp) {
      return { valid: false, error: "Kode Captcha sudah kedaluwarsa. Silakan refresh captcha baru." };
    }

    // Check replay attack
    if (usedNonces.has(nonce)) {
      return { valid: false, error: "Kode Captcha sudah pernah digunakan." };
    }

    // Check hash
    const expectedHash = crypto
      .createHmac("sha256", SECRET_KEY)
      .update(`${userInput.trim().toUpperCase()}:${exp}:${nonce}`)
      .digest("hex");

    if (crypto.timingSafeEqual(Buffer.from(hash), Buffer.from(expectedHash))) {
      usedNonces.add(nonce);
      return { valid: true };
    } else {
      return { valid: false, error: "Kode Captcha salah. Periksa karakter dengan teliti." };
    }
  } catch {
    return { valid: false, error: "Token Captcha rusak atau tidak valid." };
  }
}

// Anti-Brute Force Rate Limiter
export function checkRateLimit(ip: string): { allowed: boolean; retryAfterSeconds?: number } {
  const now = Date.now();
  const record = rateLimitMap.get(ip);

  if (record) {
    if (record.lockUntil > now) {
      const remainingSeconds = Math.ceil((record.lockUntil - now) / 1000);
      return { allowed: false, retryAfterSeconds: remainingSeconds };
    }
  }

  return { allowed: true };
}

export function recordFailedAttempt(ip: string) {
  const now = Date.now();
  const record = rateLimitMap.get(ip) || { attempts: 0, lockUntil: 0, lastAttempt: now };

  record.attempts += 1;
  record.lastAttempt = now;

  // If >= 5 failed attempts, lock for 60 seconds
  if (record.attempts >= 5) {
    record.lockUntil = now + 60 * 1000;
  }

  rateLimitMap.set(ip, record);
}

export function resetRateLimit(ip: string) {
  rateLimitMap.delete(ip);
}
