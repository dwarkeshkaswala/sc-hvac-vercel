import { getServicesContent } from "@/lib/content";
import ServicesEditor from "./ServicesEditor";

export default async function ServicesAdminPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string }>;
}) {
  const data = await getServicesContent();
  const { saved } = await searchParams;

  return <ServicesEditor initial={data} saved={!!saved} />;
}
