"use client";

import { useState, useMemo, useCallback, type ReactNode } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

/* ── Constants ────────────────────────────────────────────── */

const CITIES: Record<string, { temp: number; rh: number }> = {
  "Surat":       { temp: 43, rh: 60 },
  "Ahmedabad":   { temp: 44, rh: 45 },
  "Mumbai":      { temp: 38, rh: 75 },
  "Delhi":       { temp: 46, rh: 50 },
  "Bangalore":   { temp: 36, rh: 55 },
  "Chennai":     { temp: 42, rh: 70 },
  "Hyderabad":   { temp: 42, rh: 50 },
  "Pune":        { temp: 40, rh: 50 },
  "Kolkata":     { temp: 40, rh: 70 },
  "Jaipur":      { temp: 45, rh: 35 },
  "Vadodara":    { temp: 44, rh: 50 },
  "Rajkot":      { temp: 43, rh: 45 },
  "Custom":      { temp: 43, rh: 55 },
};

// U-values in W/m²·K
const WALL_U: Record<string, number> = {
  "Brick (230mm uninsulated)": 2.3,
  "Brick + plaster (well-built)": 1.8,
  "Brick + insulation": 0.7,
  "AAC block (200mm)": 0.9,
  "Concrete panel": 3.5,
  "Curtain wall (glass)": 5.5,
};

const ROOF_U: Record<string, number> = {
  "RCC slab (uninsulated)": 3.5,
  "RCC + waterproofing": 2.8,
  "RCC + insulation": 0.8,
  "Metal sheet (uninsulated)": 7.0,
  "Metal sheet + insulation": 1.2,
};

const GLASS_U: Record<string, { u: number; shgc: number }> = {
  "Single clear (6mm)":         { u: 5.8, shgc: 0.82 },
  "Single tinted":              { u: 5.7, shgc: 0.60 },
  "Double glazed (clear)":      { u: 2.8, shgc: 0.70 },
  "Double glazed (low-E)":      { u: 1.8, shgc: 0.42 },
  "Double glazed (reflective)": { u: 2.5, shgc: 0.25 },
};

const ORIENTATION_FACTOR: Record<string, number> = {
  North: 0.5,
  "North-East": 0.65,
  East: 0.85,
  "South-East": 0.90,
  South: 0.75,
  "South-West": 1.0,
  West: 0.95,
  "North-West": 0.70,
};

/* Lucide-style SVG icon helper */
const _ic = (w: number, c: ReactNode) => (
  <svg width={w} height={w} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">{c}</svg>
);

