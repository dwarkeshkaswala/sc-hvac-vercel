import { getNavbarContent } from "@/lib/content";
import NavbarEditor from "./NavbarEditor";

export default async function NavbarPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string }>;
}) {
  const data = await getNavbarContent();
  const { saved } = await searchParams;
  return <NavbarEditor initial={data} saved={!!saved} />;
}
