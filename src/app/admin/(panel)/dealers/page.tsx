import { getDealersContent } from "@/lib/content";
import DealersEditor from "./DealersEditor";

export default async function DealersPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string }>;
}) {
  const data = await getDealersContent();
  const { saved } = await searchParams;
  return <DealersEditor initial={data} saved={!!saved} />;
}
