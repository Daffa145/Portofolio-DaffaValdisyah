"use client";

import React, { useState, useEffect } from "react";
import {
  Briefcase,
  GraduationCap,
  Calendar,
  MapPin,
  Award,
} from "lucide-react";
import { ExperienceData, EducationData } from "@/lib/initial-data";

interface ExperienceSectionProps {
  experiences: ExperienceData[];
  educations: EducationData[];
}

export default function ExperienceSection({
  experiences,
  educations,
}: ExperienceSectionProps) {
  const [activeTab, setActiveTab] = useState<"experience" | "education">(
    experiences.length > 0 ? "experience" : "education"
  );

  useEffect(() => {
    if (experiences.length === 0 && educations.length > 0) {
      setActiveTab("education");
    } else if (experiences.length > 0 && activeTab === "education" && educations.length === 0) {
      setActiveTab("experience");
    }
  }, [experiences.length, educations.length, activeTab]);

  if (experiences.length === 0 && educations.length === 0) {
    return null;
  }

  return (
    <section id="experience" className="py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-12">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-xs font-semibold text-cyan-400 mb-3">
            <Briefcase className="w-3.5 h-3.5" />
            <span>REKAM JEJAK & KARIER</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Pengalaman & <span className="text-gradient">Sertifikasi Profesional</span>
          </h2>
          <p className="mt-3 text-base text-slate-400 max-w-2xl">
            Perjalanan profesional dalam memimpin inisiatif teknologi, kolaborasi tim global, dan sertifikasi keahlian.
          </p>
        </div>

        {/* Tab Toggle */}
        <div className="flex items-center justify-center gap-3 mb-12">
          {experiences.length > 0 && (
            <button
              type="button"
              suppressHydrationWarning
              onClick={() => setActiveTab("experience")}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
                activeTab === "experience"
                  ? "bg-gradient-to-r from-sky-500 to-indigo-600 text-white shadow-lg shadow-sky-500/20 scale-105"
                  : "bg-slate-900/80 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800"
              }`}
            >
              <Briefcase className="w-4 h-4" />
              <span>Pengalaman Kerja ({experiences.length})</span>
            </button>
          )}

          {educations.length > 0 && (
            <button
              type="button"
              suppressHydrationWarning
              onClick={() => setActiveTab("education")}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
                activeTab === "education"
                  ? "bg-gradient-to-r from-sky-500 to-indigo-600 text-white shadow-lg shadow-sky-500/20 scale-105"
                  : "bg-slate-900/80 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800"
              }`}
            >
              <GraduationCap className="w-4 h-4" />
              <span>Pendidikan & Sertifikasi ({educations.length})</span>
            </button>
          )}
        </div>

        {/* Experience Timeline */}
        {activeTab === "experience" && experiences.length > 0 && (
          <div className="max-w-4xl mx-auto relative pl-6 sm:pl-10 border-l border-slate-800 space-y-10">
            {experiences.map((exp) => (
              <div key={exp.id} className="relative group">
                {/* Glowing Node */}
                <div className="absolute -left-[31px] sm:-left-[47px] top-1.5 w-4 h-4 rounded-full bg-slate-900 border-2 border-sky-400 group-hover:scale-125 group-hover:bg-sky-400 transition-all duration-300 shadow-md shadow-sky-400/30"></div>

                {/* Card */}
                <div className="glass-panel glass-panel-hover rounded-2xl p-6 border border-slate-800 transition-all">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <h3 className="text-lg font-bold text-white group-hover:text-sky-300 transition-colors">
                      {exp.role}
                    </h3>
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-sky-500/10 text-sky-400 border border-sky-500/20">
                      <Calendar className="w-3 h-3" />
                      {exp.startDate} - {exp.endDate}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 mb-4">
                    <span className="text-slate-200 font-semibold">{exp.company}</span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-500" />
                      {exp.location}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[11px]">
                      {exp.type}
                    </span>
                  </div>

                  <p className="text-sm text-slate-300 leading-relaxed mb-4">
                    {exp.description}
                  </p>

                  {/* Technologies */}
                  {exp.technologies && exp.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-3 border-t border-slate-800/80">
                      {exp.technologies.map((tech, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded text-[11px] font-mono bg-slate-800 text-slate-400"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Education Timeline */}
        {activeTab === "education" && educations.length > 0 && (
          <div className="max-w-4xl mx-auto relative pl-6 sm:pl-10 border-l border-slate-800 space-y-10">
            {educations.map((edu) => (
              <div key={edu.id} className="relative group">
                {/* Glowing Node */}
                <div className="absolute -left-[31px] sm:-left-[47px] top-1.5 w-4 h-4 rounded-full bg-slate-900 border-2 border-indigo-400 group-hover:scale-125 group-hover:bg-indigo-400 transition-all duration-300 shadow-md shadow-indigo-400/30"></div>

                {/* Card */}
                <div className="glass-panel glass-panel-hover rounded-2xl p-6 border border-slate-800 transition-all">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <h3 className="text-lg font-bold text-white group-hover:text-indigo-300 transition-colors flex items-center gap-2">
                      <Award className="w-4 h-4 text-indigo-400" />
                      {edu.title}
                    </h3>
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                      <Calendar className="w-3 h-3" />
                      {edu.year}
                    </span>
                  </div>

                  <p className="text-xs font-semibold text-sky-400 mb-3">
                    {edu.institution}
                  </p>

                  <p className="text-sm text-slate-300 leading-relaxed">
                    {edu.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
