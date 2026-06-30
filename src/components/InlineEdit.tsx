"use client";

import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";

/* ═══════════════════════════════════════════════════════════════════
   INLINE EDIT CONTEXT
   ═══════════════════════════════════════════════════════════════════ */

interface PendingChange {
  key: string;
  label: string;
  data: unknown;
}

export interface SidebarAction {
  type: 'add' | 'duplicate' | 'delete';
  label: string;
  onClick: () => void;
}

export interface ActiveSectionInfo {
  id: string;
  label: string;
  contentKey: string;
  actions?: SidebarAction[];
}

interface InlineEditContextValue {
  isAdmin: boolean;
  editMode: boolean;
  toggleEditMode: () => void;
  // Global dirty tracking
  registerChange: (key: string, label: string, data: unknown) => void;
  clearChange: (key: string) => void;
  pendingChanges: Map<string, PendingChange>;
  saveAll: () => Promise<void>;
  cancelAll: () => void;
  globalSaving: boolean;
  // Active section tracking
  activeSection: ActiveSectionInfo | null;
  setActiveSection: React.Dispatch<React.SetStateAction<ActiveSectionInfo | null>>;
  // Sidebar open state
  sidebarOpen: boolean;
  setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const InlineEditContext = createContext<InlineEditContextValue>({
  isAdmin: false,
  editMode: false,
  toggleEditMode: () => {},
  registerChange: () => {},
  clearChange: () => {},
  pendingChanges: new Map(),
  saveAll: async () => {},
  cancelAll: () => {},
  globalSaving: false,
  activeSection: null,
  setActiveSection: () => {},
  sidebarOpen: false,
  setSidebarOpen: () => {},
});

export function useInlineEdit() {
  return useContext(InlineEditContext);
}

/** Hook for components to register sidebar actions (e.g. "Add Service", "Add Product") */
export function useSidebarActions(actions: SidebarAction[], deps: React.DependencyList) {
  const { activeSection, setActiveSection } = useContext(InlineEditContext);
  const sectionId = activeSection?.id;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const memoActions = useCallback(() => actions, deps);
  useEffect(() => {
    if (sectionId) {
      setActiveSection((prev) => prev ? { ...prev, actions: memoActions() } : prev);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sectionId, memoActions]);
}

interface Props {
  isAdmin: boolean;
  children: React.ReactNode;
}

export function InlineEditProvider({ isAdmin, children }: Props) {
  const [editMode, setEditMode] = useState(false);
  const [pendingChanges, setPendingChanges] = useState<Map<string, PendingChange>>(new Map());
  const [globalSaving, setGlobalSaving] = useState(false);
  const [activeSection, setActiveSection] = useState<ActiveSectionInfo | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Auto-open sidebar when entering edit mode
  useEffect(() => {
    if (editMode) setSidebarOpen(true);
  }, [editMode]);

  // Auto-activate edit mode when sidebar is opened
  useEffect(() => {
    if (sidebarOpen && !editMode) setEditMode(true);
  }, [sidebarOpen, editMode]);

  const toggleEditMode = useCallback(() => {
    setEditMode((prev) => {
      if (prev) {
        setPendingChanges(new Map());
        setActiveSection(null);
        setSidebarOpen(false);
      }
      return !prev;
    });
  }, []);

  const registerChange = useCallback((key: string, label: string, data: unknown) => {
    setPendingChanges((prev) => {
      const next = new Map(prev);
      next.set(key, { key, label, data });
      return next;
    });
  }, []);

  const clearChange = useCallback((key: string) => {
    setPendingChanges((prev) => {
      const next = new Map(prev);
      next.delete(key);
      return next;
    });
  }, []);

  const saveAll = useCallback(async () => {
    if (pendingChanges.size === 0) return;
    setGlobalSaving(true);
    try {
      const promises = Array.from(pendingChanges.values()).map((change) =>
        fetch("/api/admin/inline-save", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ key: change.key, data: change.data }),
        })
      );
      await Promise.all(promises);
      setPendingChanges(new Map());
      setTimeout(() => window.location.reload(), 400);
    } finally {
      setGlobalSaving(false);
    }
  }, [pendingChanges]);

  const cancelAll = useCallback(() => {
    setPendingChanges(new Map());
    setEditMode(false);
    window.location.reload();
  }, []);

  useEffect(() => {
    if (!isAdmin) return;
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "e") {
        e.preventDefault();
        toggleEditMode();
      }
      // Ctrl+S to save all
      if ((e.ctrlKey || e.metaKey) && e.key === "s" && editMode && pendingChanges.size > 0) {
        e.preventDefault();
        saveAll();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isAdmin, toggleEditMode, editMode, pendingChanges, saveAll]);

  return (
    <InlineEditContext.Provider value={{ isAdmin, editMode, toggleEditMode, registerChange, clearChange, pendingChanges, saveAll, cancelAll, globalSaving, activeSection, setActiveSection, sidebarOpen, setSidebarOpen }}>
      {isAdmin ? (
        <div className="flex min-h-screen">
          <div className={`flex-1 min-w-0 transition-all duration-300 ease-out ${sidebarOpen ? 'mr-[300px]' : ''}`}>
            {children}
          </div>
          <AdminSidebar />
        </div>
      ) : (
        children
      )}
    </InlineEditContext.Provider>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   ADMIN SIDEBAR — Full right-edge panel with edit controls,
   section list, pending changes, and save/discard.
   ═══════════════════════════════════════════════════════════════════ */

const SECTIONS = [
  { id: "hero", label: "Hero", key: "site:hero" },
  { id: "services", label: "Services", key: "site:services" },
  { id: "products", label: "Products", key: "site:products" },
  { id: "dealers", label: "Dealers", key: "site:dealers" },
  { id: "portfolio", label: "Portfolio", key: "site:portfolio" },
  { id: "testimonials", label: "Testimonials", key: "site:testimonials" },
  { id: "trust", label: "Trust", key: "site:trust" },
  { id: "contact", label: "Contact", key: "site:contact" },
];

function AdminSidebar() {
  const { editMode, toggleEditMode, pendingChanges, saveAll, cancelAll, globalSaving, activeSection, sidebarOpen: open, setSidebarOpen: setOpen } = useInlineEdit();
  const count = pendingChanges.size;

  const scrollTo = (sectionId: string) => {
    const el = document.querySelector(`[data-section="${sectionId}"]`);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <>
      {/* Toggle tab — always visible on right edge */}
      <button
        onClick={() => setOpen((p) => !p)}
        className={`fixed top-20 right-0 z-[1001] flex items-center justify-center w-10 h-10 rounded-l-[10px] shadow-[0_4px_20px_rgba(0,0,0,0.3)] border border-r-0 border-white/10 transition-all duration-200 ${
          open ? "opacity-0 pointer-events-none" : ""
        } ${editMode ? "bg-amber-500" : "bg-[#111]"}`}
        title="Admin Panel"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 20h9M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z" />
        </svg>
        {count > 0 && (
          <span className="absolute -top-1 -left-1 w-4 h-4 rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center">
            {count}
          </span>
        )}
      </button>

      {/* Sidebar panel — fixed to right, content pushes via margin */}
      <div
        className={`fixed top-0 right-0 h-full w-[300px] bg-[#0F0F0F] z-[1001] flex flex-col border-l border-white/8 shadow-[-4px_0_20px_rgba(0,0,0,0.3)] transition-transform duration-300 ease-out ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 pt-4 pb-3 border-b border-white/8">
          <div className="flex items-center gap-2.5">
            <div className={`w-2 h-2 rounded-full shrink-0 ${editMode ? "bg-amber-400 animate-pulse" : "bg-emerald-400"}`} />
            <span className="text-[13px] text-white/90 font-semibold tracking-tight">Admin</span>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="w-7 h-7 rounded-[6px] flex items-center justify-center text-white/40 hover:text-white/80 hover:bg-white/10 transition-all"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12" /></svg>
          </button>
        </div>

        {/* Edit mode toggle */}
        <div className="px-4 py-3 border-b border-white/8">
          <button
            onClick={toggleEditMode}
            className={`w-full flex items-center justify-center gap-2 h-[36px] rounded-[8px] text-[12px] font-semibold transition-all ${
              editMode
                ? "bg-amber-500 text-white hover:bg-amber-600"
                : "bg-white/10 text-white/80 hover:bg-white/15"
            }`}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 20h9M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z" />
            </svg>
            {editMode ? "Exit Edit Mode" : "Edit Page"}
          </button>
          <p className="text-[10px] text-white/30 mt-1.5 text-center">Ctrl+E to toggle</p>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto">
          {/* Active section properties panel */}
          {editMode && activeSection && (
            <div className="px-4 py-3 border-b border-white/8">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-1.5 h-5 rounded-full bg-[#0000B8]" />
                <span className="text-[12px] text-white/90 font-semibold">{activeSection.label}</span>
              </div>

              {/* Section actions */}
              {activeSection.actions && activeSection.actions.length > 0 && (
                <div className="flex flex-col gap-1.5">
                  {activeSection.actions.map((action, i) => (
                    <button
                      key={i}
                      onClick={action.onClick}
                      className={`w-full flex items-center gap-2 h-[32px] px-3 rounded-[7px] text-[11px] font-medium transition-all ${
                        action.type === 'add'
                          ? 'bg-[#0000B8]/15 text-[#8888FF] hover:bg-[#0000B8]/25'
                          : action.type === 'delete'
                            ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20'
                            : 'bg-white/8 text-white/60 hover:bg-white/12'
                      }`}
                    >
                      {action.type === 'add' && (
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M12 5v14M5 12h14" /></svg>
                      )}
                      {action.type === 'duplicate' && (
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" /></svg>
                      )}
                      {action.type === 'delete' && (
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2" /></svg>
                      )}
                      {action.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Sections list */}
          {editMode && (
            <div className="px-4 py-3">
              <p className="text-[10px] text-white/40 font-semibold uppercase tracking-wider mb-2">Sections</p>
              <div className="flex flex-col gap-1">
                {SECTIONS.map((s) => {
                  const isDirty = pendingChanges.has(s.key);
                  const isActive = activeSection?.id === s.id;
                  return (
                    <button
                      key={s.id}
                      onClick={() => scrollTo(s.id)}
                      className={`flex items-center gap-2.5 h-[34px] px-3 rounded-[7px] text-left text-[12px] font-medium transition-all ${
                        isActive
                          ? "bg-[#0000B8]/20 text-[#8888FF] ring-1 ring-[#0000B8]/30"
                          : isDirty
                            ? "bg-amber-500/15 text-amber-300 hover:bg-amber-500/25"
                            : "text-white/60 hover:bg-white/8 hover:text-white/80"
                      }`}
                    >
                      {isDirty ? (
                        <div className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                      ) : isActive ? (
                        <div className="w-1.5 h-1.5 rounded-full bg-[#0000B8] shrink-0" />
                      ) : null}
                      <span className={isDirty || isActive ? "" : "ml-4"}>{s.label}</span>
                      {isDirty && (
                        <span className="ml-auto text-[9px] text-amber-400/60 font-normal">modified</span>
                      )}
                      {isActive && !isDirty && (
                        <span className="ml-auto text-[9px] text-[#0000B8]/60 font-normal">editing</span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Bottom actions */}
        <div className="mt-auto border-t border-white/8 px-4 py-3 flex flex-col gap-2">
          {editMode && count > 0 && (
            <>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse shrink-0" />
                <span className="text-[11px] text-white/50">
                  {count} {count === 1 ? "section" : "sections"} modified
                </span>
              </div>
              <button
                onClick={saveAll}
                disabled={globalSaving}
                className="w-full flex items-center justify-center gap-2 h-[36px] rounded-[8px] bg-[#0000B8] text-white text-[12px] font-semibold hover:bg-[#000096] transition-all disabled:opacity-50"
              >
                {globalSaving ? (
                  <svg className="animate-spin w-3.5 h-3.5" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
                ) : (
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M20 6L9 17l-5-5"/></svg>
                )}
                {globalSaving ? "Saving…" : "Save All"}
              </button>
              <button
                onClick={cancelAll}
                disabled={globalSaving}
                className="w-full flex items-center justify-center h-[34px] rounded-[8px] text-[12px] font-medium text-white/40 hover:text-white/70 hover:bg-white/8 transition-all disabled:opacity-50"
              >
                Discard Changes
              </button>
              <p className="text-[9px] text-white/20 text-center">Ctrl+S to save</p>
            </>
          )}

          <a
            href="/admin"
            className="w-full flex items-center justify-center gap-2 h-[34px] rounded-[8px] bg-white/8 text-white/60 text-[12px] font-medium hover:bg-white/12 hover:text-white/80 transition-all"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
            </svg>
            Admin Panel
          </a>
        </div>
      </div>
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   EDITABLE SECTION — Wraps a section, shows edit trigger, manages
   inline editing state. Passes `editing` and `onSave` to child.
   ═══════════════════════════════════════════════════════════════════ */

interface EditableSectionProps {
  children: React.ReactElement<{ editing?: boolean; onSave?: (data: unknown) => void }>;
  sectionId: string;
  label: string;
  contentKey: string;
}

export function EditableSection({ children, sectionId, label, contentKey }: EditableSectionProps) {
  const { editMode, registerChange, clearChange, setActiveSection } = useInlineEdit();
  const [isEditing, setIsEditing] = useState(false);
  const initialDataRef = useRef<string | null>(null);

  // Store latest data from child and register/clear global changes
  const handleChildSave = useCallback((data: unknown) => {
    const serialized = JSON.stringify(data);
    if (initialDataRef.current === null) {
      initialDataRef.current = serialized;
    } else if (serialized !== initialDataRef.current) {
      registerChange(contentKey, label, data);
    } else {
      clearChange(contentKey);
    }
  }, [contentKey, label, registerChange, clearChange]);

  // Register/unregister active section
  useEffect(() => {
    if (isEditing) {
      setActiveSection({ id: sectionId, label, contentKey });
    } else {
      setActiveSection((prev) => prev?.id === sectionId ? null : prev);
    }
  }, [isEditing, sectionId, label, contentKey, setActiveSection]);

  // Reset when exiting edit mode
  useEffect(() => {
    if (!editMode) {
      setIsEditing(false);
      initialDataRef.current = null;
    }
  }, [editMode]);

  if (!editMode) return <>{children}</>;

  const enhancedChild = React.cloneElement(children, {
    editing: isEditing,
    onSave: handleChildSave,
  });

  return (
    <div className="group/edit relative" data-section={sectionId}>
      {enhancedChild}

      {/* Hover indicator — only when NOT editing this section */}
      {!isEditing && (
        <div className="absolute inset-0 pointer-events-none group-hover/edit:pointer-events-auto z-[50]">
          <div className="absolute inset-0 rounded-[4px] ring-0 group-hover/edit:ring-2 ring-inset ring-[#0000B8]/20 transition-all duration-150" />
          <div className="absolute -top-px left-0 right-0 flex items-center justify-between opacity-0 group-hover/edit:opacity-100 transition-opacity duration-150">
            <span className="h-[22px] px-2 rounded-b-[5px] bg-[#0000B8] text-white text-[10px] font-semibold flex items-center tracking-wide uppercase">
              {label}
            </span>
            <button
              onClick={() => setIsEditing(true)}
              className="h-[28px] px-3 rounded-b-[6px] bg-[#0000B8] text-white text-[11px] font-semibold flex items-center gap-1.5 hover:bg-[#000096] transition-colors shadow-sm"
            >
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 20h9M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z" />
              </svg>
              Edit
            </button>
          </div>
        </div>
      )}

      {/* Active editing indicator — thin top accent line */}
      {isEditing && (
        <>
          <div className="absolute inset-0 pointer-events-none z-[49] rounded-[4px] ring-2 ring-inset ring-[#0000B8]/30" />
          <div className="absolute -top-px left-0 right-0 h-[3px] bg-[#0000B8] rounded-b-full pointer-events-none z-[50]" />
        </>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   EDITABLE — Canva-style inline contentEditable wrapper
   Makes any text element editable in place.
   ═══════════════════════════════════════════════════════════════════ */

interface EditableProps {
  value: string;
  onChange: (val: string) => void;
  tag?: keyof React.JSX.IntrinsicElements;
  className?: string;
  multiline?: boolean;
  editing?: boolean;
}

export function Editable({ value, onChange, tag: Tag = "span", className = "", multiline = false, editing = false }: EditableProps) {
  const elRef = useRef<HTMLElement>(null);
  const lastValue = useRef(value);

  // Sync DOM if value changed externally
  useEffect(() => {
    if (elRef.current && elRef.current.textContent !== value) {
      elRef.current.textContent = value;
    }
    lastValue.current = value;
  }, [value]);

  if (!editing) {
    return React.createElement(Tag, { className }, value);
  }

  const handleInput = () => {
    const text = elRef.current?.textContent ?? "";
    if (text !== lastValue.current) {
      lastValue.current = text;
      onChange(text);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!multiline && e.key === "Enter") {
      e.preventDefault();
      (e.target as HTMLElement).blur();
    }
  };

  return React.createElement(Tag, {
    ref: elRef,
    className: `${className} outline-none border-b border-dashed border-[#0000B8]/25 hover:border-[#0000B8]/50 focus:border-solid focus:border-[#0000B8]/60 cursor-text transition-all duration-150`,
    contentEditable: true,
    suppressContentEditableWarning: true,
    onInput: handleInput,
    onKeyDown: handleKeyDown,
    children: value,
  } as React.HTMLAttributes<HTMLElement>);
}

/* ═══════════════════════════════════════════════════════════════════
   EDITABLE IMAGE — Click image to change URL or pick from library
   ═══════════════════════════════════════════════════════════════════ */

interface EditableImageProps {
  src: string;
  onChange: (url: string) => void;
  editing?: boolean;
  className?: string;
  children: React.ReactNode; // the existing <Image> or img element
}

export function EditableImage({ src, onChange, editing, className = "", children }: EditableImageProps) {
  const [open, setOpen] = useState(false);
  const [url, setUrl] = useState(src);
  const [uploading, setUploading] = useState(false);
  const [showLibrary, setShowLibrary] = useState(false);
  const [libraryFiles, setLibraryFiles] = useState<{ path: string; name: string; url: string; type: string }[]>([]);
  const [libraryLoading, setLibraryLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { setUrl(src); }, [src]);

  const handleUpload = async (fileList: FileList | null) => {
    if (!fileList || !fileList.length) return;
    setUploading(true);
    const formData = new FormData();
    for (let i = 0; i < fileList.length; i++) formData.append("files", fileList[i]);
    try {
      const res = await fetch("/api/media", { method: "POST", body: formData });
      if (!res.ok) return;
      const data = await res.json();
      if (data.files?.[0]) {
        onChange(data.files[0].url);
        setOpen(false);
      }
    } finally {
      setUploading(false);
    }
  };

  const loadLibrary = async () => {
    setShowLibrary(true);
    setLibraryLoading(true);
    try {
      const res = await fetch("/api/media");
      if (!res.ok) return;
      const data = await res.json();
      setLibraryFiles((data.files || []).filter((f: { type: string }) => f.type.startsWith("image/")));
    } finally {
      setLibraryLoading(false);
    }
  };

  if (!editing) return <>{children}</>;

  return (
    <div className={`group/img ${className}`}>
      {children}
      {/* Persistent edit button */}
      <button
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); setOpen((p) => !p); }}
        className="absolute top-3 right-3 w-9 h-9 rounded-[10px] bg-[#0000B8] hover:bg-[#000096] text-white flex items-center justify-center shadow-[0_4px_16px_rgba(0,0,0,0.4)] transition-all hover:scale-105 active:scale-95"
        style={{ zIndex: 999, position: 'absolute' }}
        title="Change Image"
      >
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><path d="m21 15-5-5L5 21" />
        </svg>
      </button>
      {/* Hidden file input */}
      <input ref={fileInputRef} type="file" className="hidden" accept="image/*" onChange={(e) => handleUpload(e.target.files)} />
      {/* Image edit popover */}
      {open && !showLibrary && (
        <div
          className="absolute top-14 right-3 w-[280px] bg-white rounded-[12px] shadow-[0_12px_40px_rgba(0,0,0,0.35)] border border-[#E5E7EB] p-3"
          style={{ zIndex: 1000, position: 'absolute' }}
          onClick={(e) => e.stopPropagation()}
        >
          <p className="text-[11px] font-semibold text-[#666] mb-2">Image URL</p>
          <div className="flex gap-2 mb-3">
            <input
              ref={inputRef}
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") { onChange(url); setOpen(false); } if (e.key === "Escape") setOpen(false); }}
              placeholder="https://..."
              className="flex-1 h-[36px] px-3 rounded-[8px] border border-[#E5E7EB] bg-[#FAFAFA] text-[12px] text-[#111] focus:outline-none focus:border-[#0000B8] focus:ring-2 focus:ring-[#0000B8]/10"
            />
            <button
              onClick={() => { onChange(url); setOpen(false); }}
              className="h-[36px] px-3 rounded-[8px] bg-[#0000B8] text-white text-[11px] font-semibold hover:bg-[#000096] transition-all shrink-0"
            >
              Apply
            </button>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="flex-1 flex items-center justify-center gap-1.5 h-[34px] rounded-[8px] bg-[#111] text-white text-[11px] font-semibold hover:bg-[#333] transition-all disabled:opacity-50"
            >
              {uploading ? (
                <svg className="animate-spin w-3 h-3" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
              ) : (
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" /></svg>
              )}
              {uploading ? "Uploading…" : "Upload"}
            </button>
            <button
              onClick={loadLibrary}
              className="flex-1 flex items-center justify-center gap-1.5 h-[34px] rounded-[8px] bg-white border border-[#E5E7EB] text-[#333] text-[11px] font-semibold hover:bg-[#F5F5F5] transition-all"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /></svg>
              Library
            </button>
          </div>
          <button onClick={() => setOpen(false)} className="absolute top-2 right-2 w-6 h-6 flex items-center justify-center text-[#999] hover:text-[#333] text-[14px]">×</button>
        </div>
      )}
      {/* Media library modal */}
      {showLibrary && (
        <div className="fixed inset-0 z-[1100] flex items-center justify-center bg-black/50 p-4" onClick={(e) => { e.stopPropagation(); setShowLibrary(false); }}>
          <div className="bg-white rounded-[16px] shadow-2xl w-full max-w-[600px] max-h-[70vh] flex flex-col overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-5 py-3 border-b border-[#E5E7EB]">
              <h3 className="text-[14px] font-bold text-[#111]">Media Library</h3>
              <div className="flex items-center gap-2">
                <label className={`cursor-pointer px-3 py-1.5 rounded-[7px] bg-[#111] text-white text-[11px] font-medium hover:bg-[#333] transition-colors ${uploading ? "opacity-50 pointer-events-none" : ""}`}>
                  {uploading ? "Uploading…" : "Upload"}
                  <input type="file" className="hidden" accept="image/*" multiple onChange={(e) => { handleUpload(e.target.files); }} />
                </label>
                <button onClick={() => setShowLibrary(false)} className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-[#F0F0F0] text-[#666] text-[16px]">×</button>
              </div>
            </div>
            <div className="flex-1 overflow-auto p-4">
              {libraryLoading ? (
                <p className="text-[13px] text-[#888] text-center py-8">Loading…</p>
              ) : libraryFiles.length === 0 ? (
                <p className="text-[13px] text-[#888] text-center py-8">No images yet. Upload one above.</p>
              ) : (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                  {libraryFiles.map((file) => (
                    <button
                      key={file.path}
                      onClick={() => { onChange(file.url); setShowLibrary(false); setOpen(false); }}
                      className={`relative rounded-[10px] border-2 overflow-hidden aspect-square group transition-all ${
                        src === file.url ? "border-[#0000B8] ring-2 ring-[#0000B8]/20" : "border-[#E5E7EB] hover:border-[#999]"
                      }`}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={file.url} alt={file.name} className="w-full h-full object-cover" />
                      {src === file.url && (
                        <div className="absolute top-1 right-1 w-5 h-5 bg-[#0000B8] rounded-full flex items-center justify-center text-white text-[11px]">✓</div>
                      )}
                      <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-[10px] px-1.5 py-1 truncate opacity-0 group-hover:opacity-100 transition-opacity">
                        {file.name}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   EDITABLE TAGS — Inline tag editor with add/remove
   ═══════════════════════════════════════════════════════════════════ */

interface EditableTagsProps {
  tags: string[];
  onChange: (tags: string[]) => void;
  editing?: boolean;
  tagClassName?: string;
  containerClassName?: string;
  accentColor?: string;
}

export function EditableTags({ tags, onChange, editing, tagClassName = "", containerClassName = "", accentColor }: EditableTagsProps) {
  const [adding, setAdding] = useState(false);
  const [newTag, setNewTag] = useState("");
  const [editingIdx, setEditingIdx] = useState<number | null>(null);
  const [editValue, setEditValue] = useState("");
  const [dragFrom, setDragFrom] = useState<number | null>(null);
  const [dragOver, setDragOver] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const editRef = useRef<HTMLInputElement>(null);

  useEffect(() => { if (adding) inputRef.current?.focus(); }, [adding]);
  useEffect(() => { if (editingIdx !== null) editRef.current?.focus(); }, [editingIdx]);

  if (!editing) {
    return (
      <div className={containerClassName}>
        {tags.map((tag) => (
          <span key={tag} className={tagClassName} style={accentColor ? { backgroundColor: `${accentColor}0D`, color: accentColor } : undefined}>
            {tag}
          </span>
        ))}
      </div>
    );
  }

  const remove = (i: number) => onChange(tags.filter((_, idx) => idx !== i));
  const add = () => {
    const t = newTag.trim();
    if (t && !tags.includes(t)) onChange([...tags, t]);
    setNewTag("");
    setAdding(false);
  };
  const commitEdit = () => {
    if (editingIdx === null) return;
    const v = editValue.trim();
    if (v && v !== tags[editingIdx]) {
      onChange(tags.map((t, i) => i === editingIdx ? v : t));
    }
    setEditingIdx(null);
    setEditValue("");
  };
  const startEdit = (i: number) => {
    setEditingIdx(i);
    setEditValue(tags[i]);
  };

  // Tag drag handlers
  const onTagDragStart = (i: number, e: React.DragEvent) => {
    setDragFrom(i);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", String(i));
  };
  const onTagDragOver = (i: number, e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOver(i);
  };
  const onTagDrop = (i: number, e: React.DragEvent) => {
    e.preventDefault();
    if (dragFrom !== null && dragFrom !== i) {
      const next = [...tags];
      const [item] = next.splice(dragFrom, 1);
      next.splice(i, 0, item);
      onChange(next);
    }
    setDragFrom(null);
    setDragOver(null);
  };
  const onTagDragEnd = () => { setDragFrom(null); setDragOver(null); };

  return (
    <div className={containerClassName}>
      {tags.map((tag, i) => (
        editingIdx === i ? (
          <input
            key={`edit-${i}`}
            ref={editRef}
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); commitEdit(); } if (e.key === "Escape") { setEditingIdx(null); setEditValue(""); } }}
            onBlur={commitEdit}
            className="h-[28px] w-[100px] px-2 rounded-full border-2 border-[#0000B8]/60 bg-white text-[11px] text-[#111] focus:outline-none"
          />
        ) : (
          <span
            key={`${tag}-${i}`}
            draggable
            onDragStart={(e) => onTagDragStart(i, e)}
            onDragOver={(e) => onTagDragOver(i, e)}
            onDragLeave={() => setDragOver(null)}
            onDrop={(e) => onTagDrop(i, e)}
            onDragEnd={onTagDragEnd}
            className={`${tagClassName} relative group/tag pr-5 cursor-grab active:cursor-grabbing select-none transition-all ${
              dragFrom === i ? "opacity-40 scale-95" : ""
            } ${dragOver === i && dragFrom !== i ? "ring-2 ring-[#0000B8]/50 ring-offset-1" : ""}`}
            style={accentColor ? { backgroundColor: `${accentColor}0D`, color: accentColor } : undefined}
            onDoubleClick={() => startEdit(i)}
          >
            {tag}
            <button
              onClick={() => remove(i)}
              className="absolute top-1/2 -translate-y-1/2 right-1 w-3.5 h-3.5 rounded-full bg-red-500 text-white text-[8px] flex items-center justify-center opacity-0 group-hover/tag:opacity-100 transition-opacity"
            >
              ×
            </button>
          </span>
        )
      ))}
      {adding ? (
        <input
          ref={inputRef}
          value={newTag}
          onChange={(e) => setNewTag(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); add(); } if (e.key === "Escape") { setAdding(false); setNewTag(""); } }}
          onBlur={add}
          placeholder="New tag..."
          className="h-[28px] w-[100px] px-2 rounded-full border border-dashed border-[#0000B8]/40 bg-white text-[11px] text-[#111] focus:outline-none focus:border-[#0000B8]"
        />
      ) : (
        <button
          onClick={() => setAdding(true)}
          className="h-[28px] px-2.5 rounded-full border border-dashed border-[#0000B8]/30 text-[11px] font-medium text-[#0000B8]/60 hover:border-[#0000B8] hover:text-[#0000B8] transition-all"
        >
          + Add
        </button>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   DRAG HANDLE — Gesture-based reorder with drag & drop
   Click-and-hold grip handle. Uses HTML5 DnD on desktop,
   touch events on mobile.
   ═══════════════════════════════════════════════════════════════════ */

interface DragHandleProps {
  index: number;
  listId: string;
  onReorder: (from: number, to: number) => void;
  editing?: boolean;
}

// Shared state across DragHandle instances within the same listId
const dragState: { listId: string | null; fromIndex: number; overIndex: number } = {
  listId: null,
  fromIndex: -1,
  overIndex: -1,
};

export function DragHandle({ index, listId, onReorder, editing }: DragHandleProps) {
  const handleRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isOver, setIsOver] = useState(false);

  if (!editing) return null;

  const onDragStart = (e: React.DragEvent) => {
    dragState.listId = listId;
    dragState.fromIndex = index;
    dragState.overIndex = index;
    setIsDragging(true);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", String(index));
    // Style the drag image
    const el = handleRef.current?.closest("[data-drag-item]") as HTMLElement | null;
    if (el) {
      el.style.opacity = "0.5";
      e.dataTransfer.setDragImage(el, 20, 20);
    }
  };

  const onDragEnd = () => {
    setIsDragging(false);
    // Restore opacity
    const el = handleRef.current?.closest("[data-drag-item]") as HTMLElement | null;
    if (el) el.style.opacity = "1";
    if (dragState.listId === listId && dragState.fromIndex !== dragState.overIndex) {
      onReorder(dragState.fromIndex, dragState.overIndex);
    }
    dragState.listId = null;
    dragState.fromIndex = -1;
    dragState.overIndex = -1;
  };

  const onDragOver = (e: React.DragEvent) => {
    if (dragState.listId !== listId) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    dragState.overIndex = index;
    setIsOver(true);
  };

  const onDragLeave = () => {
    setIsOver(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsOver(false);
    if (dragState.listId !== listId) return;
    const from = dragState.fromIndex;
    if (from !== index) {
      onReorder(from, index);
    }
    dragState.listId = null;
    dragState.fromIndex = -1;
    dragState.overIndex = -1;
  };

  return (
    <div
      ref={handleRef}
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      className={`flex items-center justify-center w-7 h-8 rounded-[6px] cursor-grab active:cursor-grabbing
        transition-all duration-150 shrink-0 select-none
        ${isDragging
          ? "bg-[#0000B8] text-white scale-110 shadow-lg"
          : isOver
            ? "bg-[#0000B8]/10 text-[#0000B8] ring-2 ring-[#0000B8]/40"
            : "bg-white/80 border border-[#E5E7EB] text-[#999] hover:bg-[#0000B8]/10 hover:text-[#0000B8] hover:border-[#0000B8]/30"
        }`}
      title="Drag to reorder"
    >
      {/* Grip dots icon (6 dots) */}
      <svg width="12" height="16" viewBox="0 0 12 16" fill="currentColor">
        <circle cx="3.5" cy="2.5" r="1.5" />
        <circle cx="8.5" cy="2.5" r="1.5" />
        <circle cx="3.5" cy="8" r="1.5" />
        <circle cx="8.5" cy="8" r="1.5" />
        <circle cx="3.5" cy="13.5" r="1.5" />
        <circle cx="8.5" cy="13.5" r="1.5" />
      </svg>
    </div>
  );
}

// Keep ReorderButtons exported for backwards compat (but DragHandle is preferred)
interface ReorderProps {
  index: number;
  total: number;
  onMove: (from: number, to: number) => void;
  editing?: boolean;
}

export function ReorderButtons({ index, total, onMove, editing }: ReorderProps) {
  if (!editing) return null;
  return (
    <div className="flex flex-col gap-0.5">
      <button
        disabled={index === 0}
        onClick={() => onMove(index, index - 1)}
        className="w-6 h-6 rounded-[6px] bg-white/80 border border-[#E5E7EB] flex items-center justify-center text-[#666] hover:bg-[#0000B8] hover:text-white hover:border-transparent disabled:opacity-30 disabled:hover:bg-white/80 disabled:hover:text-[#666] disabled:hover:border-[#E5E7EB] transition-all"
        title="Move up"
      >
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M18 15l-6-6-6 6" /></svg>
      </button>
      <button
        disabled={index === total - 1}
        onClick={() => onMove(index, index + 1)}
        className="w-6 h-6 rounded-[6px] bg-white/80 border border-[#E5E7EB] flex items-center justify-center text-[#666] hover:bg-[#0000B8] hover:text-white hover:border-transparent disabled:opacity-30 disabled:hover:bg-white/80 disabled:hover:text-[#666] disabled:hover:border-[#E5E7EB] transition-all"
        title="Move down"
      >
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M6 9l6 6 6-6" /></svg>
      </button>
    </div>
  );
}

/** Swap two indices in an array immutably */
export function reorder<T>(arr: T[], from: number, to: number): T[] {
  if (from < 0 || to < 0 || from >= arr.length || to >= arr.length) return arr;
  const next = [...arr];
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item);
  return next;
}
