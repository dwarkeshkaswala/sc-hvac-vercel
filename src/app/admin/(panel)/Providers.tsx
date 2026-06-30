"use client";

import { ToastProvider } from "./components/AdminUI";

export default function AdminProviders({ children }: { children: React.ReactNode }) {
  return <ToastProvider>{children}</ToastProvider>;
}
