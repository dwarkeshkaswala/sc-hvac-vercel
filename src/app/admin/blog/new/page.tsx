import BlogPostForm from "../BlogPostForm";
import type { BlogPost } from "@/lib/blog";

const empty: BlogPost = {
  slug: "",
  tag: "",
  date: new Date().toISOString().slice(0, 10),
  title: "",
  excerpt: "",
  image: "",
  readTime: "5 min read",
  author: { name: "", role: "" },
  content: [],
};

export default function NewBlogPostPage() {
  return <BlogPostForm initial={empty} isNew />;
}
