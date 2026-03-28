import { getBlogPost } from "@/lib/content";
import { notFound } from "next/navigation";
import BlogPostForm from "../BlogPostForm";

export default async function EditBlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getBlogPost(slug);

  if (!post) notFound();

  return <BlogPostForm initial={post} />;
}
