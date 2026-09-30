import React from "react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import SkillsSection from "@/components/SkillsSection";
import ProjectsSection from "@/components/ProjectsSection";
import ExperienceSection from "@/components/ExperienceSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import {
  getProfile,
  getSkills,
  getProjects,
  getExperiences,
  getEducations,
  getTestimonials,
} from "@/lib/db-service";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  const profile = await getProfile();
  return {
    title: `${profile.fullName} | ${profile.title}`,
    description: profile.bio,
    keywords: [
      "Web Developer",
      "Full Stack Engineer",
      "Next.js",
      "React",
      "TypeScript",
      "PostgreSQL",
      "Supabase",
      "Neon DB",
      "Portfolio Programmer",
    ],
    authors: [{ name: profile.fullName }],
    openGraph: {
      title: `${profile.fullName} | ${profile.title}`,
      description: profile.tagline,
      images: [profile.avatarUrl],
      type: "website",
    },
  };
}

export default async function HomePage() {
  const [profile, skills, projects, experiences, educations, testimonials] =
    await Promise.all([
      getProfile(),
      getSkills(true),
      getProjects(true),
      getExperiences(true),
      getEducations(true),
      getTestimonials(true),
    ]);

  return (
    <div className="min-h-screen bg-[#05070d] text-slate-100 selection:bg-sky-500/30 selection:text-sky-200">
      <Navbar profile={profile} />

      <main>
        <HeroSection profile={profile} />
        <AboutSection profile={profile} />
        <SkillsSection skills={skills} />
        <ProjectsSection projects={projects} />
        <ExperienceSection
          experiences={experiences}
          educations={educations}
        />
        <TestimonialsSection testimonials={testimonials} />
        <ContactSection profile={profile} />
      </main>

      <Footer profile={profile} />
    </div>
  );
}
