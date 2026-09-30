"use client";

import React, { useState, useRef } from "react";
import { Upload, Loader2, Image as ImageIcon, Check, AlertCircle } from "lucide-react";

interface ImageUploaderProps {
  label?: string;
  value: string;
  onChange: (url: string) => void;
  aspectRatio?: "square" | "video";
}

export default function ImageUploader({
  label = "Foto Profil / Avatar",
  value,
  onChange,
  aspectRatio = "square",
}: ImageUploaderProps) {
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
        throw new Error(data.error || "Gagal mengunggah gambar");
      }

      onChange(data.url);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setErrorMsg(err.message || "Terjadi kesalahan saat upload");
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-xs font-semibold text-slate-300">
          {label}
        </label>
      )}

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-3 rounded-2xl bg-slate-900/90 border border-slate-800">
        {/* Thumbnail Preview */}
        <div
          className={`relative overflow-hidden bg-slate-950 border border-slate-700/80 shrink-0 ${
            aspectRatio === "square"
              ? "w-16 h-16 rounded-2xl"
              : "w-28 h-16 rounded-xl"
          }`}
        >
          {value ? (
            <img
              src={value}
              alt="Preview"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-slate-600">
              <ImageIcon className="w-6 h-6" />
            </div>
          )}

          {uploading && (
            <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
              <Loader2 className="w-5 h-5 text-sky-400 animate-spin" />
            </div>
          )}
        </div>

        {/* Input & Upload Controls */}
        <div className="flex-1 min-w-0 w-full space-y-2">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder="https://... atau klik tombol Unggah Foto"
              className="flex-1 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-sky-500 font-mono"
            />

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />

            <button
              type="button"
              disabled={uploading}
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-white text-xs font-semibold shrink-0 transition-colors disabled:opacity-50 shadow-md shadow-sky-500/20"
            >
              {uploading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Mengunggah...</span>
                </>
              ) : (
                <>
                  <Upload className="w-3.5 h-3.5" />
                  <span>Unggah Foto</span>
                </>
              )}
            </button>
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span>Mendukung: JPG, PNG, WebP, GIF (Maks. 5MB)</span>
            {success && (
              <span className="text-emerald-400 flex items-center gap-1 font-medium">
                <Check className="w-3 h-3" /> Foto berhasil diunggah!
              </span>
            )}
          </div>

          {errorMsg && (
            <div className="text-[11px] text-rose-400 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              <span>{errorMsg}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
