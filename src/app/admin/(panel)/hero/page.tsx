import { getHeroContent } from "@/lib/content";
import HeroEditor from "./HeroEditor";

export default async function HeroAdminPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string }>;
}) {
  const data = await getHeroContent();
  const { saved } = await searchParams;
  return <HeroEditor initial={data} saved={!!saved} />;
}
