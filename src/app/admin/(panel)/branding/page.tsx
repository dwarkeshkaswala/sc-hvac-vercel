import { requireAdmin } from "@/lib/auth";
import { getBrandingContent } from "@/lib/content";
import BrandingEditor from "./BrandingEditor";

export const metadata = { title: "Branding — Admin" };

export default async function BrandingPage({ searchParams }: { searchParams: Promise<{ saved?: string }> }) {
  await requireAdmin();
  const branding = await getBrandingContent();
  const { saved } = await searchParams;
  return <BrandingEditor initial={branding} saved={saved === "1"} />;
}
