"use client";

import { useCallback, useRef, useState } from "react";
import { MessageCircle, Mic, Send, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type Msg = { role: "user" | "assistant"; content: string };

export function Concierge() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [msgs, setMsgs] = useState<Msg[]>([
    {
      role: "assistant",
      content:
        "Speak your will. I can check slots, walk you through Saniderm, rough-quote a piece, or send you to the booking rite.",
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const send = useCallback(async () => {
    const t = input.trim();
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
          messages: [
            ...next.map((m) => ({ role: m.role, content: m.content })),
          ],
        }),
      });
      if (!res.ok) {
        const err = await res.text();
        setMsgs((m) => [
          ...m,
          { role: "assistant", content: `The veil stayed closed: ${err}` },
        ]);
        return;
      }
      const text = await res.text();
      setMsgs((m) => [...m, { role: "assistant", content: text || "…" }]);
    } catch (e) {
      setMsgs((m) => [
        ...m,
        {
          role: "assistant",
          content: `Something tore in the wire: ${String(e)}`,
        },
      ]);
    } finally {
      setLoading(false);
    }
  }, [input, loading, msgs]);

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
      if (!res.ok) {
        throw new Error(await res.text());
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      if (audioRef.current) {
        audioRef.current.pause();
      }
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
    }
  }, [msgs, speaking]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-[80] flex h-14 w-14 items-center justify-center rounded-full border border-blood/50 bg-char text-blood shadow-[0_0_40px_rgba(163,18,31,0.25)] transition hover:bg-blood hover:text-bandage md:bottom-8 md:right-8"
        aria-label="Open concierge chat"
      >
        <MessageCircle className="h-6 w-6" />
      </button>

      {open ? (
        <div
          className="fixed inset-0 z-[85] flex items-end justify-end bg-ink/70 p-4 backdrop-blur-sm md:items-center md:p-8"
          role="dialog"
          aria-modal="true"
          aria-label="Concierge"
        >
          <div className="flex h-[min(560px,85vh)] w-full max-w-md flex-col border border-bone/15 bg-char shadow-2xl">
            <div className="flex items-center justify-between border-b border-bone/10 px-4 py-3">
              <p className="font-display text-lg text-bandage">Concierge</p>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="p-2 text-bone hover:text-blood"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4 text-sm">
              {msgs.map((m, i) => (
                <div
                  key={i}
                  className={cn(
                    "max-w-[90%] rounded-sm px-3 py-2",
                    m.role === "user"
                      ? "ml-auto bg-blood/20 text-bone"
                      : "mr-auto border border-bone/10 bg-ink/60 text-bone/90"
                  )}
                >
                  {m.content}
                </div>
              ))}
              {loading ? (
                <p className="text-xs text-muted">Invoking the veil…</p>
              ) : null}
            </div>
            <div className="border-t border-bone/10 p-3">
              <div className="flex gap-2">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about booking, aftercare, tour…"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") void send();
                  }}
                  className="flex-1"
                />
                <Button type="button" size="icon" onClick={() => void send()}>
                  <Send className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  onClick={() => void speakLast()}
                  disabled={speaking}
                  title="Speak last reply (xAI TTS)"
                >
                  <Mic className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
