"use client";

import { useEffect, useRef, useState } from "react";
import type { BlogPost, ContentBlock } from "@/lib/blog";
import { saveBlogPostAction } from "@/app/admin/actions";
import MediaPicker from "@/components/MediaPicker";
import { useToast, SaveButton, PageHeader, FormCard, UnsavedBanner, ConfirmDialog } from "../components/AdminUI";

interface Props {
  initial: BlogPost;
  isNew?: boolean;
}

const BLOCK_TYPES: ContentBlock["type"][] = ["paragraph", "heading", "subheading", "list", "tip"];

export default function BlogPostForm({ initial, isNew }: Props) {
  const [post, setPost] = useState<BlogPost>(initial);
  const { toast } = useToast();
  const initialRef = useRef(JSON.stringify(initial));
  const [dirty, setDirty] = useState(false);
  const [removeBlockIdx, setRemoveBlockIdx] = useState<number | null>(null);

  useEffect(() => {
    setDirty(JSON.stringify(post) !== initialRef.current);
  }, [post]);

  useEffect(() => {
    if (!dirty) return;
    const handler = (e: BeforeUnloadEvent) => { e.preventDefault(); };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [dirty]);

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
      toast("error", "Slug and title are required.");
      return;
    }
    await saveBlogPostAction(post);
    initialRef.current = JSON.stringify(post);
    setDirty(false);
    toast("success", isNew ? "Post published!" : "Post saved!");
  }

  return (
    <div className="p-4 sm:p-8 max-w-[760px] space-y-5">
      <PageHeader
        title={isNew ? "New Blog Post" : "Edit Post"}
        description={isNew ? "Create a new article." : `Editing: ${initial.slug}`}
        badge={dirty ? <span className="inline-flex items-center h-[22px] px-2.5 rounded-full text-[10px] font-semibold bg-amber-50 text-amber-600">Unsaved</span> : undefined}
      />

      {/* Meta */}
      <FormCard title="Metadata" description="Post details and SEO info">
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
          <MediaPicker
            value={post.image}
            onChange={(url) => set("image", url)}
            label="Cover Image"
            dimensions="1200 × 630"
            aspectRatio="1.91:1"
          />
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
      </FormCard>

      {/* Content blocks */}
      <FormCard title="Content Blocks" description="Build your article with structured content blocks">
        <div className="space-y-3 mb-4">
          {post.content.map((block, i) => (
            <div key={i} className="border border-[#E5E7EB] rounded-[12px] p-3.5 group">
              <div className="flex items-center justify-between mb-2.5">
                <span className="text-[10px] font-bold uppercase tracking-[0.07em] text-[#0000B8] bg-[#0000B8]/8 px-2 py-0.5 rounded-full">
                  {block.type}
                </span>
                <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => moveBlock(i, -1)} className={ctrl} title="Move up">↑</button>
                  <button onClick={() => moveBlock(i, 1)}  className={ctrl} title="Move down">↓</button>
                  <button onClick={() => setRemoveBlockIdx(i)} className={`${ctrl} hover:text-red-500 hover:bg-red-50`} title="Remove">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" /></svg>
                  </button>
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
                        className="w-[42px] h-[42px] flex items-center justify-center rounded-[8px] text-[#CCC] hover:text-red-500 hover:bg-red-50 transition-all opacity-0 group-hover/item:opacity-100">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" /></svg>
                      </button>
                    </div>
                  ))}
                  <button onClick={() => addListItem(i)}
                    className="text-[12px] font-semibold text-[#0000B8] hover:text-[#000096] transition-colors">
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
              className="h-[30px] px-3 rounded-[8px] text-[11px] font-semibold text-[#555] border border-[#E5E7EB] bg-[#FAFAFA] hover:border-[#0000B8] hover:text-[#0000B8] transition-all">
              + {t}
            </button>
          ))}
        </div>
      </FormCard>

      <SaveButton
        onClick={handleSave}
        label={isNew ? "Publish post" : "Save changes"}
        hasChanges={dirty}
      />

      {/* Unsaved changes banner */}
      <UnsavedBanner
        show={dirty}
        onSave={handleSave}
        onDiscard={() => setPost(JSON.parse(initialRef.current))}
      />

      {/* Block remove confirmation */}
      <ConfirmDialog
        open={removeBlockIdx !== null}
        title="Remove block?"
        message="This content block will be removed. You can undo by not saving."
        confirmLabel="Remove"
        confirmVariant="danger"
        onConfirm={() => {
          if (removeBlockIdx !== null) removeBlock(removeBlockIdx);
          setRemoveBlockIdx(null);
        }}
        onCancel={() => setRemoveBlockIdx(null)}
      />
    </div>
  );
}

const inp  = "h-[42px] px-3.5 rounded-[10px] border border-[#E5E7EB] bg-[#FAFAFA] text-[13.5px] text-[#111] placeholder:text-[#CCC] w-full focus:outline-none focus:border-[#0000B8] focus:ring-2 focus:ring-[#0000B8]/10 hover:border-[#D0D0D0] transition-all";
const ta   = "w-full px-3.5 py-2.5 rounded-[10px] border border-[#E5E7EB] bg-[#FAFAFA] text-[13.5px] text-[#111] placeholder:text-[#CCC] leading-[1.7] resize-y focus:outline-none focus:border-[#0000B8] focus:ring-2 focus:ring-[#0000B8]/10 hover:border-[#D0D0D0] transition-all";
const lbl  = "block text-[11.5px] font-semibold text-[#666] mb-1.5";
const ctrl = "w-[26px] h-[26px] rounded-[6px] text-[#999] hover:bg-[#F3F4F6] flex items-center justify-center text-[14px] font-bold transition-all";
