"use client";

import { deleteBlogPostAction } from "@/app/admin/actions";

export default function DeletePostButton({ slug, title }: { slug: string; title: string }) {
  return (
    <form
      action={deleteBlogPostAction.bind(null, slug)}
      onSubmit={(e) => {
        if (!confirm(`Delete "${title}"?`)) e.preventDefault();
      }}
    >
      <button
        type="submit"
        className="h-[32px] px-3 rounded-[8px] text-[12px] font-medium text-red-500 bg-red-50 hover:bg-red-100 transition-all"
      >
        Delete
      </button>
    </form>
  );
}
