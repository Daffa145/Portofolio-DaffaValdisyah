"use client";

import React from "react";
import {
  Sparkles,
  Zap,
  Shield,
  Layers,
  Cpu,
  CheckCircle,
  Code2,
  Database,
  Cloud,
} from "lucide-react";
import { ProfileData } from "@/lib/initial-data";

interface AboutSectionProps {
  profile: ProfileData;
}

export default function AboutSection({ profile }: AboutSectionProps) {
  const pillars = [
    {
      icon: Code2,
      title: "Arsitektur Frontend Modern",
      desc: "Menguasai Next.js App Router, React Server Components, Tailwind CSS, dan optimasi Core Web Vitals untuk performa instan.",
      color: "from-sky-500/20 to-blue-500/10 border-sky-500/30 text-sky-400",
    },
    {
      icon: Database,
      title: "Backend & Database Tangguh",
      desc: "Perancangan REST & GraphQL API terstruktur, integrasi PostgreSQL via Supabase & Neon, Prisma ORM, dan autentikasi aman.",
      color: "from-emerald-500/20 to-teal-500/10 border-emerald-500/30 text-emerald-400",
    },
    {
      icon: Cloud,
      title: "Cloud Native & DevOps",
      desc: "Deployment otomatis via CI/CD, containerisasi Docker, serverless edge functions, dan monitoring telemetry.",
      color: "from-indigo-500/20 to-purple-500/10 border-indigo-500/30 text-indigo-400",
    },
    {
      icon: Shield,
      title: "Clean Code & Keamanan",
      desc: "Penerapan prinsip SOLID, TypeScript tipe ketat, sanitasi data, proteksi rate-limiting, dan dokumentasi komprehensif.",
      color: "from-amber-500/20 to-rose-500/10 border-amber-500/30 text-amber-400",
    },
  ];

  return (
    <section id="about" className="py-24 relative bg-slate-950/60 border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-16">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-sky-500/10 border border-sky-500/20 text-xs font-semibold text-sky-400 mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>TENTANG SAYA</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Kreativitas Bertemu dengan <span className="text-gradient">Engineering Presisi</span>
          </h2>
          <p className="mt-4 text-base text-slate-400 max-w-2xl">
            Membangun solusi digital yang tidak hanya estetik dan interaktif di mata pengguna, tetapi juga kuat dan teruji di level arsitektur backend.
          </p>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
          {/* Narrative Story Box */}
          <div className="lg:col-span-6 glass-panel rounded-2xl p-8 border border-slate-800 flex flex-col justify-between">
            <div>
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-sky-400"></span>
                Filosofi & Dedikasi Rekayasa Perangkat Lunak
              </h3>
              <p className="text-slate-300 leading-relaxed mb-4 text-sm sm:text-base">
                {profile.aboutStory}
              </p>
              <p className="text-slate-400 leading-relaxed text-sm">
                Saya percaya bahwa web masa kini menuntut kecepatan loading di bawah 1 detik, tipografi yang nyaman di mata, responsivitas sempurna di setiap ukuran layar, dan pengelolaan data backend yang handal menggunakan database modern seperti PostgreSQL di Neon dan Supabase.
              </p>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-800 grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
                <span className="text-xs sm:text-sm text-slate-300 font-medium">
                  Full Stack Expertise
                </span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
                <span className="text-xs sm:text-sm text-slate-300 font-medium">
                  Scalable Database
                </span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
                <span className="text-xs sm:text-sm text-slate-300 font-medium">
                  Modern Clean UI
                </span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
                <span className="text-xs sm:text-sm text-slate-300 font-medium">
                  Real-time Architecture
                </span>
              </div>
            </div>
          </div>

          {/* 4 Core Pillars Grid */}
          <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {pillars.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className={`glass-panel rounded-2xl p-6 border bg-gradient-to-br ${item.color} flex flex-col justify-start transition-all duration-300 hover:scale-[1.02]`}
                >
                  <div className="w-10 h-10 rounded-xl bg-slate-900/90 border border-white/10 flex items-center justify-center mb-4">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h4 className="text-base font-bold text-white mb-2">{item.title}</h4>
                  <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
