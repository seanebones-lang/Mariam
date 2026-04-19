"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { MessageCircle, Mic, Send, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/toast";
import { cn } from "@/lib/utils";

type Msg = { role: "user" | "assistant"; content: string };

const STORAGE_KEY = "mbb_concierge_v1";
const GREETING: Msg = {
  role: "assistant",
  content:
    "Welcome. I can check open slots, walk you through aftercare, rough-quote a piece, or hand you off to the booking flow. What can I help with?",
};

const SUGGESTIONS = [
  "What's the next opening?",
  "How does Saniderm aftercare work?",
  "Quote a small blackwork piece on the forearm.",
];

export function Concierge() {
  const toast = useToast();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [msgs, setMsgs] = useState<Msg[]>([GREETING]);
  const [loading, setLoading] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const listRef = useRef<HTMLDivElement | null>(null);
  const closeBtnRef = useRef<HTMLButtonElement | null>(null);
  const openerRef = useRef<HTMLButtonElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const hydrated = useRef(false);

  useEffect(() => {
    queueMicrotask(() => {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw) as Msg[];
          if (Array.isArray(parsed) && parsed.length) setMsgs(parsed);
        }
      } catch {
        /* ignore */
      } finally {
        hydrated.current = true;
      }
    });
  }, []);

  useEffect(() => {
    if (!hydrated.current) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(msgs.slice(-30)));
    } catch {
      /* ignore */
    }
  }, [msgs]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeBtnRef.current?.focus();
    const opener = openerRef.current;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
      opener?.focus();
    };
  }, [open]);

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [msgs, loading, open]);

  const sendText = useCallback(
    async (raw: string) => {
      const t = raw.trim();
      if (!t || loading) return;
      setInput("");
      const next: Msg[] = [...msgs, { role: "user", content: t }];
      setMsgs(next);
      setLoading(true);
      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: next.map((m) => ({ role: m.role, content: m.content })),
          }),
        });
        if (!res.ok) {
          const err = await res.text();
          setMsgs((m) => [
            ...m,
            {
              role: "assistant",
              content:
                "I couldn't reach the studio just now. Please try again in a moment.",
            },
          ]);
          toast.error(err.slice(0, 120) || "Network error");
          return;
        }
        const text = await res.text();
        setMsgs((m) => [...m, { role: "assistant", content: text || "…" }]);
      } catch (e) {
        setMsgs((m) => [
          ...m,
          {
            role: "assistant",
            content:
              "Something tore in the wire. Try again, or message the studio on Instagram.",
          },
        ]);
        toast.error(String(e).slice(0, 120));
      } finally {
        setLoading(false);
      }
    },
    [loading, msgs, toast]
  );

  const send = useCallback(() => sendText(input), [input, sendText]);

  const speakLast = useCallback(async () => {
    const last = [...msgs].reverse().find((m) => m.role === "assistant");
    if (!last?.content || speaking) return;
    setSpeaking(true);
    try {
      const snippet = last.content.slice(0, 1200);
      const res = await fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: `<breath/>${snippet}`,
          voice_id: "eve",
        }),
      });
      if (!res.ok) throw new Error(await res.text());
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      if (audioRef.current) audioRef.current.pause();
      const a = new Audio(url);
      audioRef.current = a;
      a.onended = () => {
        URL.revokeObjectURL(url);
        setSpeaking(false);
      };
      a.onerror = () => setSpeaking(false);
      await a.play();
    } catch {
      setSpeaking(false);
      toast.error("Voice playback unavailable.");
    }
  }, [msgs, speaking, toast]);

  function reset() {
    setMsgs([GREETING]);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
  }

  const showSuggestions = msgs.length === 1 && msgs[0].role === "assistant";

  return (
    <>
      <button
        ref={openerRef}
        type="button"
        onClick={() => setOpen(true)}
        className="fixed z-[80] flex h-12 w-12 items-center justify-center rounded-full border border-blood/50 bg-char text-blood shadow-[0_0_40px_rgba(163,18,31,0.25)] transition hover:bg-blood hover:text-bandage active:scale-95 sm:h-14 sm:w-14"
        style={{
          right: "calc(env(safe-area-inset-right) + 1rem)",
          bottom: "calc(env(safe-area-inset-bottom) + 1rem)",
        }}
        aria-label="Open concierge chat"
      >
        <MessageCircle className="h-5 w-5 sm:h-6 sm:w-6" />
      </button>

      {open ? (
        <div
          className="fixed inset-0 z-[85] flex items-end justify-center bg-ink/80 backdrop-blur-sm sm:items-center sm:p-6 md:p-8"
          role="dialog"
          aria-modal="true"
          aria-label="Concierge"
          onClick={(e) => {
            if (e.target === e.currentTarget) setOpen(false);
          }}
        >
          <div
            className="mbb-rise-in flex h-[100dvh] w-full max-w-md flex-col border-0 bg-char shadow-2xl sm:h-[min(620px,85dvh)] sm:border sm:border-bone/15"
            style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
          >
            <div
              className="flex items-center justify-between border-b border-bone/10 px-4 py-3"
              style={{ paddingTop: "calc(env(safe-area-inset-top) + 0.75rem)" }}
            >
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-blood">
                  Concierge
                </p>
                <p className="font-serif text-lg text-bandage">Ask the studio</p>
              </div>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={reset}
                  className="p-2 text-bone/60 hover:text-blood"
                  aria-label="Clear conversation"
                  title="Clear conversation"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
                <button
                  ref={closeBtnRef}
                  type="button"
                  onClick={() => setOpen(false)}
                  className="-mr-2 p-2 text-bone hover:text-blood"
                  aria-label="Close"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
            <div
              ref={listRef}
              className="flex-1 space-y-3 overflow-y-auto px-4 py-4 text-sm"
              aria-live="polite"
              aria-busy={loading}
            >
              {msgs.map((m, i) => (
                <div
                  key={i}
                  className={cn(
                    "max-w-[85%] whitespace-pre-wrap break-words rounded-sm px-3 py-2 leading-relaxed",
                    m.role === "user"
                      ? "ml-auto bg-blood/20 text-bone"
                      : "mbb-fade-in mr-auto border border-bone/10 bg-ink/60 text-bone/90"
                  )}
                >
                  {m.content}
                </div>
              ))}
              {loading ? (
                <div className="mr-auto inline-flex items-center gap-1.5 border border-bone/10 bg-ink/60 px-3 py-2">
                  <Dot delay="0ms" />
                  <Dot delay="150ms" />
                  <Dot delay="300ms" />
                </div>
              ) : null}
              {showSuggestions && !loading ? (
                <div className="mt-4 flex flex-wrap gap-2">
                  {SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => void sendText(s)}
                      className="border border-bone/15 bg-ink/40 px-3 py-2 text-left text-xs leading-relaxed text-bone/80 transition hover:border-blood/50 hover:text-bandage"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              ) : null}
            </div>
            <div className="border-t border-bone/10 p-3">
              <div className="flex gap-2">
                <Input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about booking, aftercare, tour…"
                  enterKeyHint="send"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      void send();
                    }
                  }}
                  className="flex-1"
                />
                <Button
                  type="button"
                  size="icon"
                  onClick={() => void send()}
                  disabled={loading || !input.trim()}
                  aria-label="Send"
                >
                  <Send className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  onClick={() => void speakLast()}
                  disabled={speaking}
                  aria-pressed={speaking}
                  title="Speak last reply"
                  aria-label={speaking ? "Speaking" : "Speak last reply"}
                >
                  <Mic className={cn("h-4 w-4", speaking && "text-blood")} />
                </Button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

function Dot({ delay }: { delay: string }) {
  return (
    <span
      aria-hidden
      className="mbb-typing-dot inline-block h-1.5 w-1.5 rounded-full bg-blood"
      style={{ animationDelay: delay }}
    />
  );
}
