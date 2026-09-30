"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ShieldCheck,
  Lock,
  Mail,
  ArrowRight,
  Eye,
  EyeOff,
  AlertCircle,
  Loader2,
  ArrowLeft,
  RefreshCw,
  KeyRound,
  CheckCircle2,
} from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // CAPTCHA States
  const [captchaData, setCaptchaData] = useState<{ svg: string; token: string } | null>(null);
  const [captchaInput, setCaptchaInput] = useState("");
  const [captchaLoading, setCaptchaLoading] = useState(false);
  const [honeypot, setHoneypot] = useState("");

  const fetchNewCaptcha = async () => {
    setCaptchaLoading(true);
    try {
      const res = await fetch("/api/auth/captcha", { cache: "no-store" });
      const data = await res.json();
      if (data.svg && data.token) {
        setCaptchaData(data);
        setCaptchaInput("");
      }
    } catch {
      // ignore
    } finally {
      setCaptchaLoading(false);
    }
  };

  useEffect(() => {
    fetchNewCaptcha();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
          captchaInput,
          captchaToken: captchaData?.token,
          honeypot,
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        // Refresh captcha on any failed attempt to prevent brute force
        fetchNewCaptcha();
        throw new Error(data.error || "Login gagal");
      }

      router.push("/admin");
      router.refresh();
    } catch (err: any) {
      setErrorMsg(err.message || "Email atau kata sandi tidak cocok.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#05070d] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Glow ambient background */}
      <div className="glow-ambient w-96 h-96 bg-sky-500/20 -top-20 -left-20 pointer-events-none"></div>
      <div className="glow-ambient w-96 h-96 bg-indigo-600/20 -bottom-20 -right-20 pointer-events-none"></div>

      <div className="max-w-md w-full relative z-10">
        {/* Back to website */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-sky-300 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Halaman Utama Portofolio</span>
        </Link>

        {/* Card */}
        <div className="glass-panel rounded-3xl p-7 sm:p-8 border border-slate-800 shadow-2xl shadow-cyan-950/40">
          {/* Header */}
          <div className="flex flex-col items-center text-center mb-6">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-sky-500 to-indigo-600 p-[1px] shadow-lg shadow-sky-500/25 mb-4">
              <div className="w-full h-full bg-[#090d16] rounded-[15px] flex items-center justify-center">
                <ShieldCheck className="w-7 h-7 text-sky-400" />
              </div>
            </div>
            <h1 className="text-2xl font-extrabold text-white tracking-tight">
              Admin Portal
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Kelola seluruh konten, proyek, dan data portofolio secara dinamis
            </p>
          </div>

          {errorMsg && (
            <div className="p-3.5 mb-5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2.5 animate-in fade-in duration-200">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            {/* Honeypot field (hidden from human users, traps spam bots) */}
            <div className="hidden" aria-hidden="true">
              <input
                type="text"
                name="website_verify"
                tabIndex={-1}
                autoComplete="off"
                value={honeypot}
                onChange={(e) => setHoneypot(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Username / Email Admin
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin atau admin@portfolio.dev"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-sky-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Kata Sandi
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-sky-500 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-500 hover:text-slate-300"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Cryptographic Visual CAPTCHA */}
            <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800/90 space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <KeyRound className="w-3.5 h-3.5 text-sky-400" />
                  <span>Verifikasi Keamanan (Anti-Bot)</span>
                </label>
                <button
                  type="button"
                  onClick={fetchNewCaptcha}
                  disabled={captchaLoading}
                  className="text-[11px] text-sky-400 hover:text-sky-300 flex items-center gap-1 font-medium transition-colors"
                  title="Ganti Kode Captcha"
                >
                  <RefreshCw className={`w-3 h-3 ${captchaLoading ? "animate-spin" : ""}`} />
                  <span>Acak Baru</span>
                </button>
              </div>

              <div className="flex items-center gap-3">
                {/* Visual SVG Noise Box */}
                <div className="shrink-0 relative rounded-xl overflow-hidden shadow-inner border border-slate-700/60 bg-[#090d16]">
                  {captchaData?.svg ? (
                    <div
                      dangerouslySetInnerHTML={{ __html: captchaData.svg }}
                      className="cursor-pointer"
                      onClick={fetchNewCaptcha}
                      title="Klik untuk acak gambar baru"
                    />
                  ) : (
                    <div className="w-40 h-[50px] flex items-center justify-center bg-slate-950 text-slate-500 text-xs">
                      <Loader2 className="w-4 h-4 animate-spin text-sky-400" />
                    </div>
                  )}
                </div>

                {/* Input Answer */}
                <div className="flex-1">
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={captchaInput}
                    onChange={(e) => setCaptchaInput(e.target.value.toUpperCase())}
                    placeholder="Ketik 5 kode"
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono font-bold tracking-widest text-center text-sm focus:outline-none focus:border-sky-500 uppercase transition-colors"
                  />
                </div>
              </div>

              <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-mono">
                <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                <span>HMAC Cryptographic Signature & Rate Limiter Aktif</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 px-6 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-semibold text-sm shadow-xl shadow-sky-500/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Memverifikasi Keamanan...</span>
                </>
              ) : (
                <>
                  <span>Masuk Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
