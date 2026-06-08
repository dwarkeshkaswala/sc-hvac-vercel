/**
 * Media Upload Companion Server
 * 
 * A tiny standalone server that handles file uploads from your Vercel website.
 * Files are saved into a folder that filesrv already serves publicly.
 * Runs on its own port — does NOT interfere with jellyfin, nextcloud, navidrome, or filesrv.
 *
 * HOW TO RUN:
 *   1. Copy this file to your home server
 *   2. Set environment variables (see below)
 *   3. Run: node media-server.mjs
 *
 * ENV VARS:
 *   MEDIA_DIR   — the root folder that filesrv is serving (e.g. /srv/files or /home/user/files)
 *   PORT        — port for this server (default: 9091, pick anything not used by other services)
 *   API_KEY     — a secret password so only your website can upload (REQUIRED)
 */

import { createServer } from "node:http";
import { mkdir, readdir, stat, writeFile, readFile } from "node:fs/promises";
import { join, basename, extname } from "node:path";
import { existsSync } from "node:fs";

const MEDIA_DIR = process.env.MEDIA_DIR || "./files";
const PORT = parseInt(process.env.PORT || "9091", 10);
const API_KEY = process.env.API_KEY || "";

if (!API_KEY) {
  console.error("ERROR: API_KEY env variable is required!");
  process.exit(1);
}

// Ensure upload dirs exist inside the filesrv directory
const BASE_DIR = join(MEDIA_DIR, "uploads", "shreeji-hvac");
const DELETED_DIR = join(BASE_DIR, "deleted");
const SUBDIRS = {
  images: join(BASE_DIR, "images"),
  videos: join(BASE_DIR, "videos"),
  documents: join(BASE_DIR, "documents"),
};

for (const dir of [BASE_DIR, DELETED_DIR, ...Object.values(SUBDIRS)]) {
  if (!existsSync(dir)) {
    await mkdir(dir, { recursive: true });
    console.log(`Created directory: ${dir}`);
  }
}

/** Determine subfolder based on file extension */
function getSubfolder(filename) {
  const ext = extname(filename).toLowerCase();
  const imageExts = [".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg", ".bmp", ".ico"];
  const videoExts = [".mp4", ".webm", ".avi", ".mkv", ".mov"];
  if (imageExts.includes(ext)) return "images";
  if (videoExts.includes(ext)) return "videos";
  return "documents";
}

function cors(res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, X-API-Key");
}

function auth(req) {
  return req.headers["x-api-key"] === API_KEY;
}

function json(res, status, data) {
  res.writeHead(status, { "Content-Type": "application/json" });
  res.end(JSON.stringify(data));
}

function sanitizeFilename(name) {
  return basename(name).replace(/[^a-zA-Z0-9._-]/g, "_").replace(/_{2,}/g, "_");
}

