import Link from "next/link";
import Image from "next/image";

const footerLinks = {
  Services: ["Installation", "Repair", "AMC", "Consultancy"],
  Industries: ["Corporate", "Industrial", "Healthcare", "Education"],
  Company: ["About", "Projects", "Careers", "Contact"],
};

export default function Footer() {
  return (
    <footer className="border-t border-[var(--color-border)] pt-14 pb-8 mt-10">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr] gap-12 max-sm:gap-8 mb-12">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center shrink-0 mb-4">
              <Image
                src="/logo with contact.svg"
                alt="Shreeji HVAC & R Trading LLP"
                width={200}
                height={40}
                className="h-8 w-auto object-contain"
              />
            </Link>
            <p className="text-[13px] text-[var(--color-text-tertiary)] max-w-[260px] mt-3.5 leading-[1.65]">
              Professional climate control solutions engineered for Gujarat&apos;s commercial and industrial landscape.
            </p>
          </div>

          {/* Link Columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h5 className="font-[var(--font-display)] text-xs font-semibold uppercase tracking-[0.06em] text-[var(--color-text-primary)] mb-5">
                {title}
              </h5>
              <ul className="flex flex-col gap-3">
                {links.map((link) => (
                  <li key={link}>
                    <Link
                      href="#"
                      className="text-[13px] text-[var(--color-text-tertiary)] transition-colors duration-200 hover:text-[#0000B8]"
                    >
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="border-t border-[var(--color-border)] pt-6 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-[var(--color-text-tertiary)]">
          <span>© 2026 Shreeji HVAC. All rights reserved.</span>
          <div className="flex gap-5">
            <Link href="#" className="transition-colors hover:text-[#0000B8]">Privacy</Link>
            <Link href="#" className="transition-colors hover:text-[#0000B8]">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
