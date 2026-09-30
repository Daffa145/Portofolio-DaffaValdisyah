"use client";

import React, { useRef, useState, useEffect } from "react";
import { MessageSquare, Star, Quote, ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import { TestimonialData } from "@/lib/initial-data";

interface TestimonialsSectionProps {
  testimonials: TestimonialData[];
}

export default function TestimonialsSection({
  testimonials,
}: TestimonialsSectionProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);

  if (!testimonials || testimonials.length === 0) {
    return null;
  }

  // Multiply items if few testimonials so the loop is always rich & seamless
  const displayItems =
    testimonials.length < 5
      ? [...testimonials, ...testimonials, ...testimonials, ...testimonials]
      : [...testimonials, ...testimonials];

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -380, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 380, behavior: "smooth" });
    }
  };

  return (
    <section id="testimonials" className="py-24 relative bg-slate-950/40 border-t border-slate-900 overflow-hidden">
      {/* Background ambient light */}
      <div className="glow-ambient w-[600px] h-[300px] bg-amber-500/10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header (Centered like all other sections) */}
        <div className="flex flex-col items-center text-center mb-12">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-xs font-semibold text-amber-400 mb-3">
            <MessageSquare className="w-3.5 h-3.5" />
            <span>TESTIMONI & REKOMENDASI</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white tracking-tight">
            Apa Kata <span className="text-gradient">Klien & Rekan Kerja</span>
          </h2>
          <p className="mt-3 text-xs sm:text-sm text-slate-400 max-w-2xl">
            Feedback nyata dari kolaborasi pengembangan sistem web, arsitektur software, dan pengalaman kerja tim.
          </p>

          {/* Controls: Prev, Play/Pause, Next */}
          <div className="flex items-center gap-2 mt-6">
            <button
              type="button"
              suppressHydrationWarning
              onClick={scrollLeft}
              className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-amber-500/40 transition-colors shadow-lg cursor-pointer"
              title="Geser ke Kiri"
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <button
              type="button"
              suppressHydrationWarning
              onClick={() => setIsPaused(!isPaused)}
              className={`px-3.5 py-2 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-lg cursor-pointer ${
                isPaused
                  ? "bg-amber-500/20 border-amber-500/40 text-amber-300"
                  : "bg-slate-900 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700"
              }`}
              title={isPaused ? "Lanjutkan Slide Otomatis" : "Jeda Slide"}
            >
              {isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
              <span>{isPaused ? "Putar" : "Jeda"}</span>
            </button>

            <button
              type="button"
              suppressHydrationWarning
              onClick={scrollRight}
              className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-amber-500/40 transition-colors shadow-lg cursor-pointer"
              title="Geser ke Kanan"
              aria-label="Scroll right"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* 1-Row Infinite Sliding Container */}
      <div
        className="relative w-full overflow-hidden"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* Left & Right Gradient Fade Masks */}
        <div className="absolute left-0 inset-y-0 w-12 sm:w-28 bg-gradient-to-r from-[#05070d] via-[#05070d]/80 to-transparent z-20 pointer-events-none"></div>
        <div className="absolute right-0 inset-y-0 w-12 sm:w-28 bg-gradient-to-l from-[#05070d] via-[#05070d]/80 to-transparent z-20 pointer-events-none"></div>

        {/* Sliding Track */}
        <div
          ref={scrollRef}
          className={`flex gap-6 py-4 px-4 overflow-x-auto no-scrollbar select-none ${
            isPaused ? "" : "animate-marquee"
          }`}
          style={{
            animationPlayState: isPaused ? "paused" : "running",
            scrollBehavior: "smooth",
          }}
        >
          {displayItems.map((item, index) => (
            <div
              key={`${item.id}-${index}`}
              className="w-[320px] sm:w-[380px] md:w-[420px] shrink-0 glass-panel glass-panel-hover rounded-3xl p-6 sm:p-7 border border-slate-800/90 flex flex-col justify-between relative group hover:border-amber-500/40 transition-all duration-300"
            >
              <Quote className="absolute top-5 right-5 w-8 h-8 text-slate-800/80 group-hover:text-amber-500/20 transition-colors" />

              <div>
                {/* Rating Stars */}
                <div className="flex items-center gap-1 mb-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3.5 h-3.5 ${
                        i < item.rating
                          ? "text-amber-400 fill-amber-400"
                          : "text-slate-700"
                      }`}
                    />
                  ))}
                </div>

                {/* Content */}
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed italic mb-6 relative z-10 line-clamp-4">
                  "{item.content}"
                </p>
              </div>

              {/* Author */}
              <div className="flex items-center gap-3.5 pt-4 border-t border-slate-800/80">
                <img
                  src={item.avatarUrl}
                  alt={item.name}
                  className="w-10 h-10 rounded-full object-cover border-2 border-amber-500/30 shrink-0"
                />
                <div className="min-w-0">
                  <h4 className="text-xs sm:text-sm font-bold text-white truncate group-hover:text-amber-300 transition-colors">
                    {item.name}
                  </h4>
                  <p className="text-[11px] text-sky-400 truncate font-medium">
                    {item.role}
                  </p>
                  {item.company && (
                    <p className="text-[10px] text-slate-400 truncate mt-0.5">
                      {item.company}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
