"use client";

import { useCallback, useEffect, useState } from "react";

interface MediaFile {
  path: string;
  name: string;
  size: number;
  type: string;
  modified: string;
  url: string;
}

export default function MediaManager() {
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState("");

  const fetchFiles = useCallback(async () => {
    try {
      const res = await fetch("/api/media");
      if (!res.ok) throw new Error("Failed to load files");
      const data = await res.json();
      setFiles(data.files);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFiles();
  }, [fetchFiles]);

  async function handleUpload(fileList: FileList | null) {
    if (!fileList || !fileList.length) return;
    setUploading(true);
    setError("");

    const formData = new FormData();
    for (let i = 0; i < fileList.length; i++) {
      formData.append("files", fileList[i]);
    }

    try {
      const res = await fetch("/api/media", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Upload failed");
      }
      await fetchFiles();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setUploading(false);
    }
  }

  async function handleDelete(path: string) {
    if (!confirm("Delete this file?")) return;
    try {
      const res = await fetch("/api/media", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ path }),
      });
      if (!res.ok) throw new Error("Delete failed");
      setFiles((prev) => prev.filter((f) => f.path !== path));
    } catch (e) {
      setError((e as Error).message);
    }
  }

  function copyUrl(url: string) {
    navigator.clipboard.writeText(url);
    setCopied(url);
    setTimeout(() => setCopied(""), 2000);
  }

  function formatSize(bytes: number) {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  function isImage(type: string) {
    return type.startsWith("image/");
  }

  return (
    <div className="p-4 sm:p-8 max-w-[1100px]">
      <div className="mb-6">
        <h1 className="text-[22px] font-bold text-[#111111] tracking-[-0.02em]">Media Files</h1>
        <p className="text-[13.5px] text-[#666] mt-1">
          Upload and manage files on your media server. Click a file URL to copy it.
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-[13px] font-medium px-4 py-3 rounded-[12px] mb-5">
          {error}
          <button onClick={() => setError("")} className="ml-3 underline">
            dismiss
          </button>
        </div>
      )}

      {/* Upload Zone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          handleUpload(e.dataTransfer.files);
        }}
        className={`relative border-2 border-dashed rounded-[16px] p-8 text-center transition-all duration-200 mb-8
          ${dragOver ? "border-[#0000B8] bg-[#0000B8]/5" : "border-[#E5E7EB] hover:border-[#999]"}
          ${uploading ? "opacity-60 pointer-events-none" : ""}`}
      >
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-[#F0F0F0] flex items-center justify-center text-[20px]">
            ↑
          </div>
          <div>
            <p className="text-[14px] font-semibold text-[#111]">
              {uploading ? "Uploading..." : "Drag & drop files here"}
            </p>
            <p className="text-[12.5px] text-[#666] mt-1">or click to browse — max 50MB per file</p>
          </div>
          <label className="cursor-pointer mt-2 px-4 py-2 rounded-[10px] bg-[#111] text-white text-[13px] font-medium hover:bg-[#333] transition-colors">
            Choose Files
            <input
              type="file"
              multiple
              className="hidden"
              onChange={(e) => handleUpload(e.target.files)}
              accept="image/*,video/*,.pdf,.svg"
            />
          </label>
        </div>
      </div>

      {/* File Grid */}
      {loading ? (
        <div className="text-[14px] text-[#666] text-center py-12">Loading files...</div>
      ) : files.length === 0 ? (
        <div className="text-[14px] text-[#666] text-center py-12">
          No files uploaded yet. Drop some files above to get started.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {files.map((file) => (
            <div
              key={file.path}
              className="bg-white rounded-[14px] border border-[#E5E7EB] overflow-hidden group hover:shadow-md transition-shadow"
            >
              {/* Preview */}
              <div className="h-[140px] bg-[#F6F6F7] flex items-center justify-center overflow-hidden">
                {isImage(file.type) ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={file.url}
                    alt={file.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-[32px] text-[#999]">
                    {file.type.includes("pdf") ? "PDF" : file.type.includes("video") ? "▶" : "◉"}
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="p-3">
                <p className="text-[13px] font-medium text-[#111] truncate" title={file.name}>
                  {file.name}
                </p>
                <p className="text-[11.5px] text-[#888] mt-0.5">{formatSize(file.size)}</p>

                {/* Actions */}
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => copyUrl(file.url)}
                    className={`flex-1 px-3 py-1.5 rounded-[8px] text-[12px] font-medium transition-all
                      ${copied === file.url
                        ? "bg-green-100 text-green-700"
                        : "bg-[#F0F0F0] text-[#555] hover:bg-[#E5E5E5]"
                      }`}
                  >
                    {copied === file.url ? "Copied!" : "Copy URL"}
                  </button>
                  <button
                    onClick={() => handleDelete(file.path)}
                    className="px-3 py-1.5 rounded-[8px] text-[12px] font-medium bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
