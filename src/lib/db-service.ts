import fs from "fs";
import path from "path";
import bcrypt from "bcryptjs";
import { prisma } from "./prisma";
import {
  INITIAL_PROFILE,
  INITIAL_SKILLS,
  INITIAL_PROJECTS,
  INITIAL_EXPERIENCE,
  INITIAL_EDUCATION,
  INITIAL_TESTIMONIALS,
  INITIAL_MESSAGES,
  ProfileData,
  SkillData,
  ProjectData,
  ExperienceData,
  EducationData,
  TestimonialData,
  MessageData,
} from "./initial-data";

interface LocalStore {
  profile: ProfileData;
  skills: SkillData[];
  projects: ProjectData[];
  experiences: ExperienceData[];
  educations: EducationData[];
  testimonials: TestimonialData[];
  messages: MessageData[];
  admin: {
    email: string;
    passwordHash: string;
    name: string;
  };
}

const DATA_DIR = path.join(process.cwd(), ".data");
const DATA_FILE = path.join(DATA_DIR, "portfolio-store.json");

function getDefaultAdminHash() {
  return bcrypt.hashSync(process.env.ADMIN_PASSWORD || "adminpassword123", 10);
}

function getLocalStore(): LocalStore {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (fs.existsSync(DATA_FILE)) {
      const content = fs.readFileSync(DATA_FILE, "utf-8");
      const parsed = JSON.parse(content);

      // Ensure isActive defaults for legacy records
      parsed.skills = (parsed.skills || []).map((s: SkillData) => ({
        ...s,
        isActive: s.isActive !== false,
      }));
      parsed.projects = (parsed.projects || []).map((p: ProjectData) => ({
        ...p,
        isActive: p.isActive !== false,
      }));
      parsed.experiences = (parsed.experiences || []).map((e: ExperienceData) => ({
        ...e,
        isActive: e.isActive !== false,
      }));
      parsed.educations = (parsed.educations || []).map((e: EducationData) => ({
        ...e,
        isActive: e.isActive !== false,
      }));
      parsed.testimonials = (parsed.testimonials || []).map((t: TestimonialData) => ({
        ...t,
        isActive: t.isActive !== false,
      }));

      return parsed;
    }
  } catch (err) {
    console.warn("Read local store fallback warning:", err);
  }

  const initialStore: LocalStore = {
    profile: INITIAL_PROFILE,
    skills: INITIAL_SKILLS,
    projects: INITIAL_PROJECTS,
    experiences: INITIAL_EXPERIENCE,
    educations: INITIAL_EDUCATION,
    testimonials: INITIAL_TESTIMONIALS,
    messages: INITIAL_MESSAGES,
    admin: {
      email: process.env.ADMIN_EMAIL || "admin@portfolio.dev",
      passwordHash: getDefaultAdminHash(),
      name: "Alex Pratama (Admin)",
    },
  };

  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE, JSON.stringify(initialStore, null, 2), "utf-8");
  } catch (e) {
    console.error("Failed to write initial store:", e);
  }

  return initialStore;
}

function saveLocalStore(store: LocalStore) {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE, JSON.stringify(store, null, 2), "utf-8");
  } catch (err) {
    console.error("Save local store error:", err);
  }
}

// ----------------- PROFILE -----------------
export async function getProfile(): Promise<ProfileData> {
  try {
    const dbProfile = await prisma.profile.findFirst();
    if (dbProfile) {
      return {
        id: dbProfile.id,
        fullName: dbProfile.fullName,
        title: dbProfile.title,
        tagline: dbProfile.tagline,
        bio: dbProfile.bio,
        aboutStory: dbProfile.aboutStory,
        avatarUrl: dbProfile.avatarUrl,
        resumeUrl: dbProfile.resumeUrl,
        location: dbProfile.location,
        email: dbProfile.email,
        phone: dbProfile.phone,
        githubUrl: dbProfile.githubUrl,
        linkedinUrl: dbProfile.linkedinUrl,
        twitterUrl: dbProfile.twitterUrl,
        instagramUrl: dbProfile.instagramUrl,
        availableForWork: dbProfile.availableForWork,
        yearsOfExperience: dbProfile.yearsOfExperience,
        completedProjects: dbProfile.completedProjects,
        satisfiedClients: dbProfile.satisfiedClients,
        codeHours: dbProfile.codeHours,
      };
    }
  } catch {
    // DB not yet migrated or offline, use store
  }
  const store = getLocalStore();
  return store.profile;
}