const server = createServer(async (req, res) => {
  cors(res);

  if (req.method === "OPTIONS") {
    res.writeHead(204);
    return res.end();
  }

  const url = new URL(req.url, `http://localhost:${PORT}`);

  // Block any access outside shreeji-hvac
  if (req.method === "GET" && url.pathname.startsWith("/uploads/") && !url.pathname.startsWith("/uploads/shreeji-hvac/")) {
    return json(res, 403, { error: "Access restricted to shreeji-hvac" });
  }

  // Public file serving: GET /uploads/shreeji-hvac/<type>/<filename> — NO auth required
  if (req.method === "GET" && url.pathname.startsWith("/uploads/shreeji-hvac/")) {
    const parts = url.pathname.split("/").filter(Boolean); // ["uploads", "shreeji-hvac", "<type>", "<filename>"]
    if (parts.length !== 4) return json(res, 404, { error: "File not found" });
    const [, , subfolder, filename] = parts;
    // Block access to deleted folder publicly
    if (!["images", "videos", "documents"].includes(subfolder)) {
      return json(res, 404, { error: "File not found" });
    }
    const safeName = basename(filename);
    const filePath = join(SUBDIRS[subfolder], safeName);
    if (!existsSync(filePath)) {
      return json(res, 404, { error: "File not found" });
    }
    try {
      const data = await readFile(filePath);
      const ext = extname(safeName).toLowerCase();
      const mimeTypes = {
        ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".png": "image/png",
        ".gif": "image/gif", ".webp": "image/webp", ".svg": "image/svg+xml",
        ".mp4": "video/mp4", ".webm": "video/webm", ".pdf": "application/pdf",
        ".ico": "image/x-icon",
      };
      const contentType = mimeTypes[ext] || "application/octet-stream";
      res.writeHead(200, {
        "Content-Type": contentType,
        "Content-Length": data.length,
        "Cache-Control": "public, max-age=31536000, immutable",
      });
      return res.end(data);
    } catch (e) {
      return json(res, 500, { error: e.message });
    }
  }

  // All other endpoints require auth
  if (!auth(req)) {
    return json(res, 401, { error: "Unauthorized" });
  }

  // GET /list — list uploaded files from all subfolders
  if (req.method === "GET" && url.pathname === "/list") {
    try {
      const files = [];
      for (const [type, dir] of Object.entries(SUBDIRS)) {
        const entries = await readdir(dir).catch(() => []);
        for (const name of entries) {
          const filePath = join(dir, name);
          const s = await stat(filePath);
          if (s.isFile()) {
            files.push({
              name,
              type,
              path: `/uploads/shreeji-hvac/${type}/${name}`,
              size: s.size,
              modified: s.mtime.toISOString(),
            });
          }
        }
      }
      return json(res, 200, { files });
    } catch (e) {
      return json(res, 500, { error: e.message });
    }
  }

  // POST /upload — upload a file (multipart/form-data)
  if (req.method === "POST" && url.pathname === "/upload") {
    try {
      const contentType = req.headers["content-type"] || "";

      if (!contentType.includes("multipart/form-data")) {
        return json(res, 400, { error: "Expected multipart/form-data" });
      }

      const boundary = contentType.split("boundary=")[1];
      if (!boundary) return json(res, 400, { error: "No boundary found" });

      const chunks = [];
      for await (const chunk of req) chunks.push(chunk);
      const body = Buffer.concat(chunks);

      const files = parseMultipart(body, boundary);
      const results = [];

      for (const file of files) {
        const safeName = sanitizeFilename(file.filename);
        const subfolder = getSubfolder(safeName);
        const filePath = join(SUBDIRS[subfolder], safeName);
        await writeFile(filePath, file.data);
        const s = await stat(filePath);
        results.push({
          name: safeName,
          type: subfolder,
          path: `/uploads/shreeji-hvac/${subfolder}/${safeName}`,
          size: s.size,
          modified: s.mtime.toISOString(),
        });
      }

      return json(res, 200, { files: results });
    } catch (e) {
      return json(res, 500, { error: e.message });
    }
  }

  // DELETE /delete — delete a file
  if (req.method === "DELETE" && url.pathname === "/delete") {
    try {
      const chunks = [];
      for await (const chunk of req) chunks.push(chunk);
      const { path: filePath } = JSON.parse(Buffer.concat(chunks).toString());

      if (!filePath || typeof filePath !== "string") {
        return json(res, 400, { error: "path required" });
      }

      // Parse path: /uploads/shreeji-hvac/<type>/<filename>
      const parts = filePath.split("/").filter(Boolean);
      if (parts.length !== 4 || parts[0] !== "uploads" || parts[1] !== "shreeji-hvac") {
        return json(res, 400, { error: "Invalid path" });
      }
      const [, , subfolder, filename] = parts;
      if (!["images", "videos", "documents"].includes(subfolder)) {
        return json(res, 400, { error: "Invalid subfolder" });
      }

      const safeName = basename(filename);
      const fullPath = join(SUBDIRS[subfolder], safeName);

      if (!existsSync(fullPath)) {
        return json(res, 404, { error: "File not found" });
      }

      // Move to deleted folder instead of permanently removing
      const { rename } = await import("node:fs/promises");
      const deletedPath = join(DELETED_DIR, `${Date.now()}_${subfolder}_${safeName}`);
      await rename(fullPath, deletedPath);
      return json(res, 200, { success: true });
    } catch (e) {
      return json(res, 500, { error: e.message });
    }
  }

  json(res, 404, { error: "Not found" });
});

/** Simple multipart parser */
function parseMultipart(body, boundary) {
  const files = [];
  const sep = Buffer.from(`--${boundary}`);
  const parts = splitBuffer(body, sep).slice(1); // skip preamble

  for (const part of parts) {
    const headerEnd = part.indexOf("\r\n\r\n");
    if (headerEnd === -1) continue;

    const headerStr = part.slice(0, headerEnd).toString();
    const filenameMatch = headerStr.match(/filename="([^"]+)"/);
    if (!filenameMatch) continue;

    // Skip trailing \r\n
    let data = part.slice(headerEnd + 4);
    if (data.length >= 2 && data[data.length - 2] === 13 && data[data.length - 1] === 10) {
      data = data.slice(0, -2);
    }

    files.push({ filename: filenameMatch[1], data });
  }

  return files;
}

function splitBuffer(buf, sep) {
  const parts = [];
  let start = 0;
  while (true) {
    const idx = buf.indexOf(sep, start);
    if (idx === -1) {
      parts.push(buf.slice(start));
      break;
    }
    parts.push(buf.slice(start, idx));
    start = idx + sep.length;
  }
  return parts;
}

server.listen(PORT, "0.0.0.0", () => {
  console.log(`
  ============================================================
    Media Upload Companion v1.0
  ============================================================

  Status:           RUNNING
  Port:             ${PORT}
  Upload folder:    ${BASE_DIR}
    ├── images/
    ├── videos/
    └── documents/
  
  This does NOT affect jellyfin, nextcloud, navidrome, or filesrv.
  Files uploaded here will be served by filesrv automatically.

  Endpoints:
    POST   /upload   — upload files
    GET    /list     — list uploaded files
    DELETE /delete   — delete a file

  ============================================================
  `);
});
