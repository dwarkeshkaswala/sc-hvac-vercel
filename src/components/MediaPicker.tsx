"use client";

import { useCallback, useEffect, useRef, useState } from "react";

interface MediaFile {
  path: string;
  name: string;
  size: number;
  type: string;
  modified: string;
  url: string;
}

interface MediaPickerProps {
  value: string;
  onChange: (url: string) => void;
  /** Recommended dimensions hint, e.g. "1200 × 800" */
  dimensions?: string;
  /** Recommended aspect ratio hint, e.g. "3:2" */
  aspectRatio?: string;
  /** Label for the field */
  label?: string;
  /** Accepted file types (default: images) */
  accept?: string;
}

export default function MediaPicker({
  value,
  onChange,
  dimensions,
  aspectRatio,
  label = "Image",
  accept = "image/*",
}: MediaPickerProps) {
  const [showLibrary, setShowLibrary] = useState(false);
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchFiles = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/media");
      if (!res.ok) throw new Error("Failed to load");
      const data = await res.json();
      // Filter to only images if accept is image/*
      const filtered = accept === "image/*"
        ? data.files.filter((f: MediaFile) => f.type.startsWith("image/"))
        : data.files;
      setFiles(filtered);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }, [accept]);

  useEffect(() => {
    if (showLibrary) fetchFiles();
  }, [showLibrary, fetchFiles]);

  async function handleUpload(fileList: FileList | null) {
    if (!fileList || !fileList.length) return;
    setUploading(true);
    setError("");
    const formData = new FormData();
    for (let i = 0; i < fileList.length; i++) {
      formData.append("files", fileList[i]);
    }
    try {
      const res = await fetch("/api/media", { method: "POST", body: formData });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Upload failed");
      }
      const data = await res.json();
      // Auto-select the first uploaded file
      if (data.files?.[0]) {
        onChange(data.files[0].url);
        setShowLibrary(false);
      }
      await fetchFiles();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="space-y-2">
      {/* Label + hints */}
      <div className="flex items-center gap-2">
        <span className="text-[11px] font-bold uppercase tracking-[0.06em] text-[#999]">{label}</span>
        {dimensions && (
          <span className="text-[10px] bg-[#F0F0F0] text-[#666] px-1.5 py-0.5 rounded font-medium">
            {dimensions}
          </span>
        )}
        {aspectRatio && (
          <span className="text-[10px] bg-[#F0F0F0] text-[#666] px-1.5 py-0.5 rounded font-medium">
            {aspectRatio}
          </span>
        )}
      </div>

      {/* Current value + preview */}
      <div className="flex gap-3 items-start">
        {/* Thumbnail preview */}
        {value && accept === "image/*" && (
          <div className="w-[60px] h-[60px] rounded-[8px] border border-[#E5E7EB] overflow-hidden shrink-0 bg-[#F6F6F7]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={value} alt="" className="w-full h-full object-cover" />
          </div>
        )}

        <div className="flex-1 min-w-0">
          <input
            type="text"
            className="w-full h-[38px] px-3 rounded-[8px] border border-[#E5E7EB] bg-white text-[13px] text-[#111] placeholder-[#BBB] focus:outline-none focus:border-[#0000B8] focus:ring-2 focus:ring-[#0000B8]/10 transition-all"
            placeholder="Paste URL or pick from library"
            value={value}
            onChange={(e) => onChange(e.target.value)}
          />
          <div className="flex gap-2 mt-2">
            <button
              type="button"
              onClick={() => setShowLibrary(true)}
              className="text-[11.5px] font-semibold text-[#0000B8] hover:text-[#000096] transition-colors"
            >
              Browse library
            </button>
            <span className="text-[11px] text-[#CCC]">|</span>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="text-[11.5px] font-semibold text-[#0000B8] hover:text-[#000096] transition-colors"
            >
              Upload new
            </button>
            {value && (
              <>
                <span className="text-[11px] text-[#CCC]">|</span>
                <button
                  type="button"
                  onClick={() => onChange("")}
                  className="text-[11.5px] font-semibold text-red-500 hover:text-red-600 transition-colors"
                >
                  Remove
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Hidden file input for direct upload */}
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        accept={accept}
        onChange={(e) => handleUpload(e.target.files)}
      />

      {/* Library modal */}
      {showLibrary && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-[20px] shadow-2xl w-full max-w-[700px] max-h-[80vh] flex flex-col overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#E5E7EB]">
              <div>
                <h3 className="text-[16px] font-bold text-[#111]">Media Library</h3>
                {dimensions && (
                  <p className="text-[11.5px] text-[#888] mt-0.5">
                    Recommended: {dimensions}{aspectRatio ? ` (${aspectRatio})` : ""}
                  </p>
                )}
              </div>
              <button
                onClick={() => setShowLibrary(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#F0F0F0] text-[#666] text-[18px]"
              >×</button>
            </div>

            {/* Upload bar */}
            <div className="px-6 py-3 border-b border-[#E5E7EB] flex items-center gap-3">
              <label className={`cursor-pointer px-4 py-2 rounded-[8px] bg-[#111] text-white text-[12px] font-medium hover:bg-[#333] transition-colors ${uploading ? "opacity-50 pointer-events-none" : ""}`}>
                {uploading ? "Uploading..." : "Upload file"}
                <input
                  type="file"
                  className="hidden"
                  accept={accept}
                  multiple
                  onChange={(e) => handleUpload(e.target.files)}
                />
              </label>
              {error && <span className="text-[12px] text-red-500">{error}</span>}
            </div>

            {/* File grid */}
            <div className="flex-1 overflow-auto p-4">
              {loading ? (
                <p className="text-[13px] text-[#888] text-center py-8">Loading...</p>
              ) : files.length === 0 ? (
                <p className="text-[13px] text-[#888] text-center py-8">No files yet. Upload one above.</p>
              ) : (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                  {files.map((file) => (
                    <button
                      key={file.path}
                      onClick={() => {
                        onChange(file.url);
                        setShowLibrary(false);
                      }}
                      className={`relative rounded-[10px] border-2 overflow-hidden aspect-square group transition-all
                        ${value === file.url ? "border-[#0000B8] ring-2 ring-[#0000B8]/20" : "border-[#E5E7EB] hover:border-[#999]"}`}
                    >
                      {file.type.startsWith("image/") ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={file.url} alt={file.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-[#F6F6F7] text-[11px] text-[#666] p-2 text-center break-all">
                          {file.name}
                        </div>
                      )}
                      {value === file.url && (
                        <div className="absolute top-1 right-1 w-5 h-5 bg-[#0000B8] rounded-full flex items-center justify-center text-white text-[11px]">✓</div>
                      )}
                      <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-[10px] px-1.5 py-1 truncate opacity-0 group-hover:opacity-100 transition-opacity">
                        {file.name}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
