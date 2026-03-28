import { getTrustContent } from "@/lib/content";
import TrustEditor from "./TrustEditor";

export default async function TrustAdminPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string }>;
}) {
  const data = await getTrustContent();
  const { saved } = await searchParams;

  return <TrustEditor initial={data} saved={!!saved} />;
}