export async function updateProfile(data: Partial<ProfileData>): Promise<ProfileData> {
  const store = getLocalStore();
  store.profile = { ...store.profile, ...data };
  saveLocalStore(store);

  try {
    await prisma.profile.upsert({
      where: { id: "default-profile" },
      update: { ...store.profile },
      create: { ...store.profile, id: "default-profile" },
    });
  } catch {
    // ignore
  }

  return store.profile;
}

// ----------------- SKILLS -----------------
export async function getSkills(publicOnly = false): Promise<SkillData[]> {
  try {
    const dbSkills = await prisma.skill.findMany({
      where: publicOnly ? { isActive: true } : undefined,
      orderBy: { order: "asc" },
    });
    if (dbSkills && dbSkills.length > 0) {
      return dbSkills.map((s) => ({
        id: s.id,
        name: s.name,
        category: s.category as SkillData["category"],
        icon: s.icon,
        level: s.level,
        featured: s.featured,
        isActive: s.isActive !== false,
        order: s.order,
      }));
    }
  } catch {
    // ignore
  }
  const store = getLocalStore();
  const list = store.skills.map((s) => ({ ...s, isActive: s.isActive !== false }));
  const sorted = list.sort((a, b) => a.order - b.order);
  return publicOnly ? sorted.filter((s) => s.isActive) : sorted;
}

export async function saveSkill(skill: SkillData): Promise<SkillData> {
  const store = getLocalStore();
  const formatted: SkillData = {
    ...skill,
    isActive: skill.isActive !== false,
  };
  const existingIdx = store.skills.findIndex((s) => s.id === formatted.id);
  if (existingIdx >= 0) {
    store.skills[existingIdx] = formatted;
  } else {
    store.skills.push(formatted);
  }
  saveLocalStore(store);

  try {
    await prisma.skill.upsert({
      where: { id: formatted.id },
      update: { ...formatted },
      create: { ...formatted },
    });
  } catch {
    // ignore
  }
  return formatted;
}

export async function deleteSkill(id: string): Promise<boolean> {
  const store = getLocalStore();
  store.skills = store.skills.filter((s) => s.id !== id);
  saveLocalStore(store);

  try {
    await prisma.skill.delete({ where: { id } });
  } catch {
    // ignore
  }
  return true;
}

// ----------------- PROJECTS -----------------
export async function getProjects(publicOnly = false): Promise<ProjectData[]> {
  try {
    const dbProjects = await prisma.project.findMany({
      where: publicOnly ? { isActive: true } : undefined,
      orderBy: { order: "asc" },
    });
    if (dbProjects && dbProjects.length > 0) {
      return dbProjects.map((p) => ({
        id: p.id,
        title: p.title,
        slug: p.slug,
        tagline: p.tagline,
        description: p.description,
        imageUrl: p.imageUrl,
        demoUrl: p.demoUrl,
        githubUrl: p.githubUrl,
        techStack: JSON.parse(p.techStack || "[]"),
        category: p.category as ProjectData["category"],
        featured: p.featured,
        isActive: p.isActive !== false,
        order: p.order,
      }));
    }
  } catch {
    // ignore
  }
  const store = getLocalStore();
  const list = store.projects.map((p) => ({ ...p, isActive: p.isActive !== false }));
  const sorted = list.sort((a, b) => a.order - b.order);
  return publicOnly ? sorted.filter((p) => p.isActive) : sorted;
}

