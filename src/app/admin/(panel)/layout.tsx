import AdminNav from "../AdminNav";

export const metadata = { title: "Admin — Shreeji HVAC" };

export default function PanelLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-[#F6F6F7] font-[var(--font-inter)]">
      <AdminNav />
      <main className="flex-1 overflow-auto pt-14 md:pt-0">{children}</main>
    </div>
  );
}
