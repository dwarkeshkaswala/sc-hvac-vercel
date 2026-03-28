import { getHeroContent } from "@/lib/content";
import { saveHeroAction } from "../actions";

export default async function HeroAdminPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string }>;
}) {
  const data = await getHeroContent();
  const { saved } = await searchParams;

  return (
    <div className="p-8 max-w-[700px]">
      <div className="mb-6">
        <h1 className="text-[22px] font-bold text-[#111111] tracking-[-0.02em]">Hero Section</h1>
        <p className="text-[13.5px] text-[#666] mt-1">Edit the homepage hero text, phone number, and stats.</p>
      </div>

      {saved && (
        <div className="mb-6 bg-green-50 border border-green-200 text-green-700 text-[13px] font-medium px-4 py-3 rounded-[12px]">
          ✓ Hero content saved successfully.
        </div>
      )}

      <form action={saveHeroAction} className="space-y-5">
        <Card title="Badge text">
          <Input name="badge" defaultValue={data.badge} placeholder="Surat's most trusted HVAC partner" />
        </Card>

        <Card title="Headline (3 lines)">
          <div className="space-y-3">
            <Input name="line1" defaultValue={data.line1} placeholder="Line 1" label="Line 1" />
            <Input name="line2" defaultValue={data.line2} placeholder="Line 2 (lighter colour)" label="Line 2 (lighter)" />
            <Input name="line3" defaultValue={data.line3} placeholder="Line 3" label="Line 3" />
          </div>
        </Card>

        <Card title="Subheadline">
          <Textarea name="subheadline" defaultValue={data.subheadline} rows={3} />
        </Card>

        <Card title="Phone number">
          <Input name="phone" defaultValue={data.phone} placeholder="+91 9054190245" />
        </Card>

        <Card title="Stats (4 items)">
          <div className="space-y-3">
            {data.stats.map((s, i) => (
              <div key={i} className="flex gap-3">
                <Input name={`stat_value_${i}`} defaultValue={s.value} placeholder="500+" label="Value" />
                <Input name={`stat_label_${i}`} defaultValue={s.label} placeholder="Projects Delivered" label="Label" />
              </div>
            ))}
          </div>
        </Card>

        <SaveButton />
      </form>
    </div>
  );
}

/* ── Shared form components ── */
function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-[16px] border border-[#E5E7EB] p-5">
      <p className="text-[12px] font-bold uppercase tracking-[0.06em] text-[#999] mb-4">{title}</p>
      {children}
    </div>
  );
}

function Input({ name, defaultValue, placeholder, label }: { name: string; defaultValue?: string; placeholder?: string; label?: string }) {
  return (
    <div className={label ? "flex-1 min-w-0" : ""}>
      {label && <p className="text-[11px] font-semibold text-[#999] mb-1.5">{label}</p>}
      <input
        type="text"
        name={name}
        defaultValue={defaultValue}
        placeholder={placeholder}
        className="w-full h-[40px] px-3.5 rounded-[10px] border border-[#E5E7EB] bg-[#FAFAFA]
          text-[13.5px] text-[#111] focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/10
          transition-all duration-200"
      />
    </div>
  );
}

function Textarea({ name, defaultValue, rows = 4 }: { name: string; defaultValue?: string; rows?: number }) {
  return (
    <textarea
      name={name}
      defaultValue={defaultValue}
      rows={rows}
      className="w-full px-3.5 py-3 rounded-[10px] border border-[#E5E7EB] bg-[#FAFAFA]
        text-[13.5px] text-[#111] leading-[1.7] resize-y
        focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/10
        transition-all duration-200"
    />
  );
}

function SaveButton() {
  return (
    <button
      type="submit"
      className="h-[44px] px-8 rounded-[12px] bg-[#111111] text-white text-[14px] font-semibold
        hover:bg-[#222] transition-all duration-200"
    >
      Save changes
    </button>
  );
}
