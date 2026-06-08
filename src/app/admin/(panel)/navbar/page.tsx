import { getNavbarContent } from "@/lib/content";
import NavbarEditor from "./NavbarEditor";

export default async function NavbarPage() {
  const data = await getNavbarContent();
  return <NavbarEditor initial={data} />;
}
