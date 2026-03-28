import { getBlogPosts } from "@/lib/content";
import DeletePostButton from "./DeletePostButton";
import Link from "next/link";

export default async function BlogAdminPage() {
  const posts = await getBlogPosts();

  return (
    <div className="p-8 max-w-[760px]">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-[22px] font-bold text-[#111111] tracking-[-0.02em]">Blog Posts</h1>
          <p className="text-[13.5px] text-[#666] mt-1">{posts.length} {posts.length === 1 ? "post" : "posts"} published.</p>
        </div>
        <Link
          href="/admin/blog/new"
          className="h-[38px] px-5 rounded-[10px] bg-[#2563EB] text-white text-[13px] font-semibold hover:bg-[#1d4ed8] transition-all inline-flex items-center"
        >
          + New post
        </Link>
      </div>

      {posts.length === 0 ? (
        <div className="bg-white rounded-[16px] border border-[#E5E7EB] p-10 text-center text-[14px] text-[#999]">
          No posts yet. Create your first one above.
        </div>
      ) : (
        <div className="space-y-3">
          {posts.map((post) => (
            <div key={post.slug} className="bg-white rounded-[16px] border border-[#E5E7EB] p-4 flex items-center gap-4">
              {post.image && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={post.image}
                  alt=""
                  className="w-[72px] h-[48px] rounded-[8px] object-cover shrink-0 bg-[#F3F4F6]"
                />
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-[10px] font-bold uppercase tracking-[0.08em] text-[#2563EB] bg-blue-50 px-2 py-0.5 rounded-full">
                    {post.tag}
                  </span>
                  <span className="text-[11px] text-[#999]">{post.date}</span>
                </div>
                <p className="text-[13.5px] font-semibold text-[#111] truncate">{post.title}</p>
                <p className="text-[12px] text-[#666] truncate">{post.excerpt}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Link
                  href={`/blog/${post.slug}`}
                  target="_blank"
                  className="h-[32px] px-3 rounded-[8px] text-[12px] font-medium text-[#666] border border-[#E5E7EB] hover:border-[#ccc] transition-all inline-flex items-center"
                >
                  View
                </Link>
                <Link
                  href={`/admin/blog/${post.slug}`}
                  className="h-[32px] px-3 rounded-[8px] text-[12px] font-medium text-[#111] bg-[#F3F4F6] hover:bg-[#E5E7EB] transition-all inline-flex items-center"
                >
                  Edit
                </Link>
                <DeletePostButton slug={post.slug} title={post.title} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
