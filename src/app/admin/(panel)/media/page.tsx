import { requireAdmin } from "@/lib/auth";
import MediaManager from "./MediaManager";

export const metadata = { title: "Media — Admin" };

export default async function MediaPage() {
  await requireAdmin();
  return <MediaManager />;
}
