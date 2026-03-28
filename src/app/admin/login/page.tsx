import { getAdminSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { loginAction } from "../actions";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const session = await getAdminSession();
  if (session) redirect("/admin");

  const { error } = await searchParams;

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0A0A0A] px-4">
      <div className="w-full max-w-[380px]">
        {/* Logo area */}
        <div className="text-center mb-8">
          <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-white/30 mb-2">Shreeji HVAC</p>
          <h1 className="font-bold text-[24px] text-white tracking-[-0.02em]">Admin Login</h1>
        </div>

        <form
          action={loginAction}
          className="bg-white/[0.05] border border-white/[0.08] rounded-[20px] p-8 space-y-4"
        >
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-[13px] font-medium px-4 py-3 rounded-[12px]">
              Invalid email or password.
            </div>
          )}

          <div>
            <label className="block text-[11.5px] font-semibold text-white/40 uppercase tracking-[0.05em] mb-2">
              Email
            </label>
            <input
              type="email"
              name="email"
              required
              autoComplete="email"
              className="w-full h-[46px] px-4 rounded-[12px] bg-white/[0.06] border border-white/[0.1]
                text-white text-[14px] placeholder:text-white/25
                focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20
                transition-all duration-200"
              placeholder="admin@shreejihvac.com"
            />
          </div>

          <div>
            <label className="block text-[11.5px] font-semibold text-white/40 uppercase tracking-[0.05em] mb-2">
              Password
            </label>
            <input
              type="password"
              name="password"
              required
              autoComplete="current-password"
              className="w-full h-[46px] px-4 rounded-[12px] bg-white/[0.06] border border-white/[0.1]
                text-white text-[14px] placeholder:text-white/25
                focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20
                transition-all duration-200"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            className="w-full h-[46px] rounded-[12px] bg-[#2563EB] text-white text-[14px] font-semibold
              hover:bg-[#1D4ED8] transition-all duration-200 mt-2"
          >
            Sign in →
          </button>
        </form>
      </div>
    </div>
  );
}
