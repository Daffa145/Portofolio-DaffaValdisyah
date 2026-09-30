"use client";

import React, { useState } from "react";
import {
  ArrowRight,
  Download,
  CheckCircle2,
  Copy,
  Check,
  Zap,
  Code2,
  FileCode,
  Sparkles,
  Layers,
  Terminal,
  Send,
} from "lucide-react";
import { GithubIcon, LinkedinIcon, TwitterIcon, InstagramIcon } from "./SocialIcons";
import { ProfileData } from "@/lib/initial-data";

interface HeroSectionProps {
  profile: ProfileData;
}

export default function HeroSection({ profile }: HeroSectionProps) {
  const [copied, setCopied] = useState(false);
  const [activeCodeTab, setActiveCodeTab] = useState<"profile" | "stack" | "action">("profile");
  const [codeCopied, setCodeCopied] = useState(false);

  const copyEmail = () => {
    navigator.clipboard.writeText(profile.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getCodeSnippet = () => {
    if (activeCodeTab === "profile") {
      return `import { FullstackEngineer } from "@portfolio/core";

export const developer: FullstackEngineer = {
  name: "${profile.fullName}",
  title: "${profile.title}",
  location: "${profile.location}",
  experience: "${profile.yearsOfExperience}+ Years in Production",
  specialties: ["Modern Web Architecture", "High Performance APIs", "UI/UX Systems"],
  availability: "${profile.availableForWork ? "Available for Contracts & Roles" : "Employed"}",
  deliverExcellence: async () => true,
};`;
    }

    if (activeCodeTab === "stack") {
      return `// Core Enterprise Architecture Config
export const techEcosystem = {
  frontend: ["Next.js App Router", "React 19", "TypeScript", "Tailwind CSS"],
  backend: ["Node.js Server Actions", "REST APIs", "Prisma ORM 7"],
  database: ["Neon Serverless DB", "Supabase PostgreSQL", "Redis"],
  cloudDeploy: ["Vercel Edge Network", "CI/CD Workflows", "Turbopack"],
  status: "🚀 100% Dynamic, Secure & Production Ready",
};`;
    }

    return `import { initiateCollaboration } from "@ecosystem/connect";

export async function hireMe(project: ProjectScope) {
  const contract = await initiateCollaboration({
    leadEngineer: "${profile.fullName}",
    deliverySpeed: "Optimized & Reliable",
    cleanCodeGuaranteed: true,
  });

  return contract.status === "ACTIVE";
}`;
  };

  const copyCurrentCode = () => {
    navigator.clipboard.writeText(getCodeSnippet());
    setCodeCopied(true);
    setTimeout(() => setCodeCopied(false), 2000);
  };

  return (
    <section
      id="hero"
      className="relative min-h-screen pt-28 pb-20 flex items-center justify-center overflow-hidden"
    >
      {/* Background Ambient Glows */}
      <div className="glow-ambient w-96 h-96 bg-sky-500/20 top-20 -left-20 animate-pulse-slow"></div>
      <div className="glow-ambient w-[500px] h-[500px] bg-indigo-600/15 top-40 right-0 animate-pulse-slow delay-1000"></div>
      <div className="glow-ambient w-80 h-80 bg-cyan-400/10 bottom-10 left-1/3"></div>

      {/* Grid Pattern Overlay */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(rgba(255, 255, 255, 0.4) 1px, transparent 1px)`,
          backgroundSize: "24px 24px",
        }}
      ></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Text Info */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            {/* Availability Pill */}
            {profile.availableForWork && (
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/80 border border-emerald-500/30 text-xs font-medium text-slate-300 mb-6 shadow-lg shadow-emerald-950/20 backdrop-blur-md">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="text-emerald-300 font-medium">Tersedia untuk Pekerjaan & Proyek Web</span>
              </div>
            )}

            {/* Intro Greeting */}
            <div className="space-y-2.5">
              <span className="text-sky-400 font-mono text-xs sm:text-sm tracking-wider uppercase font-semibold">
                Halo, Selamat Datang di Portofolio Saya 👋
              </span>
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-[40px] font-bold text-white tracking-tight leading-snug">
                Saya <span className="text-gradient">{profile.fullName}</span>
              </h1>
              <p className="text-sm sm:text-base md:text-lg font-medium text-slate-300">
                {profile.title}
              </p>
            </div>

            {/* Tagline & Bio description */}
            <p className="mt-4 text-xs sm:text-sm md:text-[15px] text-slate-400 max-w-2xl leading-relaxed">
              {profile.tagline} {profile.bio}
            </p>

            {/* Action CTA Buttons - Always 1 Row Horizontal Side-by-Side */}
            <div className="mt-8 flex flex-row items-center gap-2 sm:gap-3 flex-nowrap w-full sm:w-auto overflow-x-auto no-scrollbar pb-1">
              <a
                href="#projects"
                className="h-10 sm:h-11 px-3.5 sm:px-5 rounded-xl bg-gradient-to-r from-sky-500 via-indigo-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-semibold text-xs sm:text-sm shadow-md shadow-sky-500/25 hover:shadow-sky-500/40 hover:scale-[1.02] transition-all flex items-center justify-center gap-1.5 sm:gap-2 group cursor-pointer whitespace-nowrap shrink-0"
              >
                <span>Jelajahi Proyek</span>
                <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:translate-x-0.5 transition-transform" />
              </a>

              {profile.resumeUrl && (
                <a
                  href={profile.resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-10 sm:h-11 px-3.5 sm:px-5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 hover:text-white font-semibold text-xs sm:text-sm border border-slate-700/80 hover:border-slate-600 transition-all flex items-center justify-center gap-1.5 sm:gap-2 backdrop-blur-md shadow-md whitespace-nowrap shrink-0"
                >
                  <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-sky-400" />
                  <span>Unduh CV</span>
                </a>
              )}

              <a
                href="#contact"
                className="h-10 sm:h-11 px-3.5 sm:px-5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 hover:text-white font-semibold text-xs sm:text-sm border border-slate-700/80 hover:border-slate-600 transition-all flex items-center justify-center gap-1.5 sm:gap-2 backdrop-blur-md shadow-md whitespace-nowrap shrink-0"
              >
                <Send className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-indigo-400" />
                <span>Hubungi Saya</span>
              </a>
            </div>

            {/* Email quick copy & Social links */}
            <div className="mt-10 pt-6 border-t border-slate-800/80 w-full flex flex-wrap items-center justify-between gap-4">
              {/* Email Chip */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs font-mono text-slate-300">
                  <span className="text-sky-400">@</span>
                  <span>{profile.email}</span>
                </div>
                <button
                  type="button"
                  suppressHydrationWarning
                  onClick={copyEmail}
                  className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-sky-500/50 transition-colors"
                  title="Salin Email"
                >
                  {copied ? (
                    <Check className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>

              {/* Social Icons Row */}
              <div className="flex items-center gap-2">
                {profile.githubUrl && (
                  <a
                    href={profile.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-sky-500/50 transition-colors"
                    title="GitHub"
                  >
                    <GithubIcon className="w-4 h-4" />
                  </a>
                )}
                {profile.linkedinUrl && (
                  <a
                    href={profile.linkedinUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-sky-500/50 transition-colors"
                    title="LinkedIn"
                  >
                    <LinkedinIcon className="w-4 h-4" />
                  </a>
                )}
                {profile.twitterUrl && (
                  <a
                    href={profile.twitterUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-sky-500/50 transition-colors"
                    title="Twitter / X"
                  >
                    <TwitterIcon className="w-4 h-4" />
                  </a>
                )}
                {profile.instagramUrl && (
                  <a
                    href={profile.instagramUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-sky-500/50 transition-colors"
                    title="Instagram"
                  >
                    <InstagramIcon className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Interactive VS Code Developer Studio */}
          <div className="lg:col-span-5 relative">
            <div className="glass-panel rounded-3xl overflow-hidden shadow-2xl shadow-cyan-950/40 border border-slate-700/60 transition-all duration-300 hover:border-sky-500/40">
              {/* VS Code Titlebar */}
              <div className="bg-[#0b0f19] px-4 py-2.5 border-b border-slate-800/90 flex items-center justify-between">
                {/* Traffic lights */}
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#ff5f56] shadow-sm"></div>
                  <div className="w-3 h-3 rounded-full bg-[#ffbd2e] shadow-sm"></div>
                  <div className="w-3 h-3 rounded-full bg-[#27c93f] shadow-sm"></div>
                </div>

                <div className="flex items-center gap-1.5 text-[11px] font-mono text-slate-400">
                  <Code2 className="w-3.5 h-3.5 text-sky-400" />
                  <span className="font-semibold text-slate-300">DeveloperStudio.tsx</span>
                </div>

                {/* Copy Button */}
                <button
                  type="button"
                  suppressHydrationWarning
                  onClick={copyCurrentCode}
                  className="p-1 rounded-md text-slate-400 hover:text-sky-300 transition-colors"
                  title="Salin Potongan Kode"
                >
                  {codeCopied ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>

              {/* Breadcrumbs / Editor Tabs */}
              <div className="bg-[#090d16] px-2 pt-2 border-b border-slate-800 flex items-center gap-1 overflow-x-auto text-xs font-mono">
                <button
                  type="button"
                  suppressHydrationWarning
                  onClick={() => setActiveCodeTab("profile")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-t-lg transition-colors border-t-2 ${
                    activeCodeTab === "profile"
                      ? "bg-[#060911] text-sky-300 border-sky-400 font-semibold"
                      : "text-slate-500 hover:text-slate-300 border-transparent hover:bg-slate-900/50"
                  }`}
                >
                  <FileCode className="w-3.5 h-3.5 text-sky-400" />
                  <span>Developer.ts</span>
                </button>

                <button
                  type="button"
                  suppressHydrationWarning
                  onClick={() => setActiveCodeTab("stack")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-t-lg transition-colors border-t-2 ${
                    activeCodeTab === "stack"
                      ? "bg-[#060911] text-emerald-300 border-emerald-400 font-semibold"
                      : "text-slate-500 hover:text-slate-300 border-transparent hover:bg-slate-900/50"
                  }`}
                >
                  <Layers className="w-3.5 h-3.5 text-emerald-400" />
                  <span>TechStack.config</span>
                </button>

                <button
                  type="button"
                  suppressHydrationWarning
                  onClick={() => setActiveCodeTab("action")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-t-lg transition-colors border-t-2 ${
                    activeCodeTab === "action"
                      ? "bg-[#060911] text-indigo-300 border-indigo-400 font-semibold"
                      : "text-slate-500 hover:text-slate-300 border-transparent hover:bg-slate-900/50"
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                  <span>hireMe.ts</span>
                </button>
              </div>

              {/* Code Body with Line Numbers */}
              <div className="p-4 sm:p-5 font-mono text-[11px] sm:text-xs leading-relaxed bg-[#060911] overflow-x-auto select-text">
                {activeCodeTab === "profile" && (
                  <div className="space-y-1">
                    <div className="text-slate-500">
                      <span className="text-pink-400">import</span> &#123; <span className="text-sky-300">FullstackEngineer</span> &#125; <span className="text-pink-400">from</span> <span className="text-emerald-300">"@portfolio/core"</span>;
                    </div>
                    <div className="h-2"></div>
                    <div>
                      <span className="text-pink-400">export const</span> <span className="text-sky-400">developer</span>: <span className="text-indigo-300">FullstackEngineer</span> = &#123;
                    </div>
                    <div className="pl-4">
                      <span className="text-slate-300">name</span>: <span className="text-amber-300">"{profile.fullName}"</span>,
                    </div>
                    <div className="pl-4">
                      <span className="text-slate-300">title</span>: <span className="text-emerald-300">"{profile.title}"</span>,
                    </div>
                    <div className="pl-4">
                      <span className="text-slate-300">location</span>: <span className="text-emerald-300">"{profile.location}"</span>,
                    </div>
                    <div className="pl-4">
                      <span className="text-slate-300">experience</span>: <span className="text-amber-300">"{profile.yearsOfExperience}+ Tahun Profesional"</span>,
                    </div>
                    <div className="pl-4">
                      <span className="text-slate-300">status</span>: <span className="text-cyan-300">"{profile.availableForWork ? "🚀 Tersedia untuk Proyek Baru" : "Fokus pada Proyek Saat Ini"}"</span>,
                    </div>
                    <div className="pl-4">
                      <span className="text-slate-300">deliverHighImpactCode</span>: <span className="text-pink-400">async</span> () =&gt; <span className="text-indigo-400">true</span>,
                    </div>
                    <div>&#125;;</div>
                  </div>
                )}

                {activeCodeTab === "stack" && (
                  <div className="space-y-1">
                    <div className="text-slate-500">// Arsitektur Ekosistem Web Skala Enterprise</div>
                    <div>
                      <span className="text-pink-400">export const</span> <span className="text-emerald-400">techEcosystem</span> = &#123;
                    </div>
                    <div className="pl-4">
                      <span className="text-slate-300">frontend</span>: [<span className="text-amber-300">"Next.js App Router"</span>, <span className="text-amber-300">"React 19"</span>, <span className="text-amber-300">"TypeScript"</span>, <span className="text-amber-300">"Tailwind CSS"</span>],
                    </div>
                    <div className="pl-4">
                      <span className="text-slate-300">backend</span>: [<span className="text-amber-300">"Server Actions"</span>, <span className="text-amber-300">"REST APIs"</span>, <span className="text-amber-300">"Prisma ORM 7"</span>],
                    </div>
                    <div className="pl-4">
                      <span className="text-slate-300">database</span>: [<span className="text-emerald-300">"Neon PostgreSQL"</span>, <span className="text-emerald-300">"Supabase Cloud"</span>],
                    </div>
                    <div className="pl-4">
                      <span className="text-slate-300">deployment</span>: [<span className="text-cyan-300">"Vercel Edge Network"</span>, <span className="text-cyan-300">"Turbopack"</span>],
                    </div>
                    <div className="pl-4">
                      <span className="text-slate-300">isDynamic</span>: <span className="text-pink-400">true</span>,
                    </div>
                    <div>&#125;;</div>
                  </div>
                )}

                {activeCodeTab === "action" && (
                  <div className="space-y-1">
                    <div className="text-slate-500">
                      <span className="text-pink-400">import</span> &#123; <span className="text-sky-300">initiateCollaboration</span> &#125; <span className="text-pink-400">from</span> <span className="text-emerald-300">"@ecosystem/connect"</span>;
                    </div>
                    <div className="h-2"></div>
                    <div>
                      <span className="text-pink-400">export async function</span> <span className="text-sky-400">collaborateWithMe</span>() &#123;
                    </div>
                    <div className="pl-4">
                      <span className="text-pink-400">const</span> <span className="text-indigo-300">partnership</span> = <span className="text-pink-400">await</span> <span className="text-sky-300">initiateCollaboration</span>(&#123;
                    </div>
                    <div className="pl-8">
                      <span className="text-slate-300">leadEngineer</span>: <span className="text-amber-300">"{profile.fullName}"</span>,
                    </div>
                    <div className="pl-8">
                      <span className="text-slate-300">cleanCode</span>: <span className="text-pink-400">true</span>,
                    </div>
                    <div className="pl-8">
                      <span className="text-slate-300">communication</span>: <span className="text-emerald-300">"Fast & Transparent"</span>,
                    </div>
                    <div className="pl-4">&#125;);</div>
                    <div className="h-1"></div>
                    <div className="pl-4">
                      <span className="text-pink-400">return</span> <span className="text-indigo-300">partnership</span>.<span className="text-cyan-300">status</span> === <span className="text-emerald-300">"ACTIVE"</span>;
                    </div>
                    <div>&#125;</div>
                  </div>
                )}
              </div>

              {/* Status Bar */}
              <div className="bg-[#0b0f19] px-4 py-2 border-t border-slate-800/90 flex items-center justify-between text-[10px] font-mono text-slate-400">
                <div className="flex items-center gap-2">
                  <span className="flex items-center gap-1 text-emerald-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    TypeScript v5.7
                  </span>
                  <span className="text-slate-600">•</span>
                  <span>UTF-8</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sky-400">0 Errors</span>
                  <span className="text-slate-600">•</span>
                  <span>Ready in Next.js</span>
                </div>
              </div>
            </div>

            {/* Profile Avatar Card Floating */}
            <div className="mt-5 glass-panel rounded-2xl p-4 flex items-center gap-4 border border-slate-700/50 shadow-lg">
              <div className="relative w-14 h-14 rounded-xl overflow-hidden border-2 border-sky-500/50 shrink-0">
                <img
                  src={profile.avatarUrl}
                  alt={profile.fullName}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-bold text-white truncate">{profile.fullName}</h3>
                <p className="text-xs text-sky-400 truncate">{profile.title}</p>
                <p className="text-[11px] text-slate-400 mt-0.5 truncate">
                  {profile.location} • Spesialis Full-Stack
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16 pt-10 border-t border-slate-800/80">
          <div className="glass-panel p-5 rounded-2xl border border-slate-800 flex flex-col items-center text-center group hover:border-sky-500/40 transition-colors">
            <span className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gradient">
              {profile.yearsOfExperience}+
            </span>
            <span className="text-xs sm:text-sm text-slate-400 font-medium mt-1">
              Tahun Pengalaman
            </span>
          </div>

          <div className="glass-panel p-5 rounded-2xl border border-slate-800 flex flex-col items-center text-center group hover:border-sky-500/40 transition-colors">
            <span className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gradient-purple">
              {profile.completedProjects}+
            </span>
            <span className="text-xs sm:text-sm text-slate-400 font-medium mt-1">
              Proyek Web Selesai
            </span>
          </div>

          <div className="glass-panel p-5 rounded-2xl border border-slate-800 flex flex-col items-center text-center group hover:border-sky-500/40 transition-colors">
            <span className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gradient">
              {profile.satisfiedClients}+
            </span>
            <span className="text-xs sm:text-sm text-slate-400 font-medium mt-1">
              Klien & Partner Puas
            </span>
          </div>

          <div className="glass-panel p-5 rounded-2xl border border-slate-800 flex flex-col items-center text-center group hover:border-sky-500/40 transition-colors">
            <span className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gradient-purple">
              {profile.codeHours.toLocaleString('id-ID')}+
            </span>
            <span className="text-xs sm:text-sm text-slate-400 font-medium mt-1">
              Jam Menulis Kode
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
