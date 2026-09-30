export interface ProfileData {
  id: string;
  fullName: string;
  title: string;
  tagline: string;
  bio: string;
  aboutStory: string;
  avatarUrl: string;
  resumeUrl: string;
  location: string;
  email: string;
  phone: string;
  githubUrl: string;
  linkedinUrl: string;
  twitterUrl: string;
  instagramUrl: string;
  availableForWork: boolean;
  yearsOfExperience: number;
  completedProjects: number;
  satisfiedClients: number;
  codeHours: number;
}

export interface SkillData {
  id: string;
  name: string;
  category: "Frontend" | "Backend" | "Database & Cloud" | "DevOps & Tools" | "Architecture";
  icon: string;
  level: number;
  featured: boolean;
  isActive?: boolean;
  order: number;
}

export interface ProjectData {
  id: string;
  title: string;
  slug: string;
  tagline: string;
  description: string;
  imageUrl: string;
  demoUrl: string;
  githubUrl: string;
  techStack: string[];
  category: "Fullstack" | "Frontend" | "Backend" | "AI / Tools" | "Mobile";
  featured: boolean;
  isActive?: boolean;
  order: number;
}

export interface ExperienceData {
  id: string;
  role: string;
  company: string;
  location: string;
  type: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  isActive?: boolean;
  description: string;
  technologies: string[];
  order: number;
}

export interface EducationData {
  id: string;
  title: string;
  institution: string;
  year: string;
  description: string;
  isActive?: boolean;
  order: number;
}

export interface TestimonialData {
  id: string;
  name: string;
  role: string;
  company: string;
  avatarUrl: string;
  content: string;
  rating: number;
  isActive?: boolean;
  order: number;
}

