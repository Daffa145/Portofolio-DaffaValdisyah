"use client";

import React from "react";
import Link from "next/link";
import {
  Code2,
  Heart,
  ArrowUp,
  Database,
  Layers,
  ShieldCheck,
} from "lucide-react";
import { ProfileData } from "@/lib/initial-data";

interface FooterProps {
  profile: ProfileData;
}

export default function Footer({ profile }: FooterProps) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-[#04060a] border-t border-slate-900 pt-16 pb-12 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-10 border-b border-slate-900">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 p-[1px] shadow-lg shadow-sky-500/20">
              <div className="w-full h-full bg-[#090d16] rounded-[11px] flex items-center justify-center">
                <Code2 className="w-5 h-5 text-sky-400" />
              </div>
            </div>
            <div>
              <span className="font-bold text-base text-white tracking-tight">
                {profile.fullName}
              </span>
              <p className="text-xs text-slate-400">{profile.title}</p>
            </div>
          </div>

          {/* Quick Links */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400">
            <a href="#hero" className="hover:text-sky-300 transition-colors">
              Beranda
            </a>
            <a href="#about" className="hover:text-sky-300 transition-colors">
              Tentang
            </a>
            <a href="#skills" className="hover:text-sky-300 transition-colors">
              Keahlian
            </a>
            <a href="#projects" className="hover:text-sky-300 transition-colors">
              Proyek
            </a>
            <a href="#experience" className="hover:text-sky-300 transition-colors">
              Pengalaman
            </a>
            <a href="#contact" className="hover:text-sky-300 transition-colors">
              Kontak
            </a>
            <Link
              href="/admin"
              className="text-sky-400 hover:text-sky-300 font-semibold flex items-center gap-1 transition-colors"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Admin Panel</span>
            </Link>
          </div>

          {/* Back to top */}
          <button
            type="button"
            suppressHydrationWarning
            onClick={scrollToTop}
            className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-sky-500/40 transition-all flex items-center gap-2 text-xs"
            title="Kembali ke atas"
          >
            <span>Ke Atas</span>
            <ArrowUp className="w-4 h-4" />
          </button>
        </div>

        <div className="pt-8 flex items-center justify-center text-xs text-slate-500">
          <p suppressHydrationWarning>
            © {new Date().getFullYear()} {profile.fullName}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
