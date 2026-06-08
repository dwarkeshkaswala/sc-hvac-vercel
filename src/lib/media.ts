/**
 * Media server client for the self-hosted upload companion.
 *
 * Env vars required:
 *   MEDIA_SERVER_URL  – upload server URL (https://upload.livesforever.club)
 *   MEDIA_API_KEY     – API key for the upload companion
 */

const SERVER_URL = () => process.env.MEDIA_SERVER_URL?.replace(/\/$/, "") ?? "";
const API_KEY = () => process.env.MEDIA_API_KEY ?? "";

export interface MediaFile {
  path: string;
  name: string;
  size: number;
  type: string;
  modified: string;
  url: string;
}

/** List files via the upload companion */
export async function listFiles(): Promise<MediaFile[]> {
  const res = await fetch(`${SERVER_URL()}/list`, {
    headers: { "X-API-Key": API_KEY() },
  });

  if (!res.ok) {
    throw new Error(`Failed to list files: ${res.status}`);
  }

  const data = await res.json();
  return (data.files ?? []).map((f: { name: string; path: string; size: number; modified: string }) => ({
    path: f.path,
    name: f.name,
    size: f.size,
    type: inferMimeType(f.name),
    modified: f.modified,
    url: `${SERVER_URL()}${f.path}`,
  }));
}

/** Upload a file via the upload companion */
export async function uploadFile(file: Buffer, filename: string): Promise<MediaFile> {
  const formData = new FormData();
  const blob = new Blob([new Uint8Array(file)]);
  formData.append("files", blob, filename);

  const res = await fetch(`${SERVER_URL()}/upload`, {
    method: "POST",
    headers: { "X-API-Key": API_KEY() },
    body: formData,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Upload failed (${res.status}): ${text}`);
  }

  const data = await res.json();
  const uploaded = data.files[0];

  return {
    path: uploaded.path,
    name: uploaded.name,
    size: uploaded.size,
    type: inferMimeType(uploaded.name),
    modified: uploaded.modified,
    url: `${SERVER_URL()}${uploaded.path}`,
  };
}

/** Delete a file via the upload companion */
export async function deleteFile(path: string): Promise<void> {
  const res = await fetch(`${SERVER_URL()}/delete`, {
    method: "DELETE",
    headers: {
      "X-API-Key": API_KEY(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ path }),
  });

  if (!res.ok && res.status !== 404) {
    throw new Error(`Delete failed: ${res.status}`);
  }
}

/** Get the public URL for a file */
export function getPublicUrl(path: string): string {
  return `${SERVER_URL()}${path}`;
}

function inferMimeType(filename: string): string {
  const ext = filename.split(".").pop()?.toLowerCase() ?? "";
  const map: Record<string, string> = {
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    png: "image/png",
    gif: "image/gif",
    webp: "image/webp",
    svg: "image/svg+xml",
    mp4: "video/mp4",
    webm: "video/webm",
    pdf: "application/pdf",
  };
  return map[ext] ?? "application/octet-stream";
}
