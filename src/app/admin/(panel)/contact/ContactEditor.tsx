"use client";

import { useEffect, useState, useTransition } from "react";
import type { ContactContent, ContactSubmission } from "@/lib/content";
import { saveContactDataAction, deleteContactSubmissionAction } from "@/app/admin/actions";
import { PreviewShell } from "../hero/HeroEditor";

interface Props {
  initial: ContactContent;
  saved: boolean;
  submissions: ContactSubmission[];
}

export default function ContactEditor({ initial, saved, submissions: initialSubs }: Props) {
  const [d, setD] = useState<ContactContent>(initial);
  const [msg, setMsg] = useState(saved ? "Saved!" : "");
  const [subs, setSubs] = useState<ContactSubmission[]>(initialSubs);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (!msg) return;
    const t = setTimeout(() => setMsg(""), 3000);
    return () => clearTimeout(t);
  }, [msg]);

  function set(k: keyof ContactContent, v: string) {
    setD((prev) => ({ ...prev, [k]: v }));
  }

  async function handleSave() {
    await saveContactDataAction(d);
    setMsg("Saved!");
  }

  function handleDelete(id: string) {
    startTransition(async () => {
      await deleteContactSubmissionAction(id);
      setSubs((prev) => prev.filter((s) => s.id !== id));
    });
  }

  const previewItems = [
    { label: "Phone", icon: "📞", value: d.phone, multiline: false },
    { label: "Email", icon: "✉️", value: d.email, multiline: false },
    { label: "Location", icon: "📍", value: d.address, multiline: true },
    { label: "Working Hours", icon: "🕐", value: d.hours, multiline: false },
  ];

  return (
    <div className="flex flex-col lg:flex-row flex-wrap gap-8 p-4 sm:p-8 items-start">
      {/* ─── Form ─── */}
      <div className="w-full lg:w-[460px] shrink-0 space-y-4">
        <div>
          <h1 className="text-[22px] font-bold text-[#111111] tracking-[-0.02em]">Contact Info</h1>
          <p className="text-[13.5px] text-[#666] mt-1">Update phone, email, address, and working hours.</p>
        </div>

        {msg && (
          <div className="bg-green-50 border border-green-200 text-green-700 text-[13px] font-medium px-4 py-3 rounded-[12px]">
            ✓ {msg}
          </div>
        )}

        <div className="bg-white rounded-[16px] border border-[#E5E7EB] p-6 space-y-4">
          {(
            [
              { key: "phone" as const, label: "Phone", placeholder: "+91 9054190245" },
              { key: "email" as const, label: "Email", placeholder: "info@shreejihvac.com" },
              { key: "hours" as const, label: "Working Hours", placeholder: "Mon – Sat: 09:00 – 19:00" },
            ] as const
          ).map((f) => (
            <div key={f.key}>
              <label className="block text-[11px] font-bold uppercase tracking-[0.06em] text-[#999] mb-2">
                {f.label}
              </label>
              <input
                type="text"
                value={d[f.key]}
                placeholder={f.placeholder}
                onChange={(e) => set(f.key, e.target.value)}
                className="w-full h-[40px] px-3.5 rounded-[10px] border border-[#E5E7EB] bg-[#FAFAFA]
                  text-[13.5px] text-[#111] focus:outline-none focus:border-[#0000B8] focus:ring-2 focus:ring-[#0000B8]/10 transition-all"
              />
            </div>
          ))}

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-[0.06em] text-[#999] mb-2">
              Address
            </label>
            <textarea
              value={d.address}
              rows={3}
              placeholder={"Street\nCity, State Pincode"}
              onChange={(e) => set("address", e.target.value)}
              className="w-full px-3.5 py-3 rounded-[10px] border border-[#E5E7EB] bg-[#FAFAFA]
                text-[13.5px] text-[#111] leading-[1.7] resize-y
                focus:outline-none focus:border-[#0000B8] focus:ring-2 focus:ring-[#0000B8]/10 transition-all"
            />
          </div>

          <button
            onClick={handleSave}
            className="h-[44px] px-8 rounded-[12px] bg-[#111111] text-white text-[14px] font-semibold hover:bg-[#222] transition-all"
          >
            Save changes
          </button>
        </div>
      </div>

      {/* ─── Preview ─── */}
      <div className="flex-1 lg:sticky lg:top-8">
        <PreviewShell label="shreejihvac.com · Contact">
          <div className="p-6 bg-[#FAFAFA]">
            <p className="text-[9px] font-semibold uppercase tracking-[0.09em] text-[#999] mb-2">
              Get in touch
            </p>
            <h2 className="text-[20px] font-bold tracking-[-0.025em] text-[#111] leading-snug mb-6">
              Let&apos;s solve your
              <br />
              climate challenge.
            </h2>

            <div className="space-y-4">
              {previewItems.map((item) => (
                <div key={item.label} className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-[6px] bg-white border border-[#E5E7EB] flex items-center justify-center text-[14px] shrink-0 shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
                    {item.icon}
                  </div>
                  <div>
                    <p className="text-[9px] uppercase tracking-[0.06em] text-[#999] mb-0.5">
                      {item.label}
                    </p>
                    {item.multiline ? (
                      <p className="text-[12px] text-[#111] font-medium whitespace-pre-line leading-[1.6]">
                        {item.value || <span className="italic text-[#CCCCCC]">—</span>}
                      </p>
                    ) : (
                      <p className="text-[12px] text-[#111] font-medium">
                        {item.value || <span className="italic text-[#CCCCCC]">—</span>}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Mock form hint */}
            <div className="mt-6 pt-5 border-t border-[#E5E7EB]">
              <p className="text-[9px] uppercase tracking-[0.06em] text-[#CCC] mb-3 font-semibold">
                Contact form (static)
              </p>
              <div className="grid grid-cols-2 gap-2">
                {["Name", "Email *"].map((l) => (
                  <div key={l} className="h-8 rounded-[8px] bg-white border border-[#E5E7EB] px-3 flex items-center">
                    <span className="text-[10px] text-[#CCCCCC]">{l}</span>
                  </div>
                ))}
              </div>
              <div className="mt-2 h-8 rounded-[8px] bg-white border border-[#E5E7EB] px-3 flex items-center">
                <span className="text-[10px] text-[#CCCCCC]">Phone (optional)</span>
              </div>
              <div className="mt-2 h-8 rounded-[8px] bg-white border border-[#E5E7EB] px-3 flex items-center">
                <span className="text-[10px] text-[#CCCCCC]">Service type</span>
              </div>
              <div className="mt-2 h-[52px] rounded-[8px] bg-white border border-[#E5E7EB] px-3 flex items-start pt-2">
                <span className="text-[10px] text-[#CCCCCC]">Message…</span>
              </div>
              <div className="mt-2 h-8 rounded-full bg-[#111] flex items-center justify-center">
                <span className="text-[10px] text-white font-medium">Send Request →</span>
              </div>
            </div>
          </div>
        </PreviewShell>
      </div>

      {/* ─── Submissions ─── */}
      <div className="w-full lg:col-span-2 mt-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-[22px] font-bold text-[#111111] tracking-[-0.02em]">Contact Submissions</h2>
            <p className="text-[13.5px] text-[#666] mt-1">
              {subs.length} {subs.length === 1 ? "inquiry" : "inquiries"} received
            </p>
          </div>
        </div>

        {subs.length === 0 ? (
          <div className="bg-white rounded-[16px] border border-[#E5E7EB] p-8 text-center">
            <p className="text-[14px] text-[#999]">No submissions yet. They&apos;ll appear here when visitors fill out the contact form.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {subs.map((s) => (
              <div key={s.id} className="bg-white rounded-[16px] border border-[#E5E7EB] p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 flex-wrap mb-2">
                      <h3 className="text-[15px] font-semibold text-[#111]">{s.name}</h3>
                      <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-[#F3F4F6] text-[#666] font-medium">
                        {s.service}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-[12.5px] text-[#666] mb-3">
                      <a href={`mailto:${s.email}`} className="text-[#0000B8] hover:underline">{s.email}</a>
                      {s.phone && (
                        <>
                          <span className="text-[#DDD]">·</span>
                          <a href={`tel:${s.phone}`} className="hover:underline">{s.phone}</a>
                        </>
                      )}
                      <span className="text-[#DDD]">·</span>
                      <time className="text-[#999]">
                        {new Date(s.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric", month: "short", year: "numeric",
                          hour: "2-digit", minute: "2-digit",
                        })}
                      </time>
                    </div>
                    <p className="text-[13.5px] text-[#444] leading-[1.7] whitespace-pre-line">{s.message}</p>
                  </div>
                  <button
                    onClick={() => handleDelete(s.id)}
                    disabled={isPending}
                    title="Delete submission"
                    className="shrink-0 w-8 h-8 rounded-[8px] hover:bg-red-50 flex items-center justify-center text-[#CCC] hover:text-red-500 transition-colors disabled:opacity-40"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
