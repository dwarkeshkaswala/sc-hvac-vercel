import { requireAdmin } from "@/lib/auth";
import AdminNav from "./AdminNav";

export const metadata = { title: "Admin — Shreeji HVAC" };

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin();

  return (
    <div className="flex min-h-screen bg-[#F6F6F7] font-[var(--font-inter)]">
      <AdminNav />
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}