export async function saveProject(project: ProjectData): Promise<ProjectData> {
  const store = getLocalStore();
  const formatted: ProjectData = {
    ...project,
    isActive: project.isActive !== false,
  };
  const existingIdx = store.projects.findIndex((p) => p.id === formatted.id);
  if (existingIdx >= 0) {
    store.projects[existingIdx] = formatted;
  } else {
    store.projects.push(formatted);
  }
  saveLocalStore(store);

  try {
    await prisma.project.upsert({
      where: { id: formatted.id },
      update: {
        title: formatted.title,
        slug: formatted.slug,
        tagline: formatted.tagline,
        description: formatted.description,
        imageUrl: formatted.imageUrl,
        demoUrl: formatted.demoUrl,
        githubUrl: formatted.githubUrl,
        techStack: JSON.stringify(formatted.techStack),
        category: formatted.category,
        featured: formatted.featured,
        isActive: formatted.isActive,
        order: formatted.order,
      },
      create: {
        id: formatted.id,
        title: formatted.title,
        slug: formatted.slug,
        tagline: formatted.tagline,
        description: formatted.description,
        imageUrl: formatted.imageUrl,
        demoUrl: formatted.demoUrl,
        githubUrl: formatted.githubUrl,
        techStack: JSON.stringify(formatted.techStack),
        category: formatted.category,
        featured: formatted.featured,
        isActive: formatted.isActive,
        order: formatted.order,
      },
    });
  } catch {
    // ignore
  }
  return formatted;
}

export async function deleteProject(id: string): Promise<boolean> {
  const store = getLocalStore();
  store.projects = store.projects.filter((p) => p.id !== id);
  saveLocalStore(store);

  try {
    await prisma.project.delete({ where: { id } });
  } catch {
    // ignore
  }
  return true;
}

// ----------------- EXPERIENCES -----------------
export async function getExperiences(publicOnly = false): Promise<ExperienceData[]> {
  try {
    const dbExp = await prisma.experience.findMany({
      where: publicOnly ? { isActive: true } : undefined,
      orderBy: { order: "asc" },
    });
    if (dbExp && dbExp.length > 0) {
      return dbExp.map((e) => ({
        id: e.id,
        role: e.role,
        company: e.company,
        location: e.location,
        type: e.type,
        startDate: e.startDate,
        endDate: e.endDate,
        isCurrent: e.isCurrent,
        isActive: e.isActive !== false,
        description: e.description,
        technologies: JSON.parse(e.technologies || "[]"),
        order: e.order,
      }));
    }
  } catch {
    // ignore
  }
  const store = getLocalStore();
  const list = store.experiences.map((e) => ({ ...e, isActive: e.isActive !== false }));
  const sorted = list.sort((a, b) => a.order - b.order);
  return publicOnly ? sorted.filter((e) => e.isActive) : sorted;
}

export async function saveExperience(exp: ExperienceData): Promise<ExperienceData> {
  const store = getLocalStore();
  const formatted: ExperienceData = {
    ...exp,
    isActive: exp.isActive !== false,
  };
  const existingIdx = store.experiences.findIndex((e) => e.id === formatted.id);
  if (existingIdx >= 0) {
    store.experiences[existingIdx] = formatted;
  } else {
    store.experiences.push(formatted);
  }
  saveLocalStore(store);

  try {
    await prisma.experience.upsert({
      where: { id: formatted.id },
      update: {
        role: formatted.role,
        company: formatted.company,
        location: formatted.location,
        type: formatted.type,
        startDate: formatted.startDate,
        endDate: formatted.endDate,
        isCurrent: formatted.isCurrent,
        isActive: formatted.isActive,
        description: formatted.description,
        technologies: JSON.stringify(formatted.technologies),
        order: formatted.order,
      },
      create: {
        id: formatted.id,
        role: formatted.role,
        company: formatted.company,
        location: formatted.location,
        type: formatted.type,
        startDate: formatted.startDate,
        endDate: formatted.endDate,
        isCurrent: formatted.isCurrent,
        isActive: formatted.isActive,
        description: formatted.description,
        technologies: JSON.stringify(formatted.technologies),
        order: formatted.order,
      },
    });
  } catch {
    // ignore
  }
  return formatted;
}

export async function deleteExperience(id: string): Promise<boolean> {
  const store = getLocalStore();
  store.experiences = store.experiences.filter((e) => e.id !== id);
  saveLocalStore(store);

  try {
    await prisma.experience.delete({ where: { id } });
  } catch {
    // ignore
  }
  return true;
}

