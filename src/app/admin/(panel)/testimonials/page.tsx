import { getTestimonialsContent } from "@/lib/content";
import TestimonialsEditor from "./TestimonialsEditor";

export default async function TestimonialsAdminPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string }>;
}) {
  const data = await getTestimonialsContent();
  const { saved } = await searchParams;

  return <TestimonialsEditor initial={data} saved={!!saved} />;
}
