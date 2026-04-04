"use client";

import { useRef, useState } from "react";
import { useInView } from "@/hooks/useInView";
import type { ContactContent } from "@/lib/content";
import { defaultContact } from "@/lib/content";
import { submitContactFormAction } from "@/app/admin/actions";

const serviceOptions = [
  "New Installation",
  "Repair & Service",
  "AMC Inquiry",
  "Consultancy",
  "Parts / Supply",
];

export default function Contact({ data }: { data?: ContactContent }) {
  const d = data ?? defaultContact;

  const [formState, setFormState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const formRef = useRef<HTMLFormElement>(null);

  const details = [
    {
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.362 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.338 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
        </svg>
      ),
      label: "Phone",
      value: d.phone,
    },
    {
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
        </svg>
      ),
      label: "Email",
      value: d.email,
    },
    {
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" />
        </svg>
      ),
      label: "Location",
      value: d.address,
      multiline: true,
    },
    {
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
        </svg>
      ),
      label: "Working Hours",
      value: d.hours,
    },
  ];

  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, 0.05);

  return (
    <section id="contact" className="py-20">
      <div className="max-w-[1200px] mx-auto px-6">
        <div
          ref={ref}
          className={`bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[20px] overflow-hidden
            ${inView ? "animate-fade-up" : "opacity-0"}`}
        >
          {/* Top: Info + Form */}
          <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* Left — Info */}
            <div className="p-14 max-md:p-8 flex flex-col justify-center">
              <span className="text-[11px] font-medium tracking-[0.08em] uppercase text-[var(--color-text-tertiary)] block mb-4">
                Get in touch
              </span>
              <h2 className="font-[var(--font-display)] text-[clamp(26px,3vw,34px)] font-bold tracking-[-0.025em] mb-3">
                Let&apos;s solve your
                <br />
                climate challenge.
              </h2>
              <p className="text-sm text-[var(--color-text-secondary)] leading-[1.7] mb-10">
                Whether it&apos;s a new installation, repair, or consultation — we respond within 2 hours during business days.
              </p>

              <div className="flex flex-col gap-6">
                {details.map((d) => (
                  <div key={d.label} className="flex items-start gap-3.5">
                    <div className="w-9 h-9 rounded-[6px] bg-[var(--color-surface-raised)] flex items-center justify-center shrink-0 text-[var(--color-text-secondary)]">
                      {d.icon}
                    </div>
                    <div>
                      <span className="block text-[11px] text-[var(--color-text-tertiary)] uppercase tracking-[0.06em] mb-0.5">
                        {d.label}
                      </span>
                      {d.multiline ? (
                        <p className="text-sm text-[var(--color-text-primary)] font-medium whitespace-pre-line">{d.value}</p>
                      ) : (
                        <p className="text-sm text-[var(--color-text-primary)] font-medium">{d.value}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — Form */}
            <div className="p-14 max-md:p-8 bg-[var(--color-surface-raised)] border-t lg:border-t-0 lg:border-l border-[var(--color-border)]">
              {formState === "sent" ? (
                <div className="flex flex-col items-center justify-center text-center py-10 gap-4">
                  <div className="w-14 h-14 rounded-full bg-green-50 flex items-center justify-center">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 6 9 17l-5-5" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-[var(--color-text-primary)] mb-1">Request sent!</h3>
                    <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
                      We&apos;ll get back to you within 2 hours during business days.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => { setFormState("idle"); formRef.current?.reset(); }}
                    className="mt-2 text-[13px] text-[#0000B8] font-medium hover:underline cursor-pointer"
                  >
                    Send another request
                  </button>
                </div>
              ) : (
              <form
                ref={formRef}
                onSubmit={async (e) => {
                  e.preventDefault();
                  setFormState("sending");
                  setErrorMsg("");
                  const fd = new FormData(e.currentTarget);
                  const result = await submitContactFormAction({
                    name: String(fd.get("name") ?? ""),
                    email: String(fd.get("email") ?? ""),
                    phone: String(fd.get("phone") ?? ""),
                    service: String(fd.get("service") ?? ""),
                    message: String(fd.get("message") ?? ""),
                  });
                  if (result.ok) {
                    setFormState("sent");
                  } else {
                    setFormState("error");
                    setErrorMsg(result.error ?? "Something went wrong. Please try again.");
                  }
                }}
              >
                {formState === "error" && (
                  <div className="mb-4 px-4 py-3 rounded-[10px] bg-red-50 border border-red-200 text-red-700 text-[13px]">
                    {errorMsg}
                  </div>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField name="name" label="Name" type="text" placeholder="Your name" required />
                  <FormField name="email" label="Email *" type="email" placeholder="you@company.com" required />
                  <FormField name="phone" label="Phone" type="tel" placeholder="+91" />
                  <div className="sm:col-span-2 sm:col-start-1">
                    <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1.5">Service Type</label>
                    <select
                      name="service"
                      required
                      defaultValue=""
                      className="w-full px-3.5 py-3 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[10px] text-[13px] text-[var(--color-text-primary)] transition-all duration-250 ease-[var(--ease)] focus:outline-none focus:border-[#FF7F00] focus:ring-[3px] focus:ring-[rgba(255,127,0,0.10)] appearance-none bg-[url('data:image/svg+xml;utf8,<svg%20xmlns=%22http://www.w3.org/2000/svg%22%20width=%2214%22%20height=%2214%22%20viewBox=%220%200%2024%2024%22%20fill=%22none%22%20stroke=%22%23a3a3a3%22%20stroke-width=%222%22%20stroke-linecap=%22round%22%20stroke-linejoin=%22round%22><path%20d=%22M6%209l6%206%206-6%22/></svg>')] bg-no-repeat bg-[right_12px_center] pr-9 cursor-pointer"
                    >
                      <option value="" disabled>Select a service</option>
                      {serviceOptions.map((o) => (
                        <option key={o}>{o}</option>
                      ))}
                    </select>
                  </div>
                  <div className="sm:col-span-2">
                    <FormField name="message" label="Message" type="textarea" placeholder="Tell us about your requirement..." required />
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={formState === "sending"}
                  className="w-full mt-5 inline-flex items-center justify-center gap-2 h-11 rounded-full bg-[#0000B8] text-white text-[13px] font-medium transition-all duration-400 ease-[var(--ease)] hover:bg-[#FF7F00] hover:-translate-y-px hover:shadow-[0_4px_20px_rgba(255,127,0,0.3)] cursor-pointer disabled:opacity-60 disabled:pointer-events-none"
                >
                  {formState === "sending" ? (
                    <>Sending…</>
                  ) : (
                    <>Send Request <span>→</span></>
                  )}
                </button>
                <p className="text-[11px] text-[var(--color-text-tertiary)] mt-3.5 text-center leading-snug">
                  By submitting, you agree to the processing of your personal data.
                </p>
              </form>
              )}
            </div>
          </div>

          {/* Google Map */}
          <div className="h-[280px] border-t border-[var(--color-border)] overflow-hidden">
            <iframe
              title="Shreeji HVAC location"
              src="https://maps.google.com/maps?q=Shreeji%20HVAC%2FR%20Trading%20LLP&z=15&hl=en&t=m&output=embed&iwloc=near"
              width="100%"
              height="100%"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full h-full border-0"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function FormField({ name, label, type, placeholder, required }: { name: string; label: string; type: string; placeholder: string; required?: boolean }) {
  const baseClass =
    "w-full px-3.5 py-3 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[10px] text-[13px] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-tertiary)] transition-all duration-250 ease-[var(--ease)] focus:outline-none focus:border-[#FF7F00] focus:ring-[3px] focus:ring-[rgba(255,127,0,0.10)]";

  return (
    <div>
      <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1.5">{label}</label>
      {type === "textarea" ? (
        <textarea name={name} rows={4} placeholder={placeholder} required={required} className={baseClass} />
      ) : (
        <input name={name} type={type} placeholder={placeholder} required={required} className={baseClass} />
      )}
    </div>
  );
}
