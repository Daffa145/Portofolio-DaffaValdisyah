"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ShieldCheck,
  LayoutDashboard,
  User,
  Code2,
  FolderGit2,
  Briefcase,
  GraduationCap,
  MessageSquare,
  Mail,
  Settings,
  LogOut,
  ExternalLink,
  Plus,
  Trash2,
  Edit3,
  Save,
  Check,
  AlertCircle,
  Loader2,
  RefreshCw,
  Globe,
  Database,
  CheckCircle2,
  X,
  Star,
  KeyRound,
  Eye,
  EyeOff,
  Sun,
  Moon,
  Palette,
  Menu,
  Zap,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import TechIcon from "@/components/TechIcon";
import ImageUploader from "@/components/ImageUploader";
import DocumentUploader from "@/components/DocumentUploader";
import {
  ProfileData,
  SkillData,
  ProjectData,
  ExperienceData,
  EducationData,
  TestimonialData,
  MessageData,
} from "@/lib/initial-data";

export default function AdminDashboardPage() {
  const router = useRouter();
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState<
    | "overview"
    | "profile"
    | "projects"
    | "skills"
    | "experience"
    | "testimonials"
    | "messages"
    | "settings"
  >("overview");

  // Load theme preference and detect screen size on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem("admin_theme");
    if (savedTheme === "light" || savedTheme === "dark") {
      setTheme(savedTheme);
    }
    if (typeof window !== "undefined") {
      setSidebarOpen(window.innerWidth >= 1024);
    }
  }, []);

  const toggleTheme = (newTheme: "dark" | "light") => {
    setTheme(newTheme);
    localStorage.setItem("admin_theme", newTheme);
  };

  const handleNavTab = (tab: typeof activeTab) => {
    setActiveTab(tab);
    if (typeof window !== "undefined" && window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  };

  // State collections
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [skills, setSkills] = useState<SkillData[]>([]);
  const [projects, setProjects] = useState<ProjectData[]>([]);
  const [experiences, setExperiences] = useState<ExperienceData[]>([]);
  const [educations, setEducations] = useState<EducationData[]>([]);
  const [testimonials, setTestimonials] = useState<TestimonialData[]>([]);
  const [testiPage, setTestiPage] = useState(1);
  const [messages, setMessages] = useState<MessageData[]>([]);

  // Action status toast
  const [statusMessage, setStatusMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Modals for editing / adding
  const [projectModal, setProjectModal] = useState<{
    open: boolean;
    data: Partial<ProjectData>;
  }>({ open: false, data: {} });

  const [skillModal, setSkillModal] = useState<{
    open: boolean;
    data: Partial<SkillData>;
  }>({ open: false, data: {} });

  const [expModal, setExpModal] = useState<{
    open: boolean;
    data: Partial<ExperienceData>;
  }>({ open: false, data: {} });

  const [eduModal, setEduModal] = useState<{
    open: boolean;
    data: Partial<EducationData>;
  }>({ open: false, data: {} });

  const [testiModal, setTestiModal] = useState<{
    open: boolean;
    data: Partial<TestimonialData>;
  }>({ open: false, data: {} });

  // Security password and credentials change state
  const [pwdForm, setPwdForm] = useState({
    currentPassword: "",
    newPassword: "",
    newName: "",
    newEmail: "",
  });

  const showToast = (text: string, type: "success" | "error" = "success") => {
    setStatusMessage({ type, text });
    setTimeout(() => setStatusMessage(null), 3500);
  };

  const loadAllData = async () => {
    setLoading(true);
    try {
      // Verify auth
      const authRes = await fetch("/api/auth/login");
      const authData = await authRes.json();
      if (!authData.user) {
        router.push("/login");
        return;
      }

      // Fetch all items in parallel
      const [
        profRes,
        skillsRes,
        projRes,
        expRes,
        eduRes,
        testiRes,
        msgRes,
      ] = await Promise.all([
        fetch("/api/admin/profile"),
        fetch("/api/admin/skills"),
        fetch("/api/admin/projects"),
        fetch("/api/admin/experiences"),
        fetch("/api/admin/educations"),
        fetch("/api/admin/testimonials"),
        fetch("/api/admin/messages"),
      ]);

      const [
        profData,
        skillsData,
        projData,
        expData,
        eduData,
        testiData,
        msgData,
      ] = await Promise.all([
        profRes.json(),
        skillsRes.json(),
        projRes.json(),
        expRes.json(),
        eduRes.json(),
        testiRes.json(),
        msgRes.json(),
      ]);

      if (profData.profile) setProfile(profData.profile);
      if (skillsData.skills) setSkills(skillsData.skills);
      if (projData.projects) setProjects(projData.projects);
      if (expData.experiences) setExperiences(expData.experiences);
      if (eduData.educations) setEducations(eduData.educations);
      if (testiData.testimonials) setTestimonials(testiData.testimonials);
      if (msgData.messages) setMessages(msgData.messages);
    } catch {
      showToast("Gagal memuat data dari server", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  const handleLogout = async () => {
    await fetch("/api/auth/login", { method: "DELETE" });
    router.push("/login");
  };

  // ----------------- PROFILE UPDATE -----------------
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    try {
      const res = await fetch("/api/admin/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      showToast("Profil berhasil diperbarui!");
    } catch (err: any) {
      showToast(err.message || "Gagal memperbarui profil", "error");
    }
  };

  // ----------------- PROJECTS ACTIONS -----------------
  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/admin/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(projectModal.data),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      showToast("Proyek berhasil disimpan!");
      setProjectModal({ open: false, data: {} });
      loadAllData();
    } catch (err: any) {
      showToast(err.message || "Gagal menyimpan proyek", "error");
    }
  };

  const handleToggleProjectStatus = async (proj: ProjectData) => {
    const updated = { ...proj, isActive: proj.isActive === false ? true : false };
    try {
      await fetch("/api/admin/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated),
      });
      showToast(`Proyek ${updated.isActive ? "diaktifkan" : "dinonaktifkan"}!`);
      loadAllData();
    } catch {
      showToast("Gagal mengubah status", "error");
    }
  };

  const handleDeleteProject = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus proyek ini?")) return;
    try {
      const res = await fetch(`/api/admin/projects?id=${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Gagal menghapus");
      showToast("Proyek berhasil dihapus!");
      loadAllData();
    } catch (err: any) {
      showToast(err.message || "Gagal menghapus", "error");
    }
  };

  // ----------------- SKILLS ACTIONS -----------------
  const handleSaveSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/admin/skills", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(skillModal.data),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      showToast("Skill berhasil disimpan!");
      setSkillModal({ open: false, data: {} });
      loadAllData();
    } catch (err: any) {
      showToast(err.message || "Gagal menyimpan skill", "error");
    }
  };

  const handleToggleSkillStatus = async (skill: SkillData) => {
    const updated = { ...skill, isActive: skill.isActive === false ? true : false };
    try {
      await fetch("/api/admin/skills", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated),
      });
      showToast(`Skill ${updated.isActive ? "diaktifkan" : "dinonaktifkan"}!`);
      loadAllData();
    } catch {
      showToast("Gagal mengubah status", "error");
    }
  };

  const handleDeleteSkill = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus skill ini?")) return;
    try {
      const res = await fetch(`/api/admin/skills?id=${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Gagal menghapus");
      showToast("Skill berhasil dihapus!");
      loadAllData();
    } catch (err: any) {
      showToast(err.message || "Gagal menghapus", "error");
    }
  };

  // ----------------- EXPERIENCE ACTIONS -----------------
  const handleSaveExp = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/admin/experiences", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(expModal.data),
      });
      if (!res.ok) throw new Error("Gagal menyimpan");
      showToast("Pengalaman kerja berhasil disimpan!");
      setExpModal({ open: false, data: {} });
      loadAllData();
    } catch (err: any) {
      showToast(err.message || "Gagal", "error");
    }
  };

  const handleToggleExpStatus = async (exp: ExperienceData) => {
    const updated = { ...exp, isActive: exp.isActive === false ? true : false };
    try {
      await fetch("/api/admin/experiences", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated),
      });
      showToast(`Pengalaman ${updated.isActive ? "diaktifkan (tampil di web)" : "dinonaktifkan (disembunyikan)"}!`);
      loadAllData();
    } catch {
      showToast("Gagal mengubah status", "error");
    }
  };

  const handleDeleteExp = async (id: string) => {
    if (!confirm("Hapus pengalaman ini?")) return;
    await fetch(`/api/admin/experiences?id=${id}`, { method: "DELETE" });
    showToast("Pengalaman dihapus!");
    loadAllData();
  };

  // ----------------- EDUCATION ACTIONS -----------------
  const handleSaveEdu = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/admin/educations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(eduModal.data),
      });
      if (!res.ok) throw new Error("Gagal menyimpan");
      showToast("Pendidikan/Sertifikasi berhasil disimpan!");
      setEduModal({ open: false, data: {} });
      loadAllData();
    } catch (err: any) {
      showToast(err.message || "Gagal", "error");
    }
  };

  const handleToggleEduStatus = async (edu: EducationData) => {
    const updated = { ...edu, isActive: edu.isActive === false ? true : false };
    try {
      await fetch("/api/admin/educations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated),
      });
      showToast(`Pendidikan/Sertifikasi ${updated.isActive ? "diaktifkan (tampil di web)" : "dinonaktifkan (disembunyikan)"}!`);
      loadAllData();
    } catch {
      showToast("Gagal mengubah status", "error");
    }
  };

  const handleDeleteEdu = async (id: string) => {
    if (!confirm("Hapus item ini?")) return;
    await fetch(`/api/admin/educations?id=${id}`, { method: "DELETE" });
    showToast("Item dihapus!");
    loadAllData();
  };

  // ----------------- TESTIMONIAL ACTIONS -----------------
  const handleSaveTesti = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/admin/testimonials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(testiModal.data),
      });
      if (!res.ok) throw new Error("Gagal menyimpan");
      showToast("Testimoni berhasil disimpan!");
      setTestiModal({ open: false, data: {} });
      loadAllData();
    } catch (err: any) {
      showToast(err.message || "Gagal", "error");
    }
  };

  const handleToggleTestiStatus = async (testi: TestimonialData) => {
    const updated = { ...testi, isActive: testi.isActive === false ? true : false };
    try {
      await fetch("/api/admin/testimonials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated),
      });
      showToast(`Testimoni ${updated.isActive ? "diaktifkan" : "dinonaktifkan"}!`);
      loadAllData();
    } catch {
      showToast("Gagal mengubah status", "error");
    }
  };

  const handleDeleteTesti = async (id: string) => {
    if (!confirm("Hapus testimoni ini?")) return;
    await fetch(`/api/admin/testimonials?id=${id}`, { method: "DELETE" });
    showToast("Testimoni dihapus!");
    loadAllData();
  };

  // ----------------- MESSAGES ACTIONS -----------------
  const handleToggleReadMessage = async (id: string, isRead: boolean) => {
    await fetch("/api/admin/messages", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, isRead: !isRead }),
    });
    loadAllData();
  };

  const handleDeleteMessage = async (id: string) => {
    if (!confirm("Hapus pesan ini?")) return;
    await fetch(`/api/admin/messages?id=${id}`, { method: "DELETE" });
    showToast("Pesan dihapus!");
    loadAllData();
  };

  // ----------------- RESET ALL DATA -----------------
  const handleResetData = async () => {
    if (
      !confirm(
        "PERINGATAN: Apakah Anda yakin ingin me-reset seluruh data portofolio kembali ke template default?"
      )
    )
      return;
    try {
      const res = await fetch("/api/admin/reset", { method: "POST" });
      if (!res.ok) throw new Error("Gagal reset");
      showToast("Data berhasil direset ke sampel default!");
      loadAllData();
    } catch (err: any) {
      showToast(err.message || "Gagal reset", "error");
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/auth/update-credentials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(pwdForm),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      showToast("Kredensial login (username/email & password) berhasil diperbarui!");
      setPwdForm({ currentPassword: "", newPassword: "", newName: "", newEmail: "" });
    } catch (err: any) {
      showToast(err.message || "Gagal memperbarui kredensial", "error");
    }
  };

  if (loading) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center ${
          theme === "light"
            ? "admin-light bg-white text-slate-700"
            : "bg-[#05070d] text-slate-300"
        }`}
      >
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-sky-500 animate-spin" />
          <span className="text-sm font-medium">Memuat Dashboard Admin...</span>
        </div>
      </div>
    );
  }

  const unreadMessagesCount = messages.filter((m) => !m.isRead).length;

  return (
    <div
      className={`min-h-screen flex flex-col md:flex-row transition-colors duration-200 ${
        theme === "light"
          ? "admin-light bg-white text-slate-900"
          : "bg-[#05070d] text-slate-100"
      }`}
    >
      {/* Toast Notification */}
      {statusMessage && (
        <div
          className={`fixed bottom-6 right-6 z-50 px-4 py-3 rounded-2xl border shadow-2xl flex items-center gap-3 text-sm font-medium animate-in slide-in-from-bottom-5 duration-200 ${
            statusMessage.type === "success"
              ? "bg-emerald-950/90 border-emerald-500/40 text-emerald-200"
              : "bg-rose-950/90 border-rose-500/40 text-rose-200"
          }`}
        >
          {statusMessage.type === "success" ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          ) : (
            <AlertCircle className="w-5 h-5 text-rose-400" />
          )}
          <span>{statusMessage.text}</span>
        </div>
      )}

      {/* Mobile Backdrop for Sidebar Drawer */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden animate-in fade-in duration-200"
          aria-hidden="true"
        />
      )}

      {/* Sidebar Navigation */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 lg:static lg:z-auto h-full min-h-screen bg-[#080d1a] border-r border-slate-800/80 p-5 flex flex-col justify-between shrink-0 transition-all duration-300 ease-in-out ${
          sidebarOpen
            ? "w-72 sm:w-64 translate-x-0 opacity-100 shadow-2xl lg:shadow-none"
            : "-translate-x-full lg:translate-x-0 lg:w-0 lg:p-0 lg:border-none lg:opacity-0 overflow-hidden pointer-events-none"
        }`}
      >
        <div>
          {/* Logo & Portal title */}
          <div className="flex items-center justify-between gap-3 mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 p-[1px] shadow-lg shadow-sky-500/20 shrink-0">
                <div className="w-full h-full bg-[#090d16] rounded-[11px] flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5 text-sky-400" />
                </div>
              </div>
              <div>
                <h2 className="font-bold text-sm text-white">Portfolio Admin</h2>
                <span className="text-[11px] text-emerald-400 font-mono flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  Connected
                </span>
              </div>
            </div>

            {/* Close button on mobile drawer */}
            <button
              type="button"
              onClick={() => setSidebarOpen(false)}
              className="p-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white lg:hidden transition-colors"
              title="Tutup Menu"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5">
            <button
              onClick={() => handleNavTab("overview")}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                activeTab === "overview"
                  ? "bg-sky-500/15 text-sky-400 border border-sky-500/30"
                  : "text-slate-400 hover:text-white hover:bg-slate-800/60"
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Ringkasan Dashboard</span>
            </button>

            <button
              onClick={() => handleNavTab("profile")}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                activeTab === "profile"
                  ? "bg-sky-500/15 text-sky-400 border border-sky-500/30"
                  : "text-slate-400 hover:text-white hover:bg-slate-800/60"
              }`}
            >
              <User className="w-4 h-4" />
              <span>Profil & Hero Utama</span>
            </button>

            <button
              onClick={() => handleNavTab("projects")}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                activeTab === "projects"
                  ? "bg-sky-500/15 text-sky-400 border border-sky-500/30"
                  : "text-slate-400 hover:text-white hover:bg-slate-800/60"
              }`}
            >
              <FolderGit2 className="w-4 h-4" />
              <span>Kelola Proyek ({projects.length})</span>
            </button>

            <button
              onClick={() => handleNavTab("skills")}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                activeTab === "skills"
                  ? "bg-sky-500/15 text-sky-400 border border-sky-500/30"
                  : "text-slate-400 hover:text-white hover:bg-slate-800/60"
              }`}
            >
              <Code2 className="w-4 h-4" />
              <span>Kelola Keahlian / Skills ({skills.length})</span>
            </button>

            <button
              onClick={() => handleNavTab("experience")}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                activeTab === "experience"
                  ? "bg-sky-500/15 text-sky-400 border border-sky-500/30"
                  : "text-slate-400 hover:text-white hover:bg-slate-800/60"
              }`}
            >
              <Briefcase className="w-4 h-4" />
              <span>Karier & Pendidikan</span>
            </button>

            <button
              onClick={() => handleNavTab("testimonials")}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                activeTab === "testimonials"
                  ? "bg-sky-500/15 text-sky-400 border border-sky-500/30"
                  : "text-slate-400 hover:text-white hover:bg-slate-800/60"
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              <span>Testimoni Klien</span>
            </button>

            <button
              onClick={() => handleNavTab("messages")}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                activeTab === "messages"
                  ? "bg-sky-500/15 text-sky-400 border border-sky-500/30"
                  : "text-slate-400 hover:text-white hover:bg-slate-800/60"
              }`}
            >
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4" />
                <span>Pesan Masuk</span>
              </div>
              {unreadMessagesCount > 0 && (
                <span className="px-2 py-0.5 rounded-full text-[10px] bg-rose-500 text-white font-bold">
                  {unreadMessagesCount}
                </span>
              )}
            </button>

            <button
              onClick={() => handleNavTab("settings")}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                activeTab === "settings"
                  ? "bg-sky-500/15 text-sky-400 border border-sky-500/30"
                  : "text-slate-400 hover:text-white hover:bg-slate-800/60"
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>Database & Kredensial</span>
            </button>
          </nav>
        </div>

        {/* Bottom Actions */}
        <div className="pt-6 border-t border-slate-800/80 space-y-2">
          <Link
            href="/"
            target="_blank"
            className="w-full flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-medium text-slate-300 hover:text-white bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors"
          >
            <div className="flex items-center gap-2">
              <Globe className="w-3.5 h-3.5 text-sky-400" />
              <span>Lihat Portofolio Live</span>
            </div>
            <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
          </Link>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium text-rose-400 hover:bg-rose-500/10 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Keluar / Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-4 sm:p-8 md:p-10 overflow-y-auto max-h-screen">
        {/* Top Header Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 mb-8 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 hover:text-white transition-colors shrink-0 shadow-sm"
              title={sidebarOpen ? "Tutup Sidebar" : "Buka Sidebar"}
              aria-label="Toggle Sidebar"
            >
              <Menu className="w-4 h-4" />
            </button>

            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                {activeTab === "overview" && "Ringkasan Portofolio"}
                {activeTab === "profile" && "Pengaturan Profil & Hero"}
                {activeTab === "projects" && "Manajemen Proyek Portofolio"}
                {activeTab === "skills" && "Manajemen Keahlian & Teknologi"}
                {activeTab === "experience" && "Pengalaman Kerja & Sertifikasi"}
                {activeTab === "testimonials" && "Testimoni & Rekomendasi"}
                {activeTab === "messages" && "Kotak Masuk Pesan Pengunjung"}
                {activeTab === "settings" && "Konfigurasi Database & Akun"}
              </h1>
              <p className="text-xs text-slate-400 mt-1">
                Perubahan yang Anda simpan akan langsung tercermin secara dinamis di halaman depan.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Theme Toggle (Dark / Light) */}
            <div className="flex items-center bg-slate-900 p-1 rounded-xl border border-slate-800 shadow-sm">
              <button
                type="button"
                onClick={() => toggleTheme("dark")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  theme === "dark"
                    ? "bg-slate-800 text-sky-400 shadow-sm border border-slate-700/60"
                    : "text-slate-400 hover:text-white"
                }`}
                title="Mode Gelap (Tampilan Saat Ini)"
              >
                <Moon className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Gelap</span>
              </button>
              <button
                type="button"
                onClick={() => toggleTheme("light")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  theme === "light"
                    ? "bg-sky-500 text-white shadow-sm"
                    : "text-slate-400 hover:text-white"
                }`}
                title="Mode Terang (Light Mode)"
              >
                <Sun className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Terang</span>
              </button>
            </div>

            <button
              onClick={loadAllData}
              className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
              title="Refresh Data"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <Link
              href="/"
              target="_blank"
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-semibold text-xs transition-colors"
            >
              <span>Live Website</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* ----------------- TAB: OVERVIEW ----------------- */}
        {activeTab === "overview" && profile && (
          <div className="space-y-8">
            {/* Quick Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <div className="glass-panel p-6 rounded-2xl border border-slate-800">
                <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold block mb-1">
                  Total Proyek Aktif
                </span>
                <div className="flex items-baseline justify-between">
                  <span className="text-3xl font-extrabold text-white">
                    {projects.filter((p) => p.isActive !== false).length}
                  </span>
                  <FolderGit2 className="w-6 h-6 text-sky-400" />
                </div>
              </div>

              <div className="glass-panel p-6 rounded-2xl border border-slate-800">
                <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold block mb-1">
                  Keahlian Aktif
                </span>
                <div className="flex items-baseline justify-between">
                  <span className="text-3xl font-extrabold text-white">
                    {skills.filter((s) => s.isActive !== false).length}
                  </span>
                  <Code2 className="w-6 h-6 text-indigo-400" />
                </div>
              </div>

              <div className="glass-panel p-6 rounded-2xl border border-slate-800">
                <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold block mb-1">
                  Pesan Pengunjung
                </span>
                <div className="flex items-baseline justify-between">
                  <span className="text-3xl font-extrabold text-white">
                    {messages.length}
                  </span>
                  <Mail className="w-6 h-6 text-emerald-400" />
                </div>
              </div>

              <div className="glass-panel p-6 rounded-2xl border border-slate-800">
                <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold block mb-1">
                  Status Ketersediaan
                </span>
                <div className="flex items-center gap-2 mt-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span className="text-sm font-bold text-emerald-400">
                    {profile.availableForWork ? "Available for Work" : "Busy"}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Profile Summary Card */}
            <div className="glass-panel rounded-2xl p-7 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="flex items-center gap-5">
                <img
                  src={profile.avatarUrl}
                  alt={profile.fullName}
                  className="w-16 h-16 rounded-2xl object-cover border-2 border-sky-500/40"
                />
                <div>
                  <h3 className="text-lg font-bold text-white">{profile.fullName}</h3>
                  <p className="text-xs text-sky-400">{profile.title}</p>
                  <p className="text-xs text-slate-400 mt-1">{profile.email} • {profile.location}</p>
                </div>
              </div>

              <button
                onClick={() => setActiveTab("profile")}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition-colors"
              >
                <Edit3 className="w-3.5 h-3.5 text-sky-400" />
                <span>Edit Informasi Profil</span>
              </button>
            </div>

            {/* Recent Messages Preview */}
            <div className="glass-panel rounded-2xl p-7 border border-slate-800">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Mail className="w-4 h-4 text-sky-400" />
                  <span>Pesan Terbaru Masuk</span>
                </h3>
                <button
                  onClick={() => setActiveTab("messages")}
                  className="text-xs font-semibold text-sky-400 hover:text-sky-300"
                >
                  Lihat Semua ({messages.length}) →
                </button>
              </div>

              {messages.length === 0 ? (
                <p className="text-xs text-slate-500">Belum ada pesan dari pengunjung.</p>
              ) : (
                <div className="max-h-[185px] overflow-y-auto pr-1.5 space-y-3">
                  {messages.map((m) => (
                    <div
                      key={m.id}
                      className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-all ${
                        m.isRead
                          ? "bg-slate-900/50 border-slate-800/80 text-slate-300"
                          : "bg-slate-900 border-sky-500/40 text-slate-100 shadow-sm"
                      }`}
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-white">{m.name}</span>
                          <span className="text-xs text-sky-400 font-mono">&lt;{m.email}&gt;</span>
                          {!m.isRead && (
                            <span className="px-2 py-0.5 rounded text-[10px] bg-rose-500/20 text-rose-400 font-bold border border-rose-500/30">
                              Baru
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-300 mt-1 line-clamp-1">
                          <span className="font-semibold text-slate-200">{m.subject}:</span> {m.message}
                        </p>
                      </div>
                      <span className="text-[11px] text-slate-400 font-mono shrink-0">
                        {new Date(m.createdAt).toLocaleDateString("id-ID")}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ----------------- TAB: PROFILE EDITOR ----------------- */}
        {activeTab === "profile" && profile && (
          <form onSubmit={handleSaveProfile} className="space-y-6 max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Kolom Kiri: Informasi Pokok, Narasi & Statistik */}
              <div className="lg:col-span-7 space-y-6">
                {/* Informasi Pokok & Hero */}
                <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <User className="w-4 h-4 text-sky-400" />
                      <span>Informasi Pokok & Hero Section</span>
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Nama Lengkap & Gelar
                      </label>
                      <input
                        type="text"
                        required
                        value={profile.fullName}
                        onChange={(e) =>
                          setProfile({ ...profile, fullName: e.target.value })
                        }
                        className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-sky-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Role / Spesialisasi Utama
                      </label>
                      <input
                        type="text"
                        required
                        value={profile.title}
                        onChange={(e) =>
                          setProfile({ ...profile, title: e.target.value })
                        }
                        className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-sky-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Tagline Hero Utama
                    </label>
                    <input
                      type="text"
                      required
                      value={profile.tagline}
                      onChange={(e) =>
                        setProfile({ ...profile, tagline: e.target.value })
                      }
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-sky-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Bio Singkat
                    </label>
                    <textarea
                      rows={2}
                      required
                      value={profile.bio}
                      onChange={(e) =>
                        setProfile({ ...profile, bio: e.target.value })
                      }
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-sky-500 resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Cerita Filosofi & Dedikasi (About Section)
                    </label>
                    <textarea
                      rows={3}
                      required
                      value={profile.aboutStory}
                      onChange={(e) =>
                        setProfile({ ...profile, aboutStory: e.target.value })
                      }
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-sky-500 resize-none"
                    />
                  </div>

                  {/* Work availability toggle */}
                  <div className="flex items-center gap-3 pt-1">
                    <input
                      type="checkbox"
                      id="availCheck"
                      checked={profile.availableForWork}
                      onChange={(e) =>
                        setProfile({ ...profile, availableForWork: e.target.checked })
                      }
                      className="w-4 h-4 rounded text-sky-500 focus:ring-sky-400 bg-slate-900 border-slate-700"
                    />
                    <label htmlFor="availCheck" className="text-xs font-semibold text-slate-200 cursor-pointer">
                      Tampilkan Status Badge "Available for Work" di Halaman Utama
                    </label>
                  </div>
                </div>

                {/* Metrics & Statistics */}
                <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-4">
                  <h3 className="text-sm font-bold text-white border-b border-slate-800 pb-3 flex items-center gap-2">
                    <Zap className="w-4 h-4 text-amber-400" />
                    <span>Statistik Angka di Hero Portofolio</span>
                  </h3>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                        Pengalaman (Thn)
                      </label>
                      <input
                        type="number"
                        value={profile.yearsOfExperience}
                        onChange={(e) =>
                          setProfile({
                            ...profile,
                            yearsOfExperience: parseInt(e.target.value) || 0,
                          })
                        }
                        className="w-full px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs text-center font-bold"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                        Proyek Selesai
                      </label>
                      <input
                        type="number"
                        value={profile.completedProjects}
                        onChange={(e) =>
                          setProfile({
                            ...profile,
                            completedProjects: parseInt(e.target.value) || 0,
                          })
                        }
                        className="w-full px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs text-center font-bold"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                        Klien / Partner
                      </label>
                      <input
                        type="number"
                        value={profile.satisfiedClients}
                        onChange={(e) =>
                          setProfile({
                            ...profile,
                            satisfiedClients: parseInt(e.target.value) || 0,
                          })
                        }
                        className="w-full px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs text-center font-bold"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                        Jam Kode (Hours)
                      </label>
                      <input
                        type="number"
                        value={profile.codeHours}
                        onChange={(e) =>
                          setProfile({
                            ...profile,
                            codeHours: parseInt(e.target.value) || 0,
                          })
                        }
                        className="w-full px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs text-center font-bold"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Kolom Kanan: Media, Berkas & Kontak */}
              <div className="lg:col-span-5 space-y-6">
                {/* Media & Berkas */}
                <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-4">
                  <h3 className="text-sm font-bold text-white border-b border-slate-800 pb-3 flex items-center gap-2">
                    <Palette className="w-4 h-4 text-indigo-400" />
                    <span>Media, Berkas & Lokasi</span>
                  </h3>

                  {/* Upload Foto Profil / Avatar */}
                  <ImageUploader
                    label="Foto Profil / Avatar (Unggah Foto atau URL)"
                    value={profile.avatarUrl}
                    onChange={(url) => setProfile({ ...profile, avatarUrl: url })}
                    aspectRatio="square"
                  />

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Lokasi Domisili (Kota / Negara)
                    </label>
                    <input
                      type="text"
                      value={profile.location}
                      onChange={(e) =>
                        setProfile({ ...profile, location: e.target.value })
                      }
                      placeholder="Jakarta, Indonesia (Remote / Hybrid)"
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-sky-500"
                    />
                  </div>

                  <DocumentUploader
                    label="Link Resume / CV (PDF / Dokumen)"
                    value={profile.resumeUrl}
                    onChange={(url) =>
                      setProfile({ ...profile, resumeUrl: url })
                    }
                    placeholder="#resume atau unggah file PDF"
                  />
                </div>

                {/* Social & Contact details */}
                <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-4">
                  <h3 className="text-sm font-bold text-white border-b border-slate-800 pb-3 flex items-center gap-2">
                    <Mail className="w-4 h-4 text-emerald-400" />
                    <span>Kontak & Media Sosial</span>
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                        Email Publik
                      </label>
                      <input
                        type="email"
                        value={profile.email}
                        onChange={(e) =>
                          setProfile({ ...profile, email: e.target.value })
                        }
                        className="w-full px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                        WhatsApp / No. Telp
                      </label>
                      <input
                        type="text"
                        value={profile.phone}
                        onChange={(e) =>
                          setProfile({ ...profile, phone: e.target.value })
                        }
                        className="w-full px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs"
                      />
                    </div>
                  </div>

                  <div className="space-y-2.5 pt-1">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                        GitHub Profile URL
                      </label>
                      <input
                        type="text"
                        value={profile.githubUrl}
                        onChange={(e) =>
                          setProfile({ ...profile, githubUrl: e.target.value })
                        }
                        placeholder="https://github.com/username"
                        className="w-full px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                        LinkedIn Profile URL
                      </label>
                      <input
                        type="text"
                        value={profile.linkedinUrl}
                        onChange={(e) =>
                          setProfile({ ...profile, linkedinUrl: e.target.value })
                        }
                        placeholder="https://linkedin.com/in/username"
                        className="w-full px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                        Twitter / X URL
                      </label>
                      <input
                        type="text"
                        value={profile.twitterUrl}
                        onChange={(e) =>
                          setProfile({ ...profile, twitterUrl: e.target.value })
                        }
                        placeholder="https://x.com/username"
                        className="w-full px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs"
                      />
                    </div>
                  </div>
                </div>

                {/* Submit Action Card */}
                <button
                  type="submit"
                  className="w-full py-3 px-6 rounded-2xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-semibold text-xs shadow-xl shadow-sky-500/25 flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>Simpan Semua Perubahan Profil</span>
                </button>
              </div>
            </div>
          </form>
        )}

        {/* ----------------- TAB: PROJECTS MANAGER ----------------- */}
        {activeTab === "projects" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400">
                Menampilkan {projects.length} proyek terdaftar
              </span>
              <button
                onClick={() =>
                  setProjectModal({
                    open: true,
                    data: {
                      title: "",
                      tagline: "",
                      description: "",
                      imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80",
                      demoUrl: "",
                      githubUrl: "",
                      techStack: ["Next.js", "TypeScript", "PostgreSQL", "Tailwind"],
                      category: "Fullstack",
                      featured: true,
                      isActive: true,
                      order: projects.length + 1,
                    },
                  })
                }
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-white text-xs font-semibold shadow-lg shadow-sky-500/20"
              >
                <Plus className="w-4 h-4" />
                <span>Tambah Proyek Baru</span>
              </button>
            </div>

            {/* Projects Table / Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {projects.map((proj) => {
                const isActive = proj.isActive !== false;
                return (
                  <div
                    key={proj.id}
                    className={`glass-panel rounded-2xl p-5 border transition-all flex flex-col justify-between ${
                      isActive ? "border-slate-800" : "border-slate-800/40 opacity-70 bg-slate-950/40"
                    }`}
                  >
                    <div className="flex gap-4 items-start">
                      <img
                        src={proj.imageUrl}
                        alt={proj.title}
                        className="w-24 h-20 rounded-xl object-cover border border-slate-700 shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded text-[10px] bg-sky-500/20 text-sky-300 font-bold border border-sky-500/30">
                            {proj.category}
                          </span>
                          {proj.featured && (
                            <span className="px-2 py-0.5 rounded text-[10px] bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">
                              Featured
                            </span>
                          )}
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                              isActive
                                ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
                                : "bg-slate-800 text-slate-400 border-slate-700"
                            }`}
                          >
                            {isActive ? "🟢 Aktif" : "⚪ Nonaktif"}
                          </span>
                        </div>
                        <h4 className="text-sm font-bold text-white mt-1 truncate">
                          {proj.title}
                        </h4>
                        <p className="text-xs text-slate-400 line-clamp-2 mt-1">
                          {proj.description}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-slate-800 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {/* Toggle switch button */}
                        <button
                          type="button"
                          onClick={() => handleToggleProjectStatus(proj)}
                          className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                            isActive ? "bg-emerald-500" : "bg-slate-700"
                          }`}
                          title={isActive ? "Klik untuk Nonaktifkan" : "Klik untuk Aktifkan"}
                        >
                          <span
                            className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                              isActive ? "translate-x-4" : "translate-x-0"
                            }`}
                          />
                        </button>
                        <span className="text-[11px] text-slate-400">
                          {isActive ? "Tampil di Web" : "Disembunyikan"}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setProjectModal({ open: true, data: proj })}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200"
                          title="Edit Proyek"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteProject(proj.id)}
                          className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400"
                          title="Hapus Proyek"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ----------------- TAB: SKILLS MANAGER ----------------- */}
        {activeTab === "skills" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400">
                Menampilkan {skills.length} keahlian
              </span>
              <button
                onClick={() =>
                  setSkillModal({
                    open: true,
                    data: {
                      name: "",
                      category: "Frontend",
                      icon: "Code2",
                      level: 90,
                      featured: true,
                      isActive: true,
                      order: skills.length + 1,
                    },
                  })
                }
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-white text-xs font-semibold shadow-lg shadow-sky-500/20"
              >
                <Plus className="w-4 h-4" />
                <span>Tambah Keahlian Baru</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {skills.map((s) => {
                const isActive = s.isActive !== false;
                return (
                  <div
                    key={s.id}
                    className={`glass-panel p-4 rounded-2xl border transition-all flex items-center justify-between ${
                      isActive ? "border-slate-800" : "border-slate-800/40 opacity-70 bg-slate-950/40"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center text-sky-400">
                        <TechIcon name={s.icon} />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white">{s.name}</h4>
                        <p className="text-[11px] text-slate-400">{s.category} • {s.level}%</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Quick toggle switch */}
                      <button
                        type="button"
                        onClick={() => handleToggleSkillStatus(s)}
                        className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                          isActive ? "bg-emerald-500" : "bg-slate-700"
                        }`}
                        title={isActive ? "Aktif (Tampil)" : "Nonaktif (Disembunyikan)"}
                      >
                        <span
                          className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                            isActive ? "translate-x-4" : "translate-x-0"
                          }`}
                        />
                      </button>

                      <button
                        onClick={() => setSkillModal({ open: true, data: s })}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteSkill(s.id)}
                        className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ----------------- TAB: EXPERIENCE & EDUCATION ----------------- */}
        {activeTab === "experience" && (
          <div className="space-y-10">
            {/* Work History */}
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-3">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-sky-400" />
                    <span>Pengalaman Kerja ({experiences.length})</span>
                  </h3>
                  <span className="text-xs text-slate-400">
                    ({experiences.filter((e) => e.isActive !== false).length} Aktif di Halaman Utama)
                  </span>
                </div>
                <button
                  onClick={() =>
                    setExpModal({
                      open: true,
                      data: {
                        role: "",
                        company: "",
                        location: "Remote",
                        type: "Full-time",
                        startDate: "2023",
                        endDate: "Present",
                        description: "",
                        technologies: ["Next.js", "TypeScript", "PostgreSQL"],
                        isActive: true,
                        order: experiences.length + 1,
                      },
                    })
                  }
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-white text-xs font-semibold shadow-md shadow-sky-500/20"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Tambah Pengalaman</span>
                </button>
              </div>

              <div className="space-y-3">
                {experiences.map((exp) => {
                  const isActive = exp.isActive !== false;
                  return (
                    <div
                      key={exp.id}
                      className={`glass-panel p-5 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                        isActive
                          ? "border-slate-800 bg-slate-900/60"
                          : "border-slate-800/40 opacity-60 bg-slate-950/40"
                      }`}
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="text-sm font-bold text-white">{exp.role}</h4>
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${
                              isActive
                                ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
                                : "bg-slate-800 text-slate-400 border-slate-700"
                            }`}
                          >
                            {isActive ? "🟢 Aktif" : "⚪ Nonaktif"}
                          </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-2 text-xs mb-2">
                          <span className="font-semibold text-slate-200">{exp.company}</span>
                          <span className="text-slate-500">•</span>
                          <span className="text-slate-400">{exp.startDate} - {exp.endDate}</span>
                          <span className="text-slate-500">•</span>
                          <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700 text-[11px]">
                            📍 {exp.location || "Remote"}
                          </span>
                          <span className="px-2 py-0.5 rounded bg-sky-500/15 text-sky-300 border border-sky-500/30 text-[11px] font-semibold">
                            💼 {exp.type || "Full-time"}
                          </span>
                        </div>
                        <p className="text-xs text-slate-300 leading-relaxed">
                          {exp.description}
                        </p>
                      </div>

                      {/* Right Action Switch & Buttons */}
                      <div className="flex items-center gap-4 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-800">
                        {/* Interactive Toggle Switch */}
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleToggleExpStatus(exp)}
                            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                              isActive ? "bg-emerald-500" : "bg-slate-700"
                            }`}
                            title={isActive ? "Klik untuk Nonaktifkan (Sembunyikan)" : "Klik untuk Aktifkan (Tampilkan)"}
                          >
                            <span
                              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                                isActive ? "translate-x-5" : "translate-x-0"
                              }`}
                            />
                          </button>
                          <span className="text-[11px] font-medium text-slate-300 hidden md:inline">
                            {isActive ? "Aktif" : "Mati"}
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => setExpModal({ open: true, data: exp })}
                            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200"
                            title="Edit Pengalaman"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteExp(exp.id)}
                            className="p-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400"
                            title="Hapus Pengalaman"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Education & Certification */}
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-3">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <GraduationCap className="w-4 h-4 text-indigo-400" />
                    <span>Pendidikan & Sertifikasi ({educations.length})</span>
                  </h3>
                  <span className="text-xs text-slate-400">
                    ({educations.filter((e) => e.isActive !== false).length} Aktif di Halaman Utama)
                  </span>
                </div>
                <button
                  onClick={() =>
                    setEduModal({
                      open: true,
                      data: {
                        title: "",
                        institution: "",
                        year: "2023",
                        description: "",
                        isActive: true,
                        order: educations.length + 1,
                      },
                    })
                  }
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-500 hover:bg-indigo-400 text-white text-xs font-semibold shadow-md shadow-indigo-500/20"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Tambah Sertifikasi</span>
                </button>
              </div>

              <div className="space-y-3">
                {educations.map((edu) => {
                  const isActive = edu.isActive !== false;
                  return (
                    <div
                      key={edu.id}
                      className={`glass-panel p-5 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                        isActive
                          ? "border-slate-800 bg-slate-900/60"
                          : "border-slate-800/40 opacity-60 bg-slate-950/40"
                      }`}
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="text-sm font-bold text-white">{edu.title}</h4>
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${
                              isActive
                                ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
                                : "bg-slate-800 text-slate-400 border-slate-700"
                            }`}
                          >
                            {isActive ? "🟢 Aktif" : "⚪ Nonaktif"}
                          </span>
                        </div>
                        <p className="text-xs text-indigo-400">{edu.institution} ({edu.year})</p>
                        <p className="text-xs text-slate-300 mt-1">{edu.description}</p>
                      </div>

                      {/* Right Action Switch & Buttons */}
                      <div className="flex items-center gap-4 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-800">
                        {/* Interactive Toggle Switch */}
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleToggleEduStatus(edu)}
                            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                              isActive ? "bg-emerald-500" : "bg-slate-700"
                            }`}
                            title={isActive ? "Klik untuk Nonaktifkan (Sembunyikan)" : "Klik untuk Aktifkan (Tampilkan)"}
                          >
                            <span
                              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                                isActive ? "translate-x-5" : "translate-x-0"
                              }`}
                            />
                          </button>
                          <span className="text-[11px] font-medium text-slate-300 hidden md:inline">
                            {isActive ? "Aktif" : "Mati"}
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => setEduModal({ open: true, data: edu })}
                            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200"
                            title="Edit Sertifikasi"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteEdu(edu.id)}
                            className="p-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400"
                            title="Hapus Sertifikasi"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ----------------- TAB: TESTIMONIALS ----------------- */}
        {activeTab === "testimonials" && (() => {
          const perPage = 4;
          const totalPages = Math.ceil(testimonials.length / perPage) || 1;
          const safePage = Math.min(Math.max(1, testiPage), totalPages);
          const startIndex = (safePage - 1) * perPage;
          const endIndex = Math.min(startIndex + perPage, testimonials.length);
          const paginatedTestimonials = testimonials.slice(startIndex, endIndex);

          return (
            <div className="space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h3 className="text-sm font-bold text-white">Daftar Testimoni & Ulasan</h3>
                  <span className="text-xs text-slate-400">
                    Menampilkan {testimonials.length > 0 ? `${startIndex + 1} - ${endIndex}` : 0} dari total {testimonials.length} ulasan klien
                  </span>
                </div>

                <button
                  onClick={() =>
                    setTestiModal({
                      open: true,
                      data: {
                        name: "",
                        role: "Client / Partner",
                        company: "",
                        avatarUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80",
                        content: "",
                        rating: 5,
                        isActive: true,
                        order: testimonials.length + 1,
                      },
                    })
                  }
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-white text-xs font-semibold shadow-md shadow-sky-500/20 transition-all cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Tambah Testimoni</span>
                </button>
              </div>

              {testimonials.length === 0 ? (
                <div className="glass-panel p-10 text-center rounded-2xl border border-slate-800">
                  <p className="text-sm text-slate-400">Belum ada testimoni yang terdaftar.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {paginatedTestimonials.map((t) => {
                    const isActive = t.isActive !== false;
                    return (
                      <div
                        key={t.id}
                        className={`glass-panel p-5 rounded-2xl border transition-all flex flex-col justify-between ${
                          isActive ? "border-slate-800" : "border-slate-800/40 opacity-70 bg-slate-950/40"
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-1">
                              {Array.from({ length: t.rating }).map((_, i) => (
                                <Star key={i} className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                              ))}
                            </div>
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${
                                isActive
                                  ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
                                  : "bg-slate-800 text-slate-400 border-slate-700"
                              }`}
                            >
                              {isActive ? "🟢 Aktif" : "⚪ Nonaktif"}
                            </span>
                          </div>
                          <p className="text-xs text-slate-300 italic mb-4">"{t.content}"</p>
                        </div>

                        <div className="flex items-center justify-between pt-3 border-t border-slate-800">
                          <div className="flex items-center gap-3">
                            <img
                              src={t.avatarUrl}
                              alt={t.name}
                              className="w-8 h-8 rounded-full object-cover border border-slate-700"
                            />
                            <div>
                              <h4 className="text-xs font-bold text-white">{t.name}</h4>
                              <p className="text-[10px] text-slate-400">{t.role} {t.company ? `(${t.company})` : ""}</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <button
                              type="button"
                              onClick={() => handleToggleTestiStatus(t)}
                              className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                                isActive ? "bg-emerald-500" : "bg-slate-700"
                              }`}
                              title={isActive ? "Aktif (Tampil)" : "Nonaktif (Disembunyikan)"}
                            >
                              <span
                                className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                                  isActive ? "translate-x-4" : "translate-x-0"
                                }`}
                              />
                            </button>

                            <button
                              onClick={() => setTestiModal({ open: true, data: t })}
                              className="p-1.5 rounded-lg bg-slate-800 text-slate-200 hover:text-white"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteTesti(t.id)}
                              className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Pagination Controls when Testimonials > 4 */}
              {testimonials.length > perPage && (
                <div className="pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-4">
                  <span className="text-xs text-slate-400 font-medium">
                    Halaman {safePage} dari {totalPages}
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      disabled={safePage <= 1}
                      onClick={() => setTestiPage((prev) => Math.max(1, prev - 1))}
                      className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-sky-500/40 disabled:opacity-40 disabled:pointer-events-none transition-colors"
                      title="Halaman Sebelumnya"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>

                    {Array.from({ length: totalPages }).map((_, idx) => {
                      const pageNum = idx + 1;
                      const isCurrent = pageNum === safePage;
                      return (
                        <button
                          key={pageNum}
                          type="button"
                          onClick={() => setTestiPage(pageNum)}
                          className={`w-8 h-8 rounded-xl text-xs font-semibold transition-all ${
                            isCurrent
                              ? "bg-sky-500 text-white shadow-md shadow-sky-500/25"
                              : "bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700"
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}

                    <button
                      type="button"
                      disabled={safePage >= totalPages}
                      onClick={() => setTestiPage((prev) => Math.min(totalPages, prev + 1))}
                      className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-sky-500/40 disabled:opacity-40 disabled:pointer-events-none transition-colors"
                      title="Halaman Selanjutnya"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })()}

        {/* ----------------- TAB: MESSAGES INBOX ----------------- */}
        {activeTab === "messages" && (
          <div className="space-y-4">
            <span className="text-xs text-slate-400 block mb-2">
              Total {messages.length} pesan masuk dari pengunjung
            </span>

            {messages.length === 0 ? (
              <div className="glass-panel p-12 text-center rounded-2xl border border-slate-800">
                <Mail className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                <p className="text-sm text-slate-400">Belum ada pesan yang masuk.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {messages.map((m) => (
                  <div
                    key={m.id}
                    className={`glass-panel p-5 rounded-2xl border transition-all ${
                      m.isRead ? "border-slate-800/80 bg-slate-900/40" : "border-sky-500/40 bg-slate-900/90 shadow-lg shadow-sky-950/20"
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-white">{m.name}</h4>
                        <a
                          href={`mailto:${m.email}`}
                          className="text-xs text-sky-400 font-mono hover:underline"
                        >
                          &lt;{m.email}&gt;
                        </a>
                        {!m.isRead && (
                          <span className="px-2 py-0.5 rounded text-[10px] bg-rose-500/20 text-rose-400 font-bold border border-rose-500/30">
                            Belum Dibaca
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-slate-400 font-mono">
                        {new Date(m.createdAt).toLocaleString("id-ID")}
                      </span>
                    </div>

                    <h5 className="text-xs font-semibold text-slate-200 mb-1">
                      Subjek: <span className="text-white font-bold">{m.subject}</span>
                    </h5>
                    <p className="text-xs sm:text-sm text-slate-200 leading-relaxed bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/80 font-normal">
                      {m.message}
                    </p>

                    <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
                      <a
                        href={`mailto:${m.email}?subject=Re: ${encodeURIComponent(m.subject)}`}
                        className="text-xs font-semibold text-sky-400 hover:text-sky-300 flex items-center gap-1"
                      >
                        <Mail className="w-3.5 h-3.5" />
                        <span>Balas via Email</span>
                      </a>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleToggleReadMessage(m.id, m.isRead)}
                          className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium"
                        >
                          {m.isRead ? "Tandai Belum Dibaca" : "Tandai Sudah Dibaca"}
                        </button>
                        <button
                          onClick={() => handleDeleteMessage(m.id)}
                          className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ----------------- TAB: SETTINGS & DATABASE ----------------- */}
        {activeTab === "settings" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-6xl mx-auto items-start">
            {/* Kolom Kiri: Akun & Keamanan */}
            <div className="space-y-6">
              {/* Change Admin Password & Credentials */}
              <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0">
                    <KeyRound className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">Ganti Kredensial Login Admin</h3>
                    <p className="text-[11px] text-slate-400">
                      Ubah username/email, nama, atau password admin.
                    </p>
                  </div>
                </div>

                <form onSubmit={handleUpdatePassword} className="space-y-3.5 pt-1">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Username / Email Baru
                      </label>
                      <input
                        type="text"
                        value={pwdForm.newEmail}
                        onChange={(e) => setPwdForm({ ...pwdForm, newEmail: e.target.value })}
                        placeholder="Bisa tanpa @ (e.g. admin)"
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Nama Admin Baru
                      </label>
                      <input
                        type="text"
                        value={pwdForm.newName}
                        onChange={(e) => setPwdForm({ ...pwdForm, newName: e.target.value })}
                        placeholder="e.g. Alex Pratama"
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Password Saat Ini *
                    </label>
                    <input
                      type="password"
                      required
                      value={pwdForm.currentPassword}
                      onChange={(e) => setPwdForm({ ...pwdForm, currentPassword: e.target.value })}
                      placeholder="Masukkan password saat ini"
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Password Baru (Opsional, min. 6 karakter)
                    </label>
                    <input
                      type="password"
                      value={pwdForm.newPassword}
                      onChange={(e) => setPwdForm({ ...pwdForm, newPassword: e.target.value })}
                      placeholder="Kosongkan jika tidak ingin mengganti password"
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs shadow-md shadow-amber-500/20 transition-colors"
                  >
                    Simpan
                  </button>
                </form>
              </div>

              {/* Theme Preference Settings */}
              <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-sky-500/10 text-sky-400 flex items-center justify-center shrink-0">
                    <Palette className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">Tampilan & Tema Admin</h3>
                    <p className="text-[11px] text-slate-400">Pilih skema warna antarmuka dashboard admin.</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-1">
                  {/* Dark Theme Option */}
                  <button
                    type="button"
                    onClick={() => toggleTheme("dark")}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      theme === "dark"
                        ? "border-sky-500 bg-slate-900/90 shadow-md ring-2 ring-sky-500/20"
                        : "border-slate-800 bg-slate-950 hover:border-slate-700"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <Moon className="w-3.5 h-3.5 text-sky-400" />
                        <span className="text-xs font-bold text-white">Gelap</span>
                      </div>
                      {theme === "dark" && (
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-sky-500/20 text-sky-400">Aktif</span>
                      )}
                    </div>
                    <div className="text-[10px] text-slate-400">Tema Gelap Cyberpunk</div>
                  </button>

                  {/* Light Theme Option */}
                  <button
                    type="button"
                    onClick={() => toggleTheme("light")}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      theme === "light"
                        ? "border-sky-500 bg-sky-50/10 shadow-md ring-2 ring-sky-500/20"
                        : "border-slate-800 bg-slate-950 hover:border-slate-700"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <Sun className="w-3.5 h-3.5 text-amber-500" />
                        <span className="text-xs font-bold text-white">Terang</span>
                      </div>
                      {theme === "light" && (
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-emerald-500/20 text-emerald-400">Aktif</span>
                      )}
                    </div>
                    <div className="text-[10px] text-slate-400">Bersih & Kontras</div>
                  </button>
                </div>
              </div>
            </div>

            {/* Kolom Kanan: Database & Danger Zone */}
            <div className="space-y-6">
              {/* Database Instructions */}
              <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-3.5">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-sky-500/10 text-sky-400 flex items-center justify-center shrink-0">
                    <Database className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">Koneksi Database Cloud</h3>
                    <p className="text-[11px] text-slate-400">Prisma ORM 7 (Neon / Supabase PostgreSQL)</p>
                  </div>
                </div>

                <div className="bg-slate-900/90 rounded-xl p-3 text-[11px] font-mono text-slate-300 space-y-1.5 border border-slate-800">
                  <p className="text-emerald-400 font-semibold">// .env untuk Neon:</p>
                  <p className="text-slate-400 truncate text-[10px]">DATABASE_URL="postgresql://user:pass@ep-sample.aws.neon.tech/neondb?sslmode=require"</p>
                  <p className="text-sky-400 font-semibold pt-1">// .env untuk Supabase:</p>
                  <p className="text-slate-400 truncate text-[10px]">DATABASE_URL="postgresql://postgres:[pass]@pooler.supabase.com:6543/postgres?pgbouncer=true"</p>
                </div>

                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Jalankan <code className="text-sky-400">npx prisma db push</code> di terminal untuk membuat tabel relasional di database cloud Anda.
                </p>
              </div>

              {/* Reset Factory Defaults */}
              <div className="glass-panel rounded-2xl p-6 border border-rose-500/20 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-rose-400">Reset Semua Data Portofolio</h3>
                  <button
                    type="button"
                    onClick={handleResetData}
                    className="px-3.5 py-1.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 text-xs font-semibold transition-colors"
                  >
                    Reset Data
                  </button>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Mereset seluruh data profil, proyek, skill, pengalaman, dan testimoni kembali ke template sampel default awal.
                </p>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ----------------- MODAL: PROJECT EDIT/ADD ----------------- */}
      {projectModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="glass-panel rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-slate-700 p-7 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-5">
              <h3 className="text-base font-bold text-white">
                {projectModal.data.id ? "Edit Proyek Portofolio" : "Tambah Proyek Baru"}
              </h3>
              <button
                onClick={() => setProjectModal({ open: false, data: {} })}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProject} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Judul Proyek *
                </label>
                <input
                  type="text"
                  required
                  value={projectModal.data.title || ""}
                  onChange={(e) =>
                    setProjectModal({
                      ...projectModal,
                      data: { ...projectModal.data, title: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Tagline Singkat
                </label>
                <input
                  type="text"
                  value={projectModal.data.tagline || ""}
                  onChange={(e) =>
                    setProjectModal({
                      ...projectModal,
                      data: { ...projectModal.data, tagline: e.target.value },
                    })
                  }
                  placeholder="e.g. Real-time Infrastructure Observability"
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm"
                />
              </div>

              {/* Upload Gambar Proyek */}
              <ImageUploader
                label="Screenshot / Gambar Proyek (Unggah atau URL)"
                value={projectModal.data.imageUrl || ""}
                onChange={(url) =>
                  setProjectModal({
                    ...projectModal,
                    data: { ...projectModal.data, imageUrl: url },
                  })
                }
                aspectRatio="video"
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Kategori Proyek
                  </label>
                  <select
                    value={projectModal.data.category || "Fullstack"}
                    onChange={(e) =>
                      setProjectModal({
                        ...projectModal,
                        data: { ...projectModal.data, category: e.target.value as any },
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm"
                  >
                    <option value="Fullstack">Fullstack</option>
                    <option value="Frontend">Frontend</option>
                    <option value="Backend">Backend</option>
                    <option value="AI / Tools">AI / Tools</option>
                    <option value="Mobile">Mobile</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Urutan Tampil (Order)
                  </label>
                  <input
                    type="number"
                    value={projectModal.data.order ?? 1}
                    onChange={(e) =>
                      setProjectModal({
                        ...projectModal,
                        data: { ...projectModal.data, order: parseInt(e.target.value) || 0 },
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Deskripsi Lengkap *
                </label>
                <textarea
                  rows={3}
                  required
                  value={projectModal.data.description || ""}
                  onChange={(e) =>
                    setProjectModal({
                      ...projectModal,
                      data: { ...projectModal.data, description: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Live Demo URL
                  </label>
                  <input
                    type="text"
                    value={projectModal.data.demoUrl || ""}
                    onChange={(e) =>
                      setProjectModal({
                        ...projectModal,
                        data: { ...projectModal.data, demoUrl: e.target.value },
                      })
                    }
                    placeholder="https://..."
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    GitHub URL
                  </label>
                  <input
                    type="text"
                    value={projectModal.data.githubUrl || ""}
                    onChange={(e) =>
                      setProjectModal({
                        ...projectModal,
                        data: { ...projectModal.data, githubUrl: e.target.value },
                      })
                    }
                    placeholder="https://github.com/..."
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Tech Stack (Pisahkan dengan koma)
                </label>
                <input
                  type="text"
                  value={
                    Array.isArray(projectModal.data.techStack)
                      ? projectModal.data.techStack.join(", ")
                      : ""
                  }
                  onChange={(e) =>
                    setProjectModal({
                      ...projectModal,
                      data: {
                        ...projectModal.data,
                        techStack: e.target.value
                          .split(",")
                          .map((s) => s.trim())
                          .filter(Boolean),
                      },
                    })
                  }
                  placeholder="Next.js, TypeScript, PostgreSQL, Tailwind"
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm"
                />
              </div>

              <div className="flex flex-wrap items-center gap-6 pt-2 border-t border-slate-800">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="projActive"
                    checked={projectModal.data.isActive ?? true}
                    onChange={(e) =>
                      setProjectModal({
                        ...projectModal,
                        data: { ...projectModal.data, isActive: e.target.checked },
                      })
                    }
                    className="w-4 h-4 rounded text-emerald-500 bg-slate-900 border-slate-700"
                  />
                  <label htmlFor="projActive" className="text-xs font-semibold text-emerald-400">
                    Aktif (Tampilkan di Halaman Utama)
                  </label>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="projFeatured"
                    checked={projectModal.data.featured ?? true}
                    onChange={(e) =>
                      setProjectModal({
                        ...projectModal,
                        data: { ...projectModal.data, featured: e.target.checked },
                      })
                    }
                    className="w-4 h-4 rounded text-sky-500 bg-slate-900 border-slate-700"
                  />
                  <label htmlFor="projFeatured" className="text-xs text-slate-200">
                    Tandai sebagai Featured (Unggulan)
                  </label>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setProjectModal({ open: false, data: {} })}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-medium"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-white text-xs font-semibold"
                >
                  Simpan Proyek
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ----------------- MODAL: SKILL EDIT/ADD ----------------- */}
      {skillModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="glass-panel rounded-3xl max-w-md w-full border border-slate-700 p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-5">
              <h3 className="text-base font-bold text-white">
                {skillModal.data.id ? "Edit Keahlian" : "Tambah Keahlian Baru"}
              </h3>
              <button
                onClick={() => setSkillModal({ open: false, data: {} })}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveSkill} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Nama Keahlian / Teknologi *
                </label>
                <input
                  type="text"
                  required
                  value={skillModal.data.name || ""}
                  onChange={(e) =>
                    setSkillModal({
                      ...skillModal,
                      data: { ...skillModal.data, name: e.target.value },
                    })
                  }
                  placeholder="e.g. Next.js 15, PostgreSQL"
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Kategori
                </label>
                <select
                  value={skillModal.data.category || "Frontend"}
                  onChange={(e) =>
                    setSkillModal({
                      ...skillModal,
                      data: { ...skillModal.data, category: e.target.value as any },
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm"
                >
                  <option value="Frontend">Frontend</option>
                  <option value="Backend">Backend</option>
                  <option value="Database & Cloud">Database & Cloud</option>
                  <option value="DevOps & Tools">DevOps & Tools</option>
                  <option value="Architecture">Architecture</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Icon (Code2, Database, Server, Cloud, Layers, Cpu, Box, Globe, Palette, FileCode, Workflow)
                </label>
                <input
                  type="text"
                  value={skillModal.data.icon || "Code2"}
                  onChange={(e) =>
                    setSkillModal({
                      ...skillModal,
                      data: { ...skillModal.data, icon: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Tingkat Penguasaan ({skillModal.data.level || 90}%)
                </label>
                <input
                  type="range"
                  min="20"
                  max="100"
                  value={skillModal.data.level || 90}
                  onChange={(e) =>
                    setSkillModal({
                      ...skillModal,
                      data: { ...skillModal.data, level: parseInt(e.target.value) },
                    })
                  }
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-sky-400"
                />
              </div>

              <div className="flex items-center gap-2 pt-2 border-t border-slate-800">
                <input
                  type="checkbox"
                  id="skillActive"
                  checked={skillModal.data.isActive ?? true}
                  onChange={(e) =>
                    setSkillModal({
                      ...skillModal,
                      data: { ...skillModal.data, isActive: e.target.checked },
                    })
                  }
                  className="w-4 h-4 rounded text-emerald-500 bg-slate-900 border-slate-700"
                />
                <label htmlFor="skillActive" className="text-xs font-semibold text-emerald-400">
                  Aktif (Tampilkan di Halaman Utama)
                </label>
              </div>

              <div className="pt-4 border-t border-slate-800 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setSkillModal({ open: false, data: {} })}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-medium"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-white text-xs font-semibold"
                >
                  Simpan Skill
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ----------------- MODAL: EXPERIENCE EDIT/ADD ----------------- */}
      {expModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="glass-panel rounded-3xl max-w-lg w-full border border-slate-700 p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-5">
              <h3 className="text-base font-bold text-white">
                {expModal.data.id ? "Edit Pengalaman Kerja" : "Tambah Pengalaman"}
              </h3>
              <button
                onClick={() => setExpModal({ open: false, data: {} })}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveExp} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Posisi / Role *
                </label>
                <input
                  type="text"
                  required
                  value={expModal.data.role || ""}
                  onChange={(e) =>
                    setExpModal({
                      ...expModal,
                      data: { ...expModal.data, role: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Nama Perusahaan *
                </label>
                <input
                  type="text"
                  required
                  value={expModal.data.company || ""}
                  onChange={(e) =>
                    setExpModal({
                      ...expModal,
                      data: { ...expModal.data, company: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Tahun Mulai
                  </label>
                  <input
                    type="text"
                    value={expModal.data.startDate || "2023"}
                    onChange={(e) =>
                      setExpModal({
                        ...expModal,
                        data: { ...expModal.data, startDate: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Tahun Selesai
                  </label>
                  <input
                    type="text"
                    value={expModal.data.endDate || "Present"}
                    onChange={(e) =>
                      setExpModal({
                        ...expModal,
                        data: { ...expModal.data, endDate: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Lokasi Penempatan / Kantor *
                  </label>
                  <input
                    type="text"
                    required
                    value={expModal.data.location || ""}
                    onChange={(e) =>
                      setExpModal({
                        ...expModal,
                        data: { ...expModal.data, location: e.target.value },
                      })
                    }
                    placeholder="e.g. Jakarta, Indonesia"
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:outline-none focus:border-sky-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Sistem / Model Kerja *
                  </label>
                  <select
                    value={expModal.data.type || "Remote"}
                    onChange={(e) =>
                      setExpModal({
                        ...expModal,
                        data: { ...expModal.data, type: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:outline-none focus:border-sky-500"
                  >
                    <option value="Remote">Remote</option>
                    <option value="Hybrid">Hybrid</option>
                    <option value="On-site">On-site</option>
                    <option value="Full-time (Remote)">Full-time (Remote)</option>
                    <option value="Full-time (Hybrid)">Full-time (Hybrid)</option>
                    <option value="Full-time (On-site)">Full-time (On-site)</option>
                    <option value="Contract (Remote)">Contract (Remote)</option>
                    <option value="Contract (On-site)">Contract (On-site)</option>
                    <option value="Internship (Remote)">Internship (Remote)</option>
                    <option value="Internship (On-site)">Internship (On-site)</option>
                    <option value="Freelance">Freelance</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Teknologi yang Digunakan (Pisahkan dengan koma)
                </label>
                <input
                  type="text"
                  value={
                    Array.isArray(expModal.data.technologies)
                      ? expModal.data.technologies.join(", ")
                      : ""
                  }
                  onChange={(e) =>
                    setExpModal({
                      ...expModal,
                      data: {
                        ...expModal.data,
                        technologies: e.target.value
                          .split(",")
                          .map((s) => s.trim())
                          .filter(Boolean),
                      },
                    })
                  }
                  placeholder="e.g. Next.js, React, TypeScript, PostgreSQL"
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Deskripsi Tanggung Jawab & Pencapaian
                </label>
                <textarea
                  rows={3}
                  value={expModal.data.description || ""}
                  onChange={(e) =>
                    setExpModal({
                      ...expModal,
                      data: { ...expModal.data, description: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm resize-none"
                />
              </div>

              {/* Toggle On/Off inside Modal */}
              <div className="flex items-center gap-2 pt-2 border-t border-slate-800">
                <input
                  type="checkbox"
                  id="expActive"
                  checked={expModal.data.isActive ?? true}
                  onChange={(e) =>
                    setExpModal({
                      ...expModal,
                      data: { ...expModal.data, isActive: e.target.checked },
                    })
                  }
                  className="w-4 h-4 rounded text-emerald-500 bg-slate-900 border-slate-700"
                />
                <label htmlFor="expActive" className="text-xs font-semibold text-emerald-400">
                  Aktif (Tampilkan di Halaman Utama Portofolio)
                </label>
              </div>

              <div className="pt-4 border-t border-slate-800 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setExpModal({ open: false, data: {} })}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-medium"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-white text-xs font-semibold"
                >
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ----------------- MODAL: EDUCATION EDIT/ADD ----------------- */}
      {eduModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="glass-panel rounded-3xl max-w-lg w-full border border-slate-700 p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-5">
              <h3 className="text-base font-bold text-white">
                {eduModal.data.id ? "Edit Pendidikan/Sertifikasi" : "Tambah Pendidikan/Sertifikasi"}
              </h3>
              <button
                onClick={() => setEduModal({ open: false, data: {} })}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdu} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Nama Gelar / Sertifikasi *
                </label>
                <input
                  type="text"
                  required
                  value={eduModal.data.title || ""}
                  onChange={(e) =>
                    setEduModal({
                      ...eduModal,
                      data: { ...eduModal.data, title: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Institusi / Penyelenggara *
                </label>
                <input
                  type="text"
                  required
                  value={eduModal.data.institution || ""}
                  onChange={(e) =>
                    setEduModal({
                      ...eduModal,
                      data: { ...eduModal.data, institution: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Tahun Perolehan
                </label>
                <input
                  type="text"
                  value={eduModal.data.year || "2023"}
                  onChange={(e) =>
                    setEduModal({
                      ...eduModal,
                      data: { ...eduModal.data, year: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Deskripsi / Keterangan
                </label>
                <textarea
                  rows={3}
                  value={eduModal.data.description || ""}
                  onChange={(e) =>
                    setEduModal({
                      ...eduModal,
                      data: { ...eduModal.data, description: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm resize-none"
                />
              </div>

              {/* Toggle On/Off inside Modal */}
              <div className="flex items-center gap-2 pt-2 border-t border-slate-800">
                <input
                  type="checkbox"
                  id="eduActive"
                  checked={eduModal.data.isActive ?? true}
                  onChange={(e) =>
                    setEduModal({
                      ...eduModal,
                      data: { ...eduModal.data, isActive: e.target.checked },
                    })
                  }
                  className="w-4 h-4 rounded text-emerald-500 bg-slate-900 border-slate-700"
                />
                <label htmlFor="eduActive" className="text-xs font-semibold text-emerald-400">
                  Aktif (Tampilkan di Halaman Utama Portofolio)
                </label>
              </div>

              <div className="pt-4 border-t border-slate-800 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEduModal({ open: false, data: {} })}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-medium"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-500 hover:bg-indigo-400 text-white text-xs font-semibold"
                >
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ----------------- MODAL: TESTIMONIAL EDIT/ADD ----------------- */}
      {testiModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="glass-panel rounded-3xl max-w-lg w-full border border-slate-700 p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-5">
              <h3 className="text-base font-bold text-white">
                {testiModal.data.id ? "Edit Testimoni" : "Tambah Testimoni Baru"}
              </h3>
              <button
                onClick={() => setTestiModal({ open: false, data: {} })}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveTesti} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Nama Klien / Rekan *
                </label>
                <input
                  type="text"
                  required
                  value={testiModal.data.name || ""}
                  onChange={(e) =>
                    setTestiModal({
                      ...testiModal,
                      data: { ...testiModal.data, name: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Jabatan / Role
                  </label>
                  <input
                    type="text"
                    value={testiModal.data.role || "Product Director"}
                    onChange={(e) =>
                      setTestiModal({
                        ...testiModal,
                        data: { ...testiModal.data, role: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Nama Perusahaan
                  </label>
                  <input
                    type="text"
                    value={testiModal.data.company || ""}
                    onChange={(e) =>
                      setTestiModal({
                        ...testiModal,
                        data: { ...testiModal.data, company: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm"
                  />
                </div>
              </div>

              {/* Upload Foto Testimoni */}
              <ImageUploader
                label="Foto Klien / Avatar (Unggah atau URL)"
                value={testiModal.data.avatarUrl || ""}
                onChange={(url) =>
                  setTestiModal({
                    ...testiModal,
                    data: { ...testiModal.data, avatarUrl: url },
                  })
                }
                aspectRatio="square"
              />

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Isi Testimoni / Ulasan *
                </label>
                <textarea
                  rows={3}
                  required
                  value={testiModal.data.content || ""}
                  onChange={(e) =>
                    setTestiModal({
                      ...testiModal,
                      data: { ...testiModal.data, content: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm resize-none"
                />
              </div>

              <div className="flex items-center gap-2 pt-2 border-t border-slate-800">
                <input
                  type="checkbox"
                  id="testiActive"
                  checked={testiModal.data.isActive ?? true}
                  onChange={(e) =>
                    setTestiModal({
                      ...testiModal,
                      data: { ...testiModal.data, isActive: e.target.checked },
                    })
                  }
                  className="w-4 h-4 rounded text-emerald-500 bg-slate-900 border-slate-700"
                />
                <label htmlFor="testiActive" className="text-xs font-semibold text-emerald-400">
                  Aktif (Tampilkan di Halaman Utama)
                </label>
              </div>

              <div className="pt-4 border-t border-slate-800 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setTestiModal({ open: false, data: {} })}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-medium"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-white text-xs font-semibold"
                >
                  Simpan Testimoni
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