const SPACE_TYPES: Record<string, { people: number; lights: number; equip: number; ventCfm: number; label: string; icon: ReactNode }> = {
  office:      { people: 10, lights: 12,  equip: 15,  ventCfm: 20, label: "Office",
    icon: _ic(22, <><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></>) },
  retail:      { people: 7,  lights: 18,  equip: 5,   ventCfm: 15, label: "Retail",
    icon: _ic(22, <><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></>) },
  restaurant:  { people: 7,  lights: 14,  equip: 30,  ventCfm: 20, label: "Restaurant",
    icon: _ic(22, <><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3zm0 0v7"/></>) },
  hospital:    { people: 10, lights: 15,  equip: 20,  ventCfm: 25, label: "Hospital",
    icon: _ic(22, <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>) },
  hotel:       { people: 25, lights: 10,  equip: 5,   ventCfm: 15, label: "Hotel",
    icon: _ic(22, <><path d="M2 4v16"/><path d="M2 8h18a2 2 0 0 1 2 2v10"/><path d="M2 17h20"/><path d="M6 8v9"/></>) },
  server:      { people: 30, lights: 10,  equip: 200, ventCfm: 20, label: "Server Room",
    icon: _ic(22, <><rect x="2" y="2" width="20" height="8" rx="2"/><rect x="2" y="14" width="20" height="8" rx="2"/><path d="M6 6h.01"/><path d="M6 18h.01"/></>) },
  warehouse:   { people: 50, lights: 8,   equip: 5,   ventCfm: 10, label: "Warehouse",
    icon: _ic(22, <><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 2 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 22 16V8z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></>) },
  residential: { people: 15, lights: 8,   equip: 8,   ventCfm: 15, label: "Home",
    icon: _ic(22, <><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><path d="M9 22V12h6v10"/></>) },
  custom:      { people: 10, lights: 12,  equip: 15,  ventCfm: 20, label: "Custom",
    icon: _ic(22, <path d="M4 21v-7m0-4V3m8 18v-9m0-4V3m8 18v-5m0-4V3M2 14h4m4-6h4m4 8h4"/>) },
};

// Solar radiation on glass (peak, W/m² for India latitudes)
const SOLAR_RADIATION = 550;

// Comfort indoor conditions
const INDOOR_TEMP = 24; // °C
const INDOOR_RH = 50;   // %

/* ── Calculator Component ─────────────────────────────────── */

interface FormState {
  city: string;
  customTemp: number;
  customRh: number;
  spaceType: string;
  length: number;
  width: number;
  height: number;
  floors: number;
  wallType: string;
  roofType: string;
  roofExposed: boolean;
  glassType: string;
  windowPercent: number;
  orientation: string;
  occupants: number;
  lightingOverride: number | null;
  equipOverride: number | null;
  safetyFactor: number;
}

const defaults: FormState = {
  city: "Surat",
  customTemp: 43,
  customRh: 55,
  spaceType: "office",
  length: 20,
  width: 15,
  height: 3.5,
  floors: 1,
  wallType: "Brick + plaster (well-built)",
  roofType: "RCC + waterproofing",
  roofExposed: true,
  glassType: "Single tinted",
  windowPercent: 30,
  orientation: "West",
  occupants: 30,
  lightingOverride: null,
  equipOverride: null,
  safetyFactor: 10,
};

function calc(f: FormState) {
  const climate = f.city === "Custom" ? { temp: f.customTemp, rh: f.customRh } : CITIES[f.city];
  const outdoorTemp = climate.temp;
  const deltaT = outdoorTemp - INDOOR_TEMP;

  const floorArea = f.length * f.width; // m²
  const totalFloorArea = floorArea * f.floors;
  const perimeterWallArea = 2 * (f.length + f.width) * f.height * f.floors; // m²
  const windowArea = perimeterWallArea * (f.windowPercent / 100);
  const opaqueWallArea = perimeterWallArea - windowArea;
  const roofArea = f.roofExposed ? floorArea : 0;

  // ── Envelope loads (Watts) ──
  const wallU = WALL_U[f.wallType];
  const roofU = ROOF_U[f.roofType];
  const glass = GLASS_U[f.glassType];
  const orientFactor = ORIENTATION_FACTOR[f.orientation];

  const wallLoad = opaqueWallArea * wallU * deltaT;
  const roofLoad = roofArea * roofU * (deltaT + 8); // +8°C sol-air correction for roof
  const glassConduction = windowArea * glass.u * deltaT;
  const glassSolar = windowArea * glass.shgc * SOLAR_RADIATION * orientFactor * 0.65; // 0.65 = internal shade factor
  const envelopeTotal = wallLoad + roofLoad + glassConduction + glassSolar;

  // ── Internal loads (Watts) ──
  const st = SPACE_TYPES[f.spaceType];
  const sensiblePerPerson = 75; // W
  const latentPerPerson = 55;   // W
  const peopleSensible = f.occupants * sensiblePerPerson;
  const peopleLatent = f.occupants * latentPerPerson;

  const lightingW = f.lightingOverride !== null ? f.lightingOverride : (st.lights * totalFloorArea);
  const equipW = f.equipOverride !== null ? f.equipOverride : (st.equip * totalFloorArea);
  const internalTotal = peopleSensible + peopleLatent + lightingW + equipW;

  // ── Ventilation load (Watts) ──
  const cfm = st.ventCfm * f.occupants;
  const ventSensible = cfm * 1.08 * (deltaT * 1.8); // converted to match CFM formula
  const ventLatent = cfm * 0.68 * ((climate.rh - INDOOR_RH) * 0.1); // simplified gr/lb approx
  const ventTotal = Math.max(0, ventSensible + ventLatent);

  // ── Totals ──
  const subtotal = envelopeTotal + internalTotal + ventTotal;
  const safetyAdded = subtotal * (f.safetyFactor / 100);
  const grandTotal = subtotal + safetyAdded;

  const btuhr = grandTotal * 3.412;
  const tons = btuhr / 12000;
  const kw = grandTotal / 1000;

  return {
    envelope: { wall: wallLoad, roof: roofLoad, glassConduction, glassSolar, total: envelopeTotal },
    internal: { people: peopleSensible + peopleLatent, lighting: lightingW, equipment: equipW, total: internalTotal },
    ventilation: { sensible: ventSensible, latent: Math.max(0, ventLatent), total: ventTotal },
    subtotal,
    safetyAdded,
    grandTotal,
    btuhr,
    tons,
    kw,
    totalFloorArea,
    sqftPerTon: (totalFloorArea * 10.764) / Math.max(tons, 0.1),
    outdoorTemp,
  };
}

/* ── Helpers ──────────────────────────────────────────────── */

function InputField({ label, unit, value, onChange, min, max, step, icon }: {
  label: string; unit?: string; value: number; onChange: (v: number) => void;
  min?: number; max?: number; step?: number; icon?: React.ReactNode;
}) {
  return (
    <div className="group">
      <label className="block text-[11.5px] font-semibold text-[var(--color-text-tertiary)] uppercase tracking-[0.04em] mb-2">{label}</label>
      <div className="relative">
        {icon && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-tertiary)]">{icon}</span>}
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          min={min}
          max={max}
          step={step ?? 1}
          className={`w-full h-[46px] ${icon ? "pl-9" : "pl-4"} pr-3 rounded-[12px] border border-[var(--color-border)] bg-[var(--color-bg)]
            text-[15px] text-[var(--color-text-primary)] font-semibold tabular-nums
            focus:outline-none focus:border-[#2563EB] focus:ring-3 focus:ring-[#2563EB]/8 
            transition-all duration-200 hover:border-[var(--color-border-hover)]`}
        />
        {unit && (
          <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[11px] font-semibold text-[var(--color-text-tertiary)] bg-[var(--color-surface-raised)] px-1.5 py-0.5 rounded-md">
            {unit}
          </span>
        )}
      </div>
    </div>
  );
}

function SelectField({ label, value, onChange, options }: {
  label: string; value: string; onChange: (v: string) => void; options: { value: string; label: string }[];
}) {
  return (
    <div>
      <label className="block text-[11.5px] font-semibold text-[var(--color-text-tertiary)] uppercase tracking-[0.04em] mb-2">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-[46px] px-4 rounded-[12px] border border-[var(--color-border)] bg-[var(--color-bg)]
          text-[14px] text-[var(--color-text-primary)] font-semibold appearance-none cursor-pointer
          bg-[url('data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%2212%22%20height%3D%2212%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%23999%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%2F%3E%3C/svg%3E')]
          bg-[length:12px] bg-[right_14px_center] bg-no-repeat
          focus:outline-none focus:border-[#2563EB] focus:ring-3 focus:ring-[#2563EB]/8 
          transition-all duration-200 hover:border-[var(--color-border-hover)]"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </div>
  );
}

function DonutChart({ segments, size = 160 }: {
  segments: { label: string; value: number; color: string }[];
  size?: number;
}) {
  const total = segments.reduce((s, seg) => s + seg.value, 0);
  const r = 56;
  const circ = 2 * Math.PI * r;
  let offset = 0;

  return (
    <svg width={size} height={size} viewBox="0 0 140 140" className="shrink-0">
      {segments.map((seg) => {
        const pct = total > 0 ? seg.value / total : 0;
        const dash = pct * circ;
        const gap = circ - dash;
        const currentOffset = offset;
        offset += dash;
        return (
          <circle
            key={seg.label}
            cx="70"
            cy="70"
            r={r}
            fill="none"
            stroke={seg.color}
            strokeWidth="18"
            strokeDasharray={`${dash} ${gap}`}
            strokeDashoffset={-currentOffset}
            strokeLinecap="butt"
            className="transition-all duration-700"
            transform="rotate(-90 70 70)"
          />
        );
      })}
      <circle cx="70" cy="70" r="44" fill="var(--color-surface)" />
    </svg>
  );
}

/* ── Step config ── */
const STEPS: { id: number; label: string; icon: ReactNode }[] = [
  { id: 0, label: "Space",      icon: _ic(16, <><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z"/><circle cx="12" cy="10" r="3"/></>) },
  { id: 1, label: "Dimensions", icon: _ic(16, <><path d="M15 3h6v6"/><path d="M9 21H3v-6"/><path d="M21 3l-7 7"/><path d="M3 21l7-7"/></>) },
  { id: 2, label: "Envelope",   icon: _ic(16, <><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/><path d="M9 21V9"/></>) },
  { id: 3, label: "Loads",      icon: _ic(16, <path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z"/>) },
];

/* ── Page ──────────────────────────────────────────────────── */

export default function HeatLoadPage() {
  const [form, setForm] = useState<FormState>(defaults);
  const [step, setStep] = useState(0);
  const update = useCallback(<K extends keyof FormState>(key: K, val: FormState[K]) =>
    setForm((prev) => ({ ...prev, [key]: val })), []);

  const result = useMemo(() => calc(form), [form]);

  const envelopePct = result.grandTotal > 0 ? (result.envelope.total / result.grandTotal) * 100 : 0;
  const internalPct = result.grandTotal > 0 ? (result.internal.total / result.grandTotal) * 100 : 0;
  const ventPct = result.grandTotal > 0 ? ((result.ventilation.total + result.safetyAdded) / result.grandTotal) * 100 : 0;

  const donutSegments = [
    { label: "Envelope", value: result.envelope.total, color: "#2563EB" },
    { label: "Internal", value: result.internal.total, color: "#F59E0B" },
    { label: "Vent. + Safety", value: result.ventilation.total + result.safetyAdded, color: "#16A34A" },
  ];

  return (
    <>
      <Navbar />
      <main className="bg-[var(--color-bg)] min-h-screen pt-[104px]">

        {/* ── Dark Hero ── */}
        <div className="relative bg-[#0A0A0A] overflow-hidden">
          {/* Glow */}
          <div className="pointer-events-none absolute -top-40 right-0 w-[500px] h-[500px] rounded-full bg-[radial-gradient(circle,rgba(37,99,235,0.15)_0%,transparent_60%)]" />
          <div className="max-w-[1200px] mx-auto px-6 py-16 relative z-10">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-[13px] font-semibold text-white/40
                hover:text-white/70 transition-colors duration-200 mb-8"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
              Back to home
            </Link>
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8">
              <div>
                <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[#2563EB]/15 border border-[#2563EB]/20 text-[#60A5FA] text-[11.5px] font-semibold mb-5">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z" />
                  </svg>
                  Free Engineering Tool
                </div>
                <h1 className="font-[var(--font-display)] text-[clamp(30px,4vw,52px)] font-bold tracking-[-0.035em] leading-[1.05] text-white mb-3">
                  Heat Load Calculator
                </h1>
                <p className="text-[15px] text-white/40 max-w-[440px] leading-[1.75]">
                  ISHRAE-standard cooling load estimation.
                  Adjust your parameters — results update in real time.
                </p>
              </div>
              {/* Quick result pill */}
              <div className="flex items-center gap-4 bg-white/[0.06] backdrop-blur-xl border border-white/[0.08] rounded-[18px] px-6 py-4">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-white/30 mb-0.5">Estimated load</p>
                  <p className="font-[var(--font-display)] text-[36px] font-black tracking-[-0.04em] text-white leading-none">
                    {result.tons.toFixed(1)}
                    <span className="text-[15px] font-semibold text-white/40 ml-1.5">TR</span>
                  </p>
                </div>
                <div className="w-px h-10 bg-white/10" />
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-white/30 mb-0.5">Power</p>
                  <p className="font-[var(--font-display)] text-[20px] font-bold tracking-[-0.02em] text-white/70 leading-none">
                    {result.kw.toFixed(1)} <span className="text-[12px] text-white/30">kW</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-[1200px] mx-auto px-6 py-10">

          {/* ── Step Navigation ── */}
          <div className="flex items-center gap-1 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-full p-1.5 mb-8 max-w-fit mx-auto">
            {STEPS.map((s) => (
              <button
                key={s.id}
                onClick={() => setStep(s.id)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-[13px] font-semibold transition-all duration-300
                  ${step === s.id
                    ? "bg-[#111111] text-white shadow-[0_2px_10px_rgba(0,0,0,0.15)]"
                    : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-raised)]"
                  }`}
              >
                {s.icon}
                <span className="hidden sm:inline">{s.label}</span>
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8 items-start">

            {/* ── LEFT: Step Content ── */}
            <div>

              {/* Step 0: Space */}
              <div className={step === 0 ? "block" : "hidden"}>
                <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[24px] p-7 mb-6">
                  <h3 className="font-[var(--font-display)] text-[17px] font-bold text-[var(--color-text-primary)] tracking-[-0.02em] mb-2">
                    What kind of space?
                  </h3>
                  <p className="text-[13px] text-[var(--color-text-tertiary)] mb-6">Select the type that best matches — this sets default load assumptions.</p>
                  <div className="grid grid-cols-3 sm:grid-cols-5 gap-2.5">
                    {Object.entries(SPACE_TYPES).map(([key, val]) => (
                      <button
                        key={key}
                        onClick={() => update("spaceType", key)}
                        className={`flex flex-col items-center gap-2 py-4 px-2 rounded-[16px] border transition-all duration-250 cursor-pointer
                          ${form.spaceType === key
                            ? "bg-[#111111] text-white border-[#111111] shadow-[0_4px_16px_rgba(0,0,0,0.15)]"
                            : "bg-[var(--color-bg)] border-[var(--color-border)] text-[var(--color-text-secondary)] hover:border-[var(--color-border-hover)] hover:bg-[var(--color-surface-raised)]"
                          }`}
                      >
                        {val.icon}
                        <span className="text-[11.5px] font-semibold">{val.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[24px] p-7">
                  <h3 className="font-[var(--font-display)] text-[17px] font-bold text-[var(--color-text-primary)] tracking-[-0.02em] mb-2">
                    Where is this located?
                  </h3>
                  <p className="text-[13px] text-[var(--color-text-tertiary)] mb-6">Peak summer design temperature used for outdoor conditions.</p>
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                    {Object.entries(CITIES).filter(([k]) => k !== "Custom").map(([city, data]) => (
                      <button
                        key={city}
                        onClick={() => update("city", city)}
                        className={`text-left px-4 py-3 rounded-[14px] border transition-all duration-250 cursor-pointer
                          ${form.city === city
                            ? "bg-[#2563EB] text-white border-[#2563EB] shadow-[0_4px_16px_rgba(37,99,235,0.3)]"
                            : "bg-[var(--color-bg)] border-[var(--color-border)] hover:border-[var(--color-border-hover)]"
                          }`}
                      >
                        <span className={`text-[13px] font-semibold block ${form.city === city ? "text-white" : "text-[var(--color-text-primary)]"}`}>{city}</span>
                        <span className={`text-[11px] ${form.city === city ? "text-white/60" : "text-[var(--color-text-tertiary)]"}`}>{data.temp}°C · {data.rh}% RH</span>
                      </button>
                    ))}
                    <button
                      onClick={() => update("city", "Custom")}
                      className={`text-left px-4 py-3 rounded-[14px] border transition-all duration-250 cursor-pointer
                        ${form.city === "Custom"
                          ? "bg-[#2563EB] text-white border-[#2563EB] shadow-[0_4px_16px_rgba(37,99,235,0.3)]"
                          : "bg-[var(--color-bg)] border-[var(--color-border)] hover:border-[var(--color-border-hover)] border-dashed"
                        }`}
                    >
                      <span className={`text-[13px] font-semibold block ${form.city === "Custom" ? "text-white" : "text-[var(--color-text-primary)]"}`}>Custom</span>
                      <span className={`text-[11px] ${form.city === "Custom" ? "text-white/60" : "text-[var(--color-text-tertiary)]"}`}>Set manually</span>
                    </button>
                  </div>
                  {form.city === "Custom" && (
                    <div className="grid grid-cols-2 gap-4 mt-5 pt-5 border-t border-[var(--color-border)]">
                      <InputField label="Peak temperature" unit="°C" value={form.customTemp} onChange={(v) => update("customTemp", v)} min={25} max={55} />
                      <InputField label="Relative humidity" unit="%" value={form.customRh} onChange={(v) => update("customRh", v)} min={10} max={95} />
                    </div>
                  )}
                </div>

                <button onClick={() => setStep(1)} className="mt-6 inline-flex items-center gap-2 h-[46px] px-6 rounded-full bg-[#111111] text-white text-[13.5px] font-semibold transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg">
                  Next: Dimensions →
                </button>
              </div>

              {/* Step 1: Dimensions */}
              <div className={step === 1 ? "block" : "hidden"}>
                <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[24px] p-7">
                  <h3 className="font-[var(--font-display)] text-[17px] font-bold text-[var(--color-text-primary)] tracking-[-0.02em] mb-2">
                    Room dimensions
                  </h3>
                  <p className="text-[13px] text-[var(--color-text-tertiary)] mb-6">Enter the footprint of the conditioned space.</p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <InputField label="Length" unit="m" value={form.length} onChange={(v) => update("length", v)} min={1} max={200} step={0.5} />
                    <InputField label="Width" unit="m" value={form.width} onChange={(v) => update("width", v)} min={1} max={200} step={0.5} />
                    <InputField label="Ceiling height" unit="m" value={form.height} onChange={(v) => update("height", v)} min={2} max={20} step={0.1} />
                    <InputField label="Floors" value={form.floors} onChange={(v) => update("floors", v)} min={1} max={50} />
                  </div>
                  {/* Visual area readout */}
                  <div className="mt-6 p-4 bg-[var(--color-bg)] rounded-[14px] flex items-center justify-between">
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-[0.06em] text-[var(--color-text-tertiary)]">Total conditioned area</p>
                      <p className="font-[var(--font-display)] text-[22px] font-bold tracking-[-0.02em] text-[var(--color-text-primary)]">
                        {(form.length * form.width * form.floors).toLocaleString()} m²
                        <span className="text-[13px] font-medium text-[var(--color-text-tertiary)] ml-2">
                          ({(form.length * form.width * form.floors * 10.764).toLocaleString(undefined, { maximumFractionDigits: 0 })} sq ft)
                        </span>
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.06em] text-[var(--color-text-tertiary)]">Volume</p>
                      <p className="font-[var(--font-display)] text-[18px] font-bold tracking-[-0.02em] text-[var(--color-text-secondary)]">
                        {(form.length * form.width * form.height * form.floors).toLocaleString()} m³
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex gap-3 mt-6">
                  <button onClick={() => setStep(0)} className="inline-flex items-center gap-2 h-[46px] px-5 rounded-full border border-[var(--color-border)] text-[var(--color-text-secondary)] text-[13.5px] font-semibold hover:bg-[var(--color-surface-raised)] transition-all">
                    ← Back
                  </button>
                  <button onClick={() => setStep(2)} className="inline-flex items-center gap-2 h-[46px] px-6 rounded-full bg-[#111111] text-white text-[13.5px] font-semibold transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg">
                    Next: Envelope →
                  </button>
                </div>
              </div>

              {/* Step 2: Envelope */}
              <div className={step === 2 ? "block" : "hidden"}>
                <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[24px] p-7 mb-6">
                  <h3 className="font-[var(--font-display)] text-[17px] font-bold text-[var(--color-text-primary)] tracking-[-0.02em] mb-2">
                    Building envelope
                  </h3>
                  <p className="text-[13px] text-[var(--color-text-tertiary)] mb-6">Construction details determine heat transfer through walls, roof, and glass.</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <SelectField
                      label="Wall construction"
                      value={form.wallType}
                      onChange={(v) => update("wallType", v)}
                      options={Object.keys(WALL_U).map((k) => ({ value: k, label: `${k} — U=${WALL_U[k]}` }))}
                    />
                    <SelectField
                      label="Roof construction"
                      value={form.roofType}
                      onChange={(v) => update("roofType", v)}
                      options={Object.keys(ROOF_U).map((k) => ({ value: k, label: `${k} — U=${ROOF_U[k]}` }))}
                    />
                    <SelectField
                      label="Glazing type"
                      value={form.glassType}
                      onChange={(v) => update("glassType", v)}
                      options={Object.keys(GLASS_U).map((k) => ({ value: k, label: `${k} — SHGC ${GLASS_U[k].shgc}` }))}
                    />
                    <InputField label="Window-to-wall ratio" unit="%" value={form.windowPercent} onChange={(v) => update("windowPercent", v)} min={0} max={95} />
                  </div>
                </div>

                {/* Orientation picker */}
                <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[24px] p-7 mb-6">
                  <h3 className="font-[var(--font-display)] text-[15px] font-bold text-[var(--color-text-primary)] tracking-[-0.01em] mb-2">
                    Primary window orientation
                  </h3>
                  <p className="text-[13px] text-[var(--color-text-tertiary)] mb-5">Which direction do the largest windows face?</p>
                  <div className="flex flex-wrap gap-2">
                    {Object.keys(ORIENTATION_FACTOR).map((dir) => (
                      <button
                        key={dir}
                        onClick={() => update("orientation", dir)}
                        className={`px-4 py-2.5 rounded-full text-[12.5px] font-semibold border transition-all duration-250 cursor-pointer
                          ${form.orientation === dir
                            ? "bg-[#111111] text-white border-[#111111]"
                            : "bg-[var(--color-bg)] border-[var(--color-border)] text-[var(--color-text-secondary)] hover:border-[var(--color-border-hover)]"
                          }`}
                      >
                        {dir}
                        {form.orientation === dir && (
                          <span className="ml-1.5 text-white/50">×{ORIENTATION_FACTOR[dir]}</span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Roof checkbox */}
                <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[24px] p-7">
                  <label className="flex items-center justify-between cursor-pointer">
                    <div>
                      <p className="text-[14px] font-semibold text-[var(--color-text-primary)]">Roof exposed to direct sun</p>
                      <p className="text-[12.5px] text-[var(--color-text-tertiary)] mt-0.5">Adds sol-air temperature correction (+8°C) to roof load calculation</p>
                    </div>
                    <div className={`relative w-12 h-7 rounded-full transition-colors duration-300 ${form.roofExposed ? "bg-[#2563EB]" : "bg-[var(--color-surface-raised)] border border-[var(--color-border)]"}`}
                      onClick={() => update("roofExposed", !form.roofExposed)}>
                      <div className={`absolute top-0.5 w-6 h-6 rounded-full bg-white shadow-sm transition-all duration-300 ${form.roofExposed ? "left-[22px]" : "left-0.5"}`} />
                    </div>
                  </label>
                </div>

                <div className="flex gap-3 mt-6">
                  <button onClick={() => setStep(1)} className="inline-flex items-center gap-2 h-[46px] px-5 rounded-full border border-[var(--color-border)] text-[var(--color-text-secondary)] text-[13.5px] font-semibold hover:bg-[var(--color-surface-raised)] transition-all">
                    ← Back
                  </button>
                  <button onClick={() => setStep(3)} className="inline-flex items-center gap-2 h-[46px] px-6 rounded-full bg-[#111111] text-white text-[13.5px] font-semibold transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg">
                    Next: Internal Loads →
                  </button>
                </div>
              </div>

              {/* Step 3: Internal Loads */}
              <div className={step === 3 ? "block" : "hidden"}>
                <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[24px] p-7 mb-6">
                  <h3 className="font-[var(--font-display)] text-[17px] font-bold text-[var(--color-text-primary)] tracking-[-0.02em] mb-2">
                    People &amp; equipment
                  </h3>
                  <p className="text-[13px] text-[var(--color-text-tertiary)] mb-6">
                    Defaults are based on your <span className="font-semibold text-[var(--color-text-secondary)]">{SPACE_TYPES[form.spaceType].label}</span> selection. Override if needed.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <InputField label="Occupants" value={form.occupants} onChange={(v) => update("occupants", v)} min={0} max={5000} />
                    <InputField
                      label={`Lighting (${SPACE_TYPES[form.spaceType].lights} W/m²)`}
                      unit="W"
                      value={form.lightingOverride ?? Math.round(SPACE_TYPES[form.spaceType].lights * result.totalFloorArea)}
                      onChange={(v) => update("lightingOverride", v)}
                      min={0}
                      max={999999}
                    />
                    <InputField
                      label={`Equipment (${SPACE_TYPES[form.spaceType].equip} W/m²)`}
                      unit="W"
                      value={form.equipOverride ?? Math.round(SPACE_TYPES[form.spaceType].equip * result.totalFloorArea)}
                      onChange={(v) => update("equipOverride", v)}
                      min={0}
                      max={999999}
                    />
                  </div>
                  <div className="mt-4 grid grid-cols-3 gap-3">
                    {[
                      { label: "Sensible / person", value: "75 W" },
                      { label: "Latent / person", value: "55 W" },
                      { label: "Fresh air / person", value: `${SPACE_TYPES[form.spaceType].ventCfm} CFM` },
                    ].map((item) => (
                      <div key={item.label} className="bg-[var(--color-bg)] rounded-[12px] px-3.5 py-3">
                        <p className="text-[10px] font-semibold uppercase tracking-[0.06em] text-[var(--color-text-tertiary)]">{item.label}</p>
                        <p className="text-[14px] font-bold text-[var(--color-text-primary)] mt-0.5">{item.value}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Safety Factor */}
                <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[24px] p-7">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-[var(--font-display)] text-[15px] font-bold text-[var(--color-text-primary)] tracking-[-0.01em]">Safety factor</h3>
                      <p className="text-[12.5px] text-[var(--color-text-tertiary)] mt-0.5">Industry standard is 10%</p>
                    </div>
                    <span className="font-[var(--font-display)] text-[24px] font-black text-[var(--color-text-primary)] tabular-nums">{form.safetyFactor}%</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={30}
                    step={5}
                    value={form.safetyFactor}
                    onChange={(e) => update("safetyFactor", Number(e.target.value))}
                    className="w-full accent-[#2563EB] cursor-pointer h-2"
                  />
                  <div className="flex justify-between mt-1.5">
                    {[0, 5, 10, 15, 20, 25, 30].map((v) => (
                      <span key={v} className={`text-[10px] font-semibold cursor-pointer ${form.safetyFactor === v ? "text-[#2563EB]" : "text-[var(--color-text-tertiary)]"}`}
                        onClick={() => update("safetyFactor", v)}>
                        {v}%
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <button onClick={() => setStep(2)} className="inline-flex items-center gap-2 h-[46px] px-5 rounded-full border border-[var(--color-border)] text-[var(--color-text-secondary)] text-[13.5px] font-semibold hover:bg-[var(--color-surface-raised)] transition-all">
                    ← Back
                  </button>
                  <button
                    onClick={() => setForm(defaults)}
                    className="inline-flex items-center gap-2 h-[46px] px-5 rounded-full border border-[var(--color-border)] text-[var(--color-text-secondary)] text-[13.5px] font-semibold hover:bg-[var(--color-surface-raised)] transition-all"
                  >
                    ↻ Reset all
                  </button>
                </div>
              </div>
            </div>

            {/* ── RIGHT: Results Panel (sticky) ── */}
            <div className="lg:sticky lg:top-[100px] space-y-4">

              {/* Primary result */}
              <div className="bg-[#111111] rounded-[24px] p-7 text-white relative overflow-hidden">
                <div className="pointer-events-none absolute -top-16 -right-16 w-[200px] h-[200px] rounded-full bg-[radial-gradient(circle,rgba(37,99,235,0.2)_0%,transparent_60%)]" />
                <div className="relative z-10">
                  <p className="text-[10.5px] font-semibold uppercase tracking-[0.08em] text-white/30 mb-1">Estimated Cooling Load</p>
                  <p className="font-[var(--font-display)] text-[52px] font-black tracking-[-0.04em] leading-none mb-1">
                    {result.tons.toFixed(1)}
                    <span className="text-[18px] font-bold text-white/40 ml-2">TR</span>
                  </p>
                  <p className="text-[13px] text-white/35">
                    {(result.btuhr / 1000).toFixed(1)}k BTU/hr · {result.kw.toFixed(1)} kW
                  </p>
                </div>
                <div className="grid grid-cols-3 gap-px bg-white/[0.06] rounded-[14px] overflow-hidden mt-6 relative z-10">
                  {[
                    { label: "Floor area", value: `${result.totalFloorArea.toFixed(0)} m²` },
                    { label: "Efficiency", value: `${result.sqftPerTon.toFixed(0)} sqft/TR` },
                    { label: "Outdoor", value: `${result.outdoorTemp}°C` },
                  ].map((s) => (
                    <div key={s.label} className="bg-[#111111] px-4 py-3.5">
                      <p className="text-[9.5px] font-semibold uppercase tracking-[0.07em] text-white/25 mb-0.5">{s.label}</p>
                      <p className="text-[14px] font-bold text-white/80 tabular-nums">{s.value}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Donut breakdown */}
              <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[24px] p-6">
                <h3 className="font-[var(--font-display)] text-[14px] font-bold text-[var(--color-text-primary)] tracking-[-0.01em] mb-5">
                  Load Distribution
                </h3>
                <div className="flex items-center gap-6">
                  <DonutChart segments={donutSegments} />
                  <div className="flex-1 space-y-3">
                    {[
                      { label: "Envelope", pct: envelopePct, color: "#2563EB", detail: "Walls, roof, glass" },
                      { label: "Internal", pct: internalPct, color: "#F59E0B", detail: "People, lights, equipment" },
                      { label: "Ventilation", pct: ventPct, color: "#16A34A", detail: `+ ${form.safetyFactor}% safety` },
                    ].map((item) => (
                      <div key={item.label} className="flex items-center gap-3">
                        <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: item.color }} />
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-center">
                            <span className="text-[12.5px] font-semibold text-[var(--color-text-primary)]">{item.label}</span>
                            <span className="text-[12px] font-bold text-[var(--color-text-primary)] tabular-nums">{item.pct.toFixed(0)}%</span>
                          </div>
                          <p className="text-[10.5px] text-[var(--color-text-tertiary)]">{item.detail}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Detailed breakdown */}
              <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[24px] p-6">
                <h3 className="font-[var(--font-display)] text-[14px] font-bold text-[var(--color-text-primary)] tracking-[-0.01em] mb-4">
                  Detailed Breakdown
                </h3>
                <div className="space-y-2.5">
                  {[
                    { label: "Walls", w: result.envelope.wall, color: "#2563EB" },
                    { label: "Roof", w: result.envelope.roof, color: "#2563EB" },
                    { label: "Glass (cond.)", w: result.envelope.glassConduction, color: "#2563EB" },
                    { label: "Glass (solar)", w: result.envelope.glassSolar, color: "#2563EB" },
                    { label: "People", w: result.internal.people, color: "#F59E0B" },
                    { label: "Lighting", w: result.internal.lighting, color: "#F59E0B" },
                    { label: "Equipment", w: result.internal.equipment, color: "#F59E0B" },
                    { label: "Ventilation", w: result.ventilation.total, color: "#16A34A" },
                    { label: `Safety (${form.safetyFactor}%)`, w: result.safetyAdded, color: "#16A34A" },
                  ].map((row) => {
                    const pct = result.grandTotal > 0 ? (row.w / result.grandTotal) * 100 : 0;
                    return (
                      <div key={row.label} className="flex items-center gap-2">
                        <span className="text-[11.5px] text-[var(--color-text-secondary)] w-[90px] shrink-0 truncate">{row.label}</span>
                        <div className="flex-1 h-[6px] bg-[var(--color-surface-raised)] rounded-full overflow-hidden">
                          <div className="h-full rounded-full transition-all duration-500" style={{ width: `${Math.min(pct, 100)}%`, background: row.color }} />
                        </div>
                        <span className="text-[11px] font-bold text-[var(--color-text-primary)] tabular-nums w-[52px] text-right shrink-0">
                          {row.w >= 1000 ? `${(row.w / 1000).toFixed(1)}kW` : `${Math.round(row.w)}W`}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Recommendation */}
              <div className="bg-[#F0F7FF] border border-[#BFDBFE] rounded-[24px] p-6">
                <div className="flex gap-3">
                  <div className="shrink-0 w-8 h-8 rounded-full bg-[#2563EB] flex items-center justify-center text-white mt-0.5">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="M22 4 12 14.01l-3-3"/>
                    </svg>
                  </div>
                  <div>
                    <p className="text-[11.5px] font-bold uppercase tracking-[0.06em] text-[#2563EB] mb-1">System Recommendation</p>
                    <p className="text-[13px] text-[#1E40AF] leading-[1.7] font-medium">
                      {result.tons < 3
                        ? "Split AC (inverter) — ideal for this load. Consider 1–1.5 TR wall-mounted units."
                        : result.tons < 15
                          ? "VRF multi-split system — best balance of zone control, efficiency, and lifecycle cost."
                          : result.tons < 50
                            ? "VRF or ducted central system — professional design study recommended for optimal sizing."
                            : "Chiller plant with AHUs — professional engineering design is essential at this capacity."
                      }
                    </p>
                  </div>
                </div>
              </div>

              {/* CTA */}
              <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[24px] p-6 text-center">
                <p className="font-[var(--font-display)] text-[15px] font-bold text-[var(--color-text-primary)] tracking-[-0.01em] mb-1.5">
                  Need a detailed load study?
                </p>
                <p className="text-[12.5px] text-[var(--color-text-tertiary)] leading-[1.7] mb-5">
                  Free site assessment by our engineers — no obligation.
                </p>
                <div className="flex flex-col gap-2.5">
                  <Link
                    href="/#contact"
                    className="inline-flex items-center justify-center gap-2 h-[46px] px-6 rounded-full bg-[#111111] text-white text-[13.5px] font-semibold
                      transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg w-full"
                  >
                    Book free site survey →
                  </Link>
                  <a
                    href="https://wa.me/919054190245?text=Hi%2C%20I%20used%20your%20heat%20load%20calculator%20and%20got%20${result.tons.toFixed(1)}%20TR.%20I%20need%20a%20detailed%20assessment."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 h-[46px] px-6 rounded-full bg-[#25D366] text-white text-[13.5px] font-semibold
                      transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg w-full"
                  >
                    <svg width="16" height="16" viewBox="0 0 32 32" fill="currentColor"><path d="M16 0C7.164 0 0 7.163 0 16c0 2.822.737 5.469 2.027 7.77L0 32l8.469-2.002A15.93 15.93 0 0 0 16 32c8.837 0 16-7.163 16-16S24.837 0 16 0zm7.274 19.455c-.398-.199-2.355-1.162-2.72-1.295-.366-.133-.632-.199-.898.2-.265.398-1.029 1.295-1.261 1.561-.232.265-.465.298-.863.1-.398-.2-1.681-.62-3.202-1.977-1.183-1.056-1.982-2.36-2.214-2.758-.232-.398-.025-.613.175-.812.179-.178.398-.465.597-.698.2-.232.266-.398.399-.664.133-.265.066-.497-.033-.697-.1-.199-.898-2.165-1.23-2.963-.325-.778-.655-.672-.898-.685l-.765-.013c-.266 0-.697.1-1.063.497-.365.398-1.394 1.362-1.394 3.321 0 1.96 1.427 3.854 1.626 4.12.2.265 2.807 4.286 6.803 6.01.95.41 1.692.655 2.27.839.954.304 1.822.261 2.508.158.765-.114 2.355-.963 2.688-1.893.332-.93.332-1.727.232-1.893z"/></svg>
                    Share result on WhatsApp
                  </a>
                </div>
              </div>

              <p className="text-[10.5px] text-[var(--color-text-tertiary)] leading-[1.7] text-center px-2">
                Based on ISHRAE CLTD/SCL/CLF method. Peak summer design conditions.
                For precise sizing, a professional site survey is recommended.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
