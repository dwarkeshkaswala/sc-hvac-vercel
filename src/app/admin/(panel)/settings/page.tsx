"use client";

import { useState } from "react";
import { changePasswordAction } from "@/app/admin/actions";
import { useToast, PageHeader, FormCard } from "../components/AdminUI";

export default function SettingsPage() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast("error", "New passwords do not match.");
      return;
    }

    if (newPassword.length < 6) {
      toast("error", "New password must be at least 6 characters.");
      return;
    }

    setSaving(true);
    try {
      const result = await changePasswordAction(currentPassword, newPassword);
      if (result.ok) {
        toast("success", "Password changed successfully.");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        toast("error", result.error || "Failed to change password.");
      }
    } catch {
      toast("error", "An error occurred. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="p-4 sm:p-8 max-w-[600px]">
      <PageHeader
        title="Settings"
        description="Manage your admin account settings."
      />

      <FormCard title="Change Password" description="Update your admin login credentials">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-[11.5px] font-semibold text-[#666] mb-1.5">
              Current Password
            </label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
              className="w-full h-[42px] px-3.5 rounded-[10px] border border-[#E5E7EB] bg-[#FAFAFA] text-[14px] placeholder:text-[#CCC] outline-none focus:border-[#0000B8] focus:ring-2 focus:ring-[#0000B8]/10 hover:border-[#D0D0D0] transition-all"
              placeholder="Enter current password"
            />
          </div>

          <div>
            <label className="block text-[11.5px] font-semibold text-[#666] mb-1.5">
              New Password
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              minLength={6}
              className="w-full h-[42px] px-3.5 rounded-[10px] border border-[#E5E7EB] bg-[#FAFAFA] text-[14px] placeholder:text-[#CCC] outline-none focus:border-[#0000B8] focus:ring-2 focus:ring-[#0000B8]/10 hover:border-[#D0D0D0] transition-all"
              placeholder="At least 6 characters"
            />
          </div>

          <div>
            <label className="block text-[11.5px] font-semibold text-[#666] mb-1.5">
              Confirm New Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={6}
              className="w-full h-[42px] px-3.5 rounded-[10px] border border-[#E5E7EB] bg-[#FAFAFA] text-[14px] placeholder:text-[#CCC] outline-none focus:border-[#0000B8] focus:ring-2 focus:ring-[#0000B8]/10 hover:border-[#D0D0D0] transition-all"
              placeholder="Re-enter new password"
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="mt-2 h-[44px] px-6 rounded-[12px] bg-[#0000B8] text-white text-[13px] font-semibold hover:bg-[#000096] disabled:opacity-50 transition-all self-start flex items-center gap-2"
          >
            {saving && (
              <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            )}
            {saving ? "Changing..." : "Change Password"}
          </button>
        </form>
      </FormCard>
    </div>
  );
}
