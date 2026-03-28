import { getContactContent } from "@/lib/content";
import ContactEditor from "./ContactEditor";

export default async function ContactAdminPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string }>;
}) {
  const data = await getContactContent();
  const { saved } = await searchParams;
  return <ContactEditor initial={data} saved={!!saved} />;
}
