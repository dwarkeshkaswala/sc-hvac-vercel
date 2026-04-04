import { getContactContent, getContactSubmissions } from "@/lib/content";
import ContactEditor from "./ContactEditor";

export default async function ContactAdminPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string }>;
}) {
  const data = await getContactContent();
  const submissions = await getContactSubmissions();
  const { saved } = await searchParams;
  return <ContactEditor initial={data} saved={!!saved} submissions={submissions} />;
}
