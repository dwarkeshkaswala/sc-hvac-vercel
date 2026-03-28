"use client";

import { useEffect, useState } from "react";
import type { BlogPost, ContentBlock } from "@/lib/blog";
import { saveBlogPostAction } from "@/app/admin/actions";

interface Props {
  initial: BlogPost;
  isNew?: boolean;
}

const BLOCK_TYPES: ContentBlock["type"][] = ["paragraph", "heading", "subheading", "list", "tip"];

export default function BlogPostForm({ initial, isNew }: Props) {
  const [post, setPost] = useState<BlogPost>(initial);
  const [msg, setMsg] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!msg) return;
    const t = setTimeout(() => setMsg(""), 3500);
    return () => clearTimeout(t);
  }, [msg]);

  const set = (field: keyof BlogPost, val: unknown) =>
    setPost((p) => ({ ...p, [field]: val }));

  const setAuthor = (field: "name" | "role", val: string) =>
    setPost((p) => ({ ...p, author: { ...p.author, [field]: val } }));

  // Blocks
  const updateBlock = (i: number, update: Partial<ContentBlock>) =>
    setPost((p) => {
      const content = [...p.content];
      content[i] = { ...content[i], ...update } as ContentBlock;
      return { ...p, content };
    });

  const addBlock = (type: ContentBlock["type"]) => {
    const blank: ContentBlock =
      type === "list" ? { type, items: [""] } :
      type === "tip"  ? { type, label: "Pro Tip", text: "" } :
      { type, text: "" } as ContentBlock;
    setPost((p) => ({ ...p, content: [...p.content, blank] }));
  };

  const removeBlock = (i: number) =>
    setPost((p) => ({ ...p, content: p.content.filter((_, idx) => idx !== i) }));

  const moveBlock = (i: number, dir: -1 | 1) => {
    setPost((p) => {
      const c = [...p.content];
      const j = i + dir;
      if (j < 0 || j >= c.length) return p;
      [c[i], c[j]] = [c[j], c[i]];
      return { ...p, content: c };
    });
  };

  const updateListItem = (bi: number, ii: number, val: string) =>
    setPost((p) => {
      const content = [...p.content];
      const b = content[bi] as { type: "list"; items: string[] };
      const items = [...b.items];
      items[ii] = val;
      content[bi] = { ...b, items };
      return { ...p, content };
    });

  const addListItem = (bi: number) =>
    setPost((p) => {
      const content = [...p.content];
      const b = content[bi] as { type: "list"; items: string[] };
      content[bi] = { ...b, items: [...b.items, ""] };
      return { ...p, content };
    });

  const removeListItem = (bi: number, ii: number) =>
    setPost((p) => {
      const content = [...p.content];
      const b = content[bi] as { type: "list"; items: string[] };
      content[bi] = { ...b, items: b.items.filter((_, i) => i !== ii) };
      return { ...p, content };
    });

  async function handleSave() {
    if (!post.slug || !post.title) {
      setMsg("Slug and title are required.");
      return;
    }
    setSaving(true);
    try {
      await saveBlogPostAction(post);
      setMsg("Saved!");
    } catch {
      setMsg("Error saving post.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="p-8 max-w-[760px]">
      <div className="mb-6">
        <h1 className="text-[22px] font-bold text-[#111111] tracking-[-0.02em]">
          {isNew ? "New Blog Post" : "Edit Post"}
        </h1>
        <p className="text-[13.5px] text-[#666] mt-1">
          {isNew ? "Create a new article." : `Editing: ${initial.slug}`}
        </p>
      </div>

      {msg && (
        <div className={`mb-6 text-[13px] font-medium px-4 py-3 rounded-[12px] ${
          msg === "Saved!"
            ? "bg-green-50 border border-green-200 text-green-700"
            : "bg-red-50 border border-red-200 text-red-600"
        }`}>
          {msg === "Saved!" ? "✓ " : "⚠ "}{msg}
        </div>
      )}

      {/* Meta */}
      <section className="bg-white rounded-[16px] border border-[#E5E7EB] p-6 mb-4 space-y-3">
        <h2 className="text-[11px] font-bold uppercase tracking-[0.06em] text-[#999] mb-2">Metadata</h2>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={lbl}>Slug (URL)</label>
            <input className={inp} placeholder="my-post-title" value={post.slug}
              onChange={(e) => set("slug", e.target.value.toLowerCase().replace(/\s+/g, "-"))}
              readOnly={!isNew}
              style={!isNew ? { opacity: 0.6, cursor: "not-allowed" } : {}}
            />
          </div>
          <div>
            <label className={lbl}>Tag</label>
            <input className={inp} placeholder="Maintenance" value={post.tag} onChange={(e) => set("tag", e.target.value)} />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={lbl}>Date</label>
            <input className={inp} type="date" value={post.date} onChange={(e) => set("date", e.target.value)} />
          </div>
          <div>
            <label className={lbl}>Read time</label>
            <input className={inp} placeholder="5 min read" value={post.readTime} onChange={(e) => set("readTime", e.target.value)} />
          </div>
        </div>
        <div>
          <label className={lbl}>Title</label>
          <input className={inp} placeholder="Article title" value={post.title} onChange={(e) => set("title", e.target.value)} />
        </div>
        <div>
          <label className={lbl}>Excerpt</label>
          <textarea className={ta} rows={2} placeholder="Short description shown in listing" value={post.excerpt} onChange={(e) => set("excerpt", e.target.value)} />
        </div>
        <div>
          <label className={lbl}>Cover image URL</label>
          <input className={inp} placeholder="https://..." value={post.image} onChange={(e) => set("image", e.target.value)} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={lbl}>Author name</label>
            <input className={inp} placeholder="Name" value={post.author.name} onChange={(e) => setAuthor("name", e.target.value)} />
          </div>
          <div>
            <label className={lbl}>Author role</label>
            <input className={inp} placeholder="Lead Engineer" value={post.author.role} onChange={(e) => setAuthor("role", e.target.value)} />
          </div>
        </div>
      </section>

      {/* Content blocks */}
      <section className="bg-white rounded-[16px] border border-[#E5E7EB] p-6 mb-4">
        <h2 className="text-[11px] font-bold uppercase tracking-[0.06em] text-[#999] mb-4">Content Blocks</h2>
        <div className="space-y-3 mb-4">
          {post.content.map((block, i) => (
            <div key={i} className="border border-[#E5E7EB] rounded-[12px] p-3.5 group">
              <div className="flex items-center justify-between mb-2.5">
                <span className="text-[10px] font-bold uppercase tracking-[0.07em] text-[#2563EB] bg-blue-50 px-2 py-0.5 rounded-full">
                  {block.type}
                </span>
                <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => moveBlock(i, -1)} className={ctrl} title="Move up">↑</button>
                  <button onClick={() => moveBlock(i, 1)}  className={ctrl} title="Move down">↓</button>
                  <button onClick={() => removeBlock(i)} className={`${ctrl} hover:text-red-500`} title="Remove">×</button>
                </div>
              </div>

              {block.type === "paragraph" && (
                <textarea className={ta} rows={4} value={block.text}
                  onChange={(e) => updateBlock(i, { text: e.target.value } as Partial<ContentBlock>)} />
              )}
              {(block.type === "heading" || block.type === "subheading") && (
                <input className={inp} value={block.text}
                  onChange={(e) => updateBlock(i, { text: e.target.value } as Partial<ContentBlock>)} />
              )}
              {block.type === "list" && (
                <div className="space-y-2">
                  {block.items.map((item, ii) => (
                    <div key={ii} className="flex gap-2 group/item">
                      <input className={`${inp} flex-1`} value={item}
                        onChange={(e) => updateListItem(i, ii, e.target.value)} />
                      <button onClick={() => removeListItem(i, ii)}
                        className="text-[#ccc] hover:text-red-400 text-[18px] leading-none opacity-0 group-hover/item:opacity-100 transition-opacity">×</button>
                    </div>
                  ))}
                  <button onClick={() => addListItem(i)}
                    className="text-[12px] font-semibold text-[#2563EB] hover:text-[#1d4ed8] transition-colors">
                    + Add item
                  </button>
                </div>
              )}
              {block.type === "tip" && (
                <div className="space-y-2">
                  <input className={inp} placeholder="Label (e.g. Pro Tip)" value={block.label}
                    onChange={(e) => updateBlock(i, { label: e.target.value } as Partial<ContentBlock>)} />
                  <textarea className={ta} rows={2} placeholder="Tip text" value={block.text}
                    onChange={(e) => updateBlock(i, { text: e.target.value } as Partial<ContentBlock>)} />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Add block buttons */}
        <div className="flex flex-wrap gap-2">
          {BLOCK_TYPES.map((t) => (
            <button key={t} onClick={() => addBlock(t)}
              className="h-[30px] px-3 rounded-[8px] text-[11px] font-semibold text-[#555] border border-[#E5E7EB] bg-[#FAFAFA] hover:border-[#2563EB] hover:text-[#2563EB] transition-all">
              + {t}
            </button>
          ))}
        </div>
      </section>

      <button
        onClick={handleSave}
        disabled={saving}
        className="h-[44px] px-8 rounded-[12px] bg-[#111111] text-white text-[14px] font-semibold hover:bg-[#222] transition-all disabled:opacity-60"
      >
        {saving ? "Saving…" : isNew ? "Publish post" : "Save changes"}
      </button>
    </div>
  );
}

const inp  = "h-[40px] px-3.5 rounded-[10px] border border-[#E5E7EB] bg-[#FAFAFA] text-[13.5px] text-[#111] w-full focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/10 transition-all";
const ta   = "w-full px-3.5 py-2.5 rounded-[10px] border border-[#E5E7EB] bg-[#FAFAFA] text-[13.5px] text-[#111] leading-[1.7] resize-y focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/10 transition-all";
const lbl  = "block text-[11px] font-bold uppercase tracking-[0.06em] text-[#999] mb-1.5";
const ctrl = "w-[24px] h-[24px] rounded-[6px] text-[#999] hover:bg-[#F3F4F6] flex items-center justify-center text-[14px] font-bold transition-colors";
