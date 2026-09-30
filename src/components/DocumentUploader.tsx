"use client";

import React, { useState, useRef } from "react";
import { Upload, Loader2, FileText, Check, AlertCircle, ExternalLink, X } from "lucide-react";

interface DocumentUploaderProps {
  label?: string;
  value: string;
  onChange: (url: string) => void;
  placeholder?: string;
  accept?: string;
  helperText?: string;
}

export default function DocumentUploader({
  label = "Link Resume / CV (PDF / Dokumen)",
  value,
  onChange,
  placeholder = "/uploads/... atau URL Dokumen",
  accept = ".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  helperText = "Mendukung: PDF, DOC, DOCX (Maks. 10MB)",
}: DocumentUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setErrorMsg("");
    setSuccess(false);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Gagal mengunggah dokumen");
      }

      onChange(data.url);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3500);
    } catch (err: any) {
      setErrorMsg(err.message || "Terjadi kesalahan saat upload dokumen");
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  return (
    <div className="w-full">
      {label && (
        <div className="flex items-center justify-between mb-1.5">
          <label className="block text-xs font-semibold text-slate-300">
            {label}
          </label>
          {uploading && (
            <span className="text-[11px] text-sky-400 flex items-center gap-1 font-medium">
              <Loader2 className="w-3 h-3 animate-spin" /> Mengunggah...
            </span>
          )}
        </div>
      )}

      {/* Input Group - stays strictly within the standard field bounds */}
      <div className="relative flex items-center w-full">
        <div className="absolute left-3.5 text-slate-500 pointer-events-none">
          <FileText className="w-4 h-4" />
        </div>

        <input
          type="text"
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full pl-10 pr-24 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs sm:text-sm focus:outline-none focus:border-sky-500 font-mono transition-colors"
        />

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept={accept}
          className="hidden"
        />

        <div className="absolute right-1.5 flex items-center gap-1">
          {value && value !== "#resume" && (
            <button
              type="button"
              onClick={() => onChange("")}
              className="p-1 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-md transition-colors"
              title="Hapus Link"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}

          <button
            type="button"
            disabled={uploading}
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-sky-500 hover:bg-sky-400 text-white text-xs font-semibold transition-all disabled:opacity-50 shadow-sm shadow-sky-500/20"
            title="Pilih file dokumen dari komputer"
          >
            {uploading ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Upload className="w-3.5 h-3.5" />
            )}
            <span>Upload</span>
          </button>
        </div>
      </div>

      {/* Helper and Status Row */}
      <div className="flex items-center justify-between mt-1.5 text-[11px] text-slate-400">
        <span>{helperText}</span>

        <div className="flex items-center gap-2">
          {success && (
            <span className="text-emerald-400 flex items-center gap-1 font-medium">
              <Check className="w-3 h-3" /> Berhasil diunggah!
            </span>
          )}

          {value && value !== "#resume" && (
            <a
              href={value}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sky-400 hover:text-sky-300 hover:underline flex items-center gap-1 font-medium transition-colors"
            >
              <span>Buka File</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </div>
      </div>

      {errorMsg && (
        <div className="mt-1 text-[11px] text-rose-400 flex items-center gap-1">
          <AlertCircle className="w-3 h-3 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}
    </div>
  );
}
