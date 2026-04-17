"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
export function FlashClaim({
  flashId,
  title,
}: {
  flashId: string;
  title: string;
}) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  async function claim() {
    setLoading(true);
    setMsg(null);
    try {
      const res = await fetch("/api/flash/claim", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ flashId, clientEmail: email, clientName: name }),
      });
      const data = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok) setMsg(data.error ?? "Request failed");
      else setMsg("Hold placed for 15 minutes. Complete Square deposit when live.");
    } catch {
      setMsg("Network error");
    } finally {
      setLoading(false);
    }
  }

  const squareReady =
    typeof process.env.NEXT_PUBLIC_SQUARE_APPLICATION_ID === "string" &&
    process.env.NEXT_PUBLIC_SQUARE_APPLICATION_ID.length > 0 &&
    process.env.NEXT_PUBLIC_SQUARE_APPLICATION_ID !== "placeholder";
  const showSquareNote = !squareReady;

  return (
    <div className="mt-10 space-y-4 border border-bone/10 bg-ink/40 p-6">
      <p className="text-xs uppercase tracking-widest text-blood">
        Claim — {title}
      </p>
      <div>
        <Label htmlFor="nm">Name</Label>
        <Input
          id="nm"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1"
        />
      </div>
      <div>
        <Label htmlFor="em">Email</Label>
        <Input
          id="em"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1"
        />
      </div>
      {showSquareNote ? (
        <p className="text-xs text-muted">
          Square sandbox keys are placeholders — claim API still records intent
          when database is configured.
        </p>
      ) : null}
      <Button type="button" disabled={loading} onClick={() => void claim()}>
        {loading ? "Sealing…" : "Place 15-min hold"}
      </Button>
      {msg ? <p className="text-sm text-bone/80">{msg}</p> : null}
    </div>
  );
}