// ----------------- EDUCATIONS -----------------
export async function getEducations(publicOnly = false): Promise<EducationData[]> {
  try {
    const dbEdu = await prisma.education.findMany({
      where: publicOnly ? { isActive: true } : undefined,
      orderBy: { order: "asc" },
    });
    if (dbEdu && dbEdu.length > 0) {
      return dbEdu.map((e) => ({
        ...e,
        isActive: e.isActive !== false,
      }));
    }
  } catch {
    // ignore
  }
  const store = getLocalStore();
  const list = store.educations.map((e) => ({ ...e, isActive: e.isActive !== false }));
  const sorted = list.sort((a, b) => a.order - b.order);
  return publicOnly ? sorted.filter((e) => e.isActive) : sorted;
}

export async function saveEducation(edu: EducationData): Promise<EducationData> {
  const store = getLocalStore();
  const formatted: EducationData = {
    ...edu,
    isActive: edu.isActive !== false,
  };
  const idx = store.educations.findIndex((e) => e.id === formatted.id);
  if (idx >= 0) {
    store.educations[idx] = formatted;
  } else {
    store.educations.push(formatted);
  }
  saveLocalStore(store);

  try {
    await prisma.education.upsert({
      where: { id: formatted.id },
      update: { ...formatted },
      create: { ...formatted },
    });
  } catch {
    // ignore
  }
  return formatted;
}

export async function deleteEducation(id: string): Promise<boolean> {
  const store = getLocalStore();
  store.educations = store.educations.filter((e) => e.id !== id);
  saveLocalStore(store);

  try {
    await prisma.education.delete({ where: { id } });
  } catch {
    // ignore
  }
  return true;
}

// ----------------- TESTIMONIALS -----------------
export async function getTestimonials(publicOnly = false): Promise<TestimonialData[]> {
  try {
    const dbTesti = await prisma.testimonial.findMany({
      where: publicOnly ? { isActive: true } : undefined,
      orderBy: { order: "asc" },
    });
    if (dbTesti && dbTesti.length > 0) {
      return dbTesti.map((t) => ({
        ...t,
        isActive: t.isActive !== false,
      }));
    }
  } catch {
    // ignore
  }
  const store = getLocalStore();
  const list = store.testimonials.map((t) => ({ ...t, isActive: t.isActive !== false }));
  const sorted = list.sort((a, b) => a.order - b.order);
  return publicOnly ? sorted.filter((t) => t.isActive) : sorted;
}

export async function saveTestimonial(testi: TestimonialData): Promise<TestimonialData> {
  const store = getLocalStore();
  const formatted: TestimonialData = {
    ...testi,
    isActive: testi.isActive !== false,
  };
  const idx = store.testimonials.findIndex((t) => t.id === formatted.id);
  if (idx >= 0) {
    store.testimonials[idx] = formatted;
  } else {
    store.testimonials.push(formatted);
  }
  saveLocalStore(store);

  try {
    await prisma.testimonial.upsert({
      where: { id: formatted.id },
      update: { ...formatted },
      create: { ...formatted },
    });
  } catch {
    // ignore
  }
  return formatted;
}

export async function deleteTestimonial(id: string): Promise<boolean> {
  const store = getLocalStore();
  store.testimonials = store.testimonials.filter((t) => t.id !== id);
  saveLocalStore(store);

  try {
    await prisma.testimonial.delete({ where: { id } });
  } catch {
    // ignore
  }
  return true;
}

// ----------------- MESSAGES -----------------
export async function getMessages(): Promise<MessageData[]> {
  try {
    const dbMsgs = await prisma.message.findMany({
      orderBy: { createdAt: "desc" },
    });
    if (dbMsgs && dbMsgs.length > 0) {
      return dbMsgs.map((m) => ({
        id: m.id,
        name: m.name,
        email: m.email,
        subject: m.subject,
        message: m.message,
        isRead: m.isRead,
        createdAt: m.createdAt.toISOString(),
      }));
    }
  } catch {
    // ignore
  }
  const store = getLocalStore();
  return store.messages;
}

