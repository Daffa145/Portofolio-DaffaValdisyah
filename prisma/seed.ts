import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🚀 Starting database migration and seed for Supabase...");

  // 1. Seed Admin User
  const adminEmail = process.env.ADMIN_EMAIL || "daffavaldisyah@gmail.com";
  const rawPassword = process.env.ADMIN_PASSWORD || "admin123";
  const hashedPassword = await bcrypt.hash(rawPassword, 10);

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      password: hashedPassword,
      name: "Daffa Valdisyah",
    },
    create: {
      email: adminEmail,
      name: "Daffa Valdisyah",
      password: hashedPassword,
      role: "ADMIN",
    },
  });
  console.log(`✅ Admin user seeded: ${admin.email}`);

  // 2. Seed Profile
  const profile = await prisma.profile.upsert({
    where: { id: "default-profile" },
    update: {},
    create: {
      id: "default-profile",
      fullName: "Daffa Valdisyah",
      title: "Senior Full-Stack & Cloud Engineer",
      tagline: "Merancang & Membangun Aplikasi Web Skala Besar, Cepat, dan Memukau.",
      bio: "Software Engineer berpengalaman dengan keahlian mendalam pada ekosistem Next.js, React 19, TypeScript, Supabase, PostgreSQL, dan Distributed Cloud. Berfokus pada performa tinggi, UI/UX modern, dan clean architecture.",
      aboutStory: "Ketertarikan saya pada dunia software engineering berfokus pada pembangunan sistem yang efisien dan skalabel. Saya telah memimpin dan membangun aplikasi SaaS, arsitektur REST API, dan integrasi cloud modern.",
      avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80",
      resumeUrl: "#resume",
      location: "Indonesia (Remote / Hybrid)",
      email: adminEmail,
      phone: "+62 812-3456-7890",
      githubUrl: "https://github.com/Daffa145",
      linkedinUrl: "https://linkedin.com",
      twitterUrl: "https://twitter.com",
      instagramUrl: "https://instagram.com",
      availableForWork: true,
      yearsOfExperience: 3,
      completedProjects: 25,
      satisfiedClients: 18,
      codeHours: 3600,
    },
  });
  console.log(`✅ Profile initialized: ${profile.fullName}`);

  console.log("🎉 Database migration and seed completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
