import AdminNav from "../AdminNav";
import AdminProviders from "./Providers";

export const metadata = { title: "Admin — Shreeji HVAC" };

export default function PanelLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-[#F7F7F8] font-[var(--font-inter)]">
      <AdminNav />
      <main className="flex-1 overflow-auto pt-14 md:pt-0 min-w-0">
        <AdminProviders>{children}</AdminProviders>
      </main>
    </div>
  );
}