export interface MessageData {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export const INITIAL_PROFILE: ProfileData = {
  id: "default-profile",
  fullName: "Alex Pratama, S.Kom",
  title: "Senior Full-Stack & Cloud Solutions Architect",
  tagline: "Merancang & Membangun Aplikasi Web Skala Besar, Cepat, dan Memukau.",
  bio: "Software Engineer berpengalaman lebih dari 5 tahun dengan keahlian mendalam pada ekosistem Next.js, React, Node.js, TypeScript, Supabase, Neon PostgreSQL, dan Distributed Cloud. Berfokus pada arsitektur bersih, performa tinggi, dan pengalaman UI/UX yang modern.",
  aboutStory: "Ketertarikan saya pada dunia software engineering dimulai sejak sekolah menengah saat pertama kali memahami bagaimana kode dapat memecahkan masalah nyata. Selama 5+ tahun berkarier, saya telah memimpin pengembangan platform SaaS, arsitektur microservices, e-commerce berkinerja tinggi, dan dashboard analitik real-time.",
  avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80",
  resumeUrl: "#resume",
  location: "Jakarta & Bali, Indonesia (Remote / Hybrid)",
  email: "alex.pratama.tech@gmail.com",
  phone: "+62 812-9876-5432",
  githubUrl: "https://github.com/alexpratama",
  linkedinUrl: "https://linkedin.com/in/alexpratama",
  twitterUrl: "https://x.com/alexpratama",
  instagramUrl: "https://instagram.com/alexpratama.dev",
  availableForWork: true,
  yearsOfExperience: 5,
  completedProjects: 42,
  satisfiedClients: 28,
  codeHours: 5200,
};

export const INITIAL_SKILLS: SkillData[] = [
  { id: "sk-1", name: "Next.js 15 & React 19", category: "Frontend", icon: "Code2", level: 98, featured: true, isActive: true, order: 1 },
  { id: "sk-2", name: "TypeScript", category: "Frontend", icon: "FileCode", level: 95, featured: true, isActive: true, order: 2 },
  { id: "sk-3", name: "Tailwind CSS & Framer", category: "Frontend", icon: "Palette", level: 96, featured: true, isActive: true, order: 3 },
  { id: "sk-4", name: "Node.js & Express / NestJS", category: "Backend", icon: "Server", level: 92, featured: true, isActive: true, order: 4 },
  { id: "sk-5", name: "PostgreSQL / Neon / Supabase", category: "Database & Cloud", icon: "Database", level: 94, featured: true, isActive: true, order: 5 },
  { id: "sk-6", name: "Prisma ORM & Drizzle", category: "Database & Cloud", icon: "Layers", level: 95, featured: true, isActive: true, order: 6 },
  { id: "sk-7", name: "Redis & Caching Strategy", category: "Database & Cloud", icon: "Cpu", level: 88, featured: false, isActive: true, order: 7 },
  { id: "sk-8", name: "GraphQL & REST APIs", category: "Backend", icon: "Globe", level: 90, featured: true, isActive: true, order: 8 },
  { id: "sk-9", name: "Docker & CI/CD Pipelines", category: "DevOps & Tools", icon: "Box", level: 86, featured: false, isActive: true, order: 9 },
  { id: "sk-10", name: "AWS & Vercel Edge", category: "DevOps & Tools", icon: "Cloud", level: 89, featured: true, isActive: true, order: 10 },
  { id: "sk-11", name: "Git & Monorepos (Turborepo)", category: "DevOps & Tools", icon: "GitBranch", level: 92, featured: false, isActive: true, order: 11 },
  { id: "sk-12", name: "System Design & Architecture", category: "Architecture", icon: "Workflow", level: 91, featured: true, isActive: true, order: 12 },
];

export const INITIAL_PROJECTS: ProjectData[] = [
  {
    id: "proj-1",
    title: "NovaCloud - Multi-Tenant SaaS Monitoring",
    slug: "novacloud-saas-platform",
    tagline: "Real-time Infrastructure Observability & Telemetry Platform",
    description: "Platform observabilitas cloud skala enterprise yang mengolah jutaan log per detik dengan visualisasi grafik interaktif, alerting webhook, dan audit log multi-tenant.",
    imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80",
    demoUrl: "https://demo.novacloud.example.com",
    githubUrl: "https://github.com/alexpratama/novacloud-saas",
    techStack: ["Next.js 15", "TypeScript", "Neon Postgres", "Prisma", "Tailwind CSS", "WebSockets"],
    category: "Fullstack",
    featured: true,
    isActive: true,
    order: 1,
  },
  {
    id: "proj-2",
    title: "OmniStore - High Performance E-Commerce",
    slug: "omnistore-modern-ecommerce",
    tagline: "Headless E-Commerce with Sub-second Checkout",
    description: "Toko online modern dengan arsitektur headless, integrasi Payment Gateway Midtrans & Stripe, dynamic inventory sync, dan Lighthouse score 99/100.",
    imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80",
    demoUrl: "https://store.example.com",
    githubUrl: "https://github.com/alexpratama/omnistore-next",
    techStack: ["Next.js", "Supabase", "Stripe API", "Zustand", "Tailwind CSS"],
    category: "Fullstack",
    featured: true,
    isActive: true,
    order: 2,
  },
  {
    id: "proj-3",
    title: "PromptCraft - AI Workflow & Canvas Generator",
    slug: "promptcraft-ai-studio",
    tagline: "Visual Flow Builder for LLM Pipelines",
    description: "Editor visual berbasis node canvas untuk merancang rantai prompt AI, integrasi OpenAI & Claude models, dengan live preview dan streaming response.",
    imageUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80",
    demoUrl: "https://promptcraft.example.com",
    githubUrl: "https://github.com/alexpratama/promptcraft-ai",
    techStack: ["React", "TypeScript", "Next.js", "OpenAI SDK", "Tailwind CSS"],
    category: "AI / Tools",
    featured: true,
    isActive: true,
    order: 3,
  },
  {
    id: "proj-4",
    title: "FinancePulse - Crypto & Stock Asset Tracker",
    slug: "financepulse-asset-tracker",
    tagline: "Comprehensive Wealth & Portfolio Management Dashboard",
    description: "Aplikasi pelacak portofolio keuangan pribadi dengan sinkronisasi harga pasar real-time, prediksi tren AI, dan kalkulator pajak dividen otomatis.",
    imageUrl: "https://images.unsplash.com/photo-1642543492481-44e81e3914a7?auto=format&fit=crop&w=1200&q=80",
    demoUrl: "https://financepulse.example.com",
    githubUrl: "https://github.com/alexpratama/financepulse",
    techStack: ["Next.js", "Neon DB", "Chart.js", "TypeScript", "Tailwind CSS"],
    category: "Frontend",
    featured: true,
    isActive: true,
    order: 4,
  },
  {
    id: "proj-5",
    title: "TaskFlow - Realtime Collaborative Kanban",
    slug: "taskflow-realtime-kanban",
    tagline: "Next-gen Team Task Orchestration",
    description: "Sistem manajemen proyek kolaboratif dengan drag-and-drop mulus, live multiplayer cursors, status presence, dan rich markdown document notes.",
    imageUrl: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1200&q=80",
    demoUrl: "https://taskflow.example.com",
    githubUrl: "https://github.com/alexpratama/taskflow-kanban",
    techStack: ["Supabase Realtime", "Next.js", "dnd-kit", "PostgreSQL", "Tailwind"],
    category: "Fullstack",
    featured: false,
    isActive: true,
    order: 5,
  },
  {
    id: "proj-6",
    title: "ApexAPI - Developer Hub & API Gateway",
    slug: "apexapi-gateway-hub",
    tagline: "Secure Rate-Limited API Gateway with Analytics",
    description: "Gateway API berkemampuan rate-limiting token bucket, validasi skema runtime, caching proxy terdistribusi, dan portal dokumentasi interaktif OpenAPI.",
    imageUrl: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80",
    demoUrl: "https://apexapi.example.com",
    githubUrl: "https://github.com/alexpratama/apex-api-gateway",
    techStack: ["Node.js", "PostgreSQL", "Redis", "Docker", "Next.js"],
    category: "Backend",
    featured: false,
    isActive: true,
    order: 6,
  },
];

export const INITIAL_EXPERIENCE: ExperienceData[] = [
  {
    id: "exp-1",
    role: "Lead Full-Stack Engineer",
    company: "TechScale Nusantara",
    location: "Jakarta, Indonesia (Hybrid)",
    type: "Full-time",
    startDate: "2023",
    endDate: "Present",
    isCurrent: true,
    isActive: true,
    description: "Memimpin tim engineer beranggotakan 8 pengembang dalam membangun platform SaaS B2B. Meningkatkan efisiensi render halaman sebesar 45% dan migrasi database ke Neon Postgres dengan auto-scaling.",
    technologies: ["Next.js", "TypeScript", "Neon DB", "Prisma", "AWS", "Docker"],
    order: 1,
  },
  {
    id: "exp-2",
    role: "Senior Frontend Specialist",
    company: "DigiCraft Global Labs",
    location: "Remote",
    type: "Full-time",
    startDate: "2021",
    endDate: "2023",
    isCurrent: false,
    isActive: true,
    description: "Mengembangkan sistem desain terpusat (Design System) dengan standar aksesibilitas tinggi (WCAG AA), dipakai oleh lebih dari 12 produk internal.",
    technologies: ["React", "Next.js", "Tailwind CSS", "Storybook", "TypeScript"],
    order: 2,
  },
  {
    id: "exp-3",
    role: "Full-Stack Web Developer",
    company: "Inovasi Kreasi Digital",
    location: "Bandung, Indonesia",
    type: "Full-time",
    startDate: "2019",
    endDate: "2021",
    isCurrent: false,
    isActive: true,
    description: "Membangun lebih dari 15 aplikasi web dinamis untuk klien korporat dan fintech, mengintegrasikan Payment Gateway dan arsitektur database relasional.",
    technologies: ["Node.js", "Express", "PostgreSQL", "React", "REST API"],
    order: 3,
  },
];

export const INITIAL_EDUCATION: EducationData[] = [
  {
    id: "edu-1",
    title: "Sarjana Terapan Komputer (S.Tr.Kom) - Sistem Informasi Industri Otomotif",
    institution: "Politeknik STMI Jakarta",
    year: "2021 - 2025",
    description: "Fokus pada Web Programming & Distributed Databases.",
    isActive: true,
    order: 1,
  },
  {
    id: "edu-2",
    title: "Daffa Valdisyah. S.Tr.Kom., M.Kom.(Soon)",
    institution: "Universitas Esa Unggul",
    year: "2026 - 2027",
    description: "Mendalami pengetahuan dalam peminatan Artificial Intellegence (AI).",
    isActive: true,
    order: 2,
  },
];

export const INITIAL_TESTIMONIALS: TestimonialData[] = [
  {
    id: "testi-1",
    name: "Budi Santoso",
    role: "VP of Engineering",
    company: "Fintech Prima Indonesia",
    avatarUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80",
    content: "Alex adalah salah satu software engineer paling berbakat yang pernah bekerja bersama kami. Pemahamannya yang mendalam terhadap arsitektur Next.js dan PostgreSQL membuat produk kami rilis 3 minggu lebih cepat dari jadwal.",
    rating: 5,
    isActive: true,
    order: 1,
  },
  {
    id: "testi-2",
    name: "Sarah Jenkins",
    role: "Product Director",
    company: "SaaSify Global (Singapore)",
    avatarUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80",
    content: "Sensitivitas Alex terhadap UI/UX clean dan performa aplikasi web sungguh luar biasa. Kode yang ditulis sangat rapi, terdokumentasi dengan baik, dan mudah di-maintain.",
    rating: 5,
    isActive: true,
    order: 2,
  },
  {
    id: "testi-3",
    name: "Reza Rahadian",
    role: "Founder & CEO",
    company: "KaryaHub Tech",
    avatarUrl: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=400&q=80",
    content: "Sangat responsif dan komunikatif. Dashboard admin dan halaman utama yang dibangun Alex melebihi ekspektasi kami, baik dari sisi tampilan maupun kecepatan loading.",
    rating: 5,
    isActive: true,
    order: 3,
  },
];

export const INITIAL_MESSAGES: MessageData[] = [
  {
    id: "msg-1",
    name: "Dewi Anggraini",
    email: "dewi.ang@startup.co.id",
    subject: "Penawaran Proyek Web App SaaS",
    message: "Halo Mas Alex, kami melihat portofolio Anda dan sangat tertarik untuk berdiskusi terkait pembuatan platform SaaS analitik kami. Apakah ada waktu untuk discovery call minggu ini?",
    isRead: false,
    createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
  },
  {
    id: "msg-2",
    name: "Marcus Vance",
    email: "marcus@vancetech.io",
    subject: "Senior Full-Stack Contract Inquiry",
    message: "Hi Alex! We are building a Next.js + Neon Postgres application for European clients. Would love to hire you for a 6-month contract role.",
    isRead: true,
    createdAt: new Date(Date.now() - 3600000 * 28).toISOString(),
  },
];