export async function createMessage(msg: Omit<MessageData, "id" | "isRead" | "createdAt">): Promise<MessageData> {
  const newMsg: MessageData = {
    id: "msg-" + Date.now(),
    name: msg.name,
    email: msg.email,
    subject: msg.subject || "General Inquiry",
    message: msg.message,
    isRead: false,
    createdAt: new Date().toISOString(),
  };

  const store = getLocalStore();
  store.messages.unshift(newMsg);
  saveLocalStore(store);

  try {
    await prisma.message.create({
      data: {
        id: newMsg.id,
        name: newMsg.name,
        email: newMsg.email,
        subject: newMsg.subject,
        message: newMsg.message,
        isRead: false,
      },
    });
  } catch {
    // ignore
  }
  return newMsg;
}

export async function markMessageRead(id: string, isRead = true): Promise<boolean> {
  const store = getLocalStore();
  const m = store.messages.find((item) => item.id === id);
  if (m) {
    m.isRead = isRead;
    saveLocalStore(store);
  }

  try {
    await prisma.message.update({
      where: { id },
      data: { isRead },
    });
  } catch {
    // ignore
  }
  return true;
}

export async function deleteMessage(id: string): Promise<boolean> {
  const store = getLocalStore();
  store.messages = store.messages.filter((m) => m.id !== id);
  saveLocalStore(store);

  try {
    await prisma.message.delete({ where: { id } });
  } catch {
    // ignore
  }
  return true;
}

// ----------------- AUTHENTICATION -----------------
export async function authenticateAdmin(email: string, passwordPlain: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });
    if (user) {
      const match = await bcrypt.compare(passwordPlain, user.password);
      if (match) {
        return {
          userId: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        };
      }
    }
  } catch {
    // ignore
  }

  const store = getLocalStore();
  if (store.admin.email.toLowerCase() === email.toLowerCase()) {
    const match = await bcrypt.compare(passwordPlain, store.admin.passwordHash);
    if (match) {
      return {
        userId: "admin-root",
        email: store.admin.email,
        name: store.admin.name,
        role: "ADMIN",
      };
    }
  }

  // Also check default fallback password if untouched
  if (
    email.toLowerCase() === (process.env.ADMIN_EMAIL || "admin@portfolio.dev").toLowerCase() &&
    passwordPlain === (process.env.ADMIN_PASSWORD || "adminpassword123")
  ) {
    return {
      userId: "admin-root",
      email: email,
      name: store.admin.name || "Administrator",
      role: "ADMIN",
    };
  }

  return null;
}

export async function updateAdminCredentials(
  email: string,
  currentPassword: string,
  newPassword?: string,
  newName?: string,
  newEmail?: string
) {
  const auth = await authenticateAdmin(email, currentPassword);
  if (!auth) {
    throw new Error("Password saat ini salah.");
  }

  const store = getLocalStore();
  if (newName && newName.trim()) {
    store.admin.name = newName.trim();
  }
  if (newPassword && newPassword.trim().length >= 6) {
    store.admin.passwordHash = await bcrypt.hash(newPassword.trim(), 10);
  }
  const targetEmail = (newEmail && newEmail.trim()) ? newEmail.trim() : email;
  store.admin.email = targetEmail;
  saveLocalStore(store);

  try {
    if (targetEmail !== email) {
      await prisma.user.deleteMany({ where: { email } });
    }
    await prisma.user.upsert({
      where: { email: targetEmail },
      update: {
        name: store.admin.name,
        password: store.admin.passwordHash,
      },
      create: {
        email: targetEmail,
        name: store.admin.name,
        password: store.admin.passwordHash,
        role: "ADMIN",
      },
    });
  } catch {
    // ignore
  }

  return {
    success: true,
    user: {
      userId: auth.userId,
      email: targetEmail,
      name: store.admin.name,
      role: "ADMIN",
    },
  };
}

export async function resetAllDataToDefault() {
  const initialStore: LocalStore = {
    profile: INITIAL_PROFILE,
    skills: INITIAL_SKILLS,
    projects: INITIAL_PROJECTS,
    experiences: INITIAL_EXPERIENCE,
    educations: INITIAL_EDUCATION,
    testimonials: INITIAL_TESTIMONIALS,
    messages: INITIAL_MESSAGES,
    admin: {
      email: process.env.ADMIN_EMAIL || "admin@portfolio.dev",
      passwordHash: getDefaultAdminHash(),
      name: "Alex Pratama (Admin)",
    },
  };
  saveLocalStore(initialStore);
  return initialStore;
}
