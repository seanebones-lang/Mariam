"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { CheckCircle2, AlertTriangle, Info, X } from "lucide-react";
import { cn } from "@/lib/utils";

type ToastTone = "success" | "error" | "info";
type Toast = {
  id: string;
  title?: string;
  message: string;
  tone: ToastTone;
};

type ToastContextValue = {
  toast: (t: Omit<Toast, "id" | "tone"> & { tone?: ToastTone }) => void;
  success: (message: string, title?: string) => void;
  error: (message: string, title?: string) => void;
  info: (message: string, title?: string) => void;
  dismiss: (id: string) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    return {
      toast: () => {},
      success: () => {},
      error: () => {},
      info: () => {},
      dismiss: () => {},
    };
  }
  return ctx;
}

const TONE_STYLES: Record<ToastTone, string> = {
  success: "border-emerald-400/30 bg-char text-bone",
  error: "border-blood/60 bg-char text-bone",
  info: "border-bone/20 bg-char text-bone",
};

const TONE_ACCENT: Record<ToastTone, string> = {
  success: "text-emerald-300",
  error: "text-blood",
  info: "text-bone/70",
};

function Icon({ tone }: { tone: ToastTone }) {
  const className = cn("h-4 w-4 shrink-0", TONE_ACCENT[tone]);
  if (tone === "success") return <CheckCircle2 className={className} aria-hidden />;
  if (tone === "error") return <AlertTriangle className={className} aria-hidden />;
  return <Info className={className} aria-hidden />;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<Toast[]>([]);
  const timers = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

  const dismiss = useCallback((id: string) => {
    setItems((list) => list.filter((t) => t.id !== id));
    const handle = timers.current.get(id);
    if (handle) {
      clearTimeout(handle);
      timers.current.delete(id);
    }
  }, []);

  const push = useCallback(
    (t: Omit<Toast, "id" | "tone"> & { tone?: ToastTone }) => {
      const id = Math.random().toString(36).slice(2, 10);
      const item: Toast = { id, tone: t.tone ?? "info", title: t.title, message: t.message };
      setItems((list) => [...list, item]);
      const handle = setTimeout(() => dismiss(id), item.tone === "error" ? 7000 : 4500);
      timers.current.set(id, handle);
    },
    [dismiss]
  );

  useEffect(() => {
    const ts = timers.current;
    return () => {
      ts.forEach((h) => clearTimeout(h));
      ts.clear();
    };
  }, []);

  const value = useMemo<ToastContextValue>(
    () => ({
      toast: push,
      success: (message, title) => push({ message, title, tone: "success" }),
      error: (message, title) => push({ message, title, tone: "error" }),
      info: (message, title) => push({ message, title, tone: "info" }),
      dismiss,
    }),
    [push, dismiss]
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        aria-live="polite"
        aria-atomic="false"
        className="pointer-events-none fixed inset-x-0 z-[120] flex flex-col items-center gap-2 px-4"
        style={{
          bottom: "calc(env(safe-area-inset-bottom) + 1rem)",
        }}
      >
        {items.map((t) => (
          <div
            key={t.id}
            role={t.tone === "error" ? "alert" : "status"}
            className={cn(
              "pointer-events-auto flex w-full max-w-sm items-start gap-3 border px-4 py-3 text-sm shadow-[0_0_30px_rgba(0,0,0,0.6)] backdrop-blur",
              "mbb-rise-in",
              TONE_STYLES[t.tone]
            )}
          >
            <Icon tone={t.tone} />
            <div className="min-w-0 flex-1">
              {t.title ? (
                <p className={cn("font-mono text-[10px] uppercase tracking-[0.3em]", TONE_ACCENT[t.tone])}>
                  {t.title}
                </p>
              ) : null}
              <p className="break-words leading-relaxed text-bone/90">{t.message}</p>
            </div>
            <button
              type="button"
              onClick={() => dismiss(t.id)}
              className="-mr-1 -mt-1 p-1 text-bone/50 hover:text-bone"
              aria-label="Dismiss"
            >
              <X className="h-3.5 w-3.5" aria-hidden />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
