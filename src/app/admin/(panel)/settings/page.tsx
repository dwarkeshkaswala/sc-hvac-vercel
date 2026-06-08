"use client";

import { useState } from "react";
import { changePasswordAction } from "@/app/admin/actions";

export default function SettingsPage() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);

    if (newPassword !== confirmPassword) {
      setMessage({ type: "error", text: "New passwords do not match." });
      return;
    }

    if (newPassword.length < 6) {
      setMessage({ type: "error", text: "New password must be at least 6 characters." });
      return;
    }

    setSaving(true);
    try {
      const result = await changePasswordAction(currentPassword, newPassword);
      if (result.ok) {
        setMessage({ type: "success", text: "Password changed successfully." });
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        setMessage({ type: "error", text: result.error || "Failed to change password." });
      }
    } catch {
      setMessage({ type: "error", text: "An error occurred. Please try again." });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="p-4 sm:p-8 max-w-[600px]">
      <div className="mb-8">
        <h1 className="text-[26px] font-bold text-[#111111] tracking-[-0.02em]">Settings</h1>
        <p className="text-[14px] text-[#666] mt-1">Manage your admin account settings.</p>
      </div>

      <div className="bg-white rounded-[16px] border border-[#E5E7EB] p-6">
        <h2 className="text-[16px] font-semibold text-[#111] mb-4">Change Password</h2>

        {message && (
          <div
            className={`mb-4 p-3 rounded-[10px] text-[13px] font-medium ${
              message.type === "success"
                ? "bg-green-50 text-green-700 border border-green-200"
                : "bg-red-50 text-red-700 border border-red-200"
            }`}
          >
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-[12px] font-semibold text-[#333] uppercase tracking-[0.04em] mb-1.5">
              Current Password
            </label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
              className="w-full px-3 py-2.5 rounded-[10px] border border-[#E5E7EB] text-[14px] outline-none focus:border-[#0000B8] focus:ring-2 focus:ring-[#0000B8]/10 transition-all"
            />
          </div>

          <div>
            <label className="block text-[12px] font-semibold text-[#333] uppercase tracking-[0.04em] mb-1.5">
              New Password
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              minLength={6}
              className="w-full px-3 py-2.5 rounded-[10px] border border-[#E5E7EB] text-[14px] outline-none focus:border-[#0000B8] focus:ring-2 focus:ring-[#0000B8]/10 transition-all"
            />
          </div>

          <div>
            <label className="block text-[12px] font-semibold text-[#333] uppercase tracking-[0.04em] mb-1.5">
              Confirm New Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={6}
              className="w-full px-3 py-2.5 rounded-[10px] border border-[#E5E7EB] text-[14px] outline-none focus:border-[#0000B8] focus:ring-2 focus:ring-[#0000B8]/10 transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="mt-2 px-5 py-2.5 rounded-[10px] bg-[#0000B8] text-white text-[13px] font-semibold hover:bg-[#000096] disabled:opacity-50 transition-colors self-start"
          >
            {saving ? "Changing..." : "Change Password"}
          </button>
        </form>
      </div>
    </div>
  );
}
