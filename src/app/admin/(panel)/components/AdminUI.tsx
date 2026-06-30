"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";

/* ═══════════════════════════════════════════════════════════════════
   TOAST SYSTEM
   ═══════════════════════════════════════════════════════════════════ */

type ToastType = "success" | "error" | "info";

interface Toast {
  id: string;
  type: ToastType;
  message: string;
}

interface ToastContextValue {
  toast: (type: ToastType, message: string) => void;
}

const ToastContext = createContext<ToastContextValue>({ toast: () => {} });

export function useToast() {
  return useContext(ToastContext);
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = useCallback((type: ToastType, message: string) => {
    const id = crypto.randomUUID();
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      {/* Toast container */}
      <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-2 pointer-events-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`pointer-events-auto animate-slide-up px-4 py-3 rounded-[12px] shadow-lg border text-[13px] font-medium flex items-center gap-2.5 min-w-[260px] max-w-[380px] ${
              t.type === "success"
                ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                : t.type === "error"
                ? "bg-red-50 border-red-200 text-red-700"
                : "bg-blue-50 border-blue-200 text-blue-700"
            }`}
          >
            <span className="text-[16px] shrink-0">
              {t.type === "success" ? "✓" : t.type === "error" ? "✕" : "ℹ"}
            </span>
            <span className="leading-snug">{t.message}</span>
            <button
              onClick={() => setToasts((prev) => prev.filter((x) => x.id !== t.id))}
              className="ml-auto text-current opacity-40 hover:opacity-70 text-[16px] shrink-0"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   CONFIRM DIALOG
   ═══════════════════════════════════════════════════════════════════ */

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  confirmVariant?: "danger" | "primary";
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = "Confirm",
  confirmVariant = "danger",
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onCancel]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" onClick={onCancel} />
      <div className="relative bg-white rounded-[16px] border border-[#E5E7EB] shadow-xl p-6 w-full max-w-[400px] mx-4 animate-scale-in">
        <h3 className="text-[16px] font-bold text-[#111] mb-2">{title}</h3>
        <p className="text-[13.5px] text-[#666] leading-relaxed mb-6">{message}</p>
        <div className="flex items-center justify-end gap-3">
          <button
            onClick={onCancel}
            className="h-[38px] px-4 rounded-[10px] text-[13px] font-medium text-[#666] hover:bg-[#F5F5F5] transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className={`h-[38px] px-5 rounded-[10px] text-[13px] font-semibold text-white transition-all ${
              confirmVariant === "danger"
                ? "bg-red-500 hover:bg-red-600"
                : "bg-[#0000B8] hover:bg-[#000096]"
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   SAVE BUTTON (with loading + Ctrl+S)
   ═══════════════════════════════════════════════════════════════════ */

interface SaveButtonProps {
  onClick: () => Promise<void> | void;
  label?: string;
  disabled?: boolean;
  hasChanges?: boolean;
  className?: string;
}

export function SaveButton({ onClick, label = "Save changes", disabled, hasChanges, className }: SaveButtonProps) {
  const [saving, setSaving] = useState(false);

  // Ctrl+S / Cmd+S keyboard shortcut
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault();
        if (!saving && !disabled) {
          handleClick();
        }
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [saving, disabled]);

  async function handleClick() {
    setSaving(true);
    try {
      await onClick();
    } finally {
      setSaving(false);
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={saving || disabled}
      className={`relative h-[44px] px-8 rounded-[12px] text-[14px] font-semibold transition-all duration-200 flex items-center gap-2.5 ${
        hasChanges
          ? "bg-[#0000B8] text-white hover:bg-[#000096] shadow-[0_2px_8px_rgba(0,0,184,0.3)]"
          : "bg-[#111111] text-white hover:bg-[#222]"
      } disabled:opacity-60 disabled:cursor-not-allowed ${className ?? ""}`}
    >
      {saving && (
        <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      )}
      {saving ? "Saving..." : label}
      {!saving && hasChanges && (
        <span className="hidden sm:inline text-[11px] opacity-60 font-normal ml-1">Ctrl+S</span>
      )}
    </button>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   UNSAVED CHANGES HOOK
   ═══════════════════════════════════════════════════════════════════ */

export function useUnsavedChanges<T>(initial: T, current: T): boolean {
  const initialRef = useRef(JSON.stringify(initial));
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    setDirty(JSON.stringify(current) !== initialRef.current);
  }, [current]);

  // Warn before navigation
  useEffect(() => {
    if (!dirty) return;
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [dirty]);

  return dirty;
}

/** Reset the initial ref (call after successful save) */
export function useUnsavedChangesRef<T>() {
  const initialRef = useRef<string>("");
  const [dirty, setDirty] = useState(false);

  const setInitial = useCallback((val: T) => {
    initialRef.current = JSON.stringify(val);
    setDirty(false);
  }, []);

  const checkDirty = useCallback((current: T) => {
    const isDirty = JSON.stringify(current) !== initialRef.current;
    setDirty(isDirty);
    return isDirty;
  }, []);

  // Warn before navigation
  useEffect(() => {
    if (!dirty) return;
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [dirty]);

  return { dirty, setInitial, checkDirty };
}

/* ═══════════════════════════════════════════════════════════════════
   PAGE HEADER (with breadcrumb + optional action button)
   ═══════════════════════════════════════════════════════════════════ */

interface PageHeaderProps {
  title: string;
  description: string;
  action?: React.ReactNode;
  badge?: React.ReactNode;
}

export function PageHeader({ title, description, action, badge }: PageHeaderProps) {
  return (
    <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <div className="flex items-center gap-3">
          <h1 className="text-[24px] font-bold text-[#111111] tracking-[-0.02em]">{title}</h1>
          {badge}
        </div>
        <p className="text-[13.5px] text-[#666] mt-1">{description}</p>
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   FORM CARD (grouped fields)
   ═══════════════════════════════════════════════════════════════════ */

interface FormCardProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  collapsible?: boolean;
  defaultOpen?: boolean;
}

export function FormCard({ title, description, children, collapsible, defaultOpen = true }: FormCardProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="bg-white rounded-[16px] border border-[#E5E7EB] overflow-hidden transition-shadow hover:shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
      <div
        className={`px-5 py-4 flex items-center justify-between ${collapsible ? "cursor-pointer select-none" : ""}`}
        onClick={collapsible ? () => setOpen(!open) : undefined}
      >
        <div>
          <p className="text-[13px] font-bold text-[#111] tracking-[-0.01em]">{title}</p>
          {description && <p className="text-[11.5px] text-[#999] mt-0.5">{description}</p>}
        </div>
        {collapsible && (
          <svg
            className={`w-4 h-4 text-[#999] transition-transform ${open ? "rotate-180" : ""}`}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M6 9l6 6 6-6" />
          </svg>
        )}
      </div>
      {open && <div className="px-5 pb-5 pt-0">{children}</div>}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   INPUT + TEXTAREA (consistent styling)
   ═══════════════════════════════════════════════════════════════════ */

interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  label?: string;
  hint?: string;
  onChange: (value: string) => void;
}

export function Input({ label, hint, onChange, className, ...rest }: InputProps) {
  return (
    <div className={className}>
      {label && (
        <label className="block text-[11.5px] font-semibold text-[#666] mb-1.5 tracking-[0.01em]">
          {label}
          {hint && <span className="font-normal text-[#BBB] ml-1.5">{hint}</span>}
        </label>
      )}
      <input
        {...rest}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-[42px] px-3.5 rounded-[10px] border border-[#E5E7EB] bg-[#FAFAFA]
          text-[13.5px] text-[#111] placeholder:text-[#CCC]
          focus:outline-none focus:border-[#0000B8] focus:ring-2 focus:ring-[#0000B8]/10
          hover:border-[#D0D0D0] transition-all duration-200"
      />
    </div>
  );
}

interface TextareaProps extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, "onChange"> {
  label?: string;
  hint?: string;
  onChange: (value: string) => void;
}

export function Textarea({ label, hint, onChange, className, ...rest }: TextareaProps) {
  return (
    <div className={className}>
      {label && (
        <label className="block text-[11.5px] font-semibold text-[#666] mb-1.5 tracking-[0.01em]">
          {label}
          {hint && <span className="font-normal text-[#BBB] ml-1.5">{hint}</span>}
        </label>
      )}
      <textarea
        {...rest}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3.5 py-3 rounded-[10px] border border-[#E5E7EB] bg-[#FAFAFA]
          text-[13.5px] text-[#111] leading-[1.7] placeholder:text-[#CCC] resize-y
          focus:outline-none focus:border-[#0000B8] focus:ring-2 focus:ring-[#0000B8]/10
          hover:border-[#D0D0D0] transition-all duration-200"
      />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   UNSAVED CHANGES BANNER
   ═══════════════════════════════════════════════════════════════════ */

interface UnsavedBannerProps {
  show: boolean;
  onSave: () => void;
  onDiscard: () => void;
  saving?: boolean;
}

export function UnsavedBanner({ show, onSave, onDiscard, saving }: UnsavedBannerProps) {
  if (!show) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 md:left-[240px] z-50 animate-slide-up">
      <div className="mx-4 mb-4 bg-[#111] rounded-[14px] px-5 py-3.5 flex items-center justify-between shadow-xl border border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
          <span className="text-[13px] text-white/80 font-medium">You have unsaved changes</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onDiscard}
            className="h-[34px] px-4 rounded-[8px] text-[12.5px] font-medium text-white/60 hover:text-white hover:bg-white/10 transition-all"
          >
            Discard
          </button>
          <button
            onClick={onSave}
            disabled={saving}
            className="h-[34px] px-5 rounded-[8px] bg-[#0000B8] text-white text-[12.5px] font-semibold hover:bg-[#000096] transition-all disabled:opacity-60 flex items-center gap-2"
          >
            {saving && (
              <svg className="animate-spin w-3.5 h-3.5" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            )}
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   EMPTY STATE
   ═══════════════════════════════════════════════════════════════════ */

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  action?: React.ReactNode;
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
      {icon && <div className="mb-4 text-[#DDD]">{icon}</div>}
      <h3 className="text-[15px] font-bold text-[#333] mb-1">{title}</h3>
      <p className="text-[12.5px] text-[#999] max-w-[280px] mb-4">{description}</p>
      {action}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   ITEM CARD (for list editors — services, testimonials, etc.)
   ═══════════════════════════════════════════════════════════════════ */

interface ItemCardProps {
  children: React.ReactNode;
  onRemove: () => void;
  dragHandleProps?: {
    draggable: boolean;
    onDragStart: () => void;
    onDragOver: (e: React.DragEvent) => void;
    onDragEnd: () => void;
  };
  isDragging?: boolean;
  collapsed?: boolean;
  title?: string;
  onToggleCollapse?: () => void;
}

export function ItemCard({ children, onRemove, dragHandleProps, isDragging, collapsed, title, onToggleCollapse }: ItemCardProps) {
  const [confirmRemove, setConfirmRemove] = useState(false);

  return (
    <>
      <div
        {...dragHandleProps}
        className={`bg-white rounded-[14px] border transition-all ${
          isDragging ? "border-[#0000B8] shadow-lg scale-[1.01]" : "border-[#E5E7EB] hover:border-[#D0D0D0]"
        }`}
      >
        {/* Card header */}
        <div className="flex items-center gap-2 px-4 py-3 border-b border-[#F0F0F0]">
          {dragHandleProps && (
            <div className="cursor-grab active:cursor-grabbing text-[#CCC] hover:text-[#888] shrink-0">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <rect x="4" y="5" width="3" height="3" rx="1" />
                <rect x="11" y="5" width="3" height="3" rx="1" />
                <rect x="4" y="11" width="3" height="3" rx="1" />
                <rect x="11" y="11" width="3" height="3" rx="1" />
                <rect x="4" y="17" width="3" height="3" rx="1" />
                <rect x="11" y="17" width="3" height="3" rx="1" />
              </svg>
            </div>
          )}
          {title && (
            <span className="text-[12.5px] font-semibold text-[#444] truncate flex-1">
              {title}
            </span>
          )}
          {!title && <div className="flex-1" />}
          {onToggleCollapse && (
            <button
              onClick={onToggleCollapse}
              className="w-7 h-7 flex items-center justify-center rounded-[6px] text-[#BBB] hover:text-[#666] hover:bg-[#F5F5F5] transition-all"
            >
              <svg className={`w-3.5 h-3.5 transition-transform ${collapsed ? "" : "rotate-180"}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M6 9l6 6 6-6" />
              </svg>
            </button>
          )}
          <button
            onClick={() => setConfirmRemove(true)}
            className="w-7 h-7 flex items-center justify-center rounded-[6px] text-[#CCC] hover:text-red-500 hover:bg-red-50 transition-all"
            title="Remove"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m3 0v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6h14" />
            </svg>
          </button>
        </div>
        {/* Card body */}
        {!collapsed && <div className="p-4">{children}</div>}
      </div>

      <ConfirmDialog
        open={confirmRemove}
        title="Remove item?"
        message="This will remove the item from the list. You can still undo by not saving."
        confirmLabel="Remove"
        confirmVariant="danger"
        onConfirm={() => {
          setConfirmRemove(false);
          onRemove();
        }}
        onCancel={() => setConfirmRemove(false)}
      />
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   ADD BUTTON (for list editors)
   ═══════════════════════════════════════════════════════════════════ */

interface AddButtonProps {
  onClick: () => void;
  label: string;
}

export function AddButton({ onClick, label }: AddButtonProps) {
  return (
    <button
      onClick={onClick}
      className="h-[38px] px-5 rounded-[10px] bg-[#0000B8] text-white text-[13px] font-semibold hover:bg-[#000096] transition-all flex items-center gap-2"
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        <path d="M12 5v14M5 12h14" />
      </svg>
      {label}
    </button>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   BADGE (for counts, status, etc.)
   ═══════════════════════════════════════════════════════════════════ */

export function Badge({ children, variant = "default" }: { children: React.ReactNode; variant?: "default" | "success" | "warning" }) {
  const styles = {
    default: "bg-[#F0F0F0] text-[#666]",
    success: "bg-emerald-50 text-emerald-600",
    warning: "bg-amber-50 text-amber-600",
  };

  return (
    <span className={`inline-flex items-center h-[22px] px-2.5 rounded-full text-[11px] font-semibold ${styles[variant]}`}>
      {children}
    </span>
  );
}
