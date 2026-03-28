import { getContactContent } from "@/lib/content";
import { saveContactAction } from "@/app/admin/actions";

export default async function ContactAdminPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string }>;
}) {
  const data = await getContactContent();
  const { saved } = await searchParams;

  return (
    <div className="p-8 max-w-[600px]">
      <div className="mb-6">
        <h1 className="text-[22px] font-bold text-[#111111] tracking-[-0.02em]">Contact Info</h1>
        <p className="text-[13.5px] text-[#666] mt-1">Update phone, email, address, and working hours.</p>
      </div>

      {saved && (
        <div className="mb-6 bg-green-50 border border-green-200 text-green-700 text-[13px] font-medium px-4 py-3 rounded-[12px]">
          ✓ Contact info saved successfully.
        </div>
      )}

      <form action={saveContactAction} className="bg-white rounded-[16px] border border-[#E5E7EB] p-6 space-y-4">
        {[
          { name: "phone", label: "Phone", defaultValue: data.phone, placeholder: "+91 9054190245" },
          { name: "email", label: "Email", defaultValue: data.email, placeholder: "info@shreejihvac.com" },
          { name: "hours", label: "Working Hours", defaultValue: data.hours, placeholder: "Mon – Sat: 09:00 – 19:00" },
        ].map((f) => (
          <div key={f.name}>
            <label className="block text-[11px] font-bold uppercase tracking-[0.06em] text-[#999] mb-2">{f.label}</label>
            <input
              type="text"
              name={f.name}
              defaultValue={f.defaultValue}
              placeholder={f.placeholder}
              className="w-full h-[40px] px-3.5 rounded-[10px] border border-[#E5E7EB] bg-[#FAFAFA]
                text-[13.5px] text-[#111] focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/10 transition-all"
            />
          </div>
        ))}

        <div>
          <label className="block text-[11px] font-bold uppercase tracking-[0.06em] text-[#999] mb-2">Address</label>
          <textarea
            name="address"
            defaultValue={data.address}
            rows={3}
            placeholder="Street&#10;City, State Pincode"
            className="w-full px-3.5 py-3 rounded-[10px] border border-[#E5E7EB] bg-[#FAFAFA]
              text-[13.5px] text-[#111] leading-[1.7] resize-y
              focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/10 transition-all"
          />
        </div>

        <button
          type="submit"
          className="h-[44px] px-8 rounded-[12px] bg-[#111111] text-white text-[14px] font-semibold hover:bg-[#222] transition-all"
        >
          Save changes
        </button>
      </form>
    </div>
  );
}
