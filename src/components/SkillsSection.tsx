"use client";

import React, { useState } from "react";
import { Sparkles, Layers, CheckCircle2 } from "lucide-react";
import TechIcon from "./TechIcon";
import { SkillData } from "@/lib/initial-data";

interface SkillsSectionProps {
  skills: SkillData[];
}

export default function SkillsSection({ skills }: SkillsSectionProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const categories = [
    "All",
    "Frontend",
    "Backend",
    "Database & Cloud",
    "DevOps & Tools",
    "Architecture",
  ];

  const filteredSkills =
    selectedCategory === "All"
      ? skills
      : skills.filter((s) => s.category === selectedCategory);

  return (
    <section id="skills" className="py-24 relative overflow-hidden">
      {/* Background glow */}
      <div className="glow-ambient w-96 h-96 bg-indigo-600/10 top-1/2 left-0 -translate-y-1/2 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-12">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-xs font-semibold text-indigo-400 mb-3">
            <Layers className="w-3.5 h-3.5" />
            <span>KEAHLIAN & TEKNOLOGI</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Tech Stack & <span className="text-gradient">Penguasaan Alat</span>
          </h2>
          <p className="mt-3 text-base text-slate-400 max-w-2xl">
            Kumpulan teknologi mutakhir yang saya gunakan setiap hari untuk membangun ekosistem aplikasi web berkinerja tinggi.
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                suppressHydrationWarning
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-200 ${
                  isActive
                    ? "bg-gradient-to-r from-sky-500 to-indigo-600 text-white shadow-lg shadow-sky-500/20 scale-105"
                    : "bg-slate-900/80 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800"
                }`}
              >
                {cat === "All" ? "Semua Teknologi" : cat}
              </button>
            );
          })}
        </div>

        {/* Skills Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredSkills.map((skill) => (
            <div
              key={skill.id}
              className="glass-panel glass-panel-hover rounded-2xl p-5 border border-slate-800 flex flex-col justify-between group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-slate-900 border border-slate-700/60 flex items-center justify-center text-sky-400 group-hover:scale-110 group-hover:text-indigo-400 transition-all duration-300 shadow-md">
                    <TechIcon name={skill.icon} className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white group-hover:text-sky-300 transition-colors">
                      {skill.name}
                    </h3>
                    <span className="text-[11px] text-slate-400 uppercase tracking-wider font-mono">
                      {skill.category}
                    </span>
                  </div>
                </div>

                <span className="text-xs font-mono font-bold text-sky-400 bg-sky-500/10 px-2.5 py-1 rounded-md border border-sky-500/20">
                  {skill.level}%
                </span>
              </div>

              {/* Progress bar */}
              <div>
                <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-slate-800/80 p-[1px]">
                  <div
                    className="bg-gradient-to-r from-sky-500 via-indigo-500 to-purple-500 h-full rounded-full transition-all duration-700 ease-out group-hover:brightness-125"
                    style={{ width: `${skill.level}%` }}
                  ></div>
                </div>
                <div className="flex justify-between items-center mt-2 text-[11px] text-slate-500">
                  <span>Proficiency</span>
                  <span className="text-slate-400">
                    {skill.level >= 90 ? "Tingkat Lanjut (Expert)" : skill.level >= 75 ? "Mahir (Proficient)" : "Menengah (Intermediate)"}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
