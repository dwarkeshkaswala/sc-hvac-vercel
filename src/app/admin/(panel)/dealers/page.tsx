import { getDealersContent } from "@/lib/content";
import DealersEditor from "./DealersEditor";

export default async function DealersPage() {
  const data = await getDealersContent();
  return <DealersEditor initial={data} />;
}
